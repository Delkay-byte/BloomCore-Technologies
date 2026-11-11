# BloomCore design system

This document describes the visual system used by the BloomCore Technologies
corporate website. It is written for whoever edits the site next. The system is
deliberately small: one typeface, one palette with two themes, square corners,
and product interfaces used as the only imagery.

## 1. Direction

**The product performs.** The site shows the work rather than describing it in
abstract marketing language. Product interfaces, a live scheme-to-plan example
and a compact product selector carry the argument. Text states limits plainly.

The direction was drawn from a fixed brief and seed (`1889974782`) with the
`product-performs` direction, and the palette was kept from the existing brand.

Principles:

1. Show the interface before claiming the benefit.
2. State product status exactly. Two products are available; TillProof is in
   development.
3. One idea per section. A section either explains, demonstrates or invites
   contact.
4. No invented proof. There are no customer logos, testimonials, awards,
   revenue figures or usage statistics anywhere in the system.
5. Product interfaces are representative, labelled as such, and never presented
   as screenshots of a customer environment.

## 2. Typography

- **Family:** Jost, loaded through `next/font/google` as `--font-jost`.
- **Weights:** 400, 500, 600, 700.
- **Body size:** `1.0625rem` (17px), line-height 1.55.
- **Display face:** the same family, uppercase, tight tracking. No second
  typeface and no monospace labels.

Type roles, defined in `src/app/globals.css`:

| Class | Use | Size |
| --- | --- | --- |
| `.display` | homepage hero only | `clamp(2.7rem, 7.1vw, 7.4rem)` |
| `.h1` | page hero headings | `clamp(2.4rem, 5.2vw, 5.2rem)` |
| `.h2` | section headings | `clamp(2rem, 3.6vw, 3.6rem)` |
| `.h3` | sub-headings, article headings | `clamp(1.3rem, 1.8vw, 1.85rem)` |
| `.lead` | section introductions | `clamp(1.15rem, 1.5vw, 1.4rem)` |
| `.body-copy` | long-form copy | `1.0625rem` |
| `.small-copy` | notes and metadata | `0.875rem` |

Product interface fragments use true interface sizes (10–15px) inside a
`[data-ui]` scope. That is intentional: a product screen should look like a
product screen, not like page copy. These sizes still meet the contrast rules in
section 6.

## 3. Colour

Tokens live in `:root` and are mapped into Tailwind through `@theme inline`.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#f4f0e7` | `#0a0c0a` | page ground |
| `--surface` | `#fbf8f1` | `#121612` | first raised surface |
| `--surface-2` | `#e8e2d5` | `#1b211b` | second raised surface |
| `--foreground` | `#15170f` | `#f2efe6` | primary ink |
| `--foreground-subtle` | `#4c5147` | `#b9beb2` | body copy |
| `--foreground-faint` | `#5e6458` | `#919888` | notes and metadata |
| `--muted` | `#ece6da` | `#171d17` | quiet fills |
| `--border` | `#d7d0c2` | `#2a322a` | functional borders only |
| `--accent` | `#0d3b31` | `#8ad6bc` | forest sections, primary actions |
| `--accent-strong` | `#08241f` | `#a8e5cf` | hover and fixed panels |
| `--accent-contrast` | `#f7f4ec` | `#08241f` | text on accent |
| `--gold` | `#d9a33c` | `#e7b75c` | evidence band, focus points |
| `--field` | `#fbf8f1` | `#121612` | form fields |

Rules:

- Sections change tone (`background`, `surface`, `surface-2`, `accent`, `gold`),
  not decoration. Do not add hairlines to separate sections.
- Gold is an event colour. It marks the hero frame, status badges, the evidence
  band, the enquiry arrow and one footer tile. Do not use it for body text.
- There are no gradients, glass panels, decorative blobs, glow effects or
  coloured shadows.
- Dark mode is a real theme, not an inversion filter. `prefers-color-scheme` is
  the default; the theme toggle writes `bloomcore-theme` to local storage and
  `data-theme` to the root element.

## 4. Shape and space

- **Corners:** square. `border-radius` is 0 on sections, cards, fields and
  buttons. Circular shapes are reserved for the brand symbol, status dots and
  the back-to-top control.
- **Page frame:** `.page-frame`, max width 1440px, padding
  `clamp(20px, 4vw, 64px)`.
- **Section rhythm:** `py-20 sm:py-24 lg:py-32` on the homepage; product and
  supporting pages use `py-16 sm:py-20 lg:py-24`.
