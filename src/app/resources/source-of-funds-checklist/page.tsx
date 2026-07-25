import type { Metadata } from 'next';
import SourceOfFundsChecklist from '@/components/seo/SourceOfFundsChecklist';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '@/lib/siteMetadata';

const path = '/resources/source-of-funds-checklist';
const url = `${SITE_URL}${path}`;
const persianUrl = `${SITE_URL}/fa/resources/source-of-funds-checklist`;
const title = 'European Bank Source-of-Funds Evidence Checklist';
const description =
  'A free printable checklist for organising source-of-funds evidence, transaction trails, beneficial ownership, and a secure submission pack for a European bank.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'source of funds checklist',
    'European bank source of funds documents',
    'source of wealth evidence checklist',
    'bank compliance document checklist',
  ],
  alternates: {
    canonical: url,
    languages: { en: url, fa: persianUrl, 'x-default': url },
  },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
};

export default function SourceOfFundsChecklistPage() {
  return <SourceOfFundsChecklist locale="en" />;
}
