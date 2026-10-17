import type { Img, Link } from "./types";
import { site } from "../site.config";

/** The "ready? / GET STARTED" band reused on Home, About and Services. */
export const ctaBand = {
  eyebrow: "ready?",
  title: "Get Started",
  subtitle: "Book a free strategy call today!",
  cta: { label: "Schedule your call", href: site.cta.href } as Link,
};

/** Lead magnet opt-in band above the footer (every page). Set `show: false` to hide. */
export const optin = {
  show: true,
  eyebrow: "free guide",
  title: "Lead Magnet Title Goes Here",
  subtitle: "A one-line promise of what they'll get",
  body: "Describe the freebie in a sentence or two: what's inside and why it helps. Enter your name and email to get instant access.",
  button: "Send it to me",
  fineprint: "(No spam. Unsubscribe at any time.)",
  image: { label: "Lead magnet mockup" } as Img,
};

/** Main footer text. Nav + socials come from site.config.ts */
export const footer = {
  blurb: "One or two sentences about who you help and how. This sits under the logo in the footer.",
  linksTitle: "Quick Links",
  socialTitle: "Connect",
};

/** Freebie box at the top of the blog sidebar. Uses the same Kit form as the opt-in (site.optin). */
export const sidebarFreebie = {
  show: true,
  eyebrow: "free guide",
  title: "Lead Magnet Title",
  body: "One sentence on what's inside and why it helps.",
  button: "Get the free guide",
  image: { label: "Freebie mockup" } as Img,
};
