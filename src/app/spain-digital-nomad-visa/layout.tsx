import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';
import { ENGLISH_SERVICE_CONTENT } from '@/lib/englishServiceContent';
import ServiceOverview from '@/components/seo/ServiceOverview';
const path = '/spain-digital-nomad-visa';
const service = ENGLISH_SERVICE_CONTENT[path];
export const metadata: Metadata = createPageMetadata({ title: service.title + ' | PLUCO GROUP', description: service.description, path, image: '/images/spain-digital-nomad-social-preview.png', imageAlt: 'Spain digital nomad visa preparation by PLUCO GROUP' });
export default function ServiceLayout({children}: {children: React.ReactNode}) {
  return <>{children}<ServiceOverview path={path} /></>;
}
