(function () {
  const STORAGE_KEY = 'pf-state-v1';
  const MAX_STEPS = 19;
  const ALLOWED_REPEAT_FIELDS = [
    'parts_of_day',
    'space_type',
    'key_moments',
    'music_styles',
    'lighting',
    'addons',
  ];

  const state = {
    currentStep: 0,
    name: '',
    data: {},
    valid: false,
  };

  const form = document.getElementById('pf-form');
  const access = document.getElementById('pf-access');
  const success = document.getElementById('pf-success');
  const stepLabel = document.getElementById('pf-step-label');
  const progressFill = document.getElementById('pf-progress-fill');
  const backBtn = document.getElementById('pf-back');
  const nextBtn = document.getElementById('pf-next');
  const submitBtn = document.getElementById('pf-submit');
  const welcomeName = document.getElementById('pf-welcome-name');
  const skipDayBtn = document.getElementById('pf-skip-day');
  const successName = document.getElementById('pf-success-name');
  const successMessage = document.getElementById('pf-success-message');

  function safeTrim(value) {
    return (value || '').replace(/\r|\n/g, ' ').trim();
  }

  function normalizeName(raw) {
    const cleaned = safeTrim(String(raw || '')).replace(/\s+/g, ' ');
    return cleaned.length > 100 ? cleaned.slice(0, 100) : cleaned;
  }

  function getInitialState() {
    const params = new URLSearchParams(window.location.search);
    const name = normalizeName(params.get('name'));

    if (name) {
      state.name = name;
      window.history.replaceState({}, '', window.location.pathname);
      return true;
    }

    const saved = readSavedState();
    if (saved && saved.name) {
      state.name = saved.name;
      return true;
    }

    showAccessMessage();
    return false;
  }

  function showAccessMessage() {
    form.hidden = true;
    access.hidden = false;
    document.querySelector('.pf-shell').classList.add('pf-shell--blocked');
  }

  function readSavedState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.name === 'string' && parsed.name) {
        delete parsed.email;
        if (parsed.data && typeof parsed.data === 'object') {
          delete parsed.data.email;
          delete parsed.data.music_involvement;
          delete parsed.data.music_involvement_touched;
        }
        return parsed;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function saveState() {
    try {
      const payload = {
        name: state.name,
        currentStep: state.currentStep,
        data: state.data,
        savedAt: Date.now(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore blocked storage.
    }
  }

  function clearSavedState() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore.
    }
  }

  function updateProgress() {
    const ratio =
      state.currentStep === 0 ? 0 : (state.currentStep / MAX_STEPS) * 100;
    progressFill.style.width = `${ratio}%`;
    stepLabel.textContent =
      state.currentStep === 0
        ? 'Step 1 of 19'
        : `Step ${state.currentStep} of 19`;
    backBtn.hidden = state.currentStep <= 0;
    nextBtn.hidden = state.currentStep >= MAX_STEPS;
    submitBtn.hidden = state.currentStep < MAX_STEPS;
  }

  function applyWelcomeText() {
    const firstName = state.name ? state.name.split(' ')[0] : 'there';
    welcomeName.textContent = `Hi ${firstName}!`;
    successName.textContent = `You’re all set, ${firstName}!`;
  }

  function goToStep(step) {
    state.currentStep = Math.max(0, Math.min(MAX_STEPS, step));
    const stepEls = Array.from(document.querySelectorAll('.pf-step'));
    stepEls.forEach((el) => {
      const stepNumber = Number(el.dataset.step);
      el.hidden = stepNumber !== state.currentStep;
    });

    if (state.currentStep === 0) {
      form.hidden = false;
      access.hidden = true;
      success.hidden = true;
    }

    updateProgress();
    saveState();
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });

    const firstFocusable = document.querySelector(
      `.pf-step:not([hidden]) input, .pf-step:not([hidden]) textarea, .pf-step:not([hidden]) button`,
    );
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
    }
  }

  function showError(field, message) {
    const errorNode = document.querySelector(`[data-error-for="${field}"]`);
    if (errorNode) {
      errorNode.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll('.pf-error').forEach((node) => {
      node.textContent = '';
    });
  }

  function setValue(name, value) {
    if (!name) return;
    const input = form.querySelector(`[name="${name}"]`);
    if (input) {
      input.value = value || '';
    }
  }

  function syncFormDataFromInputs() {
    const allInputs = form.querySelectorAll('input, textarea');
    allInputs.forEach((input) => {
      const rawName = input.name;
      if (!rawName) return;

      if (input.type === 'checkbox') {
        const values = state.data[rawName] || [];
        if (input.checked) {
          if (!values.includes(input.value)) {
            state.data[rawName] = [...values, input.value];
          }
        } else {
          state.data[rawName] = (values || []).filter(
            (value) => value !== input.value,
          );
        }
        return;
      }

      if (input.type === 'radio') {
        if (input.checked) {
          state.data[rawName] = input.value;
        }
        return;
      }

      if (input.type === 'range') {
        state.data[rawName] = input.value;
        state.data[`${rawName}_touched`] = input.dataset.touched === 'true';
        return;
      }

      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        state.data[rawName] = safeTrim(input.value);
      }
    });
  }

  function restoreInputsFromState() {
    const data = state.data || {};
    Object.keys(data).forEach((fieldName) => {
      const value = data[fieldName];
      const fieldSet = form.querySelectorAll(`[name="${fieldName}"]`);

      if (fieldSet.length === 0) return;

      if (Array.isArray(value)) {
        fieldSet.forEach((input) => {
          input.checked = value.includes(input.value);
        });
        return;
      }

      fieldSet.forEach((input) => {
        if (input.type === 'radio') {
          input.checked = input.value === value;
        }
        if (input.type === 'range') {
          input.value = value || '';
          if (data[`${fieldName}_touched`]) {
            input.dataset.touched = 'true';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        if (
          input.tagName === 'TEXTAREA' ||
          input.type === 'text' ||
          input.type === 'tel' ||
          input.type === 'hidden'
        ) {
          input.value = value || '';
        }
      });
    });

    const budgetMin = form.querySelector('[name="budget_min"]');
    const budgetMax = form.querySelector('[name="budget_max"]');
    const budgetTouched = form.querySelector('[name="budget_touched"]');
    if (budgetMin && budgetMax) {
      budgetMin.value = data.budget_min || 2500;
      budgetMax.value = data.budget_max || 10000;
    }
    if (budgetTouched) {
      budgetTouched.value = data.budget_touched || 'false';
    }
  }

  function handleExclusiveSelection(input) {
    const groupName = input.name;
    const sameGroup = form.querySelectorAll(`[name="${groupName}"]`);

    if (input.checked) {
      sameGroup.forEach((member) => {
        if (
          member !== input &&
          (input.dataset.exclusive || member.dataset.exclusive)
        ) {
          member.checked = false;
        }
      });
    }
  }

  function toggleSubFields() {
    const toggles = form.querySelectorAll('[data-toggle-target]');
    toggles.forEach((radio) => {
      const target = document.getElementById(radio.dataset.toggleTarget);
      if (!target) return;
      const shouldShow =
        radio.checked &&
        (radio.value === 'yes' ||
          radio.value === 'text' ||
          radio.value === 'phone_call');
      target.hidden = !shouldShow;
    });

    const otherToggles = form.querySelectorAll('[data-other-toggle]');
    otherToggles.forEach((input) => {
      const target = document.getElementById(
        `${input.dataset.otherToggle}_wrap`,
      );
      if (target) target.hidden = !input.checked;
    });
  }

  function formatTimelineTime(value) {
    const [hours, minutes] = value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  function updateTimelineSections() {
    const selectedParts = new Set(
      Array.from(
        form.querySelectorAll('input[name="parts_of_day[]"]:checked'),
        (input) => input.value,
      ),
    );
    const sectionVisibility = {
      ceremony: selectedParts.has('ceremony'),
      cocktail_hour: selectedParts.has('cocktail_hour'),
      reception_dinner: selectedParts.has('reception'),
      dance_party: selectedParts.has('reception'),
      afterparty: selectedParts.has('afterparty'),
    };

    Object.entries(sectionVisibility).forEach(([section, visible]) => {
      const element = form.querySelector(
        `[data-timeline-section="${section}"]`,
      );
      if (element) element.hidden = !visible;
    });

    form.querySelectorAll('[data-time-display]').forEach((display) => {
      const input = document.getElementById(display.dataset.timeDisplay);
      if (input && /^\d{2}:\d{2}$/.test(input.value)) {
        display.textContent = formatTimelineTime(input.value);
      }
    });
  }

  function adjustTimelineTime(button) {
    const input = document.getElementById(button.dataset.timeField);
    if (!input) return;
    const [hours, minutes] = input.value.split(':').map(Number);
    const currentMinutes = hours * 60 + minutes;
    const direction = Number(button.dataset.direction);
    const updatedMinutes =
      (currentMinutes + direction * 30 + 24 * 60) % (24 * 60);
    const updatedHours = Math.floor(updatedMinutes / 60);
    const updatedRemainder = updatedMinutes % 60;
    input.value = `${String(updatedHours).padStart(2, '0')}:${String(updatedRemainder).padStart(2, '0')}`;

    if (input.name.endsWith('_end')) {
      const timelineSections = [
        'ceremony',
        'cocktail_hour',
        'reception_dinner',
        'dance_party',
        'afterparty',
      ];
      const currentSection = input.name
        .replace(/^timeline_/, '')
        .replace(/_end$/, '');
      const currentIndex = timelineSections.indexOf(currentSection);
      const nextSection = timelineSections
        .slice(currentIndex + 1)
        .find(
          (section) =>
            !form.querySelector(`[data-timeline-section="${section}"]`).hidden,
        );
      if (nextSection) {
        const nextStart = form.querySelector(
          `[name="timeline_${nextSection}_start"]`,
        );
        if (nextStart) nextStart.value = input.value;
      }
    }

    updateTimelineSections();
    syncFormDataFromInputs();
    saveState();
  }

  function validateCurrentStep() {
    clearErrors();
    const step = state.currentStep;

    if (step === 1) {
      const selectedParts = form.querySelectorAll(
        'input[name="parts_of_day[]"]:checked',
      );
      if (selectedParts.length < 1) {
        showError(
          'parts_of_day',
          'Please select at least one part of your day.',
        );
        return false;
      }
    }

    if (step === 2) {
      return true;
    }

    if (step === 3) {
      const selected = form.querySelectorAll(
        'input[name="space_type[]"]:checked',
      );
      if (selected.length < 1) {
        showError('space_type', 'Please tell us where the music will happen.');
        return false;
      }

      const otherSelected = form.querySelector(
        'input[name="space_type[]"][value="other"]:checked',
      );
      const otherValue = safeTrim(
        form.querySelector('[name="space_type_other"]').value,
      );
      if (otherSelected && !otherValue) {
        showError('space_type', 'Please tell us more about the other space.');
        return false;
      }
    }

    if (step === 4) {
      const selected = form.querySelectorAll(
        'input[name="key_moments[]"]:checked',
      );
      if (selected.length < 1) {
        showError('key_moments', 'Please choose at least one key moment.');
        return false;
      }
    }

    if (step === 5) {
      const selected = form.querySelector('input[name="mc_style"]:checked');
      if (!selected) {
        showError('mc_style', 'Please pick the MC style that fits your day.');
        return false;
      }
    }

    if (step === 6) {
      const selected = form.querySelector('input[name="coordinator"]:checked');
      if (!selected) {
        showError(
          'coordinator',
          'Please tell us whether you have a planner or coordinator.',
        );
        return false;
      }
    }

    if (step === 7) {
      const selected = form.querySelectorAll(
        'input[name="music_styles[]"]:checked',
      );
      if (selected.length < 1) {
        showError('music_styles', 'Please pick at least one music style.');
        return false;
      }
    }

    if (step === 9) {
      const selected = form.querySelectorAll(
        'input[name="music_involvement[]"]:checked',
      );
      if (selected.length < 1) {
        showError(
          'music_involvement',
          'Please choose at least one music planning option.',
        );
        return false;
      }
    }

    if (step === 10) {
      const selected = form.querySelector(
        'input[name="planning_style"]:checked',
      );
      if (!selected) {
        showError('planning_style', 'Please choose your planning style.');
        return false;
      }
    }

    if (step === 11) {
      const selected = form.querySelectorAll(
        'input[name="lighting[]"]:checked',
      );
      if (selected.length < 1) {
        showError('lighting', 'Please select at least one lighting option.');
        return false;
      }
    }

    if (step === 12) {
      const selected = form.querySelectorAll('input[name="addons[]"]:checked');
      if (selected.length < 1) {
        showError(
          'addons',
          'Please choose at least one add-on or select none.',
        );
        return false;
      }
    }

    if (step === 13) {
      const min = Number(form.querySelector('[name="budget_min"]').value || 0);
      const max = Number(form.querySelector('[name="budget_max"]').value || 0);
      if (
        min < 2500 ||
        max > 10000 ||
        min > max ||
        min % 250 !== 0 ||
        max % 250 !== 0
      ) {
        showError('budget', 'Please choose a valid budget range.');
        return false;
      }
    }

    if (step === 14) {
      const selected = form.querySelector(
        'input[name="spending_mindset"]:checked',
      );
      if (!selected) {
        showError(
          'spending_mindset',
          'Please choose the spending approach that feels right for you.',
        );
        return false;
      }
    }

    if (step === 15) {
      const selected = form.querySelector(
        'input[name="decision_stage"]:checked',
      );
      if (!selected) {
        showError(
          'decision_stage',
          'Please pick where you are in your decision.',
        );
        return false;
      }
    }

    if (step === 17) {
      const selected = form.querySelector(
        'input[name="contact_method"]:checked',
      );
      if (!selected) {
        showError('contact_method', 'Please pick the best way to reach you.');
        return false;
      }
    }

    return true;
  }

  function collectFormState() {
    clearErrors();
    syncFormDataFromInputs();
    state.data = {
      ...state.data,
      name: state.name,
      website: '',
    };
    const hiddenName = form.querySelector('[name="name"]');
    const hiddenWebsite = form.querySelector('[name="website"]');
    if (hiddenName) hiddenName.value = state.name;
    if (hiddenWebsite) hiddenWebsite.value = '';
    saveState();
    return state.data;
  }

  function attachBudgetBehaviour() {
    const slider = document.getElementById('budget-slider');
    const lowHandle = document.getElementById('budget-low-handle');
    const highHandle = document.getElementById('budget-high-handle');
    const valueNode = document.getElementById('budget_value');
    const minInput = form.querySelector('[name="budget_min"]');
    const maxInput = form.querySelector('[name="budget_max"]');
    const touchedInput = form.querySelector('[name="budget_touched"]');
    const step = 250;
    let activeHandle = null;

    function formatMoney(value) {
      if (value >= 10000) return '$10,000+';
      return `$${Number(value).toLocaleString()}`;
    }

    function valueFromPointer(event) {
      const bounds = slider.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (event.clientX - bounds.left) / bounds.width),
      );
      return Math.round((2500 + ratio * (10000 - 2500)) / step) * step;
    }

    function renderBudget(min, max, touched = true) {
      min = Math.min(Math.max(2500, min), 10000 - step);
      max = Math.max(min + step, Math.min(10000, max));
      const leftPct = ((min - 2500) / (10000 - 2500)) * 100;
      const rightPct = ((max - 2500) / (10000 - 2500)) * 100;
      lowHandle.style.left = `${leftPct}%`;
      highHandle.style.left = `${rightPct}%`;
      minInput.value = String(min);
      maxInput.value = String(max);
      lowHandle.setAttribute('aria-valuenow', String(min));
      lowHandle.setAttribute('aria-valuemax', String(max - step));
      highHandle.setAttribute('aria-valuenow', String(max));
      highHandle.setAttribute('aria-valuemin', String(min + step));
      touchedInput.value = touched ? 'true' : 'false';
      valueNode.textContent = `${formatMoney(min)} - ${formatMoney(max)}`;
    }

    function moveHandle(handle, value) {
      const min = Number(minInput.value);
      const max = Number(maxInput.value);
      if (handle === lowHandle) {
        renderBudget(Math.min(value, max - step), max);
      } else {
        renderBudget(min, Math.max(value, min + step));
      }
    }

    function handleKeydown(handle, event) {
      const value = Number(handle.getAttribute('aria-valuenow'));
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        moveHandle(handle, value - step);
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveHandle(handle, value + step);
      }
    }

    function startDrag(handle, event) {
      event.preventDefault();
      activeHandle = handle;
      handle.focus({ preventScroll: true });
      handle.setPointerCapture(event.pointerId);
    }

    [lowHandle, highHandle].forEach((handle) => {
      handle.addEventListener('pointerdown', (event) =>
        startDrag(handle, event),
      );
      handle.addEventListener('keydown', (event) =>
        handleKeydown(handle, event),
      );
      handle.addEventListener('pointermove', (event) => {
        if (
          activeHandle === handle &&
          handle.hasPointerCapture(event.pointerId)
        ) {
          moveHandle(handle, valueFromPointer(event));
        }
      });
      handle.addEventListener('pointerup', () => {
        activeHandle = null;
      });
      handle.addEventListener('pointercancel', () => {
        activeHandle = null;
      });
    });

    slider.addEventListener('pointerdown', (event) => {
      if (event.target === lowHandle || event.target === highHandle) return;
      const value = valueFromPointer(event);
      const min = Number(minInput.value);
      const max = Number(maxInput.value);
      const handle =
        Math.abs(value - min) <= Math.abs(value - max) ? lowHandle : highHandle;
      moveHandle(handle, value);
      startDrag(handle, event);
    });

    renderBudget(
      Number(minInput.value || 2500),
      Number(maxInput.value || 10000),
      touchedInput.value === 'true',
    );
  }

  async function submitForm() {
    if (!validateCurrentStep()) return;
    collectFormState();

    const payload = new FormData(form);
    payload.set('name', state.name);
    payload.set('website', '');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
        credentials: 'same-origin',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        const errors = result.errors || {
          form: 'We could not send your answers. Please try again.',
        };
        const [firstField, message] = Object.entries(errors)[0] || [
          'form',
          'We could not send your answers. Please try again.',
        ];
        if (document.querySelector(`[data-error-for="${firstField}"]`)) {
          showError(firstField, message);
        } else {
          window.alert(message);
        }
        return;
      }

      showSuccess();
    } catch (error) {
      window.alert(
        'We could not send your answers right now. Please try again in a moment.',
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send to DJ Misha';
    }
  }

  function bindEvents() {
    backBtn.addEventListener('click', () =>
      goToStep(Math.max(0, state.currentStep - 1)),
    );

    nextBtn.addEventListener('click', () => {
      if (!validateCurrentStep()) return;
      syncFormDataFromInputs();
      const nextStep = state.currentStep + 1;
      if (nextStep <= MAX_STEPS) {
        goToStep(nextStep);
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm();
    });

    skipDayBtn.addEventListener('click', () => {
      const dayInputs = form.querySelectorAll('input[name="meeting_day"]');
      dayInputs.forEach((input) => (input.checked = false));
      submitForm();
    });

    document
      .querySelectorAll(
        'input[name="parts_of_day[]"], input[name="key_moments[]"], input[name="lighting[]"], input[name="addons[]"], input[data-exclusive], input[data-other-toggle]',
      )
      .forEach((input) => {
        input.addEventListener('change', () => {
          handleExclusiveSelection(input);
          if (input.name === 'parts_of_day[]') updateTimelineSections();
        });
      });

    form.querySelectorAll('.pf-time-adjust').forEach((button) => {
      button.addEventListener('click', () => adjustTimelineTime(button));
    });

    document.querySelectorAll('[data-toggle-target]').forEach((toggle) => {
      toggle.addEventListener('change', toggleSubFields);
    });

    document.querySelectorAll('[data-other-toggle]').forEach((toggle) => {
      toggle.addEventListener('change', toggleSubFields);
    });
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    const meetingDay = form.querySelector(
      'input[name="meeting_day"]:checked',
    )?.value;
    const meetingConfirmation = meetingDay
      ? ` We’ll confirm your call for ${meetingDay[0].toUpperCase()}${meetingDay.slice(1)} at 2:00 PM Pacific by email.`
      : '';
    const message = `DJ Misha will review your answers.${meetingConfirmation}`;
    successMessage.textContent = message;
    clearSavedState();
  }

  function initialize() {
    const ready = getInitialState();
    if (!ready) return;

    applyWelcomeText();
    bindEvents();
    const saved = readSavedState();
    if (saved && saved.name === state.name && saved.currentStep) {
      state.currentStep = Math.min(saved.currentStep, MAX_STEPS);
      state.data = saved.data || {};
      restoreInputsFromState();
    } else {
      if (saved) clearSavedState();
      state.currentStep = 0;
    }
    attachBudgetBehaviour();
    goToStep(state.currentStep);
    toggleSubFields();
    updateTimelineSections();
  }

  initialize();
})();
