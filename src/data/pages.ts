import type { Img } from "./types";
import { optin } from "./shared";

/**
 * FREE GUIDE OPT-IN PAGE (/free-guide)
 * The page every "Download guide" button points to. The form posts to site.optin in site.config.ts
 * (the freebie's own Kit form). If the freebie lives on a Kit landing page instead, change the
 * button links in src/data/shared.ts and delete src/pages/free-guide.astro.
 */
export const freeGuide = {
  seo: { title: "Free Guide", description: "" },
  eyebrow: optin.eyebrow,
  title: optin.title,
  body: optin.body,
  bulletsTitle: "Inside, you'll find:",
  bullets: ["What's on the first page", "A quick win they can use today", "The mistake most people make", "Your simple next step"],
  button: "Send me the guide",
  fineprint: "(No spam. Unsubscribe at any time.)",
  image: { ...optin.image } as Img,
};

/**
 * LEGAL PAGES (/terms, /disclaimer, /privacy-policy). Linked in the footer bar (site.footerLinks).
 * Paste each client's policy text as paragraphs. Use "## Heading" at the start of a paragraph for a subheading.
 */
export const legal = {
  terms: {
    title: "Terms & Conditions",
    updated: "",
    paragraphs: ["Paste the client's terms and conditions here. Each item in this list becomes its own paragraph."],
  },
  disclaimer: {
    title: "Disclaimer",
    updated: "",
    paragraphs: ["Paste the client's disclaimer here (for health and wellness businesses: not medical advice, consult your provider, etc.)."],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "",
    paragraphs: ["Paste the client's privacy policy here. Mention the email platform (Kit), analytics and any forms that collect information."],
  },
};
