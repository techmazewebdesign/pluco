'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featureItems = [
  { icon: '/images/location-icon.PNG', label: 'Warsaw-based' },
  { icon: '/images/global-icon.PNG', label: 'Internationally minded' },
  { icon: '/images/briefcase-icon.PNG', label: 'Commercially focused' },
  { icon: '/images/shield-icon.PNG', label: 'Cross-border strategic advisory' },
];

export default function Hero() {
  return (
    <>
      {/* Full-width hero split — no max-width wrapper */}
      <section className="flex flex-col lg:flex-row" style={{ minHeight: '100vh', paddingTop: '64px' }}>
        {/* LEFT: Dark Navy Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center"
          style={{ backgroundColor: '#071C3C' }}
        >
          <div className="px-8 md:px-12 lg:px-16 xl:px-20 py-16 lg:py-24 w-full">
            {/* Gold eyebrow */}
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: '#C9A35A' }}
            >
              COMMERCIAL &amp; LEGAL CONSULTANCY
            </p>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl xl:text-[52px] font-serif text-white leading-tight mb-7">
              Cross-Border Legal and<br />
              Commercial Advisory for<br />
              Complex Business Matters
            </h1>

            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ backgroundColor: '#C9A35A' }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C9A35A' }}></div>
            </div>

            {/* Service tags — pipe separated */}
            <p className="text-sm text-white font-medium mb-6 leading-relaxed">
              International Contracts &nbsp;|&nbsp; Dispute Strategy &nbsp;|&nbsp; Banking Compliance &nbsp;|&nbsp; Financial Discrimination
            </p>

            {/* Body text */}
            <p className="text-sm leading-relaxed mb-10" style={{ color: '#CBD5E0' }}>
              Pluco Group Sp. z o.o. is a Warsaw-based commercial and legal consultancy advising businesses and financial institutions on international contracts, cross-border transactions, dispute strategy, banking compliance, and financial discrimination.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold rounded transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
              >
                Request a Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/international-contracts"
                className="inline-flex items-center justify-center px-7 py-3 text-sm font-medium rounded border border-white text-white transition-all hover:bg-white/10"
              >
                Explore Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full h-64 lg:h-auto lg:w-1/2 relative order-first lg:order-last"
        >
          {/* Gold accent line at the left edge of the image */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5 z-10"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <Image
            src="/images/hero-pluco.jpg"
            alt="Warsaw corporate architecture"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Feature Strip — white background */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center gap-3 py-6 px-6"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
                <span className="text-sm font-medium" style={{ color: '#1E2430' }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
