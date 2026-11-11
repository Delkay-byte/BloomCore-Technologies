# BloomCore design system

Reference for every public page on the BloomCore Technologies corporate site.
The system is deliberately small: two chromatic colours, two typefaces, one
radius, one grid. Product interfaces are the main imagery.

## 1. Direction

**The well-kept board.** The page is a fitted board of tiles with narrow gaps.
Each tile holds one thing: a statement, a product, a process stage, a fact, a
link. The board is dense but ordered, the way a well-run engineering desk is
ordered.

The direction was drawn from the design-taste library (seed `1877496903`,
direction `dense-tiles`) and then adapted so the hero can carry a real 3D
product stage. The previous site's strongest qualities were restored: white
ground, a green product-led identity, compact technical information, visible
product interfaces and a plain header. They are now built with a stronger type
scale, better spacing and real interaction.

The idea sentence:

> On this page, **BloomCore's three product interfaces** become **the tile
> board's living exhibits**, with the hero operating as a small product stage.

## 2. Colour

Two chromatic brand colours only. Everything else is a neutral step.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#f4f1e9` | `#090f0c` | page ground (warm ivory / near-black) |
| `--surface` | `#fffdf8` | `#101712` | primary tile |
| `--surface-2` | `#ebe6db` | `#161f19` | secondary tile |
| `--surface-3` | `#dfd9cc` | `#1e2921` | third tone step |
| `--foreground` | `#111512` | `#f2eee3` | ink |
| `--foreground-subtle` | `#4d544d` | `#b8bfb6` | body copy |
| `--foreground-faint` | `#626960` | `#949c92` | metadata |
| `--line` | `#d8d2c5` | `#29352c` | functional border |
| `--line-strong` | `#b9b2a3` | `#3c4a3f` | control border |
| `--accent` | `#0c3b30` | `#82d5b5` | forest: actions, stage, dark fields |
| `--accent-strong` | `#08251f` | `#a6e7ca` | pressed/hover forest |
| `--accent-contrast` | `#f8f5ec` | `#08241f` | text on forest |
| `--accent-soft` | `#e2ede7` | `#14271f` | forest tint |
| `--gold` | `#c69a3e` | `#e0b86a` | brass: selection, evidence, CTA tile |
| `--gold-strong` | `#a97e27` | `#efc97f` | brass hover |
| `--gold-soft` | `#f3e6c6` | `#322711` | brass tint |
| `--gold-contrast` | `#1a1408` | `#171105` | text on brass |

Rules:

- Forest is the identity colour. Brass is an event colour: active carousel tab,
  status badge, evidence band, footer CTA.
- No product introduces a third accent. SchemeKnit, MaaCash and TillProof all
  use forest, brass and neutrals inside their representative interfaces.
- The header logo tile and footer brand tile stay forest in both themes because
  the supplied logo is white.
- No gradients, glows, glass, coloured shadows or decorative blobs.
- Dark mode is a designed theme, not an inversion: mint forest, warm ink, deeper
  neutral tiles.

## 3. Typography

Self-hosted with `next/font/local`. No build or runtime request to Google Fonts.

| Role | Face | Weights | Notes |
| --- | --- | --- | --- |
| Display | **Source Serif 4** | variable 200–900 | statements, hero, section headings, product names |
| UI / body | **Inter** | 400, 500, 600, 700 | navigation, body, buttons, labels, tables |

Hierarchy:

| Token | Size | Use |
| --- | --- | --- |
| `.display` | `clamp(3.2rem, 7.4vw, 7.6rem)` | homepage hero |
| `.h1` | `clamp(2.9rem, 6vw, 6rem)` | page and product heroes |
| `.h2` | `clamp(2.2rem, 4vw, 3.9rem)` | section headings |
| `.h3` | `clamp(1.2rem, 1.6vw, 1.55rem)` | sub-headings |
| `.lead` | `clamp(1.1rem, 1.35vw, 1.3rem)` | section introductions |
| body | `1.0625rem` / 1.6 | reading copy |
| small | `0.875rem` | captions and metadata |

