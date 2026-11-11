# BloomCore corporate website rebuild report

**Project:** BloomCore Technologies corporate website
**Repository:** `Delkay-byte/BloomCore-Technologies`
**Production:** `https://bloomcoretech.com`
**Worker:** `bloomcore-technologies-page`
**Date:** 11 November 2026
**Stack:** Next.js 16.4.6 App Router, React 19.3.0, Tailwind CSS v4, Three.js 0.187,
React Three Fiber 9.8.2, Drei 10.7.9, Motion 14, OpenNext Cloudflare 1.20.16

## 1. Build brief

The previous redesign (`42cfe80`) was rejected. The owner preferred the earlier
site and asked for a premium evolution of it: a stronger hero, a genuine
interactive 3D product carousel, no more than two brand colours, purposeful
motion, working controls, and consistent quality on every public page.

This rebuild does not defend or patch the rejected direction. It restores the
earlier white/green/product-led language and rebuilds the experience around it.

## 2. Previous design identified

| Item | Value |
| --- | --- |
| Last pre-redesign production code | `64bd10c` |
| Rejected redesign | `42cfe80` |
| Rejected redesign documentation | `4aa61bf` |
| Baseline worktree | detached at `64bd10c`, rendered locally on port 3200 |
| Baseline screenshots | `docs/report-assets/previous/` |

Rendered baseline at 1440 and 390: `home`, `products`, `schemeknit`, `contact`.
The earlier site's preferred qualities:

- White ground with a single forest green accent.
- Product interfaces used as the main visual material, not abstract illustrations.
- Compact technical information: status labels, categories, product facts.
- A plain header with a strong logo lockup and a clear contact action.
- Dense editorial sections, not a sequence of floating marketing cards.

Weaknesses worth fixing:

- The hero product mock was a flat stack; no real interaction.
- Numbered sections, monospace captions and repeated three-card rows read as a
  template.
- Dark capability band and thin borders broke the white/green rhythm.
- No mobile-specific hero composition.
- Some sections had weak hierarchy.

## 3. Recovered direction

Direction drawn with the design-taste library:
**The well-kept board**, seed `1877496903`. A fitted tile board with `10px` gaps,
varied tile sizes and one dominant object per screen.

Adapted for BloomCore:

- Hero: a 6/6 board. Statement on the left, working 3D product stage on the
  right, four product/action tiles beneath.
- The 3D stage is the single loud element. Every other section is quiet.
- Product interfaces remain the imagery. No stock photography except the real
  founder portrait.
- The old site's white ground, forest identity and technical density are kept.
- Brass is added as the second and final chromatic colour for selection, status
  and the evidence band.

Idea sentence: **BloomCore's three product interfaces become the board's living
exhibits**, with the hero operating as a product stage.

## 4. Palette and typography

Final palette: **forest `#0c3b30` + brass `#c69a3e`** on warm ivory
`#f4f1e9`, with neutral steps for surfaces. Full token table in `DESIGN.md`.
Dark mode uses mint forest and deeper neutral tiles; the logo tiles stay forest
because the supplied logo is white.

Typography:

- **Source Serif 4** variable Roman for display, section headings and product
  names.
- **Inter** 400/500/600/700 for body, navigation, controls and interface data.
- Both are self-hosted with `next/font/local`; Google Fonts is not requested at
  build or runtime. This was forced by a real production build failure when
  `fonts.googleapis.com` became unreachable.

No monospace labels, index numbers or tracked uppercase eyebrows.

## 5. Libraries evaluated

Checked current versions and peer requirements before installing:

| Candidate | Decision | Reason |
| --- | --- | --- |
| Three.js 0.187.0 | installed | WebGL renderer |
| React Three Fiber 9.8.2 | installed | official React 19-compatible line; v10 alpha rejected |
| Drei 10.7.9 | installed | `RoundedBox` geometry only |
| Motion 14 | existing | menu/reduced-motion; no duplicate animation library |
| GSAP | rejected | no timeline complex enough to justify a second animation system |
| Lenis | rejected | native scrolling works; smooth-scroll hijacking adds risk |
| Radix / Base UI / React Aria | rejected | no primitive required beyond native controls and custom focus management |
| Embla | rejected | the 3D carousel is custom and the 2D fallback is a static panel |
| Lucide | rejected | four inline icons do not justify a dependency |

No alpha, beta or release-candidate package is used for production behaviour.

## 6. Skills, tools and agents actually used

- `bloomcore-skill-router` — selected the workstream.
- `design-taste-frontend` — direction draw, house rules, screenshots at multiple
  widths, visual critique.
- `bloomcore-ui-toolkit` — component adoption, states, browser verification.
- `web-design-guidelines` — interface and interaction rules.
- `impeccable` — review discipline and rendered-result checks.
- Independent design reviewer subagents — two passes over actual screenshots,
  first pass found launch blockers; second pass found no critical defects.
