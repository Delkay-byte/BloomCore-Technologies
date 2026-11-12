# BloomCore Technologies — Google SEO recovery report

**Project:** BloomCore Technologies — brand-search visibility
**Repository:** `C:\Users\SAVIOUR\Documents\DScience\BloomCore Web`
**Branch:** `fix/seo-brand-visibility` (created from `main`, baseline `9f2ce2f`)
**Production site:** `https://bloomcoretech.com` · `https://www.bloomcoretech.com`
**Investigation date:** 11–12 November 2026
**Deployment status:** implemented, built and pushed to the SEO branch only. **Not deployed.**

## 1. Original symptom

Searching Google for the brand `bloomcoretech` reportedly does not show the BloomCore
Technologies website. The owner suspected the recent corporate redesign (commits `42cfe80`
rejected, `55246e9` rebuild, `9f2ce2f` docs) had reduced search visibility.

The brief was explicit: do not assume the redesign caused it, separate indexing from ranking
from brand ambiguity from technical defects from authority, and do not claim deindexing
without Search Console evidence.

## 2. Search queries tested

The environment has no logged-out Google session with Ghana market context, so official SERP
capture was not possible here. The available web-search integration was used and each public
route was tested directly with HTTP.

| Query | Tool / method | Date | Context | Observation |
| --- | --- | --- | --- | --- |
| `bloomcoretech` | web search integration | 2026-11-11 | global index | `bloomcoretech.com` returned first; similar names returned too: "BloomTech Inc", "Bloom CORETECH" (Arpa/FENIX), "Bloom Institute of Technology" |
| `bloomcoretech.com` | not captured | — | — | no reliable SERP capture available in this environment |
| `BloomCore Technologies` | not captured | — | — | ambiguous with the entities above |
| `BloomCore Technologies Ghana` | not captured | — | — | — |
| `site:bloomcoretech.com` | not captured | — | — | requires Google; not available here |
| `site:bloomcoretech.com BloomCore` | not captured | — | — | requires Google; not available here |

The only hard signal available is that the brand token `bloomcoretech` collides with several
established similarly named technology companies, which is directly relevant to the
brand/entity-ambiguity hypothesis (finding C).

## 3. Current production commit and Worker version

- Deployed production code corresponds to `main` at `9f2ce2f` (`docs(site): correct final review status in rebuild report`).
- Worker `bloomcore-technologies-page` active version: **`f68822d1-7ce7-49e5-ba88-1577218a8de8`**, deployed `2026-11-11T15:51:24Z` by `bloomcoretechnologies@gmail.com`.
- Live server header: `x-opennext: 1`, `x-powered-by: Next.js`, `Server: cloudflare`.

## 4. Search Console findings

**Not available.** No authorised, signed-in Google Search Console session was accessible, and
credentials were deliberately not requested. Every Search Console section below is therefore
recorded as **not verified in this investigation** and converted into an owner action in §19.

The historical note that the homepage was indexed and 15 sitemap pages were discovered
**predates** the rebuild (`55246e9`) and is **not** treated as current evidence.

## 5. Current indexing status for each important route

Without Search Console, indexation cannot be confirmed. What is confirmed is crawlability,
status code, canonical form and robots eligibility, all of which are necessary conditions for
indexing. All values below were observed from the live site.

| Route | HTTP | Crawlable | Self-canonical | Robots | In sitemap | Indexed? |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | yes | `https://bloomcoretech.com` | index, follow | yes | unconfirmed (needs GSC) |
| `/about` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/services` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/work` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/products` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/products/schemeknit` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/products/maacash` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/products/tillproof` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/resources` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/resources/scheme-of-learning-to-weekly-lesson-plans` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/resources/mobile-money-business-recordkeeping` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/resources/electrical-shop-stock-control` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/founder` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/contact` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| `/privacy` | 200 | yes | self, apex | index, follow | yes | unconfirmed |
| unknown path (probe) | 404 | n/a | n/a | noindex | no | correctly excluded |
| `/robots.txt` | 200 | n/a | n/a | n/a | n/a | n/a |
| `/sitemap.xml` | 200 | n/a | n/a | n/a | n/a | n/a |

## 6. Sitemap status

