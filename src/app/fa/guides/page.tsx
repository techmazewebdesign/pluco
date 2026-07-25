import type { Metadata } from 'next';
import Link from 'next/link';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from '@/lib/siteMetadata';

const PAGE_URL = `${SITE_URL}/fa/guides`;
const PAGE_DESCRIPTION =
  'راهنماهای فارسی و منبع‌محور PLUCO GROUP برای تصمیم‌های اقامتی، بانکی، شرکتی و حقوقی بین‌المللی.';

export const metadata: Metadata = {
  title: 'راهنماهای فارسی اقامت، بانک و کسب‌وکار در اروپا',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${SITE_URL}/guides`,
      fa: PAGE_URL,
      'x-default': `${SITE_URL}/guides`,
    },
  },
  openGraph: {
    title: 'راهنماهای فارسی اقامت، بانک و کسب‌وکار در اروپا',
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: 'PLUCO GROUP',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'راهنماهای فارسی اقامت، بانک و کسب‌وکار در اروپا',
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
};

export default function PersianGuidesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#collection`,
        url: PAGE_URL,
        name: 'راهنماهای فارسی PLUCO GROUP',
        description: PAGE_DESCRIPTION,
        inLanguage: 'fa',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        hasPart: Object.entries(PERSIAN_GUIDES).map(([slug, guide]) => ({
          '@type': 'Article',
          '@id': `${SITE_URL}/fa/guides/${slug}#article`,
          url: `${SITE_URL}/fa/guides/${slug}`,
          headline: guide.title,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: `${SITE_URL}/fa` },
          { '@type': 'ListItem', position: 2, name: 'راهنماها', item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <main lang="fa" dir="rtl" className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-sm font-bold text-[#E3C783]">مرکز دانش فارسی</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.5] sm:text-5xl">
            راهنماهای عملی برای تصمیم‌های بین‌المللی
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">
            مطالب عمومی و منبع‌محور برای شناخت بهتر مدارک، ریسک‌ها و پرسش‌هایی که باید پیش از اقدام مطرح کنید.
          </p>
          <Link href="/fa/editorial-standards" className="mt-7 inline-block rounded-full border border-white/40 px-6 py-3 font-bold text-white">
            روش بازبینی محتوا
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(PERSIAN_GUIDES).map(([slug, guide]) => (
            <Link key={slug} href={`/fa/guides/${slug}`} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#C9A35A] hover:shadow-lg">
              <div className="flex flex-wrap gap-3 text-xs font-bold text-[#8B6A23]">
                <span>{guide.readTime}</span><span>·</span><span>بازبینی {guide.reviewedOn}</span>
              </div>
              <h2 className="mt-4 text-2xl font-black leading-10">{guide.title}</h2>
              <p className="mt-3 leading-8 text-slate-600">{guide.description}</p>
              <span className="mt-6 inline-block text-sm font-bold text-[#71551d]">مطالعه راهنما ←</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
