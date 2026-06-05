'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import ConsultationProcess from '@/components/sections/ConsultationProcess';
import DiscreetFirstContact from '@/components/sections/DiscreetFirstContact';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import PrivateEnquiryFormModal from '@/components/shared/PrivateEnquiryFormModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>
              GET IN TOUCH
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">
              Ready to discuss your international legal and commercial needs? Reach out for a confidential consultation.
            </p>
          </motion.div>
        </div>
      </section>

      <ConsultationProcess />

      {/* Contact Section */}
      <section className="py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-serif mb-8" style={{ color: '#1E2430' }}>Get in Touch</h2>
              <div className="space-y-7">
                {[
                  {
                    Icon: Mail,
                    title: 'Email',
                    lines: ['info@plucogroup.com', 'General enquiries & consultations'],
                  },
                  {
                    Icon: MapPin,
                    title: 'Office',
                    lines: ['Ksawerów 3', '02-656 Warsaw, Poland', 'By appointment only'],
                  },
                  {
                    Icon: Clock,
                    title: 'Business Hours',
                    lines: ['Mon – Fri: 9:00 AM – 6:00 PM CET', 'International clients accommodated across time zones'],
                  },
                ].map(({ Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ border: '2px solid #C9A35A' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#1E2430' }}>
                        {title}
                      </p>
                      {lines.map(line => (
                        <p key={line} className="text-xs leading-relaxed" style={{ color: '#5E6470' }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form - Start Private Enquiry */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-serif mb-2" style={{ color: '#1E2430' }}>Start Private Client Enquiry</h2>
                <p className="text-xs mb-8" style={{ color: '#5E6470' }}>
                  Submit your confidential legal or commercial matter for a discreet consultation.
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                  style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
                >
                  Open Enquiry Form
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <DiscreetFirstContact />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>

      {/* Private Enquiry Modal */}
      <PrivateEnquiryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
