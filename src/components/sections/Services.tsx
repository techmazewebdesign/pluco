'use client';

import { motion } from 'framer-motion';
import { Globe, Scale, Landmark, UserX, Cpu } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'International Contracts',
    description: 'Drafting, negotiating and managing international commercial contracts with precision and clarity.',
    Icon: Globe,
    href: '/international-contracts',
  },
  {
    title: 'Dispute Resolution & Settlements',
    description: 'Strategic dispute assessment and resolution through negotiation, mediation or arbitration.',
    Icon: Scale,
    href: '/dispute-resolution',
  },
  {
    title: 'Banking Compliance',
    description: 'Advisory on regulatory compliance, risk frameworks and governance for financial institutions.',
    Icon: Landmark,
    href: '/banking-compliance',
  },
  {
    title: 'Financial Discrimination',
    description: 'Representation in matters of financial discrimination and unfair treatment by institutions.',
    Icon: UserX,
    href: '/financial-discrimination',
  },
  {
    title: 'High-Tech Industrial Contracts',
    description: 'Complex contracting for high-tech industrial projects and supply chain arrangements.',
    Icon: Cpu,
    href: '/international-contracts',
  },
];

export default function Services() {
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
            WHAT WE DO
          </h2>
        </motion.div>

        {/* 5 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="flex flex-col p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* Gold outline icon — left aligned */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{ border: '2px solid #C9A35A' }}
              >
                <service.Icon
                  className="w-6 h-6"
                  style={{ color: '#C9A35A' }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h3
                className="text-sm font-bold mb-3 leading-snug"
                style={{ color: '#1E2430' }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed flex-grow" style={{ color: '#5E6470' }}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
