/**
 * Blog post data — single source of truth.
 *
 * Used by the homepage, sidebar, and blog index page.
 */

export interface BlogPost {
  title: string;
  slug: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export const blogPosts: BlogPost[] = [
  {
    title:
      'Your Wedding, Your Music: How I Spin a DJ Set Tailored to Your Vision',
    slug: 'your-wedding-your-music-how-i-spin-a-dj-set-tailored-to-your-vision',
    image: '/images/epic-DJ-set-wedding-dance-party-298x200.jpg',
    imageWidth: 298,
    imageHeight: 200,
  },
  {
    title: 'Crafting the Perfect Toast: DJ Tips for a Memorable Wedding Speech',
    slug: 'crafting-the-perfect-toast-dj-tips-for-a-memorable-wedding-speech',
    image: '/images/wedding-dj-toast-296x200.jpg',
    imageWidth: 296,
    imageHeight: 200,
  },
  {
    title: 'The Art of Taking Requests: A DJ\u2019s Perspective',
    slug: 'the-art-of-taking-requests-a-djs-perspective',
    image: '/images/Screenshot-2024-09-14-at-6.18.37-AM-274x200.jpg',
    imageWidth: 274,
    imageHeight: 200,
  },
  {
    title: 'A Guide to Planning for Your Wedding with DJ Misha',
    slug: 'a-guide-to-planning-for-your-wedding-with-dj-misha',
    image: '/images/10-i-4lhqfht-l-300x200.jpg',
    imageWidth: 300,
    imageHeight: 200,
  },
  {
    title:
      'DJ Misha Rocks the Party: A Night of Electronic Dance Music and House Music in San Diego',
    slug: 'edm-dj-for-party-or-private-event-electronic-dance-music',
    image: '/images/vish-2648-3427900361-O-300x200.jpg',
    imageWidth: 300,
    imageHeight: 200,
  },
  {
    title: 'Prices, Rates and Average Cost for Hiring a DJ',
    slug: 'prices-rates-and-average-cost-for-hiring-a-dj',
    image: '/images/10-i-4lhqfht-l-300x200.jpg',
    imageWidth: 300,
    imageHeight: 200,
  },
];
