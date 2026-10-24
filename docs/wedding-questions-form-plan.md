# Planning Details Form: Standalone Build Plan

**Audience:** AI coding agent implementing this on djmisha.com.
**Owner:** DJ Misha.
**Deliverable:** the standalone wedding-planning questionnaire currently implemented at `/wedding-planning/`, its local assets, and its independent PHP mail processor.

**Status:** This document is the current implementation specification. Later owner-requested changes supersede the earlier draft requirements; the plan below records the current behavior and processor contract.

---

## 1. Goal

After a prospective couple submits the main contact form, they receive an email containing a link to a second, short form. That link carries their **name** in the query string, so they never retype it. The second form collects the logistics and preferences that the contact form doesn't (timeline, spaces, music taste, lighting, add-ons, budget, decision stage) so that by the time DJ Misha talks to them, he already knows most of what he needs. The final step lets them request a 2:00 PM Pacific video call on a weekday.

This form is used only to vet **wedding** clients, so there is **no event-type branching** and no wedding-only conditional logic. Every question is shown to everyone.

---

## 2. Hard Constraints (read first)

1. **Standalone feature.** Do not modify shared CSS/JS, templates, partials, navigation, routing config, `robots.txt`, `.htaccess`, or the booking intake form. The page and processor are separate from the shared booking-form implementation.
2. **No shared code dependencies.** The page must not import or load existing site stylesheets, scripts, templates, partials, or PHP files. It may use its own Astro route and feature-local assets; the independent PHP processor is deployed under `/php/` because the existing deployment copies that directory.
3. **Reading existing code is allowed and encouraged** for reference only. Study it, then reproduce its conventions inside the new files (see Section 3).
4. **Self-contained assets.** CSS and JavaScript live in `public/wedding-planning/` and use the `pf-` prefix. The PHP endpoint is a new standalone file at `php/process-wedding-planning.php`.
5. **Own PHP processor** that emails `info@djmisha.com` (see Section 8).
6. **Not indexable** by search engines (see Section 4).
7. **If something requires touching shared code** (for example, mail credentials that only exist in a shared config file, or a route that must be registered), **stop and ask the owner** rather than working around it by editing or including shared code.

**Verification:** Changes for this feature are limited to newly added files, including this planning document, `src/pages/wedding-planning/index.astro`, `public/wedding-planning/pf.css`, `public/wedding-planning/pf.js`, and `php/process-wedding-planning.php`. Do not change existing shared files.

---

## 3. Conventions to Match (study, don't import)

Before writing code, read the existing **booking intake form** (front end and PHP processor) and note its conventions. Then reproduce them in new, self-contained files:

- Page structure and markup patterns for a multi-step form (step containers, headings, buttons, progress element, error display).
- CSS approach: class naming, spacing scale, typography, button and input styles, card and chip styles, transitions. Use the site's brand colors and font in the feature stylesheet. All corners are square (zero border radius) per owner request. Do not link to the site's global stylesheet.
- JS approach: vanilla JS vs. framework, module pattern, how steps advance, how validation messages appear, how transitions are animated, how the form is submitted. **Match whatever the booking intake form does** for step granularity and interaction behavior. If a framework or library is used there, a copy may be loaded here only if it can be served from the new folder or a CDN, never from existing shared assets.
- PHP processor structure: how input is validated and sanitized, how mail is sent, how spam is handled, response format, error handling.
- Page chrome: if the booking intake form shows a logo or header, reproduce a minimal version in this page's own markup. **Omit site navigation and outbound links** so the visitor stays focused on finishing.
- Responsive behavior and breakpoints. All feature borders are square-cornered; primary buttons use the site's filled accent-button treatment.

### Current file layout

```
src/pages/wedding-planning/index.astro
public/wedding-planning/pf.css
public/wedding-planning/pf.js
php/process-wedding-planning.php
```

The static Astro page includes only its feature-local stylesheet and script. The endpoint is a standalone PHP file deployed at `/php/process-wedding-planning.php`.

---

## 4. Entry Point and URL Contract

The page is opened from an emailed link such as:

```
https://djmisha.com/wedding-planning/?name=Hannah%20Mattson
```

| Param  | Required | Handling                                                                                                              |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `name` | Yes      | Trim, strip tags, max 100 chars. Display as text. Derive first name (first whitespace-separated token) for greetings. |

