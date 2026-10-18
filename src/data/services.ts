import type { Faq, Img } from "./types";

export const services = {
  seo: { title: "Services", description: "" },
  banner: { title: "Services", image: { src: "/images/t1/banner.webp", alt: "Laptop on a bright desk", label: "Services banner" } as Img },
  intro: {
    title: "Introduction to your Services",
    body: "A short paragraph that frames your offers: who they're for, what they have in common, and how to choose between them.",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "How do I know which option is right for me?", a: "Answer the question clearly in two or three sentences." },
      { q: "Do you accept insurance?", a: "Answer the question clearly in two or three sentences." },
      { q: "Are sessions virtual or in person?", a: "Answer the question clearly in two or three sentences." },
      { q: "How long does it take to see results?", a: "Answer the question clearly in two or three sentences." },
      { q: "What happens after I book a call?", a: "Answer the question clearly in two or three sentences." },
      { q: "Can I switch programs later?", a: "Answer the question clearly in two or three sentences." },
    ] as Faq[],
    footnote: { text: "Do you have another question?", link: { label: "Contact me.", href: "/contact" } },
  },
};
