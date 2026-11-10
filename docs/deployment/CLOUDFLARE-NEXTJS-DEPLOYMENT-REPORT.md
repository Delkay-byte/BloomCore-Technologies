# Cloudflare Workers + OpenNext deployment report

Date: 10 November 2026

Repository: `Delkay-byte/BloomCore-Technologies`

Worker: `bloomcore-technologies-page`

Worker URL: `https://bloomcore-technologies-page.bloomcoretechnologies.workers.dev`

## A. Root cause

The Cloudflare build failed during OpenNext packaging with:

```text
Error: ENOENT: no such file or directory,
open '.next/standalone/.next/server/pages-manifest.json'
```

`next.config.ts` used `output: "export"`. Static export writes a completed
`out/` directory for Netlify and deliberately does not emit
`.next/standalone`. OpenNext Cloudflare packages the standalone server, so it
looked for `.next/standalone/.next/server/pages-manifest.json` and found
nothing. This is a build-mode mismatch, not a missing dependency or a stale
cache.

Fix: `output` now resolves to `"standalone"` for every build except Netlify's
own build environment, where it stays `"export"`:

```ts
const isNetlifyBuild = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  output: isNetlifyBuild ? "export" : "standalone",
  images: { unoptimized: true },
  // ...existing turbopack rules unchanged
};
```

Netlify sets `NETLIFY=true` automatically, so the existing Netlify site can
still rebuild the static `out` directory while the Cloudflare migration is being
verified. Cloudflare Workers Builds and local builds do not set that variable,
so they produce standalone output. The file keeps all existing configuration.

After a clean build:

```text
.next/standalone/.next/server/pages-manifest.json  exists
.next/standalone/server.js                         exists
.next/standalone/.next/server/                     app and pages manifests present
```

`output: "standalone"` resolved the missing-file error. No other build defect
was found. Turbopack and the Tailwind CSS loader rule were left untouched.

## B. Dependency compatibility

| Package | Before | After |
| --- | --- | --- |
| `next` | 16.4.3 | 16.4.6 |
| `eslint-config-next` | 16.4.3 | 16.4.6 |
| `@opennextjs/cloudflare` | not installed, downloaded in CI | 1.20.16 (dev, pinned) |
| `@opennextjs/aws` | transitive in CI | 4.1.15 (transitive) |
| `wrangler` | not installed, downloaded via `npx` | 4.160.0 (dev, pinned) |
| `react` | 19.3.0 | 19.3.0, unchanged |
| `react-dom` | 19.3.0 | 19.3.0, unchanged |

`@opennextjs/cloudflare@1.20.16` declares `next >=15.5.29 <16 || >=16.4.5`.
The installed 16.4.3 did not satisfy that range, which produced the reported
peer warning. Next.js 16.4.6 satisfies it and includes the 16.4.5 security
fixes.

Installation used plain `npm install --save-exact`, with no `--force` and no
`--legacy-peer-deps`. `npm ls` shows a single deduped graph:

```text
@opennextjs/cloudflare@1.20.16
  @opennextjs/aws@4.1.15
    next@16.4.6 deduped
  next@16.4.6 deduped
  wrangler@4.160.0 deduped
next@16.4.6
```

No canary, no major upgrade, no suppressed warnings.

`npm audit --omit=dev` reports 0 vulnerabilities. The remaining advisories are
in development-only tooling pulled in by Wrangler and OpenNext; `npm audit fix
--force` was not used.

## C. Configuration

### Next.js

- Output mode: `standalone`, except `export` when `NETLIFY=true`.
- `images.unoptimized: true` retained: the site serves static PNG assets and
  OpenNext is not given a Cloudflare Images binding.
- Turbopack CSS loader rule retained.

### OpenNext

`open-next.config.ts`:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
```

The site is fully prerendered, with no ISR or revalidation, so no R2
incremental cache and no image binding were added. No R2 bucket was invented.

### Wrangler

`wrangler.jsonc` is committed and is the only source of Worker configuration:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "bloomcore-technologies-page",
  "compatibility_date": "2026-11-10",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "bloomcore-technologies-page"
    }
  ],
  "observability": { "enabled": true }
}
```

This removes the previous automatic configuration loop: Wrangler no longer
discovers a framework project without committed settings and starts its own
interactive migration.

### Package scripts

