// @vitest-environment jsdom

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import { testimonialBackgroundImages } from '../src/data/testimonial-backgrounds.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentSource = fs.readFileSync(
  path.join(root, 'src/components/TestimonialQuote.astro'),
  'utf8',
);
const scriptSource = componentSource.match(/<script>([\s\S]*?)<\/script>/)?.[1];

if (!scriptSource) {
  throw new Error('TestimonialQuote.astro must define its background script');
}

const backgroundScript = ts.transpile(scriptSource);

describe('testimonial backgrounds', () => {
  it('assigns a distinct random background to each testimonial', () => {
    const markup = Array.from(
      { length: 3 },
      () =>
        `<section class="testimonial-quote" data-background-images='${JSON.stringify(
          testimonialBackgroundImages,
        )}'><div class="testimonial-quote__image"></div></section>`,
    ).join('');
    const dom = new JSDOM(`<body>${markup}</body>`, {
      runScripts: 'outside-only',
    });

    dom.window.eval(backgroundScript);

    const backgrounds = Array.from(
      dom.window.document.querySelectorAll('.testimonial-quote__image'),
      (image) => image.style.backgroundImage,
    );
    const availableBackgrounds = new Set(
      testimonialBackgroundImages.map((image) => `url("${image}")`),
    );

    expect(backgrounds).toHaveLength(3);
    expect(
      backgrounds.every((background) => availableBackgrounds.has(background)),
    ).toBe(true);
    expect(new Set(backgrounds).size).toBe(3);

    dom.window.close();
  });
});
