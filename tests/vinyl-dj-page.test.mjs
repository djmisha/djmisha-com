import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = path.join(root, 'dist/services/vinyl-dj-san-diego/index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const $ = load(html);
const canonicalUrl = 'https://djmisha.com/services/vinyl-dj-san-diego/';
const title = 'Vinyl DJ San Diego | Vinyl Record Only DJ Sets – DJ Misha';
const description =
  'Hire DJ Misha for a vinyl record only DJ set in San Diego. Two turntables, real records, no laptop. Weddings, parties and events. Check your date.';
const reviews = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/reviews.json'), 'utf8'),
);

function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

describe('vinyl DJ service page', () => {
  it('renders the required title, description, canonical, Open Graph, and Twitter tags', () => {
    expect($('title').text()).toBe(title);
    expect(title).toHaveLength(57);
    expect($('meta[name="description"]').attr('content')).toBe(description);
    expect(description).toHaveLength(146);
    expect($('link[rel="canonical"]').attr('href')).toBe(canonicalUrl);

    expect($('meta[property="og:title"]').attr('content')).toBe(title);
    expect($('meta[property="og:description"]').attr('content')).toBe(
      description,
    );
    expect($('meta[property="og:url"]').attr('content')).toBe(canonicalUrl);
    expect($('meta[property="og:type"]').attr('content')).toBe('website');
    expect($('meta[property="og:image"]').attr('content')).toBe(
      'https://djmisha.com/images/logo-djmisha.png',
    );

    expect($('meta[name="twitter:card"]').attr('content')).toBe(
      'summary_large_image',
    );
    expect($('meta[name="twitter:title"]').attr('content')).toBe(title);
    expect($('meta[name="twitter:description"]').attr('content')).toBe(
      description,
    );
  });

  it('uses one H1 and a continuous heading hierarchy', () => {
    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toBe('Vinyl-Only DJ in San Diego');

    const headings = $('header.major h1, #content h2, #content h3')
      .toArray()
      .map((heading) => Number(heading.tagName.slice(1)));
    expect(headings[0]).toBe(1);
    expect(
      headings.every(
        (level, index) => index === 0 || level <= headings[index - 1] + 1,
      ),
    ).toBe(true);

    for (const href of $('#content a[href^="#"]')
      .map((_, link) => $(link).attr('href'))
      .get()) {
      expect($(`#content ${href}`)).toHaveLength(1);
    }
  });

  it('emits parseable service, breadcrumb, and matching visible FAQ structured data', () => {
    const schemas = JSON.parse($('script[type="application/ld+json"]').html());
    const service = schemas.find((schema) => schema['@type'] === 'Service');
    const breadcrumbs = schemas.find(
      (schema) => schema['@type'] === 'BreadcrumbList',
    );
    const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');

    expect(service.url).toBe(canonicalUrl);
    expect(service.provider['@id']).toBe('#LocalBusiness');
    expect(breadcrumbs.itemListElement).toHaveLength(3);
    expect(breadcrumbs.itemListElement[2].item).toBe(canonicalUrl);
    expect(faq.mainEntity).toHaveLength(10);

    for (const { name, acceptedAnswer } of faq.mainEntity) {
      const question = $('#content h3').filter(
        (_, heading) => normalizeText($(heading).text()) === name,
      );
      expect(question).toHaveLength(1);
      expect(normalizeText(question.next('p').text())).toBe(
        acceptedAnswer.text,
      );
    }
  });

  it('renders the Birthday Party DJ image and caption with matching markup', () => {
    const image = $('#content .wp-block-image img');

    expect(image).toHaveLength(1);
    expect(image.attr('src')).toBe('/images/05-i-dsccmdj-l.jpg');
    expect(image.attr('alt')).toBe('DJing for 40th Birthday Party');
    expect(image.attr('width')).toBe('800');
    expect(image.attr('height')).toBe('534');
    expect(image.attr('style')).toBe('width:358px;height:239px');
    expect(image.attr('srcset')).toBe(
      '/images/05-i-dsccmdj-l.jpg 800w, /images/05-i-dsccmdj-l-300x200.jpg 300w, /images/05-i-dsccmdj-l-768x513.jpg 768w',
    );
    expect($('#content figcaption').text().trim()).toBe(
      'Spinning records at a birthday party',
    );
  });

  it('keeps the page free of prohibited copy', () => {
    expect($('#content video, #content iframe')).toHaveLength(0);

    const pageText = $('#content').text().toLowerCase();
    expect(pageText).not.toMatch(
      /microphone|\bmic\b|modern|today.?s|current hits/,
    );
  });

  it('uses three existing dance and energy reviews verbatim', () => {
    const testimonials = $('#content blockquote');

    expect(testimonials).toHaveLength(3);

    for (const testimonial of testimonials.toArray()) {
      const author = normalizeText($(testimonial).find('cite').text());
      const sourceReview = reviews.reviews.find(
        (review) => review.author === author,
      );

      expect(sourceReview).toBeDefined();
      expect(normalizeText($(testimonial).find('p').text())).toBe(
        normalizeText(sourceReview.text),
      );
    }
  });

  it('preserves spaces around the inline links in the DJ Misha and review copy', () => {
    const aboutLinksParagraph = $('#content a[href="/about/"]').parent();

    expect(normalizeText(aboutLinksParagraph.text())).toBe(
      "Learn more on About DJ Misha page, read client reviews, and listen to DJ Misha's mixes.",
    );
    expect(
      normalizeText($('#content a[href^="https://www.google.com"]').text()),
    ).toContain(`based on ${reviews.totalReviews} reviews`);
  });

  it('links every page-body destination and lists the route in both sitemaps and the footer', () => {
    const internalLinks = $('#content a[href^="/"]')
      .map((_, link) => $(link).attr('href'))
      .get()
      .filter((href) => !href.startsWith('#'));

    for (const href of internalLinks) {
      const targetPath = path.join(
        root,
        'dist',
        href === '/' ? 'index.html' : `${href.slice(1)}index.html`,
      );
      expect(fs.existsSync(targetPath), `${href} should be generated`).toBe(
        true,
      );
    }

    expect(
      fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8'),
    ).toContain(canonicalUrl);
    const sitemapPage = load(
      fs.readFileSync(path.join(root, 'dist/sitemap/index.html'), 'utf8'),
    );
    expect(
      sitemapPage('a[href="/services/vinyl-dj-san-diego/"]').length,
    ).toBeGreaterThan(0);
    expect(
      $('#footer .services-navigation a[href="/services/vinyl-dj-san-diego/"]'),
    ).toHaveLength(1);
  });
});
