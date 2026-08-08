'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const contactMethods = [
  {
    titleEn: 'Email',
    titleFa: 'ایمیل',
    descEn: 'Send a confidential enquiry. We respond within 24 hours on business days.',
    descFa: 'یک استعلام محرمانه ارسال کنید. ما در عرض 24 ساعت در روزهای کاری پاسخ می‌دهیم.',
    Icon: Mail,
    href: 'mailto:info@plucogroup.com',
    buttonEn: 'Send Email',
    buttonFa: 'ارسال ایمیل',
  },
  {
    titleEn: 'WhatsApp',
    titleFa: 'واتس‌اپ',
    descEn: 'Instant messaging. Discreet and secure. Perfect for first contact.',
    descFa: 'پیام فوری. محرمانه و امن. ایده‌آل برای تماس اول.',
    Icon: MessageCircle,
    href: 'https://wa.me/48730962085?text=Hello%20PLUCO%20GROUP%2C%20I%20would%20like%20to%20discuss%20a%20confidential%20matter',
    buttonEn: 'WhatsApp Us',
    buttonFa: 'واتس اپ بزنید',
  },
  {
    titleEn: 'Book a Consultation',
    titleFa: 'رزرو مشاوره',
    descEn: 'Schedule a confidential conversation with our team. Flexible times available.',
    descFa: 'یک گفتگوی محرمانه با تیم ما زمان‌بندی کنید. اوقات انعطاف‌پذیری موجود است.',
    Icon: Calendar,
    href: '/contact',
    buttonEn: 'Schedule Now',
    buttonFa: 'رزرو کنید',
  },
];

export default function DiscreetContact() {
  const { isRTL } = useLanguage();

  return (
    <section className="py-24 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
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
            {isRTL ? 'تماس محرمانه' : 'DISCREET FIRST CONTACT'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-bold tracking-wide mb-5"
            style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL ? 'راهی که برای شما مناسب است' : 'How You Prefer to Connect'}
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
              ? 'رابطه برقرار کنید به روشی که برای شما راحت است. ایمیل، واتس‌اپ یا مشاوره رسمی. ما برای شنیدن آمادگی داریم.'
              : 'Connect in the way that works for you. Email, WhatsApp, or a formal consultation. We\'re ready to listen.'}
          </p>
        </motion.div>

        {/* Contact Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.href}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.6 } }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -8 }}
              className="flex flex-col p-8 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
                style={{ backgroundColor: '#FFF8E8' }}
              >
                <method.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
              </motion.div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? method.titleFa : method.titleEn}
              </h3>
              <p
                className="text-sm leading-relaxed flex-grow mb-6"
                style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? method.descFa : method.descEn}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#C9A35A' }}>
                <span style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
                  {isRTL ? method.buttonFa : method.buttonEn}
                </span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center pt-8 border-t border-gray-200"
        >
          <p
            className="text-xs"
            style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            <span style={{ color: '#C9A35A', fontWeight: 'bold' }}>✓ {isRTL ? 'محرمانه' : 'Confidential'}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span style={{ color: '#C9A35A', fontWeight: 'bold' }}>{isRTL ? 'امن' : 'Secure'}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span style={{ color: '#C9A35A', fontWeight: 'bold' }}>{isRTL ? 'بدون تعهد' : 'No Obligation'}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