- `https://bloomcoretech.com/sitemap.xml` returns 200 and lists **15** URLs (12 static + 3 articles).
- Correct production hostname throughout; no Netlify, Render or `workers.dev` URLs.
- No private or internal paths included.
- **Defect found and fixed:** the homepage entry was emitted as `https://bloomcoretech.com/`
  (trailing slash) while the homepage canonical is `https://bloomcoretech.com` (no trailing
  slash). §11.G requires canonicals and sitemap URLs to agree. After the fix the sitemap
  homepage URL is byte-identical to the canonical.
- Sitemap submission status, last processing date and any errors: **not verified** (needs GSC).

## 7. Robots findings

- `robots.txt` (live, unchanged since before the rebuild) allows all crawlers, declares
  `Host: bloomcoretech.com` and points at `https://bloomcoretech.com/sitemap.xml`. Correct.
- No page-level `noindex`: every intended public page serves `index, follow`; only the 404 /
  `_not-found` page serves `noindex`. Correct.
- No `X-Robots-Tag` header is sent on public responses. Correct.
- No accidental route-level crawl restriction found.
- The future private console (`/internal`, `/api/internal`) does not exist in production and
  is not in the sitemap. It is excluded on the lead-management branch; that change is
  intentionally **not** part of this SEO branch (see §13).
- **Not verified:** whether Search Console reports any blocked-by-robots URLs (needs GSC).

## 8. Canonical findings

- Every indexable page has exactly one self-referencing canonical (`x1` in every case).
- All canonicals use HTTPS on the apex host `bloomcoretech.com`.
- `www.bloomcoretech.com` 301-redirects to the apex with a single hop. No redirect chains, no loops.
- No obsolete Netlify, Render or `workers.dev` canonical anywhere.
- No query-parameter canonical duplication observed (`canonical` is absolute per page).
- **Defect fixed:** see §6 — the sitemap homepage URL disagreed with the homepage canonical;
  now aligned. The homepage breadcrumb `item` URL had the same trailing-slash trait and was
  aligned too.

## 9. Metadata findings

- Homepage `<title>`: `BloomCore Technologies — Software Development in Ghana` — brand first
  and descriptive. §11.A satisfied.
- Every important page has a **unique** title and a **unique**, content-accurate meta description.
- Open Graph: 7 `og:` tags; Twitter: 4 `twitter:` tags; on the homepage and consistent across pages.
- The homepage brand is visible as the hero eyebrow (`BloomCore Technologies · Akatsi, Ghana`),
  in the title, in the `<h1>`-adjacent copy, and in structured data. The `<h1>` itself is the
  slogan `Technology that works.`
  - Evaluated against §11.A: the requirement targets **page titles**, and the title is
    brand-first and descriptive, so the requirement is met.
  - Changing the hero `<h1>` would alter the approved visual design, which §14 forbids, and the
    brand is already present in the eyebrow directly above the `<h1>` and 46 times in the page
    body. It was therefore **not changed**; it is recorded as an owner decision in §19 rather
    than an unverified rewrite.
- No duplicated or truncated titles; no keyword stuffing.

## 10. Structured data findings

All JSON-LD validated by inspection of the served HTML; types present per page:

| Page | JSON-LD types |
| --- | --- |
| `/` | Organization, WebSite, (plus ImageObject, PostalAddress, ContactPoint) |
| `/products/schemeknit` | SoftwareApplication, FAQPage, BreadcrumbList, Organization, WebSite |
| `/products/maacash` | SoftwareApplication, FAQPage, BreadcrumbList, Organization, WebSite |
| `/products/tillproof` | FAQPage, BreadcrumbList, Organization, WebSite (no SoftwareApplication — correct, product is "In development") |
| `/resources/*` | Article, BreadcrumbList, Organization, WebSite |
| `/about`, `/work` | Organization, WebSite |

- Organization carries the real name, URL, logo (`apple-touch-icon.png`), description, email,
  telephone, Akatsi address, `sameAs` = verified GitHub + LinkedIn only, and `knowsAbout`.
- No fabricated address, customer count, certification, revenue, award, testimonial or partnership.
- No misleading `LocalBusiness`.
- **Improvement made:** the Organization node now declares `alternateName: "BloomCore"`,
  matching the short name already used on the site and already declared on the WebSite node.
  This is truthful (no new fact) and strengthens entity matching for the short brand token.

## 11. Historical comparison with the pre-redesign implementation

Evidence from Git, not assumption:

