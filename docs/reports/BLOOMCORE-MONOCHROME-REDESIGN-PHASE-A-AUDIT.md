# BloomCore Technologies — Phase A Live Website Audit

**Purpose:** record the state of the live production site before the monochrome redesign.
**Production:** `https://bloomcoretech.com`
**Captured:** 12 November 2026 (full-page screenshots at 1440×900, 1280×800, 768×1024, 390×844, 375×812)
**Method:** headless Chromium (Playwright 1.65.0) against the real production URLs. Rendered output, not source reading.
**Evidence:** `docs/report-assets/monochrome-redesign-audit/` — `audit.json`, `seo-baseline.json`, `screenshots/` (63 full-page PNGs).

---

## 1. Route inventory

Confirmed from production `sitemap.xml` (15 indexable URLs), `robots.txt`, header and footer navigation.

| # | Route | Type |
|---|---|---|
| 1 | `/` | Homepage |
| 2 | `/products` | Product directory |
| 3 | `/products/schemeknit` | Product page |
| 4 | `/products/maacash` | Product page |
| 5 | `/products/tillproof` | Product page |
| 6 | `/services` | Services |
| 7 | `/resources` | Knowledge centre index |
| 8 | `/resources/scheme-of-learning-to-weekly-lesson-plans` | Article |
| 9 | `/resources/mobile-money-business-recordkeeping` | Article |
| 10 | `/resources/electrical-shop-stock-control` | Article |
| 11 | `/work` | Portfolio / evidence |
| 12 | `/about` | Company |
| 13 | `/founder` | Founder profile |
| 14 | `/contact` | Contact |
| 15 | `/privacy` | Privacy notice |

Non-public (correctly excluded from the sitemap and disallowed in `robots.txt`): `/internal`, `/internal/leads`, `/internal/notifications`, `/api/internal/*`, `/api/enquiries`.

`robots.txt` (production, verbatim):

```
User-Agent: *
Allow: /
Disallow: /internal
Disallow: /api/internal
Disallow: /api/enquiries

Host: bloomcoretech.com
Sitemap: https://bloomcoretech.com/sitemap.xml
```

No custom 404 route exists in production beyond Next.js's default `not-found.tsx`.

---

## 2. Colour census (rendered)

Strongly saturated colours detected in the rendered document, by route (1440×900). Every one is a chromatic accent the brief removes.

| Colour | Token | Where it appears |
|---|---|---|
| `rgb(12, 59, 48)` | `--accent` (forest) | Header brand lockup, mobile nav panel, hero stage background, MaaCash panel, process card 1, contact/CTA panels, footer brand panel |
| `rgb(26, 20, 8)` | `--gold-contrast` | Text on gold panels |
| `rgb(198, 154, 62)` | `--gold` (brass) | Status pills, "Start a project" panels, evidence panel, process card 2, footer project panel, active-tab pills, focus accent |
| `rgb(243, 230, 198)` | `--gold-soft` | SchemeKnit "3 of 36 planned" pill, product tab status pills |
| `rgb(21, 23, 15)` | olive | `/work`, `/about` process surfaces |
| `rgb(17, 21, 18)` | near-black | Text colour (neutral, retained) |

Neutral surfaces currently in use: `rgb(255,253,248)` (`--surface`), `rgb(244,241,233)` (`--background`), `rgb(235,230,219)` (`--surface-2`), `rgb(238,233,222)` (`--muted`), `rgb(223,217,204)` (`--surface-3`), `rgb(86,93,87)` (product accent grey). These are warm-tinted and drift, but are grayscale-adjacent.

Present in every route: the forest header logo tile, the gold footer "Start a project" panel, the gold focus ring accents.

---

## 3. Typography census (rendered)

- Two families only: **Inter** (sans, interface) and **Source Serif 4** (display).
- Homepage: 15 serif headings ≥ 30px, maximum 107px (`.display` on the hero).
- Other pages: maximum serif 86px (`/products`, `/services`), mostly 58px.

Finding: the display serif is applied to *every* major section heading at very large sizes. On `/services` and `/about` this produces multi-line editorial headlines ("Seven areas / of work", "How an engagement / runs") that read as a magazine, not a software company. Section rhythm is dominated by oversized serif rather than structure.

