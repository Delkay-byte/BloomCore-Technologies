# 90-day SEO plan

Date: 9 November 2026
Domain: `https://bloomcoretech.com`
Starting point: technical fixes implemented in source, pending production deploy; no verified search
console properties; no analytics data.

## Objective

Make the site technically trustworthy, indexed on one canonical host, measurably useful, and
supported by a small number of strong pages. Do not pursue volume at the cost of accuracy.

## Success measures

These are process and evidence measures, not ranking promises:

| Measure | Target by day 90 | Source |
| --- | --- | --- |
| Production canonical host | 100% apex | Live curl checks |
| Old host and `www` | 301 to apex | Live curl checks |
| Sitemap submitted | Yes | Search Console |
| Indexable pages with self-canonical | 15 of 15 | URL Inspection + crawl |
| Search Console Domain property | Verified | Search Console |
| Bing property | Verified or imported | Bing Webmaster Tools |
| GA4 with consent | Live if ID supplied | GA4 Realtime |
| New substantive articles | 2–3 | `/resources` |
| Legitimate referring domains | 5–10 | Search Console Links |
| Broken internal links or 404s | 0 | Site crawl |

No traffic, ranking, lead or revenue targets are stated. There is no baseline to justify them.

## Days 1–14: ship and verify

### Engineering / deployment

- [ ] Review the diff and commit the SEO implementation.
- [ ] Push to `main`.
- [ ] Confirm the Netlify production deploy succeeds.
- [ ] Run the live verification commands in `01-technical-seo-audit.md`.
- [ ] Confirm every page canonical is the apex.
- [ ] Confirm `robots.txt` and `sitemap.xml` use the apex.
- [ ] Confirm the old Netlify host returns `301`.
- [ ] Confirm `/products/bloomcore-one` and `/products/bik-prestige` return `301`.
- [ ] Confirm `www` and HTTP redirects still work.
- [ ] Check the mobile layout at 360px, 390px and 768px for horizontal overflow.
- [ ] Run Lighthouse on `/`, one product page and one article. Record the scores without treating
      them as a ranking guarantee.

### Owner

- [ ] Export the current Cloudflare DNS record list before changing anything.
- [ ] Create the Search Console Domain property and add the verification `TXT` record.
- [ ] Verify the property.
- [ ] Submit the sitemap.
- [ ] Inspect the home page and the three product pages; confirm the canonical.
- [ ] Request indexing for those pages.
- [ ] Import the site into Bing Webmaster Tools or verify it separately.
- [ ] Decide whether to provide a GA4 measurement ID.

### Gate

Do not start content or outreach until the live canonical is confirmed. Everything downstream
depends on it.

## Days 15–45: measurement and first content

### Engineering

- [ ] If a GA4 ID exists, set it in Netlify and redeploy.
- [ ] Verify no request before consent and a page view after consent.
- [ ] Confirm the event table in `07-analytics-and-conversion-tracking.md`.
- [ ] Add a per-page Open Graph image only if a real design is available. Do not generate filler.
- [ ] Optional: collapse the `http://www` chain to one hop in Cloudflare, after documenting the
      current rules.

### Content

- [ ] Choose one planned article from `05-content-and-editorial-roadmap.md` that the author can
      support with first-hand experience.
- [ ] Draft, review and publish it.
- [ ] Link it from the related product page and the resources index.
- [ ] Update the sitemap date automatically through the article record.

Recommended first addition: idea 4 (observable lesson objectives) or idea 6 (mobile money opening
and closing checklist). Both extend a cluster that already has a published guide.

### Owner

- [ ] Read the Search Console Performance report once a week.
- [ ] Note queries with impressions but weak position or CTR.
- [ ] Do not rewrite titles based on one day of data. Wait for at least two weeks.
- [ ] Create or clean up the company's own profiles: LinkedIn, GitHub, any genuine association.
- [ ] Identify five practitioner or institutional organisations worth a real conversation.

### Gate

By day 45 there should be: verified properties, a submitted sitemap, at least some indexed pages,
and one new or improved article. If pages are not indexed, diagnose before writing more.

## Days 46–70: authority and iteration

### Content

- [ ] Publish a second article, from a different cluster than the first.
- [ ] Improve one existing page using Search Console query language. Change the title, the opening
      paragraph or the FAQ, not the whole page.
- [ ] Add one internal link from a high-impression page to a page that needs discovery.

### Outreach

- [ ] Contact the five organisations identified earlier with a useful artefact: a checklist, a
      workshop offer, or a specific answer to a problem they have published about.
- [ ] Log every contact and outcome in a simple sheet.
- [ ] Do not buy links, exchange links or join generic link directories.

### Technical

- [ ] Recheck all 15 URLs for `200`, canonical and title.
- [ ] Check Search Console Pages report for unexpected `noindex`, `404` or duplicate canonical
      issues.
- [ ] Confirm the old host is no longer indexed. If it is, keep the redirect and wait; do not create
      new pages to compete with it.
- [ ] Review Core Web Vitals in Search Console if enough field data exists. If not, record that it is
      unavailable.

## Days 71–90: consolidate

- [ ] Publish or finish a third article if capacity allowed. Do not publish a thin one to hit the
      number.
- [ ] Review the three product pages against `04-product-page-strategy.md`. Update any claim that is
      no longer true.
- [ ] Review the TillProof status. If it has not moved, leave it honest. If it has, update the page
      and only then consider `SoftwareApplication` schema.
- [ ] Produce a short internal report: indexed pages, impressions, queries, clicks, key events,
      referring domains, and what changed. State clearly what is unknown.
- [ ] Choose the next 90-day focus from evidence, not from a generic checklist.

## Weekly routine (30–45 minutes)

1. Search Console: new coverage errors, manual actions, security issues.
2. Search Console: queries with impressions and weak position; note but do not overreact.
3. GA4, if live: landing pages, product views, CTA clicks, form starts and prepared enquiries.
4. One content or outreach action.
5. Log one sentence on what changed.

## Monthly routine (2 hours)

1. Full crawl of the 15 URLs: status, canonical, title, description, H1.
2. Redirect check for `www`, HTTP, old host and legacy product paths.
3. Structured data spot check with a validator.
4. Backlink log review.
5. Decide one thing to stop doing.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Deploy does not include the canonical fix | Verify live HTML before requesting indexing |
| Netlify env var still points at the old host | `src/lib/site.ts` rejects `*.netlify.app`; confirm live output |
| Owner cannot access DNS | Use a URL-prefix property as a temporary fallback, then move to Domain |
| Email records disturbed during DNS work | Export records first; add, never replace |
| Analytics ID set without consent review | Consent gate is in code; verify in a private window |
| Content becomes a quota exercise | Publish only when there is a specific, supportable answer |
| TillProof page overpromises | Keep the in-development label and no product schema |

## What this plan does not include

- Paid search or social advertising.
- Purchased links or sponsored placements presented as editorial.
- Automated content generation at scale.
- Ranking guarantees.
- Claims about Search Console, Bing or GA4 actions that have not been performed.
