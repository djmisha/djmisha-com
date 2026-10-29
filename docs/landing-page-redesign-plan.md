# Landing Page Redesign — Execution Plan

Polishing the reusable page-section system introduced on `feat/reusable-page-components`,
then converting the long-form content pages (`dj-saxophone`, `wedding-dj-in-san-diego`,
and the other `services/*` pages) to use it.

**Guiding rule:** content stays byte-for-byte identical. We only change how it is laid out
and styled. Each step below should be a self-contained commit that builds (`npm run build`)
and passes formatting (`npm run format:check`) and tests (`npm test`).

---

## Phase 0 — Foundations

- [x] **0.1 — Add a `LandingLayout`**
  Wrap `BaseLayout` + `Navigation` + `Footer` + `bodyClass="landing"` so each converted page
  only declares its sections. Add an optional `noindex` prop.
  _Files:_ `src/layouts/LandingLayout.astro` (new)

- [x] **0.2 — `noindex` the design-guide demo page**
  It is intentionally absent from `src/pages/sitemap.xml.ts`; also add a robots `noindex` meta
  so it cannot be indexed. Use the `noindex` option from 0.1.
  _Files:_ `src/pages/design-guide/index.astro`

- [x] **0.3 — Section rhythm tokens**
  Add shared spacing + alternating-band variables to `public/css/site.css`
  (e.g. `--section-padding-y`, helpers for `--color-bg-primary` / `--color-bg-secondary` bands)
  so every section uses one consistent vertical rhythm instead of ad-hoc `4em` / `6em`.
  _Files:_ `public/css/site.css`

---

## Phase 1 — Fix verified bugs in existing components

These were confirmed by rendering the design-guide page in the browser.

- [x] **1.1 — TestimonialSlideshow theme colors**
  Replace hardcoded light-theme colors (`#333`, `#555`, `#999`, `#e0e0e0`) with theme vars
  (`--color-text`, `--color-text-muted`, `--color-border`). Text is currently near-invisible
  on the dark background.
  _Files:_ `src/components/TestimonialSlideshow.astro`

- [x] **1.2 — TestimonialSlideshow multi-instance init**
  Script uses `document.querySelector`, so only the first carousel on a page initializes.
  Loop over `querySelectorAll` (mirror the pattern in `FaqSection.astro`).
  _Files:_ `src/components/TestimonialSlideshow.astro`

- [x] **1.3 — Hero scroll-arrow target**
  Default `scrollTarget="#content"` points at an id that does not exist on landing pages
  (it lives in `PageLayout`). Add an optional `id` prop to sections, or scroll to the hero's
  next sibling.
  _Files:_ `src/components/HeroSection.astro`

- [x] **1.4 — Hero sizing overflow**
  `width: 100vw` includes the scrollbar and causes horizontal overflow; switch to `100%`.
  Prefer `100svh` over `100vh` so the mobile address bar does not shift the tagline.
  _Files:_ `src/components/HeroSection.astro`

- [x] **1.5 — FAQ border colors**
  Replace hardcoded `#e0e0e0` borders with `var(--color-border)`.
  _Files:_ `src/components/FaqSection.astro`

---

## Phase 2 — Polish existing components

- [x] **2.1 — `SectionHeading` component**
  Small uppercase eyebrow + title + accent rule (reuse the hero-divider motif). The FAQ and
  testimonial sections currently render with no heading; this ties the page together.
  _Files:_ `src/components/SectionHeading.astro` (new); use in `FaqSection`, `TestimonialSlideshow`

- [x] **2.2 — CenteredTextBlock readable measure**
  `max-width: 70em` (1120px) is too wide for prose. Cap text measure around `62ch`.
  _Files:_ `src/components/CenteredTextBlock.astro`

- [x] **2.3 — Hero typography & overlay**
  Fluid type `clamp(2.2rem, 5vw, 4rem)` for the tagline; bottom-weighted gradient overlay
  instead of flat `rgba(0,0,0,.65)`; wrap the bounce animation in `prefers-reduced-motion`.
  _Files:_ `src/components/HeroSection.astro`

- [ ] **2.4 — Hero LCP image (optional/stretch)**
  Render the background as an `<img>` with `object-fit: cover` to gain `srcset` + `fetchpriority`
  for the largest-contentful-paint element, instead of inline `background-image`.
  _Files:_ `src/components/HeroSection.astro`

