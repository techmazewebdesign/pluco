'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactCTA() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="pluco-home-cta py-12" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring' as const, stiffness: 100, damping: 15 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' as const, stiffness: 100, damping: 15 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: '2px solid #C9A35A' }}
          >
            <Mail className="w-7 h-7" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' as const, stiffness: 100, damping: 15 }}
            className="flex-1 text-center md:text-left"
          >
            <h2
              className="text-2xl md:text-3xl font-serif text-white mb-2"
              style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
            >
              {t('cta.homeHeading')}
            </h2>
            <p
              className="text-sm"
              style={{
                color: '#CBD5E0',
                fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
              }}
            >
              {t('cta.homeBody')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' as const, stiffness: 100, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded transition-all hover:brightness-110 flex-shrink-0"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              {t('ui.requestConsultation')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
