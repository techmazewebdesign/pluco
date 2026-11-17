import type { Metadata } from 'next';
import AdvisoryHome from '@/components/home/AdvisoryHome';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: 'مشاوره اقامت اروپا و امور فرامرزی | پلوکو گروپ',
  description: 'پلوکو گروپ به خانواده‌ها و کارآفرینان در برنامه‌ریزی اقامت اروپا، خرید ملک، آماده‌سازی مدارک بانکی و ثبت شرکت به زبان‌های فارسی، انگلیسی و لهستانی کمک می‌کند.',
  path: '/fa',
});

export default function PersianHomePage() {
  return <AdvisoryHome locale="fa" />;
}
