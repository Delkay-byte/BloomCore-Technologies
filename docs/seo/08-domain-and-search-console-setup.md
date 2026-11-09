# Domain and search console setup

Date: 9 November 2026
Domain: `bloomcoretech.com`
Registrar: unchanged. Do not migrate the registrar as part of SEO work.
Authoritative DNS: Cloudflare (`rudy.ns.cloudflare.com`, `arya.ns.cloudflare.com`).
Hosting: Netlify.

## 1. Canonical domain decision

**Decision: use the apex, `https://bloomcoretech.com`.**

Evidence:

- The Netlify site already has `custom_domain` set to `bloomcoretech.com`.
- Netlify reports the site URL and SSL URL as `https://bloomcoretech.com`.
- The apex resolves to Netlify (`35.157.26.135`, `63.176.8.218`, plus IPv6).
- `https://www.bloomcoretech.com/*` already returns `301` to the apex.
- `http://bloomcoretech.com/*` already returns `301` to HTTPS.
- TLS is valid and HSTS is present.

Choosing `www` instead would require changing the Netlify primary domain and DNS, then reversing the
existing redirect. That adds risk without a demonstrated benefit for a small corporate site. The
apex is already the strongest URL and the one search engines have seen.

Do not serve the site on both hosts. Do not add an HSTS preload submission until the redirect
topology has been stable for a reasonable period.

## 2. Redirect topology

| From | To | Method |
| --- | --- | --- |
| `http://bloomcoretech.com/*` | `https://bloomcoretech.com/*` | 301 |
| `https://www.bloomcoretech.com/*` | `https://bloomcoretech.com/*` | 301 |
| `http://www.bloomcoretech.com/*` | `https://www.bloomcoretech.com/*` then apex | 301 chain, two hops |
| `https://bloomcore-technologies.netlify.app/*` | `https://bloomcoretech.com/:splat` | 301 in `netlify.toml` |
| `/products/bloomcore-one` | `/products/maacash` | 301 in `netlify.toml` |
| `/products/bik-prestige` | `/products/maacash` | 301 in `netlify.toml` |

The `http://www` chain is acceptable. To collapse it to one hop, add a Cloudflare redirect rule that
sends both scheme and host directly to the apex. Do not do this until the current rules are
documented and the owner can verify the result.

## 3. DNS records that must not be disturbed

Email and domain-verification records are not part of this migration. Before editing DNS, export a
full record list from Cloudflare. Preserve, without modification:

- `MX` records, if present.
- The SPF `TXT` record (`v=spf1 ...`), if present.
- DKIM `TXT` or `CNAME` records at the selector hostnames, if present.
- The DMARC `TXT` record at `_dmarc`, if present.
- Any existing verification `TXT` records for Google, Bing, Microsoft 365 or another provider.
- Any `CAA` records, if present.
- Any service records for email, calendars or other systems.

Add new records; do not replace the record set. A domain property verification only needs one new
`TXT` record at the apex.

## 4. Google Search Console

### Preferred method: Domain property

A Domain property covers the apex, `www`, HTTP and HTTPS in one place. It requires a DNS `TXT`
record.

1. Sign in to Google Search Console with the account that should own the property.
2. Choose **Add property → Domain**.
3. Enter `bloomcoretech.com` (no scheme, no `www`).
4. Copy the verification `TXT` value Google provides.
5. In Cloudflare DNS, add a `TXT` record:
   - Name: `@`
   - Content: the exact value from Google
   - TTL: automatic
   - Proxy: not applicable to `TXT`
6. Save, then return to Search Console and choose Verify.
7. Wait for DNS propagation if the first attempt fails. Do not delete the record after verification;
   Google may re-check it.

If the owner cannot access Cloudflare, the fallback is a URL-prefix property for
`https://bloomcoretech.com/` verified by an HTML tag. For that, set
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Netlify and redeploy. A URL-prefix property does not cover
`www` or HTTP, so the Domain property is preferred.

### After verification

1. Open **Sitemaps** and submit `https://bloomcoretech.com/sitemap.xml`.
2. Use **URL Inspection** on the home page and the three product pages.
3. Request indexing only after the deploy that carries the canonical fix.
4. Confirm the inspected canonical matches `https://bloomcoretech.com/...`, not the Netlify host.
5. Check **Pages** after a few days for exclusions. The old host should not appear as an indexed
   duplicate once the redirect is live.

Do not submit the same sitemap repeatedly. One submission is enough; the file is referenced in
`robots.txt`.

## 5. Bing Webmaster Tools

Two options:

1. **Import from Google Search Console** after the Google property is verified. This is the fastest
   and avoids a second verification record.
2. **Add the site manually** at `https://bloomcoretech.com`, then verify with the
   `msvalidate.01` meta tag. Set `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Netlify and redeploy.

After verification:

- Submit `https://bloomcoretech.com/sitemap.xml`.
- Confirm the site is crawlable.
- Do not enable IndexNow until a key file exists at the site root. No IndexNow key is implemented in
  this repository, and no submission has been made.

## 6. Netlify settings

Confirm in the Netlify UI:

- Primary domain: `bloomcoretech.com`.
- `www.bloomcoretech.com` is configured as a domain alias that redirects to the primary domain.
- HTTPS certificate is active and auto-renewing.
- Build command `npm run build`, publish directory `out`, Node 22.
- Environment variables are set for the production context only where needed.

The repository cannot read or change Netlify environment variables without account authentication.
Values must be entered by the owner.

## 7. Order of operations

1. Deploy the canonical fix. Verify the live canonical tags first.
2. Verify the old Netlify host returns `301` to the apex.
3. Verify `www` and HTTP redirects again.
4. Create and verify the Search Console Domain property.
5. Submit the sitemap.
6. Request indexing for the home page and key product pages.
7. Import into Bing or verify separately.
8. Add GA4 only after the measurement ID exists.

Do not request indexing before step 1. Indexing a page that still declares the wrong canonical wastes
the request.

## 8. What has been done and what is still outstanding

Done on 9 November 2026:

- The canonical fix was deployed and verified live.
- The old Netlify host returns `301` to the apex.
- `www` and HTTP redirects were reverified.
- All 15 sitemap URLs return `200` with a self-referencing canonical.

Still outstanding:

- Search Console verification has not been performed. No token exists.
- Bing verification or import has not been performed.
- No sitemap has been submitted.
- No indexing has been requested.
- No GA4 property or measurement ID exists.
- No IndexNow key exists.

These are owner actions. This document does not claim they are complete.
