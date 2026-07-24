import { MetadataRoute } from 'next';
import {
  ENGLISH_TO_PERSIAN_PATH,
  PERSIAN_SERVICES,
} from '@/lib/plucoPersianServices';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';

const BASE_URL = 'https://www.plucogroup.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    { url: '/',                        priority: 1.0,  changeFrequency: 'weekly'  },
    { url: '/our-people',              priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/new-identity',            priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/eu-property-purchase',    priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/eu-residency',            priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/spain-digital-nomad-visa', priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/us-green-card',           priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/banking',                 priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/banking-compliance',      priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/dispute-resolution',      priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/financial-discrimination', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/international-contracts', priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/publications',            priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/business-solutions',      priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/eu-company-registration', priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/industries',              priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/consultants',             priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/about-us',                priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/contact',                 priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/enquire',                 priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/privacy-policy',          priority: 0.3,  changeFrequency: 'yearly'  },
    { url: '/disclaimer',              priority: 0.3,  changeFrequency: 'yearly'  },
  ] as const;

  const englishPages: MetadataRoute.Sitemap = publicPages.map(
    ({ url, priority, changeFrequency }) => {
      const persianPath = url === '/' ? '/fa' : ENGLISH_TO_PERSIAN_PATH[url];
      const canonicalUrl = `${BASE_URL}${url}`;

      return {
        url: canonicalUrl,
        changeFrequency,
        priority,
        ...(persianPath
          ? {
              alternates: {
                languages: {
                  en: canonicalUrl,
                  fa: `${BASE_URL}${persianPath}`,
                  'x-default': canonicalUrl,
                },
              },
            }
          : {}),
      };
    },
  );

  const persianPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/fa`,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          en: BASE_URL,
          fa: `${BASE_URL}/fa`,
          'x-default': BASE_URL,
        },
      },
    },
    ...Object.entries(PERSIAN_SERVICES).map(([slug, service]) => ({
      url: `${BASE_URL}/fa/services/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${BASE_URL}${service.englishPath}`,
          fa: `${BASE_URL}/fa/services/${slug}`,
          'x-default': `${BASE_URL}${service.englishPath}`,
        },
      },
    })),
    {
      url: `${BASE_URL}/fa/guides`,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { fa: `${BASE_URL}/fa/guides` } },
    },
    ...Object.keys(PERSIAN_GUIDES).map((slug) => ({
      url: `${BASE_URL}/fa/guides/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
      alternates: {
        languages: { fa: `${BASE_URL}/fa/guides/${slug}` },
      },
    })),
  ];

  return [...englishPages, ...persianPages];
}
