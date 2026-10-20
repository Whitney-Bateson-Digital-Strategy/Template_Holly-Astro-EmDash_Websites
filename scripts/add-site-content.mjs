/**
 * Adds the editable pages to a site that was set up before they existed.
 *
 * New sites get everything from .emdash/seed.json in the setup wizard. Seeds only apply to a fresh database, so for
 * an existing site this script copies what's missing from the seed over the EmDash API: the page block types, the
 * Pages / Services / Site-wide content collections and their fields, the menus, and their starting content.
 * It only ever ADDS what's missing: existing block types, collections, fields, menus and entries are never changed.
 * Posts and testimonials are left alone (no sample posts are added).
 *
 * A site that used the earlier single "Homepage" entry keeps its edits: they're copied into the new Home page.
 *
 *   EMDASH_TOKEN=ec_pat_... node scripts/add-site-content.mjs https://your-site.workers.dev
 *   node scripts/add-site-content.mjs http://localhost:4321          (local dev, no token needed)
 *   add --dry-run to see what would be added
 *
 * Token: admin → Settings → API Tokens, as an Admin, with the "schema:read", "schema:write", "content:read"
 * and "content:write" scopes (or "admin"). Also runs from GitHub: Actions → "Add editable site content".
 */
import { readFile } from "node:fs/promises";
import { EmDashClient } from "emdash/client";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const url = args.find((a) => !a.startsWith("--")) ?? process.env.EMDASH_URL;
if (!url) {
  console.error("Usage: node scripts/add-site-content.mjs <site url> [--dry-run]");
  process.exit(1);
}
const token = process.env.EMDASH_TOKEN;
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url);
if (!token && !isLocal) {
  console.error("Set EMDASH_TOKEN (admin → Settings → API Tokens) to update a deployed site.");
  process.exit(1);
}

const seed = JSON.parse(await readFile(new URL("../.emdash/seed.json", import.meta.url), "utf8"));
const client = new EmDashClient({ baseUrl: url, token, devBypass: !token && isLocal });
const log = (msg) => console.log(`${dryRun ? "[dry run] " : ""}${msg}`);
const COLLECTIONS = ["pages", "services", "site"];

// 1. Page block types
const haveTypes = new Set((await client.blockTypes()).map((t) => t.slug));
for (const bt of seed.blockTypes) {
  if (haveTypes.has(bt.slug)) continue;
  log(`Adding block type "${bt.label}"`);
  const { slug, label, description, category } = bt;
  if (!dryRun) await client.createBlockType({ slug, label, description, category, fields: bt.versions.at(-1).fields });
}

// 2. Collections and their fields
const haveCollections = new Set((await client.collections()).map((c) => c.slug));
for (const def of seed.collections.filter((c) => COLLECTIONS.includes(c.slug))) {
  const exists = haveCollections.has(def.slug);
  if (!exists) {
    log(`Adding collection "${def.label}"`);
    const { fields, ...collection } = def;
    if (!dryRun) await client.createCollection(collection);
  }
  const haveFields = exists ? new Set((await client.collection(def.slug)).fields.map((f) => f.slug)) : new Set();
  const missing = def.fields.filter((f) => !haveFields.has(f.slug));
  if (exists && missing.length) log(`Adding ${missing.length} field(s) to "${def.label}"`);
  if (!dryRun) for (const field of missing) await client.createField(def.slug, { ...field, sortOrder: def.fields.indexOf(field) });
}

// 3. Menus
const menus = await client.request("GET", "/menus");
const haveMenus = new Set((Array.isArray(menus) ? menus : menus.items ?? []).map((m) => m.name));
async function addItems(menu, items, parentId) {
  for (const [i, item] of items.entries()) {
    const created = await client.request("POST", `/menus/${menu}/items`, {
      type: "custom", label: item.label, customUrl: item.url, sortOrder: i, ...(parentId ? { parentId } : {}),
    });
    if (item.children?.length) await addItems(menu, item.children, created.id ?? created.item?.id);
  }
}
for (const menu of seed.menus) {
  if (haveMenus.has(menu.name)) continue;
  log(`Adding menu "${menu.label}"`);
  if (!dryRun) {
    await client.request("POST", "/menus", { name: menu.name, label: menu.label });
    await addItems(menu.name, menu.items);
  }
}

