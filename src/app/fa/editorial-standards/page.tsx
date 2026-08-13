import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_URL,
} from '@/lib/siteMetadata';

const PAGE_URL = `${SITE_URL}/fa/editorial-standards`;

export const metadata: Metadata = {
  title: 'استانداردهای تحریریه و فرایند بازبینی محتوا',
  description:
    'روش PLUCO GROUP برای تهیه، منبع‌دهی، بازبینی، به‌روزرسانی و اصلاح راهنماهای عمومی حقوقی، مهاجرتی، بانکی، شرکتی و ملکی.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      fa: PAGE_URL,
      en: `${SITE_URL}/editorial-standards`,
      'x-default': `${SITE_URL}/editorial-standards`,
    },
  },
  openGraph: {
    title: 'استانداردهای تحریریه PLUCO GROUP',
    description: 'معیارهای منبع‌دهی، بازبینی، اصلاح و استقلال مطالب عمومی.',
    url: PAGE_URL,
    siteName: 'PLUCO GROUP',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'استانداردهای تحریریه PLUCO GROUP',
    description: 'معیارهای منبع‌دهی، بازبینی، اصلاح و استقلال مطالب عمومی.',
    images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
  },
};

const standards = [
  {
    title: 'چه کسی راهنماها را تهیه می‌کند؟',
    body:
      'در راهنماهای عمومی، رضا استاد به‌عنوان نویسنده اصلی و PLUCO GROUP به‌عنوان بازبین سازمانی معرفی می‌شوند، مگر آنکه صفحه به‌طور مشخص ترتیب دیگری را اعلام کند. نام نویسنده به معنی تأیید مطلب توسط وکیل نام‌برده‌نشده، مرجع دولتی، بانک یا نهاد عمومی نیست. هر متخصص دیگری که بازبینی اساسی انجام دهد فقط در صورت مستند بودن نقش او معرفی می‌شود.',
  },
  {
    title: 'منابع چگونه انتخاب می‌شوند؟',
    body:
      'اولویت با قوانین، پورتال‌های دولتی، نهادهای ناظر، دادگاه‌ها و راهنمای رسمی مؤسسات است. مطالب تجاری ممکن است برای شناسایی یک پرسش مفید باشند، اما جایگزین مرجع صلاحیت‌دار برای شرایط روز، رویه، هزینه یا مدارک لازم نمی‌شوند.',
  },
  {
    title: 'ادعاهای حساس چگونه کنترل می‌شوند؟',
    body:
      'موضوعات مهاجرت، بانک، مالیات، شرکت، ملک، تحریم و اختلاف به واقعیت‌ها و حوزه قضایی وابسته‌اند. راهنماها اطلاعات عمومی را از مشاوره متناسب با پرونده جدا می‌کنند، عدم‌قطعیت‌های مهم را نشان می‌دهند و درباره نتیجه، زمان، افتتاح حساب، تراکنش، اقامت یا رأی حقوقی تضمین نمی‌دهند.',
  },
  {
    title: 'تاریخ بازبینی و به‌روزرسانی',
    body:
      'هر راهنما تاریخ بازبینی یا به‌روزرسانی دارد. این تاریخ فقط پس از کنترل یا اصلاح واقعی مطلب تغییر می‌کند. با این حال، خواننده باید پیش از ثبت درخواست، امضا، پرداخت یا انتقال وجه، الزامات روز را مستقیماً از مرجع صلاحیت‌دار بررسی کند.',
  },
  {
    title: 'اصلاح و شفافیت',
    body:
      'اگر خطای واقعی، منبع رسمی خراب یا تغییر مهمی گزارش شود، بخش مربوط بررسی و در صورت لزوم اصلاح می‌شود. برای اعلام اصلاح می‌توانید نشانی صفحه و منبع پشتیبان را به info@plucogroup.com ارسال کنید.',
  },
  {
    title: 'استقلال تجاری',
    body:
      'ممکن است یک راهنمای عمومی به خدمت مرتبط PLUCO GROUP پیوند داشته باشد. این پیوند معیار منبع‌دهی را تغییر نمی‌دهد، رابطه حرفه‌ای ایجاد نمی‌کند و پذیرش پرونده را تضمین نمی‌کند. دامنه خدمات و هزینه باید جداگانه و به‌صورت کتبی توافق شود.',
  },
] as const;

export default function PersianEditorialStandardsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'استانداردهای تحریریه و فرایند بازبینی PLUCO GROUP',
        description: metadata.description,
        inLanguage: 'fa',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: `${SITE_URL}/fa` },
          { '@type': 'ListItem', position: 2, name: 'استانداردهای تحریریه', item: PAGE_URL },
        ],
      },
    ],
  };

  return (
    <main lang="fa" dir="rtl" className="min-h-screen bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="مسیر صفحه" className="text-sm text-slate-300">
            <Link href="/fa">صفحه فارسی</Link><span className="px-2">/</span>
            <span>استانداردهای تحریریه</span>
          </nav>
          <p className="mt-8 text-sm font-bold text-[#E3C783]">اعتماد و پاسخ‌گویی</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.5] sm:text-5xl">
            استانداردهای تحریریه و فرایند بازبینی محتوا
          </h1>
          <p className="mt-6 text-lg leading-9 text-slate-200">
            روش PLUCO GROUP برای تهیه اطلاعات عمومی درباره تصمیم‌هایی که می‌توانند بر وضعیت
            حقوقی، امور مالی، کسب‌وکار، ملک و خانواده اثر بگذارند.
          </p>
          <Link
            href="/editorial-standards"
            className="mt-7 inline-block rounded-full border border-white/40 px-6 py-3 font-bold"
          >
            English version
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-9 text-slate-700">
          این استانداردها فرایند تهیه اطلاعات عمومی را توضیح می‌دهند. هیچ راهنما به‌تنهایی
          مشاوره حقوقی یا رابطه موکل و مشاور ایجاد نمی‌کند.
        </div>
        <div className="mt-10 grid gap-6">
          {standards.map((standard) => (
            <section key={standard.title} className="rounded-2xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black leading-10">{standard.title}</h2>
              <p className="mt-4 leading-9 text-slate-700">{standard.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/fa/guides" className="rounded-full bg-[#071C3C] px-6 py-3 font-bold text-white">
            مشاهده همه راهنماها
          </Link>
          <a
            href="mailto:info@plucogroup.com?subject=PLUCO%20GROUP%20correction"
            className="rounded-full border border-[#071C3C] px-6 py-3 font-bold text-[#071C3C]"
          >
            اعلام اصلاح
          </a>
        </div>
      </article>
    </main>
  );
}
