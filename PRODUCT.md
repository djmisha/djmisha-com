# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: couples, hosts, and individuals in San Diego (and nationwide for destination events) researching and booking a DJ for weddings, corporate events, parties, birthdays, and nightlife/festival bookings. They land on the site to evaluate fit (music style, experience, reviews), see pricing, and request a quote via the multi-step contact form.

Secondary: professional vetters — corporate event planners and wedding/event planners vetting DJ Misha on behalf of a client or company, and venues considering him as a referral. This audience is important and specifically called out as "most important" among the secondary group: content and proof points (experience, reviews, professionalism, equipment) should hold up under a planner's vetting, not just a consumer's browse.

## Product Purpose

DJ Misha is a San Diego-based professional DJ and entertainment service. The site exists to win bookings: communicate the music/experience on offer, build trust through reviews and track record, and convert visitors into quote requests. Success is a submitted contact-form lead that turns into a booked event.

## Positioning

- DJ'ing since 2001; San Diego-based, available for destination/nationwide travel.
- Since 2007, pioneered the "DJ + live saxophone" duo format (with longtime collaborator Jason Whitmore) — among the first to do this, now widely imitated; a differentiator competitors can't easily claim.
- 5.0 average rating across 86 Google reviews (dynamic, read from `src/data/reviews.json`), with reviews frequently citing the DJ+sax live-energy combination, reading the crowd, and ease of working with him.
- Positions as full-service: tailored sets per event (ceremony through last dance for weddings), professional sound/lighting equipment, not just a single genre — house/EDM/dance-forward but spans Top 40, hip-hop, R&B, lounge/downtempo.

## Operating Context

- Lines of business/pages: Home, About, Services (Wedding DJ, Destination Wedding DJ, Corporate Event DJ, Party/Birthday DJ), DJ+Saxophone, Music, Reviews, Blog, Contact, Thank-you.
- Lead capture: `MultiStepContactForm` (full-screen modal, 5-step, reCAPTCHA-protected) posts to a PHP backend (`php/process-multistep-form.php`) that sends owner notification, user confirmation, and a Verizon (email-to-SMS) notification — this is a real, load-bearing integration, not a placeholder.
- Reviews pipeline: `src/data/reviews.json` is refreshed from Google reviews via a documented process (`docs/reviews-update-instructions.md`, `scripts/parse-raw-text.mjs`); review count/rating shown on-site must stay sourced from this file, never hardcoded.
- JSON-LD structured data (`src/data/schema.ts`) carries Organization/LocalBusiness/Person/AggregateRating schema for SEO — business name, address, phone, social links, and rating are real and must stay accurate.
- Migrated from a prior WordPress site; `docs/code-improvements.md` tracks cleanup already done (dead WordPress artifacts removed, constants centralized into `src/data/config.ts`, a11y skip-link fix applied).

## Capabilities and Constraints

- Static Astro v7 site (`astro build`), no client framework/runtime beyond vanilla JS/Astro components. Form submission is the one dynamic/server-dependent path (PHP + reCAPTCHA).
- Single source of truth for contact/social/site-URL constants: `src/data/config.ts`. Don't hardcode phone numbers, social URLs, or the site URL elsewhere.
- Per-page footer descriptions are centralized in `src/data/footer-descriptions.ts`, keyed by pathname.
- Service area: San Diego-based home market; travels for destination weddings and corporate events nationwide (and internationally, per About copy) — not a hard geographic limit.
- Pricing (`/services/`): "Starting from $2,500" (Wedding DJ), "Starting from $4,000" (DJ & Saxophone), etc. These are real, current figures — preserve them as-is, but expect them to change periodically; don't treat the specific dollar amounts as permanently fixed, and re-confirm before any future work that touches displayed pricing.
- Accessibility: no formal compliance standard (e.g. no WCAG/ADA legal mandate) is in force — follow solid general accessibility practice (as already reflected in the existing skip-link fix), not a specific certified level.

## Brand Commitments

- Business/person name: "DJ Misha." Longtime collaborator and saxophonist: Jason Whitmore (billed as a duo act, not a session player).
- Phone, social (Instagram, YouTube, Facebook, Yelp, Google, GigTown, GigSalad, Zola), and address are real and live in `src/data/config.ts` / `src/data/schema.ts` — treat as fact, not placeholder.
- Tone in existing copy: warm, energetic, experience-forward ("He brings the party and makes you want to dance!"), professional/credentialed when speaking to corporate or planner audiences (years of experience, equipment specifics, five-star social proof).

## Evidence on Hand

- `src/data/reviews.json`: 86 real Google reviews (5.0 average), with author names, text, and extracted keyword counts (e.g. "saxophonist," "dancing," "dance floor," "music selection"). Real testimonial content — don't fabricate additional reviews or ratings.
- `src/data/blog-posts.ts`: existing blog posts on wedding planning, DJ craft, and requests — real content, not placeholder.
- Image assets under `public/images/` (event photos, press/best-of badges like `Best-San-Diego-DJ-djmisha.com-...jpg`) are real event/press imagery already in use.
- No case studies, press mentions beyond the badge imagery, or client logos are on hand beyond what's cited above — future work should not invent corporate client names or press citations.

## Product Principles

1. Lead with proof, not adjectives: reviews, review count/rating, and years of experience carry more weight than descriptive claims, and must stay dynamically sourced rather than hardcoded.
2. The DJ+saxophone format is the signature differentiator — give it first-class visibility, not a buried sub-service, since it's the claim a competitor can't make.
3. Content must satisfy two readers at once: the consumer browsing for vibe/fit, and the corporate/planner vetter scanning for professionalism, track record, and equipment competence — don't optimize copy for one at the expense of the other.
4. Pricing shown is real and current-as-of-writing but not fixed; treat exact figures as refreshable facts, not hardcoded truths to defend.
5. Preserve the lead-capture pipeline (multi-step form → reCAPTCHA → PHP notifications) and the reviews-data pipeline as load-bearing integrations when touching related UI.

## Accessibility & Inclusion

No specific compliance standard is mandated. Maintain general good practice (semantic structure, focus handling in the modal contact form, the existing skip-to-content link) without targeting a certified WCAG level.