// 4. Starting content (only entries that don't exist yet)
const legacy = await legacyHomepage();
for (const collection of COLLECTIONS) {
  const have = haveCollections.has(collection) ? new Set((await client.list(collection, { limit: 100 })).items.map((e) => e.slug)) : new Set();
  for (const entry of seed.content[collection] ?? []) {
    if (have.has(entry.slug)) continue;
    let data = structuredClone(entry.data);
    if (legacy && collection === "pages" && entry.slug === "home") data = withLegacyHome(data, legacy);
    if (legacy && collection === "services") data = withLegacyService(data, legacy, (seed.content.services ?? []).indexOf(entry) + 1);
    log(`Adding ${collection} entry "${entry.slug}"${legacy && (entry.slug === "home" || collection === "services") ? " (with your earlier homepage edits)" : ""}`);
    if (!dryRun) {
      const item = await client.create(collection, { slug: entry.slug, data });
      await client.publish(collection, item.id);
    }
  }
}
if (haveCollections.has("homepage")) {
  log('Note: the old "Homepage" content type is no longer used. Once the new Home page looks right, an admin can delete it under Content Types.');
}
log("Done.");

// ---------- earlier "Homepage" entry → new Home page ----------
async function legacyHomepage() {
  if (!haveCollections.has("homepage")) return null;
  try {
    const { items } = await client.list("homepage", { limit: 5 });
    const home = items.find((e) => e.slug === "home");
    return home ? (await client.get("homepage", home.id, { raw: true })).data : null;
  } catch {
    return null;
  }
}

function para(text) {
  return String(text).split(/\n{2,}/).map((t, i) => ({ _type: "block", _key: `l${i}${Math.random().toString(36).slice(2, 7)}`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `s${i}`, text: t, marks: [] }] }));
}
function bullets(texts) {
  return texts.map((t, i) => ({ _type: "block", _key: `lb${i}${Math.random().toString(36).slice(2, 7)}`, style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [{ _type: "span", _key: `s${i}`, text: t, marks: [] }] }));
}
/** Copies `old[from]` to `target[to]` when the old site has a value (text fields become rich text when `rich`) */
function copy(target, old, map) {
  for (const [to, from, rich] of map) {
    const v = old[from];
    if (v === null || v === undefined) continue;
    target[to] = rich && typeof v === "string" ? para(v) : v;
  }
}
function withLegacyHome(data, old) {
  const by = (type) => data.sections.find((s) => s._type === type);
  copy(by("hero") ?? {}, old, [["image", "hero_image"], ["headline", "hero_headline"], ["highlight", "hero_highlight"], ["text", "hero_text", true], ["button_label", "hero_button_label"], ["button_link", "hero_button_link"]]);
  copy(by("intro") ?? {}, old, [["title", "intro_title"], ["subtitle_start", "intro_subtitle_start"], ["subtitle_highlight", "intro_subtitle_highlight"], ["subtitle_end", "intro_subtitle_end"], ["text", "intro_text", true]]);
  copy(by("service_rows") ?? {}, old, [["eyebrow", "services_eyebrow"], ["title", "services_title"], ["button_prefix", "services_button_prefix"]]);
  copy(by("testimonials") ?? {}, old, [["label", "testimonials_label"]]);
  copy(by("newsletter") ?? {}, old, [["eyebrow", "newsletter_eyebrow"], ["title", "newsletter_title"], ["text", "newsletter_text", true], ["fineprint", "newsletter_fineprint"], ["button_label", "newsletter_button"]]);
  copy(by("split") ?? {}, old, [["image", "about_image"], ["eyebrow", "about_eyebrow"], ["title", "about_title"], ["subtitle", "about_subtitle"], ["text", "about_text", true], ["button_label", "about_button_label"], ["button_link", "about_button_link"]]);
  const steps = by("steps");
  if (steps) {
    copy(steps, old, [["eyebrow", "process_eyebrow"], ["title", "process_title"], ["button_label", "process_button_label"], ["button_link", "process_button_link"]]);
    (steps.steps ?? []).forEach((s, i) => copy(s, old, [["label", `step_${i + 1}_label`], ["title", `step_${i + 1}_title`], ["text", `step_${i + 1}_text`]]));
  }
  copy(by("latest_posts") ?? {}, old, [["title", "blog_title"], ["link_label", "blog_link_label"]]);
  copy(data, old, [["seo_title", "seo_title"], ["seo_description", "seo_description"]]);
  return data;
}
function withLegacyService(data, old, n) {
  const p = `service_${n}_`;
  copy(data, old, [["home_image", `${p}image`], ["eyebrow", `${p}eyebrow`], ["title", `${p}title`], ["summary", `${p}summary`], ["description", `${p}text`, true]]);
  const list = [1, 2, 3, 4].map((j) => old[`${p}bullet_${j}`]).filter((b) => typeof b === "string" && b);
  if (list.length) data.highlights = bullets(list);
  return data;
}
