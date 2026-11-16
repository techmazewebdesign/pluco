import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';
import { ENGLISH_SERVICE_CONTENT } from '@/lib/englishServiceContent';
import ServiceOverview from '@/components/seo/ServiceOverview';
import PageImageStructuredData from '@/components/seo/PageImageStructuredData';
const path = '/spain-digital-nomad-visa';
const service = ENGLISH_SERVICE_CONTENT[path];
export const metadata: Metadata = createPageMetadata({ title: service.title + ' | PLUCO GROUP', description: service.description, path });
export default function ServiceLayout({children}: {children: React.ReactNode}) {
  return <><PageImageStructuredData path={path} />{children}<ServiceOverview path={path} /></>;
}
