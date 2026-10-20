/**
 * All EmDash reads go through this file, so components never talk to the CMS directly.
 * Want another section editable in the admin? Add a collection to .emdash/seed.json
 * (or create it in the admin), then add a getter here with a data-file fallback.
 */
import { getEmDashCollection, getEmDashEntry, getEntryTerms, getEntriesByTerm, getTaxonomyTerms, search } from "emdash";
import { testimonials as fallbackTestimonials } from "../data/testimonials";
import { home } from "../data/home";
import { offers } from "../data/offers";
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

/** Testimonials from EmDash; falls back to src/data/testimonials.ts if the collection is empty or missing. */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { entries, error } = await getEmDashCollection("testimonials", { status: "published", orderBy: { order: "asc" } });
    if (error || !entries.length) return fallbackTestimonials;
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
    return fallbackTestimonials;
  }
}

export interface Homepage {
  /** Text fields (see the "homepage" collection in .emdash/seed.json) */
  text: Record<string, string>;
  /** Image fields: EmDash media values, undefined = use the template photo from src/data */
  images: Record<string, unknown>;
  /** On-page editing attributes for one field ({} unless a logged-in editor is in edit mode) */
  edit: (field: string) => EditAttrs;
  /** Entry-level attributes. Put them on the first annotated element on the page: the toolbar reads its Publish status from there */
  entry: EditAttrs;
  /** True while a logged-in editor is in edit mode */
  editing: boolean;
}

/** Homepage copy as it was in src/data before EmDash, keyed by field. Used for any field missing from EmDash. */
function homepageFallback(): Record<string, string> {
  const h = home;
  const t: Record<string, string> = {
    title: "Homepage",
    hero_headline: h.hero.headline,
    hero_highlight: h.hero.highlight,
    hero_text: h.hero.subheadline,
    hero_button_label: h.hero.cta.label,
    hero_button_link: h.hero.cta.href,
    intro_title: h.intro.title,
    intro_subtitle_start: h.intro.subtitle.before.trim(),
    intro_subtitle_highlight: h.intro.subtitle.highlight,
    intro_subtitle_end: h.intro.subtitle.after.trim(),
    intro_text: h.intro.paragraphs.join("\n\n"),
    services_eyebrow: h.services.eyebrow,
    services_title: h.services.title,
    services_button_prefix: h.services.ctaPrefix,
    testimonials_label: h.testimonials.eyebrow,
    newsletter_eyebrow: h.newsletter.eyebrow,
    newsletter_title: h.newsletter.title,
    newsletter_text: h.newsletter.body,
    newsletter_fineprint: h.newsletter.fineprint,
    newsletter_button: h.newsletter.button,
    about_eyebrow: h.about.eyebrow,
    about_title: h.about.title,
    about_subtitle: h.about.subtitle,
    about_text: h.about.body,
    about_button_label: h.about.cta.label,
    about_button_link: h.about.cta.href,
    process_eyebrow: h.process.eyebrow,
    process_title: h.process.title,
    process_button_label: h.process.cta.label,
    process_button_link: h.process.cta.href,
    blog_title: h.blog.eyebrow,
    blog_link_label: h.blog.viewAll.label,
    seo_title: h.seo.title,
    seo_description: h.seo.description,
  };
  offers.forEach((o, i) => {
    const p = `service_${i + 1}_`;
    Object.assign(t, { [p + "eyebrow"]: o.eyebrow, [p + "title"]: o.title, [p + "summary"]: o.summary, [p + "text"]: o.description });
    o.homeBullets?.forEach((b, j) => (t[`${p}bullet_${j + 1}`] = b));
  });
  h.process.items.forEach((s, i) => Object.assign(t, { [`step_${i + 1}_label`]: s.label, [`step_${i + 1}_title`]: s.title, [`step_${i + 1}_text`]: s.body }));
  return t;
}

/**
 * Homepage content from the single "home" entry in the EmDash "homepage" collection.
 * Any field that's missing (or the whole entry, on a site that hasn't added it yet) falls back to src/data,
 * so the page always renders. An empty field stays empty: optional lines are hidden when cleared.
 */
export async function getHomepage(): Promise<Homepage> {
  const text = homepageFallback();
  const images: Record<string, unknown> = {};
  let proxy: Record<string, EditAttrs | undefined> = {};
  let entry: EditAttrs = {};
  try {
    const { entry: e, error } = await getEmDashEntry("homepage", "home");
    if (error) console.error("[cms] homepage:", error);
    if (e) {
      for (const [k, v] of Object.entries(e.data as unknown as Row)) {
        if (v == null) continue;
        if (typeof v === "string") text[k] = v;
        else if (typeof v === "object" && k.endsWith("_image")) images[k] = v;
      }
      proxy = e.edit as unknown as Record<string, EditAttrs | undefined>;
      entry = { ...(e.edit as unknown as EditAttrs) };
    }
  } catch (err) {
    console.error("[cms] homepage:", err);
  }
  return { text, images, edit: (field) => proxy[field] ?? {}, entry, editing: Object.keys(entry).length > 0 };
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
