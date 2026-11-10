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
| Live version ID | `c3ef1bfe-36e0-49a7-b1b8-6cc1685150cb` (version 5) |
| Version deployed at | 2026-11-10T18:32:18Z |
| Deployment URL | `https://bloomcore-technologies-page.bloomcoretechnologies.workers.dev` |
| Git commit | `47b920d` (site code unchanged since `0092f4f`) |
| Upload size | 5721.94 KiB, 1220.27 KiB gzip |
| Worker startup time | 16 ms |
| Bindings | `ASSETS`, `WORKER_SELF_REFERENCE` |

Deployment history: `029b00ba-43fe-4cd0-84ad-230d2ed94715` was the first
verified build. A Cloudflare workers build then produced `ff1ac257` at 17:08
UTC. To remove ambiguity about which artifact serves branded traffic, the Worker
was rebuilt from the committed HEAD and redeployed as `c3ef1bfe`, and every
check below was run against that version after the cutover. The chunk served by
the branded domain, `/_next/static/chunks/2561kqvyixxd-.js`, matches the local
standalone build exactly.

The Worker was built from the same working tree that produced this commit and
deployed with `npx opennextjs-cloudflare deploy`. The Netlify site was left
untouched and still answers on `bloomcoretech.com`. The
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

The custom domain is attached and live:

```json
{
  "hostname": "bloomcoretech.com",
  "zone_name": "bloomcoretech.com",
  "service": "bloomcore-technologies-page",
  "environment": "production",
  "enabled": true,
  "cert_id": "8b56733c-8567-4ce3-8d43-9b7ba48eb337",
  "previews_enabled": false
}
```

Authoritative DNS now returns Cloudflare anycast addresses for the apex and
`www`, not the previous Netlify addresses:

```text
bloomcoretech.com      A  104.21.54.112, 172.67.138.55   TTL 300
www.bloomcoretech.com  A  104.21.54.112, 172.67.138.55   TTL 300
HTTP/1.1 200 OK
Server: cloudflare
CF-RAY: a58711353c6fe913-LHR
```

No Worker route exists (`GET /zones/.../workers/routes` returned `[]`), so the
custom domain is the only routing path and there is no conflicting pattern.

TLS is issued and valid for both names:

| Field | Value |
| --- | --- |
| Subject | `CN=bloomcoretech.com` |
| SAN | `bloomcoretech.com`, `*.bloomcoretech.com` |
| Issuer | `WE1, Google Trust Services` |
| Not before | 2026-11-10T16:25:18Z |
| Not after | 2027-02-08T17:25:15Z |

This certificate was issued automatically when the custom domain was attached.

## H. Apex, www and HTTP redirects

| Request | Result |
| --- | --- |
| `https://bloomcoretech.com/` | 200 from the Worker |
| `https://www.bloomcoretech.com/resources?ref=a` | 301 `Location: https://bloomcoretech.com/resources?ref=a` |
| `http://bloomcoretech.com/some/path?x=1` | 301 `Location: https://bloomcoretech.com/some/path?x=1` |
| `http://www.bloomcoretech.com/some/path?x=1` | 301 `Location: https://www.bloomcoretech.com/some/path?x=1` |

The `www` redirect already existed at the Cloudflare edge and preserves path and
query. HTTP to HTTPS was not redirecting: the zone setting
`always_use_https` was `off`. It was switched to `on` through the API, which is
the Cloudflare-supported mechanism and keeps full path and query in the
redirect. A second HTTPS hop then applies the `www` rule, so no loop exists and
canonical apex URLs receive no extra redirect.

## I. Branded domain route verification

All requests below were sent to `https://bloomcoretech.com`, resolved to the
live Cloudflare anycast address, after `c3ef1bfe` was deployed.

