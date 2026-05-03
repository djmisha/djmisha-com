import type { APIRoute } from 'astro';

const site = 'https://djmisha.com';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
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
  },
  {
    loc: `${site}/music/`,
    lastmod: '2026-03-09T13:16:37+00:00',
    changefreq: 'weekly',
    priority: '0.7',
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
  },
  {
    loc: `${site}/services/party-birthday-dj-in-san-diego/`,
    lastmod: '2025-10-27T22:23:42+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/services/destination-wedding-dj/`,
    lastmod: '2025-09-18T11:23:20+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/services/`,
    lastmod: '2025-09-15T15:41:08+00:00',
    changefreq: 'weekly',
    priority: '0.7',
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
  },
  {
    loc: `${site}/blog/the-art-of-taking-requests-a-djs-perspective/`,
    lastmod: '2025-02-19T23:06:41+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/blog/crafting-the-perfect-toast-dj-tips-for-a-memorable-wedding-speech/`,
    lastmod: '2025-02-19T23:03:11+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/dj-saxophone/`,
    lastmod: '2025-02-08T12:02:20+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/contact/`,
    lastmod: '2024-11-17T14:37:11+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/blog/a-guide-to-planning-for-your-wedding-with-dj-misha/`,
    lastmod: '2024-09-09T15:07:42+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/blog/edm-dj-for-party-or-private-event-electronic-dance-music/`,
    lastmod: '2023-03-03T10:48:57+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    loc: `${site}/services/corporate-event-dj-in-san-diego/`,
    lastmod: '2022-07-11T20:04:45+00:00',
    changefreq: 'weekly',
    priority: '0.7',
  },
];

export const GET: APIRoute = () => {
  const urlEntries = pages
    .map((page) => {
      return `	<url>
		<loc><![CDATA[${page.loc}]]></loc>
		<lastmod><![CDATA[${page.lastmod}]]></lastmod>
		<changefreq><![CDATA[${page.changefreq}]]></changefreq>
		<priority><![CDATA[${page.priority}]]></priority>
	</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
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