- [x] **2.5 — FAQ open/close animation & active state**
  Animate height with the `grid-template-rows: 0fr → 1fr` trick (no JS measurement). Color the
  open question + `+` icon with accent pink so state is visible.
  _Files:_ `src/components/FaqSection.astro`, `src/components/FaqItem.astro`

- [x] **2.6 — Slideshow refinements**
  `loop: true`; enlarge dot tap targets to ~44px (pad button, keep dot visual); set slide
  min-height so the page does not jump between short/long reviews; pull star ratings from
  `reviews.json`.
  _Files:_ `src/components/TestimonialSlideshow.astro`

---

## Phase 2b — Hero / nav / intro refinements (owner feedback)

- [x] **2b.1 — Flip & tighten the hero**
  The H1 was massive on desktop. New hierarchy: the promotional quote (the best line) is the
  LARGE text on top; the `<h1>` is rendered SMALLER beneath it (kept as a real `<h1>` for SEO).
  Slots renamed to `headline` (big) + `title` (the h1). Desktop sizes tightened
  (`clamp(1.75rem,3.4vw,2.75rem)` headline, `clamp(.95rem,1.5vw,1.2rem)` uppercase title).
  _Files:_ `src/components/HeroSection.astro`

- [x] **2b.2 — Hero scroll cue is a real anchor**
  Replaced the JS button with an `<a href={scrollTarget}>` (e.g. `#intro`) that anchors to the
  next section. Added `scroll-behavior: smooth` on `html` (disabled under reduced-motion).
  _Files:_ `src/components/HeroSection.astro`, `public/css/site.css`

- [x] **2b.3 — SectionNav: not sticky, scrolls sideways**
  Default `sticky=false`. The pill row is `flex-wrap: nowrap; overflow-x: auto`, so long
  SEO-rich anchor labels scroll horizontally instead of wrapping. Placed AFTER the intro on the
  page so it can be scrolled past.
  _Files:_ `src/components/SectionNav.astro` (+ page ordering)

- [x] **2b.4 — Intro: wider + left-aligned**
  Added `align` prop to CenteredTextBlock; `align="left"` gives a wider (`52rem`) left-aligned
  measure for a better-organized intro. Default stays centered for back-compat.
  _Files:_ `src/components/CenteredTextBlock.astro`

- [x] **2b.5 — Pricing caption wording (standardize to existing)**
  Decision: caption stays a per-page prop and uses each page's EXISTING wording — do not coin
  new "starting" copy. Design-guide (wedding sample) uses "Average wedding rate" to match the
  page's existing "On average you can expect to pay about $2500" body, which is kept verbatim.
  _Files:_ `src/components/PricingCallout.astro` (+ per page)

---

## Phase 3 — New section components

Build in priority order. Each is content-agnostic and reused across pages.

- [x] **3.1 — `CtaBanner`**
  Full-width accent band with a button to `/contact/`. Important because landing pages lose the
  booking sidebar that `PageLayout` provided.

- [x] **3.2 — `FeatureGrid`**
  3-up cards (icon + title + text). For "Why Choose DJ Misha".

- [x] **3.3 — `TimelineSection`**
  Vertical timeline with accent markers. For the wedding "Timeline of Your Wedding Day Music"
  (Ceremony / Cocktail Hour / Dinner & Toasts / Dancing).

- [x] **3.4 — `ChecklistSection`**
  Two-column list with check icons. For service-package and "DJ services also include" lists.

- [x] **3.5 — `PricingCallout`**
  Accent-band highlight with the price as the focal stat. For the $2,500 / $2,000 / $4,000 lines.

- [x] **3.6 — `ImageTextSplit`**
  Alternating 50/50 image-and-text bands. Replaces the WordPress floated `alignright` images on
  the dj-saxophone page.

- [x] **3.7 — `VideoSection`**
  Full-width band with a click-to-load YouTube facade (the current iframe loads eagerly).

- [x] **3.8 — `HighlightPanel`**
  Styled card for the "What does a DJ do?" featured-snippet block.

- [x] **3.9 — `SectionNav`**
  Horizontal anchor pills (optionally sticky under the nav). Replaces the bare `<ul>` table of
  contents on the wedding page.

---

## Phase 3b — Progressive disclosure (condensed view + full original SEO copy)

**Goal:** show a NEW condensed view by default, while keeping ALL original long-form SEO copy
in the page — present in the server-rendered HTML at load (so search engines read it without any
interaction) and revealable by the visitor with a button.

