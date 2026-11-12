// Netlify fallback build prep.
//
// The Netlify site is a static redirect host, not the live site. It builds
// next.config.ts with `output: "export"`, which cannot include route handlers
// or the Cloudflare Access dashboard — those are Cloudflare-only. Remove them
// from the build tree before `next build` so the fallback keeps building.
//
// Runs only in Netlify's ephemeral build environment, and only prunes paths
// that exist on the lead-management branch.
import { rm } from "node:fs/promises";

const cloudflareOnly = ["src/app/api", "src/app/internal", "src/components/internal"];

for (const path of cloudflareOnly) {
  await rm(path, { recursive: true, force: true });
}
