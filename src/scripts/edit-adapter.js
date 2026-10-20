/**
 * Edit-mode adapter for EmDash's on-page editing. Loaded only for logged-in editors in edit mode
 * (see BaseLayout.astro); visitors never get it.
 *
 * EmDash's toolbar and inline rich-text editor save one top-level field at a time:
 *   PUT /_emdash/api/content/<collection>/<id>  { data: { <field>: value } }
 * Page sections live inside one `sections` field, so text inside a section is annotated with a path
 * (`sections.<blockKey>.title`, `sections.<blockKey>.steps.2.text`). This adapter wraps fetch to:
 *   1. tell the toolbar what kind of field each path is (manifest),
 *   2. show the current value of a path (content GET, used by the photo picker),
 *   3. turn a save of a path into a save of its whole top-level field (read, change, write with _rev),
 *   4. make Publish publish every entry on the page with unpublished changes (page, site-wide content, services),
 *   5. show "Unpublished changes" on load when any of those entries has a draft.
 * If anything here fails, the toolbar falls back to its normal behaviour (a click opens the admin form).
 */
(function () {
  if (window.__wbdsEditAdapter) return;
  window.__wbdsEditAdapter = true;

  var nativeFetch = window.fetch.bind(window);
  var CONTENT = /^\/_emdash\/api\/content\/([^/?]+)\/([^/?]+)$/;
  var PUBLISH = /^\/_emdash\/api\/visual-editing\/content\/([^/?]+)\/([^/?]+)\/publish$/;
  var MANIFEST = /^\/_emdash\/api\/manifest$/;

  function call(url, init) {
    init = init || {};
    init.credentials = "same-origin";
    init.headers = Object.assign({ "X-EmDash-Request": "1" }, init.headers || {});
    return nativeFetch(url, init);
  }

  function annotations() {
    var out = [];
    document.querySelectorAll("[data-emdash-ref]").forEach(function (el) {
      try {
        var ref = JSON.parse(el.getAttribute("data-emdash-ref"));
        ref.kind = el.getAttribute("data-edit-kind") || "string";
        out.push(ref);
      } catch (e) {}
    });
    return out;
  }

  function entriesOnPage() {
    var seen = {};
    return annotations().filter(function (r) {
      var k = r.collection + "/" + r.id;
      if (seen[k]) return false;
      return (seen[k] = true);
    });
  }

  var isPath = function (field) { return typeof field === "string" && field.indexOf(".") > 0; };

  // A path segment selects an array item by its _key, else by index; or an object property.
  function child(value, seg) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) if (value[i] && value[i]._key === seg) return { i: i };
      return /^\d+$/.test(seg) && +seg < value.length ? { i: +seg } : null;
    }
    return value && typeof value === "object" ? { k: seg } : null;
  }

  function getPath(data, path) {
    var segs = path.split("."), value = data;
    for (var n = 0; n < segs.length; n++) {
      var c = child(value, segs[n]);
      if (!c) return undefined;
      value = c.i !== undefined ? value[c.i] : value[c.k];
    }
    return value;
  }

  // Returns a copy of `root` with the value at `segs` replaced. Throws when the item no longer exists.
  function setPath(root, segs, value) {
    if (!segs.length) return value;
    var c = child(root, segs[0]);
    if (!c) throw new Error("This section changed since the page loaded. Reload the page and try again.");
    if (c.i !== undefined) {
      var arr = root.slice();
      arr[c.i] = setPath(arr[c.i], segs.slice(1), value);
      return arr;
    }
    var obj = Object.assign({}, root);
    obj[c.k] = segs.length === 1 ? value : setPath(obj[c.k] == null ? {} : obj[c.k], segs.slice(1), value);
    return obj;
  }

  // One save at a time per entry, so two quick edits can't overwrite each other.
  var queues = {};
  function serially(key, task) {
    var run = (queues[key] || Promise.resolve()).then(task, task);
    queues[key] = run.catch(function () {});
    return run;
  }

  function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), { status: status, headers: { "Content-Type": "application/json" } });
  }

  function savePaths(url, collection, id, body) {
    return serially(collection + "/" + id, function () {
      return call(url).then(function (res) {
        if (!res.ok) return res;
        return res.json().then(function (current) {
          var data = current.data.item.data || {};
          var update = {};
          Object.keys(body.data).forEach(function (field) {
            if (!isPath(field)) return (update[field] = body.data[field]);
            var segs = field.split(".");
            var top = segs[0];
            var base = top in update ? update[top] : data[top];
            update[top] = setPath(base, segs.slice(1), body.data[field]);
          });
          var next = Object.assign({}, body, { data: update });
          if (current.data._rev) next._rev = current.data._rev;
          return call(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
        });
      }).catch(function (err) {
        console.error("[edit] save failed:", err);
        return jsonResponse(409, { success: false, error: { code: "CONFLICT", message: String(err.message || err) } });
      });
    });
  }

  function hasDraft(collection, id) {
    return call("/_emdash/api/content/" + collection + "/" + id)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (body) {
        var item = body && body.data && body.data.item;
        return !!(item && item.draftRevisionId && item.draftRevisionId !== item.liveRevisionId);
      })
      .catch(function () { return false; });
  }

  // Publish: also publish every other entry on this page that has unpublished changes.
  function publishAll(url, init, collection, id) {
    var token = (init.headers && (init.headers["X-EmDash-Visual-Action"] || init.headers["x-emdash-visual-action"])) || "";
    var others = entriesOnPage().filter(function (r) { return !(r.collection === collection && r.id === id); });
    return Promise.all(others.map(function (r) { return hasDraft(r.collection, r.id).then(function (d) { return d ? r : null; }); }))
      .then(function (drafts) {
        drafts = drafts.filter(Boolean);
        return drafts.reduce(function (done, r) {
          return done.then(function () {
            return call("/_emdash/api/visual-editing/content/" + r.collection + "/" + r.id + "/publish", { method: "POST", headers: { "X-EmDash-Visual-Action": token } })
              .then(function (res) { if (!res.ok) console.error("[edit] publish failed for", r.collection, r.id, res.status); });
          });
        }, Promise.resolve()).then(function () {
          return hasDraft(collection, id).then(function (own) {
            // Nothing of its own to publish (only other entries changed): report success without a no-op publish.
            if (!own && drafts.length) return jsonResponse(200, { success: true, data: {} });
            return nativeFetch(url, init);
          });
        });
      });
  }

  window.fetch = function (input, init) {
    try {
      var url = typeof input === "string" ? input : input && input.url;
      var path = new URL(url, location.href).pathname;
      var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
      var m;

      if (method === "GET" && MANIFEST.test(path)) {
        return nativeFetch(input, init).then(function (res) {
          if (!res.ok) return res;
          return res.json().then(function (body) {
            var manifest = body && body.data ? body.data : body;
            annotations().forEach(function (r) {
              var col = manifest.collections && manifest.collections[r.collection];
              if (col && col.fields && isPath(r.field)) col.fields[r.field] = { kind: r.kind, label: r.field };
            });
            return jsonResponse(res.status, body);
          });
        });
      }

      if ((m = path.match(CONTENT))) {
        var collection = decodeURIComponent(m[1]), id = decodeURIComponent(m[2]);
        if (method === "GET") {
          return nativeFetch(input, init).then(function (res) {
            if (!res.ok) return res;
            return res.json().then(function (body) {
              var data = body && body.data && body.data.item && body.data.item.data;
              if (data) annotations().forEach(function (r) {
                if (r.collection === collection && r.id === id && isPath(r.field)) data[r.field] = getPath(data, r.field);
              });
              return jsonResponse(res.status, body);
            });
          });
        }
        if (method === "PUT" && init && typeof init.body === "string") {
          var body = JSON.parse(init.body);
          if (body && body.data && Object.keys(body.data).some(isPath)) return savePaths(url, collection, id, body);
          return serially(collection + "/" + id, function () { return nativeFetch(input, init); });
        }
      }

      if (method === "POST" && (m = path.match(PUBLISH))) {
        return publishAll(url, init || {}, decodeURIComponent(m[1]), decodeURIComponent(m[2]));
      }
    } catch (err) {
      console.error("[edit] adapter:", err);
    }
    return nativeFetch(input, init);
  };

  // On load: if anything on this page has unpublished changes, show them on the toolbar's Publish button.
  window.addEventListener("load", function () {
    var first = document.querySelector("[data-emdash-ref]");
    if (!first) return;
    var main;
    try { main = JSON.parse(first.getAttribute("data-emdash-ref")); } catch (e) { return; }
    if (!main.status || main.hasDraft) return;
    var others = entriesOnPage().filter(function (r) { return !(r.collection === main.collection && r.id === main.id); });
    Promise.all(others.map(function (r) { return hasDraft(r.collection, r.id); })).then(function (flags) {
      if (flags.some(Boolean)) {
        document.dispatchEvent(new CustomEvent("emdash:content-changed", { detail: { collection: main.collection, id: main.id } }));
      }
    });
  });
})();
