import type { Img, Link, Step } from "./types";
import { site } from "../site.config";

export const home = {
  seo: { title: "", description: "" }, // blank = use site defaults

  /** Full-width photo hero. Design size 2250 x 944 px. `highlight` = second line in the accent color. */
  hero: {
    image: { src: "/images/t1/hero.webp", alt: "Laptop surrounded by fresh vegetables", label: "Hero background" } as Img,
    headline: "Add a headline that",
    highlight: "speaks to your audience",
    subheadline: "Include a call to action that inspires visitors to take the next step.",
    cta: { label: "Let's get started", href: site.cta.href } as Link,
  },

  /** Centered intro under the hero. The subtitle's `highlight` part is colored. */
  intro: {
    title: "Tired of struggling with gut issues?",
    subtitle: { before: "Need a solution that actually ", highlight: "heals your gut", after: " instead of just masking symptoms?" },
    paragraphs: [
      "Describe what your ideal client is struggling with, in the words they'd use: the symptoms, the frustration, and what they've already tried. Then introduce how you help and why it works when other things haven't.",
    ],
  },

  /** Offer rows come from src/data/offers.ts. Row photos: 1565 x 1282 px. */
  services: { eyebrow: "services", title: "Let's Work Together", ctaPrefix: "Learn more about" },

  testimonials: { eyebrow: "Testimonials" },

  /** Photo: 1563 x 1126 px */
  about: {
    eyebrow: "hi there!",
    title: "I'm Your Name",
    subtitle: "A one-line connection: I know how you feel",
    body: "Two or three sentences on your story: why you do this work and what makes your approach different. Keep it warm and personal; the full story lives on the About page.",
    cta: { label: "Learn more about me", href: "/about" } as Link,
    image: { src: "/images/t1/portrait-smile.webp", alt: "Smiling woman in sunglasses", label: "Headshot" } as Img,
  },

  newsletter: {
    eyebrow: "newsletter",
    title: "Keep In Touch",
    body: "Get inspiration and expert advice delivered to your inbox, twice a month!",
    fineprint: "(No spam. Unsubscribe at any time.)",
    button: "Subscribe",
  },

  process: {
    eyebrow: "3 steps to success",
    title: "Your process goes here",
    items: [
      { label: "step 1:", title: "Book your call", body: "Describe the first step: how they get started and what happens on the call." },
      { label: "step 2:", title: "Get your plan", body: "Explain how you map out their plan and match them to the right offer." },
      { label: "step 3:", title: "Start seeing results", body: "Describe what working together looks like and the change they'll feel." },
    ] as Step[],
    cta: { label: "Explore programs", href: "/services" } as Link,
  },

  /** Post photos: 1143 x 754 px (same as every blog featured image) */
  blog: { eyebrow: "The Blog", viewAll: { label: "view all", href: "/blog" } as Link, count: 3 },
};
