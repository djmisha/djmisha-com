/**
 * Site-wide configuration constants.
 *
 * Single source of truth for values used across multiple files.
 * Import from here instead of hardcoding.
 */

export const SITE_URL = 'https://djmisha.com';

export const PHONE = {
  /** Schema/tel format */
  tel: '+1-619-786-2664',
  /** tel: link href (digits only) */
  href: 'tel:+16197862664',
  /** Display format */
  display: '(619) 786-2664',
};

export const SOCIAL = {
  instagram: 'https://www.instagram.com/djmishasd/',
  youtube: 'https://www.youtube.com/@djmisha',
  facebook: 'https://www.facebook.com/djmishaSandiego',
  yelp: 'https://www.yelp.com/biz/dj-misha-san-diego-3',
  google:
    'https://www.google.com/maps/place/DJ+Misha/@32.798797,-117.2528273,15z/data=!3m1!5s0x80dc019320e5a943:0x21495feab25fb788!4m8!3m7!1s0x80dbffcb31404e13:0x3fae10d8742ab418!8m2!3d32.798797!4d-117.2528273!9m1!1b1!16s%2Fg%2F1hm4n666z?entry=ttu',
  gigtown: 'https://www.gigtown.com/artists/dj-misha',
  gigsalad: 'https://www.gigsalad.com/dj_misha_san_diego',
  googleShort: 'https://goo.gl/maps/2rRm8kBYePqaPbVE6',
  zola: 'https://www.zola.com/wedding-vendors/wedding-bands-djs/dj-misha',
};

/** Google review URL for "leave a review" links */
export const GOOGLE_REVIEW_URL = SOCIAL.google;
