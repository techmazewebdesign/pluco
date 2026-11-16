import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteMetadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/sales-team/',
        '/admin/',
        '/agent/',
        '/dashboard/',
        '/consultant/',
        '/compliance-officer/',
        '/case-manager/',
        '/document-reviewer/',
        '/enquiry-handler/',
        '/customer-service/',
        '/bookings/',
        '/help/consultant-guide',
        '/login',
        '/signup',
        '/complete-login',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/verify-otp',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
