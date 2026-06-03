'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, FileText, CheckCircle, Lock, Scale, Globe, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';

const problems = [
  { en: 'Bank account closure', fa: 'بستن حساب بانکی' },
  { en: 'Delayed onboarding', fa: 'تاخیر در راه‌اندازی' },
  { en: 'Nationality-based risk classification', fa: 'طبقه‌بندی ریسک بر اساس ملیت' },
  { en: 'Enhanced due diligence requests', fa: 'درخواست‌های بررسی دقیق تقویت‌شده' },
  { en: 'Source-of-funds reviews', fa: 'بررسی منبع وجوه' },
  { en: 'Source-of-wealth questions', fa: 'سؤالات منبع ثروت' },
  { en: 'Transfer delays for residence, citizenship, property, or business', fa: 'تاخیر در انتقال برای اقامت، تابعیت، ملک یا تجارت' },
];

const services = [
  {
    titleEn: 'Source-of-Funds Review',
    titleFa: 'بررسی منبع وجوه',
    descEn: 'Professional analysis and documentation of fund sources for banking, investment, or immigration purposes.',
    descFa: 'تجزیه‌وتحلیل و مستندسازی حرفه‌ای منابع وجوه برای اهداف بانکی، سرمایه‌گذاری یا مهاجرت.',
    Icon: FileText,
  },
  {
    titleEn: 'Source-of-Wealth Preparation',
    titleFa: 'تهیه منبع ثروت',
    descEn: 'Comprehensive wealth analysis for clients with complex international financial histories.',
    descFa: 'تجزیه‌وتحلیل جامع ثروت برای موکلینی که سوابق مالی بین‌المللی پیچیده دارند.',
    Icon: Scale,
  },
  {
    titleEn: 'Banking Correspondence Support',
    titleFa: 'پشتیبانی مکاتبات بانکی',
    descEn: 'Professional legal and compliance communication with banks and financial institutions.',
    descFa: 'ارتباط حقوقی و انطباقی حرفه‌ای با بانک‌ها و مؤسسات مالی.',
    Icon: MessageSquare,
  },
  {
    titleEn: 'Compliance Documentation',
    titleFa: 'مستندسازی انطباق',
    descEn: 'Preparation of KYC/AML-compliant banking files and regulatory documentation.',
    descFa: 'تهیه پرونده‌های بانکی منطبق با KYC/AML و مستندسازی نظارتی.',
    Icon: Lock,
  },
  {
    titleEn: 'Cross-Border Transaction Review',
    titleFa: 'بررسی معاملات بین‌المللی',
    descEn: 'Strategic review and structuring of international fund transfers and cross-border payments.',
    descFa: 'بررسی استراتژیک و ساختاردهی انتقال وجوه بین‌المللی و پرداخت‌های فرامرزی.',
    Icon: Globe,
  },
  {
    titleEn: 'Private Client Strategy',
    titleFa: 'استراتژی موکل خصوصی',
    descEn: 'Comprehensive strategy for navigating banking requirements and regulatory scrutiny.',
    descFa: 'استراتژی جامع برای پیمایش الزامات بانکی و بررسی نظارتی.',
    Icon: Shield,
  },
];

const targetClients = [
  { en: 'International families relocating to Europe', fa: 'خانواده‌های بین‌المللی مهاجر به اروپا' },
  { en: 'Investors and entrepreneurs', fa: 'سرمایه‌گذاران و کارآفرینان' },
  { en: 'Citizenship and residency applicants', fa: 'متقاضیان تابعیت و اقامت' },
  { en: 'Clients with complex nationality history', fa: 'موکلینی با سوابق ملیت پیچیده' },
  { en: 'Clients facing banking discrimination', fa: 'موکلینی که با تبعیض بانکی مواجه هستند' },
  { en: 'Clients needing pre-transfer documentation', fa: 'موکلینی که نیاز به مستندسازی قبل از انتقال دارند' },
];

