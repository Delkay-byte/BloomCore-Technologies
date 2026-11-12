# BloomCore design system — monochrome

Reference for every public page on the BloomCore Technologies corporate site.

The system is deliberately small: **one colour pair (black and white)**, one type
pair, one radius, one grid. Product interfaces are the main imagery. The hero and
its 3D product stage are preserved; everything below the hero is brought into one
monochrome language.

## 1. Direction

**Engineered contrast.** The page is a fitted board of tiles. Tiles are separated
by tone and hairline edges, never by colour. Where the old site used forest and
brass to signal an event, the new system uses **tonal inversion**: a black field
on a white ground, or a white field on a black ground. Contrast does the work
that colour used to do.

The idea sentence:

> On this page, **BloomCore's three product interfaces** are **the only colour in
> a strictly black-and-white document**, presented as a small product stage.

Rules that follow from the direction:

- No chromatic accent anywhere in the corporate interface. No green, mint, gold,
  brass, blue, purple, teal, orange or red.
- Product screenshots and genuine application interfaces may keep their own
  colours, because they are real products. Representative interfaces drawn by
  this site are monochrome, because they are illustrations, not screenshots.
- No gradients, glows, glass, coloured shadows or decorative blobs.
- Dark mode is a designed theme, not an inversion.

## 2. Colour — two colours only

Black, white and neutral steps derived from them. Nothing else.

### Primitive steps

| Step | Light | Dark |
| --- | --- | --- |
| 0 (pure white) | `#ffffff` | `#ffffff` |
| 50 | `#f7f7f7` | `#161616` |
| 100 | `#efefef` | `#1c1c1c` |
| 200 | `#e4e4e4` | `#242424` |
| 300 | `#d6d6d6` | `#2f2f2f` |
| 500 | `#8c8c8c` | `#8c8c8c` |
| 700 | `#4a4a4a` | `#b4b4b4` |
| 900 | `#0a0a0a` | `#f5f5f5` |
| 1000 (pure black) | `#000000` | `#000000` |

### Semantic tokens

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#f1f1f1` | `#090909` | page ground |
| `--surface` | `#ffffff` | `#111111` | primary tile |
| `--surface-2` | `#f7f7f7` | `#181818` | secondary tile |
| `--surface-3` | `#e9e9e9` | `#222222` | third tone step |
| `--muted` | `#ededed` | `#151515` | quiet fill |
| `--foreground` | `#0a0a0a` | `#f5f5f5` | ink |
| `--foreground-subtle` | `#4a4a4a` | `#b4b4b4` | body copy |
| `--foreground-faint` | `#6e6e6e` | `#8c8c8c` | metadata |
| `--line` | `#dedede` | `#272727` | functional border |
| `--line-strong` | `#bdbdbd` | `#3a3a3a` | control border |
| `--field` | `#ffffff` | `#111111` | input fill |
| `--accent` | `#0a0a0a` | `#f5f5f5` | primary filled surface, dark bands |
| `--accent-strong` | `#2b2b2b` | `#ffffff` | hover / pressed |
| `--accent-contrast` | `#ffffff` | `#0a0a0a` | text on `--accent` |
| `--accent-soft` | `#ededed` | `#1e1e1e` | quiet tint |
| `--accent-line` | `#c9c9c9` | `#3a3a3a` | tint edge |
| `--gold` | `#ffffff` | `#1c1c1c` | inverted field (selection, highlight band) |
| `--gold-strong` | `#efefef` | `#2a2a2a` | inverted hover |
| `--gold-soft` | `#ededed` | `#222222` | inverted tint |
| `--gold-contrast` | `#0a0a0a` | `#f5f5f5` | text on `--gold` |

The `--accent` / `--gold` names are kept because 100+ components reference them;
their values are now black-and-white. `--accent` is the dark field on a light
ground; `--gold` is the inverted field, so it reads as white on light themes and
as a raised dark tile on dark themes.

### Contrast rules

- Body copy on `--background` / `--surface`: `--foreground-subtle` (`#4a4a4a` on
  `#ffffff` = 9.0:1, AA and AAA for text).
- Metadata on `--surface`: `--foreground-faint` (`#6e6e6e` on `#ffffff` = 5.3:1,
  AA for normal text).
