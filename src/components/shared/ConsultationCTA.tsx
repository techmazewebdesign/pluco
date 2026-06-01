'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ConsultationCTA() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ border: '2px solid #C9A35A' }}
          >
            <Mail className="w-7 h-7" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-serif text-white mb-4"
            style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {t('cta.heading')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{
              color: '#CBD5E0',
              fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
            }}
          >
            {t('cta.body')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                {t('ui.requestConsultation')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xs space-y-1"
            style={{ color: '#64748B' }}
          >
            <p>Email: <a href="mailto:info@plucogroup.com" className="hover:text-white transition-colors" style={{ color: '#94A3B8' }}>info@plucogroup.com</a></p>
            <p>Ksawerów 3, Warsaw, 02-656, Poland</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
