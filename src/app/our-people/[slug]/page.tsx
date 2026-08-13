import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlucoPerson, PLUCO_PEOPLE } from '@/lib/plucoPeople';
import { SITE_URL } from '@/lib/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PLUCO_PEOPLE.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = getPlucoPerson((await params).slug);
  if (!person) return {};
  const url = `${SITE_URL}/our-people/${person.slug}`;
  return {
    title: `${person.nameEn} | Professional Profile | PLUCO GROUP`,
    description: `${person.nameEn} is ${person.titleEn} at PLUCO GROUP. Review stated credentials, languages, professional focus and role.`,
    alternates: { canonical: url },
    openGraph: { title: `${person.nameEn} | PLUCO GROUP`, description: person.bioEn, url, type: 'profile', images: [{ url: `${SITE_URL}${person.photo}`, alt: person.nameEn }] },
  };
}

export default async function PersonPage({ params }: Props) {
  const person = getPlucoPerson((await params).slug);
  if (!person) notFound();
  const url = `${SITE_URL}/our-people/${person.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: `${person.nameEn} | PLUCO GROUP`, inLanguage: 'en',
        mainEntity: {
          '@type': 'Person', '@id': `${url}#person`, name: person.nameEn, alternateName: person.nameFa,
          image: `${SITE_URL}${person.photo}`, jobTitle: person.titleEn, description: person.bioEn,
          knowsLanguage: person.languagesEn, knowsAbout: person.areasEn,
          worksFor: { '@id': `${SITE_URL}/#organization` },
        },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Our People', item: `${SITE_URL}/our-people` },
        { '@type': 'ListItem', position: 3, name: person.nameEn, item: url },
      ] },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300"><Link href="/">Home</Link><span className="px-2">/</span><Link href="/our-people">Our People</Link></nav>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[220px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-[#C9A35A]"><Image src={person.photo} alt={`${person.nameEn}, ${person.titleEn}`} fill priority sizes="220px" className="object-cover object-top" /></div>
            <div><p className="text-sm font-bold uppercase tracking-widest text-[#E3C783]">Professional profile</p><h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">{person.nameEn}</h1><p className="mt-4 text-xl text-slate-200">{person.titleEn}</p><p className="mt-3 text-sm text-slate-300">{person.credentialsEn}</p></div>
          </div>
        </div>
      </header>
      <article className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <section className="rounded-2xl bg-white p-8 shadow-sm"><h2 className="text-2xl font-black">Professional focus</h2><p className="mt-5 leading-8 text-slate-700">{person.bioEn}</p></section>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-7"><h2 className="text-xl font-black">Areas of work</h2><ul className="mt-4 grid gap-2 text-slate-700">{person.areasEn.map((area) => <li key={area}>• {area}</li>)}</ul></section>
          <section className="rounded-2xl bg-white p-7"><h2 className="text-xl font-black">Languages</h2><p className="mt-4 text-slate-700">{person.languagesEn.join(', ')}</p><h2 className="mt-7 text-xl font-black">Role and scope</h2><p className="mt-4 leading-7 text-slate-700">Professional participation depends on matter acceptance, conflicts, jurisdiction and an agreed written scope. Where local representation or regulated advice is required, the responsible licensed professional is identified separately.</p></section>
        </div>
        <div className="mt-10 flex flex-wrap gap-4"><Link href="/contact" className="rounded-full bg-[#071C3C] px-6 py-3 font-bold text-white">Request a confidential review</Link><Link href="/our-people" className="rounded-full border border-[#071C3C] px-6 py-3 font-bold">View the full team</Link></div>
      </article>
    </main>
  );
}