- Treat the name as an untrusted display string, not a security credential. The page assigns it through DOM `textContent`; the processor strips tags and control characters and enforces the 100-character limit.
- **Access gate:** if the name is missing and there is no saved form state with a name, hide the questionnaire and show an access message asking the visitor to use the personalized link. A name in the URL is not authentication; this page does not use the name to authorize access.
- The name is carried through the form as a hidden field and is not re-asked in the normal path. No client email is requested, carried in the URL or form, or used by this feature.
- **Generating the emailed link** (the contact form sending the email) is **out of scope**. This plan only receives the link. The owner will wire up the link separately.
- After a non-empty name is read, the page removes the query string with `history.replaceState`. Visitors may resume using feature-specific `localStorage` state matched by name.

### Indexing and caching

- The static page includes `<meta name="robots" content="noindex, nofollow">`.
- No `X-Robots-Tag` or `Cache-Control` response headers are configured: this route is static output and no shared server/deployment configuration is to be changed.
- Do not add links to the page or add it to the sitemap. Do not edit `robots.txt`.

---

## 5. Experience Requirements

### 5.1 Structure

- **One step per view.** Each question below is its own step, shown one at a time, like the booking intake form. If the booking intake form's step granularity differs (for example, if it groups related fields per step), mirror its granularity instead.
- There are 18 question steps, plus a welcome screen and thank-you screen. Each question step has a descriptive eyebrow naming that step; the progress header only shows the step count.
- Conditional sub-fields (for example, the “Other” space text field) appear **inside** their step and never add or remove steps, so the step count stays fixed and the progress indicator stays honest.

### 5.2 Progress indicator

- Always visible. A progress bar showing the proportion complete, plus text such as `Step 7 of 18`. The step-specific eyebrow appears immediately above the question; the progress header has no section label.
- Updates reactively as the user moves forward or back, with a smooth animation (respect `prefers-reduced-motion`).
- Welcome screen copy: "A few quick questions to help us focus on what matters most to you. It only takes a few minutes."

### 5.3 Keep them moving and motivated

- Short, upbeat, plain-language copy. Lead each step with the question, followed by a brief helper line.
- No section milestone toasts/banners are currently shown.

- Primary button label: **Continue**. Final step button: **Send to DJ Misha**. Secondary: **Back**.
- "I'm not sure yet" is an ordinary, non-exclusive option on the key-moments step. It can be selected together with other moments. The lighting "not interested" and add-ons "none" options remain exclusive within their respective groups; selecting another option clears those exclusives.
- Selected cards and chips use a filled accent background without bolding their labels; their selected appearance does not revert on hover.

### 5.4 Behavior

- **Reactive:** transitions, inline validation, selection states, and slider feedback are handled by the feature-local script.
- Continue remains visible on question steps and validates on click; the final step shows only the submit button. Back preserves answers.
- On step changes the page scrolls to the top and focuses the first focusable control in the active step.
- **Autosave:** save answers to the feature-specific `pf-state-v1` key in `localStorage` (try/catch every access; the form must work if storage is unavailable). Restore progress and resume when a saved name is available. Clear on successful submit. No expiry or per-name keying is currently implemented. Older saved email values are discarded.
- **Mobile-first.** Large touch targets (min 44px), thumb-friendly layout, no horizontal scrolling.
- **Accessibility currently implemented:** choice controls use labeled inputs and fieldsets; focus styles and keyboard-operable slider handles are provided; the progress header is `aria-live="polite"`. Errors are shown inline. Dedicated screen-reader testing remains outstanding.

---

## 6. Form Content, Section by Section

Voice: warm, confident, concise. "We" refers to DJ Misha's services; "DJ Misha" is used in the third person where indicated.

Field names (`name=` / JSON keys) are specified so the front end and processor agree.

### Section 1: Your Day

**Step 1: `parts_of_day`** (multi-select cards, required, min 1)

- Question: **Which parts of your day would you like us involved in?**
- Helper: "Select all that apply."
- Options: Ceremony; Cocktail hour; Reception

**Step 2: `timeline`** (textarea, required)

- Question: **What does your timeline look like?**
- Helper: "Ballpark is totally fine. Include rough start and end times for each part."
- Placeholder: `Example: Ceremony 4:30-5:00pm, Cocktail hour 5:00-6:00pm, Dinner 6:00-7:00pm, Dancing 8:00-10:00pm`
- Max 2,000 chars.

**Step 3: `space_type`** (multi-select, required, min 1)

- Question: **Tell us about the space(s) where the music will happen.**
- Helper: "Select all that apply. This helps us plan power, weather coverage, and setup."
- Options, in display order: Ballroom; Outdoors; Tent or marquee; Inside a house; Backyard; Barn; Other
- Choosing **Other** reveals required `space_type_other` (text, max 150).

**Step 4: `key_moments`** (multi-select, required, min 1)

