import type { Img, Link } from "./types";
import { site } from "../site.config";

/** The "ready? / GET STARTED" band reused on Home, About and Services. */
export const ctaBand = {
  eyebrow: "ready?",
  title: "Get Started",
  subtitle: "Book a free strategy call today!",
  cta: { label: "Schedule your call", href: site.cta.href } as Link,
};

/**
 * Lead magnet band above the footer (every page). Set `show: false` to hide.
 * T1 uses a button that links to the freebie's opt-in page. Set `mode: "form"` to show
 * name + email fields instead (they post to site.optin in site.config.ts).
 */
export const optin = {
  show: true,
  mode: "link" as "link" | "form",
  eyebrow: "free guide!",
  title: "Lead magnet title goes here",
  body: "One or two sentences on what's inside the freebie and why it helps.",
  button: { label: "Download Guide", href: "/free-guide" } as Link,
  fineprint: "",
  image: { src: "/images/t1/freebie.webp", alt: "Basket of fresh vegetables", label: "Lead magnet photo" } as Img,
};

/**
 * Footer (T1 V1): three link columns + a "Keep in touch" newsletter form, then a dark bar with the
 * legal links (site.footerLinks) and "© year Brand | Created by WBDS".
 * The newsletter form posts to site.newsletter in site.config.ts.
 * A column with `socials: true` lists the social profiles from site.config.ts.
 */
export const footer = {
  columns: [
    {
      title: "Work With Me",
      links: [
        { label: "Services", href: "/services" },
        { label: "Program", href: "/program" },
        { label: "Book a call", href: site.cta.href },
      ] as Link[],
    },
    { title: "Connect", socials: true, links: [] as Link[] },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Free guide", href: "/free-guide" },
        { label: "Contact", href: "/contact" },
      ] as Link[],
    },
  ],
  newsletter: {
    title: "Keep In Touch",
    body: "Sign up for my newsletter for updates on offerings, courses, free stuff + more!",
    button: "Join",
  },
};

/** Box inside each blog post, after the article. */
export const postCta = {
  eyebrow: "let's work together!",
  title: "Book a free discovery call today",
  cta: { label: "Schedule your call", href: site.cta.href } as Link,
};
