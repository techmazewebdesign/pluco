import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { PLUCO_INSIGHT_LIST, type InsightLocale } from '@/lib/plucoInsights';

const copy = {
  en: {
    eyebrow: 'PLUCO INSIGHTS',
    title: 'Intelligence for the life beyond the application',
    intro:
      'Source-led briefings on residence, mobility, banking, property and the lived experience of building a life across borders.',
    language: 'مطالعه به فارسی',
    languageHref: '/fa/insights',
    article: 'Read briefing',
    reviewed: 'Reviewed',
    principles: [
      ['Source-led', 'Material legal and procedural statements link to current primary sources.'],
      ['Private-client perspective', 'We connect the document, property or visa to the wider life decision.'],
      ['Bilingual by design', 'English and Persian editions are reviewed as paired editorial products.'],
    ],
    disclaimer:
      'Insights provide general information, not legal, tax or investment advice. Rules and administrative practice can change. Individual eligibility requires a current review.',
  },
  fa: {
    eyebrow: 'بینش‌های PLUCO',
    title: 'اطلاعاتی برای زندگی فراتر از پرونده',
    intro:
      'یادداشت‌های مستند درباره اقامت، تحرک بین‌المللی، بانک، ملک و تجربه واقعی ساختن زندگی در چند کشور.',
    language: 'Read in English',
    languageHref: '/insights',
    article: 'مطالعه یادداشت',
    reviewed: 'بازبینی',
    principles: [
      ['مستند و منبع‌محور', 'ادعاهای حقوقی و اجرایی مهم به منابع رسمی و به‌روز پیوند دارند.'],
      ['نگاه موکل خصوصی', 'ویزا، مدرک یا ملک را در ارتباط با تصمیم بزرگ‌تر زندگی بررسی می‌کنیم.'],
      ['دو‌زبانه از ابتدا', 'نسخه‌های انگلیسی و فارسی به‌عنوان یک محصول تحریریه‌ای واحد بازبینی می‌شوند.'],
    ],
    disclaimer:
      'این مطالب اطلاعات عمومی هستند و جایگزین مشاوره حقوقی، مالیاتی یا سرمایه‌گذاری نیستند. قوانین و رویه‌های اداری ممکن است تغییر کنند و احراز شرایط به بررسی روز پرونده نیاز دارد.',
  },
} as const;

const icons = [BookOpen, Compass, ShieldCheck];

export default function InsightHub({ locale }: { locale: InsightLocale }) {
  const t = copy[locale];
  const isFa = locale === 'fa';
  const basePath = isFa ? '/fa/insights' : '/insights';

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]" dir={isFa ? 'rtl' : 'ltr'}>
      <section className="relative overflow-hidden bg-[#071C3C] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_top_right,#C9A35A,transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#E3C783]">{t.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">{t.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">{t.intro}</p>
            <Link
              href={t.languageHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#E3C783] hover:text-[#E3C783]"
            >
              {t.language}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {t.principles.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <div key={title} className="rounded-2xl border border-[#DDD5C4] bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-[#A77B2B]" />
                <h2 className="mt-4 text-lg font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-7 md:grid-cols-2">
          {PLUCO_INSIGHT_LIST.map((article, index) => (
            <article
              key={article.slug}
              className={`group overflow-hidden rounded-3xl border border-[#DDD5C4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                index === 0 ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
              }`}
            >
              <Link href={`${basePath}/${article.slug}`} className="relative block min-h-[260px] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.imageAlt[locale]}
                  fill
                  sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 50vw'}
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C3C]/45 to-transparent" />
              </Link>
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-[#8B6A23]">
                  <span>{article.category[locale]}</span><span>·</span><span>{article.country[locale]}</span>
                </div>
                <h2 className="mt-4 font-serif text-2xl font-bold leading-tight sm:text-3xl">
                  <Link href={`${basePath}/${article.slug}`} className="transition hover:text-[#8B6A23]">
                    {article.title[locale]}
                  </Link>
                </h2>
                <p className="mt-4 line-clamp-3 leading-7 text-slate-600">{article.description[locale]}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">{article.readTime[locale]} · {t.reviewed} {article.reviewedOn}</span>
                  <Link href={`${basePath}/${article.slug}`} className="inline-flex items-center gap-2 font-black text-[#76591E]">
                    {t.article}<ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#DDD5C4] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-8 text-center text-sm leading-6 text-slate-500 sm:px-8">
          {t.disclaimer}
        </div>
      </section>
    </main>
  );
}

