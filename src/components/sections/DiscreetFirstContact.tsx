'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DiscreetFirstContact() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    'I would like to request a discreet WhatsApp consultation with PLUCO GROUP regarding a private client matter.'
  )}`;

  const mailtoLink = `mailto:info@plucogroup.com?subject=${encodeURIComponent(
    'Discreet First Contact Request'
  )}&body=${encodeURIComponent(
    'I would like to arrange an initial contact regarding a confidential matter.'
  )}`;

  return (
    <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 md:p-12"
        >
          {/* Headline */}
          <h2
            className="text-2xl md:text-3xl font-serif font-bold mb-4 text-center"
            style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}
          >
            {isRTL ? 'ترجیح می‌دهید تماس محرمانه?' : 'Prefer a Discreet First Contact?'}
          </h2>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mb-6"
            style={{ backgroundColor: '#C9A35A' }}
          />

          {/* Description text */}
          <p
            className="text-center text-sm leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
          >
            {isRTL
              ? 'برای استعلامات موکل خصوصی، PLUCO GROUP می‌تواند یک تماس اولیه را از طریق ایمیل، تلفن یا WhatsApp ترتیب دهد. لطفاً ابتدا استعلام خود را ارسال کنید تا تیم بتواند ماهیت موضوع شما را درک کند و پس از آن به شما پاسخ دهد.'
              : 'For private client enquiries, PLUCO GROUP can arrange an initial contact by email, phone, or WhatsApp. Please submit your enquiry first so the team can understand the nature of your matter before responding.'}
          </p>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* WhatsApp Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-lg border-2 transition-all hover:shadow-md"
                style={{
                  borderColor: '#C9A35A',
                  color: '#C9A35A',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF8E8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'درخواست تماس WhatsApp' : 'Request WhatsApp Contact'}
                </span>
              </a>
            </motion.div>

            {/* Email Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href={mailtoLink}
                className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-lg border-2 transition-all hover:shadow-md"
                style={{
                  borderColor: '#C9A35A',
                  color: '#C9A35A',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF8E8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Mail className="w-4 h-4" />
                <span style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'ایمیل PLUCO GROUP' : 'Email PLUCO GROUP'}
                </span>
              </a>
            </motion.div>

            {/* Start Private Enquiry Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/enquire"
                className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                <span style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'استعلام خصوصی' : 'Start Private Enquiry'}
                </span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs text-center mt-8 pt-6 border-t border-gray-200"
            style={{ color: '#909399', fontFamily: isRTL ? ff : undefined }}
          >
            {isRTL
              ? '✓ تمام ارتباطات محرمانه و امن است. PLUCO GROUP هرگز اطلاعات شخصی شما را با اشخاص ثالث به اشتراک نمی‌گذارد.'
              : '✓ All communications are confidential and secure. PLUCO GROUP never shares your personal information with third parties.'}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
