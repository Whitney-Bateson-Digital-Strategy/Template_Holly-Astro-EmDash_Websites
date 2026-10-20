export interface Img {
  src?: string;
  alt?: string;
  label?: string;
  /** Which part of the photo stays visible when it's cropped, e.g. "right", "top", "70% 30%" */
  position?: string;
}

export interface Testimonial {
  label: string;     // small line above the headline, e.g. "Client Successes"
  headline: string;
  quote: string;
  name: string;
  /** On-page editing attributes per field (set by src/lib/cms.ts) */
  edit?: Partial<Record<"label" | "headline" | "quote" | "name", EditAttrs>>;
}

/** `data-emdash-ref` attribute for EmDash on-page editing; {} for visitors */
export type EditAttrs = Record<string, string>;
