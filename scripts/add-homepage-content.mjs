/**
 * Adds the editable Homepage to a site that was set up before it existed.
 *
 * New sites get it from .emdash/seed.json in the setup wizard. Seeds only apply to a fresh database, so for an
 * existing site this script copies the "homepage" collection and its starting content from the seed over the
 * EmDash API. It only ever ADDS what's missing: existing collections, fields and content are never changed.
 *
 *   EMDASH_TOKEN=ec_pat_... node scripts/add-homepage-content.mjs https://your-site.workers.dev
 *   node scripts/add-homepage-content.mjs http://localhost:4321          (local dev, no token needed)
 *   add --dry-run to see what would be added
 *
 * Token: admin → Settings → API Tokens, with the "schema:write" and "content:write" scopes (or "admin").
 */
import { readFile } from "node:fs/promises";
import { EmDashClient } from "emdash/client";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const url = args.find((a) => !a.startsWith("--")) ?? process.env.EMDASH_URL;
if (!url) {
  console.error("Usage: node scripts/add-homepage-content.mjs <site url> [--dry-run]");
  process.exit(1);
}
const token = process.env.EMDASH_TOKEN;
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url);
if (!token && !isLocal) {
  console.error("Set EMDASH_TOKEN (admin → Settings → API Tokens) to update a deployed site.");
  process.exit(1);
}

const seed = JSON.parse(await readFile(new URL("../.emdash/seed.json", import.meta.url), "utf8"));
const def = seed.collections.find((c) => c.slug === "homepage");
const content = seed.content?.homepage?.[0];
const client = new EmDashClient({ baseUrl: url, token, devBypass: !token && isLocal });
const log = (msg) => console.log(`${dryRun ? "[dry run] " : ""}${msg}`);

const existing = (await client.collections()).find((c) => c.slug === "homepage");
if (!existing) {
  log(`Creating collection "${def.label}"`);
  if (!dryRun) {
    const { fields, ...collection } = def;
    await client.createCollection(collection);
  }
}

const have = existing ? new Set((await client.collection("homepage")).fields.map((f) => f.slug)) : new Set();
let added = 0;
for (const [i, field] of def.fields.entries()) {
  if (have.has(field.slug)) continue;
  log(`Adding field ${field.slug}`);
  if (!dryRun) await client.createField("homepage", { ...field, sortOrder: i });
  added++;
}
if (existing) log(added ? `Added ${added} missing field(s); existing fields untouched` : "All fields already exist");

const entries = existing ? (await client.list("homepage", { limit: 10 })).items : [];
if (entries.some((e) => e.slug === content.slug)) {
  log(`Homepage content already exists; left as is`);
} else {
  log(`Creating the homepage entry with the template's current copy`);
  if (!dryRun) {
    const item = await client.create("homepage", { slug: content.slug, data: content.data });
    await client.publish("homepage", item.id);
  }
}
log("Done.");