Display headings are sentence case, tight tracking and balanced. There are no
monospace labels, index numbers, tracked uppercase captions or eyebrow chips.
Metadata is sentence case in Inter.

Product interface fragments use true interface sizes (11–13px) inside a
`[data-ui]` scope. Contrast rules still apply.

## 4. Shape, grid and space

- **Radius:** `--radius: 10px` on tiles and cards; `7px` on buttons and inputs.
  Circular shapes are reserved for status dots.
- **Page frame:** `.page-frame`, max 1480px, `16px` mobile / `24px` desktop
  outer padding.
- **Board gap:** `10px` (`gap-2.5`). Tiles meet edge to edge with one tone gap.
- **Section rhythm:** `clamp(80px, 9vw, 132px)` block padding.
- **Grid:** 12 columns at `lg`; hero 6/6, product 5/7, copy 4/8, features
  two-column inside the right field.
- **Borders:** 1px only where a control or a table row needs an edge. Tiles are
  separated by tone, not outlines.
- **Shadows:** only floating layers: menus, dialogs, the assistant panel and the
  consent panel. Never on tiles at rest.

## 5. Components and states

| Component | File | Notes |
| --- | --- | --- |
| `Header` | `src/components/Header.tsx` | sticky, white ground, product menu, assistant trigger, theme, mobile board menu |
| `Footer` | `src/components/Footer.tsx` | five tiles, forest brand tile, brass CTA, legal bar |
| `Page` primitives | `src/components/Page.tsx` | `Container`, `PageHero`, `ArrowLink`, `StatusBadge`, `Eyebrow` |
| `Button` | `src/components/ui/Button.tsx` | primary, secondary, outline, ghost, inverse |
| `HeroStage` | `src/components/stage/HeroStage.tsx` | hero product stage, controls, autoplay, fallback |
| `ProductCarousel3D` | `src/components/stage/ProductCarousel3D.tsx` | React Three Fiber carousel |
| `ProductFragments` | `src/components/ProductFragments.tsx` | representative interfaces, `data-ui` |
| `SchemeKnitDemo` | `src/components/SchemeKnitDemo.tsx` | live scheme-to-plan example |
| `ProductPageShell` | `src/components/ProductPageShell.tsx` | shared product page |
| `ContactForm` | `src/components/ContactForm.tsx` | validated mailto form |
| `QuickEnquiry` | `src/components/QuickEnquiry.tsx` | one-line project enquiry |
| `HelpChat` | `src/components/HelpChat.tsx` | knowledge-base assistant opened from header/footer |
| `Analytics` | `src/components/Analytics.tsx` | consent panel and delegated event listener |

Button states:

- Default: flat fill or functional border.
- Hover: forest darkens / brass darkens / surface tone steps.
- Focus-visible: 2px foreground outline, 3px offset.
- Active: `translate-y-px` for immediate press feedback.
- Selected: `aria-pressed` plus brass fill in the carousel tab row.
- Disabled: 45% opacity, pointer events off.
- Loading: skeleton only for the 3D stage; no fake spinners.
- Success/error: form messages with `aria-live` / `role="alert"`.

## 6. 3D product stage

Stack: `three` 0.187, `@react-three/fiber` 9.8 (React 19 line),
`@react-three/drei` 10.7. Loaded with `next/dynamic`, client only.

Architecture:

- Three `RoundedBox` panels on an arc. Active panel at the front; neighbours
  rotate, recede in z, lose scale and are dimmed by material colour.
- Each panel face is a 1400×870 `CanvasTexture` drawn by
  `draw-product-panel.ts` with the product's real labels, statuses and
  representative data. No external screenshots.
- Camera 5.3 desktop / 6.6 compact, fov 34. Panels animate with damped position,
  rotation and scale.
- Drag is pointer-based and updates a fractional index; release snaps to the
  nearest product. Buttons and product tabs call the same index state.
