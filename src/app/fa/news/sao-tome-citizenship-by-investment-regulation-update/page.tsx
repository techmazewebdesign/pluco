import type { Metadata } from 'next';
import SaoTomeEditorialPage from '@/components/content/SaoTomeEditorialPage';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export const metadata: Metadata = { title: 'به‌روزرسانی حقوقی تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['regulation-2025'].description, alternates: { canonical: 'https://www.plucogroup.com/fa/news/sao-tome-citizenship-by-investment-regulation-update' }, openGraph: { title: 'به‌روزرسانی حقوقی تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['regulation-2025'].description, locale: 'fa_IR', type: 'article' } };
export default function Page() { return <SaoTomeEditorialPage article={saoTomeEditorial['regulation-2025']} />; }