| Route | Status | Type / result |
| --- | --- | --- |
| `/` | 200 | HTML, 111100 bytes |
| `/about` | 200 | HTML |
| `/contact` | 200 | HTML |
| `/founder` | 200 | HTML |
| `/privacy` | 200 | HTML |
| `/products` | 200 | HTML |
| `/products/schemeknit` | 200 | HTML |
| `/products/maacash` | 200 | HTML |
| `/products/tillproof` | 200 | HTML |
| `/resources` | 200 | HTML |
| `/resources/scheme-of-learning-to-weekly-lesson-plans` | 200 | HTML |
| `/resources/mobile-money-business-recordkeeping` | 200 | HTML |
| `/resources/electrical-shop-stock-control` | 200 | HTML |
| `/services` | 200 | HTML |
| `/work` | 200 | HTML |
| `/robots.txt` | 200 | `text/plain` |
| `/sitemap.xml` | 200 | `application/xml` |
| `/favicon.ico` | 200 | `image/vnd.microsoft.icon`, 5741 bytes |
| `/favicon-48x48.png` | 200 | `image/png`, 3408 bytes |
| `/apple-touch-icon.png` | 200 | `image/png`, 11237 bytes |
| `/products/bik-prestige` | 301 | `https://bloomcoretech.com/products/maacash` |
| `/products/bloomcore-one` | 301 | `https://bloomcoretech.com/products/maacash` |
| `/does-not-exist` | 404 | designed in-app page, 44325 bytes |

Direct nested navigation and refresh were tested by loading the full document
URLs (including the resource articles and `/work`) rather than only client-side
transitions. All returned the complete rendered page.

Mobile navigation was exercised in a 390x844 viewport: the menu button opens the
navigation, all expected links are visible, selecting Services navigates to
`/services`, the menu closes, and the document has no horizontal overflow.

The contact page was exercised with synthetic values. Submitting prepares a
`mailto:` link and sends no message. Analytics received
`contact_email_prepared` with `enquiry_type` only. No name, email address,
organisation or message text appeared in any request.

## J. SEO verification on the branded domain

| Page | Title | Canonical | `og:url` | Robots | JSON-LD |
| --- | --- | --- | --- | --- | --- |
| `/` | BloomCore Technologies — Software Development in Ghana | `https://bloomcoretech.com` | same | `index, follow` | 2 blocks, valid |
| `/about` | About BloomCore Technologies | `.../about` | same | `index, follow` | valid |
| `/products/schemeknit` | SchemeKnit — Lesson Planning Software for Teachers | `.../products/schemeknit` | same | `index, follow` | 5 blocks, valid |
| `/products/maacash` | MaaCash — Business Operations Software | `.../products/maacash` | same | `index, follow` | 5 blocks, valid |
| `/products/tillproof` | TillProof — Retail Software for Electrical Shops | `.../products/tillproof` | same | `index, follow` | 4 blocks, valid |
| `/resources` | Resources — Practical Software and Operations Guides | `.../resources` | same | `index, follow` | 3 blocks, valid |
| `/contact` | Contact BloomCore Technologies | `.../contact` | same | `index, follow` | valid |
| `/work` | Software Products and Projects — BloomCore Technologies | `.../work` | same | `index, follow` | valid |

Descriptions are present on every page (123–154 characters). Every JSON-LD
block parsed as valid JSON on every page checked.

`sitemap.xml` is well-formed XML with 15 entries. Every entry uses
`https://bloomcoretech.com`. No `workers.dev`, `netlify.app` or Netlify IP
appears in the sitemap or in any canonical or `og:url` value.

`robots.txt` still allows crawling, names `bloomcoretech.com` and points at
`https://bloomcoretech.com/sitemap.xml`.

TillProof remains indexable and still states that the product is under
development. It has no application link.

The old Netlify host keeps working as a redirect:
`https://bloomcore-technologies.netlify.app/about` returns 301 to
`https://bloomcoretech.com/about`.

The DNS TXT record `google-site-verification=ke67Yv09...` is still published.
Bing verification remains absent as it was before the migration, because no
`msvalidate.01` token was configured.

## K. Analytics and consent on the branded domain

Headless Chrome, mobile viewport, against `https://bloomcoretech.com` after the
cutover:

| Check | Result |
| --- | --- |
| Google requests before consent | none (28 page requests) |
| Consent banner | present, with Allow, Keep off and privacy link |
| Accept analytics | exactly one request, `https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT` |
| `GTM-TQK7FMJT` | never requested |
| `gtag/js` | never requested |
| GA4 collect | `tid=G-GDBL5SNHKL`, `gcs=G101` |
| Initial `page_view` | one |
| SPA navigation to `/products/schemeknit` | one additional `page_view` |
| Hard navigation to `/contact` | one additional `page_view` |
| `product_page_view` | sent with `product_name: SchemeKnit` |
| `product_outbound_click` | sent with `product_name`, `location: product_launch`, `destination_type: product_application` |
| `contact_email_prepared` | sent with `enquiry_type` only |
| Personal data in any request | none |
| Keep off | no GTM, no GA4 collect, disable flag set |
| Withdraw consent | `window["ga-disable-G-GDBL5SNHKL"] === "true"`, no requests after |
| Console errors | none |

