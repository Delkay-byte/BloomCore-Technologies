# BloomCore Technologies — Monochrome Website Refinement Report

**Scope:** visual refinement of every public page below the hero, with the hero and 3D product carousel preserved.
**Production:** `https://bloomcoretech.com`
**Branch:** `feat/monochrome-redesign` (branched from `main` @ `2bb4b09`)
**Verified:** 12 November 2026 on a local production build (`node .next/standalone/server.js`, port 3100) at 1440×900, 1280×800, 768×1024, 390×844 and 375×812.
**Evidence:** `docs/report-assets/monochrome-redesign-audit/` — `seo-baseline.json` (pre-change), `after/` (post-change screenshots), `screenshots/` (pre-change, 63 PNGs), `audit.json` (pre-change rendered audit).

---

## 1. Outcome

| Gate | Result |
|---|---|
| Chromatic colours in rendered pages | 0 across 15 routes × 5 viewports (75 runs) |
| Horizontal overflow | 0 across 75 runs |
| Console errors during audit | 0 |
| Route metadata (title, description, canonical, OG, Twitter, robots, lang, JSON-LD) | identical to the pre-change baseline on all 15 routes |
| `h1` present on every route | yes; count unchanged |
| Images missing `alt` | 0 |
| Links with no text and no `aria-label` | 0 |
| TypeScript (`npx tsc --noEmit`) | clean |
| ESLint (`npm run lint`) | clean |
| `npm run build` | clean, 19 static pages |
| `npx opennextjs-cloudflare build` | clean, `.open-next/worker.js` written |
| Netlify fallback (`NETLIFY=true` build after prune) | clean |

Colour census, before and after:

| | Before | After |
|---|---|---|
| Distinct saturated colours at 1440 | 6 (`#0c3b30` forest, `#c69a3e` brass, `#15170f`, `#f4f1e9`, `#1a1408`, `#82d5b5`) | 0 |
| Saturated colour occurrences recorded in baseline | 82 | 0 |
| Routes with chromatic computed styles | 13 of 15 | 0 of 15 |

Product screenshots and the founder photograph keep their own colours; those are content, not chrome. Every UI surface, border, label, state and canvas fill is black, white or neutral grey.

---

## 2. Design system

`src/app/globals.css` now defines a neutral ramp only, in light, `[data-theme="dark"]` and `prefers-color-scheme: dark`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#f1f1f1` | `#090909` | Page field |
| `--surface` / `-2` / `-3` | `#ffffff` / `#f7f7f7` / `#e9e9e9` | `#111111` / `#181818` / `#222222` | Raised panels |
| `--foreground` / `-subtle` / `-faint` | `#0a0a0a` / `#4a4a4a` / `#6e6e6e` | `#f5f5f5` / `#b4b4b4` / `#8c8c8c` | Text ramp |
| `--line` / `--line-strong` | `#dedede` / `#bdbdbd` | `#272727` / `#3a3a3a` | Hairlines |
| `--accent` | `#0a0a0a` | `#f5f5f5` | Dark field |
| `--accent-contrast` | `#ffffff` | `#0a0a0a` | Text on the dark field |
| `--gold` | `#ffffff` | `#1c1c1c` | Inverted field |

Legacy token names are retained so no component silently loses contrast, but both now resolve to neutral values. `--gold` is white in light mode, so it is used only on `--accent` surfaces; light-surface emphasis that previously used `bg-gold` now uses `bg-foreground text-background`.

Type is unchanged in face and role: Source Serif 4 for `.display`, `.h1` and a restrained `.h2`; Inter for everything transactional. `DESIGN.md` was rewritten to describe the monochrome system and the type split.

---

## 3. Section work

**Homepage** (`src/app/(site)/page.tsx`)