```json
"build": "next build",
"start": "next start",
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
```

`start` previously served the static `out` directory with `serve`; it now uses
the standalone Next.js server. ESLint ignores `.open-next/**`, `.wrangler/**`
and `cloudflare-env.d.ts` so generated bundles are not linted as source.

### Cloudflare Workers Builds settings (owner-side, not in this repository)

The dashboard build configuration from the failed run still executes
`npm run build` followed by `npx wrangler deploy`. It must be changed to:

| Setting | Required value |
| --- | --- |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |

That sequence builds the Worker once and deploys the generated bundle with the
committed Wrangler configuration. Running `npm run build` and then
`wrangler deploy` deploys nothing, because `.open-next` does not exist.

### Environment variables

| Variable | Scope | Required | Value source |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | no | optional staging origin only; production origin is fixed in `src/lib/site.ts` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | build | no | set only if Search Console issues a token |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | build | no | set only if Bing issues a token |
| `CLOUDFLARE_API_TOKEN` | deploy | yes | owner-held token, never committed |

The contact form is a `mailto:` composer. It has no server endpoint, no email
provider and no runtime secret. The site uses no Worker secrets, so no
`.dev.vars` file was created or needed. `.dev.vars` is ignored by Git and must
never be committed. No Netlify environment value was copied blindly.

## D. Build results

Clean sequence performed:

```bash
npm ci
npm run build
npx opennextjs-cloudflare build
```

| Step | Result |
| --- | --- |
| `npm ci` | passed from committed `package-lock.json` |
| `npm run build` | passed, 19 routes, Next.js 16.4.6, Turbopack |
| `.next/standalone/.next/server/pages-manifest.json` | present |
| OpenNext packaging | passed, `OpenNext build complete` |
| `.open-next/worker.js` | present, 2278 bytes |
| `.open-next/assets` | 49 files, 1,695,473 bytes |
| `_redirects` in assets | present, parsed as 2 valid rules by Wrangler |

Route table from the build:

```text
/  /_not-found  /about  /contact  /founder  /privacy  /products
/products/maacash  /products/schemeknit  /products/tillproof  /resources
/resources/scheme-of-learning-to-weekly-lesson-plans
/resources/mobile-money-business-recordkeeping
/resources/electrical-shop-stock-control  /robots.txt  /services
/sitemap.xml  /work
```

## E. Local preview

`npm run preview` built the bundle and started the Workers runtime locally.

Route results, HTTP over the local Worker:

| Route | Status | Type |
| --- | --- | --- |
| `/` | 200 | HTML |
| `/about` | 200 | HTML |
| `/services` | 200 | HTML |
| `/products` | 200 | HTML |
| `/products/schemeknit` | 200 | HTML |
| `/products/maacash` | 200 | HTML |
| `/products/tillproof` | 200 | HTML |
| `/resources` | 200 | HTML |
| `/resources/scheme-of-learning-to-weekly-lesson-plans` | 200 | HTML |
| `/resources/mobile-money-business-recordkeeping` | 200 | HTML |
| `/resources/electrical-shop-stock-control` | 200 | HTML |
| `/contact` | 200 | HTML |
| `/privacy` | 200 | HTML |
| `/work` | 200 | HTML |
| `/founder` | 200 | HTML |
| `/sitemap.xml` | 200 | XML |
| `/robots.txt` | 200 | text |
| `/favicon.ico` | 200 | icon |
| `/apple-touch-icon.png` | 200 | PNG |
| `/products/bik-prestige` | 301 | `Location: /products/maacash` |
| `/products/bloomcore-one` | 301 | `Location: /products/maacash` |
| `/does-not-exist` | 404 | designed in-app page |

The two legacy product redirects were Netlify-only configuration. They are now
also declared in `public/_redirects`, which Cloudflare Workers static assets
parse at deploy time, so the migration does not break old links.

All 17 script and stylesheet references on the homepage returned 200. Metadata
checks: canonical `https://bloomcoretech.com`, `og:url` on the same origin, four
JSON-LD blocks. `robots.txt` still allows crawling, names `bloomcoretech.com`
and points at the canonical sitemap. The 404 page keeps the site header and
footer.

### Browser check of the local Worker

Headless Chrome against the local Worker, mobile viewport, consent banner
present:

