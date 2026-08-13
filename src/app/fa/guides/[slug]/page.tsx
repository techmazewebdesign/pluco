import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TrackedGuideLink from '@/components/seo/TrackedGuideLink';
import { isPersianGuideSlug, PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  SITE_URL,
} from '@/lib/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(PERSIAN_GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPersianGuideSlug(slug)) return {};
  const guide = PERSIAN_GUIDES[slug];
  const url = `${SITE_URL}/fa/guides/${slug}`;
  const englishUrl = 'englishPath' in guide && guide.englishPath
    ? `${SITE_URL}${guide.englishPath}`
    : undefined;
  return {
    title: guide.title,
    description: guide.description,
    keywords: [guide.searchIntent, ...('keywords' in guide && guide.keywords ? guide.keywords : [])],
    alternates: {
      canonical: url,
      languages: {
        fa: url,
        ...(englishUrl ? { en: englishUrl, 'x-default': englishUrl } : {}),
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      locale: 'fa_IR',
      alternateLocale: ['en_US'],
      type: 'article',
      images: [{
        url: `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`,
        width: 1200,
        height: 630,
        alt: DEFAULT_SOCIAL_IMAGE_ALT,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
    },
  };
}

export default async function PersianGuidePage({ params }: Props) {
  const { slug } = await params;
  if (!isPersianGuideSlug(slug)) notFound();
  const guide = PERSIAN_GUIDES[slug];
  const url = `${SITE_URL}/fa/guides/${slug}`;
  const shortAnswer = guide.sections[0].paragraphs[0];
  const relatedGuides = Object.entries(PERSIAN_GUIDES)
    .filter(([candidateSlug]) => candidateSlug !== slug)
    .sort(([, candidateA], [, candidateB]) => {
      const aMatchesService = candidateA.relatedServiceSlug === guide.relatedServiceSlug ? 1 : 0;
      const bMatchesService = candidateB.relatedServiceSlug === guide.relatedServiceSlug ? 1 : 0;
      return bMatchesService - aMatchesService;
    })
    .slice(0, 3);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.title,
        description: guide.description,
        abstract: shortAnswer,
        keywords: [guide.searchIntent, ...('keywords' in guide && guide.keywords ? guide.keywords : [])],
        inLanguage: 'fa',
        datePublished: guide.reviewedOn,
        dateModified: guide.reviewedOn,
        mainEntityOfPage: url,
        author: {
          '@type': 'Person',
          '@id': `${SITE_URL}/our-people/reza-ostad#person`,
          name: 'Reza Ostad',
          url: `${SITE_URL}/our-people/reza-ostad`,
        },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        citation: guide.sources.map((source) => source.url),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: `${SITE_URL}/fa` },
          { '@type': 'ListItem', position: 2, name: 'راهنماها', item: `${SITE_URL}/fa/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return (
    <main lang="fa" dir="rtl" className="bg-[#F7F5EF] text-[#172033]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <article>
        <header className="bg-[#071C3C] text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
            <nav aria-label="مسیر صفحه" className="text-sm text-slate-300">
              <Link href="/fa">صفحه فارسی</Link><span className="px-2">/</span>
              <Link href="/fa/guides">راهنماها</Link>
            </nav>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-[#E3C783]">
              <span>{guide.readTime}</span>
              <span>·</span>
              <span>
                تهیه‌کننده:{' '}
                <Link href="/our-people/reza-ostad" className="underline underline-offset-4">
                  رضا استاد
                </Link>
              </span>
              <span>·</span>
              <span>آخرین به‌روزرسانی: {guide.reviewedOn}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.55] sm:text-5xl">{guide.title}</h1>
            <p className="mt-6 text-lg leading-9 text-slate-200">{guide.description}</p>
          </div>
        </header>
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
          <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-5 text-sm leading-8 text-slate-700">
            این مطلب اطلاعات عمومی است و جایگزین بررسی حقوقی یا مهاجرتی متناسب با پرونده شما نیست. مقررات و رویه‌ها را هنگام اقدام از مرجع رسمی کنترل کنید.
          </div>

          <section
            aria-labelledby="short-answer"
            className="mt-8 rounded-3xl border border-[#C9A35A] bg-white p-7 shadow-sm"
          >
            <p className="text-sm font-bold text-[#8B6A23]">پاسخ کوتاه</p>
            <h2 id="short-answer" className="mt-3 text-2xl font-black leading-10">
              نکته اصلی پیش از اقدام
            </h2>
            <p className="mt-4 text-lg leading-9 text-slate-700">{shortAnswer}</p>
            <a
              href="#official-sources"
              className="mt-5 inline-block text-sm font-bold text-[#71551d] underline underline-offset-4"
            >
              مشاهده {guide.sources.length} منبع رسمی استفاده‌شده در این راهنما
            </a>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-8 text-slate-700">
            <p className="font-black text-[#172033]">نویسنده و فرایند بازبینی</p>
            <p className="mt-2">
              این راهنما توسط <Link href="/our-people/reza-ostad" className="font-bold underline">رضا استاد</Link> برای PLUCO GROUP تهیه و مطابق <Link href="/fa/editorial-standards" className="font-bold underline">استانداردهای تحریریه</Link> بازبینی شده است. منابع و ادعاهای اصلی در تاریخ {guide.reviewedOn} کنترل شده‌اند. این بازبینی سازمانی به معنی تأیید مطلب توسط مرجع دولتی یا وکیل محلی نام‌برده‌نشده نیست.
            </p>
          </section>

          <div className="mt-10 grid gap-12">
            {guide.sections.map((section, sectionIndex) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-black leading-10">{section.heading}</h2>
                <div className="mt-4 grid gap-4 text-base leading-9 text-slate-700">
                  {section.paragraphs
                    .filter((_, paragraphIndex) => sectionIndex !== 0 || paragraphIndex !== 0)
                    .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {'bullets' in section && section.bullets ? (
                  <ul className="mt-5 grid gap-3 rounded-2xl bg-white p-6">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-8">
                        <span className="font-black text-[#8B6A23]">✓</span><span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          {slug === 'source-of-funds-file' ? (
            <section className="mt-12 rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-7">
              <p className="text-sm font-bold text-[#8B6A23]">ابزار رایگان</p>
              <h2 className="mt-3 text-2xl font-black leading-10">
                چک‌لیست قابل چاپ مدارک منبع وجوه را استفاده کنید
              </h2>
              <p className="mt-4 leading-9 text-slate-700">
                درخواست بانک، رویداد مولد پول، زنجیره انتقال، کنترل سازگاری و بسته امن ارسال را در یک سند منظم کنید.
              </p>
              <TrackedGuideLink
                href="/fa/resources/source-of-funds-checklist"
                className="mt-6 inline-block rounded-full bg-[#071C3C] px-6 py-3 font-bold text-white"
                guideSlug={slug}
                locale="fa"
                action="resource_cta"
              >
                باز کردن چک‌لیست رایگان
              </TrackedGuideLink>
            </section>
          ) : null}
          <section id="official-sources" className="mt-14 scroll-mt-24 rounded-2xl bg-white p-7">
            <h2 className="text-xl font-black">منابع رسمی برای کنترل اطلاعات روز</h2>
            <ul className="mt-5 grid gap-3">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold leading-8 text-[#71551d] underline">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <nav aria-label="راهنماهای مرتبط" className="mt-10">
            <h2 className="text-2xl font-black">راهنماهای عملی مرتبط</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedGuides.map(([relatedSlug, relatedGuide]) => (
                <TrackedGuideLink
                  key={relatedSlug}
                  href={`/fa/guides/${relatedSlug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#C9A35A] hover:shadow-md"
                  guideSlug={slug}
                  locale="fa"
                  action="related_guide"
                >
                  <span className="text-xs font-bold text-[#8B6A23]">{relatedGuide.readTime}</span>
                  <span className="mt-2 block font-black leading-8">{relatedGuide.title}</span>
                </TrackedGuideLink>
              ))}
            </div>
          </nav>
          <section className="mt-10 rounded-3xl bg-[#071C3C] p-8 text-white">
            <p className="text-sm font-bold text-[#E3C783]">مرحله بعد</p>
            <h2 className="mt-3 text-2xl font-black leading-10">این موضوع را با شرایط واقعی خود بررسی کنید</h2>
            <p className="mt-3 leading-8 text-slate-200">پیش از پرداخت، ترجمه گسترده مدارک یا تعهد مالی، تناسب مسیر و ریسک‌های اصلی را روشن کنید.</p>
            <TrackedGuideLink
              href={`/fa/services/${guide.relatedServiceSlug}#service-enquiry`}
              className="mt-6 inline-block rounded-full bg-[#C9A35A] px-6 py-3 font-bold text-[#071C3C]"
              guideSlug={slug}
              locale="fa"
              action="service_cta"
            >
              {guide.relatedServiceLabel}
            </TrackedGuideLink>
            {'englishPath' in guide && guide.englishPath ? (
              <TrackedGuideLink
                href={guide.englishPath}
                className="mt-6 mr-3 inline-block rounded-full border border-white/40 px-6 py-3 font-bold text-white"
                guideSlug={slug}
                locale="fa"
                action="language_switch"
              >
                English version
              </TrackedGuideLink>
            ) : null}
          </section>
        </div>
      </article>
    </main>
  );
}
