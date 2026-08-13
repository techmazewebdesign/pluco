import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_URL,
} from '@/lib/siteMetadata';

const PAGE_URL = `${SITE_URL}/editorial-standards`;

export const metadata: Metadata = {
  title: 'Editorial Standards and Review Process',
  description:
    'How PLUCO GROUP prepares, sources, reviews, updates, and corrects its public legal, immigration, banking, company, and property guides.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      fa: `${SITE_URL}/fa/editorial-standards`,
      'x-default': PAGE_URL,
    },
  },
  openGraph: {
    title: 'PLUCO GROUP Editorial Standards and Review Process',
    description:
      'Our sourcing, review, update, correction, and independence standards for public guides.',
    url: PAGE_URL,
    siteName: 'PLUCO GROUP',
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
    type: 'website',
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLUCO GROUP Editorial Standards and Review Process',
    description:
      'Our sourcing, review, update, correction, and independence standards for public guides.',
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
};

const standards = [
  {
    title: 'Who prepares the guides',
    body:
      'Public guides identify Reza Ostad as the principal author and PLUCO GROUP as the organisational reviewer unless a page states otherwise. A byline describes authorship, not approval by an unnamed lawyer, regulator, bank, or public authority. Any additional specialist who materially reviews a publication must be named only when that contribution is documented.',
  },
  {
    title: 'How sources are selected',
    body:
      'We prioritise legislation, government portals, regulators, courts, and official institutional guidance. Commercial articles may help identify a question, but they do not replace the competent authority for current eligibility, procedure, fees, or documentary requirements.',
  },
  {
    title: 'How high-stakes claims are handled',
    body:
      'Immigration, banking, tax, corporate, property, sanctions, and dispute questions depend on facts and jurisdiction. Our guides separate general information from case-specific advice, identify material uncertainties, and avoid guarantees about approval, timing, account access, transactions, residence, or legal outcomes.',
  },
  {
    title: 'Review dates and updates',
    body:
      'Each guide displays a reviewed or updated date. That date is changed only when the page has been substantively checked or revised. Readers should still confirm time-sensitive requirements with the competent authority immediately before filing, signing, paying, or transferring funds.',
  },
  {
    title: 'Corrections and transparency',
    body:
      'If a factual error, broken official source, or material change is identified, we review the affected passage and correct it where appropriate. Questions and correction notices can be sent to info@plucogroup.com with the page URL and supporting source.',
  },
  {
    title: 'Commercial independence',
    body:
      'Public guides may link to a relevant PLUCO GROUP service. The presence of that link does not change the sourcing standard, create an engagement, or guarantee that a matter will be accepted. Any professional scope and fee must be agreed separately in writing.',
  },
] as const;

export default function EditorialStandardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'PLUCO GROUP Editorial Standards and Review Process',
        description: metadata.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Editorial standards', item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            <Link href="/">Home</Link><span className="px-2">/</span>
            <span>Editorial standards</span>
          </nav>
          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-[#E3C783]">
            Trust and accountability
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            Editorial standards and review process
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            How PLUCO GROUP prepares public information for decisions that may affect legal
            status, finances, businesses, property, and families.
          </p>
          <Link
            href="/fa/editorial-standards"
            className="mt-7 inline-block rounded-full border border-white/40 px-6 py-3 font-bold"
          >
            نسخه فارسی
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-8 text-slate-700">
          These standards describe the public-information process. They do not turn a guide into
          legal advice or create a client relationship.
        </div>
        <div className="mt-10 grid gap-6">
          {standards.map((standard) => (
            <section key={standard.title} className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{standard.title}</h2>
              <p className="mt-4 leading-8 text-slate-700">{standard.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/guides" className="rounded-full bg-[#071C3C] px-6 py-3 font-bold text-white">
            Browse all guides
          </Link>
          <a
            href="mailto:info@plucogroup.com?subject=Correction%20notice%20for%20PLUCO%20GROUP"
            className="rounded-full border border-[#071C3C] px-6 py-3 font-bold text-[#071C3C]"
          >
            Report a correction
          </a>
        </div>
      </article>
    </main>
  );
}
