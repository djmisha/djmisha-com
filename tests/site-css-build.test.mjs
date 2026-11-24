import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';
import { getSiteCssAsset } from './helpers/site-css.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const sourceCss = fs.readFileSync(
  path.join(root, 'src/styles/site.css'),
  'utf8',
);

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(filePath);
    return entry.isFile() && entry.name.endsWith('.html') ? [filePath] : [];
  });
}

function bundledCssAssets(htmlPath) {
  const $ = load(fs.readFileSync(htmlPath, 'utf8'));

  return $('link[rel="stylesheet"]')
    .map((_, link) => $(link).attr('href'))
    .get()
    .filter((href) => href?.startsWith('/_astro/') && href.endsWith('.css'))
    .map((href) => ({
      href,
      css: fs.readFileSync(path.join(distDir, href.slice(1)), 'utf8'),
    }));
}

describe('site stylesheet build output', () => {
  it('emits one fingerprinted, minified stylesheet for every shared-layout page', () => {
    const pages = htmlFiles(distDir).filter(
      (filePath) =>
        !filePath.includes(`${path.sep}wedding-planning${path.sep}`),
    );

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const { href, css } = getSiteCssAsset(page, distDir);

      expect(href).toMatch(/^\/_astro\/.+\.[\w-]+\.css$/);
      expect(css.length).toBeLessThan(sourceCss.length);
      expect(css).toContain('Based on "Landed" by HTML5 UP');
      expect(css).toContain('CCA 3.0 license');
    }
  });

  it('keeps CSS image URLs valid after bundling', () => {
    const { css } = getSiteCssAsset(path.join(distDir, 'index.html'), distDir);

    expect(css).toContain('/images/banner.webp');
    expect(css).toContain('/css/images/overlay.png');
    expect(css).toContain('/css/images/arrow.svg');
    expect(fs.existsSync(path.join(distDir, 'images/banner.webp'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'css/images/overlay.png'))).toBe(
      true,
    );
    expect(fs.existsSync(path.join(distDir, 'css/images/arrow.svg'))).toBe(
      true,
    );
  });

  it('loads site styles before Fancybox and fingerprints both stylesheets', () => {
    const htmlPath = path.join(distDir, 'reviews/index.html');
    const assets = bundledCssAssets(htmlPath);
    const siteIndex = assets.findIndex(({ css }) =>
      css.includes('--color-bg-primary:'),
    );
    const fancyboxIndex = assets.findIndex(({ css }) =>
      css.includes('.fancybox-container'),
    );

    expect(siteIndex).toBeGreaterThanOrEqual(0);
    expect(fancyboxIndex).toBeGreaterThanOrEqual(0);
    if (siteIndex === fancyboxIndex) {
      expect(
        assets[siteIndex].css.indexOf('body.landing #header'),
      ).toBeLessThan(assets[siteIndex].css.indexOf('.fancybox-container'));
    } else {
      expect(siteIndex).toBeLessThan(fancyboxIndex);
    }

    const $ = load(fs.readFileSync(htmlPath, 'utf8'));
    expect($('link[href="/css/jquery.fancybox.min.css"]')).toHaveLength(0);
    expect(
      fs.existsSync(path.join(distDir, 'css/jquery.fancybox.min.css')),
    ).toBe(false);
  });

  it('keeps the standalone wedding-planning page on its own stylesheet', () => {
    const html = fs.readFileSync(
      path.join(distDir, 'wedding-planning/index.html'),
      'utf8',
    );
    const $ = load(html);
    const bundledStylesheets = $('link[rel="stylesheet"]')
      .map((_, link) => $(link).attr('href'))
      .get()
      .filter((href) => href?.startsWith('/_astro/') && href.endsWith('.css'));

    expect(bundledStylesheets).toHaveLength(0);
    expect($('link[href="/wedding-planning/pf.css"]')).toHaveLength(1);
  });
});
