import { MetadataRoute } from 'next';
import {
  ENGLISH_TO_PERSIAN_PATH,
  PERSIAN_SERVICES,
} from '@/lib/plucoPersianServices';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import { ENGLISH_GUIDES } from '@/lib/plucoEnglishGuides';
import { PLUCO_INSIGHT_LIST } from '@/lib/plucoInsights';

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
    { url: '/guides',                  priority: 0.8,  changeFrequency: 'weekly'  },
    { url: '/insights',                priority: 0.85, changeFrequency: 'weekly'  },
    { url: '/editorial-standards',     priority: 0.4,  changeFrequency: 'yearly'  },
    { url: '/resources/source-of-funds-checklist', priority: 0.85, changeFrequency: 'monthly' },
    { url: '/guides/bank-account-closure-iranian-nationals-europe', priority: 0.85, changeFrequency: 'monthly' },
  ] as const;

  const englishPages: MetadataRoute.Sitemap = publicPages.map(
    ({ url, priority, changeFrequency }) => {
      const persianPath =
        url === '/'
          ? '/fa'
          : url === '/guides'
            ? '/fa/guides'
            : url === '/insights'
              ? '/fa/insights'
            : url === '/editorial-standards'
              ? '/fa/editorial-standards'
            : url === '/resources/source-of-funds-checklist'
              ? '/fa/resources/source-of-funds-checklist'
            : url === '/guides/bank-account-closure-iranian-nationals-europe'
              ? '/fa/guides/bank-account-closure-iranians-europe'
              : ENGLISH_TO_PERSIAN_PATH[url];
      const canonicalUrl = url === '/' ? BASE_URL : `${BASE_URL}${url}`;

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

  const englishGuidePages: MetadataRoute.Sitemap = Object.entries(ENGLISH_GUIDES).map(
    ([slug, guide]) => {
      const englishUrl = `${BASE_URL}/guides/${slug}`;
      const persianUrl = `${BASE_URL}${guide.persianPath}`;

      return {
        url: englishUrl,
        lastModified: guide.reviewedOn,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            en: englishUrl,
            fa: persianUrl,
            'x-default': englishUrl,
          },
        },
      };
    },
  );

  const insightPages: MetadataRoute.Sitemap = PLUCO_INSIGHT_LIST.flatMap((article) => {
    const englishUrl = `${BASE_URL}/insights/${article.slug}`;
    const persianUrl = `${BASE_URL}/fa/insights/${article.slug}`;
    const alternates = {
      languages: { en: englishUrl, fa: persianUrl, 'x-default': englishUrl },
    };

    return [
      {
        url: englishUrl,
        lastModified: article.reviewedOn,
        changeFrequency: 'monthly' as const,
        priority: 0.82,
        alternates,
      },
      {
        url: persianUrl,
        lastModified: article.reviewedOn,
        changeFrequency: 'monthly' as const,
        priority: 0.82,
        alternates,
      },
    ];
  });

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
      alternates: {
        languages: {
          en: `${BASE_URL}/guides`,
          fa: `${BASE_URL}/fa/guides`,
          'x-default': `${BASE_URL}/guides`,
        },
      },
    },
    {
      url: `${BASE_URL}/fa/insights`,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          en: `${BASE_URL}/insights`,
          fa: `${BASE_URL}/fa/insights`,
          'x-default': `${BASE_URL}/insights`,
        },
      },
    },
    {
      url: `${BASE_URL}/fa/editorial-standards`,
      changeFrequency: 'yearly',
      priority: 0.4,
      alternates: {
        languages: {
          en: `${BASE_URL}/editorial-standards`,
          fa: `${BASE_URL}/fa/editorial-standards`,
          'x-default': `${BASE_URL}/editorial-standards`,
        },
      },
    },
    {
      url: `${BASE_URL}/fa/resources/source-of-funds-checklist`,
      lastModified: '2026-07-26',
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: {
        languages: {
          en: `${BASE_URL}/resources/source-of-funds-checklist`,
          fa: `${BASE_URL}/fa/resources/source-of-funds-checklist`,
          'x-default': `${BASE_URL}/resources/source-of-funds-checklist`,
        },
      },
    },
    ...Object.entries(PERSIAN_GUIDES).map(([slug, guide]) => {
      const persianUrl = `${BASE_URL}/fa/guides/${slug}`;
      const englishUrl = 'englishPath' in guide && guide.englishPath
        ? `${BASE_URL}${guide.englishPath}`
        : undefined;

      return {
        url: persianUrl,
        lastModified: guide.reviewedOn,
        changeFrequency: 'monthly' as const,
        priority: slug === 'bank-account-closure-iranians-europe' ? 0.85 : 0.75,
        alternates: {
          languages: {
            fa: persianUrl,
            ...(englishUrl ? { en: englishUrl, 'x-default': englishUrl } : {}),
          },
        },
      };
    }),
  ];

  return [...englishPages, ...englishGuidePages, ...insightPages, ...persianPages];
}
