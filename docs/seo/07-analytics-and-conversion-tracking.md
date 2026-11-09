# Analytics and conversion tracking plan

Date: 9 November 2026
Status: code implemented, measurement ID not yet supplied, no events collected.

## Current state

- Google Analytics 4 is integrated behind explicit consent.
- Analytics is disabled when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is empty.
- No measurement ID, property, stream or historical data exists.
- No advertising or remarketing tag is present.
- No event has been sent because there is no ID and no visitor has been asked.

## Consent

`src/lib/analytics.ts` stores one preference in `localStorage` under
`bloomcore-analytics-consent`, with values `granted` or `denied`.

Rules:

1. Nothing loads before a choice.
2. `trackEvent` returns early unless consent is `granted`, an ID exists, and `window.gtag` is
   available.
3. Choosing "Keep off" leaves the GA script unloaded.
4. The choice is remembered on the same browser.
5. No name, email, telephone number, message content or free-text field is ever sent.

The privacy notice documents this behaviour and was updated on 9 November 2026.

## GA4 setup steps (owner action)

1. Create a GA4 property for BloomCore Technologies.
2. Add a web data stream with URL `https://bloomcoretech.com`.
3. Copy the measurement ID (`G-XXXXXXXXXX`).
4. In Netlify, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with that value and redeploy.
5. Open the site in a private window, choose Allow analytics, and confirm the page view appears in
   GA4 Realtime.
6. Choose Keep off in another private window and confirm no request to `googletagmanager.com`
   appears in the Network panel.

Do not commit the ID to the repository. It belongs in the Netlify environment, not in source.

## Event plan

Events are sent through `trackEvent(name, params)`. Parameter values are short strings, never
personal data.

| Event | Fires when | Parameters | Purpose |
| --- | --- | --- | --- |
| `page_view` | GA4 config with `send_page_view: true` | page location, title | Traffic and landing pages |
| `product_page_view` | A product page mounts | `product` | Product interest by product |
| `resource_article_view` | A resource article mounts | `article` | Content consumption |
| `product_cta_click` | An enquiry button is clicked | `product`, `location` | Which page area drives enquiries |
| `product_outbound_click` | A launch button opens the product app | `product`, `location`, `destination` | Handoff to SchemeKnit or MaaCash |
| `contact_form_start` | The first form field changes | none | Form engagement |
| `contact_form_submit` | The form passes validation and prepares the email | `enquiry_type` | Intent to contact |

Note: `contact_form_submit` measures preparation of the `mailto:` message, not delivery. The site
cannot know whether the visitor pressed Send in their email application. Label it accordingly in
GA4 and never report it as a sent enquiry.

## Mark conversions

In GA4, mark as key events:

- `contact_form_submit`
- `product_cta_click`
- `product_outbound_click`

Do not mark page views as conversions. Do not import goals from a system that does not exist.

## Suggested GA4 configuration

- Data retention: 14 months (the maximum for the free tier at the time of writing; confirm in the
  property settings).
- IP anonymisation: enabled in the config call.
- Google Signals: off unless a deliberate decision is made; it is not needed for this site.
- Advertising personalisation: off.
- Enhanced measurement: keep page views; disable outbound click measurement if it duplicates
  `product_outbound_click`. Either is acceptable, but do not double-count.
- Internal traffic filter: exclude office IPs only if they are stable and known. Never guess.

## Reporting that matches the business

Weekly, only if data exists:

| Question | Report |
| --- | --- |
| Which pages bring people in? | Landing page report |
| Which products get attention? | `product_page_view` by `product` |
| Which product CTA works? | `product_cta_click` by `product` and `location` |
| Do people start the contact form? | `contact_form_start` |
| Do they prepare an enquiry? | `contact_form_submit` by `enquiry_type` |
| Which guides are read? | `resource_article_view` by `article` |

Do not report a conversion rate until there is enough data. With low traffic, report counts and the
direction of travel, not percentages with false precision.

## Search Console connection

Link the GA4 property to the verified Search Console property when both exist. That gives landing
page and query context without exporting spreadsheets.

## Privacy and legal notes

- Consent is required before any GA cookie is set.
- The site does not use GA for advertising.
- The privacy notice names Google Analytics 4 and explains the consent choice.
- If the owner later adds advertising, remarketing, heatmaps or session recording, the notice and
  consent flow must be reviewed first.
- This document is operational guidance, not legal advice.

## Verification checklist

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Netlify only.
- [ ] Build redeployed.
- [ ] No GA request before consent.
- [ ] Realtime page view after Allow.
- [ ] No GA request after Keep off.
- [ ] `contact_form_start` fires once per visit.
- [ ] `contact_form_submit` fires only after valid input.
- [ ] No personal data in any event parameter.
- [ ] Key events marked.
- [ ] Search Console linked.