| Check | Result |
| --- | --- |
| Google requests before consent | none |
| `gtm.js` after "Allow analytics" | exactly one, `GTM-PMZ6ZSVT` |
| `gtag/js` | none |
| GA4 collect | `tid=G-GDBL5SNHKL`, `gcs=G101` |
| Withdraw consent | `window["ga-disable-G-GDBL5SNHKL"] === "true"` |
| Requests after withdrawal | none |
| Console errors | none |

## F. Production deployment

| Item | Value |
| --- | --- |
| Worker name | `bloomcore-technologies-page` |
| Version ID | `029b00ba-43fe-4cd0-84ad-230d2ed94715` |
| Deployment URL | `https://bloomcore-technologies-page.bloomcoretechnologies.workers.dev` |
| Upload size | 5721.94 KiB, 1220.27 KiB gzip |
| Worker startup time | 15 ms |
| Bindings | `ASSETS`, `WORKER_SELF_REFERENCE` |

Deployed with `npx opennextjs-cloudflare deploy` after the verified build. The
Worker was then tested independently over HTTPS, outside the local runtime:

| Check | Result |
| --- | --- |
| All 15 HTML routes | 200 |
| `/sitemap.xml`, `/robots.txt`, `/favicon.ico`, `/apple-touch-icon.png` | 200, correct content types |
| `/products/bik-prestige`, `/products/bloomcore-one` | 301 to `/products/maacash` |
| Unknown path | 404 with designed page |
| Homepage response bytes | 111100, identical to local Worker |
| Canonical and `og:url` | `https://bloomcoretech.com` |
| JSON-LD | 4 blocks |
| GTM before consent | none |
| `gtm.js` after consent | `GTM-PMZ6ZSVT`, single request |
| `gtag/js` | none |
| GA4 collect | `tid=G-GDBL5SNHKL` |
| Withdraw consent | disable flag set, no further Google requests |
| Console errors | none |

The production Cloudflare Worker therefore serves the same HTML as the local
Worker and preserves the consent-gated analytics behaviour.

## G. DNS and domain status

The custom domain has **not** been connected. `bloomcoretech.com` still resolves
to Netlify:

```text
bloomcoretech.com  A  35.157.26.135
bloomcoretech.com  A  63.176.8.218
HTTP/1.1 200 OK
Server: Netlify
```

`GET /accounts/.../workers/domains` returned no custom domains and
`GET /zones/.../workers/routes` returned no Worker routes. The available API
token can deploy Workers but cannot read or edit zone DNS records, so the
cutover cannot be completed from this workspace. No DNS record was changed and
the live site was not interrupted.

Owner steps for the cutover, in order:

1. In the Cloudflare dashboard open **Workers & Pages → bloomcore-technologies-page →
   Settings → Domains & Routes → Add → Custom domain**.
2. Add `bloomcoretech.com`. Let Cloudflare create or replace the apex record.
   Confirm the existing record set first and do not remove unrelated records.
3. Add `www.bloomcoretech.com` only if the current `www` redirect is preserved.
4. Re-test the apex over HTTPS after attachment, then update the Netlify DNS
   records only after the Worker answers on the custom domain.
5. Keep the Netlify site and its deploy history until the custom domain has
   been verified for at least one full day.

Preserve MX, SPF, DKIM, DMARC, Search Console and Bing verification, and the
SchemeKnit and MaaCash product subdomain records. None of them were touched.

## H. Outstanding owner actions

1. Change the Cloudflare Workers Builds commands to
   `npx opennextjs-cloudflare build` and `npx wrangler deploy`.
2. Add the `bloomcoretech.com` custom domain to the Worker with a token or
   dashboard session that can manage zone DNS.
3. Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` as Worker build variables if those
   tokens exist.
4. Keep Netlify live until the custom domain is verified, then retire it.

## Classification

| Stage | State |
| --- | --- |
| Root cause identified and fixed | yes — static export replaced by standalone |
| Dependency compatibility resolved | yes — Next.js 16.4.6, OpenNext 1.20.16 |
| Clean Next.js build | passed |
| Standalone output verified | passed |
| OpenNext packaging | passed |
| Local Workers preview | passed, all routes and analytics |
| Worker deployment | passed, version `029b00ba-43fe-4cd0-84ad-230d2ed94715` |
| Deployed Worker independently tested | passed over HTTPS |
| Custom domain cutover | **not done — DNS permission and owner action required** |
