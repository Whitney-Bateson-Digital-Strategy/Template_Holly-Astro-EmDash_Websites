# Astro T1 Template + EmDash

> EmDash version of the T1 template. Blog posts and testimonials are edited in the EmDash admin at `/_emdash/admin`.
> Everything else still lives in `src/data/*.ts`. The static (no-CMS) version is the separate `astro-t1-template`.

A static Astro + Tailwind rebuild of the WBDS **T1** Elementor template (Home, About, Services, Contact, Booking, Blog).
Layout, spacing, colors and type are taken directly from the T1 Elementor kit and page data.

## Run it

Requires **Node 22.16+** (`node -v`).

```bash
npm install
npx emdash secrets generate --write .env   # once per site; back this file up, never commit it
npm run dev                                 # http://localhost:4321
```

Then open **http://localhost:4321/_emdash/admin**. The setup wizard asks for the site title, an admin account and a passkey.
Choose **Sample content** to load 3 sample posts + 3 testimonials from `.emdash/seed.json`.

`data.db` (content) and `uploads/` (media) are created locally and are git-ignored.

## Spin up a new client site

| What | Where |
|---|---|
| Brand name, nav, CTA, socials, form endpoints, booking embed | `src/site.config.ts` |
| Colors and fonts | `@theme` block at the top of `src/styles/global.css` |
| Google Fonts link (if fonts change) | `src/layouts/BaseLayout.astro` |
| Home page copy | `src/data/home.ts` |
| About page copy | `src/data/about.ts` |
| Services page intro + FAQ | `src/data/services.ts` |
| Offers (shared by home cards, services page, contact dropdown) | `src/data/offers.ts` |
| Testimonials (shared) | EmDash admin → Testimonials (falls back to `src/data/testimonials.ts` if empty) |
| "ready? / GET STARTED" band (shared) | `src/data/shared.ts` |
| Contact + booking copy, contact form fields | `src/data/contact.ts` |
| Blog posts | EmDash admin → Posts |
| Production URL | `site.url` in `site.config.ts` **and** `site` in `astro.config.mjs` |

### Images
Every image is optional. Until a `src` is set, a labeled placeholder renders, so layouts can be reviewed
without stock photos. To add a photo, put the file in `public/images/` and set it in the data file:

```ts
image: { src: "/images/headshot.jpg", alt: "Holly smiling in her kitchen" }
```

### Forms
- **Newsletter:** set `site.newsletter.action` to the Kit form URL (`https://app.kit.com/forms/FORM_ID/subscriptions`).
  Field names already match Kit.
- **Contact:** set `site.contactForm.action` to any form endpoint (Formspree, GHL webhook, etc.).

## Components

`Hero`, `SplitSection` (image/text, either side), `CheckList`, `SectionHeading`, `ServiceCards`,
`Testimonials` (scroll-snap slider, no library), `Newsletter`, `ProcessSteps`, `CTABand`, `LatestPosts`,
`PostCard`, `PageBanner`, `OfferBlock`, `FaqAccordion` (native `<details>`), `LinkCards`, `Media` (image + placeholder).

## How EmDash is wired

| File | Purpose |
|---|---|
| `astro.config.mjs` | `output: "server"`, Node adapter, React (admin UI), `emdash()` with SQLite + local media |
| `src/live.config.ts` | Registers the EmDash live collection loader |
| `src/lib/cms.ts` | **All CMS reads.** `getPosts()`, `getPost()`, `getTestimonials()`. Components never call EmDash directly |
| `src/components/BlogSidebar.astro` | Blog post sidebar: freebie box (Kit form, `sidebarFreebie` in `src/data/shared.ts`) + the EmDash widget area |
| `.emdash/seed.json` | Content model (Posts, Testimonials) + sample content applied by the setup wizard |

**Making more sections editable** (offers, FAQ, page copy): add a collection in the admin, snapshot it with
`npx emdash export-seed > .emdash/seed.json`, add a getter in `src/lib/cms.ts` with a data-file fallback,
and swap the import in the component. Seeds only apply to a fresh database.

**Importing a WordPress site:** export from WordPress (Tools → Export → All content), then upload the XML at
`/_emdash/admin/import/wordpress`. Set up media storage first and keep the old site online until media finishes.

## Blog sidebar widgets

Manage boxes in the admin under **Widgets → Blog Sidebar** (bio = a Content widget; plus Recent Posts, Categories,
Tags, Search, Archives, menus). The sidebar uses the area named `blog-sidebar`, then `sidebar`, then the first area
that exists. EmDash's admin only offers its built-in widget types, so the freebie box with a real form is rendered by
the template instead (edit or hide it via `sidebarFreebie` in `src/data/shared.ts`).

## Deploying

This version is a **Node server**, not static files, so the old "FTP `dist/` to SiteGround" workflow does not apply
(SiteGround shared hosting doesn't run persistent Node apps).

- **Cloudflare Workers** (EmDash's reference host): swap SQLite → D1 and local storage → R2. See the EmDash Cloudflare guide.
- **Node host / container** (Railway, Fly, a VPS, Docker): `npm run build` then `npm start`.
  Needs a persistent disk for `data.db` + `uploads/`, and `EMDASH_ENCRYPTION_KEY` + `EMDASH_SITE_URL` set.
- Not suitable: Vercel/Netlify (no persistent disk for SQLite).
