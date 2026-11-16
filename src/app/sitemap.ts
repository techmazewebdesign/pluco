import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteMetadata';
import { languageAlternates } from '@/lib/languageRoutes';
import { getPageImages } from '@/lib/pageImages';
import { PERSIAN_SERVICES } from '@/lib/plucoPersianServices';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages: { url: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { url: '/',                        priority: 1.0,  changeFrequency: 'weekly'  },
    { url: '/fa', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/iranian-clients', priority: 0.85, changeFrequency: 'monthly' },
    { url: '/fa/iranians-abroad', priority: 0.85, changeFrequency: 'monthly' },
    { url: '/new-identity',            priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/sao-tome-citizenship-by-investment', priority: 0.95, changeFrequency: 'monthly' },
    { url: '/fa/sao-tome-citizenship-by-investment', priority: 0.95, changeFrequency: 'monthly' },
    { url: '/fa/publications/sao-tome-citizenship-by-investment-for-iranians', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/fa/publications/sao-tome-citizenship-by-investment-costs-process', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/fa/publications/sao-tome-citizenship-by-investment-documents-compliance', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/fa/news/sao-tome-citizenship-by-investment-regulation-update', priority: 0.75, changeFrequency: 'monthly' },
    { url: '/fa/news/sao-tome-citizenship-by-investment-fund-transparency', priority: 0.75, changeFrequency: 'monthly' },
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
  ];

  publicPages.push(...Object.keys(PERSIAN_SERVICES).map(slug => ({
    url: `/fa/services/${slug}`, priority: 0.9, changeFrequency: 'monthly' as const,
  })));
  return publicPages.map(({ url, priority, changeFrequency }) => {
    const languages = languageAlternates(url, BASE_URL);
    const pageImages = getPageImages(url);
    return { url: `${BASE_URL}${url}`, priority, changeFrequency,
      ...(languages ? { alternates: { languages } } : {}),
      ...(pageImages ? { images: pageImages.images.map(({ src }) => new URL(src, BASE_URL).href) } : {}),
    };
  });
}
