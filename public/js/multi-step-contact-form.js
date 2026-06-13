/**
 * Multi-Step Contact Form — multi-step-contact-form.js
 *
 * Handles: modal open/close, step navigation (5 steps), real-time
 * validation, sessionStorage state persistence, attendance slider
 * bubble, reCAPTCHA Enterprise, and async form submission.
 *
 * Steps:
 *   1 — Name / Email / Phone
 *   2 — Event Date & Time / Attendance Slider
 *   3 — Mood Selection (9 tiles, multi-select)
 *   4 — Service Selection (4 radio cards)
 *   5 — Message + Submit
 */
(function () {
  'use strict';

  // ── Constants ────────────────────────────────────────────────────────────
  var STORAGE_KEY = 'mscf_state';
  var TOTAL_STEPS = 5;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?1?[\s.\-]?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;
  var RECAPTCHA_SITE_KEY = '';

  // ── Default state ────────────────────────────────────────────────────────
  var defaultState = {
    step: 1,
    name: '',
    email: '',
    phone: '',
    date_time: '',
    attendance: '25',
    moods: [],
    service: '',
    message: '',
    formLoadedAt: 0,
  };

  var state = {};

  // ── Session-storage helpers ──────────────────────────────────────────────
  function loadState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        state = Object.assign({}, defaultState, saved);
        return;
      }
    } catch (e) {
      /* ignore */
    }
    state = Object.assign({}, defaultState);
  }

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  function clearState() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    state = Object.assign({}, defaultState);
  }

  // ── DOM shortcuts ────────────────────────────────────────────────────────
  function byId(id) {
    return document.getElementById(id);
  }
  function qsa(sel, ctx) {
    return (ctx || document).querySelectorAll(sel);
  }

  // ── Validation ───────────────────────────────────────────────────────────
  function nonWs(str) {
    return (str || '').replace(/\s/g, '').length;
  }

  function isStep1Valid() {
    return (
      nonWs(state.name) >= 2 &&
      EMAIL_RE.test((state.email || '').trim()) &&
      PHONE_RE.test((state.phone || '').trim())
    );
  }

  function isStep2Valid() {
    return nonWs(state.date_time) >= 2;
    // attendance slider always carries a value, never empty
  }

  function isStep3Valid() {
    return state.moods.length > 0;
  }

  function isStep4Valid() {
    return (state.service || '').trim() !== '';
  }

  function isStep5Valid() {
    return nonWs(state.message) >= 10;
  }

  function isStepValid(n) {
    switch (n) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      case 4:
        return isStep4Valid();
      case 5:
        return isStep5Valid();
      default:
        return false;
    }
  }

  // ── Error display ────────────────────────────────────────────────────────
  function showFieldError(fieldId, msg) {
    var errEl = byId('mscf-error-' + fieldId);
    var inputEl = byId('mscf-input-' + fieldId);
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
    if (inputEl) inputEl.classList.add('mscf-input--error');
  }

  function clearFieldError(fieldId) {
    var errEl = byId('mscf-error-' + fieldId);
    var inputEl = byId('mscf-input-' + fieldId);
    if (errEl) {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
    if (inputEl) inputEl.classList.remove('mscf-input--error');
  }

  /** Validate the current step and show inline errors. Returns true if valid. */
  function validateStep(n) {
    var ok = true;

    if (n === 1) {
      if (nonWs(state.name) < 2) {
        showFieldError(
          'name',
          'Please enter your full name (at least 2 characters).',
        );
        ok = false;
      } else {
        clearFieldError('name');
      }

      if (!EMAIL_RE.test((state.email || '').trim())) {
        showFieldError('email', 'Please enter a valid email address.');
        ok = false;
      } else {
        clearFieldError('email');
      }

      if (!PHONE_RE.test((state.phone || '').trim())) {
        showFieldError('phone', 'Please enter a valid US phone number.');
        ok = false;
      } else {
        clearFieldError('phone');
      }
    }

    if (n === 2) {
      if (nonWs(state.date_time) < 2) {
        showFieldError('date_time', 'Please enter your event date and time.');
        ok = false;
      } else {
        clearFieldError('date_time');
      }
    }

    if (n === 3) {
      var moodsErr = byId('mscf-error-vibes');
      if (state.moods.length === 0) {
        if (moodsErr) {
          moodsErr.textContent = 'Please select at least one mood.';
          moodsErr.style.display = 'block';
        }
        ok = false;
      } else {
        if (moodsErr) {
          moodsErr.textContent = '';
          moodsErr.style.display = 'none';
        }
      }
    }

    if (n === 4) {
      var serviceErr = byId('mscf-error-service');
      if ((state.service || '').trim() === '') {
        if (serviceErr) {
          serviceErr.textContent = 'Please select a service package.';
          serviceErr.style.display = 'block';
        }
        ok = false;
      } else {
        if (serviceErr) {
          serviceErr.textContent = '';
          serviceErr.style.display = 'none';
        }
      }
    }

    if (n === 5) {
      if (nonWs(state.message) < 10) {
        showFieldError(
          'message',
          'Please share a few details about your event (at least 10 characters).',
        );
        ok = false;
      } else {
        clearFieldError('message');
      }
    }

    return ok;
  }

  // ── Progress bar ─────────────────────────────────────────────────────────
  function updateProgress() {
    var fill = byId('mscf-progress-fill');
    var label = byId('mscf-step-label');
    var pct = Math.round((state.step / TOTAL_STEPS) * 100);
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = 'Step ' + state.step + ' of ' + TOTAL_STEPS;

    // Dot indicators
    var dots = qsa('.mscf-step-dot');
    for (var i = 0; i < dots.length; i++) {
      var dotN = parseInt(dots[i].getAttribute('data-step'), 10);
      dots[i].classList.toggle('mscf-step-dot--complete', dotN < state.step);
      dots[i].classList.toggle('mscf-step-dot--active', dotN === state.step);
    }
  }

  // ── Back button label ────────────────────────────────────────────────────
  function updateBackButton() {
    var btn = byId('mscf-back-btn');
    if (!btn) return;
    var textEl = btn.querySelector('.mscf-back-label');
    if (state.step === 1) {
      if (textEl) textEl.textContent = 'Close';
      btn.setAttribute('aria-label', 'Close form');
    } else {
      if (textEl) textEl.textContent = 'Back';
      btn.setAttribute('aria-label', 'Go to previous step');
    }
  }

  // ── Next / Submit button state ───────────────────────────────────────────
  function updateActionButtons() {
    var nextBtn = byId('mscf-next-btn');
    var submitBtn = byId('mscf-submit-btn');
    if (!nextBtn || !submitBtn) return;

    var valid = isStepValid(state.step);

    if (state.step < TOTAL_STEPS) {
      nextBtn.style.display = '';
      submitBtn.style.display = 'none';
      nextBtn.disabled = !valid;
    } else {
      nextBtn.style.display = 'none';
      submitBtn.style.display = '';
      submitBtn.disabled = !valid;
    }
  }

  // ── Restore field values from state into DOM ─────────────────────────────
  function restoreFields(n) {
    if (n === 1) {
      setVal('mscf-input-name', state.name);
      setVal('mscf-input-email', state.email);
      setVal('mscf-input-phone', state.phone);
    } else if (n === 2) {
      setVal('mscf-input-date_time', state.date_time);
      var slider = byId('mscf-input-attendance');
      if (slider) {
        slider.value = state.attendance;
        updateSliderBubble();
      }
    } else if (n === 3) {
      qsa('input[name="vibes[]"]').forEach(function (cb) {
        cb.checked = state.moods.indexOf(cb.value) !== -1;
      });
    } else if (n === 4) {
      qsa('input[name="mscf-service"]').forEach(function (r) {
        r.checked = r.value === state.service;
        var card = r.closest('.mscf-service-card');
        if (card)
          card.classList.toggle('mscf-service-card--selected', r.checked);
      });
    } else if (n === 5) {
      setVal('mscf-input-message', state.message);
    }
  }

  function setVal(id, val) {
    var el = byId(id);
    if (el) el.value = val || '';
  }

  // ── Show a specific step ─────────────────────────────────────────────────
  function showStep(n) {
    var panels = qsa('.mscf-step');
    for (var i = 0; i < panels.length; i++) {
      var step = parseInt(panels[i].getAttribute('data-step'), 10);
      if (step === n) {
        panels[i].removeAttribute('hidden');
      } else {
        panels[i].setAttribute('hidden', '');
      }
    }

    state.step = n;
    saveState();
    updateProgress();
    updateBackButton();
    updateActionButtons();
    restoreFields(n);

    // Scroll body to top on step change
    var body = byId('mscf-modal-body');
    if (body) body.scrollTop = 0;

    // Focus first interactive element in the new step
    var panel = document.querySelector('.mscf-step[data-step="' + n + '"]');
    if (panel) {
      var first = panel.querySelector(
        'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea',
      );
      if (first) {
        setTimeout(function () {
          first.focus({ preventScroll: true });
        }, 80);
      }
    }
  }

  // ── Attendance slider tooltip ────────────────────────────────────────────
  function updateSliderBubble() {
    var slider = byId('mscf-input-attendance');
    var bubble = byId('mscf-slider-bubble');
    if (!slider || !bubble) return;

    var val = parseInt(slider.value, 10);
    var min = parseInt(slider.min, 10);
    var max = parseInt(slider.max, 10);
    bubble.textContent = val >= max ? max + '+' : String(val);

    // Calculate bubble left position aligned with slider thumb
    var pct = (val - min) / (max - min);
    var thumbR = 12; // half of 24px CSS thumb width
    var width = slider.offsetWidth || 260;
    var leftPx = Math.round(thumbR + pct * (width - thumbR * 2));
    bubble.style.left = leftPx + 'px';
  }

  // ── Modal open / close ───────────────────────────────────────────────────
  function openModal() {
    var modal = byId('mscf-modal');
    if (!modal) return;

    // Stamp load time on first open (used for bot timing check)
    if (!state.formLoadedAt) {
      state.formLoadedAt = Math.floor(Date.now() / 1000);
      saveState();
    }

    modal.classList.add('mscf-modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    showStep(state.step || 1);

    // Move focus into modal for accessibility
    setTimeout(function () {
      var backBtn = byId('mscf-back-btn');
      if (backBtn) backBtn.focus();
    }, 100);
  }

  function closeModal() {
    var modal = byId('mscf-modal');
    if (!modal) return;
    modal.classList.remove('mscf-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Navigation handlers ──────────────────────────────────────────────────
  function handleBackClick() {
    if (state.step <= 1) {
      closeModal();
    } else {
      showStep(state.step - 1);
    }
  }

  function handleNextClick() {
    if (!validateStep(state.step)) return;
    showStep(state.step + 1);
  }

  // ── Field change listeners ───────────────────────────────────────────────
  function bindFieldListeners() {
    // Step 1 — name
    var nameEl = byId('mscf-input-name');
    if (nameEl) {
      nameEl.addEventListener('input', function () {
        state.name = this.value;
        saveState();
        clearFieldError('name');
        updateActionButtons();
      });
      nameEl.addEventListener('blur', function () {
        if (this.value && nonWs(this.value) < 2) {
          showFieldError(
            'name',
            'Please enter your full name (at least 2 characters).',
          );
        }
      });
    }

    // Step 1 — email
    var emailEl = byId('mscf-input-email');
    if (emailEl) {
      emailEl.addEventListener('input', function () {
        state.email = this.value;
        saveState();
        clearFieldError('email');
        updateActionButtons();
      });
      emailEl.addEventListener('blur', function () {
        if (this.value && !EMAIL_RE.test(this.value.trim())) {
          showFieldError('email', 'Please enter a valid email address.');
        }
      });
    }

    // Step 1 — phone
    var phoneEl = byId('mscf-input-phone');
    if (phoneEl) {
      phoneEl.addEventListener('input', function () {
        state.phone = this.value;
        saveState();
        clearFieldError('phone');
        updateActionButtons();
      });
      phoneEl.addEventListener('blur', function () {
        if (this.value && !PHONE_RE.test(this.value.trim())) {
          showFieldError('phone', 'Please enter a valid US phone number.');
        }
      });
    }

    // Step 2 — date / time
    var dtEl = byId('mscf-input-date_time');
    if (dtEl) {
      dtEl.addEventListener('input', function () {
        state.date_time = this.value;
        saveState();
        clearFieldError('date_time');
        updateActionButtons();
      });
    }

    // Step 2 — attendance slider
    var sliderEl = byId('mscf-input-attendance');
    if (sliderEl) {
      sliderEl.addEventListener('input', function () {
        state.attendance = this.value;
        saveState();
        updateSliderBubble();
        updateActionButtons();
      });
    }

    // Step 3 — mood checkboxes
    qsa('input[name="vibes[]"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        state.moods = [];
        qsa('input[name="vibes[]"]:checked').forEach(function (c) {
          state.moods.push(c.value);
        });
        saveState();
        var err = byId('mscf-error-vibes');
        if (err && state.moods.length > 0) {
          err.textContent = '';
          err.style.display = 'none';
        }
        updateActionButtons();
      });
    });

    // Step 4 — service radio cards
    qsa('input[name="mscf-service"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.service = this.value;
        saveState();
        // Update card selected styling
        qsa('.mscf-service-card').forEach(function (card) {
          card.classList.remove('mscf-service-card--selected');
        });
        var card = this.closest('.mscf-service-card');
        if (card) card.classList.add('mscf-service-card--selected');
        var err = byId('mscf-error-service');
        if (err) {
          err.textContent = '';
          err.style.display = 'none';
        }
        updateActionButtons();
      });
    });

    // Step 5 — message
    var msgEl = byId('mscf-input-message');
    if (msgEl) {
      msgEl.addEventListener('input', function () {
        state.message = this.value;
        saveState();
        clearFieldError('message');
        updateActionButtons();
      });
    }
  }

  // ── Submit loading state ─────────────────────────────────────────────────
  function setLoading(isLoading) {
    var btn = byId('mscf-submit-btn');
    if (!btn) return;
    btn.disabled = isLoading;
    btn.classList.toggle('mscf-btn--loading', isLoading);
  }

  // ── Error banner ─────────────────────────────────────────────────────────
  function showBanner(msg) {
    var el = byId('mscf-error-banner');
    if (!el) return;
    el.innerHTML =
      msg +
      '<br><br>If you need help, text us at <a href="tel:+16197862664" style="color:var(--color-accent);">(619) 786-2664</a>.';
    el.style.display = 'block';
  }

  function hideBanner() {
    var el = byId('mscf-error-banner');
    if (el) el.style.display = 'none';
  }

  // ── Form submission ──────────────────────────────────────────────────────
  function submitForm(token) {
    var params = new URLSearchParams();
    params.append('name', state.name);
    params.append('email', state.email);
    params.append('phone', state.phone);
    params.append('date_time', state.date_time);
    params.append('attendance', state.attendance);
    state.moods.forEach(function (mood) {
      params.append('vibes[]', mood);
    });
    params.append('service', state.service);
    params.append('message', state.message);
    params.append('website', ''); // honeypot — empty for real users
    params.append('form_loaded_at', String(state.formLoadedAt || 0));
    params.append('g-recaptcha-response', token);

    setLoading(true);

    fetch('/php/process-multistep-form.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
      .then(function (response) {
        return response.text().then(function (text) {
          try {
            var data = JSON.parse(text);
            return { status: response.status, data: data };
          } catch (e) {
            return { status: response.status, data: null };
          }
        });
      })
      .then(function (result) {
        setLoading(false);
        if (result.data && result.data.success) {
          clearState();
          window.location.href = '/thank-you/';
        } else if (result.data && !result.data.success) {
          showBanner(
            result.data.message || 'Submission failed. Please try again.',
          );
        } else {
          showBanner('Something went wrong. Please try again later.');
        }
      })
      .catch(function () {
        setLoading(false);
        showBanner(
          'Connection problem. Please check your internet and try again.',
        );
      });
  }

  function handleSubmit() {
    if (!validateStep(5)) return;
    hideBanner();

    // Honeypot check on client side
    var honeypot = byId('mscf-input-website');
    if (honeypot && honeypot.value !== '') {
      clearState();
      window.location.href = '/thank-you/';
      return;
    }

    var isLocalDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalDev) {
      submitForm('');
    } else if (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) {
      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise
          .execute(RECAPTCHA_SITE_KEY, { action: 'CONTACT_FORM' })
          .then(function (token) {
            submitForm(token);
          })
          .catch(function () {
            showBanner('Verification failed. Please try again.');
          });
      });
    } else {
      showBanner('reCAPTCHA failed to load. Please refresh and try again.');
    }
  }

  // ── Initialization ───────────────────────────────────────────────────────
  function init() {
    // Read reCAPTCHA site key from meta tag (shared with ContactForm if present)
    var metaKey = document.querySelector('meta[name="recaptcha-site-key"]');
    if (metaKey) RECAPTCHA_SITE_KEY = metaKey.getAttribute('content') || '';

    loadState();

    // Trigger button — opens modal
    var triggerBtn = byId('mscf-trigger-btn');
    if (triggerBtn) triggerBtn.addEventListener('click', openModal);

    // Back / close button
    var backBtn = byId('mscf-back-btn');
    if (backBtn) backBtn.addEventListener('click', handleBackClick);

    // Next button (steps 1–4)
    var nextBtn = byId('mscf-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', handleNextClick);

    // Submit button (step 5)
    var submitBtn = byId('mscf-submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);

    // Close modal when clicking the overlay backdrop
    var modal = byId('mscf-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === this) closeModal();
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var m = byId('mscf-modal');
        if (m && m.classList.contains('mscf-modal--open')) closeModal();
      }
    });

    // Field input/change listeners
    bindFieldListeners();

    // Initialize slider bubble on load
    updateSliderBubble();

    // Recalculate slider bubble position on window resize
    window.addEventListener('resize', updateSliderBubble);
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose internals for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      isStep1Valid: isStep1Valid,
      isStep2Valid: isStep2Valid,
      isStep3Valid: isStep3Valid,
      isStep4Valid: isStep4Valid,
      isStep5Valid: isStep5Valid,
      isStepValid: isStepValid,
      EMAIL_RE: EMAIL_RE,
      PHONE_RE: PHONE_RE,
      state: state,
    };
  }
})();
