/**
 * Contact Form — client-side validation, reCAPTCHA integration, and async submission.
 * No jQuery. Only external dependency is the Google reCAPTCHA API script.
 */
(function () {
  'use strict';

  // ── Validation rules ────────────────────────────────────────────────
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  var FIELD_RULES = {
    name:       { type: 'minlen', min: 2,  msg: 'Please enter your name (at least 2 characters).' },
    email:      { type: 'email',           msg: 'Please enter a valid email address.' },
    phone:      { type: 'phone',           msg: 'Please enter a valid US phone number.' },
    event_type: { type: 'select',          msg: 'Please select an event type.' },
    attendance: { type: 'select',          msg: 'Please select expected attendance.' },
    venue:      { type: 'minlen', min: 2,  msg: 'Please enter the venue and location (at least 2 characters).' },
    date_time:  { type: 'minlen', min: 2,  msg: 'Please enter the date and time (at least 2 characters).' },
    service:    { type: 'select',          msg: 'Please select a service.' },
    vibes:      { type: 'checkbox',        msg: 'Please select at least one vibe/mood option.' },
    message:    { type: 'minlen', min: 10, msg: 'Please enter a message (at least 10 characters).' }
  };

  // ── Helpers ─────────────────────────────────────────────────────────
  function countNonWhitespace(str) {
    return (str || '').replace(/\s/g, '').length;
  }

  // ── Validation ──────────────────────────────────────────────────────

  /**
   * Validate a single field by name.
   * @param {string} fieldName
   * @returns {{ valid: boolean, message: string }}
   */
  function validateField(fieldName) {
    var rule = FIELD_RULES[fieldName];
    if (!rule) return { valid: true, message: '' };

    if (rule.type === 'checkbox') {
      var checked = document.querySelectorAll('input[name="vibes[]"]:checked');
      return checked.length > 0
        ? { valid: true, message: '' }
        : { valid: false, message: rule.msg };
    }

    var input = document.getElementById('cf-input-' + fieldName);
    if (!input) return { valid: true, message: '' };
    var val = (input.value || '');

    switch (rule.type) {
      case 'minlen':
        return countNonWhitespace(val) >= rule.min
          ? { valid: true, message: '' }
          : { valid: false, message: rule.msg };
      case 'email':
        return EMAIL_RE.test(val.trim())
          ? { valid: true, message: '' }
          : { valid: false, message: rule.msg };
      case 'phone':
        return PHONE_RE.test(val.trim())
          ? { valid: true, message: '' }
          : { valid: false, message: rule.msg };
      case 'select':
        return val !== ''
          ? { valid: true, message: '' }
          : { valid: false, message: rule.msg };
      default:
        return { valid: true, message: '' };
    }
  }

  /**
   * Validate all fields. Returns true only if every field passes.
   * @returns {boolean}
   */
  function validateAll() {
    var allValid = true;
    var fieldNames = Object.keys(FIELD_RULES);
    for (var i = 0; i < fieldNames.length; i++) {
      var result = validateField(fieldNames[i]);
      if (!result.valid) {
        showError(fieldNames[i], result.message);
        allValid = false;
      } else {
        clearError(fieldNames[i]);
      }
    }
    return allValid;
  }

  // ── Error display / clearing ────────────────────────────────────────

  /**
   * Show an error message and red border on a field.
   */
  function showError(fieldName, message) {
    var errorEl = document.getElementById('cf-error-' + fieldName);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }

    if (fieldName === 'vibes') {
      var fieldset = document.getElementById('cf-field-vibes');
      if (fieldset) fieldset.classList.add('cf-input--error');
    } else {
      var input = document.getElementById('cf-input-' + fieldName);
      if (input) input.classList.add('cf-input--error');
    }
  }

  /**
   * Remove error message and red border from a field.
   */
  function clearError(fieldName) {
    var errorEl = document.getElementById('cf-error-' + fieldName);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    if (fieldName === 'vibes') {
      var fieldset = document.getElementById('cf-field-vibes');
      if (fieldset) fieldset.classList.remove('cf-input--error');
    } else {
      var input = document.getElementById('cf-input-' + fieldName);
      if (input) input.classList.remove('cf-input--error');
    }
  }

  /**
   * Scroll viewport to the first field that has an error.
   */
  function scrollToFirstError() {
    var firstErr = document.querySelector('.cf-input--error');
    if (firstErr) {
      firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Try to focus the element if it's focusable
      if (typeof firstErr.focus === 'function' && firstErr.tagName !== 'FIELDSET') {
        firstErr.focus({ preventScroll: true });
      }
    }
  }

  // ── Loading / submission UI ─────────────────────────────────────────

  /**
   * Toggle spinner and disabled state on the submit button.
   */
  function setLoading(isLoading) {
    var btn = document.getElementById('cf-submit-btn');
    if (!btn) return;
    btn.disabled = isLoading;
    btn.classList.toggle('is-loading', isLoading);
  }

  /**
   * Hide the form and show a success message.
   */
  function showSuccess(message) {
    // Redirect to thank-you page on successful submission
    window.location.href = '/thank-you/';
  }

  /**
   * Show an error banner (for submission-level errors).
   */
  function showSubmitError(message) {
    var banner = document.getElementById('cf-error-banner');
    if (banner) {
      banner.innerHTML = message + '<br><br>If you are having trouble submitting this form, please send a text message to <a href="tel:+16197862664" style="color:#e44c65;">(619) 786-2664</a> for a quick reply.';
      banner.style.display = 'block';
    }
  }

  // ── Form submission ─────────────────────────────────────────────────

  /**
   * Submit form data + reCAPTCHA token to the PHP processor via Fetch.
   */
  function submitForm(token) {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var formData = new FormData(form);
    formData.append('g-recaptcha-response', token);

    // Convert to URL-encoded string for application/x-www-form-urlencoded
    var params = new URLSearchParams(formData).toString();

    setLoading(true);

    fetch('/php/process-form.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
      .then(function (response) {
        return response.text().then(function (text) {
          console.log('Raw PHP response:', response.status, text);
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
        console.log('Form response:', result.status, result.data);
        if (result.data && result.data.success) {
          showSuccess(result.data.message);
        } else if (result.data && !result.data.success) {
          showSubmitError(result.data.message || 'Submission failed. Please try again.');
        } else {
          showSubmitError('Something went wrong. Please try again later.');
        }
      })
      .catch(function () {
        setLoading(false);
        showSubmitError('Connection problem. Please check your internet and try again.');
      });
  }

  // ── reCAPTCHA callback ──────────────────────────────────────────────

  /**
   * Global callback invoked by Google Invisible reCAPTCHA after token generation.
   */
  window.onRecaptchaSubmit = function (token) {
    submitForm(token);
  };

  // ── Initialization ──────────────────────────────────────────────────

  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    // Set form load timestamp for bot timing detection
    var loadedAtField = document.getElementById('cf-form-loaded');
    if (loadedAtField) {
      loadedAtField.value = String(Math.floor(Date.now() / 1000));
    }

    // Submit handler — validate, then trigger reCAPTCHA
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Hide previous submission error
      var banner = document.getElementById('cf-error-banner');
      if (banner) banner.style.display = 'none';

      if (!validateAll()) {
        scrollToFirstError();
        return;
      }

      // Trigger invisible reCAPTCHA (skip on localhost for local dev testing)
      var isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalDev) {
        submitForm('');
      } else if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
        try {
          grecaptcha.execute();
        } catch (err) {
          showSubmitError('Verification failed. Please try again.');
        }
      } else {
        showSubmitError('reCAPTCHA failed to load. Please refresh and try again.');
      }
    });

    // Live validation — clear errors on input/change
    var fieldNames = Object.keys(FIELD_RULES);
    for (var i = 0; i < fieldNames.length; i++) {
      (function (name) {
        if (name === 'vibes') {
          var checkboxes = document.querySelectorAll('input[name="vibes[]"]');
          for (var j = 0; j < checkboxes.length; j++) {
            checkboxes[j].addEventListener('change', function () {
              var result = validateField('vibes');
              if (result.valid) clearError('vibes');
            });
          }
        } else {
          var input = document.getElementById('cf-input-' + name);
          if (input) {
            var eventType = (input.tagName === 'SELECT') ? 'change' : 'input';
            input.addEventListener(eventType, function () {
              var result = validateField(name);
              if (result.valid) clearError(name);
            });
          }
        }
      })(fieldNames[i]);
    }
  }

  // ── Boot ────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }

  // Expose for testing (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      validateField: validateField,
      validateAll: validateAll,
      showError: showError,
      clearError: clearError,
      scrollToFirstError: scrollToFirstError,
      setLoading: setLoading,
      showSuccess: showSuccess,
      showSubmitError: showSubmitError,
      submitForm: submitForm,
      FIELD_RULES: FIELD_RULES,
      EMAIL_RE: EMAIL_RE,
      PHONE_RE: PHONE_RE
    };
  }
})();