**SEO is safe — verified.** Google crawls and indexes content that is in the server-rendered
HTML even when it is CSS-hidden (`display:none`, `[hidden]`, collapsed `<details>`,
`grid-template-rows:0`). The ONLY content invisible to Googlebot is content that is *fetched/
injected by JS in response to a click* — Googlebot never clicks. So as long as both the condensed
and full copy ship in the static HTML (no fetch), the full original copy is fully crawlable on
load. (Sources: Mueller 2020 / Illyes 2016 "full weight" statements; Google SEO Office Hours;
2024–2026 collapsible-content best-practice write-ups.) Practical nuance: visible-by-default is
still safest for the *primary* keyword target, so keep H1, intro, section H2s, and the FAQ always
visible and reserve disclosure for *supporting* detail only.

- [x] **3b.1 — `Disclosure.astro` primitive**
  One shared, accessible disclosure used by FeatureGrid (swap) and TimelineItem (additive).
  - Slots: `summary` (always visible) + `details` (collapsed by default, ALWAYS in the HTML).
  - Props: `mode: 'swap' | 'additive'`, `showLabel`, `hideLabel`, optional `id` (for
    `aria-controls`).
  - Mechanism: reuse FaqSection's exact technique — a real `<button>` with `aria-expanded`,
    `grid-template-rows: 0fr → 1fr` + `visibility` on an inner `overflow:hidden` wrapper, and the
    `prefers-reduced-motion` guard. Do NOT use `display:none`/`<details>`/`content-visibility` for
    the SEO-critical details region (keeps nodes in the box model, the gentlest hide).
  - **`data-js` gate (key):** default state = EXPANDED. A tiny inline head script sets `html.js`;
    CSS only collapses under `html.js`. With JS off (and pre-paint), everything is visible and the
    (useless) toggle button is hidden → nothing is ever hidden without JS, no content lost. The
    `html.js` flag set in `<head>` prevents a flash-of-expanded-content.
  - `swap` mode hides the summary (`display:none`) when open so the a11y tree has one pane at a
    time; `additive` keeps the summary and appends details below.
  _Files:_ `src/components/Disclosure.astro` (new), `src/layouts/BaseLayout.astro` (inline
  `html.js` script), `public/css/site.css` (`.visually-hidden` utility)

- [x] **3b.2 — FeatureGrid swap mode**
  Add `disclosable?: boolean` + `showLabel`/`hideLabel` + a new `full` named slot. When
  disclosable: condensed `FeatureCard`s go in Disclosure's `summary`, the original `h3 + p` prose
  goes in `full` → `details`, `mode='swap'`, one section-level "See longer explanations" button.
  Add `headingless?: boolean` to `FeatureCard` so condensed titles render as `<p>` (not `<h3>`),
  leaving the original `<h3>`s as the single canonical heading set. Existing usages (other pages,
  design-guide) are untouched — props are off by default.
  _Files:_ `src/components/FeatureGrid.astro`, `src/components/FeatureCard.astro`

