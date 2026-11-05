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
  function setupTestimonials() {
    const markup = Array.from(
      { length: 3 },
      () =>
        `<section class="testimonial-quote" data-background-images='${JSON.stringify(
          testimonialBackgroundImages,
        )}'><div class="testimonial-quote__visual"><div class="testimonial-quote__image"></div><button class="testimonial-quote__next-photo" type="button">Next Photo</button></div></section>`,
    ).join('');
    const dom = new JSDOM(`<body>${markup}</body>`, {
      runScripts: 'outside-only',
    });

    dom.window.eval(backgroundScript);

    return {
      dom,
      testimonials: Array.from(
        dom.window.document.querySelectorAll('.testimonial-quote'),
      ),
      backgrounds: Array.from(
        dom.window.document.querySelectorAll('.testimonial-quote__image'),
        (image) => image.style.backgroundImage,
      ),
    };
  }

  it('assigns a distinct initial background to each testimonial without loading unused images', () => {
    const { dom, testimonials, backgrounds } = setupTestimonials();
    const availableBackgrounds = new Set(
      testimonialBackgroundImages.map((image) => `url("${image}")`),
    );

    expect(testimonials).toHaveLength(3);
    expect(
      backgrounds.every((background) => availableBackgrounds.has(background)),
    ).toBe(true);
    expect(new Set(backgrounds).size).toBe(3);
    expect(dom.window.document.querySelectorAll('img')).toHaveLength(0);

    dom.window.close();
  });

  it('advances only the clicked testimonial to the next image', () => {
    const { dom, testimonials, backgrounds } = setupTestimonials();
    const currentIndex = testimonialBackgroundImages.findIndex(
      (image) => `url("${image}")` === backgrounds[0],
    );
    const nextIndex = (currentIndex + 1) % testimonialBackgroundImages.length;

    testimonials[0].querySelector('button').click();

    expect(
      testimonials[0].querySelector('.testimonial-quote__image').style
        .backgroundImage,
    ).toBe(`url("${testimonialBackgroundImages[nextIndex]}")`);
    expect(
      testimonials[1].querySelector('.testimonial-quote__image').style
        .backgroundImage,
    ).toBe(backgrounds[1]);
    expect(
      testimonials[2].querySelector('.testimonial-quote__image').style
        .backgroundImage,
    ).toBe(backgrounds[2]);

    dom.window.close();
  });

  it('wraps from the last image to the first when clicked', () => {
    const { dom, testimonials } = setupTestimonials();
    const imageLayer = testimonials[0].querySelector(
      '.testimonial-quote__image',
    );
    const button = testimonials[0].querySelector('button');
    const currentImage = imageLayer.style.backgroundImage;
    const currentIndex = testimonialBackgroundImages.findIndex(
      (image) => `url("${image}")` === currentImage,
    );
    const clicksToLast =
      (testimonialBackgroundImages.length -
        1 -
        currentIndex +
        testimonialBackgroundImages.length) %
      testimonialBackgroundImages.length;

    for (let click = 0; click < clicksToLast; click += 1) {
      button.click();
    }

    expect(imageLayer.style.backgroundImage).toBe(
      `url("${testimonialBackgroundImages.at(-1)}")`,
    );

    button.click();

    expect(imageLayer.style.backgroundImage).toBe(
      `url("${testimonialBackgroundImages[0]}")`,
    );

    dom.window.close();
  });
});
