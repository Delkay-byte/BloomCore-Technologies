# Technical SEO implementation

Date: 9 November 2026
Applies to: `src/lib/site.ts`, `src/lib/seo.ts`, `src/components/JsonLd.tsx`,
`src/components/Breadcrumbs.tsx`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`,
product pages, `/resources`, `netlify.toml`, `.env.example`.

## 1. Canonical origin

`src/lib/site.ts` now defines one production origin:

```ts
const OFFICIAL_URL = "https://bloomcoretech.com";
```

`NEXT_PUBLIC_SITE_URL` is read only as an optional staging override. It is rejected when it is not
HTTP(S), when it ends in `netlify.app`, or when it contains `localhost`, `127.0.0.1` or `0.0.0.0`.
This prevents a stale Netlify environment variable or a preview build from changing canonical tags,
`metadataBase`, `og:url`, the sitemap or `robots.txt`.

Exports:

- `SITE_URL` — no trailing slash.
- `SITE_HOST` — host without scheme.
- `isSiteUrlConfigured` — true when the origin is the official domain or a valid public override.

## 2. Root metadata

`src/app/layout.tsx`:

- `metadataBase` is `new URL(SITE_URL)`.
- Default title: `BloomCore Technologies — Software Development in Ghana`.
- Title template: `%s — BloomCore Technologies`.
- Default description names the three products and the service categories.
- Open Graph: `type: website`, `locale: en_GH`, explicit image dimensions.
- Twitter: `summary_large_image`.
- `robots: { index: true, follow: true }`.
- Optional verification tags, emitted only when the matching env var exists:

```text
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_BING_SITE_VERIFICATION
```

No token is hardcoded and no placeholder value is emitted.

## 3. Structured data

`src/lib/seo.ts` returns plain objects; `JsonLd` serialises them into
`<script type="application/ld+json">`.

| Type | Where | Notes |
| --- | --- | --- |
| `Organization` | Root layout | Name, URL, description, slogan, logo, email, telephone, postal address, verified social profiles, contact point, `knowsAbout` |
| `WebSite` | Root layout | Site name, alternate name, language, publisher reference |
| `SoftwareApplication` | SchemeKnit and MaaCash pages | Web browser, category, publisher and site references |
| `BreadcrumbList` | Products, product pages, resources, articles | Absolute URLs built from `SITE_URL` |
| `FAQPage` | SchemeKnit, MaaCash and TillProof pages | Mirrors the visible FAQ content exactly |
| `Article` | Resource articles | Headline, description, dates, author and publisher references |

Deliberate omission: TillProof does **not** receive `SoftwareApplication` schema while it is in
development. Emitting it would imply a released application.

## 4. Breadcrumbs

`src/components/Breadcrumbs.tsx` renders an accessible `<nav aria-label="Breadcrumb">` with an
ordered list, `/` separators hidden from assistive technology, and `aria-current="page"` on the
last item. `PageHero` accepts an optional `breadcrumbs` prop, so every page that needs a trail gets
one without duplicated markup.

## 5. Sitemap

`src/app/sitemap.ts` builds from a typed route list plus the resource articles:

- 12 static routes and 3 articles.
- Absolute URLs on `SITE_URL`.
- Per-entry `lastModified`.
- Priorities: home `1.0`, products and key product pages `0.9`, services and resources `0.8`,
  remaining pages `0.3`–`0.7`.
- `dynamic = "force-static"` keeps the export static.

There is no generated sitemap index because the site is small.

## 6. robots.txt

`src/app/robots.ts`:

```text
User-Agent: *
Allow: /

Host: bloomcoretech.com
Sitemap: https://bloomcoretech.com/sitemap.xml
```

`Host` is a Yandex directive and harmless elsewhere. Nothing is disallowed; there are no private
areas to protect.

## 7. Redirects

`netlify.toml` now has, in order:

```toml
[[redirects]]
  from = "https://bloomcore-technologies.netlify.app/*"
  to = "https://bloomcoretech.com/:splat"
  status = 301
  force = true
```

and the existing legacy product redirects:

```toml
/products/bloomcore-one   → /products/maacash   301
/products/bik-prestige    → /products/maacash   301
```

The host-level rule runs before static files are served, so the old hostname cannot produce a
duplicate page. The apex and `www` redirects are handled by DNS and Netlify/Cloudflare, not by this
file.

## 8. On-page metadata

Every static route now declares:

- A specific `title`.
- A specific `description`.
- `alternates.canonical`.
- Open Graph title, URL and description.
- Twitter card where the route is a landing page.

Product pages additionally carry FAQs, breadcrumbs and product-view tracking.

## 9. Resources

- `src/lib/resources.ts` holds three typed articles as block arrays.
- `/resources` lists them with category, date and reading time.
- `/resources/[slug]` prerenders each article with `generateStaticParams`, generates metadata from
  the article record, emits Article and BreadcrumbList JSON-LD, and links to the related product.
- The home page and footer link to `/resources`.

## 10. Verification performed

```text
npm run lint        pass
npx tsc --noEmit    pass
npm run build       pass, 19 pages generated
```

Local production output:

- `out/index.html` canonical: `https://bloomcoretech.com`
- `out/index.html` `og:url`: `https://bloomcoretech.com`
- `out/sitemap.xml` first `<loc>`: `https://bloomcoretech.com/`
- `out/robots.txt` sitemap: `https://bloomcoretech.com/sitemap.xml`

Live checks are listed in `01-technical-seo-audit.md`. The canonical fix is not live until the next
production deploy.

## 11. Constraints

- The site is a static export (`output: "export"`). Anything requiring a server must be done in
  Netlify redirects or client-side code.
- No deployment, DNS or Search Console action is performed by the source code. Those are owner
  actions documented in `08-domain-and-search-console-setup.md`.
- No dependency was added for SEO, analytics or schema. Everything uses the framework and platform
  already present.
