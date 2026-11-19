import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

describe('locally hosted Poppins fonts', () => {
  it('uses the local font stylesheet and preloads Poppins on both pages', () => {
    ['/index.html', '/wedding-planning/index.html'].forEach((page) => {
      const html = fs.readFileSync(path.join(distDir, page), 'utf8');
      const $ = load(html);

      expect($('link[rel="stylesheet"][href="/css/fonts.css"]')).toHaveLength(
        1,
      );
      expect(
        $(
          'link[rel="preload"][as="font"][href="/fonts/poppins-300-latin.woff2"]',
        ),
      ).toHaveLength(1);
      expect($('link[href^="https://fonts."]')).toHaveLength(0);
    });
  });

  it('ships only the Poppins weights currently requested by the site', () => {
    const css = fs.readFileSync(path.join(distDir, 'css/fonts.css'), 'utf8');
    const weights = [...css.matchAll(/font-weight:\s*(\d+)/g)].map(
      (match) => match[1],
    );

    expect(new Set(weights)).toEqual(new Set(['200', '300', '400', '500']));
    expect(css.match(/font-display:\s*swap/g)).toHaveLength(8);
    const fontUrls = [...css.matchAll(/url\('([^']+\.woff2)'\)/g)].map(
      (match) => match[1],
    );

    expect(fontUrls.length).toBeGreaterThan(0);
    fontUrls.forEach((url) => {
      expect(fs.existsSync(path.join(distDir, url.slice(1)))).toBe(true);
    });
    expect(fs.existsSync(path.join(distDir, 'fonts/OFL.txt'))).toBe(true);
  });
});