- [x] **3b.3 — TimelineItem additive mode**
  Add a `details` named slot to `TimelineItem`. Overview stays in the default slot (always
  visible); the original longer paragraphs + `<ul>` lists go in `details`. **Decision needed:**
  one section-level "See more details" button that expands every phase at once (matches the
  owner's wording) vs. a per-item button on each phase. Default plan: **single section-level
  toggle** on `TimelineSection` (`expandable` prop). Items without a `details` slot are unchanged.
  _Files:_ `src/components/TimelineSection.astro`, `src/components/TimelineItem.astro`

- [x] **3b.4 — Demonstrate on design-guide**
  Wire the disclosable FeatureGrid + expandable Timeline into the design-guide gallery with the
  short + long copy both present; verify in browser (open/closed, no-JS = everything visible, no
  overflow) and View-Source the full prose to confirm it ships in static HTML.

- [ ] **3b.5 — Back-port `data-js` gate to FaqSection** (follow-up)
  FaqSection answers are currently unreachable with JS off. Apply the same gate so the whole site
  degrades consistently. Lower priority; do after 3b.1 lands.

---

## Phase 4 — Convert content pages (1:1 content migration)

**Migration contract:** the original copy is preserved byte-for-byte. New condensed copy is
*added* alongside it (in the `summary`/card slots); the originals live verbatim in the `full`/
`details` slots so they ship in the HTML and stay crawlable. No original sentence is deleted or
reworded. For each page: swap `PageLayout` → `LandingLayout`, move the page `<h1>` into the hero
`title` slot, map blocks to sections, keep the in-page anchor ids the TOC/SectionNav point to,
preserve the `jsonLd` prop, verify in browser, then `npm run build`.

- [ ] **4.1 — `services/wedding-dj-in-san-diego/index.astro`** (do FIRST — richest page, exercises
  every new pattern)
  - `<h1>` "Wedding DJ in San Diego" → hero `title`; "The Perfect Soundtrack…" → hero `headline`.
  - Intro paragraphs → `CenteredTextBlock align="left"` (id `#intro`).
  - TOC `<ul>` (lines ~101–109) → `SectionNav` (non-sticky, after intro) with the existing anchor
    targets (`#why-dj-misha`, `#timeline`, `#package`, `#cost`, `#faq`, …).
  - "Why Choose DJ Misha" (h2 + intro + figure kept) → **disclosable FeatureGrid (swap)**: 3 NEW
    short cards in `summary`; the original three `h3 + p` blocks verbatim in `full`. Keep
    `id="why-dj-misha"`.
  - "Timeline of Your Wedding Day Music" → **expandable TimelineSection (additive)**: one
    `TimelineItem` per phase (Ceremony / Cocktail Hour / Dinner & Toasts / Dancing). New one-line
    overview in the default slot; the original `p` + `<ul class="wp-block-list">` per phase verbatim
    in `details`. Keep `id="timeline"`.
  - "Wedding DJ Service Package" `<ul>` → `ChecklistSection` (id `#package`).
  - "Cost of Our DJ Services" → `PricingCallout` (id `#cost`) — confirm caption wording vs. the
    page's "average" language.
  - Testimonials → keep as restyled pull-quotes / one slideshow band.
  - FAQ → `FaqSection` accordion (stays always-visible; still feeds `FAQPage` JSON-LD).
  - "Hire the Best DJ" closer → `CtaBanner`.
  - NEW condensed card/overview copy must be authored & owner-approved (see open decisions).

- [ ] **4.2 — `dj-saxophone/index.astro`**
  - Hero (`<h1>` "DJ and Saxophone" → `title`) + intro.
  - Paragraph/image blocks → `ImageTextSplit` (replaces floated `alignright` images).
  - "What does a DJ do?" featured snippet → `HighlightPanel` (optionally disclosable later).
  - "DJ services also include" `<ul>` → `ChecklistSection`.
  - YouTube embed → `VideoSection` (click-to-load facade).
  - Prices ($2,000 / $4,000) → `PricingCallout`.
  - Three `Testimonial` quotes interleaved as pull-quotes; slideshow band near the end.
  - FAQ → `FaqSection`.

- [ ] **4.3 — Remaining `services/*` pages**
  `corporate-event-dj-in-san-diego`, `party-birthday-dj-in-san-diego`, `destination-wedding-dj`
  — same section mapping. These don't use the new disclosure props unless they have long blocks.

---

## Open decisions (need owner input)

- **Timeline toggle granularity:** single "See more details" button that expands all phases
  (matches your wording, current default) vs. a per-phase button. → defaulting to single.
- **Condensed copy authorship:** the short FeatureCard + timeline-overview text is NET-NEW copy.
  Who writes/approves it so it stays consistent with the preserved originals? (I can draft, you
  approve.)
- **Pricing caption per page:** "Starting wedding rate" fits saxophone's "starting at" language;
  the wedding page currently says "average ~$2500". Keep page-accurate wording at migration.

---

## Phase 5 — Structural cleanup

- [ ] **5.1 — Single-source FAQ data**
  Both pages maintain FAQ content twice (visible HTML + `FAQPage` JSON-LD). Define a `faqs` array
  in frontmatter and feed both `buildJsonLd` and the `FaqItem` loop from it, so the accordion and
  schema cannot drift.
  _Files:_ each converted page; possibly a shared helper

- [ ] **5.2 — Final pass**
  Cross-browser/responsive check (`preview_resize`), `prefers-reduced-motion` audit, Lighthouse
  spot-check on a converted page, update `AGENTS.md` if new component conventions were introduced.

---

## Verification checklist (run per step)

```bash
npm run build         # must pass
npm run format:check  # must pass
npm test              # must pass
```

Plus a browser spot-check via the preview server for any visual change.
