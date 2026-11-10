import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The corporate site is fully prerendered: every route is static and no page
// uses ISR or revalidation. No R2 incremental cache or image binding is
// required, so the default configuration is used deliberately.
export default defineCloudflareConfig();
