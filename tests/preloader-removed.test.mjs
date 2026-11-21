import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

function htmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

describe('Landed preloader removed', () => {
  it('keeps the landing class on the home page and drops is-preload', () => {
    const $ = load(fs.readFileSync(path.join(distDir, 'index.html'), 'utf8'));
    const classes = ($('body').attr('class') || '').split(/\s+/).filter(Boolean);

    expect(classes).toContain('landing');
    expect(classes).not.toContain('is-preload');
  });

  it('does not leave is-preload on any built page', () => {
    const hits = htmlFiles(distDir).filter((file) =>
      fs.readFileSync(file, 'utf8').includes('is-preload'),
    );

    expect(hits).toEqual([]);
  });

  it('removes the spinner and cover from site.css and noscript.css', () => {
    const site = fs.readFileSync(path.join(distDir, 'css/site.css'), 'utf8');
    const noscript = fs.readFileSync(
      path.join(distDir, 'css/noscript.css'),
      'utf8',
    );

    for (const css of [site, noscript]) {
      expect(css).not.toMatch(/spinner-show|spinner-hide|spinner-rotate/);
      expect(css).not.toMatch(/overlay-hide/);
      expect(css).not.toMatch(/body\.landing:before/);
      expect(css).not.toMatch(/body\.landing:after/);
      expect(css).not.toMatch(/body\.is-preload/);
      expect(css).not.toContain('is-preload');
    }
  });

  it('keeps the landing header, page wrapper, and dropdown rules', () => {
    const site = fs.readFileSync(path.join(distDir, 'css/site.css'), 'utf8');

    expect(site).toMatch(
      /body\.landing #header \{[^}]*background: transparent;[^}]*box-shadow: none;[^}]*position: absolute;/,
    );
    expect(site).toMatch(/body\.landing #page-wrapper \{[^}]*padding-top: 0;/);
    expect(site).toMatch(
      /body\.landing \.dropotron\.level-0 \{[^}]*margin-top: 0;/,
    );
  });

  it('stops main.js from removing is-preload and keeps scrollex', () => {
    const js = fs.readFileSync(path.join(distDir, 'js/main.js'), 'utf8');

    expect(js).not.toContain('is-preload');
    expect(js).toContain('.scrollex(');
    expect(js).toContain("addClass('inactive')");
    expect(js).toContain('id="scrollex-lock"');
    expect(js).toContain('$scrollexLock.remove()');
  });
});
