/**
 * Shared JSON-LD structured data schemas.
 *
 * The base schemas (Organization, WebSite, LocalBusiness, Person) are identical
 * across all pages. Page-specific schemas (WebPage, FAQPage, etc.) are passed in
 * via the helper function.
 */

import { SITE_URL, PHONE, SOCIAL } from './config';

export const SITE_NAME =
  'San Diego DJ for Weddings, Parties & Corporate Events – House Music, EDM & Dance';

const organization = {
  '@context': 'http://schema.org/',
  '@id': SITE_URL,
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/Best-San-Diego-DJ-djmisha.com-12-768x512.jpg`,
    width: 400,
  },
  sameAs: [
    SOCIAL.instagram,
    SOCIAL.youtube,
    SOCIAL.facebook,
    SOCIAL.yelp,
    SOCIAL.gigtown,
    SOCIAL.gigsalad,
    SOCIAL.googleShort,
    SOCIAL.zola,
  ],
  contactPoint: {
    telephone: PHONE.tel,
    contactType: 'customer service',
  },
};

const webSite = {
  '@context': 'http://schema.org/',
  '@type': 'WebSite',
  url: SITE_URL,
  name: SITE_NAME,
  about:
    'DJ Misha is San Diego DJ for parties, corporate events and weddings. Playing house music, EDM, club, dance and much more.',
};

const localBusiness = {
  '@context': 'http://schema.org/',
  '@id': '#LocalBusiness',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/images/i-4LhQfht-L.jpg`,
  priceRange: 'Contact For Pricing',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '4640 Cass Street #9553',
      addressLocality: 'San Diego',
      addressRegion: 'CA',
      postalCode: '92109',
      addressCountry: 'US',
      telephone: PHONE.tel,
    },
  ],
  employees: ['DJ Misha'],
};

const person = {
  '@context': 'http://schema.org',
  '@type': 'Person',
  jobTitle: 'DJ',
  name: 'DJ Misha',
  telephone: PHONE.tel,
  url: `${SITE_URL}/about/`,
  image: `${SITE_URL}/images/Best-San-Diego-DJ-djmisha.com-12-300x200.jpg`,
};

export const baseSchemas = [organization, webSite, localBusiness, person];

interface AggregateRatingOptions {
  ratingValue: number;
  reviewCount: number;
}

/**
 * Build the full JSON-LD array for a page.
 *
 * @param pageSchemas - Page-specific schemas (WebPage, FAQPage, etc.)
 * @returns The complete schema array to pass to the jsonLd prop.
 *
 * @example
 * ```ts
 * const jsonLd = buildJsonLd(
 *   { "@context": "http://schema.org/", "@type": "WebPage", url: "...", headline: "..." },
 * );
 * ```
 */
export function buildJsonLd(...pageSchemas: object[]): object[] {
  return [...baseSchemas, ...pageSchemas];
}

/**
 * Build the full JSON-LD array with a dynamic AggregateRating on the Organization schema.
 *
 * Use this on pages (like reviews) where the aggregate rating should reflect
 * actual values from the reviews data store rather than being omitted.
 *
 * @param rating - Dynamic rating values from reviews.json
 * @param pageSchemas - Page-specific schemas (WebPage, FAQPage, etc.)
 * @returns The complete schema array with AggregateRating injected into Organization.
 */
export function buildJsonLdWithRating(
  rating: AggregateRatingOptions,
  ...pageSchemas: object[]
): object[] {
  const orgWithRating = {
    ...organization,
    AggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(rating.ratingValue),
      reviewCount: String(rating.reviewCount),
    },
  };
  return [orgWithRating, webSite, localBusiness, person, ...pageSchemas];
}
