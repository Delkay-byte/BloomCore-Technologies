# Product subdomains and analytics: implementation report

Date: 9 November 2026
Site: `https://bloomcoretech.com`
Repository: `Delkay-byte/BloomCore-Technologies`
Implementation commit: `1cc9ef4`
Implementation deploy: `6af210a17902c7d10366691e`
Documentation deploy: `6af211a85e28ec1c0a49deb5`
Analytics re-verification: 10 November 2026
GTM privacy recheck: 10 November 2026, 10:57 UTC — NOT VERIFIED
Intended-container audit: 10 November 2026, 11:08 UTC — NOT VERIFIED
Intended-container recheck: 10 November 2026, 11:15 UTC — still NOT VERIFIED
Intended-container third recheck: 10 November 2026, 12:09 UTC — still NOT VERIFIED
Favicon fix commit: `a034d8f`
Favicon deploy: `6af2f10202f903ced39a86a4`

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

On 10 November 2026 the production analytics behaviour was independently
re-checked in a browser. Consent gating, the single GTM container, the GA4
measurement ID, page views, product events and the absence of observed personal
data all passed. However, the published container still enabled automatic
user-provided data collection. Google account surfaces (published GTM version,
Tag Assistant, GA4 Realtime and DebugView) also required authentication.

After the owner reported publishing a fix, the public container JavaScript was
fetched again at 10:57 UTC on 10 November 2026. It still served the same
enabled `__ogt_1p_data_v2` tag. The privacy verification is therefore
**NOT VERIFIED**, and the audit stopped at that failed check. See sections N
and N.9.

The owner then identified a second container, `GTM-PMZ6ZSVT`, as the intended
BloomCore corporate container. Its public JavaScript was audited on
10 November 2026 at 11:08 UTC. It contains the correct GA4 tag
`G-GDBL5SNHKL` and the required automatic events, but it still enables the same
automatic user-provided data collection tag. After the owner reported a second
publication, the container was fetched three more times at 11:15 UTC. It still
served the enabled tag. A third check at 12:09 UTC returned a byte-identical
base response with the same enabled tag. Production was not switched to an
unverified container. The mismatch and exact evidence are recorded in
section P. Result: **NOT VERIFIED**.

A separate favicon fix now gives Google Search eligible 48px, 96px and 192px
icons plus a multi-resolution `/favicon.ico`. Production assets and homepage
metadata were verified after deploy. Google's displayed Search icon has not
been re-checked and is not claimed as changed. See section O.

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

These items cannot be completed from this workspace and are not claimed as done.
Section N updates items 1, 2 and 4 with the 10 November 2026 production check.

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

## N. Independent analytics re-verification, 10 November 2026

Final classification: **NOT VERIFIED**. Automatic user-provided data collection
remains enabled in the publicly served container; see N.9.

The production site was driven in an independent browser session. Network
requests, the data layer, consent state, cookies and the public GTM container
JavaScript were inspected. The check did not edit source, GTM settings, the
published container, GA4 property settings or consent behaviour.

### N.1 Access limits

- GTM redirected to `accounts.google.com` and required sign-in.
- GA4 redirected to `accounts.google.com` and required sign-in.
- Tag Assistant showed a `Sign in` control and required sign-in to add the
  domain.
- The published GTM version number and the account-side toggles are therefore
  not independently readable from this workspace.
- The public container JavaScript is readable without authentication and was
  used to inspect the active tag configuration.

### N.2 Container, tag and consent checks

