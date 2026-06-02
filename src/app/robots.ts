import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/agent', '/api/'],
      },
    ],
    sitemap: 'https://www.plucogroup.com/sitemap.xml',
  };
}
