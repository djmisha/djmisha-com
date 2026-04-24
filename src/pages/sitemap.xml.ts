import type { APIRoute } from 'astro';

const site = 'https://djmisha.com';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  images?: string[];
}

const pages: SitemapEntry[] = [
  {
    loc: `${site}/`,
    lastmod: '2024-09-04T13:40:12+00:00',
    changefreq: 'always',
    priority: '1',
  },
  {
    loc: `${site}/blog/`,
    lastmod: '2020-03-08T23:17:17+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/prices/`,
    lastmod: '2026-04-10T14:29:54+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/about/`,
    lastmod: '2026-04-10T14:20:10+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2013/11/05-i-dsccmdj-l.jpg`,
    ],
  },
  {
    loc: `${site}/music/`,
    lastmod: '2026-03-09T13:16:37+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2018/06/Best-San-Diego-DJ-djmisha.com-12.jpg`,
    ],
  },
  {
    loc: `${site}/sitemap/`,
    lastmod: '2026-03-04T14:09:18+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/services/wedding-dj-in-san-diego/`,
    lastmod: '2025-10-27T22:24:00+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2013/11/10-i-4lhqfht-l.jpg`,
    ],
  },
  {
    loc: `${site}/services/party-birthday-dj-in-san-diego/`,
    lastmod: '2025-10-27T22:23:42+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2013/11/05-i-dsccmdj-l.jpg`,
    ],
  },
  {
    loc: `${site}/services/destination-wedding-dj/`,
    lastmod: '2025-09-18T11:23:20+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2024/09/Screenshot-2024-09-14-at-6.15.51 AM.png`,
      `${site}/wordpress/wordpress/wp-content/uploads/2024/09/Screenshot-2024-09-14-at-6.18.37 AM.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2025/02/Crafting-the-Perfect-Toast-DJ-Tips-for-a-Memorable-Wedding-Speech.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2025/02/wedding-dj-toast.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2025/07/epic-DJ-set-wedding-dance-party.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2025/07/epic-wedding-dance-party.jpg`,
      `${site}/wordpress/wordpress/wp-content/themes/djmisha-LANDED/images/expert.png`,
    ],
  },
  {
    loc: `${site}/services/`,
    lastmod: '2025-09-15T15:41:08+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2019/02/Screen-Shot-2019-02-07-at-11.03.27-AM.png`,
      `${site}/wordpress/wordpress/wp-content/uploads/2018/06/img_0763.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2019/02/Screen-Shot-2019-02-07-at-11.03.33-AM.png`,
      `${site}/wordpress/wordpress/wp-content/uploads/2019/02/Screen-Shot-2019-02-07-at-11.01.21-AM.png`,
    ],
  },
  {
    loc: `${site}/reviews/`,
    lastmod: '2025-07-11T17:18:13+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/blog/your-wedding-your-music-how-i-spin-a-dj-set-tailored-to-your-vision/`,
    lastmod: '2025-07-10T21:14:30+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2025/07/epic-DJ-set-wedding-dance-party.jpg`,
    ],
  },
  {
    loc: `${site}/blog/the-art-of-taking-requests-a-djs-perspective/`,
    lastmod: '2025-02-19T23:06:41+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2024/09/Screenshot-2024-09-14-at-6.18.37 AM.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2024/09/Screenshot-2024-09-14-at-6.15.51 AM.png`,
    ],
  },
  {
    loc: `${site}/blog/crafting-the-perfect-toast-dj-tips-for-a-memorable-wedding-speech/`,
    lastmod: '2025-02-19T23:03:11+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2025/02/wedding-dj-toast.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2025/02/Crafting-the-Perfect-Toast-DJ-Tips-for-a-Memorable-Wedding-Speech.jpg`,
    ],
  },
  {
    loc: `${site}/dj-saxophone/`,
    lastmod: '2025-02-08T12:02:20+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2018/06/Best-San-Diego-DJ-djmisha.com-12.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2018/06/img_0763.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2017/04/17807339_1878248429117390_307352909468015453_o.jpg`,
      `${site}/wordpress/wordpress/wp-content/uploads/2012/05/misha-jason.jpg`,
    ],
  },
  {
    loc: `${site}/contact/`,
    lastmod: '2024-11-17T14:37:11+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/themes/djmisha-LANDED/images/expert.png`,
    ],
  },
  {
    loc: `${site}/blog/a-guide-to-planning-for-your-wedding-with-dj-misha/`,
    lastmod: '2024-09-09T15:07:42+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2013/11/10-i-4lhqfht-l.jpg`,
    ],
  },
  {
    loc: `${site}/blog/edm-dj-for-party-or-private-event-electronic-dance-music/`,
    lastmod: '2023-03-03T10:48:57+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/ngg_featured/vish-2648-3427900361-O.JPG`,
    ],
  },
  {
    loc: `${site}/services/corporate-event-dj-in-san-diego/`,
    lastmod: '2022-07-11T20:04:45+00:00',
    changefreq: 'weekly',
    priority: '0.7',
    images: [
      `${site}/wordpress/wordpress/wp-content/uploads/2018/06/Best-San-Diego-DJ-djmisha.com-12.jpg`,
    ],
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const urlEntries = pages
    .map((page) => {
      let imageEntries = '';
      if (page.images && page.images.length > 0) {
        imageEntries = page.images
          .map(
            (img) => `
		<image:image>
			<image:loc>
				<![CDATA[${img}]]>			</image:loc>
		</image:image>`
          )
          .join('');
      }

      return `	<url>
		<loc><![CDATA[${page.loc}]]></loc>
		<lastmod><![CDATA[${page.lastmod}]]></lastmod>
		<changefreq><![CDATA[${page.changefreq}]]></changefreq>
		<priority><![CDATA[${page.priority}]]></priority>${imageEntries}
	</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urlEntries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
