'use client';

import { motion } from 'framer-motion';
import { Flame, Factory, Settings2, Wrench, Globe, Landmark } from 'lucide-react';

const industries = [
  { name: 'Oil & Gas', Icon: Flame },
  { name: 'Petrochemical Industry', Icon: Factory },
  { name: 'Machinery & Industrial Equipment', Icon: Settings2 },
  { name: 'Engineering & Technical Services', Icon: Wrench },
  { name: 'International Trade', Icon: Globe },
  { name: 'Banking & Financial Services', Icon: Landmark },
];

const industryVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  }),
};

export default function Industries() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring' as const, stiffness: 100, damping: 15 }}
          className="text-center mb-14"
        >
          <motion.h2
            className="text-2xl md:text-3xl font-serif font-bold tracking-wide"
            style={{ color: '#1E2430' }}
          >
            INDUSTRIES WE SERVE
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mt-4"
            style={{ backgroundColor: '#C9A35A' }}
          />
        </motion.div>

        {/* 6 industry icons in a row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              custom={index}
              variants={industryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -10, scale: 1.1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              {/* Gold outline icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow"
                style={{ border: '2px solid #C9A35A' }}
              >
                <industry.Icon
                  className="w-7 h-7"
                  style={{ color: '#C9A35A' }}
                  strokeWidth={1.5}
                />
              </motion.div>
              <motion.span
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
                className="text-xs font-semibold leading-snug group-hover:text-[#C9A35A] transition-colors"
                style={{ color: '#1E2430' }}
              >
                {industry.name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
