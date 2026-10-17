import type { Img } from "./types";

export const contact = {
  seo: { title: "Contact", description: "" },
  banner: { title: "Contact", image: { label: "Contact banner" } as Img },
  intro: {
    eyebrow: "questions",
    title: "Get in Touch!",
    body: "Let visitors know what to reach out about and how quickly you typically reply.",
    bookingNote: { text: "Ready to go?", link: { label: "Book a free strategy call here.", href: "/booking" } },
    image: { label: "Contact photo" } as Img,
  },
  form: {
    // "Services" options come from src/data/offers.ts automatically
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "goals", label: "Goals", type: "text", required: true },
      { name: "service", label: "Services", type: "select", required: true, placeholder: "Which service are you interested in?" },
      { name: "concerns", label: "Concerns", type: "text", required: false },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
    button: "Submit",
  },
  socialTitle: "follow me on social",
};

export const booking = {
  seo: { title: "Book a Call", description: "" },
  banner: { title: "Book a Call", image: { label: "Booking banner" } as Img },
  intro: {
    eyebrow: "let's talk",
    title: "Schedule your free strategy call",
    body: "Tell visitors what the call covers, how long it is, and what to expect. Pick a time below that works for you.",
  },
};