- Question: **Which key moments would you like to highlight?**
- Helper: "Select all that apply."
- Options: Grand entrance; First dance; Parent dances; Cake cutting; Bouquet/garter; Last dance or send-off; **I'm not sure yet** (ordinary multi-select choice; it does not clear other selections)

**Step 5: `mc_style`** (single-select cards, required)

- Question: **What kind of MC style fits your day?**
- Option A: **Light and professional**, "Keeps the event moving forward."
- Option B: **Front and center**, "Tells jokes, leads line dances, takes the stage."

**Step 6: `coordinator`** (single-select, required)

- Question: **Do you have a planner or day-of coordinator?**
- Options: Yes; No; **I'm not sure yet**
- No coordinator name or contact details are collected.

### Section 2: Your Music

**Step 7: `music_styles`** (multi-select chips, required, min 1)

- Question: **What do you want to hear on the dance floor?**
- Helper: "Pick as many as you like."
- Options: Dance; Pop; Disco; Funk; EDM; House; Tech house; Hip hop; R&B; Sing-alongs; Rock; Country; Latin; Reggaeton; Reggae; Dancehall; Soul; Indie. Then a line break, followed by the decade choices 70's; 80's; 90's; 2000's; 2010's; 2020's.

**Step 8: `songs_to_skip`** (textarea, optional)

- Question: **Is there any music you would NOT like to hear?**
- Helper: "List any songs or artists you would not like to hear."
- Placeholder: `Songs or artists you would not like to hear`
- Max 1,500 chars. Include a visible "Skip" affordance or allow Continue with an empty value.

**Step 9: `music_involvement`** (5-stop slider, required interaction)

- Question: **How involved do you want to be in planning the music?**
- Helper: "Any selection is okay. It just helps us plan for your day."
- Stops (submit the integer 1-5; the processor derives the display label):

| Stop | Label                                                                    |
| ---- | ------------------------------------------------------------------------ |
| 1    | I trust you completely. Surprise me.                                     |
| 2    | Here's the vibe and some songs I love. You take it from there.           |
| 3    | I'll give you must-plays and do-not-plays, and you handle the rest.      |
| 4    | I'll make playlists to give you a good idea for each portion of the day. |
| 5    | I'll give you playlists and want them played in exact order.             |

- Show the current stop's label centered in a red pill with white text beneath the slider. The scale labels 1 and 5 align with the two ends of the track. The slider is required and must be interacted with before continuing; the selected value is retained when resuming.

**Step 10: `planning_style`** (5-stop slider, required interaction)

- Question: **Where are you on the planning spectrum?**
- Helper: "Any level is okay. We just like to know upfront so we can show up the right way."
- Stops (submit the integer 1-5; the processor derives the display label):

| Stop | Label                       |
| ---- | --------------------------- |
| 1    | Super chill                 |
| 2    | Certain things I care about |
| 3    | Somewhat particular         |
| 4    | Very particular             |
| 5    | Total Bridezilla            |

- Keep the tone playful. Same centered red pill, endpoint alignment, required-interaction, and resume behavior as Step 9.

### Section 3: The Extras

**Step 11: `lighting`** (multi-select, required, min 1)

- Question: **Which lighting services interest you?**
- Helper: "Select all that apply."
- Options: Uplighting; Basic dance floor lighting; Advanced dance floor lighting build-out; Whole-room lighting and décor; **I'm not interested in lighting services** (exclusive)

**Step 12: `addons`** (multi-select, required, min 1)

- Question: **Interested in any additional services?**
- Helper: "In partnership with longtime collaborators and trusted vendors."
- Options, in this order: Live saxophone; Live guitar; Live violin; **Portrait lounge**; Lighting design; **None of these** (exclusive, shown below the others)

**Step 13: `budget`** (dual-handle range slider)

- Question: **Please tell us your ballpark budget range for DJ, music, and related services.**
- Small explainer under the slider: "This helps us more closely match our services to your budget."
- Range: **$2,500 to $10,000**, step $250. The top end is displayed as **$10,000+**.
- Both handles start at the **extremes** (full range) so the form doesn't anchor them low or high. Display the live selection, for example `$4,000 - $7,500`.
- Submit `budget_min`, `budget_max` (integers; `10000` means "$10,000 or more"), and `budget_touched` (`"true"`/`"false"`; true if the user moved either handle). The email must show whether the range was touched.
- Both handles support pointer/touch dragging, clicking near the desired track position, and keyboard arrow keys. Keep a minimum $250 gap and constrain values to $2,500–$10,000 in $250 increments.
- Continue is always enabled on this step.

