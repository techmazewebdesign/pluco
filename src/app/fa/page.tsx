import type { Metadata } from "next";
import Link from "next/link";
import PersianServiceDirectory from "@/components/persian/PersianServiceDirectory";
import { SITE_URL } from "@/lib/siteMetadata";

const url = `${SITE_URL}/fa`;

export const metadata: Metadata = {
  title: { absolute: "مشاوره اقامت اروپا برای ایرانیان | پلوکو گروپ" },
  description: "اطلاعات عمومی پلوکو گروپ درباره اقامت اروپا، امور بانکی و تطبیق، ثبت شرکت و مسائل فرامرزی برای ایرانیان.",
  alternates: { canonical: url, languages: { en: SITE_URL, fa: url, "x-default": SITE_URL } },
  openGraph: { title: "مشاوره اقامت اروپا برای ایرانیان | پلوکو گروپ", description: "اطلاعات عمومی درباره امور اقامت، بانکی، ثبت شرکت و مسائل فرامرزی.", url, locale: "fa_IR", alternateLocale: ["en_US"], type: "website" },
};

export default function PersianHomePage() {
  return (
    <main className="bg-[#F7F5EF] text-[#172033]" dir="rtl">
      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-sm font-bold text-[#E3C783]">برای ایرانیان در سراسر جهان</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">مشاوره اقامت اروپا و امور بین‌المللی برای ایرانیان</h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">پلوکو گروپ برای تصمیم‌های حساس، اطلاعات عمومی و هماهنگی ساختاری فراهم می‌کند. مسیر هر پرونده به وضعیت فردی و قوانین روز بستگی دارد.</p>
          <Link href="/fa/iranians-abroad" className="mt-8 inline-block rounded-full border border-[#E3C783] px-6 py-3 font-bold text-[#E3C783]">مشاهده موضوعات مرتبط</Link>
        </div>
      </section>
      <PersianServiceDirectory />
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">اقامت و جابه‌جایی</h2><p className="mt-4 leading-8 text-slate-700">بررسی اولیه مسیرهای اقامت بر پایه کار، خانواده، درآمد، مدارک و قوانین فعلی.</p><Link href="/fa/services/eu-residency" hrefLang="fa" className="mt-6 inline-block font-bold text-[#71551d] underline">اطلاعات خدمات به فارسی</Link></article>
          <article className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">بانک و تطبیق</h2><p className="mt-4 leading-8 text-slate-700">آماده‌سازی منظم اطلاعات منبع وجوه و پاسخ به پرسش‌های تطبیق.</p><Link href="/fa/services/banking" hrefLang="fa" className="mt-6 inline-block font-bold text-[#71551d] underline">اطلاعات خدمات به فارسی</Link></article>
          <article className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">شرکت و قرارداد</h2><p className="mt-4 leading-8 text-slate-700">تفکیک موضوعات ثبت شرکت، قرارداد و وضعیت شخصی پیش از هر اقدام رسمی.</p><Link href="/fa/services/eu-company-registration" hrefLang="fa" className="mt-6 inline-block font-bold text-[#71551d] underline">اطلاعات خدمات به فارسی</Link></article>
        </div>
        <section className="mt-14 rounded-3xl bg-white p-8"><h2 className="text-2xl font-black">تابعیت سائوتومه و پرنسیپ</h2><p className="mt-4 leading-8">اطلاعات خدمات و یادداشت‌های موجود درباره بررسی شرایط، مدارک و انطباق.</p><Link href="/fa/sao-tome-citizenship-by-investment" className="mt-4 inline-block underline">مشاهده خدمات</Link><ul className="mt-4 space-y-3"><li><Link href="/fa/publications/sao-tome-citizenship-by-investment-for-iranians">راهنمای متقاضیان ایرانی</Link></li><li><Link href="/fa/publications/sao-tome-citizenship-by-investment-costs-process">هزینه و مراحل</Link></li><li><Link href="/fa/publications/sao-tome-citizenship-by-investment-documents-compliance">مدارک و انطباق</Link></li><li><Link href="/fa/news/sao-tome-citizenship-by-investment-regulation-update">چارچوب مقرراتی</Link></li><li><Link href="/fa/news/sao-tome-citizenship-by-investment-fund-transparency">شفافیت مالی</Link></li></ul></section>
        <section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white sm:p-10"><h2 className="text-3xl font-black">برای شروع به راهنمایی نیاز دارید؟</h2><p className="mt-4 max-w-3xl leading-9 text-slate-200">کشور، وضعیت فعلی و موضوع خود را کوتاه و دقیق بنویسید. ارسال درخواست به معنی ایجاد رابطه حرفه‌ای یا تضمین نتیجه نیست.</p><Link href="/enquire" className="mt-7 inline-block rounded-full bg-[#E3C783] px-6 py-3 font-bold text-[#071C3C]">ارسال درخواست محرمانه</Link></section>
      </section>
    </main>
  );
}
