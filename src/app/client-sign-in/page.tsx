'use client';

import { motion } from 'framer-motion';
import { Lock, FileText, MessageSquare, DollarSign, ArrowRight, Shield } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const features = [
  {
    titleEn: 'Case Status Updates',
    titleFa: 'به‌روزرسانی‌های وضعیت پرونده',
    descEn: 'Real-time access to case progress, milestones, and next steps.',
    descFa: 'دسترسی به‌موقع به پیشرفت پرونده، نقاط عطف و مراحل بعدی.',
    Icon: FileText,
  },
  {
    titleEn: 'Secure Document Exchange',
    titleFa: 'تبادل اسناد امن',
    descEn: 'Upload and download case documents with encrypted security.',
    descFa: 'آپلود و دانلود اسناد پرونده با امنیت رمزگذاری شده.',
    Icon: Lock,
  },
  {
    titleEn: 'Confidential Messages',
    titleFa: 'پیام‌های محرمانه',
    descEn: 'Direct, secure communication with your case team.',
    descFa: 'ارتباط مستقیم و امن با تیم پرونده شما.',
    Icon: MessageSquare,
  },
  {
    titleEn: 'Invoice & Appointment Access',
    titleFa: 'دسترسی به فاکتور و قرارملاقات',
    descEn: 'View invoices, track payments, and manage appointment times.',
    descFa: 'مشاهده فاکتورها، پیگیری پرداخت‌ها و مدیریت زمان‌های قرارملاقات.',
    Icon: DollarSign,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

export default function ClientSignIn() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'دسترسی ایمن' : 'SECURE CLIENT ACCESS'}
        title={isRTL ? 'دسترسی به درگاه موکل' : 'Client Portal Access'}
        subtitle={isRTL
          ? 'درگاه دریافت اطلاعات محرمانه برای موکلان: به‌روزرسانی‌های پرونده، تبادل اسناد، دسترسی به فاکتور و ارتباط محرمانه'
          : 'A secure private client portal for case updates, document exchange, invoice access, and confidential communication.'}
      />

      {/* Main Content */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL
                ? 'درگاه موکل امن PLUCO GROUP اکنون برای موکلین فعلی در دسترس است. درگاه از به‌روزرسانی‌های وضعیت پرونده، تبادل اسناد، دسترسی به فاکتورها، اطلاعات قرارملاقات و ارتباط محرمانه با تیم پرونده پشتیبانی می‌کند.'
                : 'PLUCO GROUP\'s secure client portal is now available for existing clients. The portal supports case status updates, document exchange, invoice access, appointment information, and confidential communication with your case team.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                  style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                >
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'درخواست دسترسی درگاه' : 'Request Portal Access'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/enquire"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold rounded-lg border transition-all hover:bg-gray-50"
                  style={{ borderColor: '#071C3C', color: '#071C3C' }}
                >
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'تماس با تیم پرونده' : 'Contact Case Team'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Features */}
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
              {isRTL ? 'ویژگی‌های درگاه' : 'PORTAL FEATURES'}
            </p>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold tracking-wide"
              style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'اکنون در دسترس' : 'Now Active'}
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

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleEn}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -8, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
                className="relative flex flex-col p-6 rounded-lg border-2 bg-white hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: '#C9A35A' }}
              >
                {/* Active Badge */}
                <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ backgroundColor: '#16A34A', color: '#FFFFFF' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FFFFFF' }}></span>
                    {isRTL ? 'فعال' : 'LIVE'}
                  </span>
                </div>
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ backgroundColor: '#FFF8E8' }}
                >
                  <feature.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </motion.div>
                <h3
                  className="text-sm font-bold mb-3 leading-snug"
                  style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? feature.titleFa : feature.titleEn}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
                >
                  {isRTL ? feature.descFa : feature.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy Note */}
      <section className="py-16 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex gap-4 p-6 rounded-lg border border-gray-200"
            style={{ backgroundColor: '#FAFBFC' }}
          >
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
            <div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
              >
                <span style={{ fontWeight: 'bold', color: '#1E2430' }}>
                  {isRTL ? 'سلب مسئولیت امنیتی: ' : 'Security & Privacy: '}
                </span>
                {isRTL
                  ? 'برای دلایل امنیتی، دسترسی تنها برای موکلین تأیید شده پس از تعهد رسمی و بررسی هویت در دسترس است.'
                  : 'For security reasons, access is available only to verified clients after formal engagement and identity review.'}
              </p>
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
              {isRTL ? 'درگاه خود را فعال کنید' : 'Activate Your Portal'}
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL
                ? 'اگر موکل فعلی PLUCO GROUP هستید، برای دسترسی به درگاه امن و تمام ویژگی‌های آن درخواست کنید.'
                : 'If you are a current PLUCO GROUP client, request access now to start using your secure portal with case updates, document exchange, invoices, and confidential messaging.'}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                <span style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'درخواست دسترسی' : 'Request Access'}
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
