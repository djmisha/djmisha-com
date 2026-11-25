import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';
import { getSiteCssAsset } from './helpers/site-css.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const bannerPath = '/images/banner.webp';
const retiredBanner = 'banner.jpg';
// Previous JPEG was 99,925 bytes. Stay under 90 KiB at the same 1600×995 frame.
const bannerByteBudget = 90 * 1024;

function webpSize(buffer) {
  if (
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error('not a webp file');
  }

  const fourcc = buffer.toString('ascii', 12, 16);
  if (fourcc === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (fourcc === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (fourcc === 'VP8X') {
    return {
      width: 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)),
      height: 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)),
    };
  }
  throw new Error(`unsupported webp chunk ${fourcc}`);
}

function cssUrlToPath(cssUrl, stylesheetHref) {
  return new URL(cssUrl, `http://local${stylesheetHref}`).pathname;
}

function htmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function bannerImagePreloads($) {
  return $('link[rel="preload"][as="image"]').filter((_, element) => {
    const href = $(element).attr('href') || '';
    return href.includes('banner');
  });
}

describe('homepage hero banner', () => {
  it('preloads the same WebP the banner CSS paints, and only that image', () => {
    const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const $ = load(html);
    const preloads = $('head link[rel="preload"][as="image"]');

    expect(preloads).toHaveLength(1);
    const preload = preloads.first();
    expect(preload.attr('href')).toBe(bannerPath);
    expect(preload.attr('type')).toBe('image/webp');
    expect(preload.attr('fetchpriority')).toBe('high');
    expect(preload.attr('imagesrcset')).toBeUndefined();
    expect(preload.attr('media')).toBeUndefined();

    const { css, href } = getSiteCssAsset(
      path.join(distDir, 'index.html'),
      distDir,
    );
    const bannerUrls = [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)]
      .map((match) => match[2])
      .filter((url) => url.includes('banner'));

    expect(bannerUrls).toEqual(['/images/banner.webp']);
    expect(cssUrlToPath(bannerUrls[0], href)).toBe(preload.attr('href'));
    expect(fs.existsSync(path.join(distDir, bannerPath.slice(1)))).toBe(true);
  });

  it('ships the full-frame WebP under the size budget', () => {
    for (const file of [
      path.join(root, 'public/images/banner.webp'),
      path.join(distDir, 'images/banner.webp'),
    ]) {
      const buffer = fs.readFileSync(file);
      expect(buffer.length).toBeLessThanOrEqual(bannerByteBudget);
      expect(webpSize(buffer)).toEqual({ width: 1600, height: 995 });
    }
  });

  it('does not preload the banner on any other page', () => {
    const home = path.join(distDir, 'index.html');
    const others = htmlFiles(distDir).filter((file) => file !== home);

    expect(others.length).toBeGreaterThan(5);
    for (const file of others) {
      const $ = load(fs.readFileSync(file, 'utf8'));
      expect(bannerImagePreloads($), file).toHaveLength(0);
    }
  });

  it('keeps the design guide on the WebP and drops banner.jpg everywhere', () => {
    const guide = fs.readFileSync(
      path.join(distDir, 'design-guide/index.html'),
      'utf8',
    );
    expect(guide).toContain('/images/banner.webp');
    expect(guide).not.toContain(retiredBanner);

    expect(fs.existsSync(path.join(root, 'public/images/banner.jpg'))).toBe(
      false,
    );
    expect(fs.existsSync(path.join(distDir, 'images/banner.jpg'))).toBe(false);

    const hits = [];

    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === '.git'
        ) {
          continue;
        }
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (entry.name.toLowerCase().includes(retiredBanner)) hits.push(full);
        if (full === fileURLToPath(import.meta.url)) continue;
        if (/\.(webp|png|jpe?g|gif|mp4|woff2?|ico|svg)$/i.test(entry.name)) {
          continue;
        }
        const buffer = fs.readFileSync(full);
        if (buffer.includes(0)) continue;
        if (buffer.toString('utf8').includes(retiredBanner)) hits.push(full);
      }
    }

    walk(root);

    for (const file of htmlFiles(distDir)) {
      const text = fs.readFileSync(file, 'utf8');
      if (text.includes(retiredBanner)) hits.push(file);
    }
    const { css, filePath } = getSiteCssAsset(
      path.join(distDir, 'index.html'),
      distDir,
    );
    if (css.includes(retiredBanner)) hits.push(filePath);

    expect(hits).toEqual([]);
  });
});
