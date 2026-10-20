# WBDS T1 Website Template (Astro + EmDash)

The T1 website template, rebuilt in Astro with the EmDash CMS. Clients edit the home page (text, photos, buttons),
blog posts, testimonials and the blog sidebar themselves, right on the page or at `/_emdash/admin`.
Everything else (layouts, design, other pages' copy) lives in this repo and is changed via pull request.

Pages: Home, About, Services, Program, Blog, Blog post, Contact, Booking, Free guide, Terms, Disclaimer, Privacy Policy, 404.

**New client site?** Follow "Playbook A" in the WBDS runbook (Notion: *WordPress → Astro + EmDash Website Build Runbook*).

## Run it

Requires **Node 22.16+** (`node -v`).

```bash
npm install
npx emdash secrets generate --write .env   # once per site; back this file up, never commit it
npm run dev                                 # http://localhost:4321
```

Then open **http://localhost:4321/_emdash/admin**. The setup wizard asks for the site title, an admin account and a passkey.
Choose **Sample content** to load the home page copy, 3 sample posts + 3 testimonials from `.emdash/seed.json`.

`data.db` (content) and `uploads/` (media) are created locally and are git-ignored.

## Where everything lives

| What | Where |
|---|---|
| Brand name, nav, CTA, socials, form endpoints, booking embed | `src/site.config.ts` |
| Colors and fonts | `@theme` block at the top of `src/styles/global.css` |
| Google Fonts link (if fonts change) | `src/layouts/BaseLayout.astro` |
| Home page copy, photos, button text + links | EmDash: click **Edit** on the home page, or admin → **Homepage** (starting copy + fallback: `src/data/home.ts`) |
| Footer columns + newsletter copy, free-guide band, "ready?" band, in-post CTA | `src/data/shared.ts` |
| Free guide page (`/free-guide`) + legal pages | `src/data/pages.ts` |
| About page copy | `src/data/about.ts` |
| Services page intro + FAQ | `src/data/services.ts` |
| Offers (services page, contact dropdown; home rows start from these) | `src/data/offers.ts` |
| Testimonials (shared) | EmDash admin → Testimonials (falls back to `src/data/testimonials.ts` if empty) |
| Contact + booking copy, contact form fields | `src/data/contact.ts` |
| Program sales page (`/program`) | `src/data/program.ts` (duplicate it + `src/pages/program.astro` for more programs) |
| Blog sidebar boxes | EmDash admin → **Widgets → Blog Sidebar** |
| Blog posts | EmDash admin → Posts |
| Production URL | `site.url` in `site.config.ts` **and** `site` in `astro.config.mjs` |
| Worker, database and media bucket names | `wrangler.jsonc` (lowercase + dashes, e.g. `livable-nutrition`) |

### Images
Every image is optional. Until a `src` is set, a labeled placeholder renders, so layouts can be reviewed
without stock photos. To add a photo, put the file in `public/images/` and set it in the data file:

```ts
image: { src: "/images/headshot.jpg", alt: "Client smiling in her kitchen" }
```

`position` controls which part of a photo stays visible when it's cropped, e.g. `position: "right"` or `"70% 30%"`.

Default photos live in `public/images/t1/` (the WBDS T1 stock set, resized to WebP). Replace them per client,
keeping the same file names, or point the data files at new ones.

### Forms
- **Newsletter** (footer + home): set `site.newsletter.action` to the Kit form URL (`https://app.kit.com/forms/FORM_ID/subscriptions`).
  Field names already match Kit.
- **Free guide** (`/free-guide`): set `site.optin.action` to the freebie's own Kit form.
- **Contact:** set `site.contactForm.action` to the form endpoint.

## Components

| Component | Used for |
|---|---|
| `Header`, `Footer`, `OptIn` | Site header (nav + dropdowns), 4-column footer, free-guide band above it |
| `HeroBanner`, `PageBanner` | Home photo hero; page title band (photo or solid teal) |
| `SplitSection` | Text + photo side by side; `ratio` locks the photo shape, `fullBleed` runs it to the screen edge |
| `ServiceRows`, `OfferBlock` | Home offer rows; Services page offer sections (both read `offers.ts`) |
| `Testimonials`, `Newsletter`, `StepsBand`, `CTABand`, `CenterBand` | Shared bands |
| `LatestPosts`, `PostCard`, `PostImage`, `BlogSidebar` | Blog pieces |
| `InfoCards`, `IconFeatures`, `PhotoPanel`, `PricingCards`, `FaqAccordion` | Program + Services sections |
| `LinkCards`, `CheckList`, `SectionHeading`, `SocialIcon`, `Media`, `LegalPage` | Small building blocks |

## How EmDash is wired

| File | Purpose |
|---|---|
| `astro.config.mjs` | `output: "server"`, React (admin UI), `emdash()`: SQLite + local media on your computer, D1 + R2 on Cloudflare |
| `src/live.config.ts` | Registers the EmDash live collection loader |
| `src/lib/cms.ts` | **All CMS reads** (posts, testimonials, categories, tags, archives, search). Components never call EmDash directly |
| `src/worker.ts` + `wrangler.jsonc` | Cloudflare Worker entry + database/media bindings |
| `src/components/BlogSidebar.astro` | Blog post sidebar: renders the EmDash **Blog Sidebar** widgets in the T1 style |
| `.emdash/seed.json` | Content model (Posts, Testimonials) + sample content applied by the setup wizard |

## Editing the home page (clients)

1. Log in at `<site>/_emdash/admin`, then open the website. A bar with an **Edit mode** switch sits at the bottom.
2. Turn on **Edit mode**. Click any text to change it; press Enter (or click away) to save. Esc cancels.
3. Click a photo (or an empty part of the top banner) to **Upload** a new one, pick one from the library (**Replace**),
   or change its alt text.
4. Under each button, a dark **Button goes to:** label shows its link (edit mode only). Click it to change it.
5. Click **Publish**. Until then, changes are a draft that only logged-in editors see.

The same fields are in admin → **Homepage** (one entry, grouped by section), along with revision history.
Testimonials edited on the page go live as soon as they're saved (that collection has no draft step).

How it's built: `src/pages/index.astro` reads the single "home" entry through `getHomepage()` in `src/lib/cms.ts`
and spreads `edit(field)` onto each element (EmDash's visual editing). Any field missing from EmDash falls back to
`src/data/home.ts`, so the page never breaks. Text fields are edited in place; image fields open the photo picker.

**Existing site, set up before the Homepage existed?** Seeds only apply to a fresh database, so add it once with
`EMDASH_TOKEN=... node scripts/add-homepage-content.mjs https://the-site` (token: admin → Settings → API Tokens,
scopes `schema:read`, `schema:write`, `content:read`, `content:write`). It only adds what's missing and never changes existing content.
Until it's run, the home page shows the `src/data/home.ts` copy.

**Deploys never touch content.** Content and uploads live in the D1 database and R2 bucket, not in the repo, so
pushing code (or redeploying) can't overwrite what clients edited. Changing `home.ts` after launch only changes the
fallback; edit the live copy in EmDash instead.

**Making more sections editable** (offers, FAQ, page copy): add a collection in the admin, snapshot it with
`npx emdash export-seed > .emdash/seed.json`, add a getter in `src/lib/cms.ts` with a data-file fallback,
and swap the import in the component. Seeds only apply to a fresh database.

**Importing a WordPress site:** export from WordPress (Tools → Export → All content), then upload the XML at
`/_emdash/admin/import/wordpress`. Set up media storage first and keep the old site online until media finishes.

## Blog

- `/blog`: 9 posts per page with page numbers; `?q=` searches; `?category=`, `?tag=` and `?date=` filter.
- Post pages: teal title panel + featured photo, article, "let's work together" CTA box, previous/next links.
- Sidebar: whatever is in **Widgets → Blog Sidebar** (see below). Categories and tags are managed in the admin.

## Blog sidebar widgets

The sidebar is 100% controlled in the admin under **Widgets → Blog Sidebar**: add, remove and drag boxes to reorder.
Every widget type gets the T1 look (teal title bar, white card):

| Widget | Shows | Links to |
|---|---|---|
| Content (rich text) | Any box: Meet the Author, a freebie (put an image at the top + a link), an ad... | whatever you link |
| Menu | A titled link list from an EmDash menu | menu items |
| Search | T1 search bar | `/blog?q=` |
| Categories | Category list | `/blog?category=` |
| Tags | Tag list (tag posts in the editor) | `/blog?tag=` |
| Recent Posts | Image + title cards (thumbnails off = plain list) | the post |
| Archives | Months or years with post counts | `/blog?date=2026-10` |

New sites start with: Search, Meet the Author, View Categories, Download My Free Guide, View Recent Posts
(from `.emdash/seed.json`). No widgets = no sidebar boxes.

## Image sizes (from the T1 V1 designs)

Upload photos at these sizes (or the same shape). Every slot crops to this shape, so other sizes still work.

| Where | Size (px) |
|---|---|
| Home hero | 2250 × 944 |
| Home offer rows | 1565 × 1282 |
| Home "hi there" photo | 1563 × 1126 |
| Blog featured images (cards, post header, Keep Exploring cards) | 1143 × 754 |
| Free guide band (every page) | 1155 × 595 |
| About intro / Program intro | 1943 × 1284 |
| About Fun Facts + Education | 1563 × 1409 |
| Services banner | 2157 × 713 |
| Services offer photos | 1943 × 1943 (square) |
| Program "Who is it for" | 1160 × 950 |
| Program "How it works" cards | 820 × 462 |
| Program "What's included" / "What to expect" backgrounds | 1680 × 1132 |
| Program "Meet your coach" | 1563 × 1126 |
| Contact photo | 820 × 835 |
| Blog sidebar widget images (author, freebie) | 1160 × 596 |

## Deploying (Cloudflare)

Every push to `main` builds and deploys automatically (`.github/workflows/deploy-cloudflare.yml`).

**One time per Cloudflare account (already done for WBDS):** Workers Paid plan, R2 turned on, a workers.dev subdomain,
and an "Edit Cloudflare Workers" API token.

**Per site:**
1. Repo → Settings → Secrets and variables → Actions: add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Rename `name`, `database_name` and `bucket_name` in `wrangler.jsonc` (the first deploy creates them).
3. Cloudflare → the worker → Settings → Variables and Secrets, both as **Secret** (plain text gets wiped on deploy):
   `EMDASH_ENCRYPTION_KEY` (`npx emdash secrets generate`) and `EMDASH_SITE_URL` (exact site address, no trailing slash).
4. Custom domain: add it to the Cloudflare account, uncomment `routes` in `wrangler.jsonc`, update `EMDASH_SITE_URL`.
5. Open `<site>/_emdash/admin` and run setup **on the final address**: passkeys only work on the address they were made on.
