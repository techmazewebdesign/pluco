import Link from 'next/link';
import { PERSIAN_SERVICES } from '@/lib/plucoPersianServices';
export default function PersianServiceDirectory() {
  return <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8" lang="fa" dir="rtl">
    <h2 className="text-3xl font-bold text-[#071C3C]">خدمات اقامت اروپا و امور بین‌المللی به زبان فارسی</h2>
    <div className="mt-7 grid gap-5 md:grid-cols-2">{Object.entries(PERSIAN_SERVICES).map(([slug, service]) =>
      <article key={slug} className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-xl font-bold"><Link href={`/fa/services/${slug}`} className="text-[#71551d] underline">{service.shortTitle}</Link></h3>
        <p className="mt-4 leading-8 text-slate-700">{service.description}</p>
      </article>)}</div>
  </section>;
}
