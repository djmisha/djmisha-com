# Code Improvements Backlog

Identified improvements for the djmisha-com Astro site, organized by impact and effort.

---

## High Impact, Low Effort

### 1. Dead code cleanup

Remove leftover files from the WordPress migration that serve no purpose:

- [x] Delete `public/js/gravity/` — Gravity Forms JS files. No references anywhere in `src/`.
- [x] Delete `existing-site/` directory — old WordPress HTML reference files
- [x] Delete `docs/scraped.html` — migration artifact

### 2. Dynamic review count

The number "83" is hardcoded in two places:

- [x] `src/pages/index.astro` — "DJ Misha is Rated 5/5 stars based on 83 reviews"
- [x] `src/components/Footer.astro` — "5 Stars from 83 Reviews"

Now reads from `reviews.json`'s `totalReviews` field automatically.

### 3. Centralize constants

Created `src/data/config.ts` as single source of truth:

- [x] Phone number `(619) 786-2664` — `PHONE.tel`, `PHONE.href`, `PHONE.display`
- [x] Google review URL — `GOOGLE_REVIEW_URL`
- [x] Social media URLs — `SOCIAL.*`
- [x] `https://djmisha.com` — `SITE_URL`

### 4. Fix JSON-LD schema issues

- [x] Fix relative image paths in `src/data/schema.ts`: Now uses absolute URLs (`https://djmisha.com/images/...`).
- [x] Fix blog index schema (`src/pages/blog/index.astro`): Now correctly points to `/blog/`.
- [x] Remove `\r\n` literal in `src/data/schema.ts`: Cleaned up `webSite.about` field.

### 5. Fix accessibility: skip-to-content link

- [x] Replaced `display:none` in `src/components/Navigation.astro` with `.skip-link` class (visually hidden, visible on `:focus`)

---

## High Impact, Medium Effort

### 6. Extract blog post data

- [x] Created `src/data/blog-posts.ts` as a single data source
- [x] Updated `src/pages/index.astro` to import from data file
- [x] Updated `src/components/Sidebar.astro` to import from data file
- [x] Updated `src/pages/blog/index.astro` to import from data file

### 7. Create a `<Testimonial>` component

- [x] Created `src/components/Testimonial.astro` (supports interactive + simple modes)
- [x] Refactored `src/pages/index.astro` (6 instances)
- [x] Refactored `src/pages/services/wedding-dj-in-san-diego/index.astro` (3 instances)
- [x] Refactored `src/pages/dj-saxophone/index.astro` (3 instances)
- [x] Refactored `src/pages/music/index.astro` (2 instances)

### 8. Star SVG in Footer

- [x] Replaced 5 copy-pasted star SVGs in `src/components/Footer.astro` with a `.map()` loop

### 9. Add `defer` to scripts

- [x] Added `defer` attribute to all 10 scripts in `src/components/Footer.astro`

### 10. Migrate Google Analytics

- [x] Commented out dead Universal Analytics code (`UA-7759036-2`), left GA4 template with instructions

---

## Medium Impact, Low Effort

### 11. Broken internal links (404s)

`src/pages/dj-saxophone/index.astro` had 3 links to pages that don't exist:

- [x] `/san-diego-dj-in-a-secret-room/` — redirected to `/music/`
- [x] `/djing-at-uncorked-wine-festival-2017-in-san-diego/` — redirected to `/services/corporate-event-dj-in-san-diego/`
- [x] `/vendors/` — redirected to `/services/`

### 12. Unused `useFancybox` prop

- [x] Removed the prop from `BaseLayoutProps` type, `BaseLayout.astro`, and `index.astro`. FancyBox CSS loads unconditionally (needed on most pages for gallery lightbox).

### 13. Duplicate sidebar content

- [x] Replaced duplicated "Pricing and Packages" text in `src/layouts/ReviewsLayout.astro` with `<ContactSidebar />` component import

### 14. Inline style duplication

- [x] Moved `.image-w img` styles into `site.css`, removed 4x repeated inline `<style>` blocks from homepage

---

## Lower Priority / Larger Effort

### 15. Image optimization

- [ ] Convert images to WebP/AVIF format
- [ ] Add `loading="lazy"` to below-fold spotlight images on homepage
- [ ] Consider using Astro's `<Image>` component or a build-time optimization pipeline
- [ ] Audit gallery for missing images (some numbered files have gaps causing 404s)

### 16. Font Awesome subset

Full Font Awesome library (56KB CSS + 15 font files) loaded for ~6 icons used across the site.

- [ ] Switch to inline SVGs for the specific icons used, OR
- [ ] Generate a custom FA subset via fontello or IcoMoon, OR
- [ ] Use Astro Icon package

### 17. jQuery migration

9 scripts from the HTML5 UP "Landed" theme (~100KB+ of JS). The site uses jQuery for:

- [ ] Scroll animations (scrollex, scrolly) — replace with CSS scroll-driven animations or Intersection Observer
- [ ] Dropdown menus (dropotron) — replace with CSS-only or native `<details>`
- [ ] Mobile nav panel — replace with vanilla JS
- [ ] FancyBox lightbox — replace with a lighter alternative

### 18. Use `Astro.site` for canonical URLs

- [ ] Refactor all pages to derive canonical/OG URLs from `Astro.url` or `Astro.site` instead of hardcoding `https://djmisha.com`

---

## Notes

- Items 1-14 are complete
- Items 15-18 are multi-hour efforts best done as separate initiatives
- All changes should be followed by `npm run build` and `npm run format`
