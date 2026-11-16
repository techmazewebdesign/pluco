import Link from 'next/link';
import { saoTomeEditorial, type SaoTomeEditorial } from '@/lib/saoTomeEditorial';
import { SITE_URL } from '@/lib/siteMetadata';

export default function SaoTomeEditorialPage({ article }: { article: SaoTomeEditorial }) {
  const isNews = article.kind === 'news';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isNews ? 'NewsArticle' : 'Article',
    mainEntityOfPage: SITE_URL + article.path,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: 'fa-IR',
    author: { '@type': 'Organization', name: 'PLUCO GROUP', url: 'https://www.plucogroup.com' },
    publisher: { '@type': 'Organization', name: 'PLUCO GROUP', url: 'https://www.plucogroup.com' },
  };

  return <main dir="rtl" className="min-h-screen bg-white text-[#1E2430]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <article className="pb-20">
      <header className="bg-[#071C3C] text-white pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.16em] text-[#C9A35A] mb-5">{isNews ? 'اخبار و به‌روزرسانی PLUCO GROUP' : 'مقاله تخصصی PLUCO GROUP'}</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.45]">{article.title}</h1>
          <p className="mt-6 text-lg leading--loose text-slate-200">{article.description}</p>
          <p className="mt-6 text-sm text-[#C9A35A]">۱۴ سپتامبر ۲۰۲۶ · {article.readTime}</p>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        {article.paragraphs.map((paragraph) => <p key={paragraph} className="text-base leading--loose text-[#374151] mb-6">{paragraph}</p>)}
        {article.sections.map((section) => <section key={section.heading} className="mt-12">
          <h2 className="text-2xl font-serif font-bold mb-4">{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph} className="text-base leading-loose text-[#5E6470] mb-4">{paragraph}</p>)}
        </section>)}
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-bold mb-4">مطالب مرتبط درباره تابعیت سائوتومه و پرنسیپ</h2>
          <ul className="space-y-3">
            {Object.values(saoTomeEditorial).filter(related => related.path !== article.path).map(related => (
              <li key={related.path}><Link href={related.path} className="underline underline-offset-4">{related.title}</Link></li>
            ))}
          </ul>
        </section>
        <div className="mt-14 rounded-xl bg-[#F8F9FA] border border-gray-200 p-6">
          <p className="text-sm leading-loose text-[#5E6470]">این مطلب اطلاعات عمومی است و رابطه وکیل–موکل ایجاد نمی‌کند. مقررات، هزینه‌ها و شرایط باید پیش از هر اقدام به‌صورت اختصاصی بررسی و تأیید شوند.</p>
          <Link href="/fa/sao-tome-citizenship-by-investment" className="inline-flex mt-5 px-5 py-3 rounded bg-[#C9A35A] text-[#071C3C] font-semibold">مشاهده خدمات تابعیت سائوتومه و پرنسیپ</Link>
        </div>
      </div>
    </article>
  </main>;
}
