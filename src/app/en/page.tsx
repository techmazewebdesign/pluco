import type { Metadata } from 'next';
import AdvisoryHome from '@/components/home/AdvisoryHome';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: "European Residency & Private Client Advisory | PLUCO GROUP",
  description: "Pluco Group helps international families and entrepreneurs plan European residency, property purchases, banking documentation and company formation in English, Persian and Polish.",
  path: "/en",
});

export default function Home() {
  return <AdvisoryHome locale="en" />;
}