- Text on `--accent` uses `--accent-contrast` (`#ffffff` on `#0a0a0a` = 19.3:1).
- Text on `--gold`: `--gold-contrast` (`#0a0a0a` on `#ffffff` = 19.3:1).
- Never place `--gold` text on a `--surface` background without a border or a
  fill change; a white-on-white pill is forbidden, so status pills use
  `bg-foreground text-background`.
- Focus ring: `2px solid var(--foreground)`, `offset 2–3px`. Never a colour ring.

## 3. Typography

Self-hosted with `next/font/local`. No request to Google Fonts.

| Role | Face | Weights | Notes |
| --- | --- | --- | --- |
| Display | **Source Serif 4** | variable 200–900 | hero statement and page titles only |
| UI / body | **Inter** | 400, 500, 600, 700 | navigation, headings, body, buttons, labels, tables |

The serif is **restrained**: it carries the homepage hero (`display`), the `h1` of
each page, and section statements (`h2`) held to a small clamp of 2.6rem at most.
Everything transactional — navigation, body, buttons, labels, tables, card titles
and the `.h3` sub-heading scale — stays in Inter, so the page reads as an
engineering company rather than a magazine.

| Token | Size | Use |
| --- | --- | --- |
| `.display` | `clamp(2.9rem, 5.4vw, 5.4rem)` | homepage hero only |
| `.h1` | `clamp(2.3rem, 4.4vw, 4.2rem)` | page and product titles |
| `.h2` | `clamp(1.75rem, 2.6vw, 2.6rem)` | section statements |
| `.h3` | `clamp(1.15rem, 1.5vw, 1.4rem)` | sub-headings, card titles |
| `.lead` | `clamp(1.05rem, 1.25vw, 1.2rem)` | section introductions |
| body | `1.0625rem` / 1.65 | reading copy |
| small | `0.875rem` | captions and metadata |

Display headings are sentence case with tight tracking and balanced wrapping.
No monospace labels, index numbers, tracked uppercase captions or eyebrow chips;
metadata is sentence case in Inter. Measure is capped (`max-w-[62ch]` on prose)
so no paragraph runs the full 1440px width.

Product interface fragments use true interface sizes (11–13px) inside a
`[data-ui]` scope, and are now monochrome.

## 4. Shape, grid and space

- **Radius:** `--radius: 10px` on tiles and cards; `7px` on buttons and inputs.
  Circular shapes are reserved for status dots.
- **Page frame:** `.page-frame`, max `1480px`, `16px` mobile / `24px` desktop
  outer padding.
- **Board gap:** `10px` (`gap-2.5`). Tiles meet edge to edge with one tone gap.
- **Section rhythm:** `clamp(72px, 8vw, 120px)` block padding; `section-pad-sm`
  for secondary bands.
- **Grid:** 12 columns at `lg`. Homepage: hero 6/6, product feature 12, product
  pair 6/6, process 4 columns, contact 7/5.
- **Borders:** `1px` where a control, a table row or an inverted field sits on a
  similar tone. Tiles are otherwise separated by tone.
- **Shadows:** reserved for floating layers only — menus, dialogs, the assistant
  panel, the consent panel. Never on tiles at rest.

## 5. Surface hierarchy

Three deliberate modes, used in a fixed rotation so the page feels art-directed
rather than striped:

1. **Quiet** — `bg-background`, `--foreground` ink. Reading sections.
2. **Raised** — `bg-surface` tile on the quiet ground. Cards, product blocks.
3. **Inverted** — `bg-accent` (black on light) or `bg-gold` (white on light).
   Used at most twice per page: one evidence/statement band and the closing CTA.

Never two consecutive inverted bands. Never more than three tone steps inside one
section.

## 6. Components and states

