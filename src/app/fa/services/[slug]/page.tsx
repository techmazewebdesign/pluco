import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PersianLeadForm from '@/components/persian/PersianLeadForm';
import { PERSIAN_GUIDES } from '@/lib/plucoPersianGuides';
import {
  isPersianServiceSlug,
  PERSIAN_SERVICES,
} from '@/lib/plucoPersianServices';
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  SITE_URL,
} from '@/lib/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(PERSIAN_SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPersianServiceSlug(slug)) return {};

  const service = PERSIAN_SERVICES[slug];
  const persianUrl = `${SITE_URL}/fa/services/${slug}`;
  const englishUrl = `${SITE_URL}${service.englishPath}`;

  return {
    title: service.title,
    description: service.description,
    keywords: [service.intent, service.canonicalService, 'مشاوره حقوقی فارسی زبان'],
    alternates: {
      canonical: persianUrl,
      languages: {
        fa: persianUrl,
        en: englishUrl,
        'x-default': englishUrl,
      },
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: persianUrl,
      locale: 'fa_IR',
      alternateLocale: ['en_US'],
      type: 'website',
      images: [{
        url: `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`,
        width: 1200,
        height: 630,
        alt: DEFAULT_SOCIAL_IMAGE_ALT,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.description,
      images: [`${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`],
    },
  };
}

export default async function PersianServicePage({ params }: Props) {
  const { slug } = await params;
  if (!isPersianServiceSlug(slug)) notFound();

  const service = PERSIAN_SERVICES[slug];
  const pageUrl = `${SITE_URL}/fa/services/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: service.title,
        description: service.description,
        url: pageUrl,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'Worldwide',
        availableLanguage: ['fa', 'en'],
        audience: {
          '@type': 'Audience',
          audienceType: 'Persian-speaking internationally mobile individuals and businesses',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'خدمات فارسی', item: `${SITE_URL}/fa` },
          { '@type': 'ListItem', position: 3, name: service.shortTitle, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <main lang="fa" dir="rtl" className="bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <nav aria-label="مسیر صفحه" className="mb-7 text-sm text-slate-300">
            <Link href="/fa" className="hover:text-white">صفحه فارسی</Link>
            <span className="px-2">/</span>
            <span>{service.shortTitle}</span>
          </nav>
          <p className="text-sm font-bold text-[#E3C783]">راهنمای فارسی · بررسی اولیه محرمانه</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-[1.5] sm:text-5xl">{service.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200">{service.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#service-enquiry" className="rounded-full bg-[#C9A35A] px-7 py-3.5 font-bold text-[#071C3C]">
              درخواست بررسی
            </a>
            <Link href={service.englishPath} className="rounded-full border border-white/40 px-7 py-3.5 font-bold text-white">
              English version
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-3">
        <article className="rounded-2xl bg-white p-7 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-black">این خدمت برای چه کسانی مناسب است؟</h2>
          <p className="mt-4 leading-9 text-slate-600">{service.audience}</p>
          <h2 className="mt-10 text-2xl font-black">موضوعاتی که در بررسی اولیه پوشش داده می‌شود</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="rounded-xl bg-[#F7F5EF] px-4 py-3 leading-7">
                <span className="ml-2 font-black text-[#8B6A23]">✓</span>{benefit}
              </li>
            ))}
          </ul>
        </article>
        <aside className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-7">
          <h2 className="text-xl font-black">نکات مهم پیش از اقدام</h2>
          <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
            {service.considerations.map((item) => (
              <li key={item} className="border-b border-[#E7D9B8] pb-3 last:border-0">{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-7 text-slate-600">
            اطلاعات این صفحه عمومی است و جایگزین مشاوره حقوقی متناسب با واقعیت‌های پرونده نیست.
          </p>
        </aside>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-black">فرایند بررسی و شروع همکاری</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 p-6">
                <span className="text-3xl font-black text-[#C9A35A]">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-4 leading-8 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <h2 className="text-3xl font-black">پرسش‌های متداول</h2>
          <div className="mt-7 grid gap-4">
            {service.faq.map((item) => (
              <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-black leading-8">{item.question}</summary>
                <p className="mt-3 leading-8 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div id="service-enquiry" className="scroll-mt-32 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
          <span className="text-sm font-bold text-[#8B6A23]">مرحله بعد</span>
          <h2 className="mt-3 text-2xl font-black leading-10">درخواست بررسی اولیه {service.shortTitle}</h2>
          <p className="mb-7 mt-3 text-sm leading-7 text-slate-600">
            وضعیت فعلی، کشور محل اقامت و هدف خود را کوتاه بنویسید. اسناد حساس را در این فرم ارسال نکنید.
          </p>
          <PersianLeadForm service={service.canonicalService} />
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <nav aria-label="راهنماهای مرتبط" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8">
          <h2 className="text-2xl font-black">راهنماهای مرتبط</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.entries(PERSIAN_GUIDES)
              .filter(([, guide]) => guide.relatedServiceSlug === slug)
              .map(([guideSlug, guide]) => (
                <Link
                  key={guideSlug}
                  href={`/fa/guides/${guideSlug}`}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-[#C9A35A] hover:shadow-md"
                >
                  <span className="text-xs font-bold text-[#8B6A23]">{guide.readTime}</span>
                  <h3 className="mt-2 font-black leading-8">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p>
                </Link>
              ))}
          </div>
        </nav>
        <nav aria-label="خدمات مرتبط" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-black">خدمات مرتبط</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(PERSIAN_SERVICES)
              .filter(([key]) => key !== slug)
              .map(([key, item]) => (
                <Link key={key} href={`/fa/services/${key}`} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-[#C9A35A]">
                  {item.shortTitle}
                </Link>
              ))}
          </div>
        </nav>
      </section>
    </main>
  );
}
