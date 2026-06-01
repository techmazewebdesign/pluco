'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>
              {eyebrow}
            </p>
          )}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px mb-5"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-serif text-white mb-5 leading-tight max-w-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm leading-relaxed max-w-3xl" style={{ color: '#CBD5E0' }}>
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
