// @vitest-environment jsdom

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptSource = fs.readFileSync(
  path.join(root, 'public/js/multi-step-contact-form.js'),
  'utf8',
);
const componentSource = fs.readFileSync(
  path.join(root, 'src/components/MultiStepContactForm.astro'),
  'utf8',
);

const formMarkup = `
  <meta name="recaptcha-site-key" content="">
  <button id="mscf-trigger-btn" type="button">Get a Quote</button>
  <div id="mscf-modal" aria-hidden="true">
    <div class="mscf-backdrop"></div>
    <div id="mscf-modal-body">
      <button id="mscf-back-btn" type="button"><span class="mscf-back-label">Close</span></button>
      <div id="mscf-progress-fill"></div>
      <span id="mscf-step-label"></span>
      ${[1, 2, 3, 4, 5]
        .map((step) => `<span class="mscf-step-dot" data-step="${step}"></span>`)
        .join('')}
      <form id="mscf-form">
        <div class="mscf-step" data-step="1">
          <input id="mscf-input-name" name="name">
          <span id="mscf-error-name"></span>
          <input id="mscf-input-email" name="email">
          <span id="mscf-error-email"></span>
          <input id="mscf-input-phone" name="phone">
          <span id="mscf-error-phone"></span>
        </div>
        <div class="mscf-step" data-step="2" hidden>
          <input id="mscf-input-venue" name="venue">
          <input id="mscf-input-date_time" name="date_time">
          <span id="mscf-error-date_time"></span>
          <input id="mscf-input-attendance" name="attendance" type="range" min="25" max="250" value="100">
          <div id="mscf-slider-bubble"></div>
        </div>
        <div class="mscf-step" data-step="3" hidden>
          <input type="checkbox" name="vibes[]" value="Chill">
          <input type="checkbox" name="vibes[]" value="Epic">
          <span id="mscf-error-vibes"></span>
        </div>
        <div class="mscf-step" data-step="4" hidden>
          <label class="mscf-service-card"><input type="radio" name="mscf-service" value="Wedding"></label>
          <label class="mscf-service-card"><input type="radio" name="mscf-service" value="Corporate"></label>
          <span id="mscf-error-service"></span>
        </div>
        <div class="mscf-step" data-step="5" hidden>
          <textarea id="mscf-input-message" name="message"></textarea>
          <span id="mscf-error-message"></span>
          <div id="mscf-error-banner"></div>
        </div>
        <input id="mscf-input-website" name="website">
        <button id="mscf-next-btn" type="button" disabled>Next</button>
        <button id="mscf-submit-btn" type="button" disabled>Submit</button>
      </form>
    </div>
  </div>
`;

let dom;

function dispatch(element, type) {
  element.dispatchEvent(new dom.window.Event(type, { bubbles: true }));
}

function setup({ savedState, hostname = 'localhost' } = {}) {
  dom = new JSDOM(`<body>${formMarkup}</body>`, {
    url: `http://${hostname}/contact/`,
    pretendToBeVisual: true,
  });
  dom.window.fetch = () => Promise.reject(new Error('fetch mock not configured'));

  if (savedState) {
    dom.window.sessionStorage.setItem('mscf_state', JSON.stringify(savedState));
  }

  const module = { exports: {} };
  const context = vm.createContext({
    Array,
    Date,
    Math,
    Object,
    URLSearchParams,
    clearTimeout,
    console,
    document: dom.window.document,
    fetch: (...args) => dom.window.fetch(...args),
    module,
    parseInt,
    setTimeout,
    sessionStorage: dom.window.sessionStorage,
    window: dom.window,
  });
  vm.runInContext(scriptSource, context);
  dom.window.document.dispatchEvent(
    new dom.window.Event('DOMContentLoaded', { bubbles: true }),
  );

  return { exports: module.exports, window: dom.window };
}

function input(id, value) {
  const element = dom.window.document.getElementById(id);
  element.value = value;
  dispatch(element, 'input');
  return element;
}

function fillStep1() {
  input('mscf-input-name', 'Alex Example');
  input('mscf-input-email', 'alex@example.com');
  input('mscf-input-phone', '(619) 555-1234');
}

function advanceTo(step) {
  for (let current = 1; current < step; current += 1) {
    if (current === 1) fillStep1();
    if (current === 2) input('mscf-input-date_time', 'June 15, 2026');
    if (current === 3) {
      const mood = dom.window.document.querySelector('input[name="vibes[]"]');
      mood.checked = true;
      dispatch(mood, 'change');
    }
    if (current === 4) {
      const service = dom.window.document.querySelector('input[name="mscf-service"]');
      service.checked = true;
      dispatch(service, 'change');
    }
    dom.window.document.getElementById('mscf-next-btn').click();
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  dom?.window.close();
  dom = undefined;
});

