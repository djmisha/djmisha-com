# DJ Misha — Premium Rebrand Implementation Plan

**Site:** djmisha.com 
**Goal:** Reposition as a premium, high-end DJ for corporate events, weddings, and private events 
**Theme:** Obsidian & Gold (dark primary) 
**Scope:** Visual theming only — no written content changes in this phase

> **Note to implementing LLM:** This document is a sequential implementation guide. Complete each phase fully before moving to the next. Color values, font names, and CSS variable names are exact — use them verbatim. Do not substitute values. The site is built on an HTML5 UP template; apply changes to the existing CSS/SCSS files unless instructed otherwise.

-----

## Table of Contents

1. [Phase 1 — CSS Custom Properties (Design Tokens)](#phase-1)
1. [Phase 2 — Typography](#phase-2)
1. [Phase 3 — Backgrounds & Surfaces](#phase-3)
1. [Phase 4 — Text Colors](#phase-4)
1. [Phase 5 — Buttons & CTAs](#phase-5)
1. [Phase 6 — Navigation](#phase-6)
1. [Phase 7 — Section Dividers & Decorative Details](#phase-7)
1. [Phase 8 — Cards & Service Blocks](#phase-8)
1. [Phase 9 — Testimonials](#phase-9)
1. [Phase 10 — Stats & Credibility Blocks](#phase-10)
1. [Phase 11 — Spacing & Breathing Room](#phase-11)
1. [Phase 12 — Footer](#phase-12)
1. [Phase 13 — Voice & Copy (Reserved for Future Phase)](#phase-13)

-----

## Phase 1 — CSS Custom Properties (Design Tokens) {#phase-1}

**What:** Establish the entire design token system as CSS custom properties on `:root`. All subsequent phases reference these variables — never hardcode a color or font value outside of this block.

**Where:** Add to the top of the main stylesheet (e.g., `main.css`, `style.css`, or equivalent). If the template uses SCSS variables, mirror these as both SCSS variables and CSS custom properties.

### Implementation

Add the following `:root` block at the very top of the CSS file, before any other rules:

```css
:root {

 /* ─── BACKGROUND SCALE ──────────────────────────────── */
 --bg-primary: #0A0A0A; /* Deepest background — body, outer wrapper */
 --bg-secondary: #111111; /* One step up — alternating sections */
 --bg-tertiary: #161616; /* Three-layer depth — hover states, inset areas */
 --bg-card: #131313; /* Cards, panels, service blocks */
 --bg-overlay: rgba(10, 10, 10, 0.82); /* Overlay on hero images */

 /* ─── GOLD ACCENT SCALE ─────────────────────────────── */
 --gold: #C9A96E; /* Primary brand accent — borders, icons, highlights */
 --gold-light: #E8C98A; /* Hover state of gold elements */
 --gold-dark: #9A7B44; /* Active/pressed state; gradient endpoints */
 --gold-champagne:#F2E6C8; /* Very light gold — used sparingly for hero text accents */

 /* ─── TEXT COLORS ───────────────────────────────────── */
 --text-primary: #F5F0E8; /* Main body text, headlines */
 --text-secondary:#A89880; /* Supporting text, descriptions, subheadings */
 --text-muted: #5A5248; /* Captions, metadata, placeholders, disabled states */
 --text-accent: #C9A96E; /* Gold text — section labels, links, callouts */

 /* ─── BORDERS & DIVIDERS ────────────────────────────── */
 --border: #2A2420; /* All standard borders — cards, inputs, dividers */
 --border-strong: #3D3530; /* Emphasized borders — active states, focus rings */

 /* ─── SHADOWS ───────────────────────────────────────── */
 --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
 --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.5);
 --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.6);
 --shadow-gold:0 0 24px rgba(201, 169, 110, 0.12); /* Subtle gold glow on hover */

 /* ─── TYPOGRAPHY ────────────────────────────────────── */
 --font-display: 'Cormorant Garamond', 'Georgia', serif;
 --font-body: 'Jost', 'Helvetica Neue', sans-serif;
 --font-accent: 'Playfair Display', 'Georgia', serif;

 /* ─── SPACING SCALE ─────────────────────────────────── */
 --space-xs: 4px;
 --space-sm: 8px;
 --space-md: 16px;
 --space-lg: 32px;
 --space-xl: 64px;
 --space-2xl: 120px;
 --space-3xl: 180px;

 /* ─── TRANSITIONS ───────────────────────────────────── */
 --transition-fast: 0.15s ease;
 --transition-base: 0.25s ease;
 --transition-slow: 0.4s ease;

 /* ─── BORDER RADIUS ─────────────────────────────────── */
 --radius-sm: 2px; /* Buttons — near-square for editorial luxury feel */
 --radius-md: 6px; /* Cards, panels */
 --radius-lg: 12px; /* Modals, large containers */
}
```

**Verification:** After adding, confirm no existing CSS rules are broken by searching for any hardcoded hex values (e.g., `#fff`, `#333`, `#007bff`) and flagging them for replacement in subsequent phases.

-----

## Phase 2 — Typography {#phase-2}

**What:** Replace all fonts with the three-font premium system. Typography is the single highest-impact visual change.

**Where:** `<head>` of every HTML page + stylesheet font-family declarations.

### Step 2.1 — Add Google Fonts

Add the following `<link>` tags inside the `<head>` of every HTML page, **before** the stylesheet link:

```html
<!-- DJ Misha Premium Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&family=Playfair+Display:ital,wght@1,400;1,500&display=swap" rel="stylesheet">
```

### Step 2.2 — Set Base Font

Replace the existing `body` font declaration with:

```css
body {
 font-family: var(--font-body);
 font-weight: 300;
 font-size: 15px;
 line-height: 1.75;
 color: var(--text-primary);
 background-color: var(--bg-primary);
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
}
```

### Step 2.3 — Headline / Display Font

Apply `--font-display` to all heading levels. Cormorant Garamond is elegant at light weights — **do not use bold**.

```css
h1, h2, h3, h4, h5, h6 {
 font-family: var(--font-display);
 font-weight: 400;
 line-height: 1.1;
 letter-spacing: -0.01em;
 color: var(--text-primary);
}

h1 {
 font-size: clamp(44px, 7vw, 88px);
 font-weight: 300;
 font-style: italic;
 letter-spacing: -0.02em;
 line-height: 1.0;
}

h2 {
 font-size: clamp(30px, 4vw, 52px);
 font-weight: 400;
 line-height: 1.1;
}

h3 {
 font-size: clamp(22px, 3vw, 34px);
 font-weight: 400;
}

h4 {
 font-size: 20px;
 font-weight: 400;
}
```

### Step 2.4 — Section Labels (Eyebrows)

Section labels are the small uppercase tracking text above headings (e.g., “Corporate Events”, “About DJ Misha”). These should be in `--font-body` with wide letter-spacing and gold color.

Identify all existing eyebrow/label elements (common class names: `.label`, `.eyebrow`, `.subtitle`, `.section-title`, `.overline`) and apply:

```css
.section-label,
.eyebrow,
.label,
[class*="overline"] {
 font-family: var(--font-body);
 font-size: 10px;
 font-weight: 500;
 letter-spacing: 0.22em;
 text-transform: uppercase;
 color: var(--text-accent);
 display: block;
 margin-bottom: 12px;
}
```

If the template does not have a dedicated class for these, add `class="section-label"` to any small descriptive text that appears directly above a heading.

### Step 2.5 — Body Text

```css
p {
 font-family: var(--font-body);
 font-weight: 300;
 font-size: 15px;
 line-height: 1.75;
 color: var(--text-secondary);
 max-width: 620px; /* Prevents overly long lines — critical for readability */
}
```

### Step 2.6 — Accent / Italic Callouts

The Playfair Display italic is used **sparingly** — testimonial quotes and decorative pull-quote moments only.

```css
.accent-italic,
blockquote p,
.testimonial-text {
 font-family: var(--font-accent);
 font-style: italic;
 font-weight: 400;
 font-size: clamp(17px, 2vw, 22px);
 line-height: 1.65;
 color: var(--text-primary);
}
```

### Step 2.7 — Navigation Font

```css
nav a,
.nav-link,
#nav a {
 font-family: var(--font-body);
 font-size: 11px;
 font-weight: 500;
 letter-spacing: 0.16em;
 text-transform: uppercase;
 color: var(--text-secondary);
 text-decoration: none;
 transition: color var(--transition-base);
}

nav a:hover,
.nav-link:hover,
#nav a:hover {
 color: var(--gold);
}
```

-----

## Phase 3 — Backgrounds & Surfaces {#phase-3}

**What:** Replace all background colors with the new dark palette. The goal is layered depth: every surface should be a slightly different shade of near-black, creating visual hierarchy without stark contrast.

### Step 3.1 — Body & Root Background

```css
html, body {
 background-color: var(--bg-primary); /* #0A0A0A */
}
```

### Step 3.2 — Alternating Sections

HTML5 UP templates typically alternate section backgrounds. Identify the even/odd section classes (commonly `.wrapper`, `.wrapper.style1`, `.wrapper.style2`, `.wrapper.alt`, etc.) and apply:

```css
/* Primary sections */
.wrapper,
section,
.section {
 background-color: var(--bg-primary);
}

/* Alternating sections — slightly lighter */
.wrapper.alt,
.wrapper.style2,
section:nth-child(even),
.section-alt {
 background-color: var(--bg-secondary); /* #111111 */
}

/* Inset / featured sections */
.wrapper.special,
.wrapper.style3,
.featured-section {
 background-color: var(--bg-tertiary); /* #161616 */
}
```

### Step 3.3 — Hero Section Background

The hero should use the darkest background with an optional overlay if there is a background image:

```css
#banner,
.hero,
#hero,
.banner {
 background-color: var(--bg-primary);
 position: relative;
}

/* If hero has a background image, add a dark overlay */
#banner::before,
.hero::before {
 content: '';
 position: absolute;
 inset: 0;
 background-color: var(--bg-overlay); /* rgba(10, 10, 10, 0.82) */
 z-index: 1;
}

#banner > *,
.hero > * {
 position: relative;
 z-index: 2;
}
```

### Step 3.4 — Subtle Noise Texture Overlay (Optional but Recommended)

Luxury sites often have a very subtle grain/noise texture. Add this to the body:

```css
body::before {
 content: '';
 position: fixed;
 inset: 0;
 pointer-events: none;
 z-index: 9999;
 opacity: 0.025;
 background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
 background-repeat: repeat;
 background-size: 128px;
}
```

-----

## Phase 4 — Text Colors {#phase-4}

**What:** Replace all existing text color values with the new warm-toned hierarchy.

### Step 4.1 — Global Text Color Map

Find and replace every hardcoded text color in the stylesheet. Use this mapping:

|Replace this (approximate) |With this variable |Hex |
|------------------------------------------------|-----------------------|---------|
|`color: #fff` / `color: white` |`var(--text-primary)` |`#F5F0E8`|
|`color: #000` / `color: #111` / `color: #222` |`var(--text-primary)` |`#F5F0E8`|
|`color: #333` / `color: #444` / `color: #555` |`var(--text-secondary)`|`#A89880`|
|`color: #666` / `color: #777` / `color: #888` |`var(--text-muted)` |`#5A5248`|
|Any accent/highlight color (blues, greens, etc.)|`var(--text-accent)` |`#C9A96E`|

### Step 4.2 — Link Colors

```css
a {
 color: var(--text-accent);
 text-decoration: none;
 transition: color var(--transition-base);
}

a:hover {
 color: var(--gold-light);
}

a:visited {
 color: var(--gold-dark);
}
```

### Step 4.3 — Strong / Bold Text

```css
strong, b {
 font-weight: 500;
 color: var(--text-primary);
}
```

-----

## Phase 5 — Buttons & CTAs {#phase-5}

**What:** Redesign all buttons. Replace any rounded, filled, or brightly colored buttons with the premium editorial style. Sharp corners and outline-first design signal luxury and confidence.

**Critical rule:** `border-radius` must be `var(--radius-sm)` (2px) or `0` on all buttons. No pill shapes. No large rounded corners.

### Step 5.1 — Remove All Existing Button Styles

Identify the existing button classes (commonly `.button`, `.btn`, `input[type="submit"]`, `input[type="button"]`). Strip all existing background colors, border-radius values, and font declarations from them entirely before applying the new styles below.

### Step 5.2 — Primary Button (Outline Gold)

This is the main CTA style. Used for primary actions like “Inquire About Your Event” and “Reserve Your Date.”

```css
.button,
.btn,
a.button,
input[type="submit"],
input[type="button"],
button[type="submit"] {
 display: inline-block;
 font-family: var(--font-body);
 font-size: 11px;
 font-weight: 500;
 letter-spacing: 0.18em;
 text-transform: uppercase;
 color: var(--gold);
 background: transparent;
 border: 1px solid var(--gold);
 padding: 16px 40px;
 border-radius: var(--radius-sm);
 cursor: pointer;
 text-decoration: none;
 transition: background var(--transition-base),
 color var(--transition-base),
 box-shadow var(--transition-base);
 white-space: nowrap;
}

.button:hover,
.btn:hover,
a.button:hover,
input[type="submit"]:hover,
button[type="submit"]:hover {
 background: var(--gold);
 color: #0A0A0A;
 box-shadow: var(--shadow-gold);
}
```

### Step 5.3 — Secondary Button (Ghost / Minimal)

Used for secondary actions like “Learn More” or “View Services.”

```css
.button.alt,
.button-secondary,
.btn-secondary {
 color: var(--text-secondary);
 border-color: var(--border);
 background: transparent;
}

.button.alt:hover,
.button-secondary:hover {
 color: var(--gold);
 border-color: var(--gold);
 background: transparent;
 box-shadow: none;
}
```

### Step 5.4 — Accent Button (Gold Fill — Use Sparingly)

Reserved for a single high-priority CTA per page, such as the contact/booking button in the hero.

```css
.button.primary,
.button-accent,
.btn-primary {
 background: var(--gold);
 border-color: var(--gold);
 color: #0A0A0A;
 font-weight: 600;
}

.button.primary:hover,
.button-accent:hover {
 background: var(--gold-light);
 border-color: var(--gold-light);
 box-shadow: var(--shadow-gold);
}
```

### Step 5.5 — Arrow / Text Link CTA

For inline “Learn More →” style links that don’t need a full button treatment:

```css
.text-cta,
.arrow-link {
 display: inline-flex;
 align-items: center;
 gap: 8px;
 font-family: var(--font-body);
 font-size: 12px;
 font-weight: 500;
 letter-spacing: 0.12em;
 text-transform: uppercase;
 color: var(--gold);
 text-decoration: none;
 transition: gap var(--transition-base), color var(--transition-base);
}

.text-cta:hover,
.arrow-link:hover {
 color: var(--gold-light);
 gap: 14px;
}
```

-----

## Phase 6 — Navigation {#phase-6}

**What:** Restyle the navigation bar to be minimal, dark, and refined.

### Step 6.1 — Nav Bar Container

```css
#header,
#nav,
.navbar,
header,
nav {
 background-color: rgba(10, 10, 10, 0.95);
 border-bottom: 1px solid var(--border);
 backdrop-filter: blur(12px);
 -webkit-backdrop-filter: blur(12px);
}
```

### Step 6.2 — Nav Logo / Brand Name

```css
#header .logo,
.nav-logo,
.site-title,
header .logo {
 font-family: var(--font-display);
 font-size: 22px;
 font-weight: 400;
 font-style: italic;
 color: var(--text-primary);
 letter-spacing: 0.02em;
 text-decoration: none;
}
```

### Step 6.3 — Nav Links

(Already covered in Phase 2.7 — confirm those styles are applied.)

### Step 6.4 — Active Nav Link

```css
nav a.active,
nav a[aria-current="page"],
#nav a.active {
 color: var(--gold);
 border-bottom: 1px solid var(--gold);
 padding-bottom: 2px;
}
```

### Step 6.5 — Mobile Nav Menu

```css
/* Hamburger icon lines */
.nav-toggle span,
.hamburger span,
[data-nav-toggle] span {
 background-color: var(--text-primary);
}

/* Mobile nav overlay */
.mobile-nav,
#nav-panel,
.nav-panel {
 background-color: var(--bg-secondary);
 border-left: 1px solid var(--border);
}
```

-----

## Phase 7 — Section Dividers & Decorative Details {#phase-7}

**What:** Replace generic horizontal rules and dividers with the gold gradient treatment. Add the ornamental divider style for use between section titles and body content.

### Step 7.1 — Replace All `<hr>` Tags

```css
hr {
 border: none;
 height: 1px;
 background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%);
 margin: var(--space-xl) auto;
 max-width: 480px;
 opacity: 0.6;
}
```

### Step 7.2 — Standard Section Border

For borders between sections that don’t use the gradient treatment:

```css
.section-border,
.divider {
 border: none;
 border-top: 1px solid var(--border);
 margin: var(--space-xl) 0;
}
```

### Step 7.3 — Ornamental Diamond Divider

Add this HTML element after major section headings where appropriate. The `·` pattern creates a refined pause:

```html
<div class="ornament-divider">
 <span></span>
 <span class="diamond">✦</span>
 <span></span>
</div>
```

```css
.ornament-divider {
 display: flex;
 align-items: center;
 gap: 16px;
 margin: 20px 0 32px;
 max-width: 240px;
}

.ornament-divider span:not(.diamond) {
 flex: 1;
 height: 1px;
 background: var(--border);
}

.ornament-divider .diamond {
 color: var(--gold);
 font-size: 8px;
 opacity: 0.8;
 flex: 0;
}
```

### Step 7.4 — Section Top Accent Line (Gold)

For cards and featured sections, a thin gold line at the top communicates premium tier. Add to any section or card that needs visual elevation:

```css
.gold-top-accent {
 position: relative;
}

.gold-top-accent::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 height: 2px;
 background: linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark));
}
```

-----

## Phase 8 — Cards & Service Blocks {#phase-8}

**What:** Restyle all cards, service boxes, and feature panels.

### Step 8.1 — Base Card Style

Apply to all existing card/panel/box elements (common classes: `.box`, `.card`, `.feature`, `.service-item`, `.panel`):

```css
.box,
.card,
.feature,
.service-item,
[class*="panel"] {
 background-color: var(--bg-card);
 border: 1px solid var(--border);
 border-radius: var(--radius-md);
 padding: var(--space-lg) var(--space-lg);
 transition: transform var(--transition-base),
 box-shadow var(--transition-base),
 border-color var(--transition-base);
}

.box:hover,
.card:hover,
.feature:hover,
.service-item:hover {
 transform: translateY(-3px);
 box-shadow: var(--shadow-md), var(--shadow-gold);
 border-color: var(--gold-dark);
}
```

### Step 8.2 — Card Heading

```css
.box h3,
.card h3,
.feature h3,
.service-item h3 {
 font-family: var(--font-display);
 font-size: 26px;
 font-weight: 400;
 color: var(--text-primary);
 margin-bottom: var(--space-md);
 line-height: 1.2;
}
```

### Step 8.3 — Card with Gold Top Accent

Add the `.gold-top-accent` class (defined in Phase 7.4) to the three main service cards (Weddings, Corporate Events, Private Events). Also add `overflow: hidden` to these cards so the top line renders cleanly:

```css
.service-item.gold-top-accent,
.box.gold-top-accent {
 overflow: hidden;
 padding-top: calc(var(--space-lg) + 2px); /* Compensate for the accent line */
}
```

-----

## Phase 9 — Testimonials {#phase-9}

**What:** Restyle testimonial blocks to feel editorial and credible.

### Step 9.1 — Testimonial Container

```css
.testimonial,
.review,
blockquote {
 position: relative;
 padding: var(--space-lg) var(--space-lg) var(--space-lg) var(--space-xl);
 background-color: var(--bg-card);
 border: 1px solid var(--border);
 border-radius: var(--radius-md);
}
```

### Step 9.2 — Opening Quote Mark

```css
.testimonial::before,
blockquote::before {
 content: '\201C'; /* " */
 font-family: var(--font-accent);
 font-size: 80px;
 line-height: 1;
 color: var(--gold);
 opacity: 0.25;
 position: absolute;
 top: 12px;
 left: 20px;
}
```

### Step 9.3 — Testimonial Text

```css
.testimonial p,
.testimonial-text,
blockquote p {
 font-family: var(--font-accent);
 font-style: italic;
 font-size: clamp(15px, 1.8vw, 18px);
 line-height: 1.7;
 color: var(--text-primary);
 margin-bottom: var(--space-md);
 max-width: none; /* Override the body p max-width */
}
```

### Step 9.4 — Attribution Line

```css
.testimonial cite,
.testimonial-attribution,
.testimonial footer,
blockquote cite {
 display: block;
 font-family: var(--font-body);
 font-style: normal;
 font-size: 11px;
 font-weight: 500;
 letter-spacing: 0.1em;
 text-transform: uppercase;
 color: var(--text-secondary);
 padding-top: var(--space-md);
 border-top: 1px solid var(--border);
}
```

-----

## Phase 10 — Stats & Credibility Blocks {#phase-10}

**What:** Style any numerical stat blocks (years of experience, number of events, notable client names). These should use the display font in gold for the number and muted uppercase for the label.

### Step 10.1 — Stat Container

```css
.stats,
.stat-row,
.achievements {
 display: flex;
 gap: var(--space-2xl);
 flex-wrap: wrap;
 align-items: flex-start;
 padding: var(--space-xl) 0;
 border-top: 1px solid var(--border);
 border-bottom: 1px solid var(--border);
}
```

### Step 10.2 — Individual Stat

```css
.stat,
.stat-item {
 text-align: center;
 flex: 0 0 auto;
}

.stat-number,
.stat .number {
 font-family: var(--font-display);
 font-size: clamp(36px, 5vw, 56px);
 font-weight: 300;
 color: var(--gold);
 letter-spacing: -0.02em;
 line-height: 1;
 display: block;
 margin-bottom: 8px;
}

.stat-label,
.stat .label {
 font-family: var(--font-body);
 font-size: 10px;
 font-weight: 500;
 letter-spacing: 0.16em;
 text-transform: uppercase;
 color: var(--text-muted);
 display: block;
}
```

### Step 10.3 — Client Logo Strip

If client logos exist (Intel, KPMG, Banana Republic), style their container:

```css
.client-logos,
.brand-logos,
.logo-strip {
 display: flex;
 gap: var(--space-xl);
 align-items: center;
 flex-wrap: wrap;
 opacity: 0.45; /* Muted by default */
 filter: grayscale(100%) brightness(3); /* White-ify logos for dark bg */
 transition: opacity var(--transition-slow);
}

.client-logos:hover {
 opacity: 0.7;
}

.client-logos img,
.logo-strip img {
 height: 28px;
 width: auto;
 object-fit: contain;
}
```

-----

## Phase 11 — Spacing & Breathing Room {#phase-11}

**What:** Luxury sites breathe. Generous whitespace is a price signal. Increase all section padding significantly from the template defaults.

### Step 11.1 — Section Padding

Identify the padding on all major `section`, `.wrapper`, and `.container` elements and replace with:

```css
section,
.wrapper,
.section {
 padding-top: var(--space-2xl); /* 120px */
 padding-bottom: var(--space-2xl); /* 120px */
}

/* Hero gets even more room */
#banner,
.hero,
.banner-section {
 padding-top: var(--space-3xl); /* 180px */
 padding-bottom: var(--space-3xl); /* 180px */
 min-height: 90vh;
 display: flex;
 align-items: center;
}

/* Reduced padding on mobile */
@media (max-width: 768px) {
 section,
 .wrapper,
 .section {
 padding-top: var(--space-xl); /* 64px */
 padding-bottom: var(--space-xl); /* 64px */
 }

 #banner,
 .hero {
 padding-top: var(--space-2xl); /* 120px */
 padding-bottom: var(--space-2xl);
 min-height: 80vh;
 }
}
```

### Step 11.2 — Container Max Width

```css
.container,
.inner,
#wrapper > .container {
 max-width: 1160px;
 margin-left: auto;
 margin-right: auto;
 padding-left: var(--space-xl); /* 64px */
 padding-right: var(--space-xl);

 @media (max-width: 768px) {
 padding-left: var(--space-lg); /* 32px */
 padding-right: var(--space-lg);
 }
}
```

### Step 11.3 — Inter-Element Spacing

```css
/* Space after every h2 heading */
h2 + p,
h2 + .section-body {
 margin-top: var(--space-lg); /* 32px */
}

/* Space between cards in a grid */
.features > *,
.services > *,
.grid > * {
 margin-bottom: var(--space-lg);
}

/* Heading margin */
h1, h2, h3 {
 margin-bottom: var(--space-md);
}

/* Paragraph spacing */
p + p {
 margin-top: var(--space-md);
}
```

-----

## Phase 12 — Footer {#phase-12}

**What:** The footer should feel like the quiet, confident close of a premium brand experience.

```css
#footer,
footer,
.site-footer {
 background-color: var(--bg-primary);
 border-top: 1px solid var(--border);
 padding-top: var(--space-2xl);
 padding-bottom: var(--space-xl);
}

/* Footer heading */
#footer h3,
footer h3,
.footer-heading {
 font-family: var(--font-display);
 font-size: 22px;
 font-weight: 400;
 color: var(--text-primary);
 margin-bottom: var(--space-md);
}

/* Footer body text */
#footer p,
footer p,
.footer-text {
 font-size: 13px;
 color: var(--text-muted);
 line-height: 1.7;
}

/* Footer links */
#footer a,
footer a,
.footer-link {
 font-family: var(--font-body);
 font-size: 12px;
 color: var(--text-muted);
 text-decoration: none;
 letter-spacing: 0.06em;
 transition: color var(--transition-base);
}

#footer a:hover,
footer a:hover {
 color: var(--gold);
}

/* Copyright / bottom bar */
.footer-bottom,
#footer .copyright {
 margin-top: var(--space-xl);
 padding-top: var(--space-lg);
 border-top: 1px solid var(--border);
 font-size: 11px;
 color: var(--text-muted);
 letter-spacing: 0.08em;
 font-family: var(--font-body);
}

/* Footer gold rule at top */
#footer::before,
.site-footer::before {
 content: '';
 display: block;
 height: 1px;
 background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%);
 opacity: 0.4;
 margin-bottom: var(--space-2xl);
}
```

-----

## Phase 13 — Voice & Copy (Reserved for Future Phase) {#phase-13}

> ** This section is NOT part of the current implementation.** No written content should be changed during the visual theming phase. This section documents the voice and copy direction for a future content revision pass.

-----

### 13.1 — Tone Principles

The copy voice should match the visual identity: confident, understated, and refined. Think of how a luxury hotel, high-end event venue, or premium fashion house communicates — never loud, never casual, never generic.

**The four pillars of the voice:**

**Confident, not boastful.** State facts and credentials plainly. Let the resume speak. Avoid superlatives like “best,” “top-rated,” or “unmatched” — replace with specifics (client names, venue names, years of experience).

**Warm, not casual.** The tone is welcoming and personal without being chatty or using slang. No exclamation points in headlines. No emoji in any UI text, buttons, or CTAs.

**Specific, not generic.** Name drop intentionally. “Performed at the W Hotel main stage,” “corporate clients including Intel and KPMG,” “destination weddings at Estancia La Jolla” — these details establish tier far more effectively than adjectives.

**Action-oriented.** Every page should end with a clear, dignified next step. Not “Let’s party!” — but “Inquire About Your Event” or “Reserve Your Date.”

-----

### 13.2 — CTA Copy Replacements (Do Not Implement Yet)

|Current Copy |Premium Replacement |
|----------------------------------------------------------|-------------------------------------------------------------|
|“Let’s Party! ” |“Inquire About Your Event” |
|“Book DJ Misha” |“Reserve Your Date” |
|“Best DJ in San Diego” |“San Diego’s Premier Event Experience” |
|“Top-of-the-line DJ and sound equipment” |“Concert-grade audio. Curated music. Seamless execution.” |
|“Planning a private party? Look no further than DJ Misha!”|“Crafted for the occasion. Flawless from first note to last.”|
|“Get fast response. Let’s Party!” |“Inquire About Your Event” |
|“Look no further” |Remove — replace with specific value statement |

-----

### 13.3 — Page-Level Copy Direction (Do Not Implement Yet)

**Homepage Hero:** 
Lead with an italic serif headline that names what DJ Misha is, not what he does. Example direction: *“San Diego’s Premier Event Experience”* followed by a one-line qualifier naming two or three event types.

**Services Page:** 
Each service (Weddings, Corporate, Private) should open with a one-line evocative statement, followed by three or four specific details (not bulleted — written as short declarative sentences).

**About Page:** 
Reframe the bio to lead with positioning, not origin story. Open with what makes him unique (pioneer of DJ + saxophone, 15+ years, specific notable clients), then move to backstory.

**Contact Page:** 
Heading should be dignified: “Reserve Your Date” or “Begin the Conversation.” Remove any casual urgency language. The form itself needs no copy changes in this phase.

-----

### 13.4 — Words to Avoid / Embrace (Do Not Implement Yet)

**Avoid:**

- “Best,” “top-rated,” “unmatched,” “amazing,” “incredible” (without specifics)
- “Look no further”
- Exclamation points in headings or CTAs
- Emoji in any UI context
- “Let’s party,” “rocking,” “spinning” (in formal contexts — fine in bio)
- “Top-of-the-line” (generic)

**Embrace:**

- “Curated,” “bespoke,” “considered,” “seamless,” “crafted”
- Specific venue names, client names, event types
- “Reserve,” “inquire,” “engage,” “experience”
- Understated confidence: “DJ Misha has performed for…” not “DJ Misha is the best…”
- Present tense action: “Every playlist is built around your vision.”

-----

*End of Implementation Plan* 
*Document version 1.0 — Theming Phase* 
*Content revision scheduled for Phase 2*