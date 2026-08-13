import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3, ShieldCheck } from 'lucide-react';
import { PLUCO_INSIGHTS, type InsightLocale, type PlucoInsight } from '@/lib/plucoInsights';

const copy = {
  en: {
    hub: 'All insights',
    sources: 'Primary sources and further reading',
    sourceNote: 'Sources were checked on the review date shown above. Always confirm the current rule before acting.',
    reviewed: 'Reviewed',
    byline: 'By Reza Ostad · PLUCO GROUP editorial review',
    published: 'Published',
    related: 'Continue reading',
    disclaimerTitle: 'Important context',
    disclaimer:
      'This article provides general information and editorial analysis. It is not legal, tax, immigration or investment advice and does not guarantee an application outcome. Individual facts, nationality, residence history and current administrative practice must be reviewed separately.',
    ctaTitle: 'Plan the life, then select the legal tools',
    ctaBody: 'PLUCO GROUP brings residence, property, banking and cross-border decisions into one private-client plan built around the life you intend to lead.',
    paired: 'مطالعه نسخه فارسی',
  },
  fa: {
    hub: 'همه بینش‌ها',
    sources: 'منابع رسمی و مطالعه بیشتر',
    sourceNote: 'منابع در تاریخ بازبینی درج‌شده بررسی شده‌اند. پیش از اقدام، قاعده جاری را دوباره تأیید کنید.',
    reviewed: 'بازبینی',
    byline: 'نویسنده: رضا استاد · بازبینی تحریریه PLUCO GROUP',
    published: 'انتشار',
    related: 'مطالب مرتبط',
    disclaimerTitle: 'توضیح مهم',
    disclaimer:
      'این مقاله شامل اطلاعات عمومی و تحلیل تحریریه‌ای است و جایگزین مشاوره حقوقی، مالیاتی، مهاجرتی یا سرمایه‌گذاری نیست. نتیجه هیچ درخواستی تضمین نمی‌شود و شرایط شخصی، ملیت، سابقه اقامت و رویه جاری اداری باید جداگانه بررسی شوند.',
    ctaTitle: 'ابتدا زندگی را تعریف کنید، سپس ابزار حقوقی را انتخاب کنید',
    ctaBody: 'PLUCO GROUP تصمیم‌های اقامت، ملک، بانکداری و امور فرامرزی را در یک برنامه خصوصی و متناسب با زندگی مورد نظر شما هماهنگ می‌کند.',
    paired: 'Read the English edition',
  },
} as const;

function formatEditorialDate(date: string, locale: InsightLocale) {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-gregory' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function InsightArticle({ article, locale }: { article: PlucoInsight; locale: InsightLocale }) {
  const isFa = locale === 'fa';
  const t = copy[locale];
  const basePath = isFa ? '/fa/insights' : '/insights';
  const pairedPath = isFa ? `/insights/${article.slug}` : `/fa/insights/${article.slug}`;
  const BackIcon = isFa ? ArrowRight : ArrowLeft;

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]" dir={isFa ? 'rtl' : 'ltr'}>
      <article>
        <header className="bg-[#071C3C] text-white">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-32 sm:px-8 lg:pt-36">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={basePath} className="inline-flex items-center gap-2 text-sm font-bold text-[#E3C783] hover:text-white">
                <BackIcon className="h-4 w-4" />{t.hub}
              </Link>
              <Link href={pairedPath} className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold text-white hover:border-[#E3C783] hover:text-[#E3C783]">
                {t.paired}
              </Link>
            </div>
            <div className="mt-12 max-w-5xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E3C783]">{article.eyebrow[locale]}</p>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">{article.title[locale]}</h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">{article.description[locale]}</p>
              <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#E3C783]" />{t.published} {formatEditorialDate(article.publishedOn, locale)}</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#E3C783]" />{t.reviewed} {formatEditorialDate(article.reviewedOn, locale)}</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#E3C783]" />{article.readTime[locale]}</span>
              </div>
              <p className="mt-5 text-sm text-slate-300">
                <Link href="/our-people/reza-ostad" className="font-bold text-[#E3C783] underline underline-offset-4">{t.byline}</Link>
                {' · '}
                <Link href={isFa ? '/fa/editorial-standards' : '/editorial-standards'} className="underline underline-offset-4">{isFa ? 'روش تهیه و اصلاح محتوا' : 'How content is prepared and corrected'}</Link>
              </p>
            </div>
          </div>
        </header>

        <div className="relative mx-auto -mb-6 aspect-[16/8.2] max-w-7xl overflow-hidden bg-[#071C3C] sm:rounded-b-3xl">
          <Image src={article.image} alt={article.imageAlt[locale]} fill priority sizes="100vw" className="object-cover" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="max-w-3xl">
            <p className="border-s-4 border-[#C9A35A] ps-6 font-serif text-xl leading-9 text-[#2A3447]">{article.introduction[locale]}</p>

            {article.sections.map((section) => (
              <section key={section.heading.en} className="mt-12 scroll-mt-28">
                <h2 className="font-serif text-3xl font-bold leading-tight text-[#172033]">{section.heading[locale]}</h2>
                <div className="mt-5 space-y-5 text-[17px] leading-8 text-slate-700">
                  {section.paragraphs[locale].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {section.bullets ? (
                  <ul className="mt-6 space-y-3 rounded-2xl border border-[#DDD5C4] bg-white p-6 text-[16px] leading-7 text-slate-700">
                    {section.bullets[locale].map((bullet) => (
                      <li key={bullet} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A35A]" />{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-[#E3C783]">PLUCO GROUP</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">{t.ctaTitle}</h2>
              <p className="mt-4 leading-7 text-slate-200">{t.ctaBody}</p>
              <Link href={article.servicePath[locale]} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C9A35A] px-6 py-3 text-sm font-black text-[#071C3C]">
                {article.serviceLabel[locale]}<ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="mt-12 border-t border-[#DDD5C4] pt-10">
              <h2 className="font-serif text-2xl font-bold">{t.sources}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{t.sourceNote}</p>
              <ol className="mt-6 space-y-4">
                {article.sources.map((source, index) => (
                  <li key={source.url} className="flex gap-3 text-sm leading-6">
                    <span className="font-black text-[#8B6A23]">{index + 1}.</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#34415A] underline decoration-[#C9A35A] underline-offset-4">
                      {source.title[locale]} — {source.publisher[locale]}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-2xl border border-[#DDD5C4] bg-white p-6">
              <h2 className="font-serif text-xl font-bold">{t.related}</h2>
              <div className="mt-5 space-y-5">
                {article.relatedSlugs.map((slug) => {
                  const related = PLUCO_INSIGHTS[slug];
                  if (!related) return null;
                  return (
                    <Link key={slug} href={`${basePath}/${slug}`} className="group block border-b border-[#E8E2D7] pb-5 last:border-0 last:pb-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8B6A23]">{related.category[locale]}</span>
                      <span className="mt-2 block font-bold leading-6 text-[#27334A] group-hover:text-[#8B6A23]">{related.title[locale]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#DDD5C4] bg-[#EFE9DB] p-6">
              <h2 className="font-bold">{t.disclaimerTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t.disclaimer}</p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
