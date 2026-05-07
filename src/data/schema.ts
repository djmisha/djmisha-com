/**
 * Shared JSON-LD structured data schemas.
 *
 * The base schemas (Organization, WebSite, LocalBusiness, Person) are identical
 * across all pages. Page-specific schemas (WebPage, FAQPage, etc.) are passed in
 * via the helper function.
 */

export const SITE_NAME = "San Diego DJ for Weddings, Parties & Corporate Events – House Music, EDM & Dance";



const organization = {
  "@context": "http://schema.org/",
  "@id": "https://djmisha.com",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": "https://djmisha.com",
  "logo": {
    "@type": "ImageObject",
    "url": "/images/logo-djmisha.png",
    "width": 400,
  },
  "sameAs": [
    "https://www.instagram.com/djmishasd/",
    "https://www.youtube.com/@djmisha",
    "https://www.facebook.com/djmishaSandiego",
    "https://www.yelp.com/biz/dj-misha-san-diego-3",
    "https://www.gigtown.com/artists/dj-misha",
    "https://www.gigsalad.com/dj_misha_san_diego",
    "https://goo.gl/maps/2rRm8kBYePqaPbVE6",
    "https://www.zola.com/wedding-vendors/wedding-bands-djs/dj-misha",
  ],
  "contactPoint": {
    "telephone": "+1-619-786-2664",
    "contactType": "customer service",
  },
};

const webSite = {
  "@context": "http://schema.org/",
  "@type": "WebSite",
  "url": "https://djmisha.com",
  "name": SITE_NAME,
  "about":
    "DJ Misha is San Diego DJ for parties, corporate events and weddings. Playing house music, EDM, club, dance and much more. \r\n",
};

const localBusiness = {
  "@context": "http://schema.org/",
  "@id": "#LocalBusiness",
  "@type": "LocalBusiness",
  "name": SITE_NAME,
  "url": "https://djmisha.com/",
  "image": "/images/i-4LhQfht-L.jpg",
  "priceRange": "Contact For Pricing",
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "4640 Cass Street #9553",
      "addressLocality": "San Diego",
      "addressRegion": "CA",
      "postalCode": "92109",
      "addressCountry": "US",
      "telephone": "+1-619-786-2664",
    },
  ],
  "employees": ["DJ Misha"],
};

const person = {
  "@context": "http://schema.org",
  "@type": "Person",
  "jobTitle": "DJ",
  "name": "DJ Misha",
  "telephone": "+1-619-786-2664",
  "url": "https://djmisha.com/about/",
  "image": "/images/Best-San-Diego-DJ-djmisha.com-12-300x200.jpg",
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
      "@type": "AggregateRating",
      ratingValue: String(rating.ratingValue),
      reviewCount: String(rating.reviewCount),
    },
  };
  return [orgWithRating, webSite, localBusiness, person, ...pageSchemas];
}