| Component | File | Notes |
| --- | --- | --- |
| `Header` | `src/components/Header.tsx` | sticky, white ground, monochrome logo tile, product menu, theme toggle, mobile board menu |
| `Footer` | `src/components/Footer.tsx` | restrained corporate footer: brand, products, company, contact, legal bar; no oversized logo panel, no gold panel |
| `Page` primitives | `src/components/Page.tsx` | `Container`, `PageHero`, `ArrowLink`, `StatusBadge`, `Eyebrow` |
| `Button` | `src/components/ui/Button.tsx` | primary (black fill), secondary (outline), outline, ghost, inverse |
| `HeroStage` | `src/components/stage/HeroStage.tsx` | hero product stage — **preserved**, monochrome tone only |
| `ProductCarousel3D` | `src/components/stage/ProductCarousel3D.tsx` | React Three Fiber carousel — **preserved**, neutral materials |
| `draw-product-panel` | `src/components/stage/draw-product-panel.ts` | representative interface renderer — monochrome palette |
| `ProductFragments` | `src/components/ProductFragments.tsx` | representative interfaces, `data-ui`, monochrome |
| `ProductTabs` | `src/components/ProductTabs.tsx` | product directory tabs, monochrome |
| `SchemeKnitDemo` | `src/components/SchemeKnitDemo.tsx` | live scheme-to-plan example, monochrome |
| `ProductPageShell` | `src/components/ProductPageShell.tsx` | shared product page |
| `ContactForm` | `src/components/ContactForm.tsx` | validated enquiry form posting to the live endpoint |
| `QuickEnquiry` | `src/components/QuickEnquiry.tsx` | short project enquiry |
| `HelpChat` | `src/components/HelpChat.tsx` | **restored floating assistant** — mascot launcher, nudge, panel |
| `Analytics` | `src/components/Analytics.tsx` | monochrome consent panel and delegated event listener |

### Button variants

| Variant | Default | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| primary | `bg-accent` / `text-accent-contrast` | `bg-accent-strong` | `translate-y-px` | 45% opacity |
| secondary | `border-line-strong` / transparent | `border-foreground` + `bg-surface-2` | `translate-y-px` | 45% opacity |
| outline | same as secondary | same | same | same |
| ghost | transparent / `text-foreground` | `bg-surface-2` | `translate-y-px` | 45% opacity |
| inverse | `bg-accent-contrast` / `text-accent` | `bg-gold` / `text-gold-contrast` | `translate-y-px` | 45% opacity |

Every variant: `focus-visible:outline-2 focus-visible:outline-offset-3
focus-visible:outline-foreground`.

### Status and selection

- Available / live pill: `bg-foreground text-background`.
- In development pill: `bg-surface-2 text-foreground-subtle` or
  `ring-1 ring-inset ring-line-strong`.
- Selected tab (on a dark field): `bg-gold text-gold-contrast`.
- Selected tab (on a light field): `bg-accent text-accent-contrast`.
- Loading: skeleton that mirrors the content, `aria-busy`, removed on data.
  Button-level pending state for small actions.

## 7. 3D product stage

The stack and behaviour are unchanged: `three` 0.187, `@react-three/fiber` 9.8,
`@react-three/drei` 10.7, loaded with `next/dynamic`, client only.

Preserved exactly:

- Three `RoundedBox` panels on an arc; active at front, neighbours recede.
- Panel faces are 1400×870 `CanvasTexture`s drawn by `draw-product-panel.ts`.
- Camera, damping, drag-to-index, snapping.
- Autoplay every 7.2s; paused on hover, focus, manual interaction, hidden tab and
  reduced motion.
- Canvas frameloop stops off-screen or when the tab is hidden; DPR capped 1.65.
- WebGL failure renders the same interface as a 2D canvas card through the same
  error boundary and the same controls.
- Keyboard: ArrowLeft / ArrowRight / Home / End.
- `aria-hidden` on the WebGL wrapper; accessible content lives in the DOM.

Changed for monochrome only:

- Panel materials use neutral values (`#1a1a1a` / `#0f0f0f`), not forest.
- Lights are white/neutral; the brass and mint lights are removed.
- The panel accent strip is white when active, grey when not.
- `draw-product-panel.ts` palette is black, white and grey; the representative
  interface keeps its layout, labels and statuses, loses its colour.

## 8. Chatbot — restored floating assistant

- **Position:** fixed, bottom-left, `left-3` mobile / `left-6` desktop, above the
  safe area. Keeps the bottom-right clear for back-to-top.
- **Launcher:** the original mascot button (`72px` mobile / `88px` desktop), idle
  float, shake on hover, subtle attention ping. Monochrome mascot (white body,
  black features, grey antenna) with the same geometry as the original.
- **Nudge:** dismissible "We're here to help" card above the launcher, appearing
  after 2.2s, removed once the panel opens or the user dismisses it.
