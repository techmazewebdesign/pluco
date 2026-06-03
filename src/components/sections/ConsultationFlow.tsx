'use client';

import { motion } from 'framer-motion';
import { MessageSquare, FileCheck, Users, Briefcase, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    number: '01',
    titleEn: 'Confidential Enquiry',
    titleFa: 'استعلام محرمانه',
    descEn: 'Submit your matter through our secure enquiry form. All information is held in strict confidence.',
    descFa: 'موضوع خود را از طریق فرم استعلام امن ما ارسال کنید. تمام اطلاعات با رازداری کامل نگه داشته می‌شوند.',
    Icon: MessageSquare,
  },
  {
    number: '02',
    titleEn: 'Initial Assessment',
    titleFa: 'ارزیابی اولیه',
    descEn: 'Our team reviews your matter for conflict, eligibility, and strategic fit. We respond within 24 hours.',
    descFa: 'تیم ما موضوع شما را برای تعارض منافع، شرایط و تناسب استراتژیکی بررسی می‌کند. ما در عرض 24 ساعت پاسخ دهیم.',
    Icon: FileCheck,
  },
  {
    number: '03',
    titleEn: 'Confidential Consultation',
    titleFa: 'مشاوره محرمانه',
    descEn: 'We discuss your legal position, options and strategy. No pressure. Full understanding before commitment.',
    descFa: 'ما موضع حقوقی، گزینه‌ها و استراتژی شما را بررسی می‌کنیم. بدون فشار. درک کامل قبل از تعهد.',
    Icon: Users,
  },
  {
    number: '04',
    titleEn: 'Engagement & Execution',
    titleFa: 'تعهد و اجرا',
    descEn: 'If we proceed together, we execute the agreed scope with coordinated, documented action across all jurisdictions.',
    descFa: 'اگر ما با هم پیش برویم، محدوده توافق شده را با اقدام هماهنگ و مستندسازی شده در تمام حوزه‌های قضایی اجرا می‌کنیم.',
    Icon: Briefcase,
  },
  {
    number: '05',
    titleEn: 'Outcome & Relationship',
    titleFa: 'نتیجه و رابطه',
    descEn: 'We deliver the outcome. Ongoing support, updates and strategic advice continue as your matter requires.',
    descFa: 'ما نتیجه را تحویل می‌دهیم. پشتیبانی مستمر، به‌روزرسانی‌ها و مشاوره استراتژیکی همانطور که موضوع شما نیاز دارد ادامه می‌یابند.',
    Icon: CheckCircle,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
  },
};

export default function ConsultationFlow() {
  const { isRTL } = useLanguage();

  return (
    <section className="py-24" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
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
            style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {isRTL ? 'فرایند ما' : 'OUR PROCESS'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-bold tracking-wide mb-5"
            style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL ? 'مسیر مشاوره از ابتدا تا انجام' : 'The Consultation Path: From Enquiry to Outcome'}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mb-5"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <p
            className="text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL
              ? 'راهنمای شفاف، گام به گام، برای نحوه تعامل و تعهد ما با موکلان'
              : 'Clear, step-by-step guidance to how we engage and commit to clients'}
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={itemVariants} whileHover={{ x: isRTL ? -8 : 8 }} className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Number & Icon */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#FFF8E8', color: '#C9A35A' }}
                >
                  {step.number}
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: '2px solid #C9A35A' }}
                >
                  <step.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
                >
                  {isRTL ? step.titleFa : step.titleEn}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
                >
                  {isRTL ? step.descFa : step.descEn}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute left-1/2 md:left-auto md:relative w-full md:w-auto justify-center">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                    className="w-1 h-20 md:h-1 md:w-20 origin-top"
                    style={{ backgroundColor: '#C9A35A' }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p
            className="text-sm mb-6"
            style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL ? 'آمادگی برای شروع؟' : 'Ready to get started?'}
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded transition-all hover:brightness-110"
            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
          >
            <span style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
              {isRTL ? 'استعلام محرمانه' : 'Submit Confidential Enquiry'}
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
