/**
 * SITE CONFIG
 * ------------------------------------------------------------
 * Everything brand-level lives here: name, nav, links, forms, socials.
 * Page copy lives in src/data/*.ts. Colors and fonts live in src/styles/global.css.
 */

export const site = {
  name: "Brand Name",
  tagline: "Personalized nutrition that fits your life",
  description:
    "Short description of the business for search results and social previews (about 150 characters).",
  /** Production URL (no trailing slash). Used for canonical URLs + sitemap. Also set it in astro.config.mjs. */
  url: "https://example.com",

  /** Optional logo. Drop a file in /public/images and set the path, or leave empty to show the brand name as text. */
  logo: "",
  logoAlt: "Brand Name logo",

  /** Primary call to action, used in the header, hero and CTA band. */
  cta: { label: "Book a free call", href: "/booking" },

  /** Booking embed URL (Calendly, Acuity, TidyCal…). Leave empty to show a placeholder. */
  bookingEmbedUrl: "",

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  footerLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
  ],

  socials: [
    { label: "Instagram", handle: "@yourhandle", href: "https://instagram.com/" },
    { label: "Facebook", handle: "Your Group", href: "https://facebook.com/" },
    { label: "LinkedIn", handle: "Your Name", href: "https://linkedin.com/" },
    { label: "YouTube", handle: "@yourchannel", href: "https://youtube.com/" },
  ],

  /**
   * Newsletter form. Defaults to Kit (ConvertKit) field names.
   * Kit: action = https://app.kit.com/forms/FORM_ID/subscriptions
   */
  newsletter: {
    action: "",
    method: "post",
    nameField: "fields[first_name]",
    emailField: "email_address",
  },

  /** Thin bar above the header. Set text to "" to hide it. */
  announcement: { text: "Announcement bar: promote a freebie, event, or new offer", href: "/#optin" },

  /**
   * Lead magnet opt-in shown above the footer on every page.
   * Usually its own Kit form (so subscribers get the freebie sequence).
   */
  optin: {
    action: "",
    method: "post",
    nameField: "fields[first_name]",
    emailField: "email_address",
  },

  /** Contact form endpoint (Formspree, Kit, GHL webhook, etc.). Leave empty while building. */
  contactForm: {
    action: "",
    method: "post",
  },
} as const;

export type Site = typeof site;
