# BloomCore Technologies — corporate website

Source for the BloomCore Technologies website: `Technology that moves work forward.`

The site is a statically rendered Next.js App Router project. It publishes the company's
products, services, founder profile and contact details without invented clients, testimonials,
metrics or deployments.

## Stack

- Next.js 16.4.3 (App Router, static prerendering)
- React 19 and TypeScript
- Tailwind CSS 4 with design tokens in `src/app/globals.css`
- `motion/react` for the mobile navigation panel, disabled under reduced-motion
- `next/font` for Inter and IBM Plex Mono

## Commands

```bash
npm run dev     # development server on http://localhost:3000
npm run build   # production build (standalone output for OpenNext)
npm run start   # serve the standalone build locally
npm run preview # OpenNext build, then run it in the local Workers runtime
npm run deploy  # OpenNext build, then deploy the Worker to Cloudflare
npm run lint    # ESLint
npx tsc --noEmit
```

The project builds with OpenNext standalone output, which Cloudflare Workers
needs. Netlify still receives the static `out/` directory: `next.config.ts`
selects `output: "export"` only when Netlify's own build sets `NETLIFY=true`.
Every other build, including local and Cloudflare, produces
`.next/standalone`.

## Deploying to Cloudflare Workers

The Worker is `bloomcore-technologies-page`, configured in `wrangler.jsonc` and
`open-next.config.ts`. Build and deploy locally with `npm run deploy`. Cloudflare
Workers Builds must use `npx opennextjs-cloudflare build` as the build command
and `npx wrangler deploy` as the deploy command.

`bloomcoretech.com` is now served by this Worker as a custom domain. `www`
redirects to the apex and HTTP redirects to HTTPS. The Netlify site is retained
as a rebuildable fallback until it is explicitly retired. Full evidence:
`docs/deployment/CLOUDFLARE-NEXTJS-DEPLOYMENT-REPORT.md`.

## Deploying to Netlify

The site has no backend, no API routes, no server actions and no runtime data.
Netlify keeps building the static `out/` directory as a fallback. It no longer
serves the production domain.

**Build settings** (also committed in `netlify.toml`):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `out` |
| Node version | `22` |
| Functions | none |
| Database | none |

**Environment variables:**

| Variable | When to set | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional, staging only | `https://staging.example.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | After Search Console issues the token | `google-site-verification-token` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | After Bing issues the token | `msvalidate.01-token` |

Google Tag Manager container `GTM-PMZ6ZSVT` is defined in `src/lib/analytics.ts`, and the GA4
Google tag `G-GDBL5SNHKL` lives inside that container. No analytics environment variable is
needed, and no standalone gtag.js script is installed.

The production origin is fixed to `https://bloomcoretech.com` in `src/lib/site.ts`. It drives
canonical URLs, Open Graph URLs, `metadataBase`, the sitemap and `robots.txt`. A configured
`NEXT_PUBLIC_SITE_URL` is ignored when it points at `localhost`, a `*.netlify.app` host or another
non-public origin, so canonical metadata cannot drift.

Analytics is off unless the visitor chooses Allow analytics. The footer's Analytics settings control
changes or withdraws that choice. Never commit real search verification tokens; set them in the
Netlify UI.

Setup steps:

1. Push this repository to GitHub (not done by the project tooling).
2. In Netlify, choose **Add new site -> Import an existing project** and select the repository.
3. Netlify reads `netlify.toml`; confirm build command `npm run build` and publish directory `out`.
4. Confirm `bloomcoretech.com` is the site's custom domain and that HTTPS is active.
5. Add optional verification values in the Netlify UI when they exist.
6. Deploy. Production deploys follow the production branch; other branches and pull requests get
   Deploy Previews automatically.

Static-export notes:

- The old product URLs `/products/bik-prestige` and `/products/bloomcore-one` are not
  generated. Netlify applies a permanent redirect from both to `/products/maacash` (see
  `netlify.toml`).

