'use client';

import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const forthcoming = {
  en: [
    { title: 'Banking Discrimination and Financial Exclusion', category: 'Banking & Human Rights', desc: 'An analysis of the legal frameworks governing financial access, discrimination in banking and the rights of affected individuals under international and European law.' },
    { title: 'Cross-Border Compliance and Source of Funds', category: 'Compliance', desc: 'A practical guide for internationally mobile clients and professionals on structuring, documenting and defending source-of-funds and source-of-wealth positions.' },
    { title: 'Residency Planning for International Families', category: 'Immigration', desc: 'A strategic overview of European residency options for internationally mobile families, covering legal routes, investment structures and long-term planning considerations.' },
    { title: 'Investor Immigration and Legal Risk', category: 'Investment Immigration', desc: 'An assessment of legal risk in investment-based immigration programmes, including due diligence obligations, compliance requirements and source-of-funds documentation.' },
    { title: 'International Contracts and Private Client Protection', category: 'Commercial Law', desc: 'Guidance on structuring and reviewing international contracts to protect private clients, entrepreneurs and investors operating across multiple jurisdictions.' },
  ],
  fa: [
    { title: 'تبعیض بانکی و محرومیت مالی', category: 'بانکداری و حقوق بشر', desc: 'تحلیل چارچوب‌های حقوقی حاکم بر دسترسی مالی، تبعیض در بانکداری و حقوق افراد تحت تأثیر در چارچوب حقوق بین‌الملل و اروپایی.' },
    { title: 'انطباق بین‌المللی و منبع وجوه', category: 'انطباق', desc: 'راهنمای عملی برای موکلین و متخصصان متحرک بین‌المللی در زمینه ساختاردهی، مستندسازی و دفاع از موضع منبع وجوه و منبع ثروت.' },
    { title: 'برنامه‌ریزی اقامت برای خانواده‌های بین‌المللی', category: 'مهاجرت', desc: 'مروری استراتژیک بر گزینه‌های اقامت اروپایی برای خانواده‌های متحرک بین‌المللی، شامل مسیرهای حقوقی، ساختارهای سرمایه‌گذاری و ملاحظات برنامه‌ریزی بلندمدت.' },
    { title: 'مهاجرت سرمایه‌گذاری و ریسک حقوقی', category: 'مهاجرت سرمایه‌گذاری', desc: 'ارزیابی ریسک حقوقی در برنامه‌های مهاجرتی مبتنی بر سرمایه‌گذاری، شامل تعهدات بررسی دقیق، الزامات انطباق و مستندسازی منبع وجوه.' },
    { title: 'قراردادهای بین‌المللی و حمایت از موکلین خصوصی', category: 'حقوق تجاری', desc: 'راهنمای ساختاردهی و بررسی قراردادهای بین‌المللی برای حمایت از موکلین خصوصی، کارآفرینان و سرمایه‌گذارانی که در چندین حوزه قضایی فعالیت می‌کنند.' },
  ],
};

export default function Publications() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'انتشارات' : 'PUBLICATIONS'}
        title={isRTL ? 'انتشارات، تفسیر حقوقی و بینش‌های استراتژیک' : 'Publications, Legal Commentary and Strategic Insights'}
        subtitle={isRTL ? 'انتشارات، مقالات حقوقی و رهبری فکری PLUCO GROUP را در زمینه تبعیض بانکی، انطباق، مهاجرت، مشاوره موکلین خصوصی و امور حقوقی بین‌المللی مطالعه کنید.' : 'Explore PLUCO GROUP publications, legal articles and thought leadership on banking discrimination, compliance, immigration, private client advisory and cross-border legal affairs.'}
      />

      {/* Main Book */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
              {isRTL ? 'انتشار ویژه' : 'FEATURED PUBLICATION'}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 border border-gray-200 rounded-xl p-8">
              <div className="rounded-xl flex flex-col items-center justify-center p-8 text-center aspect-[3/4]" style={{ backgroundColor: '#071C3C' }}>
                <BookOpen className="w-10 h-10 mb-4" style={{ color: '#C9A35A' }} strokeWidth={1} />
                <p className="text-xl font-serif font-bold text-white leading-tight mb-2">SECOND CLASS CITIZEN</p>
                <div className="w-12 h-px my-3" style={{ backgroundColor: '#C9A35A' }} />
                <p className="text-xs" style={{ color: '#C9A35A' }}>REZA OSTAD</p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2" style={{ color: '#1E2430' }}>SECOND CLASS CITIZEN</h2>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'رضا استاد' : 'Reza Ostad'}
                  </p>
                  <p className="text-xs mb-6" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'وکیل بین‌المللی بانکداری، انطباق و حقوق بشر' : 'International Banking, Compliance and Human Rights Lawyer'}
                  </p>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL
                      ? 'کتاب «شهروند درجه دوم» تبعیض مالی، محرومیت بانکی و چالش‌های حقوقی افراد از حوزه‌های قضایی تحریم‌شده را بررسی می‌کند. این کتاب نشان می‌دهد چگونه انطباق بانکی، ملیت، حقوق بشر و دسترسی به خدمات مالی در جهان مدرن به طور فزاینده‌ای با هم تلاقی می‌یابند.'
                      : 'SECOND CLASS CITIZEN examines financial discrimination, banking exclusion and the legal challenges faced by individuals from sanctioned jurisdictions. The book explores how banking compliance, nationality, human rights and access to financial services increasingly intersect in the modern world.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(isRTL
                      ? ['زبان انگلیسی', 'جلد کاغذی', '۲۷۴ صفحه', 'قیمت: ۲۹ یورو']
                      : ['English language', 'Paperback', '274 pages', 'Price: 29 EUR']
                    ).map(detail => (
                      <span key={detail} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F1F5F9', color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{detail}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
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

      {/* Forthcoming */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
              {isRTL ? 'در دست انتشار' : 'FORTHCOMING'}
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'انتشارات و مقالات بیشتر' : 'Further Publications & Articles'}
            </h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(isRTL ? forthcoming.fa : forthcoming.en).map((pub, index) => (
              <motion.div key={pub.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow duration-300">
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-3" style={{ backgroundColor: '#FFF8E8', color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>{pub.category}</span>
                <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{pub.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{pub.desc}</p>
                <p className="text-xs italic" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'لینک انتشار به زودی اضافه می‌شود' : 'Publication link to be added'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
