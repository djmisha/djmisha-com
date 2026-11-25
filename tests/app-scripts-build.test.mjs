import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const migratedScripts = [
  '/js/main.js',
  '/js/custom.js',
  '/js/reviews-filter.js',
  '/js/reviews-lightbox.js',
  '/js/multi-step-contact-form.js',
];

function readPage(route) {
  return fs.readFileSync(path.join(distDir, route), 'utf8');
}

function readModuleCode(route) {
  const $ = load(readPage(route));
  const visited = new Set();
  const modules = [];

  function visit(code, modulePath) {
    if (modulePath && visited.has(modulePath)) return;
    if (modulePath) visited.add(modulePath);
    modules.push(code);

    const imports = code.matchAll(
      /(?:import|export)\s*(?:[^'"]*?\sfrom\s*)?["']([^"']+\.js)["']/g,
    );
    for (const [, importPath] of imports) {
      if (!modulePath || !importPath.startsWith('.')) continue;
      const importedPath = path.posix.join(
        path.posix.dirname(modulePath),
        importPath,
      );
      if (visited.has(importedPath)) continue;
      visit(
        fs.readFileSync(path.join(distDir, importedPath.slice(1)), 'utf8'),
        importedPath,
      );
    }
  }

  $('script[type="module"]').each((_, script) => {
    const src = $(script).attr('src');
    if (!src) {
      visit($(script).text());
      return;
    }
    if (!src.startsWith('/_astro/')) {
      throw new Error(`Unexpected Astro module URL: ${src}`);
    }
    const modulePath = src;
    visit(
      fs.readFileSync(path.join(distDir, src.slice(1)), 'utf8'),
      modulePath,
    );
  });

  return modules.join('\n');
}

describe('Astro-managed application scripts', () => {
  it('removes migrated first-party scripts from public URLs and output', () => {
    for (const route of [
      'index.html',
      'about/index.html',
      'reviews/index.html',
      'contact/index.html',
    ]) {
      const $ = load(readPage(route));
      for (const src of migratedScripts) {
        expect($(`script[src="${src}"]`), route).toHaveLength(0);
      }
    }

    for (const src of migratedScripts) {
      expect(fs.existsSync(path.join(distDir, src.slice(1)))).toBe(false);
    }
  });

  it('loads page features only where their markup is used', () => {
    const homeModules = readModuleCode('index.html');
    const aboutModules = readModuleCode('about/index.html');
    const reviewsModules = readModuleCode('reviews/index.html');
    const contactModules = readModuleCode('contact/index.html');
    const testimonialModules = readModuleCode('dj-saxophone/index.html');

    expect(homeModules).toContain('video-mobile.mp4');
    expect(homeModules).toContain('.homepage-review-candidate');
    expect(homeModules).not.toContain('review-card-hidden');
    expect(aboutModules).toContain('ngg-gallery-sidebar');
    expect(aboutModules).not.toContain('video-mobile.mp4');
    expect(aboutModules).not.toContain('review-card-hidden');
    expect(reviewsModules).toContain('review-card-hidden');
    expect(reviewsModules).not.toContain('video-mobile.mp4');
    expect(contactModules).toContain('mscf-input-name');
    expect(contactModules).not.toContain('review-card-hidden');
    expect(testimonialModules).toContain('.home-testi');
  });

  it('keeps the standalone wedding-planning script isolated', () => {
    const $ = load(readPage('wedding-planning/index.html'));

    expect($('script[src="/wedding-planning/pf.js"][defer]')).toHaveLength(1);
    expect($('script[type="module"]')).toHaveLength(0);
  });
});
