
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";

export default defineConfig({
  // Update to the actual site address when available
  site: "https://example.com",
  trailingSlash: "ignore",

  output: "server",
  adapter: cloudflare(),

  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
    }),
    sitemap(),
  ],

  vite: { plugins: [tailwindcss()] },
});
