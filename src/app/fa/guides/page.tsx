import type { Metadata } from 'next';
import Link from 'next/link';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import { SITE_URL } from '@/lib/siteMetadata';

export const metadata: Metadata = {
  title: 'راهنماهای فارسی اقامت، بانک و کسب‌وکار در اروپا',
  description: 'راهنماهای فارسی و منبع‌محور PLUCO GROUP برای تصمیم‌های اقامتی، بانکی، شرکتی و حقوقی بین‌المللی.',
  alternates: { canonical: `${SITE_URL}/fa/guides`, languages: { fa: `${SITE_URL}/fa/guides` } },
};

export default function PersianGuidesPage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-sm font-bold text-[#E3C783]">مرکز دانش فارسی</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.5] sm:text-5xl">
            راهنماهای عملی برای تصمیم‌های بین‌المللی
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">
            مطالب عمومی و منبع‌محور برای شناخت بهتر مدارک، ریسک‌ها و پرسش‌هایی که باید پیش از اقدام مطرح کنید.
          </p>
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
