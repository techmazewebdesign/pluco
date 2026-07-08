import { MetadataRoute } from 'next';

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
    { url: '/dispute-resolution',      priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/international-contracts', priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/publications',            priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/business-solutions',      priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/eu-company-registration', priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/about-us',                priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/contact',                 priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/client-sign-in',          priority: 0.5,  changeFrequency: 'yearly'  },
    { url: '/privacy-policy',          priority: 0.3,  changeFrequency: 'yearly'  },
    { url: '/disclaimer',              priority: 0.3,  changeFrequency: 'yearly'  },
  ] as const;

  return publicPages.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