| Check | Observed result | Status |
| --- | --- | --- |
| Production HTML before consent contains GTM or GA | `googletagmanager` 0, `google-analytics` 0, `GTM-TQK7FMJT` 0, `G-GDBL5SNHKL` 0 | pass |
| Google request before consent | none | pass |
| Allow loads one GTM container | one script, `https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT` | pass |
| Standalone `gtag.js` | none | pass |
| GTM `noscript` iframe | none | pass |
| GA4 measurement ID on collect requests | `tid=G-GDBL5SNHKL` | pass |
| Consent signal after Allow | `gcs=G101` (analytics granted, advertising denied) | pass |
| Ad storage, ad user data, ad personalisation | denied | pass |
| Keep off | `bloomcore-analytics-consent=denied`, no GTM script, no Google request | pass |
| Withdraw after Allow | flag `ga-disable-G-GDBL5SNHKL` set, `_ga` and `_ga_GDBL5SNHKL` cookies cleared, no later Google request from a tracked click | pass |
| Allow again after withdrawal | consent granted, disable flag cleared, measurement resumed | pass |
| Published GTM version | not readable without GTM sign-in | blocked |
| Automatic user-provided data collection | still enabled in the published container; see N.5 | **fail** |

### N.3 Page views and SPA navigation

- Initial homepage load produced exactly one `page_view`.
- Client navigation from `/` to `/products/schemeknit` produced exactly one
  additional `page_view` and one `product_page_view`.
- Client navigation from `/products/schemeknit` to `/products/maacash`
  produced exactly one additional `page_view` and one `product_page_view`.
- No duplicate initial `page_view` was observed. GA4 sends the page view after
  the history event, so it can arrive a few seconds after the visible route
  change.

### N.4 Event parameters observed

| Event | Observed parameters | Status |
| --- | --- | --- |
| `page_view` | `tid=G-GDBL5SNHKL`, `dl` matching each route, `gcs=G101` | pass |
| `product_page_view` | `product_name=SchemeKnit`, `product_name=MaaCash` | pass |
| `product_outbound_click` | `product_name=MaaCash`, `location=product_launch`, `destination_type=product_application` | pass |
| `contact_form_start` | no parameters | pass |
| `contact_email_prepared` | `enquiry_type=General enquiry` | pass |
| automatic outbound `click` | `link_url`, `link_domain=github.com`, `outbound=true` | observed |
| automatic outbound `click` for the product launch | none | no duplicate |

The MaaCash launch destination is `https://maacash.bloomcoretech.com/`, a
subdomain of the measured domain. GA4 did not mark that link as an outbound
click, so the custom `product_outbound_click` is the only product-launch event.
An external GitHub link produced the automatic `click` event instead. This
means automatic outbound measurement does not double count the product launch,
but it does add a separate `click` event for genuinely external links.

### N.5 Discrepancy: automatic user-provided data collection

The owner reported that automatic user-provided data collection was disabled.
The public container JavaScript served on 10 November 2026 at approximately
10:20 UTC still contains an enabled user-provided data tag:

```json
{"function":"__ogt_1p_data_v2","priority":13,"vtp_isAutoEnabled":true,"vtp_isManualEnabled":false,"vtp_autoPhoneEnabled":true,"vtp_autoAddressEnabled":true,"vtp_autoEmailEnabled":true,"vtp_isAutoCollectPiiEnabledFlag":true,"tag_id":8}
```

The container also enables automatic events, including outbound click, form,
scroll, download, video and history events:

```json
{"function":"__ogt_auto_events","priority":23,"vtp_enableOutboundClick":true,"vtp_enableScroll":true,"vtp_enableDownload":true,"vtp_enableHistoryEvents":true,"vtp_enableForm":true,"vtp_enableVideo":true}
```

The same container serves the GA4 Google tag `G-GDBL5SNHKL` and the enhanced
measurement tags. The published version cannot be read without GTM sign-in, so
the exact version that produced this configuration is not claimed. The
configuration observed at the time of the check is not consistent with
"automatic user-provided data collection is disabled". A GTM owner must confirm
the toggle, publish the change and confirm that the served container no longer
contains the enabled `__ogt_1p_data_v2` tag.

No personal data was observed in the requests during the contact-form test, but
the enabled automatic detection remains a privacy risk until it is confirmed
off and republished.

### N.6 Personal data check

The contact form was filled with non-personal test values and submitted. The
data layer contained `contact_form_start` and `contact_email_prepared`. The
only observed contact collect request carried `ep.enquiry_type=General enquiry`.
No captured request contained the test name, test email address, test
organisation or test message text. The page displayed "Nothing has been sent
yet" and opened a prepared `mailto:` link, so `contact_email_prepared` remains
an email-composer action and is not a submitted-lead event.

