/**
 * All EmDash reads go through this file, so components never talk to the CMS directly.
 * Content the site can't find in EmDash falls back to the starting content in .emdash/seed.json.
 */
import { getCollectionInfo, getEmDashCollection, getEmDashEntry, getEntryTerms, getEntriesByTerm, getMenu, getTaxonomyTerms, search } from "emdash";
import seed from "../../.emdash/seed.json";
import { Edit, entryRef, noEdit } from "./edit";
import type { EditAttrs, Testimonial } from "../data/types";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date?: Date;
  image?: unknown; // EmDash media value, rendered with <Image> from emdash/ui
  content?: unknown; // Portable Text, rendered with <PortableText> from emdash/ui
  showDate: boolean; // "Show published date" checkbox (missing = shown)
  showCategories: boolean; // "Show categories" checkbox (missing = shown)
}

type Row = Record<string, unknown>;

function toPost(entry: { id: string; data: Row }): Post {
  const d = entry.data;
  const rawDate = (d.published_at ?? d.publishedAt ?? d.created_at ?? d.createdAt) as string | Date | undefined;
  return {
    id: String(d.id ?? entry.id), // EmDash content ID (ULID), used for categories
    slug: String(d.slug ?? entry.id),
    title: String(d.title ?? "Untitled"),
    excerpt: String(d.excerpt ?? ""),
    date: rawDate ? new Date(rawDate) : undefined,
    image: d.featured_image ?? undefined,
    content: d.content,
    showDate: d.show_date !== false,
    showCategories: d.show_categories !== false,
  };
}

export async function getPosts(limit?: number): Promise<Post[]> {
  const { entries, error } = await getEmDashCollection("posts", {
    status: "published",
    orderBy: { published_at: "desc" },
    ...(limit ? { limit } : {}),
  });
  if (error) {
    console.error("[cms] posts:", error);
    return [];
  }
  return entries.map((e) => toPost(e as unknown as { id: string; data: Row }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const { entry, error } = await getEmDashEntry("posts", slug);
  if (error) console.error("[cms] post:", error);
  return entry ? toPost(entry as unknown as { id: string; data: Row }) : null;
}

/** Testimonials from EmDash; falls back to the seed's testimonials if the collection is empty or missing. */
const fallbackTestimonials = (): Testimonial[] =>
  ((seed as { content: Record<string, { data: Row }[]> }).content.testimonials ?? []).map(({ data: d }) => ({
    label: String(d.label ?? "Client Successes"), headline: String(d.title ?? ""), quote: String(d.quote ?? ""), name: String(d.name ?? ""),
  }));

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { entries, error } = await getEmDashCollection("testimonials", { status: "published", orderBy: { order: "asc" } });
    if (error || !entries.length) return fallbackTestimonials();
    return entries.map(({ data, edit }) => {
      const d = data as unknown as Row;
      const e = edit as unknown as Record<string, EditAttrs | undefined>;
      return {
        label: String(d.label ?? "Client Successes"),
        headline: String(d.title ?? ""),
        quote: String(d.quote ?? ""),
        name: String(d.name ?? ""),
        // on-page editing attributes (empty unless a logged-in editor is in edit mode)
        edit: { label: e.label ?? {}, headline: e.title ?? {}, quote: e.quote ?? {}, name: e.name ?? {} },
      };
    });
  } catch {
    return fallbackTestimonials();
  }
}

// ---------- Pages, services, site-wide content, menus ----------
// Each falls back to the starting content in .emdash/seed.json when the site doesn't have it yet
// (set up before these existed), so pages always render. scripts/add-site-content.mjs adds them.

type SeedEntry = { slug?: string; data: Row };
const seedContent = (seed as { content: Record<string, SeedEntry[]> }).content;
const seedMenus = (seed as { menus: { name: string; label: string; items: SeedMenuItem[] }[] }).menus;
type SeedMenuItem = { label: string; url: string; children?: SeedMenuItem[] };

export interface Entry {
  data: Row;
  /** Editing attributes for this entry's fields ({} for visitors) */
  edit: Edit;
}

const fromSeed = (collection: string, slug: string): Entry | null => {
  const e = seedContent[collection]?.find((c) => c.slug === slug);
  return e ? { data: e.data, edit: noEdit } : null;
};
const toEntry = (e: { data: unknown; edit?: unknown }): Entry => ({ data: e.data as Row, edit: new Edit(entryRef(e)) });

/** A page by slug ("home" = the home page). null = no such page (404). */
export async function getPage(slug: string): Promise<Entry | null> {
  try {
    // Only fall back to the seed when the site has no Pages collection yet; otherwise a missing page is a 404
    if (!(await getCollectionInfo("pages"))) return fromSeed("pages", slug);
    const { entry, error } = await getEmDashEntry("pages", slug);
    if (error) console.error("[cms] page:", error);
    return entry ? toEntry(entry) : null;
  } catch (err) {
    console.error("[cms] page:", err);
    return fromSeed("pages", slug);
  }
}

