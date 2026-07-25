import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrackedGuideLink from '@/components/seo/TrackedGuideLink';
import { ENGLISH_GUIDES, isEnglishGuideSlug } from '@/lib/plucoEnglishGuides';
import { SITE_URL } from '@/lib/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(ENGLISH_GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isEnglishGuideSlug(slug)) return {};

  const guide = ENGLISH_GUIDES[slug];
  const url = `${SITE_URL}/guides/${slug}`;
  const persianUrl = `${SITE_URL}${guide.persianPath}`;

  return {
    title: guide.title,
    description: guide.description,
    keywords: [guide.searchIntent, ...guide.keywords],
    alternates: {
      canonical: url,
      languages: {
        en: url,
        fa: persianUrl,
        'x-default': url,
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      locale: 'en_US',
      alternateLocale: ['fa_IR'],
      type: 'article',
    },
  };
}

export default async function EnglishGuidePage({ params }: Props) {
  const { slug } = await params;
  if (!isEnglishGuideSlug(slug)) notFound();

  const guide = ENGLISH_GUIDES[slug];
  const url = `${SITE_URL}/guides/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.title,
        description: guide.description,
        inLanguage: 'en',
        datePublished: guide.reviewedOn,
        dateModified: guide.reviewedOn,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'PLUCO GROUP' },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <article>
        <header className="bg-[#071C3C] text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
              <Link href="/">Home</Link><span className="px-2">/</span>
              <Link href="/guides">Guides</Link>
            </nav>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-[#E3C783]">
              <span>{guide.readTime}</span><span>·</span>
              <span>Prepared by PLUCO GROUP</span><span>·</span>
              <span>Updated {guide.reviewedOn}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{guide.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">{guide.description}</p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
          <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-5 text-sm leading-7 text-slate-700">
            This guide provides general information, not legal, immigration, tax, or financial
            advice for a specific case. Confirm current rules with the competent authority before
            filing, paying, signing, or transferring funds.
          </div>

          <div className="mt-10 grid gap-12">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl font-black leading-tight">{section.heading}</h2>
                <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {'bullets' in section && section.bullets ? (
                  <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-6">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-7">
                        <span className="font-black text-[#8B6A23]">✓</span><span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-14 rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-black">Official sources</h2>
            <ul className="mt-5 grid gap-3">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold leading-7 text-[#71551d] underline"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-3xl bg-[#071C3C] p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-[#E3C783]">Next step</p>
            <h2 className="mt-3 text-3xl font-black">Review the facts before committing</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-200">
              PLUCO GROUP can assess the objective, documents, jurisdictions, and material risks,
              then define an appropriate scope or coordinate jurisdiction-specific support.
              No authority, bank, visa, transaction, or case outcome is guaranteed.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <TrackedGuideLink
                href={guide.relatedServicePath}
                className="rounded-full bg-[#C9A35A] px-6 py-3 font-bold text-[#071C3C]"
                guideSlug={slug}
                locale="en"
                action="service_cta"
              >
                {guide.relatedServiceLabel}
              </TrackedGuideLink>
              <TrackedGuideLink
                href={guide.persianPath}
                className="rounded-full border border-white/40 px-6 py-3 font-bold text-white"
                guideSlug={slug}
                locale="en"
                action="language_switch"
              >
                نسخه فارسی
              </TrackedGuideLink>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