### Section 4: Where You're At

**Step 14: `decision_stage`** (single-select, required)

- Question: **Where are you in your decision?**
- Options:
  1. I'm just getting started and browsing
  2. I'm comparing different vendors
  3. I'm very interested and just have a few questions for you
  4. You're the only DJ for us

**Step 15: `wedding_priorities`** (textarea, optional)

- Question: **Tell us what is most important to you on your wedding day.**
- Helper: "The more detail you share, the better we can understand what matters to you and how to help make your day feel right."
- Field name: `wedding_priorities`; max 1,000 chars.

**Step 16: `contact_method`** (single-select, required)

- Question: **What's the best way to reach you?**
- Options: Text; Email; Phone call
- No phone number is collected, regardless of selected contact method.
- `best_time` (optional single-select chips): Mornings; Afternoons; Evenings; No preference. Label: "Best time to reach you".

**Step 17: `anything_else`** (textarea, optional)

- Question: **What are your most burning questions for DJ Misha?**
- Helper: "What would make this the right fit for you?"
- Max 2,000 chars.

### Section 5: Meet DJ Misha

**Step 18: `meeting_day`** (single radio group, **not** a calendar)

- Heading: **Let's talk it through.**
- Copy: "DJ Misha personally meets with couples if it's a good match. Pick the weekday that works best for a video call at **2:00 PM Pacific**."
- Helper: "We'll confirm the exact date by email."
- Options (radio): Monday; Tuesday; Wednesday; Thursday; Friday
- No qualification logic. Everyone can choose.
- **Optional:** include a quiet "Skip for now" link that submits without a day. Final button: **Send to DJ Misha**.
- Submit `meeting_day` (lowercase weekday, or empty if skipped). The time is fixed and is not a field.

### Welcome screen (before Step 1)

- Greeting: "Hi {FirstName}!"
- Body: "A few quick questions to help us focus on what matters most to you. It only takes a few minutes. DJ Misha will review your answers and come prepared to continue the conversation, focusing on the details that matter most to you."
- No separate welcome button; the standard **Continue** action advances to Step 1.

### Thank-you screen (after successful submit)

- Heading: "You're all set, {FirstName}!"
- Body: "DJ Misha will review your answers."
- If `meeting_day` was chosen: "We'll confirm your call for {Weekday} at 2:00 PM Pacific by email."
- No navigation away required. Clear autosaved data.

---

## 7. Submitted Payload (front end to processor)

POST `FormData` to `/php/process-wedding-planning.php` via `fetch`. Fields:

```text
name: hidden; query value or restored saved state
parts_of_day[]: ceremony | cocktail_hour | reception
timeline: required string, 10-2,000 characters
space_type[]: ballroom | tent_or_marquee | outdoors | barn | inside_a_house | other | backyard
space_type_other: optional string, max 150 characters; required when other is selected
key_moments[]: grand_entrance | first_dance | parent_dances | cake_cutting | bouquet_garter | last_dance | not_sure_yet
mc_style: light_professional | front_and_center
coordinator: yes | no | not_sure
music_styles[]: dance | pop | disco | funk | edm | house | tech_house | hip_hop | rnb | sing_alongs | rock | country | latin | reggaeton | reggae | dancehall | soul | indie | 1970s | 1980s | 1990s | 2000s | 2010s | 2020s
songs_to_skip: optional string, max 1,500 characters
music_involvement: integer 1-5; processor derives the display label
planning_style: integer 1-5; processor derives the display label
lighting[]: uplighting | basic_dance_floor_lighting | advanced_dance_floor_buildout | whole_room_lighting | not_interested
addons[]: live_saxophone | live_guitar | live_violin | portrait_lounge | lighting_design | none
budget_min, budget_max: integers 2500-10000, increments of 250, minimum $250 gap
budget_touched: "true" | "false"
decision_stage: browsing | comparing_vendors | few_questions | only_dj
wedding_priorities: optional string, max 1,000 characters
contact_method: text | email | phone_call; no phone number field
best_time: optional mornings | afternoons | evenings | no_preference
anything_else: optional string, max 2,000 characters
meeting_day: optional monday | tuesday | wednesday | thursday | friday
website: honeypot (must be empty)
```

The processor must **whitelist every enum** server-side and never trust the front end's labels, only the values.

## 8. PHP Processor (`php/process-wedding-planning.php`)

Self-contained. No `include`/`require` of existing site files.

**Request handling**

