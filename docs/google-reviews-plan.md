# Google Reviews: Fetch & Keyword-Sortable Display

Pull all Google reviews via Playwright into a local JSON, then rebuild the reviews page with keyword filter pills (like Google Maps).

## Approach: Playwright Scraping (Free)

A Node.js script using Playwright opens the Google Maps listing in a headless browser, scrolls through all reviews, and parses them from the DOM. Zero cost, no API keys, gets all 83+ reviews.

**Trade-off**: If Google changes their Maps DOM structure, selectors need updating. Acceptable since the script runs manually every few months.

## Phase 1 — Fetch Script

1. Create `scripts/fetch-reviews.mjs`:
   - Launch headless Chromium via Playwright
   - Navigate to DJ Misha's Google Maps reviews page (using Place ID)
   - Scroll to load all reviews
   - Parse each review: author, rating (star count), text, date, profile photo URL
   - Merge with existing `src/data/reviews.json` (dedup by author + date)
   - Preserve manually-added reviews (tagged `source: "manual"`)
   - Write output to `src/data/reviews.json`
2. Add to `package.json`:
   - `"fetch-reviews": "node scripts/fetch-reviews.mjs"`
   - Dev dependency: `playwright`
3. Add setup note: run `npx playwright install chromium` once

## Phase 2 — Data Layer

4. Create `src/data/reviews.json` with structure:
   ```json
   {
     "lastFetched": "2026-05-06T00:00:00Z",
     "placeId": "PLACE_ID_HERE",
     "totalRating": 5,
     "totalReviews": 83,
     "reviews": [
       {
         "id": "hash-of-author-and-time",
         "author": "Chris R.",
         "rating": 5,
         "text": "DJ Misha was incredible...",
         "time": 1696000000,
         "date": "2023-09-29",
         "source": "google",
         "keywords": ["wedding", "disco", "house", "saxophone"]
       }
     ]
   }
   ```
5. Pre-compute keywords at fetch time using a curated list (~15-20 terms):
   - wedding, corporate, party, birthday, saxophone, house, disco, dance, professionalism, music selection, crowd, energy, playlist, reception, ceremony, festival, DJ set, planning, communication

## Phase 3 — Reviews Page Rebuild

6. Rewrite `src/pages/reviews/index.astro`:
   - Import from `src/data/reviews.json`
   - Render keyword filter pills at top (horizontal scrollable row)
   - Render review cards: star rating, author, date, text
   - Include existing email-sourced reviews inline (merged in JSON with `source: "manual"`)
7. Create `public/js/reviews-filter.js`:
   - Click keyword pill → show only reviews containing that keyword
   - Single-select (one keyword active at a time, like Google Maps)
   - "All" pill to reset
   - Badge count on each pill
   - CSS transition for show/hide

## Phase 4 — Polish

8. Add keyword pill styles to `public/css/site.css`:
   - Horizontal scrollable row
   - Active/inactive states
   - Match existing site design
9. Update `src/data/schema.ts` `aggregateRating` to read from `reviews.json`

## Files to Create/Modify

| File | Action |
|------|--------|
| `scripts/fetch-reviews.mjs` | Create — Playwright scraping script |
| `src/data/reviews.json` | Create — review data store |
| `src/pages/reviews/index.astro` | Rewrite — data-driven with filter UI |
| `public/js/reviews-filter.js` | Create — client-side keyword filtering |
| `public/css/site.css` | Modify — add pill styles |
| `src/data/schema.ts` | Modify — dynamic aggregate rating |
| `package.json` | Modify — add script + playwright dep |

## Verification

1. `npx playwright install chromium` then `npm run fetch-reviews` → `reviews.json` populated
2. `npm run dev` → reviews page renders all reviews from JSON
3. Keyword pills filter correctly, counts match
4. Manual/email reviews preserved across fetches
5. JSON-LD schema and SEO meta tags intact

## Decisions

- **Playwright over paid APIs** — free, all reviews, acceptable fragility for manual runs
- **Client-side filtering** — Astro SSG builds all reviews into HTML, JS just shows/hides
- **Single-select keywords** — matches Google Maps UX
- **Keywords pre-computed at fetch time** — no runtime text processing
- **Manual reviews preserved** — `source: "manual"` entries never overwritten by scraper
