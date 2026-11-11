# BloomCore corporate website redesign report

**Project:** BloomCore Technologies corporate website
**Repository:** `Delkay-byte/BloomCore-Technologies`
**Date:** 11 November 2026
**Stack:** Next.js 16.4.6 (App Router), React 19.3.0, Tailwind CSS v4,
OpenNext Cloudflare adapter, Wrangler 4.160.0
**Production origin:** `https://bloomcoretech.com`
**Worker:** `bloomcore-technologies-page`

## 1. Objective

Redesign and production-harden every public page of the BloomCore corporate
site. The existing site was functional but visually generic: Inter with
monospace labels, repeated card rows, soft shadows and rounded panels that did
not distinguish BloomCore from any other software studio. The redesign had to
make the products the argument, while preserving analytics, SEO, deployment and
every factual constraint.

## 2. Non-negotiable constraints

| Area | Constraint | Result |
| --- | --- | --- |
| Analytics | Keep `GTM-PMZ6ZSVT`, `G-GDBL5SNHKL`, consent gating, one container, existing event names, no duplicate outbound tracking | Preserved; `src/lib/analytics.ts` unchanged |
| URLs | No public URL changes | Preserved |
| SEO | Canonicals, metadata, OG, JSON-LD, sitemap, robots, favicons, redirects, 404, WWW-to-apex, HTTPS | Preserved and re-checked |
| Deployment | `npx opennextjs-cloudflare build`, `npx wrangler deploy`, branch `main`, Netlify fallback via `NETLIFY=true npm run build` | Preserved |
| Claims | No fabricated customers, logos, testimonials, metrics, awards, screenshots or TillProof app URL | Enforced in copy and imagery |
| Product links | SchemeKnit and MaaCash stay on their existing subdomains | Preserved |
| Accessibility | WCAG 2.2 AA, keyboard, contrast, reduced motion | Met in automated checks; manual keyboard pass |
| Responsive | 1440, 1280, 768, 390, 375 with no horizontal overflow | Verified |
| Styling | No purple gradients, glassmorphism, repeated three-card rows, index numbers, mono labels, eyebrows, thin rules or decorative blobs | Removed |

## 3. Design direction

The direction was drawn as **“The product performs”**, seed `1889974782`, with
the existing brand palette retained. The argument of the site is that BloomCore
builds working software, so the page shows product interfaces and a working
scheme-to-plan example instead of abstract illustrations.

What changed visually:

- **Type:** Jost replaces Inter and IBM Plex Mono. Display headings are the same
  family, uppercase and tightly tracked. No monospace labels anywhere.
- **Palette:** bone ground, forest accent and gold event colour. Dark mode uses
  near-black grounds and a mint accent, not an inverted filter.
- **Shape:** square corners everywhere except the brand symbol and circular
  utility controls. No card shadows, no glass panels.
- **Rhythm:** sections change tone rather than being separated by hairlines.
  Twelve-column editorial grids, not three identical cards.
- **Imagery:** representative product interfaces built from documented
  capabilities, plus one founder portrait. Nothing is presented as a customer
  screenshot.
- **Interaction:** a hero console that switches products, a live SchemeKnit
  demo, a product selector, and a one-sentence enquiry control.

The full system is documented in `DESIGN.md`.

## 4. Page-by-page work

| Route | Change |
| --- | --- |
| `/` | New hero (“Work, made visible.”) around an interactive product console; company introduction; live SchemeKnit demo; product selector; capabilities; four-stage process; evidence band with honest counts; founder; resources; contact and quick enquiry |
| `/about` | Editorial company story, operating principles, registration facts, no invented history |
| `/products` | Alternating product spreads with representative interfaces and a plain explanation of status labels |
| `/products/schemeknit` | Shared product shell: what it does, capabilities, audience, limits, launch link, FAQ |
| `/products/maacash` | Same shell with its own accent field and content |
| `/products/tillproof` | Same shell; no launch link; “In development” stated in the hero and throughout |
| `/services` | Problem/solution/benefit structure without repeated card rows |
| `/work` | Product work and engineering approach, with no fabricated case studies |
| `/resources` | Article index and three long-form articles restyled to the new system |
| `/resources/[slug]` | Article layout, metadata and `Article` structured data preserved |
| `/founder` | Portrait-led profile with verifiable background only |
| `/contact` | Contact routes, registered details and the validated mailto form |
| `/privacy` | Same policy text, restyled; analytics description matches implementation |
| `not-found` | Designed 404 with a route back to the homepage and products |

Shared components were rewritten rather than layered: `Header`, `Footer`,
`Page`, `Button`, `ProductPageShell`. New components: `HeroConsole`,
`ProductFragments`, `SchemeKnitDemo`, `ProductTabs`, `QuickEnquiry`.

## 5. Content integrity

- Product status comes from `src/lib/brand.ts`: SchemeKnit and MaaCash are
  available; TillProof is in development.
- TillProof has no public launch link. `PRODUCT_LINKS.tillproof` exists in data
  but is never rendered as a call to action.
