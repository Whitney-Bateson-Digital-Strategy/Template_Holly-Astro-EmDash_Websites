# WBDS T1 Website Template (Astro + EmDash)

The T1 website template, rebuilt in Astro with the EmDash CMS. Clients edit their whole site themselves at
`/_emdash/admin` or right on the page: every page's text, photos, buttons and blocks (add, remove, reorder),
their services, menus, header, footer, blog posts and testimonials. The design (layouts, colors, fonts, spacing)
lives in this repo and is changed via pull request, so clients can't break it.

Pages: Home, About, Services, Program, Blog, Blog post, Contact, Booking, Free guide, Terms, Disclaimer, Privacy Policy, 404,
plus any page a client adds in the admin.

**New client site?** Follow "Playbook A" in the WBDS runbook (Notion: *WordPress → Astro + EmDash Website Build Runbook*).

## Run it

Requires **Node 22.16+** (`node -v`).

```bash
npm install
npx emdash secrets generate --write .env   # once per site; back this file up, never commit it
npm run dev                                 # http://localhost:4321
```

Then open **http://localhost:4321/_emdash/admin**. The setup wizard asks for the site title, an admin account and a passkey.
Choose **Sample content** to load the pages, services, menus, 3 sample posts + 3 testimonials from `.emdash/seed.json`.

`data.db` (content) and `uploads/` (media) are created locally and are git-ignored.

## Where everything lives

| What | Where |
|---|---|
| Page copy, photos, buttons and blocks (every page but the blog) | EmDash → **Pages** (or Edit mode on the page) |
| Services (home rows, Services page, contact form dropdown) | EmDash → **Services** |
| Business name, logo, announcement bar, header button, free guide band, footer newsletter text, social links, blog post CTA box | EmDash → **Site-wide content** |
| Header menu (+ dropdowns), footer link columns, footer legal links | EmDash → **Menus** ("Main menu", "Work With Me", "Resources", "Footer legal links") |
| Testimonials, blog posts, blog sidebar | EmDash → Testimonials, Posts, **Widgets → Blog Sidebar** |
| Starting content for new sites (and the fallback before a site has it) | `.emdash/seed.json` |
| Form endpoints, default booking embed, footer credit | `src/site.config.ts` |
| Colors and fonts | `@theme` block at the top of `src/styles/global.css` |
| Text colors that must pass contrast (accent text, text on accent, text on gold) | `--color-accent-text`, `--color-on-accent`, `--color-on-gold` in the same `@theme` block |
| Google Fonts link (if fonts change) | `src/layouts/BaseLayout.astro` |
| Production URL | `site.url` in `site.config.ts` **and** `SITE` in `astro.config.mjs` |
| Worker, database and media bucket names | `wrangler.jsonc` (lowercase + dashes, e.g. `livable-nutrition`) |

### Images
Photos are EmDash images: clients upload or pick them from the media library, and set alt text. The starting photos
are the WBDS T1 stock set in `public/images/t1/` (resized to WebP), referenced by path from `.emdash/seed.json`
(`{ "id": "", "provider": "external", "src": "/images/t1/hero.webp", "alt": "…", "focalX": 0.7 }`; keep
`"provider": "external"` or EmDash drops the alt text and focal point on the next save). An empty photo shows a
labeled placeholder.

### Forms
- **Newsletter** (footer + Newsletter blocks): set `site.newsletter.action` to the Kit form URL (`https://app.kit.com/forms/FORM_ID/subscriptions`).
  Field names already match Kit.
- **Free guide** (`/free-guide`, and the free guide band in "Sign-up form" mode): set `site.optin.action` to the freebie's own Kit form.
- **Contact:** set `site.contactForm.action` to the form endpoint. The form's fields are in `src/components/sections/Contact.astro`.

## Pages and blocks

Every page except the blog is an entry in EmDash → **Pages**: a name, SEO title/description, and a list of **blocks**
(the `sections` field). `src/pages/[...slug].astro` renders them; `/` is the page with slug `home`. Clients add, remove,
reorder and duplicate blocks in the admin, and can add new pages (they appear at `/<slug>` once published; add them
to the menu under Menus). Hidden-until-published, with revision history.

Each block type is defined in `.emdash/seed.json` → `blockTypes` and rendered by a component in
`src/components/sections/` (mapped in `src/components/Sections.astro`):

| Block | Component | Used on |
|---|---|---|
| Big photo banner | `Hero` | Home |
| Page title banner | `PageBanner` | Services, Contact, Booking, legal pages |
| Page intro with photo | `PageIntro` | About, Program |
| Centered intro / Centered intro on sand | `Intro`, `SandIntro` | Home, Services |
| Text and photo | `Split` | Home, About, Program |
| Two columns of text | `TwoColumns` | About, Program |
| Text | `Text` | Legal pages |
| Services (photo rows) / Services (full details) | `ServiceRows`, `ServicesDetail` | Home, Services |
| Testimonials | `Testimonials` | Home, Services, Program |
| Call-to-action box / Teal band / Newsletter sign-up | `CtaBand`, `CenterBand`, `Newsletter` | About, Services, Program, Home |
| Steps / Photo cards / Link cards / Check-mark highlights / Photo with text panel | `Steps`, `InfoCards`, `LinkCards`, `IconFeatures`, `PhotoPanel` | Home, About, Program |
| Questions (accordion) / Pricing | `Faq`, `Pricing` | Services, Program |
| Latest blog posts | `LatestPosts` | Home |
| Contact form / Booking calendar / Free guide sign-up | `Contact`, `Booking`, `GuideSignup` | Contact, Booking, Free guide |