- Hero and 3D carousel untouched: autoplay, prev/next, tabs, drag/swipe, keyboard, hover/focus pause, tab-visibility pause, reduced-motion, mobile and no-WebGL fallbacks, lazy texture loading.
- Company intro sits on hairline columns with live-status pills instead of decorative fills.
- Products-in-use uses `bg-surface` cards with a real interface fragment; the MaaCash badge uses the inverted tone so it reads on the light card.
- Closing product CTA tile became an `bg-accent` panel with one primary action.
- Services sit on a hairline grid, not cards.
- Four-stage process uses a neutral tone ladder renamed `forest`/`brass` → `ink`/`graphite`: ink = `bg-accent text-accent-contrast`, graphite = `bg-foreground-subtle text-background`, then surface and muted.
- Evidence panel converted from gold to `bg-accent` with three product counts (3 products, 2 available, 1 in build) — counts only, no invented metrics.
- Founder block uses the existing portrait and the existing copy.
- Resources and contact panels restyled; contact form retains the live `/api/enquiries` endpoint.

**Every other public route**

| Route | Change |
|---|---|
| `/products` | Product rows on surface panels; closing CTA moved to `bg-accent` with primary/secondary actions |
| `/products/schemeknit`, `/maacash`, `/tillproof` | Neutral product fragments, neutral stage palette, launch panel on `bg-surface ring-1 ring-line`, TillProof closing panel on `bg-accent` |
| `/services` | Hairline sections, neutral accents |
| `/work` | Closing panel on `bg-accent`, monochrome badges |
| `/about` | "No history we cannot evidence" panel moved from gold to `bg-accent`; inverse/outline buttons |
| `/founder` | Portrait untouched, chrome neutral |
| `/resources`, articles | Neutral list bullets, border rules and callouts |
| `/contact` | Neutral form chrome; consent text and privacy link unchanged |
| `/privacy` | Neutral status callout |
| Header | Logo tile fixed `#0a0a0a`; active underline `bg-foreground`; neutral dropdown shadow; assistant icon removed |
| Footer | Rebuilt: fixed black field, small logo, statement, socials, three link columns, compact CTA, legal bar with privacy, analytics settings and registration. The oversized logo panel and large gold project panel are gone |
| Internal (`/internal`, `/api/internal`) | Neutral header; still `noindex, nofollow, nocache`; still Access-gated in production |

Canvas and WebGL palettes were renamed to neutral constants (`field`, `tint`, `mark`, `onField`) rather than left with forest/brass names.

---

## 4. Chatbot restoration

`src/components/HelpChat.tsx` was restored from commit `64bd10c` (the pre-redesign floating assistant) and restyled to the neutral system:

- mascot launcher bottom-left, delayed nudge bubble, conversation panel, real `src/lib/assistant-kb.ts` answers;
- `src/lib/assistant-kb.ts` is byte-identical to `HEAD` (no diff);
- `aria-expanded`, Escape to close, focus moves into the panel on open and back to the launcher on close;
- the launcher no longer focuses itself on first paint (`hasOpened` ref), so page load does not steal focus;
- `AssistantTrigger` (the header icon added during the redesign) was deleted, and the header reference removed.

The consent banner stays bottom-left and covers the launcher until a choice is made; that is deliberate, so the page never shows two competing floating surfaces.

---

## 5. SEO preservation

Every field below was captured from the local production build and diffed against `seo-baseline.json`, which was captured from production before the change. **No differences on any route.**

| Check | Result |
|---|---|
| Titles, descriptions, canonicals | identical, 15/15 |
| OG title/description/image, Twitter card | identical, 15/15 |
| Robots directives | identical; public pages `index, follow` |
| `html lang` | `en` on all routes |
| Structured data types | identical (`Organization`, `WebSite`, product `SoftwareApplication`, FAQ, breadcrumb where present) |
| `h1` count and text | identical |
| `h2` outline | identical text and order |
| `sitemap.xml` | 15 URLs, unchanged |
| `robots.txt` | unchanged, still disallows `/internal`, `/api/internal`, `/api/enquiries` |
| Favicons | `/favicon.ico`, `/favicon-16.png`, `/favicon-32.png`, `/apple-touch-icon.png` all 200 with correct content types; no cache-busting query strings |
| `og-image.png` | 200, `image/png` |
| Legacy redirects | `/products/bik-prestige` and `/products/bloomcore-one` → `/products/maacash` 301, still declared in `public/_redirects` and `netlify.toml` |
| `/internal/leads` | renders "Sign in required", `<meta name="robots" content="noindex, nofollow, nocache">` |
| `/api/internal/notifications` | 401 without Access |

