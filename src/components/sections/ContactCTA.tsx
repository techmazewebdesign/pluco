'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="py-12" style={{ backgroundColor: '#071C3C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          {/* Envelope icon in gold circle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: '2px solid #C9A35A' }}
          >
            <Mail className="w-7 h-7" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
          </div>

          {/* Text — grows to fill */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">
              Confidential enquiries. Strategic solutions.
            </h2>
            <p className="text-sm" style={{ color: '#CBD5E0' }}>
              Contact us today to discuss how we can assist with your international legal and commercial needs.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded transition-all hover:brightness-110 flex-shrink-0"
            style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
          >
            Request a Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
