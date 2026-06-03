'use client';

import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';

const publicationsByCategory = {
  en: {
    'Books & Long-Form Publications': [
      {
        title: 'Second Class Citizen',
        author: 'Reza Ostad',
        role: 'International Banking, Compliance and Human Rights Lawyer',
        desc: 'Examines financial discrimination, banking exclusion and the legal challenges faced by individuals from sanctioned jurisdictions. The book explores how banking compliance, nationality, human rights and access to financial services increasingly intersect in the modern world.',
        details: ['English language', 'Paperback', '274 pages', 'Price: 29 EUR'],
        status: 'available',
        amazonLink: 'https://www.amazon.com/Second-Class-Citizen-Financial-Discrimination/s?k=second+class+citizen+reza+ostad',
      },
      {
        title: 'Banking Discrimination and Financial Exclusion',
        desc: 'A comprehensive analysis of the legal frameworks governing financial access, discrimination in banking and the rights of affected individuals under international and European law.',
        status: 'coming-soon',
        comingSoonText: 'Publication access being prepared by PLUCO GROUP.',
      },
    ],
    'Legal Commentary': [
      {
        title: 'Cross-Border Compliance and Source of Funds',
        desc: 'A practical guide for internationally mobile clients and professionals on structuring, documenting and defending source-of-funds and source-of-wealth positions.',
        status: 'coming-soon',
        comingSoonText: 'Legal commentary access coming soon.',
      },
      {
        title: 'International Contracts and Private Client Protection',
        desc: 'Guidance on structuring and reviewing international contracts to protect private clients, entrepreneurs and investors operating across multiple jurisdictions.',
        status: 'coming-soon',
        comingSoonText: 'Commentary publication currently in preparation.',
      },
    ],
    'Private Client Briefings': [
      {
        title: 'Residency Planning for International Families',
        desc: 'A strategic overview of European residency options for internationally mobile families, covering legal routes, investment structures and long-term planning considerations.',
        status: 'coming-soon',
        comingSoonText: 'Private client briefing access coming soon.',
      },
    ],
    'Banking & Compliance Insights': [
      {
        title: 'Investor Immigration and Legal Risk',
        desc: 'An assessment of legal risk in investment-based immigration programmes, including due diligence obligations, compliance requirements and source-of-funds documentation.',
        status: 'coming-soon',
        comingSoonText: 'Compliance insight publication being prepared.',
      },
    ],
    'Immigration & Mobility Notes': [
      {
        title: 'European Residency & Mobility Strategy',
        desc: 'Strategic notes on European residency pathways, mobility planning and long-term relocation strategies for internationally mobile clients and families.',
        status: 'coming-soon',
        comingSoonText: 'Immigration briefing access will be available soon.',
      },
    ],
  },
  fa: {
    'کتاب‌ها و انتشارات طولانی': [
      {
        title: 'شهروند درجه دوم',
        author: 'رضا استاد',
        role: 'وکیل بین‌المللی بانکداری، انطباق و حقوق بشر',
        desc: 'تبعیض مالی، محرومیت بانکی و چالش‌های حقوقی افراد از حوزه‌های قضایی تحریم‌شده را بررسی می‌کند. این کتاب نشان می‌دهد چگونه انطباق بانکی، ملیت، حقوق بشر و دسترسی به خدمات مالی در جهان مدرن به طور فزاینده‌ای با هم تلاقی می‌یابند.',
        details: ['زبان انگلیسی', 'جلد کاغذی', '۲۷۴ صفحه', 'قیمت: ۲۹ یورو'],
        status: 'available',
        amazonLink: 'https://www.amazon.com/Second-Class-Citizen-Financial-Discrimination/s?k=second+class+citizen+reza+ostad',
      },
      {
        title: 'تبعیض بانکی و محرومیت مالی',
        desc: 'تجزیه‌وتحلیل جامع چارچوب‌های حقوقی حاکم بر دسترسی مالی، تبعیض در بانکداری و حقوق افراد تحت تأثیر در چارچوب حقوق بین‌الملل و اروپایی.',
        status: 'coming-soon',
        comingSoonText: 'دسترسی به انتشار توسط PLUCO GROUP در حال آماده‌سازی است.',
      },
    ],
    'تفسیر حقوقی': [
      {
        title: 'انطباق بین‌المللی و منبع وجوه',
        desc: 'راهنمای عملی برای موکلین و متخصصان متحرک بین‌المللی در زمینه ساختاردهی، مستندسازی و دفاع از موضع منبع وجوه و منبع ثروت.',
        status: 'coming-soon',
        comingSoonText: 'دسترسی به تفسیر حقوقی به زودی در دسترس خواهد بود.',
      },
      {
        title: 'قراردادهای بین‌المللی و حمایت از موکلین خصوصی',
        desc: 'راهنمای ساختاردهی و بررسی قراردادهای بین‌المللی برای حمایت از موکلین خصوصی، کارآفرینان و سرمایه‌گذارانی که در چندین حوزه قضایی فعالیت می‌کنند.',
        status: 'coming-soon',
        comingSoonText: 'انتشار تفسیر در حال آماده‌سازی است.',
      },
    ],
    'بریفینگ‌های موکل خصوصی': [
      {
        title: 'برنامه‌ریزی اقامت برای خانواده‌های بین‌المللی',
        desc: 'مروری استراتژیک بر گزینه‌های اقامت اروپایی برای خانواده‌های متحرک بین‌المللی، شامل مسیرهای حقوقی، ساختارهای سرمایه‌گذاری و ملاحظات برنامه‌ریزی بلندمدت.',
        status: 'coming-soon',
        comingSoonText: 'دسترسی به بریفینگ موکل خصوصی به زودی در دسترس خواهد بود.',
      },
    ],
    'بینش‌های بانکی و انطباق': [
      {
        title: 'مهاجرت سرمایه‌گذاری و ریسک حقوقی',
        desc: 'ارزیابی ریسک حقوقی در برنامه‌های مهاجرتی مبتنی بر سرمایه‌گذاری، شامل تعهدات بررسی دقیق، الزامات انطباق و مستندسازی منبع وجوه.',
        status: 'coming-soon',
        comingSoonText: 'انتشار بینش انطباق در حال آماده‌سازی است.',
      },
    ],
    'یادداشت‌های مهاجرت و تحرک': [
      {
        title: 'استراتژی اقامت و تحرک اروپایی',
        desc: 'یادداشت‌های استراتژیک درباره مسیرهای اقامت اروپایی، برنامه‌ریزی تحرک و استراتژی‌های مهاجرت بلندمدت برای موکلین و خانواده‌های متحرک بین‌المللی.',
        status: 'coming-soon',
        comingSoonText: 'دسترسی به یادداشت مهاجرت به زودی در دسترس خواهد بود.',
      },
    ],
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

export default function Publications() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const categories = isRTL ? publicationsByCategory.fa : publicationsByCategory.en;

  // Extract the first publication (Second Class Citizen) for featured section
  const allPubs = Object.values(categories).flat();
  const featuredPub = allPubs.find(p => p.status === 'available') || allPubs[0];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'انتشارات' : 'PUBLICATIONS'}
        title={isRTL ? 'انتشارات، تفسیر حقوقی و بینش‌های استراتژیک' : 'Publications, Legal Commentary and Strategic Insights'}
        subtitle={isRTL ? 'انتشارات و رهبری فکری PLUCO GROUP را در زمینه تبعیض بانکی، انطباق، مهاجرت و امور حقوقی بین‌المللی مطالعه کنید.' : 'Explore PLUCO GROUP publications and thought leadership on banking discrimination, compliance, immigration and cross-border legal affairs.'}
      />

      {/* Featured Publication */}
      {featuredPub && 'amazonLink' in featuredPub && (
        <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                {isRTL ? 'انتشار ویژه' : 'FEATURED PUBLICATION'}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 border border-gray-200 rounded-xl p-8">
                <div className="rounded-xl flex flex-col items-center justify-center p-8 text-center aspect-[3/4]" style={{ backgroundColor: '#071C3C' }}>
                  <BookOpen className="w-10 h-10 mb-4" style={{ color: '#C9A35A' }} strokeWidth={1} />
                  <p className="text-xl font-serif font-bold text-white leading-tight mb-2">{isRTL ? 'شهروند درجه دوم' : 'SECOND CLASS CITIZEN'}</p>
                  <div className="w-12 h-px my-3" style={{ backgroundColor: '#C9A35A' }} />
                  <p className="text-xs" style={{ color: '#C9A35A' }}>
                    {isRTL ? (featuredPub as any).author || 'REZA OSTAD' : 'REZA OSTAD'}
                  </p>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2" style={{ color: '#1E2430' }}>
                      {isRTL ? 'شهروند درجه دوم' : 'SECOND CLASS CITIZEN'}
                    </h2>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? (featuredPub as any).author || 'رضا استاد' : 'Reza Ostad'}
                    </p>
                    <p className="text-xs mb-6" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? (featuredPub as any).role || 'وکیل بین‌المللی بانکداری، انطباق و حقوق بشر' : 'International Banking, Compliance and Human Rights Lawyer'}
                    </p>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>
                      {featuredPub.desc}
                    </p>
                    {(featuredPub as any).details && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {(featuredPub as any).details.map((detail: string) => (
                          <span key={detail} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F1F5F9', color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                            {detail}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={(featuredPub as any).amazonLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                      <span style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'خرید از آمازون' : 'Buy on Amazon'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href="mailto:info@plucogroup.com?subject=Second Class Citizen Book Order" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg border transition-all hover:bg-gray-50" style={{ borderColor: '#071C3C', color: '#071C3C' }}>
                      <span style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'سفارش از طریق PLUCO GROUP' : 'Order via PLUCO GROUP'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Publications by Category */}
      {Object.entries(categories).map(([categoryName, pubs], catIndex) => (
        <section key={categoryName} className={catIndex % 2 === 0 ? 'py-20 bg-white' : 'py-20'} style={catIndex % 2 === 1 ? { backgroundColor: '#F8F9FA' } : {}} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                {categoryName}
              </h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-0.5 mt-3" style={{ backgroundColor: '#C9A35A' }} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pubs.map((pub, index) => (
                <motion.div
                  key={pub.title}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="flex flex-col rounded-xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  style={{ backgroundColor: catIndex % 2 === 1 ? '#FFFFFF' : '#F8F9FA' }}
                >
                  <h3 className="text-sm font-bold mb-3 leading-snug" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {pub.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-5 flex-grow" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {pub.desc}
                  </p>

                  {pub.status === 'available' ? (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9A35A' }} />
                      <span className="text-xs font-medium" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'در دسترس' : 'Available Now'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                      <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                        {pub.comingSoonText}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-2xl md:text-3xl font-serif font-bold mb-4"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'نیاز به مشاوره درباره یکی از این موضوعات دارید؟' : 'Need Advice on One of These Topics?'}
            </h3>
            <p
              className="text-sm mb-8 leading-relaxed max-w-xl mx-auto"
              style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL
                ? 'مشاوره قانونی و استراتژیک محرمانه از PLUCO GROUP درباره بانکداری، انطباق، مهاجرت و امور حقوقی بین‌المللی'
                : 'Confidential legal and strategic advice from PLUCO GROUP on banking, compliance, immigration and cross-border legal matters.'}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/enquire"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                <span style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'درخواست مشاوره محرمانه' : 'Request Confidential Consultation'}
                </span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
