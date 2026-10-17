import type { Img, Link, Step } from "./types";
import { site } from "../site.config";

export const home = {
  seo: { title: "", description: "" }, // blank = use site defaults

  hero: {
    image: { label: "Hero background" } as Img,
    kicker: "Name the frustration your client is feeling right now?",
    headline: "State the outcome you help them reach, in their words",
    cta: { label: "Let's talk strategy", href: site.cta.href } as Link,
  },

  problem: {
    title: "Does this sound familiar?",
    bullets: [
      "Pain point #1, written the way your client would say it",
      "Pain point #2: what they've tried that hasn't worked",
      "Pain point #3: the everyday symptom or frustration",
      "Pain point #4: what they're missing out on",
      "Pain point #5: the confusion or overwhelm they feel",
    ],
    image: { label: "Problem photo" } as Img,
  },

  solution: {
    title: "Your approach is the answer, and here's why",
    bullets: [
      "Benefit #1: what they'll discover",
      "Benefit #2: how it fits their life",
      "Benefit #3: what's personalized",
      "Benefit #4: how they'll feel",
      "Benefit #5: the confidence they'll gain",
    ],
    image: { label: "Solution photo" } as Img,
  },

  services: { eyebrow: "services", title: "Let's Work Together" },

  testimonials: { eyebrow: "Testimonials" },

  about: {
    eyebrow: "Hello there!",
    title: "I'm Your Name",
    subtitle: "A one-line connection: I know how you feel",
    body: "Two or three sentences on your story: why you do this work and what makes your approach different. Keep it warm and personal; the full story lives on the About page.",
    cta: { label: "Learn more about me", href: "/about" } as Link,
    image: { label: "Headshot" } as Img,
  },

  newsletter: {
    eyebrow: "newsletter",
    title: "Keep In Touch",
    body: "Get inspiration and expert advice delivered to your inbox, twice a month!",
    fineprint: "(No spam. Unsubscribe at any time.)",
    button: "Subscribe",
  },

  process: {
    title: "My Signature Process",
    eyebrow: "four steps to success",
    steps: [
      { label: "Step 01:", title: "Book a free strategy call", body: "Describe the first step: how they get started and what happens on the call." },
      { label: "Step 02:", title: "We'll choose your program", body: "Explain how you match them to the right offer for where they are today." },
      { label: "Step 03:", title: "Working together", body: "Describe what working with you looks like week to week, and what makes it effective." },
      { label: "Step 04:", title: "Maintain your success", body: "Explain how you support them long-term so the results last." },
    ] as Step[],
    images: [{ label: "Process photo 1" }, { label: "Process photo 2" }] as Img[],
  },

  blog: { eyebrow: "The Blog", viewAll: { label: "view all", href: "/blog" } as Link, count: 3 },
};
