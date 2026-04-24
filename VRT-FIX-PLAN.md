# VRT Fix Plan: Footer Navigation & Photo Gallery Spacing

## Problem Summary

The visual regression test (53/60 failures at 1% threshold) shows two recurring spacing issues across nearly all pages:

1. **Footer navigation items** — list item spacing doesn't match the WordPress original
2. **Photo gallery thumbnails** — the sidebar gallery grid spacing/layout doesn't match the NextGen Gallery plugin output

---

## Issue 1: Footer Navigation Spacing

### Root Cause

The WordPress site renders footer nav lists via `wp_nav_menu()`, which wraps the `<ul>` in a container `<div class="menu-footer-navigation-container">`. The Astro footer uses a bare `<ul class="menu-footer-navigation">` without the wrapper div.

More importantly, the WordPress `<li>` elements have no explicit padding — the default browser `<li>` spacing applies. The Astro `public/css/custom.css` adds `padding: 0.3em 0` to `.menu-footer-navigation li, .services-navigation li` which doesn't exist in the WordPress original `custom.css`. This extra padding increases the vertical spacing between nav items.

Additionally, the WordPress CSS targets `#menu-footer-navigation` (ID selector) while the Astro CSS targets `.menu-footer-navigation` (class selector). The WordPress `<ul>` has both the ID and the class, but the original CSS rules were written for the ID.

### Files to Modify

- `public/css/custom.css` — adjust footer nav list item spacing
- `src/components/Footer.astro` — optionally add wrapper div for structural parity

### Fix Steps

1. In `public/css/custom.css`, remove or adjust the `padding: 0.3em 0` on `.menu-footer-navigation li, .services-navigation li` — compare rendered spacing against the live site and tune until it matches
2. Verify the `<ul>` padding/margin reset (`padding: 0; margin: 0`) matches what WordPress renders (the browser default for `wp_nav_menu` output)
3. Check that the `.row` grid gutter (2.5em from `main.css`) is applying correctly to the footer columns — the WordPress footer uses the same `.row > .col-4` grid

---

## Issue 2: Photo Gallery Thumbnail Spacing

### Root Cause

The WordPress site loads the NextGen Gallery plugin stylesheet (`nextgen_basic_thumbnails.css`) which provides specific styling for the `.default-view` template. Key differences:

**WordPress (NextGen plugin CSS):**
- `.ngg-galleryoverview.default-view` uses `text-align: center; font-size: 0; letter-spacing: 0` — this is the key layout mechanism, using inline-block with zero font-size to eliminate whitespace gaps
- `.ngg-galleryoverview.default-view .ngg-gallery-thumbnail-box` uses `display: inline-block; float: none; vertical-align: middle` — NOT float-based
- `.ngg-galleryoverview.default-view .ngg-gallery-thumbnail` has `background-color: transparent; border: none; margin: 0`
- `.ngg-galleryoverview.default-view .ngg-gallery-thumbnail a` has `margin: 2px`
- `.ngg-galleryoverview` has `margin-top: 40px; margin-bottom: 50px`

**Astro (public/css/custom.css):**
- `.ngg-gallery-thumbnail-box` uses `float: left; width: 33.333%` — float-based layout
- `.ngg-gallery-thumbnail` has `padding: 2px`
- Missing the `font-size: 0` trick, the `inline-block` layout, and the `margin-top/margin-bottom` on the overview container
- The original `.ngg-gallery-thumbnail img` rule in `custom.css` adds `margin: 4px 0 4px 4px; padding: 4px` which conflicts with the NextGen default-view styles that set `margin: 0`

The float-based approach in Astro produces a different visual result than the inline-block centered approach WordPress uses.

### Files to Modify

- `public/css/custom.css` — replace the gallery CSS rules with ones matching the NextGen default-view template

### Fix Steps

1. Replace the current gallery rules in `public/css/custom.css` (the "NextGEN Gallery Sidebar Thumbnails" section) with styles that match the NextGen `default-view` template:

```css
/* NextGEN Gallery Sidebar Thumbnails */
.ngg-galleryoverview {
  overflow: hidden;
  margin-top: 10px;
  width: 100%;
}

.ngg-galleryoverview.default-view {
  text-align: center;
  font-size: 0;
  letter-spacing: 0;
}

.ngg-galleryoverview.default-view .ngg-gallery-thumbnail-box {
  display: inline-block;
  float: none;
  vertical-align: middle;
}

.ngg-galleryoverview.default-view .ngg-gallery-thumbnail {
  background-color: transparent;
  border: none;
  margin: 0;
}

.ngg-galleryoverview.default-view .ngg-gallery-thumbnail a {
  margin: 2px;
  display: block;
  box-shadow: none;
}

.ngg-galleryoverview.default-view .ngg-gallery-thumbnail img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

.ngg-clear {
  clear: both;
}
```

2. Update the existing `.ngg-gallery-thumbnail img` rule in `custom.css` (around line 348) to not conflict — the `margin: 4px 0 4px 4px` and `padding: 4px` should be scoped or removed since the default-view template overrides them

---

## Verification

After applying both fixes:

1. Run `npm run build` to rebuild the Astro site
2. Run `node scripts/qa-visual-regression.mjs` to re-run the visual regression test
3. Target: reduce failures from 53 to under 10 (ideally the remaining diffs should be from dynamic content differences like WordPress admin bar, different font rendering, etc.)
4. Open `vrt-output/report.html` to visually confirm the footer and gallery areas now match

## Pages Most Affected

These pages have the highest diff scores and should show the most improvement:
- corporate-event-dj mobile (34.63%) — has both footer + sidebar gallery
- misha tablet/mobile (18.76%, 16.80%) — has both footer + sidebar gallery  
- sitemap tablet/mobile (17.93%, 16.17%) — footer spacing
- services mobile (17.69%) — footer spacing
- blog-edm tablet (16.18%) — footer + blog layout
- blog-taking-requests tablet/mobile (14.59%, 14.63%) — footer spacing
