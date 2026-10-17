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
    cardImage: { label: "Offer 1 image" },
    image: { label: "Offer 1 photo" },
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
    cardImage: { label: "Offer 2 image" },
    image: { label: "Offer 2 photo" },
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
    cardImage: { label: "Offer 3 image" },
    image: { label: "Offer 3 photo" },
    cta: { label: "Get Started", href: "/booking" },
  },
];
