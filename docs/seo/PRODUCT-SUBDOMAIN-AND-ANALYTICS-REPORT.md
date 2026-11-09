# Product subdomains and analytics: implementation report

Date: 9 November 2026
Site: `https://bloomcoretech.com`
Repository: `Delkay-byte/BloomCore-Technologies`
Implementation commit: `1cc9ef4`
Implementation deploy: `6af210a17902c7d10366691e`
Documentation deploy: `6af211a85e28ec1c0a49deb5`

## A. Executive summary

Two controlled changes were made to the corporate site:

1. SchemeKnit and MaaCash public calls to action now point at branded
   `bloomcoretech.com` subdomains instead of the old Render hostnames.
2. The published Google Tag Manager container `GTM-TQK7FMJT`, which contains the
   GA4 Google tag `G-GDBL5SNHKL`, is installed behind an explicit consent choice.

The corporate pages remain canonical on `bloomcoretech.com`. TillProof remains
listed as in development, stays indexable and stays in the sitemap, but has no
public application link. No DNS record was changed. No GTM container was edited
from this workspace.

Code, lint, TypeScript and the static build pass. The changes are deployed and
the public site was checked in a browser. GA4 account-side reporting is not
verified because GTM and GA4 account access is unavailable here.

## B. Scope and constraints

In scope:

- Corporate repository only.
- Product CTA destinations and their analytics attributes.
- Consent-gated GTM and GA4 installation.
- Privacy notice, assistant knowledge base and operational documentation.
- Local checks, production checks, commit, push and deployment.

Out of scope and untouched:

- SchemeKnit, MaaCash and TillProof application repositories.
- DNS records, including Google Search Console and Bing verification TXT records.
- The published GTM container and its tags, triggers and settings.
- Application-side analytics.

Constraints applied:

- One GTM container only.
- One GA4 Google tag inside that container.
- No standalone `gtag.js` script and no GA4 measurement ID environment variable.
- No analytics request before a visitor chooses Allow analytics.
- No personal data in custom events or the data layer.
- No `contact_form_submit` claim, because the contact form cannot confirm email
  delivery.

## C. Pre-change state

- `main` was clean at `111ef9c`, matching `origin/main`.
- `PRODUCT_LINKS` in `src/lib/brand.ts` still pointed at:
  - `https://schemeknit-frontend.onrender.com/`
  - `https://bloomcore-one.onrender.com/`
- The site had no GTM container and no GA4 tag.
- A previous GA4 loader depended on `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- The privacy notice described analytics as conditional on a measurement ID.
- Documentation described an analytics integration that had never collected data.

## D. Product destination changes

`src/lib/brand.ts` now defines:

```ts
export const PRODUCT_LINKS = {
  schemeknit: "https://schemeknit.bloomcoretech.com/",
  maacash: "https://maacash.bloomcoretech.com/",
  tillproof: "https://tillproof.bloomcoretech.com/",
} as const;
```

Public calls to action:

| Product | Corporate page | Public application link | Attributes |
| --- | --- | --- | --- |
| SchemeKnit | `/products/schemeknit` | `https://schemeknit.bloomcoretech.com/` | `target="_blank"`, `rel="noopener noreferrer"` |
| MaaCash | `/products/maacash` | `https://maacash.bloomcoretech.com/` | `target="_blank"`, `rel="noopener noreferrer"` |
| TillProof | `/products/tillproof` | none | no launch button |

Browser checks confirm both subdomains serve the intended applications over
HTTPS:

- SchemeKnit title: `SchemeKnit — Lesson Plan Generator for Ghanaian Teachers`
- MaaCash title: `MaaCash — Mobile Money, Susu & Multi-Branch Financial Operations Platform`

Earlier command-line HTTPS requests to those hosts timed out from this
workstation, while browser requests succeeded. The browser result is the
user-facing evidence; the transport discrepancy is recorded rather than hidden.

`tillproof.bloomcoretech.com` does not resolve or serve a site
(`ERR_TUNNEL_CONNECTION_FAILED`). That is expected while the product is
unreleased and is why no public CTA points there.

## E. TillProof handling

- The product page remains at `/products/tillproof`.
- The page has `robots` value `index, follow`.
- The page remains in `sitemap.xml`.
- The page has no application launch button and no outbound application link.
- The page does not emit `SoftwareApplication` structured data.
- `PRODUCT_LINKS.tillproof` exists for central completeness but no public CTA
  reads it.
- The page still emits `product_page_view` with `product_name: "TillProof"` after
  consent, so interest in the unreleased product can be measured without
  implying availability.

## F. Analytics architecture

- Container: `GTM-TQK7FMJT`
- GA4 Google tag inside the container: `G-GDBL5SNHKL`
- Container script: `https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT`

