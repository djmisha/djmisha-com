---
name: DJ Misha
description: San Diego DJ for weddings, corporate events & parties — house, EDM & dance, with a signature live DJ+saxophone duo.
colors:
  midnight-indigo: "#1c1d26"
  indigo-panel: "#272833"
  indigo-shade: "#242634"
  backroom-black: "#181920"
  ghost-fill: "rgba(255, 255, 255, 0.075)"
  ghost-border: "rgba(255, 255, 255, 0.3)"
  afterglow-pink: "#ff2d8a"
  afterglow-pink-hover: "#ff57a3"
  afterglow-pink-active: "#e6196f"
  afterglow-pink-subtle: "rgba(255, 77, 166, 0.15)"
  late-set-blue: "#5480f1"
  backstage-green: "#39c088"
  marquee-gold: "#fbbf24"
  marquee-white: "#ffffff"
  dancefloor-white: "rgba(255, 255, 255, 0.75)"
  dancefloor-white-muted: "rgba(255, 255, 255, 0.5)"
typography:
  display:
    fontFamily: "Poppins, Helvetica, sans-serif"
    fontSize: "2.5em"
    fontWeight: 300
    lineHeight: 1
  headline:
    fontFamily: "Poppins, Helvetica, sans-serif"
    fontSize: "2em"
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, Helvetica, sans-serif"
    fontSize: "1.35em"
    fontWeight: 300
    lineHeight: 1.5
  body:
    fontFamily: "Poppins, Helvetica, sans-serif"
    fontSize: "15pt"
    fontWeight: 100
    lineHeight: 1.75
  label:
    fontFamily: "Poppins, Helvetica, sans-serif"
    fontSize: "0.8em"
    fontWeight: 300
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  pill: "2em"
  circle: "50%"
spacing:
  xs: "0.5em"
  sm: "1em"
  md: "1.5em"
  lg: "2em"
  section: "6em"
components:
  button-primary:
    backgroundColor: "{colors.afterglow-pink}"
    textColor: "{colors.marquee-white}"
    rounded: "{rounded.none}"
    padding: "0 2.25em"
    height: "3em"
  button-primary-hover:
    backgroundColor: "{colors.afterglow-pink-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.marquee-white}"
    rounded: "{rounded.none}"
    padding: "0 2.25em"
    height: "3em"
  button-ghost-hover:
    textColor: "{colors.afterglow-pink}"
  pill-tag:
    backgroundColor: "{colors.ghost-fill}"
    textColor: "{colors.dancefloor-white}"
    rounded: "{rounded.pill}"
    padding: "0.5em 1.1em"
  pill-tag-active:
    backgroundColor: "{colors.afterglow-pink}"
    textColor: "{colors.marquee-white}"
  review-card:
    backgroundColor: "{colors.indigo-panel}"
    rounded: "{rounded.none}"
    padding: "1.5em"
  service-box:
    backgroundColor: "{colors.indigo-panel}"
    textColor: "{colors.dancefloor-white}"
    rounded: "{rounded.none}"
    padding: "2em"
---

# Design System: DJ Misha

## Overview

**Creative North Star: "The Afterhours Club"**

The site reads like a room after midnight: a near-black indigo field with a single neon color doing all the emotional work. Everything else — type, borders, panels — stays quiet and flat so that one accent, Afterglow Pink, can carry every cue that matters: here's the button, here's what's active, here's the thing worth noticing. The effect should feel confident and composed, not loud — this room has to work for a couple deciding on their wedding soundtrack and for a corporate planner quietly checking credentials, often in the same browsing session.

Flatness is deliberate, not an oversight: panels and buttons sit at 0px radius, bordered by a faint 1px ghost line rather than a shadow, so the interface feels like signage and glass rather than skeuomorphic UI chrome. Roundness is reserved entirely for things that are inherently round in life — a face in a circular portrait, a pulsing status dot, a wristband-shaped tag — never used as a general softening device.

**Key Characteristics:**
- Near-black indigo base, one neon accent, restrained everywhere else
- Flat by default (0px radius); circular/pill shapes only for inherently round content
- Ghost-bordered at rest, accent-bordered or lifted only on hover/active — depth is a response, not ambient decoration
- Poppins at a light/thin weight throughout — presence comes from weight and spacing, not boldness
- Must read as credible to a corporate vetter, not just exciting to a partygoer — energetic, never gaudy

## Colors

A near-black neutral field with exactly one saturated accent; two further hues exist only to differentiate homepage story chapters, never to compete with the primary accent.

### Primary
- **Afterglow Pink** (`#ff2d8a`): The only warm, saturated color in the system. Reserved for primary CTAs, active/selected states (active nav item, active keyword pill, focused form controls), hover feedback on ghost-bordered buttons, and the homepage's first spotlight chapter border. If something is pink, it is the thing the visitor should act on or notice.
  - **Hover** (`#ff57a3`) / **Active** (`#e6196f`): state progression on primary buttons.
  - **Subtle** (`rgba(255, 77, 166, 0.15)`): pressed-state wash behind ghost buttons; never used as a fill on its own.

