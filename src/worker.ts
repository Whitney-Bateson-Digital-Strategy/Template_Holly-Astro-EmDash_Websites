// Cloudflare Worker entry point (only used for Cloudflare deploys; see wrangler.jsonc).
// Adds EmDash's scheduled handler so scheduled posts publish on time.
import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
  ...handler,
  scheduled: createScheduledHandler(),
};
