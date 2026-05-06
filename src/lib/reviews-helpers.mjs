import { createHash } from 'node:crypto';

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
  'saxophonist': /\bsax(?:ophon(?:e|ist))?|brian pierini|jason(?:\s+whitmore)?\b.*\bsax/i,
  'dancing': /\bdanc(?:e|ed|ing|ers?)\b/i,
  'dance floor': /\bdance\s+floor\b/i,
  'playlist': /\bplaylist\b/i,
  'music selection': /\bmusic\s*selection|selection\s*of\s*music|music.*(?:taste|choice|pick)|(?:great|amazing|perfect|awesome|fantastic|incredible|good)\s+(?:selection|mix|variety)\b/i,
  'easy to work with': /\beasy\s+to\s+(?:work\s+with|communicate\s+with|coordinate\s+with)\b/i,
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
  const parts = authorName.trim().split(/\s+/).filter((p) => p.length > 0);
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
  return createHash('md5')
    .update(author + date)
    .digest('hex')
    .slice(0, 8);
}