---

## 4. Route-by-route audit

Legend — **VQ** visual quality, **CC** colour consistency, **LY** layout, **IX** interactions, **PB** problems.

### `/` — Homepage
| Field | Finding |
|---|---|
| VQ | Hero is strong and is being preserved. Everything below it is inconsistent: mint SchemeKnit article, forest MaaCash card, plain TillProof card, four process cards in forest/brass/dark/muted, oversized gold evidence panel. |
| CC | Four competing accents (forest, brass, mint, olive). Section backgrounds alternate cream/ivory/tan rather than a deliberate light-dark system. |
| LY | Section paddings inconsistent; the evidence panel and footer project panel both shout with the same gold, so neither leads. |
| IX | Hero carousel, tabs, product links and quick-enquiry form all functional. |
| PB | Coloured product panels; coloured process cards; oversized gold evidence panel; gold footer panels; **horizontal overflow at 375px**. |

### `/products` — Product directory
| Field | Finding |
|---|---|
| VQ | Three large product blocks each with a different background (mint, ivory, forest) — reads as three unrelated templates. |
| CC | mint + forest + forest-deep + brass in one page. |
| LY | Product blocks are letterboxed and identical in structure despite different colour, so the colour is the only differentiator — exactly what the brief forbids. |
| IX | Product detail links and "Enquire" links work; product fragments are static decorative crops. |
| PB | Gold "Need something outside the catalogue?" panel; oversized footer logo panel; gold footer CTA panel. |

### `/products/schemeknit`, `/products/maacash`, `/products/tillproof`
| Field | Finding |
|---|---|
| VQ | Consistent shell (`ProductPageShell`) but each inherits the accent/gold palette. TillProof renders a fully dark forest page. |
| CC | Forest headings, gold status badges, mint fragment headers. |
| LY | Long page, several full-width panels with no tonal differentiation between "product fact" and "marketing claim". |
| IX | Outbound application links carry `data-analytics` correctly; product fragments are non-interactive mockups. |
| PB | Valuation colour per product; TillProof page is dark-forest, which will need a neutral dark treatment. |

### `/services`
| Field | Finding |
|---|---|
| VQ | Seven services presented as a scored table of Problem / Solution / Benefits. Honest content, weak composition — reads as a text directory in a wide column. |
| CC | Forest "How an engagement runs" band, tan "What we need to start" band, gold footer panel. |
| LY | Body copy lines run very wide at 1440px (multi-sentence paragraphs in 3-column table cells). |
| IX | "Email a project description" and "All contact details" links work. |
| PB | Directory feel; wide measure; three competing section backgrounds. |

### `/work`
| Field | Finding |
|---|---|
| VQ | Portfolio of the three products; honest, no invented logos. Composition is flat — repeated equal panels. |
| CC | Forest + brass + olive surfaces. |
| LY | Panels stack without a hierarchy of "headline evidence" vs "detail". |
| IX | Links to each product page work. |
| PB | Colour; flat hierarchy; oversized footer logo + gold CTA panel. |

### `/about`
| Field | Finding |
|---|---|
| VQ | Long editorial page, several oversized serif statements. |
| CC | Forest + brass + olive. |
| LY | 5231px tall at 1440px; repeated large headings with little structural variation. |
| IX | Internal links work. |
| PB | Oversized serif everywhere; colour; length without rhythm. |

### `/founder`
| Field | Finding |
|---|---|
| VQ | Genuine founder photograph and biography. Text-heavy. |
| CC | Forest headings, gold accents. |
| LY | Image-to-text balance shifts by section; portrait treatment inconsistent with the homepage founder block. |
| IX | Links work. |
| PB | Colour; typographic excess. |

### `/resources` and the three article routes
| Field | Finding |
|---|---|
| VQ | Index is a plain list; articles are readable long-form with a serif heading. |
| CC | Forest + brass. |
| LY | Index at 1440px is only 2536px tall and feels thin; articles are 4500–4800px. |
| IX | Article links and "All resources" work. |
| PB | Index feels like a settings list, not a knowledge centre (no categories, no reading hierarchy beyond minutes); colour; **`/resources/mobile-money-business-recordkeeping` has horizontal overflow at 390px**. |

