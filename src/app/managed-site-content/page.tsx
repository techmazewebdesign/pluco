import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Section = { id: string; heading?: string; body?: string; imagePaths?: string[]; imageAlt?: string };
type Page = { title?: string; managed?: boolean; sections?: Section[] };

async function managedPage(path: string): Promise<Page | null> {
  const response = await fetch(`https://desivo.de/api/public/website-content?domain=plucogroup.com&path=${encodeURIComponent(path)}`, { cache: 'no-store' });
  if (!response.ok) return null;
  const payload = await response.json() as { page?: Page };
  return payload.page?.managed === true ? payload.page : null;
}

export default async function DesivoManagedPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const path = (await searchParams).path || '/';
  const page = await managedPage(path);
  if (!page) notFound();
  return <article className="managed-page">
    <header className="managed-page__hero"><p>PLUCO GROUP</p><h1>{page.title || 'PLUCO Group'}</h1></header>
    <div className="managed-page__sections">
      {(page.sections || []).map((section) => <section key={section.id} className="managed-page__section">
        {section.heading && <h2>{section.heading}</h2>}
        {section.body && <div className="managed-page__copy">{section.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
        {!!section.imagePaths?.length && <div className="managed-page__gallery">{section.imagePaths.map((imagePath) => <img key={imagePath} src={`https://desivo.de/api/public/website-asset?path=${encodeURIComponent(imagePath)}`} alt={section.imageAlt || ''} />)}</div>}
      </section>)}
      {!page.sections?.length && <section className="managed-page__empty" aria-label="Empty managed page" />}
    </div>
  </article>;
}
