import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const pagePath = path.join(distDir, 'reviews/index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const $ = load(html);
const reviewsData = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/reviews.json'), 'utf8'),
);
const reviewsWithText = reviewsData.reviews.filter(
  (review) => review.text.trim().length > 0,
);
const ratingOnlyReviews = reviewsData.reviews.filter(
  (review) => review.text.trim().length === 0,
);
const displayReviews = [...reviewsWithText, ...ratingOnlyReviews];

function collectPageCss() {
  let css = '';
  $('style').each((_, el) => {
    css += $(el).html() || '';
  });
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = ($(el).attr('href') || '').split('?')[0];
    if (!href.startsWith('/')) return;
    const file = path.join(distDir, href);
    if (fs.existsSync(file)) css += fs.readFileSync(file, 'utf8');
  });
  return css;
}

describe('reviews page testimonials', () => {
  const css = collectPageCss();

  it('keeps review order, keyword filters, and rating schema', () => {
    const authors = $('.review-card .review-author')
      .map((_, el) => $(el).text())
      .get();
    expect(authors).toEqual(displayReviews.map((review) => review.author));
    expect($('.review-card')).toHaveLength(displayReviews.length);
    expect($('.review-card--featured')).toHaveLength(0);
    expect($('.keyword-pill')).toHaveLength(reviewsData.keywords.length + 1);
    expect($('script[type="application/ld+json"]').text()).toContain(
      String(reviewsData.totalReviews),
    );
    expect($('script[src="/js/reviews-filter.js"]').length).toBeGreaterThan(0);
  });

  it('clamps card text in a 3/2/1 grid and keeps the full review in the HTML', () => {
    expect(css).toContain('grid-template-columns:repeat(3,minmax(0,1fr))');
    expect(css).toContain('grid-template-columns:repeat(2,minmax(0,1fr))');
    expect(css).toContain('-webkit-line-clamp:6');
    expect(css).toContain('align-items:stretch');

    displayReviews.forEach((review) => {
      const card = $(`.review-card[data-keywords="${review.keywords.join(',')}"]`)
        .filter((_, el) => $(el).find('.review-author').text() === review.author)
        .first();
      expect(card.length).toBe(1);
      if (review.text) {
        expect(card.find('.review-text').text()).toBe(review.text);
      } else {
        expect(card.find('.review-text')).toHaveLength(0);
      }
      expect(card.find('.review-date').text()).toBe(review.date);
      expect(card.find('.review-stars').attr('aria-label')).toBe(
        `${review.rating} out of 5 stars`,
      );
    });
  });

  it('groups every review into one Fancybox inline gallery with the full text', () => {
    const links = $('.review-view-more');
    expect(links).toHaveLength(displayReviews.length);

    displayReviews.forEach((review, index) => {
      const link = links.eq(index);
      const detailId = `review-detail-${review.id}`;
      expect(link.attr('href')).toBe(`#${detailId}`);
      expect(link.attr('data-fancybox')).toBe('reviews');
      expect(link.attr('data-type')).toBe('inline');
      expect(link.attr('aria-label')).toContain(review.author);
      expect(link.text().trim()).toBe('View more');
      expect(link.is('a')).toBe(true);

      const detail = $(`#${detailId}`);
      expect(detail.length).toBe(1);
      expect(detail.find('.review-author').text()).toBe(review.author);
      expect(detail.find('.review-date').text()).toBe(review.date);
      expect(detail.find('.review-stars').attr('aria-label')).toBe(
        `${review.rating} out of 5 stars`,
      );
      if (review.text) {
        expect(detail.find('.review-lightbox__text').text()).toBe(review.text);
      } else {
        expect(detail.find('.review-lightbox__text')).toHaveLength(0);
      }
    });

    expect($('script[src="/js/reviews-lightbox.js"]').length).toBeGreaterThan(0);
    expect(css).toContain('overflow-y:auto');
    expect(css).toContain('prefers-reduced-motion:reduce');
  });
});