### `/contact`
| Field | Finding |
|---|---|
| VQ | **The contact form is real and functional** — it records the enquiry, stores it, and sends a confirmation to the sender (the lead-management backend is live). |
| CC | Forest "A real reply, not an auto-response" band; gold footer panel. |
| LY | Two-column form/sidebar works; field spacing is loose; the sidebar "Registered details" card is visually heavy for secondary information. |
| IX | Fields labelled, validation present, success and error states present, `0 / 5000 characters` counter live, privacy checkbox required. |
| PB | Colour; loose field rhythm; misleading impression that email is the only path. |

### `/privacy`
| Field | Finding |
|---|---|
| VQ | Long legal text, serif headings. |
| CC | Forest + brass. |
| PB | Colour; oversized headings for a legal document (headings should be restrained). |

### Global chrome (every route)
| Field | Finding |
|---|---|
| VQ | Sticky header with forest logo tile. Footer is a tile board: forest statement panel, two link panels, forest **oversized logo panel** (820px wide logo) and a **gold "Start a project" panel**. |
| CC | Forest + gold. |
| LY | The oversized logo panel dominates the footer and competes with the hero. |
| IX | Desktop dropdown, mobile nav with focus trap and Escape, theme toggle, back-to-top, analytics settings — all functional. Header/footer "Ask the assistant" buttons dispatch `OPEN_HELP_EVENT`. |
| PB | Oversized footer logo panel and gold project panel must go; **the floating chatbot launcher no longer exists** — assistant access moved to header/footer icons. |

---

## 5. Interaction audit (baseline)

Working and must not regress:

- Header desktop dropdown (hover + click + Escape), mobile drawer (focus trap, Escape, scroll lock).
- Theme toggle (light / dark / system).
- Analytics consent banner: allow / keep off / withdraw, with settings re-open from the footer.
- Contact form: validation, loading, success, error, character counter.
- Quick enquiry (homepage).
- Back to top.
- Hero 3D carousel: autoplay, prev/next, product tabs, drag, keyboard, hover/focus pause, tab-visibility pause, reduced-motion, WebGL fallback (`ProductPanel2D`), skeleton loader, `IntersectionObserver` frame suspension.
- SchemeKnit live demo (textarea → parse → indicator tabs → plan preview, reset).

Defects / inconsistencies found:

| Control | Problem |
|---|---|
| Floating chatbot launcher | **Missing.** Removed by the redesign; replaced by `AssistantTrigger` icons in header and footer. The original floating bottom-left mascot with the "We're here to help" nudge must be restored. |
| Theme toggle | Retained but the palette it toggles is chromatic. |
| Product fragments | Non-interactive mockups presented as product UI without an obvious "representative" label adjacent on every page. |
| Footer "Ask the assistant" | Sends an event to open a panel that is no longer visually anchored to a launcher. |

---

## 6. Responsive findings

- **Horizontal overflow at 375px on `/`** and **at 390px on `/resources/mobile-money-business-recordkeeping`**. Both must be fixed (no horizontal overflow permitted).
- The server returned intermittent `503` responses during capture (observed on `/resources/*`, `/founder`, `/privacy`, `/products` at some viewports). This is a production-host flake, not a markup defect; re-tested directly and pages return `200`.
- A handful of `page.goto` timeouts occurred on the first sweep at 1280/390/375. These are network timeouts, not missing routes — the second sweep and direct requests returned `200` for every route.
- Next.js prefetch requests (`?_rsc=…`) report `net::ERR_ABORTED`. This is normal Next.js behaviour and not a defect.
- Homepage body text contains a mojibake character around the "BloomCore Technologies · Akatsi, Ghana" line.

---

## 7. SEO baseline (pre-redesign)

Captured per route at 1440×900 into `docs/report-assets/monochrome-redesign-audit/seo-baseline.json`:

- `title`, `description`, `canonical`, `og:title`, `og:image`, `twitter:card`, `robots`, `html lang`.
- `h1`/`h2` text, JSON-LD `@type` list, image count, images missing `alt`, link count, empty link count, form count.
- Document height and horizontal-overflow flag.

