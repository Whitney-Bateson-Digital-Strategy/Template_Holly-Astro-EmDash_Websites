/**
 * All EmDash reads go through this file, so components never talk to the CMS directly.
 * Want another section editable in the admin? Add a collection to .emdash/seed.json
 * (or create it in the admin), then add a getter here with a data-file fallback.
 */
import { getEmDashCollection, getEmDashEntry, getEntryTerms, getEntriesByTerm, getTaxonomyTerms, search } from "emdash";
import { testimonials as fallbackTestimonials } from "../data/testimonials";
import type { Testimonial } from "../data/types";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date?: Date;
  image?: unknown; // EmDash media value, rendered with <Image> from emdash/ui
  content?: unknown; // Portable Text, rendered with <PortableText> from emdash/ui
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
  return entries.map((e) => toPost(e as { id: string; data: Row }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const { entry, error } = await getEmDashEntry("posts", slug);
  if (error) console.error("[cms] post:", error);
  return entry ? toPost(entry as { id: string; data: Row }) : null;
}

/** Testimonials from EmDash; falls back to src/data/testimonials.ts if the collection is empty or missing. */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { entries, error } = await getEmDashCollection("testimonials", { status: "published", orderBy: { order: "asc" } });
    if (error || !entries.length) return fallbackTestimonials;
    return entries.map(({ data }) => {
      const d = data as Row;
      return {
        label: String(d.label ?? "Client Successes"),
        headline: String(d.title ?? ""),
        quote: String(d.quote ?? ""),
        name: String(d.name ?? ""),
      };
    });
  } catch {
    return fallbackTestimonials;
  }
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

/** Categories assigned to one post. */
export async function getPostCategories(postId: string): Promise<Category[]> {
  try {
    const terms = await getEntryTerms("posts", postId, "category");
    return terms.map((t) => ({ name: t.label || t.name, slug: t.slug }));
  } catch {
    return [];
  }
}

/** Posts filtered by category slug and/or search text. No filter = all published posts, newest first. */
export async function findPosts({ category, q }: { category?: string; q?: string } = {}): Promise<Post[]> {
  let posts = await getPosts();
  if (category) {
    try {
      // entries may be keyed by slug or content ID depending on the EmDash API, so match either
      const keys = new Set(
        (await getEntriesByTerm("posts", "category", category)).flatMap((e) => [e.id, String(e.data?.id ?? ""), String(e.data?.slug ?? "")]),
      );
      posts = posts.filter((p) => keys.has(p.id) || keys.has(p.slug));
    } catch (e) {
      console.error("[cms] category filter:", e);
    }
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
