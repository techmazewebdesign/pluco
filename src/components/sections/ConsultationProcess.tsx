'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    num: '01',
    titleEn: 'Submit Private Enquiry',
    titleFa: 'ارسال استعلام خصوصی',
    descEn: 'Share your situation, nationality, residence country, preferred service, and contact details.',
    descFa: 'موقعیت خود، ملیت، کشور اقامت، خدمت ترجیحی و جزئیات تماس را به اشتراک بگذارید.',
  },
  {
    num: '02',
    titleEn: 'Initial Eligibility & Compliance Review',
    titleFa: 'بررسی شرایط و انطباق اولیه',
    descEn: 'PLUCO GROUP reviews the basic information to identify whether the matter appears suitable for further consultation.',
    descFa: 'PLUCO GROUP اطلاعات پایه‌ای را بررسی می‌کند تا مشخص کند که آیا موضوع برای مشاوره بیشتر مناسب است.',
  },
  {
    num: '03',
    titleEn: 'Confidential Consultation',
    titleFa: 'مشاوره محرمانه',
    descEn: 'A private consultation is arranged to discuss the facts, risks, documents, and possible legal or strategic options.',
    descFa: 'مشاوره خصوصی برای بحث درباره واقعیات، ریسک‌ها، اسناد و گزینه‌های حقوقی یا استراتژیکی ممکن برگزار می‌شود.',
  },
  {
    num: '04',
    titleEn: 'Strategy Proposal',
    titleFa: 'پیشنهاد استراتژی',
    descEn: 'Where appropriate, PLUCO GROUP prepares a structured proposal outlining scope, process, expected documentation, and next steps.',
    descFa: 'در صورت لزوم، PLUCO GROUP یک پیشنهاد ساختار‌یافته تهیه می‌کند که محدوده، فرایند، اسناد مورد انتظار و مراحل بعدی را شرح می‌دهد.',
  },
  {
    num: '05',
    titleEn: 'Formal Engagement',
    titleFa: 'تعهد رسمی',
    descEn: 'Work begins only after conflict checks, compliance review, agreement on scope, and formal engagement.',
    descFa: 'کار تنها پس از بررسی تعارض منافع، بررسی انطباق، توافق بر محدوده و تعهد رسمی شروع می‌شود.',
  },
];

export default function ConsultationProcess() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <section className="pluco-home-process py-24 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {isRTL ? 'فرایند مشاوره' : 'OUR PROCESS'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
            style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
          >
            {isRTL ? 'فرایند مشاوره موکل خصوصی' : 'Private Client Consultation Process'}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mt-4"
            style={{ backgroundColor: '#C9A35A' }}
          />
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 100, damping: 15 }}
              className="pluco-home-panel flex gap-6 items-start p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50"
            >
              {/* Step Number */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
                style={{ backgroundColor: '#FFF8E8', color: '#C9A35A' }}
              >
                {step.num}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? step.titleFa : step.titleEn}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? step.descFa : step.descEn}
                </p>
              </div>

              {/* Checkmark Icon */}
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#C9A35A' }} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center pt-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/enquire"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <span style={{ fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'استعلام موکل خصوصی' : 'Start Private Client Enquiry'}
              </span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
