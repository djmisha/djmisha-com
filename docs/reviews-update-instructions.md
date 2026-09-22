# Updating Reviews from `scraped.html`

Use this procedure when new Google review content is added to
[`docs/scraped.html`](./scraped.html). The destination data file is
[`src/data/reviews.json`](../src/data/reviews.json).

## Scope

The user will specify how many new reviews are present in the scrape. Use that
number as `N` for the update; it is not necessarily three.

- Process only the **N newest reviews at the top** of `scraped.html`.
- Do not update, reword, retag, reorder, or otherwise modify older reviews.
- Do not add owner responses.
- Ignore all reviews after the first N, even if they are not already in
  `reviews.json`.
- Preserve the existing JSON schema and formatting.

The scrape may show a Google total that includes more reviews than the N being
imported. For this workflow, increase `totalReviews` by exactly N from the
current JSON value rather than copying the displayed Google total.

## Extract each review

Read the first N review blocks after the page's review summary. For each one,
capture:

- Author name
- Full visible review text
- Star rating
- Relative date converted to the same ISO date and Unix timestamp conventions
  already used in `reviews.json`

Do not include the reviewer's review count, `New` label, `More` UI text, owner
response, or action labels such as `Like` and `Share`.

## Build the JSON object

Add the N new objects at the beginning of the `reviews` array, newest first.
Each object must contain:

```json
{
  "id": "8-character-hex-id",
  "author": "Reviewer Name",
  "rating": 5,
  "text": "Full review text",
  "time": 0,
  "date": "YYYY-MM-DD",
  "keywords": [],
  "profilePhoto": null
}
```

Generate `id` deterministically with `generateId(author, date)` from
[`src/lib/reviews-helpers.mjs`](../src/lib/reviews-helpers.mjs). Keep the
existing `profilePhoto: null` convention unless a real profile photo is
available in the established data format.

## Apply keyword tags

Use only the existing values in the top-level `keywords` array. Assign every
matching tag supported by the review text; do not invent new tag names.

The project’s matching patterns are defined in
[`src/lib/reviews-helpers.mjs`](../src/lib/reviews-helpers.mjs). They cover:

- `saxophonist`
- `dancing`
- `dance floor`
- `playlist`
- `music selection`
- `easy to work with`

When a review clearly matches a concept but the matcher does not recognize
the wording, add the existing keyword manually. Keep tags concise and
consistent with the older entries.

## Update counts

After adding exactly N reviews:

1. Increase `totalReviews` by `N`.
2. For each keyword, increase `keywordCounts[keyword]` by the number of the N
   new reviews that received that tag.
3. Leave all other metadata and all older review objects unchanged.

`keywordCounts` reflects the maintained Google keyword counts and may not equal
the number of matching `keywords` arrays in every historical entry. Do not
recalculate or normalize old reviews; only apply the increment for the three
new objects.

## Validation checklist

Run these checks before finishing:

1. Parse `reviews.json` as JSON.
2. Confirm exactly N new objects were added at the beginning of `reviews`.
3. Confirm the N new authors and their source text match the top N scrape
   blocks.
4. Confirm `totalReviews` increased by exactly N.
5. Confirm each `keywordCounts` value increased only by the new tags.
6. Run `git diff --check`.
7. Review the diff to ensure no older review object changed.
8. Run the repository’s available formatting, build, and test commands.

If the user has not specified N, or the scrape is ambiguous, incomplete, or
has fewer than N new review blocks, stop and ask for clarification rather than
guessing or modifying older data.
