import { describe, expect, it } from 'vitest';
import {
  formatRelativeReviewDate,
  formatReviewDate,
  parseReviewCalendarDate,
} from '../src/lib/reviews-helpers.mjs';

const at = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day, 15, 0, 0);
};

describe('review dates', () => {
  it('formats a calendar date in en-US without shifting the day', () => {
    expect(formatReviewDate('2027-09-18')).toBe('September 18, 2027');
    expect(formatReviewDate('2026-11-16')).toBe('November 16, 2026');
    expect(formatReviewDate('2026-01-01')).toBe('January 1, 2026');
  });

  it('rejects calendar dates that do not exist', () => {
    expect(parseReviewCalendarDate('2026-02-31')).toBeNull();
    expect(formatReviewDate('2026-02-31')).toBe('2026-02-31');
    expect(formatRelativeReviewDate('not-a-date', at('2027-09-18'))).toBe('');
  });

  it('labels the same calendar day as today', () => {
    expect(formatRelativeReviewDate('2027-09-18', at('2027-09-18'))).toBe(
      'today',
    );
  });

  it('uses days, months, and years the way a reader would say them', () => {
    const now = at('2027-09-18');
    expect(formatRelativeReviewDate('2027-09-13', now)).toBe('5 days ago');
    expect(formatRelativeReviewDate('2027-07-18', now)).toBe('2 months ago');
    expect(formatRelativeReviewDate('2024-09-18', now)).toBe('3 years ago');
    expect(formatRelativeReviewDate('2027-11-20', now)).toBe('in 2 months');
  });
});
