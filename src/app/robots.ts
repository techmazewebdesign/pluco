import { MetadataRoute } from 'next';

const AI_SEARCH_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
];

export default function robots(): MetadataRoute.Robots {
  const publicRules = {
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
  };

  return {
    rules: [
      { ...publicRules, userAgent: AI_SEARCH_AGENTS },
      publicRules,
    ],
    sitemap: 'https://www.plucogroup.com/sitemap.xml',
    host: 'https://www.plucogroup.com',
  };
}
