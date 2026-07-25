import type { Metadata } from 'next';
import Link from 'next/link';
import { ENGLISH_GUIDES } from '@/lib/plucoEnglishGuides';
import { SITE_URL } from '@/lib/siteMetadata';

export const metadata: Metadata = {
  title: 'Cross-Border Banking, Residency, Company, and Property Guides',
  description:
    'Source-led PLUCO GROUP guides for international banking, European residence, company formation, and property decisions.',
  alternates: {
    canonical: `${SITE_URL}/guides`,
    languages: {
      en: `${SITE_URL}/guides`,
      fa: `${SITE_URL}/fa/guides`,
      'x-default': `${SITE_URL}/guides`,
    },
  },
};

const accountClosureGuide = {
  slug: 'bank-account-closure-iranian-nationals-europe',
  title: 'European Bank Account Closure for Iranian Nationals',
  description:
    'Immediate actions, source-of-funds evidence, and complaint routes after a restriction or closure notice.',
  readTime: '12 minute read',
  reviewedOn: '2026-07-25',
};

export default function EnglishGuidesPage() {
  const guides = [
    accountClosureGuide,
    ...Object.entries(ENGLISH_GUIDES).map(([slug, guide]) => ({ slug, ...guide })),
  ];

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#E3C783]">Knowledge centre</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
            Practical guides for cross-border decisions
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            Source-led information for understanding the documents, risks, and questions to address
            before an international banking, residence, company, or property commitment.
          </p>
          <Link href="/fa/guides" className="mt-7 inline-block rounded-full border border-white/40 px-6 py-3 font-bold text-white">
            راهنماهای فارسی
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C9A35A] hover:shadow-lg"
            >
              <div className="flex flex-wrap gap-3 text-xs font-bold text-[#8B6A23]">
                <span>{guide.readTime}</span><span>·</span><span>Updated {guide.reviewedOn}</span>
              </div>
              <h2 className="mt-4 text-2xl font-black leading-tight">{guide.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{guide.description}</p>
              <span className="mt-6 inline-block text-sm font-bold text-[#71551d]">Read guide →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
