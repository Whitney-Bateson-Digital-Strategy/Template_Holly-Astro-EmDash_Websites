import type { Offer } from "./types";

/**
 * Offers are shared: home page cards, the /services page, and the
 * "Services" dropdown on the contact form all read from this list.
 */
export const offers: Offer[] = [
  {
    id: "one-on-one",
    eyebrow: "Individual",
    title: "1:1 Coaching",
    summary: "One sentence on the result this offer creates and who it's best for.",
    description: "Describe the offering in two or three sentences: what it is, how long it runs, and the change your client can expect.",
    forYouIf: ["You want personalized, one-on-one support", "You're ready to make changes that fit your routine", "You've tried general advice and want a plan built for you"],
    included: ["Initial deep-dive session", "Weekly coaching calls", "Custom plan and resources", "Messaging support between sessions"],
    cardImage: { src: "/images/t1/card-1.webp", alt: "1:1 coaching", label: "Offer 1 image" },
    image: { src: "/images/t1/offer-1.webp", alt: "Basket of fresh vegetables", label: "Offer 1 photo" },
    cta: { label: "Get Started", href: "/booking" },
  },
  {
    id: "group",
    eyebrow: "Collaborate",
    title: "Group Coaching",
    summary: "One sentence on the result this offer creates and who it's best for.",
    description: "Describe the offering in two or three sentences: what it is, how long it runs, and the change your client can expect.",
    forYouIf: ["You like learning alongside others", "You want accountability and community", "You want expert guidance at a lower investment"],
    included: ["Live group sessions", "Private community access", "Workbooks and templates", "Session recordings"],
    cardImage: { src: "/images/t1/card-2.webp", alt: "Group coaching", label: "Offer 2 image" },
    image: { src: "/images/t1/offer-2.webp", alt: "Woman laughing at her laptop in the kitchen", label: "Offer 2 photo", position: "85% center" },
    cta: { label: "Get Started", href: "/booking" },
  },
  {
    id: "self-paced",
    eyebrow: "Self-Paced",
    title: "Online Program",
    summary: "One sentence on the result this offer creates and who it's best for.",
    description: "Describe the offering in two or three sentences: what it is, how long it runs, and the change your client can expect.",
    forYouIf: ["You prefer to learn on your own schedule", "You want a clear step-by-step path", "You're comfortable working independently"],
    included: ["Video lessons", "Downloadable guides", "Lifetime access", "Optional add-on check-in call"],
    cardImage: { src: "/images/t1/card-3.webp", alt: "Online program", label: "Offer 3 image" },
    image: { src: "/images/t1/offer-3.webp", alt: "Laptop, notebook and a bowl of fruit", label: "Offer 3 photo" },
    cta: { label: "Get Started", href: "/booking" },
  },
];
