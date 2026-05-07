/** Core SEO/meta properties shared by all layouts */
export interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: object[];
}

/** Extended props for the base layout (includes body/page-level options) */
export interface BaseLayoutProps extends SEOProps {
  bodyClass?: string;
  isHome?: boolean;
  extraHeadContent?: string;
  useFancybox?: boolean;
}

/** Props for layouts with a page heading and optional extra head content */
export interface PageLayoutProps extends SEOProps {
  heading?: string;
  extraHeadContent?: string;
}

/** Props for BlogLayout (uses pageHeading instead of heading) */
export interface BlogLayoutProps extends SEOProps {
  pageHeading?: string;
}
