# GTM and GA4 production verification on Cloudflare

Date: 10 November 2026
Domain: `https://bloomcoretech.com` (`www` redirects to the apex)
Worker: `bloomcore-technologies-page`

## 1. Original symptom

A page-source inspection of the production domain reported `0/0` for the Google
Tag Manager container, and Google Tag Assistant had previously reported zero
tags.

## 2. Root cause established from evidence

The container is not present in the server HTML. It is injected at runtime, and
only after the visitor allows analytics.

`src/lib/analytics.ts` appends
`https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT` to `document.head`
inside `loadGoogleTagManager()`. That function is only called from
`src/components/Analytics.tsx` when the consent state is `granted`.

Consequences:

- A raw HTML or page-source check finds no `googletagmanager` reference, because
  the script does not exist until consent is granted.
- A tool that inspects the document before consent sees zero containers, even
  though the site is instrumented correctly.
- No `index.html` exists in this project, and no `noscript` iframe is used.

The `0/0` result is the designed behaviour of a consent-gated installation, not
a missing tag.

## 3. Why the raw source is expected to omit GTM

This is a Next.js 16 App Router application deployed with OpenNext on Cloudflare
Workers. Pages are rendered from `src/app/layout.tsx`; `git ls-files` contains no
`index.html`, and no static shell is served. Tracking is attached to the client
bundle, so the server HTML never contains the GTM snippet.

Adding Google's standard snippet to a static file would either have no effect or
fire GTM before consent. The standard `noscript` iframe would load GTM for
visitors without JavaScript, with no way to record their consent choice. Neither
path was added.

## 4. Existing implementation inspected

| Area | Location | Finding |
| --- | --- | --- |
| Container ID | `src/lib/analytics.ts:9` | `GTM-PMZ6ZSVT` |
| GA4 ID | `src/lib/analytics.ts:15` | `G-GDBL5SNHKL`, used only for the disable switch and documentation |
| Loader | `src/lib/analytics.ts:104-135` | One `script#gtm-script`, `async`, appended to `head`, re-entry guarded |
| Consent store | `src/lib/analytics.ts:34-50` | `localStorage` key `bloomcore-analytics-consent` |
| Consent UI | `src/components/Analytics.tsx` | Allow, Keep off, Withdraw, reopen via footer control |
| Consent update | `src/components/Analytics.tsx:57-67` | Saves choice, calls loader or withdrawal |
| Withdrawal | `src/lib/analytics.ts:138-144` | Sets `ga-disable-G-GDBL5SNHKL`, pushes consent denied, clears `_ga` cookies |
| Event helper | `src/lib/analytics.ts:154-163` | Refuses to send unless consent is `granted` and the disable flag is unset |
| Duplicate guard | `src/lib/analytics.ts:110-114` | `gtmLoaded` plus `#gtm-script` presence check |
| Build | `next.config.ts` | `output: "standalone"` unless `NETLIFY=true` |
| Worker | `wrangler.jsonc` | `main: .open-next/worker.js`, assets `.open-next/assets` |
| Adapter | `open-next.config.ts` | `defineCloudflareConfig()` with no cache binding |
| Container privacy | `gtm.js` fetched fresh | `vtp_isEnabled:false` in `__ogt_1p_data_v2` |
| Old container | repository source and built chunks | `GTM-TQK7FMJT` absent |

Only one GTM installation path exists: `loadGoogleTagManager()`. There is no
`gtag.js` script, no second container, and no server-side injection.

## 5. Changes made

None. Production behaviour matches the intended design, so no code, Cloudflare
setting, GTM container, DNS record or dependency was changed.

## 6. Files modified and commit SHA

Only this report was added:

- `docs/deployment/GTM-CLOUDFLARE-PRODUCTION-VERIFICATION.md`

Repository: `Delkay-byte/BloomCore-Technologies`, branch `main`.
Commit inspected: `692c23428e4968cbe7a392563981a2197bd53e80`.

Locked versions: `next` 16.4.6, `react` 19.3.0, `react-dom` 19.3.0,
`@opennextjs/cloudflare` 1.20.16, `wrangler` 4.160.0.