No `noindex`, `nofollow`, duplicate title, redirect loop or URL change was introduced.

---

## 6. Analytics and consent

- GTM `GTM-PMZ6ZSVT` and GA4 `G-GDBL5SNHKL` unchanged; still consent-gated at runtime, single container, single outbound-click event.
- Event names unchanged. No enquiry text, name, email, phone or chatbot content is sent to GA4.
- Consent banner restyled to the neutral system. "Keep off" carries the same visual weight as "Allow"; both are primary buttons of equal size.
- Analytics settings remain reachable from the footer.

---

## 7. Accessibility and responsiveness

- Semantic landmark structure, one `h1` per page, ordered headings.
- All controls have visible focus (`focus-visible` outline in the foreground colour); no focus removed without replacement.
- Chat launcher has an accessible name, `aria-expanded` state and keyboard operation.
- Consent region has `role="region"` and an accessible label; both choices are real buttons.
- Forms keep labels, error text tied to inputs, and a `role="status"`/`role="alert"` result.
- `prefers-reduced-motion` disables reveals, the mascot ping and panel motion.
- Audited at 1440×900, 1280×800, 768×1024, 390×844 and 375×812: 0 horizontal overflow. The last overflow (a `select` in the quick-enquiry form at 375 px) was fixed with `w-full max-w-full sm:w-auto`.

Contrast was measured on the rendered page, not from token guesses: body text is `#0a0a0a` on `#f1f1f1`/`#ffffff` (≈18:1), secondary text `#4a4a4a` (≈8.9:1), faint `#6e6e6e` (≈5.2:1), and inverted text is white on `#0a0a0a` (≈20:1). All pass WCAG 2.2 AA for normal text; decorative hairlines are not load-bearing.

---

## 8. Infrastructure

- Next.js App Router + React + OpenNext on Cloudflare Workers; no change to Worker name, DNS, bindings, D1, Access, Resend secrets or the lead endpoint.
- `next.config.ts` still switches to `output: "export"` only when `NETLIFY=true`; the Cloudflare production build never sets it.
- Netlify fallback verified: `node scripts/netlify-prune.mjs && NETLIFY=true npm run build` completes, and the pruned directories were restored afterwards.
- Contact form continues to POST to the live `/api/enquiries` path (D1 record + confirmation email); it was not downgraded or redirected.

---

## 9. Verification commands

```
npx tsc --noEmit
npm run lint
npm run build
npx opennextjs-cloudflare build
node scripts/netlify-prune.mjs && NETLIFY=true npm run build   # fallback check only
```

Rendered checks used the Playwright harness at
`%TEMP%\opencode\bloomcore-audit\local-check.cjs` (overflow, chromatic-colour census, console errors, 75 screenshots) and
`seo-capture.cjs` / `seo-diff.cjs` (metadata diff against the baseline).

---

## 10. Remaining items

1. Commit and push `feat/monochrome-redesign`, then deploy with `npx wrangler deploy` from the fresh `.open-next` build.
2. Re-run the audit harness with `BASE=https://bloomcoretech.com` after deploy to confirm production matches the local build, including the two legacy redirects.
3. Owner-side checks that need an Access session: authenticated `/internal` walkthrough, a test enquiry end to end (D1 row + confirmation email), and GA4 DebugView after consent.
4. The QA lead created during earlier testing (`BC-2026-000001`) could not be removed from production D1 with this environment's token; it remains owner-side cleanup.