describe('multi-step contact form validation', () => {
  it('validates contact fields with whitespace and format boundaries', () => {
    const { exports } = setup();
    expect(exports.EMAIL_RE.test('person@example.com')).toBe(true);
    expect(exports.EMAIL_RE.test('person@example')).toBe(false);
    expect(exports.PHONE_RE.test('(619) 555-1234')).toBe(true);
    expect(exports.PHONE_RE.test('123')).toBe(false);

    fillStep1();
    expect(exports.isStep1Valid()).toBe(true);
    input('mscf-input-name', ' A ');
    expect(exports.isStep1Valid()).toBe(false);
  });

  it('requires date/time, a mood, a service, and ten non-whitespace message characters', () => {
    const { exports } = setup();
    expect(exports.isStep2Valid()).toBe(false);
    input('mscf-input-date_time', 'June 15, 2026');
    expect(exports.isStep2Valid()).toBe(true);

    expect(exports.isStep3Valid()).toBe(false);
    const mood = dom.window.document.querySelector('input[name="vibes[]"]');
    mood.checked = true;
    dispatch(mood, 'change');
    expect(exports.isStep3Valid()).toBe(true);

    expect(exports.isStep4Valid()).toBe(false);
    const service = dom.window.document.querySelector('input[name="mscf-service"]');
    service.checked = true;
    dispatch(service, 'change');
    expect(exports.isStep4Valid()).toBe(true);

    expect(exports.isStep5Valid()).toBe(false);
    input('mscf-input-message', '123456789 ');
    expect(exports.isStep5Valid()).toBe(false);
    input('mscf-input-message', 'A useful event detail');
    expect(exports.isStep5Valid()).toBe(true);
  });
});

describe('multi-step contact form DOM behavior', () => {
  it('opens and closes the modal and updates accessibility state', () => {
    setup();
    const modal = dom.window.document.getElementById('mscf-modal');
    dom.window.document.getElementById('mscf-trigger-btn').click();
    expect(modal.classList.contains('mscf-modal--open')).toBe(true);
    expect(modal.getAttribute('aria-hidden')).toBe('false');
    expect(dom.window.document.body.style.overflow).toBe('hidden');

    dom.window.document.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'Escape' }),
    );
    expect(modal.getAttribute('aria-hidden')).toBe('true');
    expect(dom.window.document.body.style.overflow).toBe('');
  });

  it('blocks invalid next navigation and advances valid steps with progress state', () => {
    setup();
    const next = dom.window.document.getElementById('mscf-next-btn');
    expect(next.disabled).toBe(true);

    fillStep1();
    expect(next.disabled).toBe(false);
    dispatch(next, 'click');

    expect(dom.window.document.querySelector('.mscf-step[data-step="1"]').hidden).toBe(
      true,
    );
    expect(dom.window.document.querySelector('.mscf-step[data-step="2"]').hidden).toBe(
      false,
    );
    expect(dom.window.document.getElementById('mscf-step-label').textContent).toBe(
      'Step 2 of 5',
    );
    expect(dom.window.document.getElementById('mscf-progress-fill').style.width).toBe(
      '40%',
    );
    expect(
      dom.window.document.querySelector('[data-step="1"].mscf-step-dot--complete'),
    ).not.toBeNull();
  });

  it('shows validation errors when a step is forced to validate', () => {
    setup();
    const next = dom.window.document.getElementById('mscf-next-btn');
    next.disabled = false;
    next.click();
    expect(dom.window.document.getElementById('mscf-error-name').textContent).toContain(
      'full name',
    );
    expect(dom.window.document.getElementById('mscf-error-email').style.display).toBe(
      'block',
    );
  });

  it('supports back navigation, backdrop close, and step-specific action buttons', () => {
    setup();
    fillStep1();
    dom.window.document.getElementById('mscf-next-btn').click();
    expect(dom.window.document.getElementById('mscf-back-btn').textContent).toContain(
      'Back',
    );

    dom.window.document.getElementById('mscf-back-btn').click();
    expect(dom.window.document.querySelector('.mscf-step[data-step="1"]').hidden).toBe(
      false,
    );

    dom.window.document.getElementById('mscf-trigger-btn').click();
    const modal = dom.window.document.getElementById('mscf-modal');
    modal.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
    expect(modal.getAttribute('aria-hidden')).toBe('true');
  });

  it('persists field selections and restores saved state on initialization', () => {
    setup();
    fillStep1();
    input('mscf-input-venue', 'The Grand Ballroom');
    const mood = dom.window.document.querySelector('input[name="vibes[]"]');
    mood.checked = true;
    dispatch(mood, 'change');
    expect(JSON.parse(dom.window.sessionStorage.getItem('mscf_state'))).toMatchObject({
      name: 'Alex Example',
      venue: 'The Grand Ballroom',
      moods: ['Chill'],
    });

    dom.window.close();
    const restored = setup({
      savedState: {
        step: 2,
        name: 'Saved Person',
        email: 'saved@example.com',
        phone: '619-555-1234',
        venue: 'Saved Venue',
        date_time: 'July 1, 2026',
        attendance: '200',
      },
    });
    restored.window.document.getElementById('mscf-trigger-btn').click();
    expect(restored.window.document.getElementById('mscf-input-venue').value).toBe(
      'Saved Venue',
    );
    expect(restored.window.document.getElementById('mscf-input-attendance').value).toBe(
      '200',
    );
  });

  it('updates attendance bubble and selected service-card styling', () => {
    setup();
    advanceTo(2);
    const slider = dom.window.document.getElementById('mscf-input-attendance');
    slider.value = '250';
    dispatch(slider, 'input');
    expect(dom.window.document.getElementById('mscf-slider-bubble').textContent).toBe(
      '250+',
    );

    advanceTo(3);
    const mood = dom.window.document.querySelector('input[name="vibes[]"]');
    mood.checked = true;
    dispatch(mood, 'change');
    dom.window.document.getElementById('mscf-next-btn').click();
    const service = dom.window.document.querySelector('input[name="mscf-service"]');
    service.checked = true;
    dispatch(service, 'change');
    expect(
      service.closest('.mscf-service-card').classList.contains(
        'mscf-service-card--selected',
      ),
    ).toBe(true);
  });
});

