import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';

const path = '/fa/sao-tome-citizenship-by-investment';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'تابعیت سائوتومه و پرنسیپ از طریق سرمایه‌گذاری | PLUCO GROUP',
    description: 'خدمات مشاوره حقوقی PLUCO GROUP برای بررسی شرایط، آماده‌سازی انطباقی و هماهنگی درخواست تابعیت سائوتومه و پرنسیپ از طریق سرمایه‌گذاری.',
    path,
    locale: 'fa_IR',
    alternateLocales: ['en_US'],
    keywords: ['تابعیت سائوتومه و پرنسیپ', 'تابعیت از طریق سرمایه‌گذاری', 'پاسپورت سائوتومه', 'مشاوره تابعیت دوم', 'مشاوره حقوقی سرمایه‌گذاری'],
  }),
  alternates: {
    canonical: 'https://www.plucogroup.com' + path,
    languages: {
    'x-default': 'https://www.plucogroup.com/sao-tome-citizenship-by-investment',
      en: 'https://www.plucogroup.com/sao-tome-citizenship-by-investment',
      fa: 'https://www.plucogroup.com' + path,
    },
  },
};

export default function FarsiSaoTomeCitizenshipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
