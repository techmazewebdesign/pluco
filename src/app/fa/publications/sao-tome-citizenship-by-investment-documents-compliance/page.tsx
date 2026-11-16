import type { Metadata } from 'next';
import SaoTomeEditorialPage from '@/components/content/SaoTomeEditorialPage';
import { saoTomeEditorial } from '@/lib/saoTomeEditorial';

export const metadata: Metadata = { title: 'مدارک و بررسی انطباق تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['documents-and-compliance'].description, alternates: { canonical: 'https://www.plucogroup.com/fa/publications/sao-tome-citizenship-by-investment-documents-compliance' }, openGraph: { title: 'مدارک و بررسی انطباق تابعیت سائوتومه و پرنسیپ | PLUCO GROUP', description: saoTomeEditorial['documents-and-compliance'].description, locale: 'fa_IR', type: 'article' } };
export default function Page() { return <SaoTomeEditorialPage article={saoTomeEditorial['documents-and-compliance']} />; }
