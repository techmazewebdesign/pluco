import type { Metadata } from 'next';
import Link from 'next/link';
import ServiceHeroImage from '@/components/shared/ServiceHeroImage';
import { notFound } from 'next/navigation';
import { PERSIAN_SERVICES, isPersianServiceSlug } from '@/lib/plucoPersianServices';
import { createPageMetadata, SITE_URL } from '@/lib/siteMetadata';
type Props = { params: Promise<{slug: string}> };
export function generateStaticParams() { return Object.keys(PERSIAN_SERVICES).map(slug => ({slug})); }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params; if (!isPersianServiceSlug(slug)) return {};
  const service = PERSIAN_SERVICES[slug];
  return createPageMetadata({title: `${service.shortTitle} برای ایرانیان | PLUCO GROUP`, description: service.description,
    path: `/fa/services/${slug}`, locale: 'fa_IR', alternateLocales: ['en_US']});
}
export default async function Page({params}: Props) {
  const {slug} = await params; if (!isPersianServiceSlug(slug)) notFound();
  const service = PERSIAN_SERVICES[slug], path = `/fa/services/${slug}`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    {'@type':'Service', name:service.title, description:service.description, url:SITE_URL+path,
      provider:{'@id':SITE_URL+'/#organization'}, availableLanguage:['fa','en']},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'خدمات فارسی',item:SITE_URL+'/fa'},
      {'@type':'ListItem',position:2,name:service.shortTitle,item:SITE_URL+path}]}] };
  return <article lang="fa" dir="rtl" className="bg-[#F7F5EF] text-[#172033]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />
    <header className="bg-[#071C3C] px-5 py-16 text-white"><div className="mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
      <div>
        <nav aria-label="مسیر صفحه"><Link href="/fa" className="underline">خدمات فارسی</Link></nav>
        <h1 className="mt-6 text-3xl font-bold leading-relaxed sm:text-5xl">{service.title}</h1>
        <p className="mt-6 text-lg leading-9">{service.description}</p>
        <Link href={service.englishPath} hrefLang="en" className="mt-6 inline-block underline">English version</Link>
      </div>
      <ServiceHeroImage service={service.englishPath.slice(1)} lang="fa" />
    </div></header>
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-12 sm:px-8">
      <section><h2 className="text-2xl font-bold">این خدمت برای چه کسانی مناسب است؟</h2><p className="mt-4 leading-9">{service.audience}</p></section>
      <section><h2 className="text-2xl font-bold">دامنه بررسی و هماهنگی</h2><ul className="mt-4 list-inside list-disc space-y-3">{service.benefits.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section><h2 className="text-2xl font-bold">مراحل همکاری</h2><ol className="mt-4 list-inside list-decimal space-y-3">{service.process.map(x=><li key={x}>{x}</li>)}</ol></section>
      <section><h2 className="text-2xl font-bold">موضوعات مهم پیش از اقدام</h2><ul className="mt-4 list-inside list-disc space-y-3">{service.considerations.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section><h2 className="text-2xl font-bold">پرسش‌های رایج</h2>{service.faq.map(x=><div key={x.question} className="mt-6"><h3 className="text-lg font-bold">{x.question}</h3><p className="mt-3 leading-9">{x.answer}</p></div>)}</section>
      <section className="rounded-2xl bg-white p-7"><h2 className="text-2xl font-bold">درخواست بررسی اولیه</h2>
        <p className="mt-4 leading-8">شرح کوتاه موضوع و کشور محل اقامت خود را ارسال کنید. دامنه خدمات و هزینه‌ها پس از بررسی اولیه به صورت کتبی مشخص می‌شود. نتیجه یا زمان تصمیم مراجع تضمین نمی‌شود.</p>
        <Link href="/enquire" className="mt-6 inline-block rounded-lg bg-[#071C3C] px-6 py-3 font-bold text-white">ارسال درخواست محرمانه</Link>
        <p className="mt-5 text-sm leading-8">اطلاعات این صفحه عمومی است. در صورت نیاز به خدمات حقوقی، مالیاتی یا سرمایه‌گذاری تحت نظارت، هماهنگی با متخصص دارای مجوز مربوط انجام می‌شود.</p>
      </section>
    </div>
  </article>;
}
