'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const featureItems = [
  { icon: '/images/location-icon.PNG', labelKey: 'Warsaw-based' },
  { icon: '/images/global-icon.PNG',   labelKey: 'Internationally minded' },
  { icon: '/images/briefcase-icon.PNG',labelKey: 'Private client focused' },
  { icon: '/images/shield-icon.PNG',   labelKey: 'Cross-border legal advisory' },
];

const featureLabelsFa: Record<string, string> = {
  'Warsaw-based':             'مستقر در ورشو',
  'Internationally minded':   'با دیدگاه بین‌المللی',
  'Private client focused':   'تمرکز بر موکلین خصوصی',
  'Cross-border legal advisory': 'مشاوره حقوقی بین‌المللی',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 12 } },
};

export default function Hero() {
  const { t, isRTL, lang } = useLanguage();

  return (
    <>
      <section className="flex flex-col lg:flex-row" style={{ minHeight: '100vh', paddingTop: '92px' }}>
        {/* LEFT: Dark Navy Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 flex items-center"
          style={{ backgroundColor: '#071C3C' }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-8 md:px-12 lg:px-16 xl:px-20 py-16 lg:py-24 w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{
                color: '#C9A35A',
                fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
                letterSpacing: isRTL ? 'normal' : undefined,
              }}
            >
              {t('hero.eyebrow')}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl xl:text-[44px] font-serif text-white leading-tight mb-7"
              style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
            >
              {t('hero.title')}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-px"
                style={{ backgroundColor: '#C9A35A' }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8, type: 'spring' }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#C9A35A' }}
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm text-white font-medium mb-6 leading-relaxed"
              style={{ fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
            >
              {t('hero.tags')}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-sm leading-relaxed mb-10"
              style={{
                color: '#CBD5E0',
                fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
              }}
            >
              {t('hero.body')}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold rounded transition-all hover:brightness-110"
                  style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                >
                  {t('ui.scheduleConsultation')}
                  <ArrowRight className={`ml-2 w-4 h-4 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/eu-residency"
                  className="inline-flex items-center justify-center px-7 py-3 text-sm font-medium rounded border border-white text-white transition-all hover:bg-white/10"
                >
                  {t('ui.exploreServices')}
                  <ArrowRight className={`ml-2 w-4 h-4 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-64 lg:h-auto lg:w-1/2 relative order-first lg:order-last overflow-hidden"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 bottom-0 w-0.5 z-10 origin-top"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <Image src="/images/hero-pluco.jpg" alt="European legal advisory" fill className="object-cover" priority />
        </motion.div>
      </section>

      {/* Feature Strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.labelKey}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100, damping: 12 }}
                whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                className="flex items-center justify-center gap-3 py-6 px-6 rounded-lg cursor-default"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Image src={item.icon} alt={item.labelKey} width={32} height={32} className="flex-shrink-0" />
                </motion.div>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: '#1E2430',
                    fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
                  }}
                >
                  {isRTL ? featureLabelsFa[item.labelKey] : item.labelKey}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
