// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import react from "@astrojs/react";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
  // Keep in sync with site.url in src/site.config.ts
  site: "https://example.com",
  trailingSlash: "ignore",

  // EmDash reads content at request time, so the site runs as a Node server
  // (not static files). Admin lives at /_emdash/admin
  output: "server",
  adapter: node({ mode: "standalone" }),

  integrations: [
    react(), // required by the EmDash admin UI
    emdash({
      database: sqlite({ url: "file:./data.db" }),
      storage: local({
        directory: "./uploads",
        baseUrl: "/_emdash/api/media/file",
      }),
    }),
    sitemap(),
  ],
  vite: { plugins: [tailwindcss()] },
});
