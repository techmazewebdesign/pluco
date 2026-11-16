import type { Metadata } from 'next';
import SaoTomeEditorialPage from '@/components/content/SaoTomeEditorialPage';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export const metadata: Metadata = { title: 'هزینه و مراحل تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['costs-and-process'].description, alternates: { canonical: 'https://www.plucogroup.com/fa/publications/sao-tome-citizenship-by-investment-costs-process' }, openGraph: { title: 'هزینه و مراحل تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['costs-and-process'].description, locale: 'fa_IR', type: 'article' } };
export default function Page() { return <SaoTomeEditorialPage article={saoTomeEditorial['costs-and-process']} />; }
