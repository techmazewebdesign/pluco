import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/siteMetadata';

const path = '/fa/iranians-abroad';
const url = `${SITE_URL}${path}`;
const enUrl = `${SITE_URL}/iranian-clients`;

export const metadata: Metadata = {
  title: 'خدمات حقوقی، اقامتی و بانکی اروپا برای ایرانیان خارج از کشور',
  description: 'راهنمای انتخاب خدمات PLUCO GROUP برای اقامت اروپا، ثبت شرکت، امور بانکی، اثبات منبع سرمایه، قراردادها و خرید ملک برای ایرانیان.',
  alternates: { canonical: url, languages: { fa: url, en: enUrl, 'x-default': enUrl } },
  openGraph: {
    title: 'خدمات حقوقی و اقامتی اروپا برای ایرانیان خارج از کشور',
    description: 'بر اساس نیاز واقعی خود، خدمت و راهنمای مرتبط PLUCO GROUP را پیدا کنید.',
    url,
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

const needs = [
  ['اقامت اروپا برای ایرانیان', 'مقایسه مسیرهای اقامت بر اساس شغل، خانواده، درآمد، مدارک و تعهدات پس از دریافت اقامت.', '/fa/services/eu-residency', '/fa/guides/choose-eu-residency-route'],
  ['ویزای دیجیتال نومد اسپانیا', 'بررسی شرایط دورکاری و آماده‌سازی مدارک قرارداد، درآمد، بیمه و اعضای خانواده.', '/fa/services/spain-digital-nomad-visa', '/fa/guides/spain-digital-nomad-document-checklist'],
  ['ثبت شرکت در اروپا', 'تفکیک ثبت شرکت از اقامت شخصی و آماده‌سازی ساختار شرکتی و پرونده بانکی.', '/fa/services/eu-company-registration', '/fa/guides/eu-company-versus-residency'],
  ['مشکلات بانکی و اثبات منبع سرمایه', 'پاسخ مستند به پرسش‌های تطبیق، مالکیت، منشأ، مسیر انتقال و هدف وجوه.', '/fa/services/banking', '/fa/guides/bank-account-closure-iranians-europe'],
  ['قراردادها و اختلافات بین‌المللی', 'بررسی قرارداد، راهبرد مذاکره و هماهنگی با متخصصان حوزه قضایی مربوط در صورت نیاز.', '/fa/services/international-contracts', '/fa/services/dispute-resolution'],
  ['خرید ملک در اروپا', 'هماهنگی بررسی حقوقی ملک، مدارک انتقال وجه و بررسی جداگانه آثار اقامتی.', '/fa/services/eu-property-purchase', '/fa/guides/eu-property-due-diligence'],
] as const;

export default function IranianClientsPersianPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: 'خدمات حقوقی و اقامتی اروپا برای ایرانیان', description: metadata.description, inLanguage: 'fa', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#organization` } },
      { '@type': 'ItemList', itemListElement: needs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item[0], url: `${SITE_URL}${item[2]}` })) },
    ],
  };

  return (
    <main className="bg-[#F7F5EF] text-[#172033]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-sm font-bold text-[#E3C783]">برای ایرانیان در سراسر جهان</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">خدمت حقوقی، اقامتی یا بانکی متناسب با شرایط خود را پیدا کنید</h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">نقطه شروع روشن برای خانواده‌ها، متخصصان دورکار و کارآفرینان ایرانی که با مسائل اقامت، بانک، کسب‌وکار یا امور حقوقی بین‌المللی روبه‌رو هستند.</p>
          <Link href="/iranian-clients" className="mt-8 inline-block rounded-full border border-[#E3C783] px-6 py-3 font-bold text-[#E3C783]">Read in English</Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-9 text-slate-700"><strong>از مسئله واقعی شروع کنید، نه از وعده نتیجه.</strong> تابعیت، محل اقامت، نوع درآمد، خانواده، منبع سرمایه و قانون کشور مربوط می‌تواند مسیر مناسب را تغییر دهد. این صفحه اطلاعات عمومی است و هر اقدام رسمی به بررسی روز و فردی نیاز دارد.</div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {needs.map(([title, summary, service, guide]) => (
            <article key={title} className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-4 leading-8 text-slate-700">{summary}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold"><Link href={service} className="text-[#71551d] underline underline-offset-4">مشاهده خدمت</Link><Link href={guide} className="text-[#071C3C] underline underline-offset-4">مطالعه راهنما</Link></div>
            </article>
          ))}
        </div>
        <section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white sm:p-10"><h2 className="text-3xl font-black">نمی‌دانید از کجا شروع کنید؟</h2><p className="mt-4 max-w-3xl leading-9 text-slate-200">کشور، وضعیت فعلی و نتیجه موردنظر را کوتاه و دقیق بنویسید. در تماس اولیه رمز، کد دسترسی یا تصویر کامل مدارک هویتی و بانکی ارسال نکنید.</p><Link href="/enquire" className="mt-7 inline-block rounded-full bg-[#E3C783] px-6 py-3 font-bold text-[#071C3C]">ارسال درخواست محرمانه</Link></section>
      </section>
    </main>
  );
}