## 7. Test results summary

All tests used headless Chrome, a fresh profile with no stored consent, and the
production hostname `https://bloomcoretech.com`.

| Test | Result |
| --- | --- |
| A. Before consent | pass, no Google request, no container, no cookies |
| B. After consent | pass, one container, GA4 hits correct |
| C. Reject consent | pass, no Google request, no cookies, site works |
| D. Withdraw consent | pass, cookies cleared, tracking stops, choice persists |
| E. Routes, refresh, client navigation | pass, one container per document, no duplicate initialisation |

## 8. Before-consent network results

| Check | Result |
| --- | --- |
| `script[src*="googletagmanager"]` | 0 |
| `dataLayer` | `null` |
| `window.gtag` | `undefined` |
| Requests to `googletagmanager.com` | 0 of 53 requests on the homepage |
| Requests to `google-analytics.com` | 0 |
| Cookies | empty |
| `localStorage` | empty |
| Consent banner | present and usable |

Routes `/products/schemeknit`, `/products/maacash` and `/contact` were each
loaded in a fresh profile with storage cleared: 0 GTM scripts, `dataLayer` null,
no Google requests, banner present, page content rendered.

## 9. After-consent network results

| Check | Result |
| --- | --- |
| `gtm.js` requests | exactly 1, `https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT` |
| `script#gtm-script` elements | 1 |
| `dataLayer` `gtm.js` entries | 1 |
| `window.google_tag_manager` keys | include `GTM-PMZ6ZSVT` only |
| `gtag/js` requests | 0 |
| `GTM-TQK7FMJT` requests | 0 |
| GA4 hits | `tid=G-GDBL5SNHKL`, `gcs=G101`, `npa=1` |
| Initial page view | 1 |
| Cookies after consent | `_ga`, `_ga_GDBL5SNHKL` |

Event evidence:

| Action | GA4 hit |
| --- | --- |
| Homepage after Allow | `page_view`, one hit |
| Client navigation to `/products/schemeknit` | one additional `page_view`, no second `gtm.js` |
| Product page render | `product_page_view` with `product_name=SchemeKnit` |
| Product launch link | `product_outbound_click` with `product_name`, `location=product_launch`, `destination_type=product_application` |
| Direct load of `/products/maacash` | one `gtm.js`, `page_view`, `product_page_view` with `product_name=MaaCash` |
| Refresh of `/products/maacash` | one `gtm.js`, page rendered, no duplicate container |
| Contact form submit (synthetic values) | `contact_form_start`, `contact_email_prepared` with `enquiry_type` only |

No request contained the synthetic name, email address, organisation or message
text. All hits carried `allow_user_provided_data=false` and `npa=1`.

## 10. Consent rejection and withdrawal results

Reject (`Keep off`), fresh profile:

| Check | Result |
| --- | --- |
| Google requests | 0 |
| `localStorage` | `bloomcore-analytics-consent=denied` |
| Cookies | empty |
| Banner after reload | not shown |
| Product page after rejection | renders normally, no tracking |

Withdrawal after accepting:

| Check | Result |
| --- | --- |
| Consent state | `granted` to `denied` in `localStorage` |
| Disable flag | `window["ga-disable-G-GDBL5SNHKL"] === "true"` |
| Cookies | `_ga` and `_ga_GDBL5SNHKL` cleared |
| Requests after withdrawal | 0 to Google |
| Client navigation after withdrawal | `/services` loads, no tracking |
| Reload after withdrawal | choice stays `denied`, no `gtm.js`, `dataLayer` null, no banner |

## 11. Tag Assistant result

`https://tagassistant.google.com/` loads in this environment, but it requires a
signed-in Google account and the Tag Assistant Companion browser extension to
attach to a site. Without a session it only offers "Install extension" and
"Sign in"; activating "Add domain" leaves the page unchanged. No Google account
credentials are available to this workspace, and supplying them is outside the
authorised scope.

Tag Assistant therefore could not be used to record the container session. The
equivalent runtime evidence was captured directly:

- `window.google_tag_manager` contains `GTM-PMZ6ZSVT` after consent.
- Exactly one `gtm.js?id=GTM-PMZ6ZSVT` request occurs, once per document load.
- GA4 collects hits under `G-GDBL5SNHKL`, including `page_view`,
  `product_page_view` and `product_outbound_click`.
- No CSP is served; no extension is present in the clean profiles; no request
  was blocked.

This rules out the "GTM absent", "container blocked" and "GA4 misconfigured"
cases. The only unverified item is the third-party Tag Assistant session.

## 12. Production deployment result

| Item | Value |
| --- | --- |
| Branch | `main` |
| Commit | `692c23428e4968cbe7a392563981a2197bd53e80` |
| Live Worker version | `e505564b-29be-4571-9952-b6111f0122da` (version 7) |
| Version created | 2026-11-10T20:12:07Z |
| Custom domain | `bloomcoretech.com`, enabled |
| `www` | 301 to `https://bloomcoretech.com/`, path preserved |
| Served chunk | `/_next/static/chunks/2561kqvyixxd-.js` |
| Chunk SHA-256 | `BE58AF159613BC4E7FBEDF0DC02E88022A9BD8EC9F7576F68264A298A547207B` |
| Local build chunk | identical SHA-256 |

No deployment was performed during this investigation because no application
defect was found. The live artifact matches the committed source.

## 13. Outstanding limitations

1. ~~The GTM container contained one GA4 event tag (`__gaawe`, tag_id 8) whose
   event name was `product_outbound_click` with no parameters, producing a
   second GA4 hit per product launch click.~~ Resolved by GTM version 7,
   "Publish paused outbound click tag". See section 14.
2. Tag Assistant could not be run without a Google sign-in and the Companion
   extension.
3. One transient Cloudflare `Error 1102` was observed on `/contact` during a
   rapid reload test at 22:03 UTC (Ray ID `a5885885ef66e904`). It did not recur
   in nine subsequent loads (three browser, six HTTPS). It is not GTM-related,
   but it is a production availability signal worth watching.
4. `docs/seo/07-analytics-and-conversion-tracking.md` still names the old
   container `GTM-TQK7FMJT`. Application code and the live site use
   `GTM-PMZ6ZSVT`.

## 14. GTM version 7 follow-up verification

Verified 10 November 2026, 23:05-23:20 UTC. Container: `GTM-PMZ6ZSVT`.
GA4: `G-GDBL5SNHKL`. Owner-published version: 7, "Publish paused outbound click
tag" (published 10 November 2026, 22:27), which paused the tag
`GA4 Event - Product Outbound Click`.

### 14.1 Served container configuration

Two cache-busted fetches of
`https://www.googletagmanager.com/gtm.js?id=GTM-PMZ6ZSVT` gave the same result:

| Check | Result |
| --- | --- |
| `product_outbound_click` string in container | 0 occurrences |
| Paused tag entry | `{"function":"__paused","vtp_originalTagType":"gaawe","tag_id":8}` |
| GA4 destination | `G-GDBL5SNHKL` only |
| `GTM-TQK7FMJT` | absent |
| `vtp_isEnabled` in `__ogt_1p_data_v2` | `false` |

The paused entry is the former GA4 Event tag for `product_outbound_click`. The
container no longer carries the event name, so it cannot resend it. GTM does not
expose the published version number in the public script, so version 7 is
confirmed by this configuration change, not by reading a version string.

### 14.2 Pre-consent network results

Fresh profile, `/products/schemeknit`:

| Check | Result |
| --- | --- |
| Google requests | 0 |
| GTM script elements | 0 |
| `dataLayer` | `null` |
| Cookies | empty |
| Consent storage | empty |
| Page | rendered, consent banner present |

### 14.3 Post-consent network results