- Autoplay every 7.2s. Paused on hover, focus, any manual interaction, hidden
  tab and reduced-motion preference.
- Canvas frameloop stops when the stage leaves the viewport or the tab is
  hidden. DPR is capped at 1.65.
- WebGL failure or missing support renders the same interface as a 2D canvas
  card, with the same controls and product data. A React error boundary catches
  context failures.
- `aria-hidden` on the WebGL wrapper; the DOM product name, status, description
  and links carry the accessible content. Keyboard: ArrowLeft/ArrowRight,
  Home/End.

## 7. Motion

- Hero entrance: staggered rise (CSS, 680ms, 70–300ms delays).
- Scroll reveals: IntersectionObserver + Web Animations, 520ms, 16px rise,
  once per element.
- Carousel: damped 3D movement; no autoplay under reduced motion.
- Menus/dialogs: 180–220ms opacity/translate.
- Hover: colour and 1px translation only.
- No parallax hijacking, no smooth-scroll library, no cursor followers, no
  looping decoration.
- Reduced motion removes entrance, autoplay and smooth scrolling while keeping
  every state change.

## 8. Responsive breakpoints

| Width | Behaviour |
| --- | --- |
| ≥1440 | full board, 6/6 hero, full nav, all product controls |
| 1280 | same structure, tighter nav |
| 1024–1279 | desktop nav without CTA, 6/6 hero |
| 768–1023 | two-column product tiles, mobile navigation |
| 390–767 | single column, 2×2 product strip, stacked hero CTAs, mobile carousel camera |
| 375 | same, smallest tested width |

No horizontal overflow at 1440, 1280, 768, 390 or 375.

## 9. Accessibility

- WCAG 2.2 AA target; automated contrast audit over light and dark routes.
- One `h1` per page; section headings in order.
- Skip link before the header.
- Mobile menu traps focus, closes on Escape, restores body scroll.
- Product menu opens by click and hover, closes on Escape and focus loss.
- Carousel has previous/next, direct product buttons, keyboard support, drag and
  touch, and a non-WebGL alternative.
- Contact form: labels, `aria-invalid`, `aria-describedby`, first-error focus,
  alert summary, no data leaves the browser.
- Assistant is a labelled dialog opened from header/footer, focuses its close
  button, closes on Escape and restores focus.
- Reduced motion, visible focus, 44px minimum controls, sentence-case labels.

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| `three` | WebGL renderer |
| `@react-three/fiber` 9.x | React 19-compatible renderer |
| `@react-three/drei` 10.x | rounded panel geometry only |
| `motion` | mobile menu transitions and reduced-motion hook |
| Self-hosted font files | Inter faces and Source Serif 4 Roman in `src/assets/fonts` |
| Next.js, React, Tailwind | existing stack, unchanged |

Not added: GSAP, Lenis, Radix/Base UI, Embla, Lucide. The interface needs none of
them; adding them would duplicate existing responsibilities.

Font licensing: Inter and Source Serif 4 are SIL Open Font License 1.1. Inter's
licence text is kept at `src/assets/fonts/INTER-LICENSE.txt`. Source Serif 4 is
Adobe's OFL release; its Roman variable file is self-hosted at
`src/assets/fonts/source-serif-4-roman.woff2`.

## 11. Editing rules

1. Use a token or an existing component before adding one.
2. No third chromatic colour. Product accents stay inside forest/brass/neutral.
3. No gradients, glass, decorative blobs, index numbers, mono labels or tracked
   uppercase eyebrows.
4. Do not invent a customer, metric, logo, testimonial or TillProof app URL.
5. Keep the enquiry path as a mailto hand-off; the site never posts form data.
6. `src/lib/analytics.ts` is the source of truth. One GTM container, one page
   view, one delegated event listener.
7. Run `npx tsc --noEmit`, `npm run lint`, `npm run build`,
   `npx opennextjs-cloudflare build` and `NETLIFY=true npm run build` before
   publishing.