const steps = [
  { num: '01', titleEn: 'Private Enquiry', titleFa: 'استعلام خصوصی', descEn: 'Confidential submission of your banking or compliance matter.', descFa: 'ارسال محرمانه موضوع بانکی یا انطباق شما.' },
  { num: '02', titleEn: 'Initial Compliance Review', titleFa: 'بررسی انطباق اولیه', descEn: 'Assessment of your situation, banking history, and documentation needs.', descFa: 'ارزیابی موقعیت شما، سوابق بانکی و نیاز‌های مستندسازی.' },
  { num: '03', titleEn: 'Document & Risk Assessment', titleFa: 'ارزیابی اسناد و ریسک', descEn: 'Analysis of your financial documents and risk profile.', descFa: 'تجزیه‌وتحلیل اسناد مالی شما و پروفایل ریسک.' },
  { num: '04', titleEn: 'Strategy Consultation', titleFa: 'مشاوره استراتژی', descEn: 'Discussion of options, next steps, and engagement terms.', descFa: 'بحث درباره گزینه‌ها، مراحل بعدی و شرایط تعهد.' },
  { num: '05', titleEn: 'Formal Engagement', titleFa: 'تعهد رسمی', descEn: 'If appropriate, formal engagement to execute strategy.', descFa: 'در صورت مناسب بودن، تعهد رسمی برای اجرای استراتژی.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

export default function Banking() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <PageHero
        eyebrow={isRTL ? 'مشاوره بانکی و انطباق' : 'BANKING & COMPLIANCE'}
        title={isRTL ? 'مشاوره بانکی و انطباق برای موکلین خصوصی بین‌المللی' : 'Banking & Compliance Advisory for International Private Clients'}
        subtitle={isRTL
          ? 'پشتیبانی حقوقی و انطباقی استراتژیک برای موکلینی که با محدودیت‌های بانکی، بستن حساب، بررسی منبع وجوه و بررسی مالی بین‌المللی مواجه هستند.'
          : 'Strategic legal and compliance support for clients facing banking restrictions, account closures, source-of-funds reviews, and cross-border financial scrutiny.'}
      />

      {/* Hero CTAs */}
      <section className="py-12" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/enquire"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              <span style={{ fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'استعلام خصوصی' : 'Start Private Enquiry'}
              </span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg border transition-all hover:bg-white/10"
              style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
            >
              <span style={{ fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'درخواست مشاوره محرمانه' : 'Request Confidential Consultation'}
              </span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
            >
              {isRTL ? 'چالش‌های بانکی' : 'BANKING CHALLENGES'}
            </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'چه مسائلی را موکلین بین‌المللی با آن مواجه هستند' : 'What International Clients Face'}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {problems.map((problem, i) => (
              <motion.div
                key={problem.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#C9A35A' }} />
                  <p className="text-sm" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? problem.fa : problem.en}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How PLUCO GROUP Assists */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {isRTL ? 'خدمات' : 'HOW WE ASSIST'} </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'خدمات مشاوره بانکی و انطباق' : 'Banking & Compliance Advisory Services'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.titleEn}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -8 }}
                className="flex flex-col p-7 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ backgroundColor: '#FFF8E8' }}
                >
                  <service.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </motion.div>
                <h3
                  className="text-sm font-bold mb-2 leading-snug"
                  style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? service.titleFa : service.titleEn}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? service.descFa : service.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
            >
              {isRTL ? 'موکلین' : 'WHO WE SERVE'} </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold tracking-wide mb-5"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'این خدمات برای کی است' : 'Who This Service Is For'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {targetClients.map((client, i) => (
              <motion.div
                key={client.en}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-white"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                <p className="text-sm" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? client.fa : client.en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {isRTL ? 'فرایند' : 'THE PROCESS'} </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'مسیر استعلام تا اجرا' : 'From Enquiry to Engagement'}
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
                  style={{ backgroundColor: '#FFF8E8', color: '#C9A35A' }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pt-2">
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
                  >
                    {isRTL ? step.titleFa : step.titleEn}
                  </h3>
                  <p className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? step.descFa : step.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Note */}
      <section className="py-16 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: '#FAFBFC' }}
          >
            <div className="flex gap-4">
              <Shield className="w-6 h-6 flex-shrink-0" style={{ color: '#C9A35A' }} />
              <div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
                >
                  <span style={{ fontWeight: 'bold', color: '#1E2430' }}>
                    {isRTL ? 'اهم نکته: ' : 'Important Note: '}
                  </span>
                  {isRTL
                    ? 'PLUCO GROUP تضمین افتتاح حساب بانکی، حفظ حساب، تأیید انتقال، تأیید مهاجرت، تأیید تابعیت یا هیچ تصمیم دولتی یا نهاد مالی را نمی‌دهد. تمام خدمات منوط به بررسی شرایط، بررسی‌های انطباقی، بررسی تعارض منافع و تعهد رسمی است.'
                    : 'PLUCO GROUP does not guarantee bank account opening, bank account retention, transfer approval, immigration approval, citizenship approval, or any government or financial institution decision. All services are subject to eligibility review, compliance checks, conflict checks, and formal engagement.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
              className="text-2xl font-serif font-bold mb-4"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'قبل از درخواست، انتقال یا سرمایه‌گذاری آماده شوید' : 'Prepare Before You Apply, Transfer, or Invest'}
            </h3>
            <p
              className="text-sm mb-8"
              style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL
                ? 'مشاوره بانکی و انطباق استراتژیک برای موکلین بین‌المللی'
                : 'Strategic banking and compliance advisory for international private clients'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/enquire"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                  style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                >
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'استعلام موکل خصوصی' : 'Start Private Client Enquiry'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg border transition-all hover:bg-gray-50"
                  style={{ borderColor: '#071C3C', color: '#071C3C' }}
                >
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'تماس با PLUCO GROUP' : 'Contact PLUCO GROUP'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
