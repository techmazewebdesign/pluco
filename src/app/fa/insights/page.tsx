import type { Metadata } from 'next';
import InsightHub from '@/components/insights/InsightHub';
import { SITE_URL } from '@/lib/siteMetadata';

const title = 'بینش‌های PLUCO درباره اسپانیا و اقامت اروپا';
const description = 'مقالات مستند PLUCO GROUP درباره اسپانیا، اقامت اروپا، دیجیتال نومد، ملک، بانک و برنامه‌ریزی زندگی بین‌المللی برای فارسی‌زبانان.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/fa/insights`,
    languages: { en: `${SITE_URL}/insights`, fa: `${SITE_URL}/fa/insights`, 'x-default': `${SITE_URL}/insights` },
  },
  openGraph: { title, description, url: `${SITE_URL}/fa/insights`, locale: 'fa_IR', type: 'website' },
};

export default function PersianInsightsPage() {
  return <InsightHub locale="fa" />;
}
