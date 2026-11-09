# Analytics and conversion tracking

Date: 9 November 2026
Status: implemented in source on `main`; production verification is recorded in
`PRODUCT-SUBDOMAIN-AND-ANALYTICS-REPORT.md`.

## Architecture

- One Google Tag Manager container: `GTM-TQK7FMJT`.
- One GA4 Google tag inside that container: `G-GDBL5SNHKL`.
- The website does not install a standalone `gtag.js` script.
- No analytics environment variable is required. The container ID is defined in
  `src/lib/analytics.ts`.
- The GTM script is injected only after the visitor chooses Allow analytics. Before that choice,
  no request is made to `googletagmanager.com` or `google-analytics.com`.

The GTM container's Google tag sends the GA4 page views. The website does not send a manual
`page_view`, so the initial document view and Next.js client-side navigation are not counted twice.

## Consent

`src/lib/analytics.ts` stores one preference in `localStorage` under
`bloomcore-analytics-consent`, with values `granted` or `denied`.

Rules:

1. Nothing loads before a choice.
2. Allow analytics stores `granted`, then loads GTM with analytics consent granted and advertising
   consent denied.
3. Keep off, and Withdraw analytics consent, store `denied`. No GTM request is made.
4. Withdrawal also sets `ga-disable-G-GDBL5SNHKL`, pushes a denied consent update if GTM is already
   loaded, and removes the GA cookies the page can access.
5. The footer's Analytics settings control reopens the panel so the choice can be changed.
6. No name, email address, telephone number, message content or free-text field value is sent in an
   analytics event.

## User-provided data

The owner-reported GTM Google tag configuration enables automatic user-provided data collection for
email addresses, phone numbers and addresses. The published container JavaScript contains the
`user_data_settings` and `auto_detect` code paths, which is consistent with that report, but GTM
account access is needed to confirm the toggle itself.

BloomCore has no approved enhanced-conversions or Customer Match use case. Do not add code that
sends contact details, and do not enable enhanced conversions. The recommendation in the
implementation report is to turn off automatic user-provided data collection unless the owner
approves a specific use case.

## Event plan

Custom events are sent through the `gtag('event', ...)` command queue that the container's GA4
Google tag consumes. They are not sent through a second analytics installation.

| Event | Fires when | Parameters |
| --- | --- | --- |
| `page_view` | GA4 Google tag on the initial page and on browser-history changes | page location, title |
| `product_page_view` | A SchemeKnit, MaaCash or TillProof information page mounts | `product_name` |
| `resource_article_view` | A resource article mounts | `article_slug` |
| `product_cta_click` | An enquiry button is clicked | `product_name`, `location` |
| `product_outbound_click` | A launch button opens a live product application | `product_name`, `location`, `destination_type` |
| `contact_form_start` | The first contact-form field changes | none |
| `contact_email_prepared` | The form passes validation and prepares a `mailto:` message | `enquiry_type` |

`contact_email_prepared` replaced `contact_form_submit`. The site cannot confirm that the visitor
pressed Send in their own email application, so it must not report a submitted enquiry.

GA4 enhanced measurement also produces automatic events such as `form_start`, `form_submit` and
`click`. Those names are separate from the custom events above. If the owner wants exactly one
outbound-click event per launch action, disable GA4 enhanced measurement's outbound click option, or
remove `product_outbound_click`; do not keep both as the same event name.

## Mark conversions

In GA4, mark as key events only:

- `contact_email_prepared`
- `product_cta_click`
- `product_outbound_click`

Do not mark page views as conversions.

## Suggested GA4 configuration

- Data retention: 14 months, unless the property offers a longer period.
- Advertising personalisation: off.
- Google Signals: off unless a deliberate decision is made.
- Enhanced measurement: keep page views and history changes. Decide explicitly whether automatic
  outbound clicks are needed alongside `product_outbound_click`.
- Internal traffic filter: exclude office IPs only if they are stable and known. Never guess.

## Reporting that matches the business

Weekly, only if data exists:

| Question | Report |
| --- | --- |
| Which pages bring people in? | Landing page report |
| Which products get attention? | `product_page_view` by `product_name` |
| Which product CTA works? | `product_cta_click` by `product_name` and `location` |
| Do people open a live application? | `product_outbound_click` by `product_name` |
| Do people start the contact form? | `contact_form_start` |
| Do they prepare an enquiry? | `contact_email_prepared` by `enquiry_type` |
| Which guides are read? | `resource_article_view` by `article_slug` |

Do not report a conversion rate until there is enough data.

## Privacy and legal notes

- Analytics loads only after an affirmative choice.
- The site does not use analytics for advertising.
- The privacy notice names Google Tag Manager and Google Analytics 4 and explains how to change the
  choice.
- If the owner later adds advertising, remarketing, heatmaps or session recording, the notice and
  consent flow must be reviewed first.
- This document is operational guidance, not legal advice.

## Verification checklist

- [x] GTM container `GTM-TQK7FMJT` is the only container in source.
- [x] No standalone `gtag.js` script and no GA4 measurement ID environment variable.
- [x] No Google request before consent.
- [x] One GTM script and one initial `page_view` after Allow.
- [x] History-change `page_view` after Next.js navigation.
- [x] Withdrawal stops further measurement and clears accessible GA cookies.
- [x] No form values in analytics payloads.
- [ ] Owner confirms the Google tag in GTM Preview or Tag Assistant.
- [ ] Owner confirms GA4 Realtime/DebugView reporting.
- [ ] Owner decides whether automatic outbound-click measurement stays enabled.
- [ ] Owner decides whether automatic user-provided data collection stays enabled.