- No Uilora, Forge UI or Uiverse component was imported: no Uilora MCP endpoint
  is configured in this session, and the interface did not need a borrowed
  component.
- No Figma file was supplied.

## 7. 3D carousel architecture

Files:

- `src/components/stage/HeroStage.tsx` — DOM controls, product copy, autoplay,
  keyboard, pointer, WebGL detection, fallback.
- `src/components/stage/ProductCarousel3D.tsx` — R3F scene.
- `src/components/stage/draw-product-panel.ts` — 1400×870 canvas interfaces.
- `src/lib/product-stage.ts` — verified product content.

Behaviour:

- Three panels on an arc. Active panel front and fully lit; neighbours rotate,
  recede, scale down and dim.
- Each panel face is a `CanvasTexture` with real product labels and statuses,
  drawn from documented capabilities. No external screenshots.
- Drag/swipe updates a fractional index and snaps on release.
- Previous/next buttons, product tabs, ArrowLeft/ArrowRight, Home/End.
- Autoplay 7.2s; pauses on hover, focus, manual interaction, hidden tab and
  reduced motion.
- WebGL is dynamically imported client-side. DPR capped at 1.65. Rendering stops
  when the stage leaves the viewport.
- WebGL failure renders the same interface as a 2D canvas card; controls remain.
- Error boundary catches context failure.
- Desktop camera 5.3, compact 5.9; mobile keeps perspective side panels and the
  same DOM controls.

## 8. Pages and components rebuilt

| Route | Result |
| --- | --- |
| `/` | Board hero with 3D stage, company intro, SchemeKnit live demo, MaaCash/TillProof feature tiles, capabilities, four-stage process, evidence band, founder, resources, contact |
| `/products` | Product directory with unique quick links and three full product spreads |
| `/products/schemeknit` | Shared product shell: identity, interface, capabilities, audience, limits, launch, FAQ |
| `/products/maacash` | Same shell, MaaCash-specific content |
| `/products/tillproof` | Custom in-development page: status, concept interface, intended capabilities, audience, FAQ, interest CTA; no app link |
| `/about` | Company story, values, process, application areas, evidence limits |
| `/services` | Seven service areas, engagement flow, refusals, requirements, CTA |
| `/work` | Product portfolio and engineering principles |
| `/resources` | Guide index with direct article rows |
| `/resources/[slug]` | Article layout with working in-page contents links |
| `/founder` | Portrait-led profile with verified background only |
| `/contact` | Contact routes, registered details, validated mailto form |
| `/privacy` | Same policy text; collapsible mobile contents, corrected measure |
| 404 | Designed route with working section links |

Shared components rewritten: `Header`, `Footer`, `Page`, `Button`,
`Breadcrumbs`, `ProductPageShell`, `ProductFragments`, `SchemeKnitDemo`,
`QuickEnquiry`, `ContactForm`, `HelpChat`, `BackToTop`, `Analytics` presentation.

New: `AssistantTrigger`, `HeroStage`, `ProductCarousel3D`, product panel
renderer, `product-stage.ts`.

## 9. Interaction audit

Tested in Chromium with Playwright at 1440 and 390:

| Control | Result |
| --- | --- |
| Header product menu, hover/click/Escape/focus loss | pass |
| Active navigation state | pass |
| Theme toggle and persistence | pass |
| Mobile menu open, focus trap, Escape, link navigation | pass |
| Hero primary/secondary CTAs | correct routes |
| Carousel autoplay | advances after 7.2s |
| Carousel previous/next | pass |
| Carousel direct product tabs | pass |
| Carousel keyboard arrows | pass |
| Carousel drag | pass |
| Carousel product links and app destinations | pass |
| TillProof app link | absent by design |
| SchemeKnit demo edit/reset | pass |
| Product FAQ disclosure | pass |
| Contact form validation, input, prepared-email success | pass |
| Quick enquiry validation and prepared-email success | pass |
| Footer links, privacy, analytics settings | pass |
| Assistant open, focus, Escape, focus restore | pass |
| Empty or `#` links | none |
| Horizontal overflow at 1440/1280/768/390/375 | none |
| Console/runtime errors | none in production |

## 10. Accessibility

- One `h1` per route; ordered headings.
- Skip link, semantic landmarks, visible focus.
- Contrast audit on `/`, `/products`, `/products/schemeknit`,
  `/products/tillproof`, `/contact`, `/about`, light and dark: **0 failures**.
- Mobile menu focus trap and Escape; assistant dialog focus and restore.
- Carousel has keyboard, button and drag alternatives; WebGL content is
  `aria-hidden` and the DOM carries the product information.
- Contact form labels, `aria-invalid`, `aria-describedby`, first-error focus and
  alert summary.
- Reduced motion disables autoplay, entrance animation and smooth scroll.
- Fixed overlays removed: assistant now opens from header/footer; contact page
  hides back-to-top so it cannot cover the form.
- No text hidden under a persistent launcher.

## 11. Performance

Measured on the production static build served locally:

