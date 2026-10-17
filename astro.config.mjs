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

/**
 * Two ways to run this site:
 *  - Local / Node (default): SQLite file (data.db) + uploads/ folder. `npm run dev`, `npm run build`
 *  - Cloudflare: D1 database + R2 media bucket. `npm run build:cf`, `npm run deploy:cf`
 *    (or connect the repo in Cloudflare with build command `npm run build:cf`)
 */
const onCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

export default defineConfig({
  // Keep in sync with site.url in src/site.config.ts
  site: "https://example.com",
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
    sitemap(),
  ],
  vite: { plugins: [tailwindcss()] },
});