- `next/image` runs with `unoptimized: true`; image files are served from the export as-is.
- `/about`, `/products` and every other route is emitted as `about.html`, `products.html`, etc.
  Netlify's default pretty URLs serve them at the extensionless paths used by the site.
- `404.html` is generated and used automatically.
- No server-only Next.js features are used, so no functions bundle is needed.
- Contact enquiries use the visitor's email application (`mailto:`), not a server endpoint.

## Site URL configuration

The production domain is **`https://bloomcoretech.com`**, set once in `src/lib/site.ts`.

Canonical URLs, Open Graph metadata, `metadataBase`, the sitemap and `robots.txt` all read that
single value. `NEXT_PUBLIC_SITE_URL` exists for a genuine staging origin only. It is ignored when it
points at `localhost`, a `*.netlify.app` host or another non-public origin, so a stale preview value
cannot leak into production metadata.

DNS: the apex resolves to Netlify; `www` redirects to the apex with a 301 through Cloudflare. The
old `bloomcore-technologies.netlify.app` host also 301s to the apex, configured in `netlify.toml`.

`.env.example` documents every optional variable and is committed; real `.env*` files are ignored.

SEO documentation lives in `docs/seo/`.

## Structure

```
src/app/          routes, metadata, sitemap and robots
src/components/   shared layout, page primitives, contact form
src/assets/       brand SVGs and the founder portrait
src/lib/brand.ts  canonical name, routes, contact details, product copy
src/lib/site.ts   single source for the public origin
public/           social preview image
scripts/          one-off generation tooling
assets/           owner-supplied source material
```

Company strings, routes and contact details are defined once in `src/lib/brand.ts`. Change them
there rather than in individual pages.

## Contact form

`src/components/ContactForm.tsx` is a client-side `mailto:` fallback. It validates name, email,
enquiry type and message, then opens the visitor's email application with a fully encoded subject
and body. The site sends nothing: there is no API, backend, stored submission or success state.
The visible confirmation says the email application should open and that the visitor must press
Send.

## Content rules

The published pages describe products at their actual stage. SchemeKnit and MaaCash are
labelled available; TillProof is labelled in development. Interface previews are
identified as representations, not screenshots.

Do not add client names, testimonials, revenue or usage figures, certifications or awards without
a verifiable source. The privacy notice states that it has not yet been reviewed by a Ghanaian
legal practitioner and does not claim registration with the Data Protection Commission.

The founder page uses the owner-supplied portrait and verified CV details. Degree claims are
intentionally omitted until the owner confirms them for publication.

## Brand

The approved company logo is the supplied artwork `assets/BloomCore Technologies Logo.png`,
used unaltered: a white hexagonal C symbol with the BloomCore Technologies wordmark. The header
and footer place it on a dark plate so the white artwork stays visible on light backgrounds. The
cropped lockup lives at `src/assets/brand/bloomcore-logo-white.png`.

The site stays monochrome apart from one restrained accent, defined as `--accent` in
`src/app/globals.css` (deep green in light mode, mint in dark mode).

## Assets

`public/og-image.png` is generated by `node scripts/gen-og.mjs`. The logo lockup, C symbol and
favicons are extracted from the untouched source PNG by `python scripts/extract-brand-assets.py`:
`src/assets/brand/bloomcore-logo-white.png`, `src/assets/brand/bloomcore-c-symbol.png`,
`public/favicon.ico`, `public/favicon-16.png`, `public/favicon-32.png`,
`public/favicon-48x48.png`, `public/favicon-96x96.png`, `public/favicon-192x192.png` and
`public/apple-touch-icon.png`. The favicon uses only the C element on a solid `#080808` tile, with
no wordmark, so it stays visible on light and dark browser chrome. The 48px, 96px and 192px PNGs
meet Google Search's minimum square raster size, and `/favicon.ico` carries 16px, 32px and 48px
frames. The founder portrait is served in its original colour, with no logo overlay.
