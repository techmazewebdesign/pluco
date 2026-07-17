import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
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
    sitemap: 'https://www.plucogroup.com/sitemap.xml',
    host: 'https://www.plucogroup.com',
  };
}