`src/lib/analytics.ts` injects that one script only after the visitor chooses
Allow analytics. The site never loads `gtag.js` directly. Before a choice, the
production HTML contains no GTM reference and the browser makes no request to
`googletagmanager.com` or `google-analytics.com`.

The GA4 Google tag inside the container sends `page_view`. The site does not send
a manual `page_view`, so the initial document load and Next.js client navigation
are not double counted. A check on production showed one `page_view` for the
initial load and one additional `page_view` after client navigation.

The GTM `noscript` iframe was deliberately omitted. It would request GTM before a
visitor makes a choice and would contradict the consent gate.

## G. Consent implementation

The preference is stored in `localStorage` under `bloomcore-analytics-consent`
with value `granted` or `denied`.

Flow:

1. First visit: a panel offers `Allow analytics` and `Keep off`. Nothing loads.
2. Allow: stores `granted`, sets analytics consent to granted and advertising
   consent to denied, then loads GTM.
3. Keep off: stores `denied`, loads nothing.
4. Reload after either choice: the panel stays closed and the stored choice is
   applied. A denied choice still makes no Google request.
5. `Analytics settings` in the footer reopens the panel.
6. Withdraw: stores `denied`, sets `window["ga-disable-G-GDBL5SNHKL"] = true`,
   pushes a denied consent update if GTM is present, and clears accessible `_ga`
   cookies.
7. Allow again after withdrawal: clears the disable flag, restores granted
   consent and resumes measurement without a second GTM script.

Consent Mode parameters observed on an accepted production session:
`gcs=G101`, meaning advertising storage denied and analytics storage granted.

The privacy notice now names Google Tag Manager and Google Analytics 4, explains
the choice, explains withdrawal and states that form contents are not sent.

## H. Event plan and personal data

Custom events are sent through the `gtag('event', ...)` command queue that the
container's GA4 Google tag consumes.

| Event | Fires when | Parameters |
| --- | --- | --- |
| `product_page_view` | a product information page mounts | `product_name` |
| `resource_article_view` | a resource article mounts | `article_slug` |
| `product_cta_click` | an enquiry button is clicked | `product_name`, `location` |
| `product_outbound_click` | a launch button opens a live application | `product_name`, `location`, `destination_type` |
| `contact_form_start` | the first contact field changes | none |
| `contact_email_prepared` | the form validates and prepares a `mailto:` message | `enquiry_type` |

`contact_form_submit` was renamed to `contact_email_prepared`. The site opens the
visitor's own email application and cannot confirm that the message was sent, so
it must not report a submitted enquiry.

A production check of the SchemeKnit launch action produced this data-layer
event:

```json
{
  "event": "product_outbound_click",
  "product_name": "SchemeKnit",
  "location": "product_launch",
  "destination_type": "product_application"
}
```

A local end-to-end check filled the contact form with a test name, email,
organisation and message. The resulting analytics requests contained
`contact_form_start` and `contact_email_prepared`, and no request contained the
test email address, name, organisation or message text.

GA4 enhanced measurement also produces automatic events such as `form_start`,
`form_submit` and `click`. Those names are separate from the custom events. The
owner must decide whether automatic outbound-click measurement should stay
enabled alongside `product_outbound_click`, or whether one of them should be
removed. The same decision applies to automatic form events alongside
`contact_form_start` and `contact_email_prepared`.

No enhanced conversions, Customer Match, advertising remarketing or session
recording was added.

## I. SEO preservation

Verified on production:

- Homepage canonical: `https://bloomcoretech.com/`
- Product canonicals remain on the corporate domain:
  - `https://bloomcoretech.com/products/schemeknit`
  - `https://bloomcoretech.com/products/maacash`
  - `https://bloomcoretech.com/products/tillproof`
- All 15 sitemap URLs use `https://bloomcoretech.com`; none use a product
  subdomain.
- `robots.txt` remains:

```text
User-Agent: *
Allow: /

Host: bloomcoretech.com
Sitemap: https://bloomcoretech.com/sitemap.xml
```

- SchemeKnit and MaaCash pages keep `BreadcrumbList`, `FAQPage`,
  `SoftwareApplication`, `Organization` and `WebSite` structured data.
- TillProof keeps `BreadcrumbList`, `FAQPage`, `Organization` and `WebSite`, and
  remains indexable.
- Product pages keep Open Graph and Twitter metadata and the canonical
  `bloomcoretech.com` URL.
- Redirects still work:
  - `https://www.bloomcoretech.com/` → `301` → `https://bloomcoretech.com/`
  - `/products/bloomcore-one` → `301` → `/products/maacash`
  - `/products/bik-prestige` → `301` → `/products/maacash`
  - `https://bloomcore-technologies.netlify.app/` → `301` → `https://bloomcoretech.com/`

