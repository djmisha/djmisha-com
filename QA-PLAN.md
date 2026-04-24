# Final QA Plan — WordPress to Astro Migration

## Approach
For each page, compare the Astro build output (`dist/`) against the scraped live site reference (`existing-site/`). Check content, SEO, structure, and assets. Work page by page.

---

## Phase 1: SEO Meta Tags (every page)

For each page, compare these elements between `existing-site/{page}.html` and `dist/{path}/index.html`:

| Check | What to compare |
|-------|----------------|
| `<title>` | Exact text match |
| `<meta name="description">` | Exact content match |
| `<link rel="canonical">` | Exact href match |
| `<meta property="og:site_name">` | Exact match |
| `<meta property="og:title">` | Exact match |
| `<meta property="og:description">` | Exact match |
| `<meta property="og:image">` | Path match (local vs WP path is expected) |
| `<meta property="og:url">` | Exact match |
| `<meta property="og:type">` | Exact match |
| `<meta name="twitter:card">` | Should be "summary_large_image" |
| `<meta name="twitter:title">` | Exact match |
| `<meta name="twitter:description">` | Exact match |
| `<meta name="twitter:image">` | Path match |
| JSON-LD schema | All objects present, correct types, correct values |
| Favicon links | 3 links present (32x32, 192x192, apple-touch-icon) |

### Pages to check:
- [ ] Home (`/`)
- [ ] About (`/about/`)
- [ ] Music (`/music/`)
- [ ] Reviews (`/reviews/`)
- [ ] Prices (`/prices/`)
- [ ] Services (`/services/`)
- [ ] Wedding DJ (`/services/wedding-dj-in-san-diego/`)
- [ ] Destination Wedding DJ (`/services/destination-wedding-dj/`)
- [ ] Corporate Event DJ (`/services/corporate-event-dj-in-san-diego/`)
- [ ] Party DJ (`/services/party-birthday-dj-in-san-diego/`)
- [ ] DJ Saxophone (`/dj-saxophone/`)
- [ ] Contact (`/contact/`)
- [ ] Blog Index (`/blog/`)
- [ ] Sitemap (`/sitemap/`)
- [ ] Misha (`/misha/`)
- [ ] Blog: Your Wedding Your Music
- [ ] Blog: Art of Taking Requests
- [ ] Blog: Crafting the Perfect Toast
- [ ] Blog: Guide to Planning Wedding
- [ ] Blog: EDM DJ for Party

---

## Phase 2: Content Body (every page)

For each page, compare the main content area:

| Check | What to compare |
|-------|----------------|
| `<h1>` heading | Exact text |
| `<h2>` headings | All present, exact text, correct order |
| `<h3>` headings | All present, exact text |
| Paragraphs | All present, exact text (spot check first/last paragraph) |
| Images in content | Correct src, alt, classes, dimensions |
| Internal links | Correct href, text, title attributes |
| External links | Correct href, target, rel attributes |
| Testimonials | All present with correct reviewer names |
| Lists (ul/ol) | All items present |
| Embedded content | iframes (YouTube), embeds |
| FAQ schema | Inline `<script type="application/ld+json">` for FAQ pages |

### Pages to check:
- [ ] Home (banner, spotlights, testimonials, services, videos, blog preview, CTA)
- [ ] About
- [ ] Music
- [ ] Reviews (all testimonials, Google Reviews CTA)
- [ ] Prices (all sections, pricing cards)
- [ ] Services (all service descriptions, images)
- [ ] Wedding DJ (full content, FAQ schema, testimonials)
- [ ] Destination Wedding DJ (gallery, testimonials, FAQ schema)
- [ ] Corporate Event DJ (full content, FAQ schema, YouTube embed)
- [ ] Party DJ (full content, testimonials)
- [ ] DJ Saxophone (full content, FAQ section, FAQ schema, images)
- [ ] Contact (intro text, form, Gravity Forms JS)
- [ ] Blog Index (5 cards with images, titles, excerpts)
- [ ] Sitemap (all links)
- [ ] Misha (image)
- [ ] All 5 blog posts (full article content, tags)

---

## Phase 3: Navigation & Footer (global)

| Check | What to compare |
|-------|----------------|
| Primary nav | 10 items, exact text, hrefs, title attributes, order |
| Nav logo | h1 on home, span on other pages |
| Skip-to-content | Link present before header, anchor after |
| Footer nav | 6 items with exact titles |
| Services nav | 6 items with exact titles |
| Footer aside | Exact text, phone link |
| Social icons | 5 icons with correct hrefs, classes, titles, target, rel |
| Ratings widget | 5 SVG stars, "5 Stars from 83 Reviews", Google link |
| Copyright | Empty href, full site name, sitemap link |
| Script order | jQuery → scrolly → dropotron → scrollex → browser → breakpoints → util → main → custom → fancybox |
| Google Analytics | UA-7759036-2 |
| Book Now widget | expert.png, link to /contact/ |

