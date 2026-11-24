import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

export function getSiteCssAsset(htmlPath, distDir) {
  const $ = load(fs.readFileSync(htmlPath, 'utf8'));
  const stylesheets = $('link[rel="stylesheet"]')
    .map((_, link) => $(link).attr('href'))
    .get()
    .filter((href) => href?.startsWith('/_astro/') && href.endsWith('.css'))
    .map((href) => {
      const filePath = path.join(distDir, href.slice(1));
      return {
        href,
        filePath,
        css: fs.readFileSync(filePath, 'utf8'),
      };
    })
    .filter(({ css }) => css.includes('--color-bg-primary:'));

  if (stylesheets.length !== 1) {
    throw new Error(
      `Expected one bundled site stylesheet in ${htmlPath}; found ${stylesheets.length}`,
    );
  }

  return stylesheets[0];
}
