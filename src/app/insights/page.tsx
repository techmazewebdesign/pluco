import type { Metadata } from 'next';
import InsightHub from '@/components/insights/InsightHub';
import { SITE_URL } from '@/lib/siteMetadata';

const title = 'Spain, European Residence and Private Client Insights';
const description = 'Source-led PLUCO GROUP briefings on Spain, European residence, mobility, property, banking and international private-client life.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/insights`,
    languages: { en: `${SITE_URL}/insights`, fa: `${SITE_URL}/fa/insights`, 'x-default': `${SITE_URL}/insights` },
  },
  openGraph: { title, description, url: `${SITE_URL}/insights`, type: 'website' },
};

export default function InsightsPage() {
  return <InsightHub locale="en" />;
}

