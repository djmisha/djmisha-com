import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const customJsPath = path.join(root, 'public/js/custom.js');
const source = fs.readFileSync(customJsPath, 'utf8');
const posterPath = '/images/home-video-first-frame.webp';

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

function braceDepthAt(text, index) {
  let depth = 0;
  for (let i = 0; i < index; i += 1) {
    const char = text[i];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
  }
  return depth;
}

function loadHomeVideo({
  width = 1280,
  withObserver = true,
  intersectingOnObserve = false,
  hasSection = true,
} = {}) {
  const homeVideo = { html: '' };
  let writes = 0;
  Object.defineProperty(homeVideo, 'innerHTML', {
    configurable: true,
    get() {
      return this.html;
    },
    set(value) {
      writes += 1;
      this.html = value;
    },
  });

  const section = { id: 'one' };
  const listeners = { scroll: [], wheel: [], touchstart: [] };
  const timeouts = [];
  const observers = [];

  class IntersectionObserverStub {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.disconnected = false;
      this.observed = [];
      observers.push(this);
    }

    observe(target) {
      this.observed.push(target);
      if (intersectingOnObserve) {
        this.callback([{ isIntersecting: true, target }]);
      }
    }

    disconnect() {
      this.disconnected = true;
    }
  }

  const windowStub = {
    innerWidth: width,
    addEventListener(type, fn, options) {
      listeners[type].push({ fn, options });
    },
    removeEventListener(type, fn) {
      listeners[type] = listeners[type].filter((listener) => listener.fn !== fn);
    },
  };

  const documentStub = {
    querySelector(selector) {
      if (!hasSection) return null;
      if (selector === '#one .home-video') return homeVideo;
      if (selector === '#one') return section;
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };

  function $(arg) {
    if (typeof arg === 'function') {
      arg();
      return undefined;
    }
    return {
      scroll() {
        return this;
      },
      scrollTop() {
        return 0;
      },
      off() {
        return this;
      },
      addClass() {
        return this;
      },
      removeClass() {
        return this;
      },
      hasClass() {
        return false;
      },
    };
  }

  const context = {
    console,
    document: documentStub,
    window: windowStub,
    setTimeout(fn, delay) {
      timeouts.push({ fn, delay });
      return timeouts.length;
    },
    clearTimeout() {},
    setInterval() {
      return 0;
    },
    clearInterval() {},
    $,
  };

  if (withObserver) context.IntersectionObserver = IntersectionObserverStub;

  vm.runInContext(source, vm.createContext(context));

  return { homeVideo, section, listeners, timeouts, observers, writes: () => writes };
}

function expectVideoFile(html, file) {
  expect(html).toContain('playsinline');
  expect(html).toContain('autoplay');
  expect(html).toContain('muted');
  expect(html).toContain('loop');
  expect(html).toContain('class="bgvid"');
  expect(html).toContain(`poster="${posterPath}"`);
  expect(html).toContain(
    `<source src="https://grooverooster.com/images/djmisha/${file}" type="video/mp4">`,
  );
  expect(html.match(/<video/g)).toHaveLength(1);
}

