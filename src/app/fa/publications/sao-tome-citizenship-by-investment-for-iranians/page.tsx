import type { Metadata } from 'next';
import SaoTomeEditorialPage from '@/components/content/SaoTomeEditorialPage';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export const metadata: Metadata = { title: 'راهنمای تابعیت سائوتومه و پرنسیپ برای ایرانیان | PLUCO GROUP', description: saoTomeEditorial['iranians-guide'].description, alternates: { canonical: 'https://www.plucogroup.com/fa/publications/sao-tome-citizenship-by-investment-for-iranians' }, openGraph: { title: 'راهنمای تابعیت سائوتومه و پرنسیپ برای ایرانیان | PLUCO GROUP', description: saoTomeEditorial['iranians-guide'].description, locale: 'fa_IR', type: 'article' } };
export default function Page() { return <SaoTomeEditorialPage article={saoTomeEditorial['iranians-guide']} />; }
