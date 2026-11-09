# Technical SEO audit — bloomcoretech.com

Audit date: 9 November 2026
Scope: the public marketing site served from `https://bloomcoretech.com`.
Method: live HTTP checks, inspection of the generated static output (`out/`), and review of the
source routes, metadata, sitemap and redirects. No third-party SEO tool, ranking product or search
volume database was used, and no traffic, ranking or revenue figures are claimed.

## Summary

The domain, HTTPS and redirect topology were already correct. The serious defect was origin
consistency: production pages served canonical tags, `og:url`, the sitemap and `robots.txt` that
pointed at the old `bloomcore-technologies.netlify.app` host. That told search engines the canonical
version of every page lived on a different hostname. The source has been corrected and verified in a
local production build; it takes effect on the next production deploy.

## Findings

| # | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| 1 | Critical | Canonical tags and `og:url` pointed to `https://bloomcore-technologies.netlify.app` | Live `/` and `/products/maacash` both returned the old host in `<link rel="canonical">` | Fixed in `src/lib/site.ts`; confirmed in local `out/` build. Pending deploy |
| 2 | Critical | `sitemap.xml` and `robots.txt` advertised the old host | Live sitemap `<loc>` entries and `Sitemap:` line used the Netlify hostname | Fixed in `src/app/sitemap.ts` and `src/app/robots.ts`; local build shows apex URLs |
| 3 | High | Old Netlify hostname still served `200 OK` duplicates | `https://bloomcore-technologies.netlify.app/products/maacash` returned 200 | Permanent redirect to apex added in `netlify.toml` |
| 4 | High | No search engine verification | No Search Console or Bing Webmaster property confirmed; no tokens available | Optional verification env vars added; owner action required |
| 5 | High | No analytics or conversion measurement | No GA4 measurement ID or tag present | Consent-gated GA4 integration added; measurement ID still required |
| 6 | Medium | Page titles were mostly bare page names | `/services`, `/about`, `/contact` used short titles such as `Services` | Rewritten with intent and location where accurate |
| 7 | Medium | No structured data | No JSON-LD on any page | Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage and Article added |
| 8 | Medium | No breadcrumb navigation or internal resource hub | No `/resources` route, no breadcrumb trail | Breadcrumbs and a three-article resources section added |
| 9 | Medium | Product pages had no FAQ content | No question-and-answer section anywhere | FAQs added to SchemeKnit, MaaCash and TillProof |
| 10 | Low | One generic Open Graph image for every page | All routes referenced `/og-image.png` | Kept intentionally for now; per-page images deferred |
| 11 | Low | `http://www` produces a two-hop redirect chain | `http://www` → `https://www` → apex | Acceptable; optional Cloudflare rule can collapse it to one hop |
| 12 | Low | No per-page `lastModified` in the sitemap | Every entry shared one date | Explicit dates added, including article update dates |

## Verified as already correct

- `https://bloomcoretech.com/` returns `200` with `Server: Netlify`.
- `http://bloomcoretech.com/` returns `301` to `https://bloomcoretech.com/`.
- `https://www.bloomcoretech.com/` returns `301` to `https://bloomcoretech.com/`.
- TLS is valid and HSTS is present (`max-age=31536000`).
- The apex resolves to Netlify (`35.157.26.135`, `63.176.8.218`, plus IPv6).
- `www` is Cloudflare-proxied and redirects to the apex.
- `/products/bloomcore-one` and `/products/bik-prestige` permanently redirect to `/products/maacash`.
- The site is fully static: no API routes, server actions, database or runtime data.
- Every indexable page is reachable within two clicks of the home page.

## Crawl and indexation policy

- `robots.txt` allows all paths and declares the sitemap on the apex domain.
- No page sets `noindex`. TillProof is indexable because it is an honest in-development product
  page, not a placeholder.
- `404.html` is generated and served automatically.
- The sitemap lists 15 URLs: 12 static routes and 3 resource articles.

## What is not fixed by code

These require the site owner:

1. Verify the domain in Google Search Console.
2. Verify or import the site in Bing Webmaster Tools.
3. Supply a GA4 measurement ID if analytics is wanted.
4. Submit the sitemap and request indexing after the deploy that carries the canonical fix.

Exact steps are in `08-domain-and-search-console-setup.md`.

## Post-deploy verification checklist

```text
curl -sS https://bloomcoretech.com/ | grep -E 'canonical|og:url'
curl -sS https://bloomcoretech.com/sitemap.xml | head
curl -sS https://bloomcoretech.com/robots.txt
curl -sSI https://www.bloomcoretech.com/
curl -sSI https://bloomcore-technologies.netlify.app/
curl -sSI https://bloomcoretech.com/products/bloomcore-one
```

Expected: apex canonical and `og:url`; apex sitemap URLs; apex sitemap declaration in robots; `301`
for `www`, the old Netlify host and the legacy product paths.

## Limits of this audit

- No crawl of a large site was needed; the site has 15 indexable URLs.
- Core Web Vitals were not measured with field data. There is no CrUX history for this domain yet.
- No keyword volumes, difficulty scores, rankings or competitor traffic estimates are stated because
  none were obtained from a real data source.
