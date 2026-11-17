import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(
  path.join(root, 'dist/reviews/index.html'),
  'utf8',
);
const filterScript = fs.readFileSync(
  path.join(root, 'public/js/reviews-filter.js'),
  'utf8',
);
const reviewsData = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/reviews.json'), 'utf8'),
);

function getVisibleAuthors(document) {
  return [
    ...document.querySelectorAll('.review-card:not(.review-card-hidden)'),
  ].map((card) => card.querySelector('.review-author').textContent);
}

describe('reviews tag filtering', () => {
  it('filters every tag newest-first and restores the default order with All', () => {
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    const { document } = dom.window;
    dom.window.eval(filterScript);

    const grid = document.querySelector('.reviews-grid');
    const cards = [...grid.querySelectorAll('.review-card')];
    const defaultAuthors = getVisibleAuthors(document);

    cards.reverse().forEach((card) => grid.appendChild(card));

    reviewsData.keywords.forEach((keyword) => {
      const expected = reviewsData.reviews
        .filter((review) => review.keywords.includes(keyword))
        .sort((a, b) => b.time - a.time);
      const pill = [...document.querySelectorAll('.keyword-pill')].find(
        (element) => element.getAttribute('data-keyword') === keyword,
      );

      expect(pill).toBeDefined();
      pill.click();

      expect(getVisibleAuthors(document)).toEqual(
        expected.map((review) => review.author),
      );
      expect(pill.classList.contains('active')).toBe(true);
      expect(pill.querySelector('.pill-badge').textContent).toBe(
        String(expected.length),
      );
      expect(
        [...grid.querySelectorAll('.review-card:not(.review-card-hidden)')].map(
          (card) => Number(card.getAttribute('data-review-time')),
        ),
      ).toEqual(expected.map((review) => review.time));
    });

    const allPill = document.querySelector('.keyword-pill[data-keyword="all"]');
    allPill.click();
    expect(getVisibleAuthors(document)).toEqual(defaultAuthors);
    expect(
      grid.querySelectorAll('.review-card.review-card-hidden'),
    ).toHaveLength(0);
    expect(allPill.classList.contains('active')).toBe(true);

    dom.window.close();
  });
});
