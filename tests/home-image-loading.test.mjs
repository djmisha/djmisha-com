import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const $ = load(html);

const heroSrc = '/images/djmisha-1.webp';
const heroAlt = 'DJ Misha playing dance music';
const heroScript = $('script')
  .map((_, element) => $(element).html() || '')
  .get()
  .find((script) => script.includes('assignRandomHomepageHeroImage'));

if (!heroScript) {
  throw new Error('Homepage must inline its random hero image script');
}

// Below the hero on the built home page. Dimensions are the file's real size.
const belowFold = [
  '/images/home-video-first-frame.webp',
  '/images/pic03.jpg',
  '/images/pic04.jpg',
  '/images/dj-service-wedding.jpg',
  '/images/dj-service-corporate.jpg',
  '/images/dj-service-party.jpg',
  '/images/vid4.jpg',
  '/images/vid1.jpg',
  '/images/vid2.jpg',
  '/images/vid3.jpg',
];

function imageSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (filePath.endsWith('.png')) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  if (filePath.endsWith('.webp')) {
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

  let offset = 2;
  while (offset < buffer.length - 8) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01) {
      offset += 2;
      continue;
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error(`no jpeg size in ${filePath}`);
}

function imgsFor(src) {
  return $('img').filter((_, element) => $(element).attr('src') === src);
}

describe('homepage image loading', () => {
  it('randomly assigns either homepage hero image with its actual dimensions', () => {
    expect($('script[src="/js/homepage-hero-image.js"]')).toHaveLength(0);

    const choices = [
      {
        random: 0,
        src: '/images/djmisha-1.webp',
        width: 484,
        height: 484,
      },
      {
        random: 0.999,
        src: '/images/djmisha-2.webp',
        width: 526,
        height: 526,
      },
    ];

    for (const { random, ...choice } of choices) {
      const heroImage = { alt: heroAlt };
      vm.runInNewContext(heroScript, {
        document: {
          querySelector: () => heroImage,
        },
        Math: {
          floor: Math.floor,
          random: () => random,
        },
      });

      expect(heroImage.src).toBe(choice.src);
      expect(heroImage.alt).toBe(heroAlt);
      expect(imageSize(path.join(root, 'public', choice.src.slice(1)))).toEqual(
        { width: choice.width, height: choice.height },
      );
    }
  });

  it('keeps the hero photo eager and gives it the file dimensions', () => {
    const hero = imgsFor(heroSrc);
    expect(hero).toHaveLength(1);
    expect(hero.attr('loading')).not.toBe('lazy');
    expect(hero.attr('alt')).toBe(heroAlt);
    expect(hero.attr('width')).toBe('484');
    expect(hero.attr('height')).toBe('484');
    expect(imageSize(path.join(root, 'public/images/djmisha-1.webp'))).toEqual({
      width: 484,
      height: 484,
    });
    expect(hero.parents('#banner')).toHaveLength(1);

    $('#banner img').each((_, element) => {
      expect($(element).attr('loading')).not.toBe('lazy');
    });
  });

  it('lazy-loads each below-fold image at its real width and height', () => {
    for (const src of belowFold) {
      const img = imgsFor(src);
      expect(img, src).toHaveLength(1);
      expect(img.attr('loading'), src).toBe('lazy');
      expect(img.attr('decoding'), src).toBe('async');
      expect(img.attr('src'), src).toBe(src);

      const size = imageSize(path.join(root, 'public', src.slice(1)));
      expect(img.attr('width'), src).toBe(String(size.width));
      expect(img.attr('height'), src).toBe(String(size.height));
    }
  });

  it('does not lazy-load any image in the hero', () => {
    const lazyInHero = $('#banner img').filter(
      (_, element) => $(element).attr('loading') === 'lazy',
    );
    expect(lazyInHero).toHaveLength(0);
    expect(imgsFor(heroSrc).attr('loading')).not.toBe('lazy');
  });

  it('keeps the sticky photo eager so the slide-out button does not pop in', () => {
    const img = $('.lets-chat img');
    expect(img).toHaveLength(1);
    expect(img.attr('src')).toBe('/images/djmisha-chat.webp');
    expect(img.attr('loading')).not.toBe('lazy');
    expect(img.attr('decoding')).toBe('async');
    expect(
      imageSize(path.join(root, 'public/images/djmisha-chat.webp')),
    ).toEqual({
      width: 240,
      height: 240,
    });
    expect(img.attr('width')).toBe('240');
    expect(img.attr('height')).toBe('240');
    expect(fs.existsSync(path.join(root, 'public/images/expert-1.png'))).toBe(
      true,
    );
  });
});
