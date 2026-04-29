'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Position() {
  return (
    <section className="py-20" style={{ backgroundColor: '#071C3C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_auto] gap-10 items-center">

          {/* Column 1: Courthouse illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center lg:justify-start"
          >
            <Image
              src="/images/couthouse-line.png"
              alt="Courthouse illustration"
              width={260}
              height={180}
              className="w-full max-w-[260px] h-auto"
            />
          </motion.div>

          {/* Column 2: Label + Heading + Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#C9A35A' }}
            >
              OUR POSITION
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-5 leading-snug">
              More Than a Local Consultancy
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#CBD5E0' }}>
              Pluco Group is not a conventional local consultancy. We operate at the intersection of international contracts, banking compliance, and dispute strategy — helping clients navigate complex, cross-border business challenges with commercial pragmatism and legal rigour.
            </p>
          </motion.div>

          {/* Column 3: Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium rounded border transition-all whitespace-nowrap hover:brightness-110"
              style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
