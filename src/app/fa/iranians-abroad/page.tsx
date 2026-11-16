import type { Metadata } from "next";
import Link from "next/link";
import { localizedPath } from "@/lib/languageRoutes";
import { SITE_URL } from "@/lib/siteMetadata";

const url = `${SITE_URL}/fa/iranians-abroad`;
const englishUrl = `${SITE_URL}/iranian-clients`;

export const metadata: Metadata = {
  title: { absolute: "راهنمای عمومی امور اروپا برای ایرانیان خارج از کشور | پلوکو گروپ" },
  description: "راهنمای عمومی برای ایرانیان خارج از کشور درباره اقامت اروپا، امور بانکی، ثبت شرکت، قرارداد و موضوعات فرامرزی.",
  alternates: { canonical: url, languages: { en: englishUrl, fa: url, "x-default": englishUrl } },
  openGraph: { title: "راهنمای عمومی امور اروپا برای ایرانیان خارج از کشور | پلوکو گروپ", description: "اطلاعات عمومی درباره اقامت، امور بانکی، ثبت شرکت و قراردادهای فرامرزی.", url, locale: "fa_IR", alternateLocale: ["en_US"], type: "website" },
};

const topics = [
  ["اقامت اروپا", "پیش از انتخاب مسیر، وضعیت خانوادگی، محل کار، درآمد و مدارک باید با قوانین روز بررسی شود.", "/eu-residency"],
  ["ویزای دورکاری اسپانیا", "شرایط دورکاری، قرارداد، درآمد، بیمه و محل درخواست باید پیش از اقدام بررسی شوند.", "/spain-digital-nomad-visa"],
  ["امور بانکی و منبع وجوه", "پاسخ مستند به پرسش‌های منبع وجوه و مسیر انتقال، جایگزین تصمیم مستقل بانک یا نهاد رسمی نیست.", "/banking"],
  ["ثبت شرکت در اروپا", "ثبت شرکت، امور بانکی و وضعیت اقامت شخصی موضوعات جداگانه‌ای هستند که باید هماهنگ بررسی شوند.", "/eu-company-registration"],
  ["قراردادهای بین‌المللی", "در مسائل حقوقی یا قضایی، ممکن است نیاز به همکاری با متخصص واجد صلاحیت در حوزه مربوط باشد.", "/international-contracts"],
] as const;

export default function IranianClientsPersianPage() {
  return (
    <main className="bg-[#F7F5EF] text-[#172033]" dir="rtl">
      <section className="bg-[#071C3C] text-white"><div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24"><p className="text-sm font-bold text-[#E3C783]">برای ایرانیان خارج از کشور</p><h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">یک نقطه شروع روشن برای مسائل اقامت، بانک و کسب‌وکار در اروپا</h1><p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">موضوع درست را بر پایه وضعیت واقعی خود پیدا کنید؛ نه بر پایه وعده نتیجه یا زمان قطعی.</p><Link href="/iranian-clients" hrefLang="en" className="mt-8 inline-block rounded-full border border-[#E3C783] px-6 py-3 font-bold text-[#E3C783]">Read in English</Link></div></section>
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8"><div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-9 text-slate-700"><strong>اطلاعات این صفحه عمومی است.</strong> تابعیت، محل اقامت، درآمد، خانواده، منشأ وجوه و قانون کشور مربوط می‌تواند نتیجه بررسی را تغییر دهد. هیچ تأیید، ویزا، حساب بانکی یا نتیجه نهادی تضمین نمی‌شود.</div><div className="mt-10 grid gap-6 md:grid-cols-2">{topics.map(([title, summary, href]) => <article key={title} className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">{title}</h2><p className="mt-4 leading-8 text-slate-700">{summary}</p><Link href={localizedPath(href, true)} hrefLang="fa" className="mt-6 inline-block font-bold text-[#71551d] underline underline-offset-4">جزئیات خدمات به فارسی</Link></article>)}</div><section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white sm:p-10"><h2 className="text-3xl font-black">برای تشخیص نقطه شروع به کمک نیاز دارید؟</h2><p className="mt-4 max-w-3xl leading-9 text-slate-200">کشور، وضعیت فعلی و موضوع خود را بدون رمز، کد دسترسی یا مدارک کامل هویتی و بانکی ارسال کنید.</p><Link href="/enquire" className="mt-7 inline-block rounded-full bg-[#E3C783] px-6 py-3 font-bold text-[#071C3C]">ارسال درخواست محرمانه</Link></section></section>
    </main>
  );
}
