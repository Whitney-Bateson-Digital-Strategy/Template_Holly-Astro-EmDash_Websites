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

/** Main footer text. Socials come from site.config.ts */
export const footer = {
  tagline: "Personalized nutrition and lifestyle coaching that fits your life.",
  linksTitle: "Highlight Links",
  links: [
    { label: "View my coaching services", href: "/services" },
    { label: "Ready to get started? Book a call!", href: "/booking" },
  ] as Link[],
  socialTitle: "Follow Me On Social",
};

/** Box inside each blog post, after the article. */
export const postCta = {
  eyebrow: "let's work together!",
  title: "Book a free discovery call today",
  cta: { label: "Schedule your call", href: site.cta.href } as Link,
};