| Check | Result |
| --- | --- |
| `gtm.js` requests | 1, `id=GTM-PMZ6ZSVT` |
| `script#gtm-script` elements | 1 |
| `dataLayer` `gtm.js` entries | 1 |
| `window.google_tag_manager` | `GTM-PMZ6ZSVT` |
| `gtag/js` requests | 0 |
| `GTM-TQK7FMJT` requests | 0 |
| GA4 hits | `tid=G-GDBL5SNHKL`, `gcs=G101`, `npa=1` |

### 14.4 Outbound-click acceptance test

One deliberate click on each product application link, in one session with
consent granted.

SchemeKnit, `dl=https://bloomcoretech.com/products/schemeknit`:

| Field | Value |
| --- | --- |
| Link | `https://schemeknit.bloomcoretech.com/`, `target="_blank"` |
| GA4 `product_outbound_click` hits | **1** |
| `product_name` | `SchemeKnit` |
| `location` | `product_launch` |
| `destination_type` | `product_application` |
| Parameterless duplicate | none |
| `_s` | 2 |

MaaCash, `dl=https://bloomcoretech.com/products/maacash`:

| Field | Value |
| --- | --- |
| Link | `https://maacash.bloomcoretech.com/`, `target="_blank"` |
| GA4 `product_outbound_click` hits | **1** |
| `product_name` | `MaaCash` |
| `location` | `product_launch` |
| `destination_type` | `product_application` |
| Parameterless duplicate | none |
| `_s` | 3 |

The application still pushes the event once from
`src/lib/analytics.ts:154-163`, driven by `data-analytics="product_outbound_click"`
in `src/components/ProductPageShell.tsx:208-211`. The previous second hit
(`_s=3`, 5001 ms later, no parameters) no longer occurs.

### 14.5 Other analytics events

| Scenario | Hits |
| --- | --- |
| Homepage after Allow | 1 x `page_view` |
| Direct load `/products/maacash` | `page_view`, `product_page_view` (`product_name=MaaCash`) |
| Client navigation to `/products/schemeknit` | `page_view` for the new route, `product_page_view` (`product_name=SchemeKnit`), no second `gtm.js` |
| Contact form submit, synthetic values | `contact_form_start`, `form_start`, `contact_email_prepared` with `enquiry_type` only |

Every hit carried `allow_user_provided_data=false`. No name, email address,
organisation, message text or other personal value appeared in any request. No
event was duplicated.

### 14.6 Consent withdrawal

| Check | Result |
| --- | --- |
| Consent state | `denied` in `localStorage` |
| Disable flag | `window["ga-disable-G-GDBL5SNHKL"] === "true"` |
| Cookies | `_ga` and `_ga_GDBL5SNHKL` cleared |
| Requests after withdrawal | 0 to Google |
| Reload | choice stays `denied`, no `gtm.js`, `dataLayer` null, no banner |

### 14.7 Tag Assistant

Not run. `tagassistant.google.com` requires a signed-in Google account and the
Tag Assistant Companion extension. This workspace has no such session, and
supplying credentials is out of scope. Verification was done from GA4 network
telemetry and the `window.google_tag_manager` contents instead.

### 14.8 Repository and deployment state

No application change was made, so the live artifact is unchanged.

| Item | Value |
| --- | --- |
| Branch | `main` |
| Commit before this report | `3310463c56ffaa506cc78fdf9bb7f3f7fe76105a` |
| Live Worker version | `e505564b-29be-4571-9952-b6111f0122da` (version 7) |
| Custom domain | `bloomcoretech.com`, apex 200, `www` 301 to apex |
| Console errors during tests | none |

## Classification

**GREEN — duplicate event resolved.**

Both product outbound-click tests produced exactly one GA4
`product_outbound_click` event per deliberate click, with the correct
`product_name`, `location` and `destination_type`, and no parameterless second
hit. The correct container `GTM-PMZ6ZSVT` loads exactly once after consent, GA4
uses `G-GDBL5SNHKL`, other events are unchanged, and consent rejection and
withdrawal still block all Google requests. Tag Assistant was not run because it
requires a signed-in Google account and the Companion extension; that limitation
does not affect the network-level result.

Earlier version of this report, before GTM version 7, recorded the duplicate
container tag and the AMBER status. That finding is now resolved in production.

