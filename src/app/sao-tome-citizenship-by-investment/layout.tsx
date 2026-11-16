import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: 'São Tomé and Príncipe Citizenship by Investment | PLUCO GROUP',
  description: 'PLUCO GROUP provides eligibility review, compliance preparation and coordinated application support for São Tomé and Príncipe citizenship by investment.',
  path: '/sao-tome-citizenship-by-investment',
  keywords: ['São Tomé and Príncipe citizenship by investment', 'Sao Tome citizenship by investment', 'São Tomé passport advisory', 'citizenship investment legal advisory', 'second citizenship compliance review'],
});

metadata.alternates = {
  canonical: 'https://www.plucogroup.com/sao-tome-citizenship-by-investment',
  languages: {
    'x-default': 'https://www.plucogroup.com/sao-tome-citizenship-by-investment',
    en: 'https://www.plucogroup.com/sao-tome-citizenship-by-investment',
    fa: 'https://www.plucogroup.com/fa/sao-tome-citizenship-by-investment',
  },
};

export default function SaoTomeCitizenshipLayout({ children }: { children: React.ReactNode }) { return children; }