### N.7 GA4 Realtime and DebugView

Not independently verified. Both surfaces require an authenticated GA4 session,
and the browser was redirected to the Google sign-in page. The owner's reported
Realtime and DebugView tests are noted but are not treated as independent
evidence in this report. The production collect requests do prove that events
with the expected names and parameters reached
`https://www.google-analytics.com/g/collect` with `tid=G-GDBL5SNHKL`.

### N.8 Analytics conclusion

Consent gating, container installation, measurement ID, page-view counting,
SPA page views, product events, external-click behaviour and the observed
absence of form data all passed. The privacy configuration is nevertheless
**NOT VERIFIED**, because:

1. The served container still enables automatic user-provided data collection,
   which contradicts the owner's completion claim.
2. The published GTM version, Tag Assistant, GA4 Realtime and GA4 DebugView
   could not be read without authentication.

### N.9 Recheck after the owner's published fix

The owner reported that `GTM-TQK7FMJT` had been updated and published to disable
automatic user-provided data collection. Verification only followed: no source
file, GTM setting, container version or GA4 property was changed.

Public container fetch:

```text
URL:     https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT
Time:    2026-11-10T10:57:26Z
Status:  200
Bytes:   546752
Cache:   private, max-age=900
SHA-256: 5CAD9F8DFB5B1074A8A6AA0F9D7D49FB6510798C3C1AFA1490551CF3CD7D6257
```

The same JavaScript was fetched again at 10:57:36 UTC with `curl` and at
10:58:08 UTC through an independent HTTP client. All responses served the same
enabled tag. The asset size and configuration matched the earlier 10:20 UTC
fetch.

Exact compiled tag in the published container:

```json
{"function":"__ogt_1p_data_v2","priority":13,"vtp_isAutoEnabled":true,"vtp_isManualEnabled":false,"vtp_autoPhoneEnabled":true,"vtp_autoCollectExclusionSelectors":["list",["map","exclusionSelector",""]],"vtp_isEnabled":true,"vtp_autoAddressEnabled":true,"vtp_autoEmailEnabled":true,"vtp_isAutoCollectPiiEnabledFlag":true,"tag_id":8}
```

This is positive evidence of the enabled state, not an absence of fields:

| Field | Served value |
| --- | --- |
| `vtp_isAutoEnabled` | `true` |
| `vtp_autoEmailEnabled` | `true` |
| `vtp_autoPhoneEnabled` | `true` |
| `vtp_autoAddressEnabled` | `true` |
| `vtp_isAutoCollectPiiEnabledFlag` | `true` |

The correct container and measurement ID remain configured:

```json
{"function":"__gct","vtp_trackingId":"G-GDBL5SNHKL","vtp_sessionDuration":0,"tag_id":4}
```

- `GTM-TQK7FMJT` is present in the container bootstrap.
- `G-GDBL5SNHKL` is present as the Google tag tracking ID.
- Automatic events remain enabled, including form, outbound click and history
  events.

The published version number is not independently readable without GTM
sign-in, so no version number is claimed. The verification failed before the
consent, page-view and contact-form rechecks were repeated, as instructed for a
failed privacy check. The earlier consent and event results in N.2 to N.6 still
describe the same live website code and container at 10:20 UTC, but they are not
presented as a new passing recheck.

Required owner action: in GTM, verify the Google tag's user-provided data
setting, publish the corrected container, then confirm that
`https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT` no longer contains the
enabled `__ogt_1p_data_v2` tag. A new fetch after the container cache expires is
required before this item can be marked verified.

## O. Favicon fix and production deployment, 10 November 2026

### O.1 Source brand asset

The official source is `assets/BloomCore Technologies Logo.png`, the approved
white hexagonal C symbol and BloomCore Technologies wordmark. The standalone
brand mark already existed at `src/assets/brand/bloomcore-c-symbol.png`, a
512 x 512 transparent extraction of the C element. No new logo was invented and
no SchemeKnit, MaaCash or third-party mark was used.

