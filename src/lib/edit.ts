/**
 * On-page editing attributes (EmDash visual editing).
 *
 * EmDash's edit toolbar edits any element carrying `data-emdash-ref` = {collection, id, field}. It only saves
 * top-level fields, so for text inside a page section (`sections.<key>.title`) or a list item (`socials.0.url`)
 * public/edit-adapter.js translates the save into an update of the whole field. `data-edit-kind` tells the
 * toolbar how to edit the element (text in place, photo picker, rich-text editor).
 *
 * Outside edit mode every helper returns {} / plain values, so visitors get clean HTML.
 */
import type { EditAttrs } from "../data/types";

export type EditKind = "string" | "text" | "image" | "portableText";
export interface EntryRef { collection: string; id: string; status?: string; hasDraft?: boolean }

/** The {collection, id, status, hasDraft} EmDash puts on an entry's `edit` proxy in edit mode, else null */
export function entryRef(entry: { edit?: unknown } | null | undefined): EntryRef | null {
  const raw = (entry?.edit as Record<string, unknown> | undefined)?.["data-emdash-ref"];
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as EntryRef;
  } catch {
    return null;
  }
}

/** Builds editing attributes for fields of one entry, optionally below a path (`sections.<key>`). */
export class Edit {
  constructor(readonly ref: EntryRef | null, readonly base = "") {}

  get on() {
    return this.ref !== null;
  }

  path(field: string) {
    return this.base ? `${this.base}.${field}` : field;
  }

  /** Attributes for an element showing `field` */
  attrs(field: string, kind: EditKind = "string"): EditAttrs {
    if (!this.ref) return {};
    const { collection, id } = this.ref;
    return { "data-emdash-ref": JSON.stringify({ collection, id, field: this.path(field) }), "data-edit-kind": kind };
  }

  image(field: string) {
    return this.attrs(field, "image");
  }

  /** Editor for a nested object: a section (`sections.<key>`) or a list item (`cards.2`) */
  at(field: string | number) {
    return new Edit(this.ref, this.path(String(field)));
  }

  /** Entry-level attributes (status + unpublished changes), read by the toolbar's Publish button */
  entry(hasDraft = this.ref?.hasDraft): EditAttrs {
    if (!this.ref) return {};
    const { collection, id, status } = this.ref;
    return { "data-emdash-ref": JSON.stringify({ collection, id, status: status ?? "published", ...(hasDraft ? { hasDraft: true } : {}) }) };
  }
}

export const noEdit = new Edit(null);
