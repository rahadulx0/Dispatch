import type { MetadataRoute } from 'next';

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/dashboard', '/write', '/edit/', '/admin', '/search'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