describe('multi-step contact form submission branches', () => {
  it('posts URL-encoded form state on localhost and shows server errors', async () => {
    setup();
    fillStep1();
    advanceTo(5);
    input('mscf-input-message', 'Please share the event details');
    const fetchMock = vi.fn().mockResolvedValue({
      status: 422,
      text: () => Promise.resolve(JSON.stringify({ success: false, message: 'Try again' })),
    });
    dom.window.fetch = fetchMock;
    const submit = dom.window.document.getElementById('mscf-submit-btn');
    submit.disabled = false;
    submit.click();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    expect(fetchMock.mock.calls[0][0]).toBe('/php/process-multistep-form.php');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
    expect(fetchMock.mock.calls[0][1].body).toContain('name=Alex+Example');
    await vi.waitFor(() =>
      expect(dom.window.document.getElementById('mscf-error-banner').textContent).toContain(
        'Try again',
      ),
    );
  });

  it('reports network failures and missing reCAPTCHA on non-local hosts', async () => {
    setup({ hostname: 'djmisha.com' });
    fillStep1();
    advanceTo(5);
    input('mscf-input-message', 'Please share the event details');
    const submit = dom.window.document.getElementById('mscf-submit-btn');
    submit.disabled = false;
    submit.click();
    expect(dom.window.document.getElementById('mscf-error-banner').textContent).toContain(
      'reCAPTCHA failed',
    );

    setup();
    fillStep1();
    advanceTo(5);
    input('mscf-input-message', 'Please share the event details');
    dom.window.fetch = vi.fn().mockRejectedValue(new Error('offline'));
    const localSubmit = dom.window.document.getElementById('mscf-submit-btn');
    localSubmit.disabled = false;
    localSubmit.click();
    await vi.waitFor(() =>
      expect(dom.window.document.getElementById('mscf-error-banner').textContent).toContain(
        'Connection problem',
      ),
    );
  });

  it('takes the honeypot path without sending a request', () => {
    setup();
    fillStep1();
    advanceTo(5);
    input('mscf-input-message', 'Please share the event details');
    input('mscf-input-website', 'automated bot');
    const fetchMock = vi.spyOn(dom.window, 'fetch');
    const submit = dom.window.document.getElementById('mscf-submit-btn');
    submit.disabled = false;
    submit.click();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('multi-step contact form markup contract', () => {
  it('keeps the required script selectors and five-step structure in the Astro component', () => {
    for (const id of [
      'mscf-trigger-btn',
      'mscf-modal',
      'mscf-back-btn',
      'mscf-next-btn',
      'mscf-submit-btn',
      'mscf-input-name',
      'mscf-input-email',
      'mscf-input-phone',
      'mscf-input-date_time',
      'mscf-input-attendance',
      'mscf-input-message',
      'mscf-input-website',
    ]) {
      expect(componentSource).toContain(`id="${id}"`);
    }
    expect(componentSource.match(/class="mscf-step"/g)).toHaveLength(5);
    expect(componentSource).toContain('name="vibes[]"');
    expect(componentSource).toContain('name="mscf-service"');
    expect(componentSource).toContain('aria-modal="true"');
    expect(componentSource).toContain('aria-labelledby="mscf-modal-heading"');
    expect(componentSource).toContain('<script src="/js/multi-step-contact-form.js" defer></script>');
  });
});