| Metric | Result |
| --- | --- |
| LCP (desktop, local) | 132ms |
| CLS | 0.000 |
| DOMContentLoaded | 36ms |
| Load | 101ms |
| Initial JS requests | 11 |
| Initial JS, uncompressed | ~1.6MB including the 3D chunk |
| Largest 3D chunk | 907KB uncompressed, dynamically imported |
| CSS | 59KB |
| Fonts | self-hosted; Source Serif 4 Roman 429KB, Inter 4×~24KB |
| Canvas DPR cap | 1.65 |
| Render pause | offscreen / hidden tab |

Cloudflare serves compressed assets. The 3D chunk is the major cost and is
accepted deliberately because the owner required a real WebGL carousel; a 2D
fallback covers devices without WebGL. No layout shift was measured.

## 12. Consent and analytics

`src/lib/analytics.ts` was not modified.

| Check | Result |
| --- | --- |
| Pre-consent GTM requests | 0 |
| Pre-consent cookies / dataLayer | none / absent |
| Allow analytics | one `gtm.js?id=GTM-PMZ6ZSVT`, one script |
| GA4 page view | one `page_view` for `G-GDBL5SNHKL` |
| Product outbound click | one `product_outbound_click` with `product_name`, `location`, `destination_type` |
| Duplicate outbound event | none |
| Withdrawal | disables measurement, clears GA cookies |
| Footer Analytics settings | reopens the panel |
| Consent copy | matches implementation: no form content, names, emails or phone numbers sent |

The consent panel was redesigned with the new typography, copy and buttons while
the consent logic stayed untouched.

## 13. Screenshots

Earlier design:

- `docs/report-assets/previous/home-1440-fold.png`
- `docs/report-assets/previous/home-390-fold.png`
- `docs/report-assets/previous/products-1440-fold.png`
- `docs/report-assets/previous/contact-1440-full.png`

Final production build, 1440 and 390:

- `docs/report-assets/final-prod/home-1440-fold.png` / `home-1440-full.png`
- `docs/report-assets/final-prod/home-390-full.png`
- `docs/report-assets/final-prod/products-1440-fold.png`
- `docs/report-assets/final-prod/schemeknit-1440-full.png`
- `docs/report-assets/final-prod/tillproof-1440-full.png`
- `docs/report-assets/final-prod/contact-1440-full.png`
- `docs/report-assets/final-prod/privacy-390-full.png`
- 56 captures in total, including every public route at both widths.

These were captured from `NETLIFY=true npm run build` output served statically,
so no Next.js development indicator is present.

## 14. Build and tests

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass |
| `npm run lint` | pass, 0 errors, 0 warnings |
| `npm run build` | pass, 19 routes |
| `npx opennextjs-cloudflare build` | pass |
| `NETLIFY=true npm run build` | pass |
| Routes at 1440/1280/768/390/375 | all 200; unknown route 404 |
| Sitemap | 15 URLs |
| Robots, OG image, favicons | 200 |
| Canonicals, titles, JSON-LD | preserved |
| Internal links | no 4xx |
| Broken images | none after lazy images load |
| Contrast | 0 failures |
| WebGL fallback | pass |
| Reduced-motion autoplay | pass |

## 15. Commits

| Commit | Purpose |
| --- | --- |
| `64bd10c` | last pre-redesign production code (baseline, unchanged) |
| `42cfe80` | rejected redesign (historical) |
| `4aa61bf` | rejected redesign documentation (historical) |
| `55246e9` | premium rebuild (this report) |

## 16. Production deployment

Build path unchanged:

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

Worker: `bloomcore-technologies-page`. Branch: `main`.

Deployed 11 November 2026 as Worker version
`757301d4-bb29-442b-bb22-81089a9b12ed`, from commit `55246e9`.

## 17. Live production verification

Verified against `https://bloomcoretech.com` after deployment:

| Check | Result |
| --- | --- |
| Homepage | 200 |
| 13 public routes at 390 | 200, one `h1`, no overflow |
| Unknown route | 404 |
| WWW | redirects to `https://bloomcoretech.com/` |
| `sitemap.xml`, `robots.txt`, `og-image.png` | 200 |
| WebGL canvas on production | present |
| Carousel direct selection | `MaaCash · Available` |
| Carousel next control | `TillProof · In development` |
| Desktop overflow | 0 |
| Runtime errors | 0 |
| Google requests before consent | 0 |
| GTM after consent | one `gtm.js?id=GTM-PMZ6ZSVT`, one script |
| GA4 page view | one |
| Product outbound click | one `product_outbound_click` with correct parameters |

No critical defect remained in the final independent review. That review listed
five high-severity polish items (development overlay in captures, mobile badge
width, quick-enquiry placeholder clip, single-crumb breadcrumb, status-chip
consistency); all five were corrected before the production screenshots and
deployment. The final review scored hero 8, typography 8, colour 8, mobile 7,
product pages 8, overall 8/10.