### Secondary
- **Late Set Blue** (`#5480f1`): Border accent for the homepage's second "spotlight" story chapter only. Never used on an interactive element.

### Tertiary
- **Backstage Green** (`#39c088`): Border accent for the homepage's third "spotlight" story chapter only. Same restriction as Late Set Blue.

### Neutral
- **Midnight Indigo** (`#1c1d26`): Page background — the base of the room.
- **Indigo Panel** (`#272833`): Card and panel surfaces (review cards, service boxes) that sit one step up from the page.
- **Indigo Shade** (`#242634`): A darker panel variant for secondary surfaces.
- **Backroom Black** (`#181920`): The darkest surface — nav dropdown and mobile panel backgrounds.
- **Ghost Fill** (`rgba(255, 255, 255, 0.075)`) / **Ghost Border** (`rgba(255, 255, 255, 0.3)`): The default "unlit" treatment for buttons, pills, and dividers at rest.
- **Marquee White** (`#ffffff`): Headings and strong emphasis.
- **Dancefloor White** (`rgba(255, 255, 255, 0.75)`) / **Dancefloor White Muted** (`rgba(255, 255, 255, 0.5)`): Body copy and secondary/meta text respectively.
- **Marquee Gold** (`#fbbf24`): A single-purpose functional color for filled star ratings. It never appears outside the ratings/stars context — it is not a second accent.

### Named Rules
**The Single Light Source Rule.** Afterglow Pink is the only color allowed to mean "act here" or "this is active." Late Set Blue and Backstage Green exist purely to tell homepage story chapters apart by their edge border — they never touch a button, link, or form control.

**The No-Ambient-Color Rule.** Surfaces lighten in flat neutral steps (Midnight Indigo → Indigo Panel → Indigo Shade → hover) — never by tinting toward the accent. A hovered neutral surface gets lighter, not pinker.

## Typography

**Display/Body Font:** Poppins (with Helvetica, sans-serif fallback), loaded at weights 200/300/400/500.

**Character:** A single light, geometric sans run at thin-to-light weights throughout. Emphasis is built from weight and letter-spacing, not from size jumps or a second typeface — the voice stays even whether it's a hero headline or a footer disclaimer.

### Hierarchy
- **Display** (300, 2.5em, line-height 1): The homepage banner headline only — the one place the system goes loud.
- **Headline** (300, 2em, line-height 1.5, letter-spacing -0.025em): Section headings (`h2`) across every page.
- **Title** (300, 1.35em, line-height 1.5): Sub-section headings (`h3`), service box titles.
- **Body** (100, 15pt/~20px, line-height 1.75): All running copy — the thinnest weight in the system, trusting generous line-height to keep it readable.
- **Label** (300, 0.8em, letter-spacing 0.05em): Pills, badges, meta text (review dates, footer labels).

### Named Rules
**The Thin-Weight Rule.** Body copy runs at Poppins Thin (100) — the lightest weight available. Nothing in running text goes bolder than 300 (`strong`/headings); if something needs to shout, it changes color or size before it changes weight.

**The Dotted Underline Rule.** Inline text links get a dotted 1px underline in the surrounding text color (not the accent) at rest, and switch to solid Afterglow Pink only on hover. A link should read as part of the sentence until touched.

## Layout

A single fluid container (`max-width: calc(100% - 4em)`, nominal width `70em`) centers all page content, stepping to 90% width under 1280px and full-width under 980px. Sections carry generous vertical rhythm — a `6em` section spacing token separates major homepage chapters — while cards and panels use a tighter `1.5–2em` internal padding scale. Multi-column layouts use a flex-based `.row`/`.col-N` grid (not CSS Grid, except the reviews grid), collapsing to stacked single columns under `736px`. The homepage's "spotlight" sections are a distinct full-bleed pattern: an image fills the viewport width with a fixed-width (`28em`) content panel pinned to one edge, bordered in that chapter's color.

## Elevation & Depth

Hybrid, and intentionally lopsided toward flat: most interactive elements carry no shadow at rest, only a 1px inset "ghost border." Depth appears only as structural feedback to interaction — a service box lifts (`translateY(-3px)`) and gains a soft shadow on hover; the fixed header carries a faint ambient shadow purely to separate it from scrolling content beneath. There is no ambient drop-shadow styling applied to static panels.

### Shadow Vocabulary
- **Ghost border** (`box-shadow: inset 0 0 0 1px var(--color-border)`): Default resting state for buttons — a border implemented as an inset shadow, not a shadow in the visual sense.
- **Hover lift** (`box-shadow: 0 6px 20px var(--color-shadow-strong)`): Service box hover — the one place a true ambient shadow appears, paired with a small upward translate.
- **Header separation** (`box-shadow: 0 0 0.25em 0 var(--color-shadow)`): Fixed header against scrolled content.

