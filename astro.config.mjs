// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { readFileSync } from "node:fs";

/**
 * Two ways to run this site:
 *  - Local / Node (default): SQLite file (data.db) + uploads/ folder. `npm run dev`, `npm run build`
 *  - Cloudflare: D1 database + R2 media bucket. `npm run build:cf`, `npm run deploy:cf`
 *    (or connect the repo in Cloudflare with build command `npm run build:cf`)
 */
const onCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

// Keep in sync with site.url in src/site.config.ts
const SITE = "https://example.com";

// Pages render from EmDash (src/pages/[...slug].astro), so list the template's pages for sitemap-index.xml.
// EmDash also serves /sitemap.xml, which includes pages added in the admin.
const seed = JSON.parse(readFileSync(new URL("./.emdash/seed.json", import.meta.url), "utf8"));
const pageUrls = seed.content.pages.map((p) => `${SITE}/${p.slug === "home" ? "" : `${p.slug}/`}`);

export default defineConfig({
  site: SITE,
  trailingSlash: "ignore",

  // EmDash reads content at request time, so the site runs as a server. Admin: /_emdash/admin
  output: "server",
  adapter: onCloudflare ? cloudflare() : node({ mode: "standalone" }),

  integrations: [
    react(), // required by the EmDash admin UI
    emdash(
      onCloudflare
        ? {
            database: d1({ binding: "DB" }),
            storage: r2({ binding: "MEDIA" }),
          }
        : {
            database: sqlite({ url: "file:./data.db" }),
            storage: local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
          },
    ),
    sitemap({ customPages: pageUrls }),
  ],
  vite: { plugins: [tailwindcss()] },
});
