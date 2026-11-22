import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const $ = load(html);
const reviewsData = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/reviews.json'), 'utf8'),
);

describe('homepage testimonial row', () => {
  it('renders an initial random selection of six eligible reviews', () => {
    const candidates = $('.homepage-review-candidate');
    const selected = $('.homepage-review-selected');

    expect(candidates.length).toBeGreaterThanOrEqual(3);
    expect(selected).toHaveLength(6);

    selected.each((_, card) => {
      const id = $(card).attr('data-review-id');
      const review = reviewsData.reviews.find((item) => item.id === id);
      expect(review).toBeTruthy();
      expect(review.author).not.toBe('Colby Smith');
      if (review.profilePhoto) {
        expect(review.profilePhoto).toBeTruthy();
        expect($(card).find('.homepage-review-avatar').attr('src')).toBe(
          review.profilePhoto,
        );
      } else {
        expect(
          $(card).find('.homepage-review-avatar-fallback').length,
        ).toBeGreaterThan(0);
      }
      expect(review.text.trim().length).toBeGreaterThan(300);
      expect(new Date(`${review.date}T00:00:00`).getTime()).toBeGreaterThan(
        new Date('2024-11-19T00:00:00').getTime(),
      );
      expect($(card).find('.homepage-review-text').text()).toBe(review.text);
    });
  });

  it('uses a three-card desktop grid with six cards and three on mobile', () => {
    const styles = fs.readFileSync(
      path.join(root, 'src/components/HomepageTestimonials.astro'),
      'utf8',
    );
    const compactStyles = styles.replace(/\s/g, '');

    expect(compactStyles).toContain(
      'grid-template-columns:repeat(3,minmax(0,1fr))',
    );
    expect(compactStyles).toContain('grid-template-columns:minmax(0,1fr)');
    expect(compactStyles).toContain('homepage-review-mobile-first');
    expect(compactStyles).toContain(
      'homepage-review-selected:not(.homepage-review-mobile-first)',
    );
  });

  it('matches the reviews-page card visual classes and styles', () => {
    const cards = $('.homepage-review-selected');
    expect(cards).toHaveLength(6);

    cards.each((_, card) => {
      expect($(card).hasClass('review-card')).toBe(true);
      expect($(card).find('.review-card-header')).toHaveLength(1);
      expect($(card).find('.review-avatar')).toHaveLength(1);
      expect($(card).find('.review-meta')).toHaveLength(1);
      expect($(card).find('.review-stars')).toHaveLength(1);
      expect($(card).find('.review-text')).toHaveLength(1);
      expect($(card).find('.review-card__footer')).toHaveLength(1);
      expect($(card).find('.review-view-more')).toHaveLength(1);
    });
  });

  it('keeps full testimonials in Fancybox inline sources', () => {
    const selected = $('.homepage-review-selected');

    selected.each((_, card) => {
      const id = $(card).attr('data-review-id');
      const link = $(card).find('.homepage-review-view-more');
      const detail = $(`#homepage-review-detail-${id}`);

      expect(link.attr('href')).toBe(`#homepage-review-detail-${id}`);
      expect(link.attr('data-fancybox')).toBe('homepage-reviews');
      expect(link.attr('data-type')).toBe('inline');
      expect(detail).toHaveLength(1);
      expect(detail.find('.homepage-review-lightbox-text').text()).toBe(
        reviewsData.reviews.find((review) => review.id === id).text,
      );
    });

    expect($('script[src="/js/reviews-lightbox.js"]')).toHaveLength(0);
  });

  it('includes an interactive rotate reviews control', () => {
    const rotate = $('.homepage-review-rotate');
    expect(rotate).toHaveLength(1);
    expect(rotate.attr('type')).toBe('button');
    expect(rotate.hasClass('button')).toBe(false);
    expect(rotate.attr('aria-label')).toBe('Shuffle reviews');
    expect(rotate.find('svg')).toHaveLength(1);
    expect(rotate.find('span').text().trim()).toBe('Shuffle reviews');
  });

  it('shows a working reviews CTA and aggregate rating schema', () => {
    const cta = $('.homepage-reviews-actions a');
    expect(cta.attr('href')).toBe('/reviews/');
    expect(cta.text().trim()).toBe('Read more reviews');

    const ratingLink = $('.homepage-testimonials__rating a');
    expect(ratingLink.text()).toContain(
      `DJ Misha is rated ${reviewsData.totalRating} out of 5 stars`,
    );
    expect(ratingLink.text()).toContain(
      `from ${reviewsData.totalReviews} Google reviews`,
    );

    const schemas = $('script[type="application/ld+json"]')
      .map((_, el) => JSON.parse($(el).text()))
      .get();
    const organization = schemas.find((schema) =>
      Array.isArray(schema)
        ? schema.some((item) => item['@type'] === 'Organization')
        : schema['@type'] === 'Organization',
    );
    const organizationData = Array.isArray(organization)
      ? organization.find((item) => item['@type'] === 'Organization')
      : organization;

    expect(organizationData.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: String(reviewsData.totalRating),
      reviewCount: String(reviewsData.totalReviews),
    });
  });
});
