import type { Img } from "./types";

export const contact = {
  seo: { title: "Contact", description: "" },
  // No image = solid teal band (T1 design). Add an image to use a photo banner instead.
  banner: { title: "Contact" } as { title: string; image?: Img },
  intro: {
    eyebrow: "questions?",
    title: "Get in Touch!",
    body: "Let visitors know what to reach out about and how quickly you typically reply.",
    bookingNote: { text: "Ready to go? Book a free discovery call", link: { label: "here.", href: "/booking" } },
    image: { src: "/images/t1/portrait-smile.webp", alt: "Smiling woman in sunglasses", label: "Contact photo" } as Img,
  },
  form: {
    // "Services" options come from src/data/offers.ts automatically
    // Labels show inside each box. half: true puts two fields side by side on desktop.
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "email", label: "Email Address", type: "email", required: true, half: true },
      { name: "goals", label: "What are you hoping to achieve through working together?", type: "text", required: true },
      { name: "service", label: "Which services are you interested in?", type: "select", required: true },
      { name: "message", label: "What questions do you have for me?", type: "textarea", required: true },
    ],
    button: "Submit Form",
  },
  socialTitle: "follow me on social",
};

export const booking = {
  seo: { title: "Book a Call", description: "" },
  banner: { title: "Book a Call", image: { src: "/images/t1/banner.webp", alt: "Laptop on a bright desk", label: "Booking banner" } as Img },
  intro: {
    eyebrow: "let's talk",
    title: "Schedule your free strategy call",
    body: "Tell visitors what the call covers, how long it is, and what to expect. Pick a time below that works for you.",
  },
};
