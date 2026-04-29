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

export default function Industries() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="text-2xl md:text-3xl font-serif font-bold tracking-wide"
            style={{ color: '#1E2430' }}
          >
            INDUSTRIES WE SERVE
          </h2>
        </motion.div>

        {/* 6 industry icons in a row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              {/* Gold outline icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ border: '2px solid #C9A35A' }}
              >
                <industry.Icon
                  className="w-7 h-7"
                  style={{ color: '#C9A35A' }}
                  strokeWidth={1.5}
                />
              </div>
              <span
                className="text-xs font-semibold leading-snug"
                style={{ color: '#1E2430' }}
              >
                {industry.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
