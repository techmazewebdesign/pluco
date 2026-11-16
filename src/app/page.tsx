import type { Metadata } from 'next';
import AdvisoryHome from '@/components/home/AdvisoryHome';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: "European Residency & Private Client Advisory | PLUCO GROUP",
  description: "PLUCO GROUP assists high-net-worth individuals, families, investors and entrepreneurs with European residency, second citizenship, property acquisition, banking support and cross-border legal protection.",
  path: "/",
});
metadata.alternates = { canonical: "https://www.plucogroup.com/", languages: { en: "https://www.plucogroup.com/", fa: "https://www.plucogroup.com/fa", "x-default": "https://www.plucogroup.com/" } };

export default function Home() {
  return <AdvisoryHome locale="en" />;
}