- `git diff --stat 64bd10c 9f2ce2f` over the SEO-relevant files (`seo.ts`, `site.ts`, `brand.ts`,
  `layout.tsx`, `sitemap.ts`, `robots.ts`) shows only two files changed: `src/app/layout.tsx`
  (self-hosted fonts; `themeColor`) and `src/app/sitemap.ts` (`lastmod` dates).
- `src/lib/seo.ts`, `src/lib/site.ts`, `src/lib/brand.ts` and `src/app/robots.ts` are **unchanged**
  between `64bd10c` and `9f2ce2f`. So structured data, canonical logic, sitemap generation logic
  and robots directives were **not** regressed by the rebuild.
- The pre-redesign homepage `<h1>` at `64bd10c` was `{BRAND.tagline}` — also a slogan, not the
  brand name. The current `<h1>` being a slogan is therefore **not** a rebuild regression.
- No page titles were dropped to generic values; no descriptions were removed; canonicals were
  not changed to the wrong host; no `noindex` was introduced; sitemap contents were preserved;
  internal nav is intact.

**Conclusion of the comparison:** the redesign did not introduce an on-page technical SEO
regression that explains a brand-search failure.

## 12. Root cause

Assessed against §9's five categories:

- **A. Indexing problem — not evidenced.** The site is crawlable with correct 200/404 codes,
  valid robots, valid sitemap and index,follow metadata. Live GSC confirmation is unavailable.
- **B. Ranking problem — probable.** Even where indexed, a new/low-authority domain generally
  will not outrank established same-name competitors for the brand token immediately.
- **C. Brand/entity ambiguity — probable and evidenced.** The token `bloomcoretech` collides in
  the index with "BloomTech Inc", "Bloom CORETECH" (Arpa/FENIX) and "Bloom Institute of
  Technology". Google must learn which entity the query means.
- **D. Technical SEO problem — one minor defect found and fixed** (sitemap vs canonical
  homepage trailing slash). It is too small to explain a total brand-search absence.
- **E. Authority and content — contributing.** Thin external brand signals; only two verified
  public profiles (GitHub, LinkedIn).

**Confirmed root cause:** no technical SEO defect explains the symptom. The most defensible
explanation is **C + B (+ E)** — brand/entity ambiguity with a young domain, not a rebuild
regression and not proven deindexing. This cannot be finalised without Search Console.

## 13. Files modified

Only two production files, both evidence-backed:

- `src/app/sitemap.ts` — emit the homepage URL without the trailing slash so it matches the canonical.
- `src/lib/seo.ts` — add `alternateName: "BloomCore"` to Organization; align the homepage
  BreadcrumbList `item` URL with the canonical.

Report added: `docs/reports/BLOOMCORE-SEO-RECOVERY-REPORT.md`.

**Deliberately not touched (coordination with the lead-management branch):**
`src/app/robots.ts` (the lead branch edits it to disallow `/internal` and `/api/internal`).
Touching it here would create a merge conflict for no production benefit, because `/internal`
does not exist in production. All other public pages, `analytics.ts`, GTM/GA4, consent, the 3D
carousel and product domains are untouched.

## 14. Changes implemented

1. **Sitemap homepage URL** now equals the homepage canonical exactly
   (`https://bloomcoretech.com`), satisfying §11.G. All other 14 URLs unchanged.
2. **Organization `alternateName`** added (`BloomCore`) to strengthen brand-entity clarity,
   consistent with the existing WebSite `alternateName` and the name used on the site.
3. **Breadcrumb home URL** aligned to the canonical for internal consistency.

No visual design, functionality, analytics or consent change.

## 15. Automated test results

There is no test script on `main`; the test harness lives on the lead-management branch and was
not duplicated here to avoid a `package.json` conflict. Verification used the toolchain and the
built artifacts:

| Gate | Command | Result |
| --- | --- | --- |
| Types | `npx tsc --noEmit` | clean |
| Lint | `npm run lint` | clean |
| Next build | `npm run build` | clean; 15 static public routes + 3 SSG articles |
| OpenNext build | `npx opennextjs-cloudflare build` | `Worker saved in .open-next\worker.js` |
| Netlify fallback build | `NETLIFY=true npm run build` | clean |

Artifact assertions (from the built output, not source):

