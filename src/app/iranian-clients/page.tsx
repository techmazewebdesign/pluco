import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/siteMetadata';

const path = '/iranian-clients';
const url = `${SITE_URL}${path}`;
const faUrl = `${SITE_URL}/fa/iranians-abroad`;

export const metadata: Metadata = {
  title: 'European Legal and Mobility Services for Iranian Clients',
  description:
    'A clear directory for Iranian families, professionals and entrepreneurs seeking European residency, company formation, banking compliance and cross-border legal support.',
  alternates: { canonical: url, languages: { en: url, fa: faUrl, 'x-default': url } },
  openGraph: {
    title: 'European Legal and Mobility Services for Iranian Clients',
    description: 'Find the relevant PLUCO GROUP service by your actual cross-border need.',
    url,
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
    type: 'website',
  },
};

const needs = [
  {
    title: 'European residency planning',
    summary: 'Compare residence routes against your work, family, income, documentation and long-term obligations.',
    href: '/eu-residency',
    guide: '/guides/choose-eu-residency-route',
  },
  {
    title: 'Spain digital-nomad residency',
    summary: 'Assess remote-work eligibility and organise employment, client, income, insurance and family evidence.',
    href: '/spain-digital-nomad-visa',
    guide: '/guides/spain-digital-nomad-document-checklist',
  },
  {
    title: 'EU company formation',
    summary: 'Separate company ownership from personal immigration status and prepare the corporate and banking file.',
    href: '/eu-company-registration',
    guide: '/guides/eu-company-versus-residency',
  },
  {
    title: 'Banking and source-of-funds support',
    summary: 'Respond to compliance questions with a documented account of ownership, origin, route and purpose of funds.',
    href: '/banking',
    guide: '/guides/bank-account-closure-iranian-nationals-europe',
  },
  {
    title: 'International contracts and disputes',
    summary: 'Coordinate cross-border contract review, negotiation strategy and specialist counsel where required.',
    href: '/international-contracts',
    guide: '/dispute-resolution',
  },
  {
    title: 'European property planning',
    summary: 'Coordinate property due diligence, fund-transfer evidence and any separate residence considerations.',
    href: '/eu-property-purchase',
    guide: '/guides/eu-property-due-diligence',
  },
] as const;

export default function IranianClientsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: 'European legal and mobility services for Iranian clients',
        description: metadata.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        itemListElement: needs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `${SITE_URL}${item.href}`,
        })),
      },
    ],
  };

  return (
    <main className="bg-[#F7F5EF] text-[#172033]" dir="ltr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E3C783]">For Iranians worldwide</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Find the right European legal and mobility service for your situation
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            A practical starting point for Iranian families, remote professionals and entrepreneurs navigating residency, banking, business and cross-border legal questions.
          </p>
          <Link href="/fa/iranians-abroad" className="mt-8 inline-block rounded-full border border-[#E3C783] px-6 py-3 font-bold text-[#E3C783]">
            مطالعه به فارسی
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-8 text-slate-700">
          <strong>Start with the problem, not a promised outcome.</strong> Nationality, residence, income, family, source of funds and the law of the relevant country can change the available route. Information here is general and every formal step requires a current individual review.
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {needs.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{item.title}</h2>
              <p className="mt-4 leading-7 text-slate-700">{item.summary}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
                <Link href={item.href} className="text-[#71551d] underline underline-offset-4">View service</Link>
                <Link href={item.guide} className="text-[#071C3C] underline underline-offset-4">Read the guide</Link>
              </div>
            </article>
          ))}
        </div>
        <section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white sm:p-10">
          <h2 className="text-3xl font-black">Need help identifying the correct starting point?</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-200">Submit a short factual account of the country, your current status and the result you are trying to achieve. Do not send passwords, access codes or complete identity and banking documents in an initial enquiry.</p>
          <Link href="/enquire" className="mt-7 inline-block rounded-full bg-[#E3C783] px-6 py-3 font-bold text-[#071C3C]">Start a private enquiry</Link>
        </section>
      </section>
    </main>
  );
}
