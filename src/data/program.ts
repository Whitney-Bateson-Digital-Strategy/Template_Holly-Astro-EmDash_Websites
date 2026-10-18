import type { Faq, Img, Link } from "./types";
import { site } from "../site.config";

/**
 * PROGRAM SALES PAGE (/program)
 * Copy for every section of the T1 program page. Duplicate this file + src/pages/program.astro
 * to add another program (e.g. program-2.ts + program-2.astro).
 */
const book: Link = { label: "Schedule your call", href: site.cta.href };

export const program = {
  seo: { title: "Program Name", description: "" },

  intro: {
    eyebrow: "introducing...",
    title: "Program Name",
    body: "A sentence to introduce the program and highlight who it serves and what it will help them accomplish.",
    image: { src: "/images/t1/explore-services.webp", alt: "Friends sharing a meal around a table", label: "Program photo" } as Img,
  },

  feeling: {
    title: "Are you feeling...",
    body: "Describe where your ideal client is right now, in their own words.",
    bullets: [
      "A frustration they'd say out loud",
      "Something they've tried that didn't work",
      "How it's showing up in their everyday life",
      "What they're worried about if nothing changes",
    ],
  },
  wouldYou: {
    title: "Would you like to...",
    paragraphs: [
      "Paint the picture of what life looks like after the program: how they'll feel, what they'll be able to do, what they won't have to worry about anymore.",
      "Add a second paragraph that makes the outcome feel specific and achievable.",
    ],
  },

  band: {
    eyebrow: "introducing the",
    title: "Program Name",
    subtitle: "Subheading describing the program",
    body: "Two or three sentences on what the program is, how long it runs, and the transformation it delivers.",
    cta: book,
  },

  whoFor: {
    title: "Who is the program for?",
    subtitle: "This program is for you if you'd like to...",
    bullets: [
      "A specific result your ideal client wants",
      "A second result, in their words",
      "A third result that speaks to how they'll feel",
      "A fourth result that removes an objection",
    ],
    cta: book,
    image: { src: "/images/t1/offer-1.webp", alt: "Basket of fresh vegetables", label: "Program photo 2" } as Img,
  },

  howItWorks: {
    eyebrow: "overview",
    title: "How it works",
    cards: [
      { title: "Part 1: Name this phase", body: "What happens in this part of the program and what they'll walk away with.", image: { src: "/images/t1/card-1.webp", alt: "Woman working on a laptop", label: "Part 1" } as Img },
      { title: "Part 2: Name this phase", body: "What happens in this part of the program and what they'll walk away with.", image: { src: "/images/t1/card-2.webp", alt: "Laptop and notebook", label: "Part 2" } as Img },
      { title: "Part 3: Name this phase", body: "What happens in this part of the program and what they'll walk away with.", image: { src: "/images/t1/card-3.webp", alt: "Chef preparing food", label: "Part 3" } as Img },
    ],
  },

  bonuses: {
    eyebrow: "special bonuses!",
    subtitle: "Plus, get these bonuses to support your progress.",
    items: [
      { title: "Bonus #1", body: "What it is and why it helps them get results faster." },
      { title: "Bonus #2", body: "What it is and why it helps them get results faster." },
      { title: "Bonus #3", body: "What it is and why it helps them get results faster." },
    ],
    cta: { label: "Get started today", href: site.cta.href } as Link,
  },

  included: {
    title: "What's included",
    subtitle: "This 12-week program includes:",
    bullets: [
      "Weekly 1:1 coaching calls",
      "A personalized plan built around your goals",
      "Recipes, guides and checklists",
      "Messaging support between sessions",
      "Progress check-ins",
      "Lifetime access to program materials",
    ],
    cta: book,
    image: { src: "/images/t1/offer-2.webp", alt: "Woman laughing at her laptop in the kitchen", label: "Included photo", position: "70% center" } as Img,
  },

  format: {
    title: "Course Format",
    items: [
      { tag: "Module 01:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
      { tag: "Module 02:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
      { tag: "Module 03:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
      { tag: "Module 04:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
      { tag: "Module 05:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
      { tag: "Module 06:", q: "Name the module", a: "What's covered in this module and what they'll be able to do afterward." },
    ] as Faq[],
    closing: "What are you waiting for? Let's get started today!",
    cta: book,
  },

  steps: {
    eyebrow: "3 steps to success",
    title: "How to get started",
    items: [
      { label: "step 1:", title: "Book your call", body: "Pick a time that works for you. We'll talk through your goals." },
      { label: "step 2:", title: "Get your plan", body: "We'll map out your personalized plan and first steps together." },
      { label: "step 3:", title: "Start seeing results", body: "Follow the plan with weekly support and adjustments along the way." },
    ],
    cta: { label: "Take the first step", href: site.cta.href } as Link,
  },

  expect: {
    title: "What to expect",
    subtitle: "Subheader goes here",
    bullets: [
      "What their first week looks like",
      "How often you'll meet",
      "How support works between sessions",
      "What changes they'll notice first",
      "How progress is tracked",
      "What happens when the program ends",
    ],
    cta: { label: "Get started now", href: site.cta.href } as Link,
    image: { src: "/images/t1/process-1.webp", alt: "Man smiling at his phone", label: "Expect photo" } as Img,
  },

  coach: {
    eyebrow: "meet your coach",
    title: "Hi! I'm Your Name",
    subtitle: "A one-line connection to your client",
    body: "Two or three sentences on who you are, your credentials, and why you created this program.",
    cta: { label: "Learn more about me", href: "/about" } as Link,
    image: { src: "/images/t1/portrait-smile.webp", alt: "Smiling woman in sunglasses", label: "Coach photo" } as Img,
  },

  pricing: {
    eyebrow: "payment options",
    title: "Invest in your health",
    subtitle: "Gain access to the program today!",
    plans: [
      { tag: "save 20% with a single payment", name: "One-Time Payment:", price: "$0.00", cta: { label: "Get started", href: "#" } as Link },
      { tag: "convenient installment option", name: "Three Monthly Payments:", price: "$0.00", cta: { label: "Get started", href: "#" } as Link },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "How long is the program?", a: "Answer the question clearly in two or three sentences." },
      { q: "Is it virtual or in person?", a: "Answer the question clearly in two or three sentences." },
      { q: "What if I miss a session?", a: "Answer the question clearly in two or three sentences." },
      { q: "Do I need any special equipment?", a: "Answer the question clearly in two or three sentences." },
      { q: "Is there a payment plan?", a: "Answer the question clearly in two or three sentences." },
      { q: "What if it's not right for me?", a: "Answer the question clearly in two or three sentences." },
    ] as Faq[],
    footnote: { text: "Do you have another question?", link: { label: "Contact me.", href: "/contact" } },
  },
};
