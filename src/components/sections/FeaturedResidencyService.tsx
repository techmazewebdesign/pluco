'use client';

/**
 * Homepage "featured product" block for the Spain Digital Nomad Visa page — this is a
 * priority service that should read as a distinct promoted offer, not just another card
 * buried in the general Services grid. Dark navy/gold treatment (matching CTA-style
 * sections elsewhere on the site) makes it visually stand apart from the white Services
 * section around it.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, SearchCheck, FileText, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PrivateEnquiryFormModal from '@/components/shared/PrivateEnquiryFormModal';

const NAVY = '#071C3C';
const NAVY_DEEP = '#051530';
const GOLD = '#C9A35A';
const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

const SERVICE_NAME = 'Spain Digital Nomad Visa / Remote Residency Support';

const points = [
  {
    Icon: SearchCheck,
    en: { title: 'Eligibility review', description: 'Initial review of your situation against current Spanish requirements.' },
    fa: { title: 'بررسی واجد شرایط بودن', description: 'بررسی اولیه شرایط شما بر اساس الزامات فعلی اسپانیا.' },
  },
  {
    Icon: FileText,
    en: { title: 'Document preparation', description: 'Guidance on the file, records, and supporting material you may need.' },
    fa: { title: 'آماده‌سازی مدارک', description: 'راهنمایی درباره پرونده، سوابق و مستندات پشتیبان مورد نیاز شما.' },
  },
  {
    Icon: UserCheck,
    en: { title: 'Advisor handoff', description: 'Your case is reviewed before any formal application step is confirmed.' },
    fa: { title: 'انتقال به مشاور', description: 'پرونده شما پیش از تأیید هرگونه اقدام رسمی بررسی می‌شود.' },
  },
];

export default function FeaturedResidencyService() {
  const { isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copy = isRTL
    ? {
        eyebrow: 'خدمت ویژه اقامت',
        headline: 'پشتیبانی ویزای دیجیتال نومد اسپانیا',
        sub: 'برای متخصصان ریموت، فریلنسرها، کارآفرینان و خانواده‌های بین‌المللی که اسپانیا را برای اقامت بررسی می‌کنند، PLUCO GROUP به‌صورت ساختاریافته در بررسی شرایط، آماده‌سازی مدارک و برنامه‌ریزی مرحله بعدی همراه شماست.',
        disclaimer: 'اطلاعات اولیه جایگزین مشاوره حقوقی نیست. خدمات مشمول بررسی واجد شرایط بودن، قوانین قابل اجرا و تعهد رسمی است.',
        primary: 'مشاهده پشتیبانی اقامت اسپانیا',
        secondary: 'درخواست ارزیابی خصوصی',
      }
    : {
        eyebrow: 'FEATURED RESIDENCY SERVICE',
        headline: 'Spain Digital Nomad Visa Support',
        sub: 'For remote professionals, founders, freelancers, and internationally mobile families considering Spain, Pluco Group provides structured support to understand requirements, prepare your file, and move forward with professional review.',
        disclaimer: 'Initial information does not replace legal advice. Services are subject to eligibility review, applicable law, and formal engagement.',
        primary: 'Explore Spain residency support',
        secondary: 'Request private assessment',
      };

  return (
    <section className="relative overflow-hidden py-20 md:py-24" style={{ background: `radial-gradient(120% 100% at 85% 0%, ${NAVY} 0%, ${NAVY_DEEP} 65%, #030d24 100%)` }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(50% 60% at 15% 30%, rgba(201,163,90,0.12) 0%, transparent 70%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2.5"
            style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            <span className="inline-block w-6 h-px" style={{ backgroundColor: GOLD }} />
            {copy.eyebrow}
          </p>

          <h2
            className="text-2xl md:text-3xl xl:text-4xl font-serif text-white leading-tight mb-5 max-w-3xl"
            style={{ fontFamily: isRTL ? ff : undefined }}
          >
            {copy.headline}
          </h2>

          <p
            className="text-sm md:text-base leading-relaxed mb-10 max-w-2xl"
            style={{ color: '#CBD5E0', fontFamily: isRTL ? ff : undefined }}
          >
            {copy.sub}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {points.map((point, i) => {
              const p = isRTL ? point.fa : point.en;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex sm:flex-col items-start gap-3 sm:gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1.5px solid ${GOLD}` }}
                  >
                    <point.Icon className="w-4.5 h-4.5" style={{ color: GOLD }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF', fontFamily: isRTL ? ff : undefined }}>
                      <span className="opacity-60 mr-1">{i + 1}.</span>{p.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8A93A6', fontFamily: isRTL ? ff : undefined }}>{p.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Link
                href="/spain-digital-nomad-visa"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg transition-colors hover:brightness-110"
                style={{ backgroundColor: GOLD, color: NAVY, fontFamily: isRTL ? ff : undefined }}
              >
                {copy.primary}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium rounded-lg border transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#FFFFFF', fontFamily: isRTL ? ff : undefined }}
            >
              {copy.secondary}
            </motion.button>
          </div>

          <p className="text-xs leading-relaxed max-w-xl" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            {copy.disclaimer}
          </p>
        </motion.div>
      </div>

      <PrivateEnquiryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={SERVICE_NAME}
      />
    </section>
  );
}
