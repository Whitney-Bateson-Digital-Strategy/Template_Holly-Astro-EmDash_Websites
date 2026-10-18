export interface Link { label: string; href: string }
export interface Img {
  src?: string;
  alt?: string;
  label?: string;
  /** Which part of the photo stays visible when it's cropped, e.g. "right", "top", "70% 30%" */
  position?: string;
}

export interface Offer {
  id: string;            // used for #anchors on /services
  eyebrow: string;       // e.g. "Individual"
  title: string;
  summary: string;       // short line for the home page card
  description: string;   // longer intro on /services
  forYouIf: string[];
  included: string[];
  cardImage?: Img;
  image?: Img;
  cta?: Link;
}

export interface Testimonial {
  label: string;     // small line above the headline, e.g. "Client Successes"
  headline: string;
  quote: string;
  name: string;
}

export interface Step { label: string; title: string; body: string }
export interface Faq { q: string; a: string; /** optional highlighted prefix, e.g. "Module 01:" */ tag?: string }
