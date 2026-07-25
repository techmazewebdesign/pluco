import type { Metadata } from 'next';
import SourceOfFundsChecklist from '@/components/seo/SourceOfFundsChecklist';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '@/lib/siteMetadata';

const path = '/fa/resources/source-of-funds-checklist';
const url = `${SITE_URL}${path}`;
const englishUrl = `${SITE_URL}/resources/source-of-funds-checklist`;
const title = 'چک‌لیست مدارک منبع وجوه برای بانک‌های اروپایی';
const description =
  'چک‌لیست رایگان و قابل چاپ برای نظم‌دادن به مدارک منبع وجوه، مسیر تراکنش، مالکیت واقعی و بسته امن ارسال به بانک اروپایی.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'چک لیست مدارک منبع وجوه',
    'اثبات منبع پول برای بانک اروپا',
    'مدارک منبع ثروت',
    'مدارک انطباق بانکی ایرانیان',
  ],
  alternates: {
    canonical: url,
    languages: { en: englishUrl, fa: url, 'x-default': englishUrl },
  },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
};

export default function PersianSourceOfFundsChecklistPage() {
  return <SourceOfFundsChecklist locale="fa" />;
}