**Colored words in headlines:** in any block headline (and the hero headline and centered intro subheading), put
`*asterisks*` around the words to color: `Nutrition that *fits your life*`. One field, no splitting. In edit mode the
asterisks stay visible so editors keep them. The color is picked to pass contrast on that block's background
(`src/components/Accent.astro`). Older sites' separate "second line" / "colored part" fields still render.

Spacing is automatic: a white block right after another white block skips its top padding (as in the T1 designs).
Text that can be long (paragraphs, lists, quotes) is rich text (`src/components/RichText.astro`), so clients get bold,
italics, links and lists; headlines and button text are plain so they always match the design.

**Adding a block type:** add it to `blockTypes` and to the `allowedTypes` of the Pages `sections` field in
`.emdash/seed.json`, write its component in `src/components/sections/`, map it in `Sections.astro`, and add it to
existing sites with the script below (it adds missing block types). Changing an existing type's fields: see
"Change a block schema" in the EmDash docs (breaking changes need a new version).

## Accessibility (WCAG 2.2 AA)

The template passes axe (WCAG 2.2 AA + best practices) on every page at desktop and mobile widths with the T1 colors.
Built in: one H1 per page, no skipped heading levels, alt text from EmDash, skip-to-content link, labeled forms,
keyboard-friendly menus and FAQ, visible focus outlines, named landmarks, 24px+ tap targets, reduced motion for
visitors who ask for it, and JSON-LD structured data (business name, description, socials).

**When you rebrand:** contrast depends on the client's colors. After changing `@theme`, run axe DevTools on Home,
About, Services and Program. If text fails, adjust `--color-accent-text` (darker), or `--color-on-accent` /
`--color-on-gold` (switch between ink and paper). Don't put accent-colored text on light backgrounds directly:
use `text-accent-text`.

## Editing on the page (clients)

1. Log in at `<site>/_emdash/admin`, then click **View Site**. A bar with an **Edit mode** switch sits at the bottom.
2. Turn on **Edit mode**. Click any text to change it; press Enter (or click away) to save. Esc cancels.
   Paragraphs and lists open a rich-text editor (bold, italics, links, lists).
3. Click a photo (or an empty part of a photo banner) to **Upload** a new one, pick one from the library (**Replace**),
   or change its alt text.
4. Under each button, a dark **Button goes to:** label shows its link (edit mode only). Click it to change it.
5. Click **Publish**. Until then, changes are drafts that only logged-in editors see. One click publishes everything
   changed on that page (the page, Site-wide content and Services). Testimonials and menus go live as soon as they're saved.

How it's built: EmDash's visual editing edits any element carrying `data-emdash-ref`. Components get an `Edit`
helper (`src/lib/edit.ts`) and spread `e.attrs("field")` / `e.image("field")`; outside edit mode they produce nothing.
EmDash saves one top-level field at a time, so for fields inside blocks and list items (`sections.<key>.title`,
`socials.0.url`) `src/scripts/edit-adapter.js` (loaded only in edit mode) turns the save into an update of the whole
field, and makes Publish publish every entry on the page. If it ever fails, a click opens the admin form instead.
Clients should have the **Editor** role: they can edit and publish everything but can't change content types,
settings, plugins or users.

**Existing site, set up before its pages were editable?** Seeds only apply to a fresh database, so add everything once:
GitHub → Actions → **Add editable site content** → Run workflow (needs the `EMDASH_TOKEN` repo secret), or locally
`EMDASH_TOKEN=... node scripts/add-site-content.mjs https://the-site`. Token: admin → Settings → API Tokens, created
by an Admin, with the scopes `schema:read`, `schema:write`, `content:read`, `content:write`. It only adds what's missing
and never changes existing content; edits made in the earlier single "Homepage" entry are copied into the new Home page.
Until it's run, pages show the starting content from `.emdash/seed.json` and can't be edited.

**Deploys never touch content.** Content and uploads live in the D1 database and R2 bucket, not in the repo, so
pushing code (or redeploying) can't overwrite what clients edited. Changing `.emdash/seed.json` after launch only changes
new sites and the fallback; edit the live copy in EmDash instead.

**Importing a WordPress site:** export from WordPress (Tools → Export → All content), then upload the XML at
`/_emdash/admin/import/wordpress`. Set up media storage first and keep the old site online until media finishes.

## How EmDash is wired

| File | Purpose |
|---|---|
| `astro.config.mjs` | `output: "server"`, React (admin UI), `emdash()`: SQLite + local media on your computer, D1 + R2 on Cloudflare |
| `src/live.config.ts` | Registers the EmDash live collection loader |
| `src/lib/cms.ts` | **All CMS reads** (pages, services, site-wide content, menus, posts, testimonials, taxonomies, search), with seed fallbacks |
| `src/lib/edit.ts`, `src/scripts/edit-adapter.js` | On-page editing attributes, and the edit-mode adapter for fields inside blocks |
| `src/worker.ts` + `wrangler.jsonc` | Cloudflare Worker entry + database/media bindings |
| `src/components/BlogSidebar.astro` | Blog post sidebar: renders the EmDash **Blog Sidebar** widgets in the T1 style |
| `.emdash/seed.json` | Content model (block types, Pages, Services, Site-wide content, Posts, Testimonials, menus) + starting content |

## Blog

- `/blog`: 9 posts per page with page numbers; `?q=` searches; `?category=`, `?tag=` and `?date=` filter.
- Post pages: teal title panel + featured photo, article, "let's work together" CTA box (Site-wide content), previous/next links.
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
Each photo field in the admin shows its size too.

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
