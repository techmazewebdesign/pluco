'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Position() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="pluco-home-position py-20" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_auto] gap-10 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring' as const, stiffness: 100, damping: 15 }}
            className="flex items-center justify-center lg:justify-start"
          >
            <div className="pluco-home-position__media relative w-full max-w-[320px] aspect-[4/3] overflow-hidden shadow-2xl">
              <Image src="/images/position-photo.jpg" alt="Private client legal advisory" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' as const, stiffness: 100, damping: 15 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{
                color: '#C9A35A',
                fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
                letterSpacing: isRTL ? 'normal' : undefined,
              }}
            >
              {t('position.eyebrow')}
            </p>
            <h2
              className="text-2xl md:text-3xl font-serif text-white mb-5 leading-snug"
              style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
            >
              {t('position.heading')}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: '#CBD5E0',
                fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
              }}
            >
              {t('position.body')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' as const, stiffness: 100, damping: 15 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/our-people"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium rounded border transition-all whitespace-nowrap hover:brightness-110"
                style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
              >
                {t('ui.ourPeople')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