- **Panel:** `role="dialog"`, `aria-label`, dark field (`#111`), maximum
  `min(22rem, 100vw - 1.5rem)` wide and `min(560px, 80dvh)` tall.
  Header with mascot, title and close; scrolling message list with user/bot
  bubbles; typing indicator; follow-up chips; input plus send; footer links to
  email, WhatsApp and the contact page.
- **Behaviour preserved:** opens/closes, message entry, send, real knowledge-base
  answers, typing state, follow-up chips, link buttons, keyboard (Enter to send),
  disabled send when empty, focus-visible states, mobile sizing.
- **No** canned or fabricated answers; no new provider; no keys. Answers still
  come from `src/lib/assistant-kb.ts`, which is unchanged.
- Colours are fixed literals inside the panel (never theme variables) so the
  panel is equally legible in light and dark mode — as in the original.

## 9. Motion

- Hero entrance: staggered rise (CSS, 680ms, 70–300ms delays) — preserved.
- Scroll reveals: IntersectionObserver + Web Animations, 520ms, 16px rise, once
  per element.
- Carousel: damped 3D movement; no autoplay under reduced motion.
- Menus/dialogs: 180–220ms opacity/translate.
- Chatbot panel: 180ms scale/rise; nudge: 220ms rise.
- Hover: tone change and 1px translation only. No colour hovers.
- No parallax hijacking, no smooth-scroll library, no cursor followers, no
  looping decoration.
- Reduced motion removes entrance, autoplay, smooth scrolling and the chatbot
  float, while keeping every state change.

## 10. Responsive breakpoints

| Width | Behaviour |
| --- | --- |
| ≥1440 | full board, 6/6 hero, full nav, all product controls |
| 1280 | same structure, tighter nav |
| 1024–1279 | desktop nav without CTA, 6/6 hero |
| 768–1023 | two-column product tiles, mobile navigation |
| 390–767 | single column, 2×2 product strip, stacked hero CTAs, compact carousel camera |
| 375 | same, smallest tested width |

No horizontal overflow at 1440, 1280, 768, 390 or 375. The chatbot launcher sits
flush left and never widens the document.

## 11. Accessibility

- WCAG 2.2 AA target.
- One `h1` per page; section headings in order.
- Skip link before the header.
- Mobile menu traps focus, closes on Escape, restores body scroll.
- Product menu opens by click and hover, closes on Escape and focus loss.
- Carousel: previous/next, direct product buttons, keyboard, drag and touch, and
  a non-WebGL alternative.
- Contact form: labels, `aria-invalid`, `aria-describedby`, first-error focus,
  alert summary, live region.
- Chatbot: labelled dialog, focus moves into the panel, Escape closes, focus
  returns to the launcher, `aria-expanded` on the launcher.
- Consent panel: `role="region"`, both choices equally prominent and keyboard
  reachable, `aria-live` confirmation.
- Reduced motion, visible focus, 44px minimum targets, sentence-case labels.

## 12. Dependencies

Unchanged. No new dependency is added for this redesign.

| Dependency | Why |
| --- | --- |
| `three` | WebGL renderer |
| `@react-three/fiber` 9.x | React 19-compatible renderer |
| `@react-three/drei` 10.x | rounded panel geometry only |
| `motion` | mobile menu transitions and reduced-motion hook |
| Self-hosted font files | Inter faces and Source Serif 4 Roman in `src/assets/fonts` |
| Next.js, React, Tailwind | existing stack, unchanged |

Not added: GSAP, Lenis, Radix/Base UI, Embla, Lucide, any colour library.

## 13. Editing rules

1. Use a token or an existing component before adding one.
2. **No chromatic colour, ever.** Black, white and grey only.
3. No gradients, glass, decorative blobs, index numbers, mono labels or tracked
   uppercase eyebrows.
4. Do not invent a customer, metric, logo, testimonial, certification or product
   URL.
5. The enquiry path posts only to the live, verified endpoint; never to a
   placeholder.
6. `src/lib/analytics.ts` is the source of truth. One GTM container, one page
   view, one delegated event listener. No enquiry or chatbot content to GA4.
7. The favicon files, URLs, dimensions and cache behaviour are immutable.
8. Run `npx tsc --noEmit`, `npm run lint`, `npm run build`,
   `npx opennextjs-cloudflare build` and `NETLIFY=true npm run build` before
   publishing.