- **Grid:** 12 columns at `lg`, with content spans of 3/6/3, 4/8, 5/7 or 7/5.
  Mobile is a single column.
- **Borders:** 1px `--border` only where a control or an interface row needs an
  edge. Card outlines are intentionally absent.

## 5. Components

| Component | File | Purpose |
| --- | --- | --- |
| `Header` | `src/components/Header.tsx` | sticky header, product menu, mobile full-screen menu |
| `Footer` | `src/components/Footer.tsx` | five-tile footer with contact, product and company links |
| `Page` primitives | `src/components/Page.tsx` | `Container`, `PageHero`, `ArrowLink`, `StatusBadge` |
| `Button` / `ButtonLink` | `src/components/ui/Button.tsx` | five variants: primary, secondary, outline, ghost, inverse |
| `HeroConsole` | `src/components/HeroConsole.tsx` | stacked product-interface console with accessible product switch |
| `ProductFragments` | `src/components/ProductFragments.tsx` | representative SchemeKnit, MaaCash and TillProof interfaces |
| `SchemeKnitDemo` | `src/components/SchemeKnitDemo.tsx` | live text-to-plan example; data stays in the browser |
| `ProductTabs` | `src/components/ProductTabs.tsx` | homepage product selector using `aria-pressed` buttons |
| `QuickEnquiry` | `src/components/QuickEnquiry.tsx` | one-sentence mailto enquiry |
| `ProductPageShell` | `src/components/ProductPageShell.tsx` | shared product page layout and structured data |
| `ContactForm` | `src/components/ContactForm.tsx` | validated mailto form; never posts to a server |
| `HelpChat` | `src/components/HelpChat.tsx` | fixed knowledge-base assistant |
| `Analytics` | `src/components/Analytics.tsx` | consent panel and delegated analytics events |

The product switch uses buttons with `aria-pressed`, not a partial ARIA tab
implementation. The mobile menu traps focus, closes on Escape and restores body
scroll. The assistant is a labelled dialog with an explicit trigger.

## 6. Accessibility

- Target: WCAG 2.2 AA.
- All body and interface text meets 4.5:1 contrast at its rendered size; large
  text meets 3:1. `--foreground-faint` was darkened to `#5e6458` in light mode
  so metadata passes on all four light surfaces.
- Focus is always visible: a 2px foreground outline with a 3px offset.
- Every input has a visible label. Errors are announced with `role="alert"` and
  tied to the field with `aria-describedby` and `aria-invalid`.
- The skip link is the first focusable element.
- Motion respects `prefers-reduced-motion`; smoothing and reveal effects are
  disabled or shortened.
- No text is conveyed only by colour. Status badges carry words.
- The assistant panel and analytics panel are labelled regions/dialogs.

## 7. Imagery

- The only photographic asset is the founder portrait
  (`src/assets/founder-portrait.jpg`), used on the homepage and founder page
  with a factual alt text.
- Everything else that looks like a screenshot is a built interface fragment,
  made from the product's documented capabilities. Each fragment is captioned
  as representative. No customer, staff or financial records appear.
- Product logos are used only for their own products. No third-party logos.
- The brand lockup is the supplied white BloomCore logo on a forest field.

## 8. Motion

- `motion/react` is used for the mobile menu and reveal effects only.
- Durations stay at or below 300ms; nothing loops or auto-plays.
- The SchemeKnit demo and product switch update immediately with no animation
  that could hide a state change.
- Reduced-motion users get the final state without transforms.

## 9. Analytics and consent

The design does not own analytics behaviour. The rules are:

- No Google request, cookie or `dataLayer` entry before a choice.
- One GTM container (`GTM-PMZ6ZSVT`); GA4 (`G-GDBL5SNHKL`) lives inside it.
- Product links and form actions use `data-analytics` attributes read by one
  delegated listener.
- The footer reopens the consent panel.
- `src/lib/analytics.ts` is the source of truth. Do not add a second tag,
  a second page-view call or a second outbound listener.

## 10. Editing rules

1. Reuse a token or an existing component before adding a new one.
2. Do not introduce a second font, a gradient, a rounded card or a shadowed
   panel.
3. Do not invent a claim, a metric, a logo, a testimonial or a product URL.
4. Keep product status labels aligned with `src/lib/brand.ts`.
5. Keep the enquiry path as a mailto hand-off. The site does not send form data.
6. Run `npx tsc --noEmit`, `npm run lint` and `npm run build` before publishing.