- Accept `POST` only. Reject others with 405.
- CSRF tokens, Origin/Referer checks, reCAPTCHA, and IP-based rate limiting are intentionally not used in this version, per owner decision.
- Respond with JSON: `{ "ok": true }` on success, or `{ "ok": false, "errors": { "<field>": "<message>" } }`; invalid methods use 405, invalid fields use 400, and mail failures use 500.

**Validation and sanitization**

- Re-validate everything server-side: required fields, enums, array contents and exclusivity for the lighting `not_interested` and add-ons `none` choices, numeric ranges (`budget_min <= budget_max`, both within 2500-10000, multiples of 250), and the string limits above. Validate `name` at max 100 characters.
- Require the budget handles to remain at least $250 apart, matching the client-side slider.
- Trim all strings. Strip control characters. **Strip CR/LF from anything used in mail headers** (header injection).
- No client email or phone number is accepted as a questionnaire field.
- The email body is plain text; strip control characters from submitted values and do not interpolate values as HTML.

**Spam and abuse protection**

- Honeypot field `website` must be empty.
- No submission-time or timestamp guard is used. The honeypot returns a generic success response without sending mail.

**Mail**

- Send mail with PHP's native `mail()` function; the feature does not include the shared processor or depend on shared mail configuration.
- To: `info@djmisha.com`
- From: `no-reply@djmisha.com`.
- No `Reply-To` header is set.
- Subject: `Contact from djmisha.com - {Name}` (exactly matching the owner notification subject used by the main contact form, so related messages have the same subject).
- Send **no** confirmation email to the client (out of scope).
- Log send failures with `error_log` and no personal details or full payloads.

**Email body** is plain text. Map all enum values to their display labels, group answers by section, include the current question meaning for `wedding_priorities`, render slider answers as both number and label, and state whether the budget was adjusted from the default. Format the submission time in America/Los_Angeles.

```
PLANNING FORM SUBMITTED
Name, Preferred contact method, Best time to reach you
Submitted: {timestamp, Pacific}

YOUR DAY
Parts of your day, Timeline, Spaces (+ other), Key moments to highlight, MC style, Planner or day-of coordinator

YOUR MUSIC
Music genres and decades, Songs to skip, Music involvement (n/5: label), Planning style (n/5: label)

THE EXTRAS
Lighting, Add-ons, Budget: $X - $Y (Adjusted by couple / Not adjusted from default)

WHERE YOU ARE
Decision stage, Most important on your wedding day, Anything else

MEETING REQUEST
Requested weekday: {Weekday} at 2:00 PM Pacific (requested, not confirmed)   or   "Skipped"
```

---

## 9. Out of Scope / Deferred

- Generating or sending the emailed link (handled elsewhere).
- Any modification of the main contact form or the booking intake form.
- A client confirmation email.
- A real calendar or availability logic (this version is a fixed weekday picker).
- Qualification or gating of who can request a call.
- Event-type branching and wedding-only conditionals.
- Questions deliberately left out for now: sound-system provision, ceremony microphones, venue music cutoff time. Keep the step structure easy to extend later.

---

## 10. Verification Status

The following checks are part of the current implementation review:

- Astro production build passes under Node 22.
- Prettier checks pass for the Astro page, CSS, and JavaScript.
- The form contains one active question view per step (18 total), with the welcome and success screens separate.
- The current venue, key-moment, music genre/decade, lighting, add-on, decision-stage, contact-method, and weekday values are documented above and whitelisted by the processor.
- The budget range is constrained in the browser and server-side to $2,500-$10,000 in $250 increments with a minimum $250 gap; its untouched/adjusted flag is included in the email.
- The form has no submission-time or timestamp guard; the `website` honeypot is the only form-level spam check.
- A jsdom end-to-end flow passed for all 18 questions, Other-space reveal/validation, selection exclusivity, untouched budget, final-step controls, reduced-motion behavior, and success state.
- `npm test` cannot run a suite because no files match the configured `tests/**/*.test.{js,mjs}` patterns.
- An actual mail delivery, PHP CLI lint, and visual/accessibility checks at multiple viewport sizes still require an environment with PHP/mail and browser testing.

---

## 11. Confirmed Owner Decisions

Route `/wedding-planning/`; query parameter `name` only (display value, not authentication); 18 separate question steps; name is cleaned and removed from the URL after reading; missing names show an access message unless saved state is available; saved progress resumes by name; client email and phone number are not collected or used; meeting day can be skipped; key-moments “I'm not sure yet” is not exclusive; processor subject matches the main contact form's `Contact from djmisha.com - {Name}` subject; no client `Reply-To` header; no CSRF token, Origin/Referer validation, reCAPTCHA, or IP rate limiting; and the static page uses the noindex meta tag only, without shared server/header changes.