The favicon keeps the existing treatment: the white C on a rounded `#080808`
tile, with no wordmark. The tile keeps the white mark visible on light and dark
browser chrome.

### O.2 Generated assets

`scripts/extract-brand-assets.py` now generates:

| Asset | Dimensions | Purpose |
| --- | --- | --- |
| `public/favicon.ico` | 16, 32 and 48 px frames | conventional root icon |
| `public/favicon-16.png` | 16 x 16 | browser tab |
| `public/favicon-32.png` | 32 x 32 | browser tab and shortcut |
| `public/favicon-48x48.png` | 48 x 48 | Google Search minimum |
| `public/favicon-96x96.png` | 96 x 96 | high-density display |
| `public/favicon-192x192.png` | 192 x 192 | high-density display |
| `public/apple-touch-icon.png` | 180 x 180 | Apple touch icon |

All files are square, preserve the mark's aspect ratio and contain valid raster
data. The ICO contains three frames. The PNGs were resized with Lanczos from the
extracted mark.

### O.3 Homepage metadata

`src/app/layout.tsx` now exposes one clear primary icon plus the larger rasters:

```html
<link rel="shortcut icon" href="/favicon.ico"/>
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" type="image/x-icon"/>
<link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png"/>
<link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png"/>
<link rel="icon" href="/favicon-192x192.png" sizes="192x192" type="image/png"/>
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"/>
<link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"/>
```

Canonical URLs, Open Graph metadata, Twitter metadata, Organization JSON-LD,
the sitemap and the analytics integration were not changed. The favicon is not
in the sitemap. `robots.txt` still allows all user agents and does not block the
icons.

### O.4 Production asset verification

Checked after deployment on 10 November 2026:

| URL | HTTP | Content-Type | Dimensions | Redirects |
| --- | --- | --- | --- | --- |
| `/favicon.ico` | 200 | `image/vnd.microsoft.icon` | 48 x 48, 16/32/48 frames | 0 |
| `/favicon-48x48.png` | 200 | `image/png` | 48 x 48 | 0 |
| `/favicon-96x96.png` | 200 | `image/png` | 96 x 96 | 0 |
| `/favicon-192x192.png` | 200 | `image/png` | 192 x 192 | 0 |
| `/favicon-32.png` | 200 | `image/png` | 32 x 32 | 0 |
| `/favicon-16.png` | 200 | `image/png` | 16 x 16 | 0 |
| `/apple-touch-icon.png` | 200 | `image/png` | 180 x 180 | 0 |

All responses are public, return valid image data and require no
authentication. The live rendered homepage head contains the eight icon
declarations above. The live ICO was downloaded again and decoded to confirm
the 16, 32 and 48 px frames.

### O.5 Build, commit and deployment

```text
npm run lint          pass, no output
npx tsc --noEmit      pass, no output
npm run build         pass, 19 static routes generated
```

- Commit: `a034d8fea964e27d3099efb3648d822bea62db90`
- Netlify deploy: `6af2f10202f903ced39a86a4`
- Published at: 2026-11-10T10:25:32Z
- Deployed commit matches `a034d8f`

The browser loaded the production homepage after deploy and reported the new
icon links. A screenshot of browser chrome was not captured, so this report does
not claim a visual browser-tab check beyond the served icon and the rendered
head.

### O.6 Google Search Console follow-up

Google Search Console also requires an authenticated Google session, and the
browser was redirected to sign-in. Live URL inspection and a request to index
`https://bloomcoretech.com/` were therefore not performed. This is an owner
action:

1. Open Google Search Console for the `bloomcoretech.com` property.
2. Inspect `https://bloomcoretech.com/` with Test Live URL.
3. Confirm the homepage and icons are accessible.
4. Request indexing of the homepage once.
5. Do not change the favicon URL again while Google recrawls.

Google has not been confirmed to have refreshed the Search result icon. The
deployment makes the site eligible by serving valid, crawlable icons of at
least 48 x 48. Google's adoption and display timing remain outside this
workspace and are not guaranteed.

