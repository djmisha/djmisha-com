/**
 * Keyword matching patterns — maps each Google Maps keyword to regex patterns
 * that capture the various ways reviewers mention that concept.
 * Google uses AI-based semantic matching; we approximate with expanded patterns.
 *
 * These patterns are tuned to approximate Google's keyword counts as closely
 * as possible. Google's counts (May 2026): saxophonist:14, dancing:36,
 * dance floor:12, personal playlist:2, music selection:23, listening to
 * requests:3, dance mix:2, live saxophone:3, easy to work with:10,
 * wedding planning:3
 */
const KEYWORD_PATTERNS = {
  saxophonist:
    /\bsax(?:ophon(?:e|ist))?|brian pierini|jason(?:\s+whitmore)?\b.*\bsax/i,
  dancing: /\bdanc(?:e|ed|ing|ers?)\b/i,
  'dance floor': /\bdance\s+floor\b/i,
  playlist: /\bplaylist\b/i,
  'music selection':
    /\bmusic\s*selection|selection\s*of\s*music|music.*(?:taste|choice|pick)|(?:great|amazing|perfect|awesome|fantastic|incredible|good)\s+(?:selection|mix|variety)\b/i,
  'easy to work with':
    /\beasy\s+to\s+(?:work\s+with|communicate\s+with|coordinate\s+with)\b/i,
};

/**
 * Returns an array of keywords that match the review text using expanded
 * regex patterns to approximate Google's semantic keyword tagging.
 * @param {string} text - The review text to search within.
 * @param {string[]} keywords - The list of keywords to check.
 * @returns {string[]} Matching keywords.
 */
export function tagKeywords(text, keywords) {
  if (!text || !keywords) return [];
  return keywords.filter((kw) => {
    const pattern = KEYWORD_PATTERNS[kw];
    if (pattern) {
      return pattern.test(text);
    }
    // Fallback: simple case-insensitive substring match
    return text.toLowerCase().includes(kw.toLowerCase());
  });
}

/**
 * Extracts uppercase initials from an author name.
 * Single name → single initial. Two+ names → first char of first + first char of last.
 * @param {string} authorName
 * @returns {string} Uppercase initials.
 */
export function extractInitials(authorName) {
  if (!authorName || !authorName.trim()) return '';
  const parts = authorName
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a deterministic 8-character hex ID from author + date.
 * @param {string} author
 * @param {string} date
 * @returns {string} 8-char MD5 hex hash.
 */
export function generateId(author, date) {
  const { createHash } = process.getBuiltinModule('node:crypto');
  return createHash('md5')
    .update(author + date)
    .digest('hex')
    .slice(0, 8);
}

/**
 * Reads a YYYY-MM-DD review date as a calendar date, not a UTC instant.
 * @param {string} isoDate
 * @returns {{ year: number, month: number, day: number } | null}
 */
export function parseReviewCalendarDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/**
 * Full month, day, and year in en-US, e.g. "September 18, 2027".
 * @param {string} isoDate
 * @returns {string}
 */
export function formatReviewDate(isoDate) {
  const parts = parseReviewCalendarDate(isoDate);
  if (!parts) return String(isoDate || '');
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
}

/**
 * Relative label such as "today", "5 days ago", "2 months ago", or "3 years ago".
 * `now` defaults to the current moment. The review date is compared as a calendar
 * day in the same local calendar as `now`, so a YYYY-MM-DD value does not shift.
 * @param {string} isoDate
 * @param {Date} [now]
 * @returns {string}
 */
function completeUnits(earlier, later, unit) {
  if (unit === 'year') {
    let years = later.year - earlier.year;
    if (
      later.month < earlier.month ||
      (later.month === earlier.month && later.day < earlier.day)
    ) {
      years -= 1;
    }
    return years;
  }
  let months = (later.year - earlier.year) * 12 + (later.month - earlier.month);
  if (later.day < earlier.day) months -= 1;
  return months;
}

export function formatRelativeReviewDate(isoDate, now = new Date()) {
  const review = parseReviewCalendarDate(isoDate);
  if (!review) return '';
  const today = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
  const dayDelta = Math.round(
    (Date.UTC(review.year, review.month - 1, review.day) -
      Date.UTC(today.year, today.month - 1, today.day)) /
      86400000,
  );
  if (dayDelta === 0) return 'today';

  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'always' });
  const earlier = dayDelta < 0 ? review : today;
  const later = dayDelta < 0 ? today : review;
  const sign = dayDelta < 0 ? -1 : 1;
  const months = completeUnits(earlier, later, 'month');
  if (months >= 12) {
    return rtf.format(sign * completeUnits(earlier, later, 'year'), 'year');
  }
  if (months >= 1) return rtf.format(sign * months, 'month');
  return rtf.format(dayDelta, 'day');
}