/** The single "site" entry: name, logo, announcement bar, free guide band, footer, social links. */
export async function getSite(): Promise<Entry> {
  try {
    const { entry } = await getEmDashEntry("site", "site");
    if (entry) return toEntry(entry);
  } catch (err) {
    console.error("[cms] site:", err);
  }
  return fromSeed("site", "site")!;
}

export interface Service extends Entry { slug: string }

/** Services, in their sort order */
export async function getServices(): Promise<Service[]> {
  try {
    if (await getCollectionInfo("services")) {
      const { entries, error } = await getEmDashCollection("services", { status: "published", orderBy: { order: "asc" } });
      if (!error) return entries.map((e) => ({ ...toEntry(e), slug: String((e.data as Row).slug ?? e.id) }));
    }
  } catch (err) {
    console.error("[cms] services:", err);
  }
  return (seedContent.services ?? []).map((e) => ({ data: e.data, edit: noEdit, slug: e.slug! }));
}

export interface MenuLink { label: string; href: string; children: MenuLink[] }

/** A menu from admin → Menus: primary (header), footer-1 / footer-2 (footer columns), legal (footer bar) */
export async function getMenuLinks(name: string): Promise<{ label: string; items: MenuLink[] }> {
  const fromItems = (items: { label: string; url: string; children?: unknown[] }[]): MenuLink[] =>
    items.map((i) => ({ label: i.label, href: i.url, children: fromItems((i.children ?? []) as typeof items) }));
  try {
    const menu = await getMenu(name);
    if (menu) return { label: menu.label, items: fromItems(menu.items) };
  } catch (err) {
    console.error(`[cms] menu ${name}:`, err);
  }
  const m = seedMenus.find((x) => x.name === name);
  return { label: m?.label ?? "", items: fromItems(m?.items ?? []) };
}

export interface Category { name: string; slug: string; count?: number }

/** Blog categories (EmDash "category" taxonomy). */
export async function getCategories(): Promise<Category[]> {
  try {
    const terms = await getTaxonomyTerms("category");
    return terms.map((t) => ({ name: t.label || t.name, slug: t.slug, count: t.count }));
  } catch (e) {
    console.error("[cms] categories:", e);
    return [];
  }
}

/** Blog tags (EmDash "tag" taxonomy). */
export async function getTags(): Promise<Category[]> {
  try {
    const terms = await getTaxonomyTerms("tag");
    return terms.map((t) => ({ name: t.label || t.name, slug: t.slug, count: t.count }));
  } catch {
    return [];
  }
}

export interface Archive { key: string; label: string; count: number }

/** Post counts grouped by month ("2026-10") or year ("2026"), newest first. */
export async function getArchives(type: "monthly" | "yearly" = "monthly", limit = 12): Promise<Archive[]> {
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const groups = new Map<string, Archive>();
  for (const p of await getPosts()) {
    if (!p.date || isNaN(p.date.getTime())) continue;
    const key = archiveKey(p.date, type);
    const g = groups.get(key) ?? { key, label: type === "yearly" ? key : fmt.format(p.date), count: 0 };
    g.count++;
    groups.set(key, g);
  }
  return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key)).slice(0, limit);
}

function archiveKey(d: Date, type: "monthly" | "yearly") {
  const y = String(d.getUTCFullYear());
  return type === "yearly" ? y : `${y}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Categories assigned to one post. */
export async function getPostCategories(postId: string): Promise<Category[]> {
  try {
    const terms = await getEntryTerms("posts", postId, "category");
    return terms.map((t) => ({ name: t.label || t.name, slug: t.slug }));
  } catch {
    return [];
  }
}

/** Posts filtered by category slug, tag slug, date ("2026" or "2026-10") and/or search text. No filter = all published posts, newest first. */
export async function findPosts({ category, tag, date, q }: { category?: string; tag?: string; date?: string; q?: string } = {}): Promise<Post[]> {
  let posts = await getPosts();
  for (const [taxonomy, term] of [["category", category], ["tag", tag]] as const) {
    if (!term) continue;
    try {
      // entries may be keyed by slug or content ID depending on the EmDash API, so match either
      const keys = new Set(
        (await getEntriesByTerm("posts", taxonomy, term)).flatMap((e) => [e.id, String(e.data?.id ?? ""), String(e.data?.slug ?? "")]),
      );
      posts = posts.filter((p) => keys.has(p.id) || keys.has(p.slug));
    } catch (e) {
      console.error(`[cms] ${taxonomy} filter:`, e);
    }
  }
  if (date && /^\d{4}(-\d{2})?$/.test(date)) {
    const type = date.length === 4 ? "yearly" : "monthly";
    posts = posts.filter((p) => p.date && archiveKey(p.date, type) === date);
  }
  if (q && q.trim()) {
    try {
      const res = await search(q.trim(), { collections: ["posts"], limit: 100 });
      const hits = new Set(res.items.map((i) => i.slug ?? i.id));
      posts = posts.filter((p) => hits.has(p.slug) || hits.has(p.id));
    } catch {
      const needle = q.trim().toLowerCase();
      posts = posts.filter((p) => (p.title + " " + p.excerpt).toLowerCase().includes(needle));
    }
  }
  return posts;
}