### O.7 Favicon conclusion

Implementation and production delivery are **VERIFIED**. Google's displayed
Search icon is **NOT YET VERIFIED** and must not be reported as changed until
Search Console or a Search result shows the new icon.

## P. GTM container mismatch audit, 10 November 2026

Final classification: **NOT VERIFIED**. The intended container
`GTM-PMZ6ZSVT` is not safely published, so production was not switched.

### P.1 Why the old container was loaded

The runtime installation is hard-coded, not environment-driven. The only active
loader uses `GTM_CONTAINER_ID` in `src/lib/analytics.ts`, and that constant still
held `GTM-TQK7FMJT`. The production HTML contains no GTM reference before
consent, and the loader injects
`https://www.googletagmanager.com/gtm.js?id=GTM-TQK7FMJT` after Allow.

Locations found:

| Location | Role | Action |
| --- | --- | --- |
| `src/lib/analytics.ts` line 9 | active runtime container ID | unchanged, blocked |
| `README.md` line 54 | documentation | unchanged, blocked |
| `netlify.toml` line 43 | deployment comment | unchanged, blocked |
| `.env.example` line 12 | comment only; no analytics variable | unchanged, blocked |
| `docs/seo/07-analytics-and-conversion-tracking.md` | historical operations doc | unchanged, blocked |
| `docs/seo/PRODUCT-SUBDOMAIN-AND-ANALYTICS-REPORT.md` | audit record | this section |

There is no GTM environment variable, no GTM `noscript` iframe and no second GTM
loader in the repository.

### P.2 Intended container verification

The owner reports that `GTM-PMZ6ZSVT` is the intended BloomCore corporate
website container. Its public JavaScript was fetched directly:

```text
URL:     https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT
Time:    2026-11-10T11:07:48Z and 11:08:12Z
Status:  200
Bytes:   557087
SHA-256: F801A602C621FED8DE1C234EFF4FE8134B8A65600F4B9EE5E5C1C8D672AF5D34
```

The correct container bootstrap and GA4 Google tag are present:

```json
{"function":"__gct","vtp_trackingId":"G-GDBL5SNHKL","vtp_sessionDuration":0,"tag_id":9}
```

Page-view and browser-history behaviour remain enabled:

```json
{"function":"__ogt_auto_events","priority":23,"vtp_enableOutboundClick":true,"vtp_enableScroll":true,"vtp_enableDownload":true,"vtp_enableHistoryEvents":true,"vtp_enableForm":true,"vtp_enableVideo":true}
```

The container is therefore the right destination and still uses
`G-GDBL5SNHKL`. However, its published configuration enables automatic
user-provided data collection:

```json
{"function":"__ogt_1p_data_v2","priority":13,"vtp_isAutoEnabled":true,"vtp_isManualEnabled":false,"vtp_autoPhoneEnabled":true,"vtp_autoCollectExclusionSelectors":["list",["map","exclusionSelector",""]],"vtp_isEnabled":true,"vtp_autoAddressEnabled":true,"vtp_autoEmailEnabled":true,"vtp_isAutoCollectPiiEnabledFlag":true,"tag_id":13}
```

| Field | Served value |
| --- | --- |
| `vtp_isAutoEnabled` | `true` |
| `vtp_autoEmailEnabled` | `true` |
| `vtp_autoPhoneEnabled` | `true` |
| `vtp_autoAddressEnabled` | `true` |
| `vtp_isAutoCollectPiiEnabledFlag` | `true` |

No `false` value was present for these fields. This is positive evidence of the
enabled state, not merely an absence of configuration.

### P.3 Decision and current production state

Production still loads `GTM-TQK7FMJT`. It was not changed to
`GTM-PMZ6ZSVT` because the intended container has not been safely published.
This follows the instruction not to switch production to an unverified
container. No source file, GTM container, GA4 property, consent behaviour or
analytics event was changed in this step. No build or deployment was performed
for this audit.

Consequences:

1. The website still loads the old container, which also enables automatic
   user-provided data collection.
2. The container mismatch is real: editing `GTM-PMZ6ZSVT` has no production
   effect while the site loads `GTM-TQK7FMJT`.
3. Changing the source ID now would move production to a container that is
   still not privacy-safe.

### P.4 Required owner action

1. Open `GTM-PMZ6ZSVT`.
2. Disable automatic user-provided data collection in the Google tag.
3. Publish the container.
4. Re-fetch `https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT` after the
   container cache expires.
5. Confirm the served `__ogt_1p_data_v2` tag is absent or has all five fields
   set to `false`.
6. Only then change `GTM_CONTAINER_ID` to `GTM-PMZ6ZSVT`, run lint, TypeScript,
   build and the consent/event regression checks, deploy, and verify that the
   browser network loads only `gtm.js?id=GTM-PMZ6ZSVT`.

The GA4 Measurement ID must remain `G-GDBL5SNHKL`. Do not load both containers
and do not add standalone `gtag.js`.

### P.5 Recheck after the owner's second publication

The owner then confirmed that `GTM-PMZ6ZSVT` had been published again. The public
container was fetched three times with independent HTTP requests on
10 November 2026:

| Request | Timestamp (UTC) | Status | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| 1, `cb` parameter | 2026-11-10T11:15:52Z | 200 | 557087 | `A428176A1DF02A318BD5665BDEA0D9C0745DB21FDAC666669A2973797DDC3B36` |
| 2, `l=check` | 2026-11-10T11:15:54Z | 200 | 557083 | `B0767A8511DC3B044E8B8BCEB5F8A70D1C023A2D6D2FACD9F30CCBBEF28057C1` |
| 3, `l=verify` | 2026-11-10T11:15:55Z | 200 | 557084 | `0B4272ED547CE35D1C49A1BFF0F59C58CDA820B89227B76C6B13E5DC3C014CF9` |

Two further requests to the exact same URL returned the same 557087 bytes and
the same `A428176A...` hash, so the base response is stable.

All three responses served the same enabled user-provided data tag:

```json
{"function":"__ogt_1p_data_v2","priority":13,"vtp_isAutoEnabled":true,"vtp_isManualEnabled":false,"vtp_autoPhoneEnabled":true,"vtp_autoCollectExclusionSelectors":["list",["map","exclusionSelector",""]],"vtp_isEnabled":true,"vtp_autoAddressEnabled":true,"vtp_autoEmailEnabled":true,"vtp_isAutoCollectPiiEnabledFlag":true,"tag_id":13}
```

Positive enabled evidence:

```text
"vtp_isAutoEnabled":true                        1 match
"vtp_autoEmailEnabled":true                     1 match
"vtp_autoPhoneEnabled":true                     1 match
"vtp_autoAddressEnabled":true                   1 match
"vtp_isAutoCollectPiiEnabledFlag":true          1 match
```

No corresponding `false` value appeared for any of the five fields. The GA4 tag
remained correct:

```json
{"function":"__gct","vtp_trackingId":"G-GDBL5SNHKL","vtp_sessionDuration":0,"tag_id":9}
```

Automatic outbound click, form, scroll, download, video and browser-history
detection remained enabled.

The base response was still 557087 bytes, the same size as the 11:07 UTC fetch,
and the tag still had `tag_id:13` with all five fields set to `true`. The
published privacy correction is therefore not present in the public
configuration served at 11:15 UTC.

### P.6 Second decision

Production was not switched. `src/lib/analytics.ts` still contains
`GTM-TQK7FMJT`; `GTM-PMZ6ZSVT` is not loaded; no source, GTM, GA4 or consent
setting changed; no build or deployment ran for this recheck.

Final classification for this attempt:

| Area | Result |
| --- | --- |
| Published GTM configuration verified | **NOT VERIFIED** — auto user data still enabled |
| Website code updated | no |
| Production deployment verified | no |
| Privacy and consent regression verified | not run; stopped at the failed precondition |

