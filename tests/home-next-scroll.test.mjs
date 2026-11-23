import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const $ = load(homeHtml);

describe('homepage next-link scrolling', () => {
  it('keeps the Next controls as native anchor links without the Scrolly script', () => {
    const links = $('a.goto-next');

    expect(links.map((_, element) => $(element).attr('href')).get()).toEqual([
      '#one',
      '#two',
      '#three',
      '#four',
    ]);
    expect(
      links.filter((_, element) => $(element).hasClass('scrolly')),
    ).toHaveLength(0);
    expect($('script[src="/js/jquery.scrolly.min.js"]')).toHaveLength(0);
    expect(fs.existsSync(path.join(distDir, 'js/jquery.scrolly.min.js'))).toBe(
      false,
    );
    expect(
      fs.readFileSync(path.join(root, 'public/js/main.js'), 'utf8'),
    ).not.toContain('.scrolly');
  });

  it('uses CSS smooth scrolling and respects reduced-motion preferences', () => {
    const css = fs.readFileSync(path.join(distDir, 'css/site.css'), 'utf8');

    expect(css).toMatch(/html\s*\{[^}]*scroll-behavior:\s*smooth;/);
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*html\s*\{[^}]*scroll-behavior:\s*auto;/,
    );
  });
});