Every route has a self-consistent canonical, an absolute title, a description, Open Graph and Twitter card metadata, and JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, plus page-specific types). All 15 routes are indexable. The favicon implementation is served from the Next.js App Router metadata files (`icon`/`apple-icon`/`manifest`) and must not be touched.

This file is the before-snapshot for the post-redesign comparison.

---

## 8. Chatbot baseline (Phase B preview)

- Original floating assistant: `src/components/HelpChat.tsx` at commit `64bd10c` (397 lines) — recovered to `%TEMP%\opencode\bloomcore-audit\HelpChat.original.tsx`.
- Introduced at `5b4df44` ("left-hand site assistant"). Unchanged through `64bd10c`.
- Reduced to 297 lines at `42cfe80` and 309 lines at `55246e9`; the floating launcher, mascot and nudge were removed and `AssistantTrigger.tsx` added.
- The knowledge base (`src/lib/assistant-kb.ts`) is **byte-identical** between `64bd10c` and `HEAD`, so the original answer engine (`answerQuestion`, `defaultChips`, `getEntry`) is intact and real.
- The original was not a third-party widget and made no network calls — it answers from the site's own content. This satisfies "no new paid provider, no hardcoded keys".

---

## 9. Corrections to apply

1. Replace the chromatic token layer with a black-and-white token layer (Phase C).
2. Remove every chromatic hardcoded value (`#0c3b30`, `#c69a3e`, `#f3e6c6`, `#e2ede7`, `#08251f`, `#565d57`, `#0a2f27`, `#29473c`, `#82d5b5`, `#5AC9A9`, `#0B5D4B`).
3. Redesign the homepage sections below the hero: company intro, products, SchemeKnit demo framing, services, process, evidence, founder, resources, contact.
4. Redesign the footer: remove the oversized logo panel and the gold project panel.
5. Restore the original floating chatbot launcher and panel in monochrome, keeping the real KB answers.
6. Restyle the consent banner to the monochrome system, keeping both choices equally prominent.
7. Fix both horizontal-overflow cases.
8. Restrain the display-serif scale so section headings read as a software company.
9. Preserve every SEO, favicon, analytics and infrastructure element listed in the brief.

---

## 10. Route-by-route summary table

| Route | VQ | CC | Layout | Interactions | Problems |
|---|---|---|---|---|---|
| `/` | Hero strong, lower sections weak | 4 competing accents | inconsistent rhythm; overflow @375 | all work | colour, oversized gold evidence, footer panels, overflow |
| `/products` | 3 unrelated templates | mint/forest/brass | identical structure, colour-only difference | links work | colour, gold panel |
| `/products/schemeknit` | consistent shell | forest/gold/mint | long, flat | outbound links OK | colour |
| `/products/maacash` | consistent shell | forest/gold | long, flat | outbound links OK | colour |
| `/products/tillproof` | fully dark forest page | forest/gold | long, flat | outbound links OK | colour, no dark-mode parity |
| `/services` | text directory | forest/tan/gold | wide measure | links work | composition, colour |
| `/resources` | thin index | forest/gold | low height | links work | list not knowledge centre, colour |
| `/resources/scheme-of-learning…` | readable | forest/gold | fine | links work | colour |
| `/resources/mobile-money…` | readable | forest/gold | **overflow @390** | links work | colour, overflow |
| `/resources/electrical-shop-stock-control` | readable | forest/gold | fine | links work | colour |
| `/work` | flat, equal panels | forest/brass/olive | weak hierarchy | links work | colour, hierarchy |
| `/about` | editorial, oversized serif | forest/brass/olive | repetitive | links work | type scale, colour |
| `/founder` | genuine, text-heavy | forest/gold | balance shifts | links work | colour, balance |
| `/contact` | **form is real and live** | forest/gold | loose fields | full form works | colour, spacing |
| `/privacy` | legal text, oversized headings | forest/gold | fine | links work | colour, heading scale |
| Global chrome | sticky header fine; footer dominated by logo panel | forest/gold | footer competes with hero | nav/toggles work | **chatbot launcher missing**, footer panels |
