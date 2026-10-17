import type { Img, Link } from "./types";

export const about = {
  seo: { title: "About", description: "" },

  intro: {
    eyebrow: "hi there!",
    title: "I'm Your Name",
    body: "An overview of your mission statement or approach can go here, but keep it short. This is a brief introduction that you'll expand on below!",
    cta: { label: "Explore Services", href: "/services" } as Link,
    image: { label: "Portrait" } as Img,
  },

  story: {
    title: "My Story",
    body: "Share how you got here: the moment that started it, what you learned along the way, and why you're passionate about helping people like your clients. Two short paragraphs is plenty.",
  },
  philosophy: {
    title: "My Philosophy",
    body: "Describe the beliefs that shape how you work. What do you do differently? What will clients never hear from you? What do you want them to feel?",
  },

  funFacts: {
    title: "Fun Facts",
    subtitle: "I bet you didn't know:",
    items: [
      "A fun fact that helps visitors get to know you",
      "Something you love outside of work",
      "A favorite food, place, or ritual",
      "A surprising skill or hobby",
      "Something from your background",
      "What you're currently learning",
    ],
    image: { label: "Lifestyle photo" } as Img,
  },

  education: {
    title: "Education",
    subtitle: "Highlight the education and credentials that make you qualified to support clients.",
    body: "List degrees, certifications, and specialized training. Mention any memberships or ongoing education that builds trust.",
    image: { label: "Credentials photo" } as Img,
  },

  explore: {
    title: "Keep Exploring",
    cards: [
      { label: "Read the Blog", href: "/blog", image: { label: "Blog" } as Img },
      { label: "View My Services", href: "/services", image: { label: "Services" } as Img },
      { label: "Book A Free Call", href: "/booking", image: { label: "Booking" } as Img },
    ],
  },
};