No DNS record was changed. No Google Search Console or Bing verification tag is
present in the HTML, which is consistent with DNS-based verification. TXT
records could not be queried through the resolvers available here, so DNS
verification was left untouched and is not claimed as re-verified.

## J. Local verification

Commands:

```text
npm run lint          pass, no output
npx tsc --noEmit      pass, no output
npm run build         pass, 19 static routes generated
```

Local browser checks against the exported build:

- No Google request before a choice.
- `Keep off` persisted after reload; no GTM request.
- Allow loaded exactly one `GTM-TQK7FMJT` script and one initial `page_view`.
- Client navigation produced one additional `page_view` and one
  `product_page_view`.
- `product_outbound_click` was delivered with `product_name=SchemeKnit` and
  `destination_type=product_application`.
- `contact_form_start` and `contact_email_prepared` were delivered; no form
  values appeared in analytics requests.
- Withdrawal set the disable flag, wrote denied consent and cleared accessible
  `_ga` cookies.
- Re-allowing cleared the disable flag and resumed measurement.
- No console errors were observed on the checked pages.

## K. Production deployment and verification

The implementation was committed as `1cc9ef4` and pushed to `origin/main`. Netlify
built and published deploy `6af210a17902c7d10366691e`.

Production checks:

| Check | Result |
| --- | --- |
| Canonical on homepage | `https://bloomcoretech.com/` |
| GTM or GA in HTML before consent | none |
| Google requests before consent | none |
| Consent panel shown on first visit | yes |
| Allow loads one GTM container | yes, `GTM-TQK7FMJT` |
| Initial GA4 `page_view` | yes, `tid=G-GDBL5SNHKL` |
| Client navigation | one additional `page_view` |
| `product_page_view` on SchemeKnit | yes, `product_name=SchemeKnit` |
| SchemeKnit launch link | `https://schemeknit.bloomcoretech.com/`, new tab, `noopener noreferrer` |
| `product_outbound_click` data-layer event | yes, with product, location and destination type |
| MaaCash page | canonical correct, launch link `https://maacash.bloomcoretech.com/` |
| TillProof page | indexable, in sitemap, no launch link, no `SoftwareApplication` |
| `Keep off` on production | persisted after reload, no Google request |
| Withdraw on production | preference denied, disable flag set, accessible GA cookies cleared |
| Sitemap | 15 apex URLs, no subdomains |
| robots.txt | apex host and sitemap unchanged |
| Redirects | `www`, old product slugs and old Netlify host return `301` |

The SchemeKnit and MaaCash applications themselves were checked in the browser.
The TillProof subdomain is unresolved and was not expected to serve a page.

## L. Open items and owner actions

These items cannot be completed from this workspace and are not claimed as done:

1. Confirm the Google tag in GTM Preview or Tag Assistant with GTM account
   access.
2. Confirm GA4 Realtime or DebugView shows `page_view`, `product_page_view` and
   `product_outbound_click`.
3. Decide whether GA4 enhanced measurement's automatic outbound click should stay
   enabled alongside `product_outbound_click`. Keep one clear reporting event.
4. Decide whether automatic user-provided data collection should stay enabled in
   the GTM Google tag. The owner reported it is on for email, phone and address.
   The published container JavaScript contains `user_data_settings` and
   `auto_detect` code paths, which is consistent with that report, but the
   account toggle cannot be read here. BloomCore has no approved
   enhanced-conversions or Customer Match use case. Recommendation: turn it off
   unless a specific approved use case exists.
5. Decide whether automatic form events should be reported alongside the custom
   contact events, or whether custom events should be the single source.
6. Confirm the `tillproof.bloomcoretech.com` DNS record and application only when
   the product is ready for a public launch.
7. Keep Google Search Console and Bing TXT verification records unchanged.
8. Mark only `contact_email_prepared`, `product_cta_click` and
   `product_outbound_click` as key events in GA4. Do not mark page views as
   conversions.

## M. Rollback and references

Rollback of the site changes:

```text
git revert 1cc9ef4
git push origin main
```

That restores the previous product destinations and removes the GTM integration.
It does not change the published GTM container, DNS records or the product
applications.

To stop measurement without reverting code, set the analytics choice to
`denied`, withdraw consent through the footer, or remove the GTM container ID
from `src/lib/analytics.ts` and redeploy.

References:

- `src/lib/analytics.ts`
- `src/components/Analytics.tsx`
- `src/components/AnalyticsSettingsButton.tsx`
- `src/components/ProductPageShell.tsx`
- `src/lib/brand.ts`
- `src/app/privacy/page.tsx`
- `docs/seo/07-analytics-and-conversion-tracking.md`
- GTM container: `https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT`
- GA4 property identifier used by the container: `G-GDBL5SNHKL`