- Sitemap homepage `<loc>` = `https://bloomcoretech.com` (no slash); 15 `<loc>` entries total.
- Every public page: 1 canonical, `index, follow`, HTTPS apex; `404`/`_not-found`: `noindex`.
- `robots.txt`: `Allow: /`, correct `Host` and `Sitemap`.
- Organization JSON-LD contains `"alternateName":"BloomCore"`.

Live route tests (production, read-only): all 15 public routes 200; unknown path 404; `www` → apex 301.

No `noindex`, canonical, 404, analytics or consent regression.

## 16. Sitemap resubmission status

**Not performed.** Resubmission requires the signed-in Search Console owner session, which was
not available. Recorded as an owner action (§19). No repeated indexing requests were made.

## 17. URL inspection and indexing requests

**None performed** — no Search Console access. No live URL inspection and no indexing requests
were submitted, so nothing is claimed about them.

## 18. Remaining Google processing or ranking uncertainty

- Whether Google has indexed the homepage and the 14 other pages is **unconfirmed**.
- If the site is indexed and simply ranks below same-name competitors, visibility depends on
  entity disambiguation and authority, which take time and external signals.
- A request for indexing does not guarantee crawl, indexation or ranking.
- The `bloomcoretech` token overlap with "BloomTech", "Bloom CORETECH" and "Bloom Institute of
  Technology" means brand-query results may keep mixing entities until Google learns the mapping.

## 19. Owner actions

Google Search Console (domain property `bloomcoretech.com`):

1. Confirm the correct domain property and that you own it.
2. **Sitemaps** → confirm `https://bloomcoretech.com/sitemap.xml` is submitted; read the last
   read date, discovered-URL count (expect ≥ 15) and any errors; resubmit once if it is stale.
3. **URL inspection** for `/` and then `/about`, `/services`, `/work`, `/resources`, `/products`,
   `/products/schemeknit`, `/products/maacash`, `/products/tillproof`, `/founder`, `/contact`,
   `/privacy` and each `/resources/<slug>`: record indexed/not indexed, Google-selected canonical,
   user-declared canonical, last crawl date and crawl permission. Run **Test live URL** on `/`.
4. **Pages (Page indexing)** report: export and read the reason breakdown (crawled – not indexed,
   discovered – not indexed, duplicate, alternate canonical, soft 404, server error, excluded by
   noindex, blocked by robots). Send the export back.
5. **Performance** → filter queries containing `bloom`; record impressions, clicks, average
   position and the pages receiving impressions. This confirms whether Google can connect the
   brand to the homepage.
6. **Manual actions** and **Security issues**: confirm both are empty (do not assume a penalty).
7. **Core Web Vitals** and **Mobile usability**: record any failing URLs.
8. Then, and only then, request indexing for `/` and any page confirmed not indexed but eligible.

Decision to make:

9. The homepage hero `<h1>` is `Technology that works.` (slogan); the brand is the eyebrow above
   it, the title, and structured data. If you want the brand inside the `<h1>` itself, approve a
   specific wording and we will change it on this branch — it alters the approved hero design.

Brand/authority (optional, no fabricated data, no paid backlinks):

10. Add BloomCore Technologies to genuine profiles you already control (for example a Google
    Business Profile if you legitimately operate from the Akatsi address) so Google has
    consistent name/URL confirmations. Only real, verified listings.

## SEO classification

**AMBER — technical SEO corrected, Google processing or ranking pending.**

- The site is technically eligible: crawlable, correct status codes, single self-canonicals on
  the HTTPS apex, valid robots and sitemap, consistent structured data.
- The one concrete technical defect found (sitemap vs canonical trailing slash) is fixed on the
  branch.
- Indexation of the important pages is **not confirmed**, and the brand-query visibility depends
  on Google processing and entity/authority signals. Per the brief, this is **not** classified
  GREEN on the strength of a passing build or an indexing request.

## Status of this work

- Branch: `fix/seo-brand-visibility` from `main` (`9f2ce2f`). **Not deployed.**
- No DNS change, no paid service, no fabricated data, no thin content, no unrelated redesign.
- The lead-management security correction is separate (`feat/lead-management-foundation`,
  commit `b468d7c`) and shares no changed file with this branch except none — the branches touch
  different paths (`src/app/page.tsx` vs `src/app/(site)/page.tsx`) and this branch deliberately
  leaves `robots.ts` alone.
