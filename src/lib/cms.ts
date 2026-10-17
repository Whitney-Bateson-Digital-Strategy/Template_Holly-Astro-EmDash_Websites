/**
 * All EmDash reads go through this file, so components never talk to the CMS directly.
 * Want another section editable in the admin? Add a collection to .emdash/seed.json
 * (or create it in the admin), then add a getter here with a data-file fallback.
 */
import { getEmDashCollection, getEmDashEntry } from "emdash";
import { testimonials as fallbackTestimonials } from "../data/testimonials";
import type { Testimonial } from "../data/types";

export interface Post {
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
