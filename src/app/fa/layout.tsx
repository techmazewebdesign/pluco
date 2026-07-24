import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteMetadata';

export const metadata: Metadata = {
  title: {
    default: 'پلوکو گروپ | مشاوره حقوقی و مهاجرتی اروپا برای ایرانیان',
    template: '%s | PLUCO GROUP',
  },
  description:
    'مشاوره محرمانه اقامت اروپا، امور بانکی، ثبت شرکت، خرید ملک، تابعیت دوم و قراردادهای بین‌المللی برای ایرانیان خارج از کشور.',
  alternates: {
    canonical: `${SITE_URL}/fa`,
    languages: {
      en: SITE_URL,
      fa: `${SITE_URL}/fa`,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    siteName: 'PLUCO GROUP',
  },
};

export default function PersianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="fa" dir="rtl" className="font-sans">
      {children}
    </div>
  );
}
