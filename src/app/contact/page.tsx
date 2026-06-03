'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import ConsultationProcess from '@/components/sections/ConsultationProcess';
import DiscreetFirstContact from '@/components/sections/DiscreetFirstContact';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A]';

export default function Contact() {
  const { isRTL } = useLanguage();
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', company: '', service: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          currentCountry: form.company, // Using company field for country
          preferredLanguage: 'English',
          serviceNeeded: form.service,
          shortCaseDescription: form.message,
        }),
      });

      const data = await response.json() as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
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

      {/* Consultation Process */}
      <ConsultationProcess />

      {/* Main content */}
      <section className="py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left: contact info */}
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
                  { Icon: Mail, title: 'Email', lines: ['info@plucogroup.com', 'General enquiries & consultations'] },
                  { Icon: MapPin, title: 'Office', lines: ['Ksawerów 3', '02-656 Warsaw, Poland', 'By appointment only'] },
                  { Icon: Clock, title: 'Business Hours', lines: ['Mon – Fri: 9:00 AM – 6:00 PM CET', 'International clients accommodated across time zones'] },
                ].map(({ Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                      <Icon className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#1E2430' }}>{title}</p>
                      {lines.map(l => <p key={l} className="text-xs leading-relaxed" style={{ color: '#5E6470' }}>{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                  <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Thank You</h3>
                  <p className="text-sm mb-6" style={{ color: '#5E6470' }}>Your enquiry has been received. Our private client team will contact you shortly.</p>
                  <button onClick={() => { setSubmitted(false); setError(null); }} className="text-xs font-semibold underline" style={{ color: '#C9A35A' }}>Send another message</button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-serif mb-2" style={{ color: '#1E2430' }}>Request a Consultation</h2>
                  <p className="text-xs mb-8" style={{ color: '#5E6470' }}>Fill in the form and we will be in touch within 24 hours.</p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>First Name *</label>
                        <input name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Last Name *</label>
                        <input name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Email Address *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Phone Number</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Company / Organisation</label>
                        <input name="company" value={form.company} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Service of Interest</label>
                      <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                        <option value="">Select a service</option>
                        <option>International Contracts</option>
                        <option>Dispute Resolution & Settlements</option>
                        <option>Banking Compliance</option>
                        <option>Financial Discrimination</option>
                        <option>High-Tech Industrial Contracts</option>
                        <option>General Consultation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Message *</label>
                      <textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Please describe your legal or commercial needs..." className={inputClass} />
                    </div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                        style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', color: '#991B1B' }}
                      >
                        <p className="text-xs font-medium">{error}</p>
                      </motion.div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                      <ArrowRight className={`w-4 h-4 ${isLoading ? 'opacity-50' : ''}`} />
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Discreet First Contact Section */}
      <DiscreetFirstContact />

      {/* Legal Disclaimer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  );
}
