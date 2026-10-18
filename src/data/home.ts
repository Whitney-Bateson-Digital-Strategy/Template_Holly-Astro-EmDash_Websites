import type { Img, Link, Step } from "./types";
import { site } from "../site.config";

export const home = {
  seo: { title: "", description: "" }, // blank = use site defaults

  hero: {
    image: { src: "/images/t1/hero.webp", alt: "Laptop surrounded by fresh vegetables", label: "Hero background" } as Img,
    headline: "Add a headline that speaks to your audience",
    subheadline: "Include a call to action that inspires visitors to take the next step.",
    cta: { label: "Let's talk strategy", href: site.cta.href } as Link,
  },

  problem: {
    title: "Relate to visitors by touching on their pain points",
    paragraphs: [
      "Describe what your ideal client is struggling with, in the words they'd use. Name the symptoms, the frustration, and what they've already tried.",
      "Add a second short paragraph about how it's affecting their everyday life.",
    ],
    image: { src: "/images/t1/problem.webp", alt: "Tired woman rubbing her temples at a laptop", label: "Problem photo" } as Img,
  },

  solution: {
    title: "Introduce visitors to your unique solution to their problem",
    paragraphs: [
      "Explain your approach and why it works when other things haven't. Keep the focus on the change they'll feel.",
      "Add a second short paragraph about what makes working with you different.",
    ],
    image: { src: "/images/t1/solution.webp", alt: "Couple laughing while cooking together", label: "Solution photo" } as Img,
  },

  services: { eyebrow: "services", title: "Let's Work Together" },

  testimonials: { eyebrow: "Testimonials" },

  about: {
    eyebrow: "Hello there!",
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
    title: "My Signature Process",
    eyebrow: "four steps to success",
    steps: [
      { label: "Step 01:", title: "Book a free strategy call", body: "Describe the first step: how they get started and what happens on the call." },
      { label: "Step 02:", title: "We'll choose your program", body: "Explain how you match them to the right offer for where they are today." },
      { label: "Step 03:", title: "Working together", body: "Describe what working with you looks like week to week, and what makes it effective." },
      { label: "Step 04:", title: "Maintain your success", body: "Explain how you support them long-term so the results last." },
    ] as Step[],
    footnote: { text: "Questions? Check the", links: [{ label: "FAQ", href: "/services#faq" }, { label: "contact me.", href: "/contact" }] },
    images: [{ src: "/images/t1/process-1.webp", alt: "Man smiling at his phone", label: "Process photo 1" }, { src: "/images/t1/process-2.webp", alt: "Woman raising her arms in celebration", label: "Process photo 2" }] as Img[],
  },

  blog: { eyebrow: "The Blog", viewAll: { label: "view all", href: "/blog" } as Link, count: 3 },
};
