import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const siteCss = fs.readFileSync(path.join(root, 'src/styles/site.css'), 'utf8');
const mainScript = fs.readFileSync(
  path.join(root, 'src/scripts/main.js'),
  'utf8',
);

function findHtmlPages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlPages(entryPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function getColorToken(token) {
  const color = siteCss.match(
    new RegExp(`${token}:\\s*(#[\\da-f]{6})`, 'i'),
  )?.[1];
  if (!color) throw new Error(`Missing color token: ${token}`);
  return color;
}

function luminance(color) {
  const channels = color
    .slice(1)
    .match(/../g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('site accessibility structure', () => {
  const htmlPages = findHtmlPages(distDir);

  it('renders exactly one main landmark and allows zoom on every page', () => {
    expect(htmlPages.length).toBeGreaterThan(0);

    htmlPages.forEach((pagePath) => {
      const $ = load(fs.readFileSync(pagePath, 'utf8'));
      const viewport = $('meta[name="viewport"]').attr('content') || '';
      const maximumScale = viewport.match(/maximum-scale\s*=\s*([\d.]+)/i);

      expect($('main').length, pagePath).toBe(1);
      expect(viewport, pagePath).toMatch(/width\s*=\s*device-width/i);
      expect(viewport, pagePath).not.toMatch(
        /user-scalable\s*=\s*(no|0|false)/i,
      );
      if (maximumScale) {
        expect(Number(maximumScale[1]), pagePath).toBeGreaterThanOrEqual(5);
      }
    });
  });

  it('uses AA contrast for footer navigation in normal and hover states', () => {
    const footerBackgroundToken = siteCss.match(
      /#footer\s*\{[^}]*background:\s*var\((--[\w-]+)\)/,
    )?.[1];
    const footerLinkToken = siteCss.match(
      /\.menu-footer-navigation a,\s*\.services-navigation a\s*\{[^}]*color:\s*var\((--[\w-]+)\)/,
    )?.[1];
    const hoverLinkToken = siteCss.match(
      /(?:^|\n)a:hover\s*\{[^}]*color:\s*var\((--[\w-]+)\)/,
    )?.[1];

    expect(footerBackgroundToken).toBeDefined();
    expect(footerLinkToken).toBeDefined();
    expect(hoverLinkToken).toBeDefined();
    const background = getColorToken(footerBackgroundToken);
    expect(
      contrastRatio(getColorToken(footerLinkToken), background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(getColorToken(hoverLinkToken), background),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('gives shared contact links a consistent accessible name', () => {
    const $ = load(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'));
    const contactLabels = $(
      'header#header a[href="/contact/"], #footer a[href="/contact/"]',
    )
      .map((_, link) => $(link).attr('aria-label'))
      .get();

    expect(contactLabels.length).toBeGreaterThan(1);
    expect(new Set(contactLabels).size).toBe(1);
  });

  it('names the dynamically generated mobile navigation toggle', () => {
    expect(mainScript).toMatch(
      /<a href="#navPanel" class="toggle" aria-label="Toggle navigation menu"><\/a>/,
    );
  });

  it('gives homepage Learn More links descriptive names', () => {
    const $ = load(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'));
    const linkLabels = $('a.button')
      .filter((_, link) => $(link).text().trim() === 'Learn More')
      .map((_, link) => $(link).attr('aria-label'))
      .get();

    expect(linkLabels).toEqual([
      'Learn more about DJ services',
      'Learn more about wedding DJ services',
      'Learn more about corporate event DJ services',
      'Learn more about private party DJ services',
    ]);
  });

  it('matches the review shuffle button name to its visible label', () => {
    const $ = load(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'));
    const shuffleButton = $('.homepage-review-rotate');

    expect(shuffleButton.attr('aria-label')).toBe('Shuffle reviews');
    expect(shuffleButton.text().trim()).toBe('Shuffle reviews');
  });
});
