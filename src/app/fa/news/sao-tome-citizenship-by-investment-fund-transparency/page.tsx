import type { Metadata } from 'next';
import SaoTomeEditorialPage from '@/components/content/SaoTomeEditorialPage';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export const metadata: Metadata = { title: 'صندوق تحول ملی و شفافیت مالی تابعیت سائوتومه | PLUCO GROUP', description: saoTomeEditorial['fund-and-transparency'].description, alternates: { canonical: 'https://www.plucogroup.com/fa/news/sao-tome-citizenship-by-investment-fund-transparency' }, openGraph: { title: 'صندوق تحول ملی و شفافیت مالی تابعیت سائوتومه | PLUCO GROUP', description: saoTomeEditorial['fund-and-transparency'].description, locale: 'fa_IR', type: 'article' } };
export default function Page() { return <SaoTomeEditorialPage article={saoTomeEditorial['fund-and-transparency']} />; }