describe('homepage background video loading', () => {
  it('keeps the one second timer only as the IntersectionObserver fallback', () => {
    const calls = source.match(/setTimeout\(\s*attachVideo\s*,\s*1000\s*\)/g);
    expect(calls).toEqual(['setTimeout(attachVideo, 1000)']);

    const index = source.indexOf('setTimeout(attachVideo, 1000)');
    const before = source.slice(Math.max(0, index - 180), index);
    expect(before).toContain('typeof IntersectionObserver !== "function"');
    expect(braceDepthAt(source, index)).toBeGreaterThan(0);
    expect(source).toContain('new IntersectionObserver');
    expect(source).toContain('"#one"');
    expect(source).toContain('rootMargin: "0px 0px 100% 0px"');
    expect(source).toContain('addEventListener("scroll", start, listenerOptions)');
    expect(source).toContain('addEventListener("wheel", start, listenerOptions)');
    expect(source).toContain(
      'addEventListener("touchstart", start, listenerOptions)',
    );
    expect(source).toContain('passive: true');
    expect(source).toContain('observer.disconnect()');
    expect(source).toContain('removeEventListener("scroll", start, listenerOptions)');
    expect(source).not.toMatch(/^setTimeout\(attachVideo, 1000\);/m);
  });

  it('does not attach the video on load when #one is off-screen', () => {
    const page = loadHomeVideo({ intersectingOnObserve: false, width: 375 });

    expect(page.writes()).toBe(0);
    expect(page.homeVideo.innerHTML).toBe('');
    expect(page.timeouts).toHaveLength(0);
    expect(page.observers).toHaveLength(1);
    expect(page.observers[0].options).toEqual({
      rootMargin: '0px 0px 100% 0px',
    });
    expect(page.observers[0].observed).toEqual([page.section]);
    expect(page.observers[0].disconnected).toBe(false);
    for (const type of ['scroll', 'wheel', 'touchstart']) {
      expect(page.listeners[type]).toHaveLength(1);
      expect(page.listeners[type][0].options).toEqual({ passive: true });
    }
  });

  it('attaches once when the observer reports #one is already near the viewport', () => {
    const page = loadHomeVideo({
      intersectingOnObserve: true,
      width: 1280,
    });

    expect(page.writes()).toBe(1);
    expectVideoFile(page.homeVideo.innerHTML, 'video.mp4');
    expect(page.observers[0].disconnected).toBe(true);
    for (const type of ['scroll', 'wheel', 'touchstart']) {
      expect(page.listeners[type]).toHaveLength(0);
    }

    page.observers[0].callback([{ isIntersecting: true, target: page.section }]);
    expect(page.writes()).toBe(1);
  });

  it('ignores a non-intersecting observer entry, then attaches on the first scroll once', () => {
    const page = loadHomeVideo({ width: 375 });
    const scroll = page.listeners.scroll[0].fn;

    page.observers[0].callback([{ isIntersecting: false, target: page.section }]);
    expect(page.writes()).toBe(0);

    scroll();
    expect(page.writes()).toBe(1);
    expectVideoFile(page.homeVideo.innerHTML, 'video-mobile.mp4');
    expect(page.observers[0].disconnected).toBe(true);
    expect(page.listeners.scroll).toHaveLength(0);
    expect(page.listeners.wheel).toHaveLength(0);
    expect(page.listeners.touchstart).toHaveLength(0);

    scroll();
    page.listeners.wheel.forEach((listener) => listener.fn());
    expect(page.writes()).toBe(1);
  });

  it('attaches from the first wheel or touchstart and still only once', () => {
    const wheelPage = loadHomeVideo({ width: 769 });
    const wheel = wheelPage.listeners.wheel[0].fn;
    const wheelTouch = wheelPage.listeners.touchstart[0].fn;
    const wheelScroll = wheelPage.listeners.scroll[0].fn;
    wheel();
    wheelTouch();
    wheelScroll();
    expect(wheelPage.writes()).toBe(1);
    expectVideoFile(wheelPage.homeVideo.innerHTML, 'video.mp4');

    const touchPage = loadHomeVideo({ width: 768 });
    const touch = touchPage.listeners.touchstart[0].fn;
    const touchWheel = touchPage.listeners.wheel[0].fn;
    touch();
    touchWheel();
    expect(touchPage.writes()).toBe(1);
    expectVideoFile(touchPage.homeVideo.innerHTML, 'video-mobile.mp4');
  });

  it('uses the one second timer when IntersectionObserver is missing', () => {
    const page = loadHomeVideo({
      withObserver: false,
      width: 320,
    });

    expect(page.observers).toHaveLength(0);
    expect(page.listeners.scroll).toHaveLength(0);
    expect(page.listeners.wheel).toHaveLength(0);
    expect(page.listeners.touchstart).toHaveLength(0);
    expect(page.timeouts).toEqual([
      expect.objectContaining({ delay: 1000 }),
    ]);
    expect(page.homeVideo.innerHTML).toBe('');

    page.timeouts[0].fn();
    expect(page.writes()).toBe(1);
    expectVideoFile(page.homeVideo.innerHTML, 'video-mobile.mp4');

    const desktop = loadHomeVideo({ withObserver: false, width: 1024 });
    desktop.timeouts[0].fn();
    expectVideoFile(desktop.homeVideo.innerHTML, 'video.mp4');
  });

  it('does nothing on pages without #one when IntersectionObserver exists', () => {
    const page = loadHomeVideo({ hasSection: false });
    expect(page.writes()).toBe(0);
    expect(page.observers).toHaveLength(0);
    expect(page.timeouts).toHaveLength(0);
  });
});

describe('homepage video poster image', () => {
  const imageFile = path.join(root, 'public/images/home-video-first-frame.webp');

  it('points the poster and the #one image at the new first-frame file', () => {
    expect(fs.existsSync(imageFile)).toBe(true);
    const size = webpSize(fs.readFileSync(imageFile));
    expect(size).toEqual({ width: 1080, height: 608 });

    expect(source).toContain(`poster="${posterPath}"`);
    expect(source).not.toContain('pic02');

    const astro = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
    const section = astro.match(/<section id="one"[\s\S]*?<\/section>/);
    expect(section).not.toBeNull();
    const img = load(section[0])('span.image.fit.main img');
    expect(img.attr('src')).toBe(posterPath);
    expect(img.attr('alt')).toBe('san diego dj');
    expect(img.attr('width')).toBe(String(size.width));
    expect(img.attr('height')).toBe(String(size.height));
  });

  it('keeps the still image visible until the video is playing', () => {
    const css = fs.readFileSync(path.join(root, 'public/css/site.css'), 'utf8');
    expect(source).toContain('section.classList.add("home-video-playing")');
    expect(source).toContain('addEventListener("playing"');
    expect(css).toMatch(/#one img \{\s*opacity: 1;\s*height: auto;/);
    expect(css).toMatch(/#one\.home-video-playing img \{\s*opacity: 0;/);
    expect(css).toMatch(/#one video \{[^}]*opacity: 0;/);
    expect(css).toMatch(/#one\.home-video-playing video \{\s*opacity: 1;/);
  });

  it('does not reference the old pic02 image anywhere', () => {
    const hits = [];

    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
          continue;
        }
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (entry.name.toLowerCase().includes('pic02')) hits.push(full);
        if (full === fileURLToPath(import.meta.url)) continue;
        if (/\.(webp|png|jpe?g|gif|mp4|woff2?|ico|svg)$/i.test(entry.name)) continue;
        const buffer = fs.readFileSync(full);
        if (buffer.includes(0)) continue;
        if (buffer.toString('utf8').includes('pic02')) hits.push(full);
      }
    }

    walk(root);
    expect(hits).toEqual([]);
    expect(fs.existsSync(path.join(root, 'public/images/pic02.jpg'))).toBe(false);
  });
});