### Named Rules
**The Ghost-Border Rule.** Interactive elements default to a faint inset border, not a shadow. Depth is earned through interaction (hover/active), never applied at rest to make something look important.

## Shapes

Flat by default — `border-radius: 0` is the base for buttons, cards, and panels — with exactly two round exceptions: full circles (`50%`) for anything inherently round in life (avatars, the homepage banner portrait, progress dots), and full pills (`2em`) for tag/badge-shaped UI (keyword filter pills, rating badges). There is no intermediate radius scale; a shape is either sharp, a circle, or a pill.

### Named Rules
**The Flat-Except-Round Rule.** No soft corners. A radius is either `0`, `50%`, or `2em` — never an in-between "friendly" rounding like 8px or 12px.

## Components

### Buttons
- **Shape:** Flat (0px radius), height `3em`, generous horizontal padding (`0 2.25em`).
- **Ghost (default):** Transparent background, 1px ghost border, text in Marquee White. Hover swaps the border and text to Afterglow Pink.
- **Primary:** Solid Afterglow Pink fill, no border, white text; hover/active step through the pink hover/active shades. Reserve `.primary` for the one action per section that matters most (book now, get a quote).
- **Disabled:** Ghost-border neutral fill at low opacity (0.25) — never styled to look clickable.

### Pills & Badges (signature component)
- **Style:** Full pill radius (2em), ghost fill/border at rest, filled Afterglow Pink when active/selected. Used for review keyword filters, each carrying a count badge in a slightly lighter translucent white fill.
- **Behavior:** Horizontally scrollable row on narrow viewports rather than wrapping — treat as a single scannable strip, like a row of festival wristbands.

### Cards / Containers
- **Review cards & service boxes:** Flat corners, Indigo Panel background, generous internal padding (1.5–2em). Service boxes lift on hover; review cards stay static (no hover motion) since they're read, not acted on.
- **Service box tiering:** `--dark` (gradient, pink top border) marks a service DJ Misha delivers directly; `--darker` (flat Indigo Shade fill, neutral `ghost-border` top border instead of pink) marks a partner/add-on offering. The pink top border is reserved for DJ Misha's own services — an extension of the Single Light Source Rule — so a vetter can tell "core" from "partnered" at a glance without reading the copy.
- **Signature/featured service:** When one service needs first-class visibility (e.g. the DJ+Saxophone flagship), give it a full-width placement and bump its title to the Headline scale (2em) rather than adding a kicker/eyebrow label above the heading — the heading carries its own weight.

### Inputs / Fields
- **Style:** Flat, ghost-bordered at rest.
- **Focus:** Border shifts to the accent color — consistent with the button hover language.

### Navigation
- Fixed header, Backroom Black/translucent background, `3.5em` height, flush to the viewport top. Nav links are plain text that turns accent-pink only when active — no pill or box treatment in the primary nav itself (that's reserved for the reviews-page keyword pills).
- On the homepage only, the header starts fully transparent over the banner and does not acquire its solid background/shadow until the visitor scrolls past the banner.

### Contact Modal (signature component)
- Full-screen takeover (`position: fixed; inset: 0`) in Midnight Indigo, not a centered dialog with a backdrop — the form *becomes* the page rather than floating above it.
- A thin progress track (3px) pinned to the very top fills in Marquee White as the visitor advances through steps; small round progress dots echo the same state below it.
- This is the site's primary conversion surface (quote requests) — treat its flat, focused, distraction-free construction as load-bearing, not decorative.

## Do's and Don'ts

### Do:
- **Do** keep Afterglow Pink rare — it should read as the one warm thing in a dark room, not a wash.
- **Do** keep ratings/review proof visually prominent (stars, pill counts, avatar initials) — this audience includes corporate vetters checking credibility, not just couples browsing mood.
- **Do** use flat corners, ghost borders, and thin type weight as the default register for any new UI; reach for the circle/pill exceptions only when the content is genuinely round or tag-shaped.
- **Do** let depth (shadow, lift) appear only in response to interaction, never as resting decoration.

### Don't:
- **Don't** introduce a second saturated accent color, gradient-heavy treatment, or neon-rave styling — the brief is "energetic but corporate-safe," not festival-flyer maximalism.
- **Don't** use Late Set Blue or Backstage Green anywhere but a homepage spotlight chapter border; they are not general-purpose secondary/tertiary brand colors.
- **Don't** round a corner to anything between 0 and a full circle/pill — there is no "soft card" radius in this system.
- **Don't** add a drop shadow to a static panel at rest; reserve shadows for hover/interaction feedback.
