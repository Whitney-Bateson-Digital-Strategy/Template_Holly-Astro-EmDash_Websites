/**
 * SITE CONFIG (developer settings)
 * ------------------------------------------------------------
 * Everything clients can change lives in EmDash: pages, services, menus, and "Site-wide content"
 * (business name, logo, announcement bar, free guide band, footer, social links).
 * This file only holds technical settings: the production URL, form endpoints and the footer credit.
 * Colors and fonts live in src/styles/global.css.
 */

export const site = {
  /** Production URL (no trailing slash). Used for canonical URLs + sitemap. Also set it in astro.config.mjs. */
  url: "https://example.com",

  /** Booking embed used when a Booking calendar section has no calendar link of its own. */
  bookingEmbedUrl: "",

  /** Footer credit, shown as "© 2026 Brand Name | Created by WBDS" */
  credit: { label: "WBDS", href: "https://whitneybateson.com" },

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

  /**
   * Free guide form (the /free-guide page, and the free guide band in "Sign-up form" mode).
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