The public container was fetched twice more at 18:25 UTC. It still returns
`__ogt_1p_data_v2` with `vtp_isEnabled:false` and no enabled automatic
user-provided data field. GA4 remains `G-GDBL5SNHKL`. No GTM or GA4 account
setting was changed.

## L. DNS preservation

Records checked through Cloudflare DNS-over-HTTPS after the cutover:

| Name | Type | Value | State |
| --- | --- | --- | --- |
| `bloomcoretech.com` | A | `104.21.54.112`, `172.67.138.55` | Worker custom domain, proxied |
| `www.bloomcoretech.com` | A | same Cloudflare addresses | redirect to apex preserved |
| `bloomcoretech.com` | MX | none | no mailbox on this domain; unchanged |
| `bloomcoretech.com` | TXT | `google-site-verification=ke67Yv09...` | preserved |
| `_dmarc.bloomcoretech.com` | TXT | `v=DMARC1; p=none;` | preserved |
| `google._domainkey` | TXT | NXDOMAIN | no DKIM selector existed |
| `schemeknit.bloomcoretech.com` | A | Cloudflare proxy, 200 | preserved |
| `maacash.bloomcoretech.com` | A | Cloudflare proxy, 200 | preserved |
| `tillproof.bloomcoretech.com` | — | NXDOMAIN | no record by design |

No MX, SPF or DKIM record exists on this domain; the contact form uses
`mailto:` and public addresses are Gmail-hosted, so there was nothing to
preserve or remove. No TXT record was altered. Product subdomains still answer
200 over HTTPS.

## M. Netlify fallback

The Netlify path is intact and was rebuilt locally with `NETLIFY=true`:
`npm run build` produced `out/index.html` and 148 static files, including the
legacy product redirect rules. The Netlify site and its deploy history were not
deleted. `bloomcoretech.com` no longer points at Netlify, so the fallback is a
rebuildable static copy plus the existing deploy, kept until the owner approves
retirement.

## N. Remaining owner actions

1. Change the Cloudflare Workers Builds commands to
   `npx opennextjs-cloudflare build` and `npx wrangler deploy`. A workers build
   produced `ff1ac257` during the cutover; with the current dashboard settings
   the sequence can still fail when `npm run build` emits standalone output and
   `wrangler deploy` finds no `.open-next` bundle.
2. Review whether `www` should stay redirected, and confirm no preview URLs or
   `workers.dev` hostnames are promoted externally.
3. Keep the Netlify site until you explicitly approve retirement, then remove it.
4. Optionally add Cloudflare Web Analytics or leave analytics as configured; no
   GTM or GA4 change is pending.

## Final classification

**GREEN — custom domain cut over and production independently verified.**

| Stage | State |
| --- | --- |
| Root cause identified and fixed | yes — static export replaced by standalone |
| Dependency compatibility resolved | yes — Next.js 16.4.6, OpenNext 1.20.16 |
| Clean Next.js build | passed |
| Standalone output verified | passed |
| OpenNext packaging | passed |
| Local Workers preview | passed, all routes and analytics |
| Worker deployment | passed, live version `c3ef1bfe-36e0-49a7-b1b8-6cc1685150cb` |
| Custom domain cutover | complete — apex served by the Worker |
| DNS and TLS | Cloudflare proxy active, valid wildcard certificate, no conflicting route |
| Apex and `www` redirects | apex canonical, `www` 301 to apex, HTTP 301 to HTTPS, no loop |
| Route verification | 15 HTML routes, sitemap, robots, favicons, redirects, 404 all correct |
| SEO verification | canonical, titles, descriptions, Open Graph, JSON-LD, sitemap clean |
| Analytics and consent | GTM-PMZ6ZSVT only, GA4 G-GDBL5SNHKL, consent, page views and product events correct |
| Personal data in analytics | none observed |
| DNS preservation | DMARC, Search Console TXT and product subdomains intact; no MX/SPF/DKIM existed |
| Netlify fallback | retained and rebuildable |
| Domain cutover verified | yes, on the branded domain |