The owner must confirm in the GTM account that the change was saved to the
correct container, published, and that its public JavaScript no longer contains
the enabled tag. A source switch before that would move production from one
privacy-unsafe container to another.

### P.7 Third recheck after `allow_user_provided_data: false`

The owner then reported setting `allow_user_provided_data` to `false` and
publishing a fresh container version, and explicitly authorised the production
switch. The public container was fetched three more times on
10 November 2026:

| Request | Timestamp (UTC) | Status | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| 1, `cb` parameter | 2026-11-10T12:09:39Z | 200 | 557087 | `A428176A1DF02A318BD5665BDEA0D9C0745DB21FDAC666669A2973797DDC3B36` |
| 2, `l=check` | 2026-11-10T12:09:41Z | 200 | 557083 | `E4EA5C61B843008B44690AEFFFB7CCBB2A08A6024353D65F7C8B217A4BE9B817` |
| 3, `l=verify` | 2026-11-10T12:09:43Z | 200 | 557084 | `055FDE15E690D90791E1DA71D6DB199FA15CA41BAF48C83A15B2E8CBEA6B4C26` |

The base response is byte-identical to the 11:15 UTC fetch: 557087 bytes and
the same `A428176A...` hash. No new published container artefact is visible at
the public URL.

The destination tag now carries the reported setting:

```json
{"function":"__dest_ga","metadata":["map"],"once_per_event":true,"vtp_destinationId":"G-GDBL5SNHKL","vtp_configSettingsTable":["list",["map","parameter","allow_user_provided_data","parameterValue","false"]],"vtp_enableVariablesInDestinationId":true,"tag_id":3}
```

However, the automatic user-provided data collection tag is still enabled in
the same served container:

```json
{"function":"__ogt_1p_data_v2","priority":13,"vtp_isAutoEnabled":true,"vtp_isManualEnabled":false,"vtp_autoPhoneEnabled":true,"vtp_autoCollectExclusionSelectors":["list",["map","exclusionSelector",""]],"vtp_isEnabled":true,"vtp_autoAddressEnabled":true,"vtp_autoEmailEnabled":true,"vtp_isAutoCollectPiiEnabledFlag":true,"tag_id":13}
```

The five prohibited fields remain `true`, and no `false` counterpart appears:

```text
"vtp_isAutoEnabled":true                        1 match
"vtp_autoEmailEnabled":true                     1 match
"vtp_autoPhoneEnabled":true                     1 match
"vtp_autoAddressEnabled":true                   1 match
"vtp_isAutoCollectPiiEnabledFlag":true          1 match
```

A destination-level `allow_user_provided_data: false` does not satisfy the
explicit safety gate. The compiled `__ogt_1p_data_v2` tag itself still has
`vtp_isEnabled:true` and every automatic collection field set to `true`.
Automatic PII detection therefore remains active at the container level.

The GA4 tag remains correct:

```json
{"function":"__gct","vtp_trackingId":"G-GDBL5SNHKL","vtp_sessionDuration":0,"tag_id":9}
```

Automatic outbound click, form, scroll, download, video and browser-history
detection remain enabled.

### P.8 Third decision

Production was not switched. This check failed the safety gate before any source
edit, test, build, commit or deployment:

| Area | Result |
| --- | --- |
| GTM configuration published | owner-reported only; no new public artefact observed |
| Public container configuration verified | **NOT VERIFIED** — `__ogt_1p_data_v2` still enabled |
| Website source updated | no |
| Production deployment completed | no |
| Production behaviour independently verified | no |

`src/lib/analytics.ts` still contains `GTM-TQK7FMJT`. The production site still
loads `GTM-TQK7FMJT`, so the mismatch remains. No GTM or GA4 account setting was
changed.

Required owner action: open the Google tag or user-provided data settings in
`GTM-PMZ6ZSVT`, remove or explicitly disable the `__ogt_1p_data_v2` tag so the
five fields are absent or `false`, then publish and confirm that the public
JavaScript hash changes and the enabled tag is gone. A destination-level
`allow_user_provided_data` value alone is not sufficient for this gate.