- No customer names, logos, testimonials, revenue figures, usage counts,
  awards or press mentions were added.
- Product interfaces carry visible captions: representative, built from
  documented capabilities, no customer or financial records.
- The homepage evidence band states only three products, two available, one in
  build.
- The SchemeKnit demo runs entirely in the browser. Its copy says nothing typed
  leaves the browser.
- Contact details, registration number and address are unchanged.

## 6. Analytics

Preserved without modification to `src/lib/analytics.ts`.

| Check | Result |
| --- | --- |
| GTM container requests before consent | **0** |
| Cookies before consent | **none** |
| `dataLayer` before consent | **absent** |
| After “Allow analytics” | one `gtm.js?id=GTM-PMZ6ZSVT` request, one `#gtm-script` |
| GA4 page view after consent | one `page_view` hit for `G-GDBL5SNHKL` |
| Product outbound click | one `product_outbound_click` event with `product_name`, `location`, `destination_type` |
| Duplicate event | none |
| After withdrawal | `ga-disable-G-GDBL5SNHKL=true`, no further events, consent persists across reload |
| Footer control | reopens the analytics panel |

All product links, the contact CTA and the two contact-form events keep their
existing `data-analytics` names. The single delegated listener in
`Analytics.tsx` was retained. No second tag, page-view call or outbound listener
was introduced.

The GTM container's own `gtm.linkClick` auto-event still fires in the browser,
as it did before the redesign. It is a container event, not a GA4 hit; the GA4
outbound event remains the application's single `product_outbound_click`.

## 7. SEO

| Check | Result |
| --- | --- |
| Canonicals | present and correct on `/`, product pages, articles, contact |
| Titles and descriptions | unique per route |
| Open Graph and Twitter cards | present; `og:image` resolves to `/og-image.png` |
| Structured data | `Organization`, `WebSite` sitewide; `BreadcrumbList`, `FAQPage`, `SoftwareApplication` on product pages; `Article` on resources |
| `robots.txt` | 200, allows all, declares sitemap and host |
| `sitemap.xml` | 200, 15 URLs |
| `favicon.ico`, PNG icons, `og-image.png` | 200 |
| 404 | designed page, HTTP 404 |
| WWW-to-apex and HTTPS | untouched; still handled at Cloudflare |

`lastModified` values in the sitemap were updated to 11 November 2026 for the
routes whose content and presentation changed. Article `lastModified` values
continue to come from the article source.

## 8. Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `footer`; one `h1` per page.
- Skip link is the first focusable element.
- Visible focus: 2px outline, 3px offset.
- Mobile menu traps focus, closes on Escape and restores scrolling.
- Product switch uses `aria-pressed`; it is not a half-implemented tab pattern.
- Contact form: visible labels, `aria-invalid`, `aria-describedby`, first-error
  focus and an alert summary.
- Contrast audit at 1440px in light and dark mode on `/`, `/products/schemeknit`,
  `/contact` and `/about`: **0 failures** after darkening light-mode
  `--foreground-faint` to `#5e6458` and fixing three small-text cases.
- Reduced motion respected by the mobile menu, reveals and back-to-top.
- No horizontal overflow at 1440, 1280, 768, 390 or 375.

## 9. Build and verification

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass |
| `npm run lint` | pass, 0 errors, 0 warnings |
| `npm run build` | pass, 19 static routes generated |
| Routes at 1440, 1280, 768, 390, 375 | 200; unknown route 404 |
| Broken images | 0 |
| Horizontal overflow | 0 |
| `npx opennextjs-cloudflare build` | pass |
| `NETLIFY=true npm run build` | pass |
| Wrangler deploy | pending final publish step |

## 10. Deployment

The build path did not change:

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

Worker: `bloomcore-technologies-page`. Branch: `main`. Netlify fallback:

```bash
NETLIFY=true npm run build
```

No new runtime dependency was added. Jost is self-hosted by `next/font`, so the
site does not add a render-blocking Google Fonts request.

## 11. Known limits

- The accessibility pass combined automated contrast checks with keyboard
  testing; it is not a full audit by a certified auditor.
- Product application screens require sign-in. The site therefore uses labelled
  representative interfaces rather than genuine screenshots.
- TillProof remains in development and has no public application link.
- No customer evidence exists on the site because none was supplied and none
  was invented.
- The privacy notice still states that it has not been reviewed by a Ghanaian
  legal practitioner. The redesign did not change that status.

## 12. Files

- `DESIGN.md` — design system and editing rules.
- `src/app/globals.css` — tokens, type roles, fields, motion.
- `src/app/layout.tsx` — Jost, metadata, theme initialisation.
- `src/app/page.tsx` — homepage.
- `src/components/` — shared UI and new product components.
- `src/lib/analytics.ts` — unchanged analytics source of truth.
- `src/lib/brand.ts` — canonical company, product and contact data.
- `src/lib/seo.ts` — structured data helpers.
