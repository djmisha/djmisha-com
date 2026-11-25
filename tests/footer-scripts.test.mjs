import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const publicJsDir = path.join(root, 'public/js');
const footerSource = fs.readFileSync(
  path.join(root, 'src/components/Footer.astro'),
  'utf8',
);
const footerEntry = fs.readFileSync(
  path.join(root, 'src/scripts/footer.js'),
  'utf8',
);
const fancyboxInitializer = fs.readFileSync(
  path.join(root, 'src/scripts/footer-fancybox.js'),
  'utf8',
);
const sharedScriptSources = [
  '/js/jquery.min.js',
  '/js/jquery.dropotron.min.js',
  '/js/jquery.scrollex.min.js',
  '/js/browser.min.js',
  '/js/breakpoints.min.js',
  '/js/util.js',
  '/js/jquery.fancybox.min.js',
];

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(filePath);
    return entry.isFile() && entry.name.endsWith('.html') ? [filePath] : [];
  });
}

describe('shared footer scripts', () => {
  it('accounts for every public JavaScript asset in the shared script stack', () => {
    const publicJsFiles = fs
      .readdirSync(publicJsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
      .map((entry) => entry.name)
      .sort();
    const referencedFiles = sharedScriptSources
      .map((src) => path.basename(src))
      .sort();

    expect(publicJsFiles).toEqual(referencedFiles);
    for (const src of sharedScriptSources) {
      expect(fs.existsSync(path.join(publicJsDir, path.basename(src)))).toBe(
        true,
      );
    }
  });

  it('defers the shared script stack without changing its dependency order', () => {
    const pages = htmlFiles(distDir).filter(
      (filePath) =>
        !filePath.includes(`${path.sep}wedding-planning${path.sep}`),
    );

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const $ = load(fs.readFileSync(page, 'utf8'));
      const scripts = $('script[src]')
        .toArray()
        .filter((script) =>
          sharedScriptSources.includes($(script).attr('src')),
        );

      expect(scripts.map((script) => $(script).attr('src'))).toEqual(
        sharedScriptSources,
      );
      for (const script of scripts) {
        expect($(script).attr('defer')).toBeDefined();
        expect($(script).attr('async')).toBeUndefined();
      }
    }
  });

  it('initializes Fancybox from an Astro module after deferred scripts finish', () => {
    expect(footerSource).toContain(
      '<script src="../scripts/footer.js"></script>',
    );
    expect(footerEntry).toMatch(
      /document\.addEventListener\(\s*'DOMContentLoaded'[\s\S]*initializeFooterFancybox\(\)/,
    );
    expect(footerEntry).toContain('initializeMain();');
    expect(footerEntry).toContain('initializeSiteCta();');
    expect(fancyboxInitializer).toContain(
      "throw new Error('Fancybox did not load before its initializer');",
    );
    expect(fancyboxInitializer).toContain("$('[data-fancybox]').fancybox");
  });
});
