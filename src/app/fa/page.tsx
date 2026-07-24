import type { Metadata } from 'next';
import Link from 'next/link';
import PersianLeadForm from '@/components/persian/PersianLeadForm';
import { PERSIAN_SERVICES } from '@/lib/plucoPersianServices';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import { SITE_URL } from '@/lib/siteMetadata';

export const metadata: Metadata = {
  title: 'مشاوره حقوقی و مهاجرتی اروپا برای ایرانیان خارج از کشور',
  description:
    'بررسی محرمانه و واقع‌بینانه اقامت اروپا، ویزای دیجیتال نومد اسپانیا، ثبت شرکت، امور بانکی، خرید ملک، تابعیت دوم و قراردادهای بین‌المللی.',
  alternates: {
    canonical: `${SITE_URL}/fa`,
    languages: {
      en: SITE_URL,
      fa: `${SITE_URL}/fa`,
      'x-default': SITE_URL,
    },
  },
};

const homeFaq = [
  {
    question: 'آیا PLUCO GROUP فقط با متقاضیان داخل ایران کار می‌کند؟',
    answer: 'تمرکز این بخش بر ایرانیان و فارسی‌زبانان سراسر جهان است. امکان بررسی هر موضوع به کشور محل اقامت، نوع خدمت، مدارک و محدودیت‌های قانونی یا بانکی وابسته است.',
  },
  {
    question: 'آیا خدمات به فارسی ارائه می‌شود؟',
    answer: 'ارتباط اولیه و توضیح فرایند می‌تواند به فارسی انجام شود. در پرونده‌های بین‌المللی ممکن است اسناد رسمی، قراردادها یا ارتباط با متخصصان محلی به زبان انگلیسی یا زبان کشور مربوط باشد.',
  },
  {
    question: 'آیا قبل از بررسی باید مبلغی پرداخت کنم؟',
    answer: 'ارسال فرم اولیه رایگان است. اگر موضوع در دامنه خدمات باشد، هر هزینه بررسی یا پیشنهاد همکاری پیش از شروع، به‌صورت شفاف و کتبی اعلام می‌شود.',
  },
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/fa#webpage`,
      url: `${SITE_URL}/fa`,
      name: 'مشاوره حقوقی و مهاجرتی اروپا برای ایرانیان خارج از کشور',
      inLanguage: 'fa',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'ItemList',
      name: 'خدمات فارسی PLUCO GROUP',
      itemListElement: Object.entries(PERSIAN_SERVICES).map(([slug, service], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: service.shortTitle,
        url: `${SITE_URL}/fa/services/${slug}`,
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: homeFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

export default function PersianHomePage() {
  return (
    <main className="bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <section className="relative overflow-hidden bg-[#071C3C] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,163,90,0.22),transparent_36%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="mb-5 text-sm font-bold tracking-wide text-[#E3C783]">خدمات حقوقی و مهاجرتی بین‌المللی به زبان فارسی</p>
          <h1 className="max-w-5xl text-4xl font-black leading-[1.45] sm:text-5xl lg:text-6xl">
            تصمیم‌های بین‌المللی مهم، با بررسی حقوقی روشن و بدون وعده‌های غیرواقعی
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-200">
            PLUCO GROUP به ایرانیان و فارسی‌زبانان خارج از کشور کمک می‌کند پیش از انتخاب مسیر اقامت،
            ساختار شرکتی، معامله ملک، اقدام بانکی یا امضای قرارداد، شرایط واقعی، مدارک و ریسک‌ها را منظم و قابل فهم بررسی کنند.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#persian-enquiry" className="rounded-full bg-[#C9A35A] px-7 py-3.5 font-bold text-[#071C3C] transition hover:bg-[#E3C783]">
              درخواست بررسی محرمانه
            </a>
            <a href="#persian-services" className="rounded-full border border-white/40 px-7 py-3.5 font-bold text-white transition hover:border-white">
              مشاهده خدمات فارسی
            </a>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-400">
            ارسال درخواست به معنی پذیرش پرونده، ایجاد رابطه وکیل و موکل یا تضمین نتیجه نیست.
          </p>
        </div>
      </section>

      <section id="persian-services" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-bold text-[#8B6A23]">مسیرهای قابل بررسی</span>
          <h2 className="mt-3 text-3xl font-black leading-[1.5] sm:text-4xl">خدمات فارسی برای زندگی، کار و سرمایه در خارج از ایران</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            هر صفحه برای یک نیاز مشخص نوشته شده است تا بتوانید قبل از تماس، محدودیت‌ها، مراحل و مدارک کلیدی را بهتر بشناسید.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(PERSIAN_SERVICES).map(([slug, service]) => (
            <Link
              key={slug}
              href={`/fa/services/${slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#C9A35A] hover:shadow-lg"
            >
              <span className="text-xs font-bold text-[#8B6A23]">خدمات تخصصی</span>
              <h3 className="mt-3 text-xl font-black leading-8 text-[#172033]">{service.shortTitle}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{service.description}</p>
              <span className="mt-6 inline-block text-sm font-bold text-[#71551d]">مطالعه راهنما ←</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <span className="text-sm font-bold text-[#8B6A23]">مرکز دانش فارسی</span>
              <h2 className="mt-3 text-3xl font-black leading-[1.5] sm:text-4xl">راهنماهای منبع‌محور پیش از تصمیم و پرداخت</h2>
              <p className="mt-4 leading-8 text-slate-600">مطالبی برای شناخت مدارک، ریسک‌ها و پرسش‌هایی که باید از مرجع رسمی یا مشاور خود بپرسید.</p>
            </div>
            <Link href="/fa/guides" className="font-bold text-[#71551d] underline">مشاهده همه راهنماها</Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {Object.entries(PERSIAN_GUIDES).map(([slug, guide]) => (
              <Link key={slug} href={`/fa/guides/${slug}`} className="rounded-2xl bg-[#F7F5EF] p-6 transition hover:bg-[#F0EBDD]">
                <span className="text-xs font-bold text-[#8B6A23]">{guide.readTime}</span>
                <h3 className="mt-3 text-xl font-black leading-9">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="text-sm font-bold text-[#8B6A23]">فرایند همکاری</span>
            <h2 className="mt-3 text-3xl font-black leading-[1.5]">ابتدا واقعیت‌ها، سپس انتخاب مسیر</h2>
            <div className="mt-8 grid gap-5">
              {[
                ['۱', 'شرح اولیه', 'هدف، تابعیت، کشور محل اقامت و محدودیت اصلی را کوتاه توضیح می‌دهید.'],
                ['۲', 'غربالگری موضوع', 'تیم بررسی می‌کند آیا درخواست در دامنه خدمات و از نظر مقدماتی قابل پیگیری است.'],
                ['۳', 'مشاوره و مدارک', 'در صورت تناسب، مدارک اولیه، هزینه بررسی و ریسک‌های شناخته‌شده توضیح داده می‌شود.'],
                ['۴', 'پیشنهاد کتبی', 'کار فقط پس از بررسی تعارض، انطباق، توافق دامنه و شرایط همکاری شروع می‌شود.'],
              ].map(([number, title, text]) => (
                <div key={number} className="flex gap-4 rounded-2xl bg-[#F7F5EF] p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071C3C] font-bold text-white">{number}</span>
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id="persian-enquiry" className="scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
            <span className="text-sm font-bold text-[#8B6A23]">تماس اولیه</span>
            <h2 className="mt-3 text-2xl font-black leading-10">شرایط خود را برای بررسی اولیه بنویسید</h2>
            <p className="mb-7 mt-3 text-sm leading-7 text-slate-600">
              لطفاً در این مرحله تصویر پاسپورت، اطلاعات کامل بانکی یا اسناد حساس ارسال نکنید.
            </p>
            <PersianLeadForm service="Persian General Private Enquiry" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <h2 className="text-center text-3xl font-black">پرسش‌های متداول</h2>
        <div className="mt-9 grid gap-4">
          {homeFaq.map((item) => (
            <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-black leading-8">{item.question}</summary>
              <p className="mt-3 leading-8 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