- [ ] Check on home page
- [ ] Check on a standard page (about)
- [ ] Check on contact page (footer hidden)

---

## Phase 4: Layouts & Structure

| Check | What to compare |
|-------|----------------|
| Home page | body class `is-preload landing`, unique layout (no sidebar) |
| PageLayout pages | 8/4 column grid, sidebar with gallery + blog links |
| ContactLayout | 8/4 column grid, contact sidebar (Pricing and Packages) |
| ReviewsLayout | 8/4 column grid, contact sidebar, body class `contact-page` |
| BlogLayout | Card grid, `category` class on wrapper |
| Blog posts | Use PageLayout with sidebar |
| Prices page | Uses PageLayout (not ContactLayout) |

- [ ] Home page structure
- [ ] Standard page structure (about)
- [ ] Contact page structure
- [ ] Reviews page structure
- [ ] Blog index structure
- [ ] Blog post structure
- [ ] Prices page structure

---

## Phase 5: CSS & Styling

| Check | What to compare |
|-------|----------------|
| Stylesheets loaded | main.css, custom.css, fancybox.css, noscript.css (in correct order) |
| Gravity Forms CSS | Only on contact page (3 files) |
| WordPress block styles | .wp-block-image, .alignright, .alignleft working |
| Gallery thumbnails | .ngg-gallery-thumbnail-box grid layout |
| Footer nav | No bullet points, left-aligned |
| Testimonials | .home-testi styling |
| Prices cards | .style-prices styling |
| Ratings widget | Inline CSS in head |

- [ ] Check stylesheet order in `<head>`
- [ ] Check image alignment on services page
- [ ] Check sidebar gallery layout
- [ ] Check footer nav styling
- [ ] Check contact form styling

---

## Phase 6: Forms & Interactive

| Check | What to compare |
|-------|----------------|
| Contact form | All 10 fields with correct ids, names, types |
| Form wrapper | Gravity Forms class structure |
| Netlify Forms | data-netlify="true", hidden form-name field |
| reCAPTCHA | Site key, dark theme, invisible badge |
| Submit button | Correct classes and value |
| Accessibility | aria-required, aria-invalid on all required fields |
| Required asterisks | Present on all required labels |
| Form action | `/contact/` |
| Gravity Forms JS | gform_theme_config, vendor-theme.min.js, scripts-theme.min.js |
| FancyBox | Working on home page videos, sidebar gallery images |

- [ ] Contact form fields
- [ ] Form submission (Netlify)
- [ ] FancyBox on home page videos
- [ ] FancyBox on sidebar gallery

---

## Phase 7: Static Files & Config

| Check | What to compare |
|-------|----------------|
| robots.txt | User-agent, Disallow, Sitemap URL |
| sitemap.xml | All URLs present, lastmod, changefreq, priority, image entries |
| llm.txt | Site info, services, contact, links |
| _redirects | /contact-dj-misha/ → /contact/ (301), /photogallery/ → / (301) |
| netlify.toml | Build command, publish dir, redirect rules |
| astro.config.mjs | trailingSlash: 'always', site URL |
| Trailing slashes | All URLs end with / |

- [ ] robots.txt content
- [ ] sitemap.xml completeness
- [ ] Redirect rules
- [ ] Trailing slash on all built pages

---

## Phase 8: Images

| Check | What to compare |
|-------|----------------|
| All images downloaded | 98 images in public/images/ |
| No broken images | All src paths resolve to existing files |
| No WordPress URLs | Zero references to djmisha.com/wordpress/ in build output |
| Favicon images | logo-djmisha-150x150.png, logo-djmisha-200x200.png |
| JSON-LD images | logo-djmisha.png, i-4LhQfht-L.jpg, Best-San-Diego-DJ-djmisha.com-12-300x200.jpg |
| Blog thumbnails | All 5 blog post thumbnails present |
| Gallery thumbnails | All sidebar gallery thumbs + EDM post gallery thumbs |

- [ ] Check for broken image references in dist/
- [ ] Check for remaining WordPress URLs in dist/
- [ ] Verify key images exist

---

## Known Accepted Differences

These are expected and intentional:

1. **og:image domain**: Our build uses `https://djmisha.com/images/logo-djmisha.png` vs WordPress's `https://djmisha.com/wordpress/wp-content/uploads/...` — same image, different path
2. **Photogallery page**: Renders as redirect in Astro, handled by Netlify _redirects at CDN level
3. **Music page**: Content sourced from earlier successful scrape (page currently returns 403)
4. **WordPress head links**: We don't replicate `<link rel="EditURI">`, `<link rel="wlwmanifest">`, etc.
5. **WordPress admin bar**: Not present in static build
6. **wp-emoji scripts**: Not replicated (not needed)
