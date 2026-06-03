'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import ConsultationProcess from '@/components/sections/ConsultationProcess';
import DiscreetFirstContact from '@/components/sections/DiscreetFirstContact';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

interface UIState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string;
}

const SERVICES = [
  'International Contracts',
  'Dispute Resolution & Settlements',
  'Banking Compliance',
  'Financial Discrimination',
  'High-Tech Industrial Contracts',
  'General Consultation'
];

const inputStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] disabled:opacity-50 disabled:cursor-not-allowed';

export default function ContactPage() {
  const { isRTL } = useLanguage();

  // Form state
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  // UI state
  const [ui, setUI] = useState<UIState>({
    isLoading: false,
    isSuccess: false,
    error: '',
  });

  // Validation
  const isFormValid = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.service.trim() && form.message.trim();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isFormValid) {
      setUI(prev => ({ ...prev, error: 'Please fill in all required fields.' }));
      return;
    }

    setUI({ isLoading: true, isSuccess: false, error: '' });

    try {
      const payload = {
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        currentCountry: form.company.trim(),
        preferredLanguage: 'English',
        serviceNeeded: form.service.trim(),
        shortCaseDescription: form.message.trim(),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUI({ isLoading: false, isSuccess: true, error: '' });
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
        });
      } else {
        setUI({
          isLoading: false,
          isSuccess: false,
          error: result.error || 'Failed to submit. Please try again.',
        });
      }
    } catch (error) {
      setUI({
        isLoading: false,
        isSuccess: false,
        error: 'Connection error. Please check your internet and try again.',
      });
    }
  };

  // Reset form
  const handleReset = () => {
    setUI({ isLoading: false, isSuccess: false, error: '' });
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: '',
    });
  };

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

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {ui.isSuccess ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                  </motion.div>
                  <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Thank You</h3>
                  <p className="text-sm mb-6" style={{ color: '#5E6470' }}>
                    Your enquiry has been received. Our team will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold underline hover:opacity-70 transition-opacity"
                    style={{ color: '#C9A35A' }}
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-serif mb-2" style={{ color: '#1E2430' }}>Request a Consultation</h2>
                  <p className="text-xs mb-8" style={{ color: '#5E6470' }}>
                    Fill in the form and we will be in touch within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name *"
                        value={form.firstName}
                        onChange={handleInputChange}
                        disabled={ui.isLoading}
                        className={inputStyles}
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name *"
                        value={form.lastName}
                        onChange={handleInputChange}
                        disabled={ui.isLoading}
                        className={inputStyles}
                        required
                      />
                    </div>

                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={handleInputChange}
                      disabled={ui.isLoading}
                      className={inputStyles}
                      required
                    />

                    {/* Phone and Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleInputChange}
                        disabled={ui.isLoading}
                        className={inputStyles}
                      />
                      <input
                        type="text"
                        name="company"
                        placeholder="Company / Organisation"
                        value={form.company}
                        onChange={handleInputChange}
                        disabled={ui.isLoading}
                        className={inputStyles}
                      />
                    </div>

                    {/* Service */}
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleInputChange}
                      disabled={ui.isLoading}
                      className={inputStyles}
                      required
                    >
                      <option value="">Select a service *</option>
                      {SERVICES.map(svc => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>

                    {/* Message */}
                    <textarea
                      name="message"
                      placeholder="Please describe your legal or commercial needs..."
                      value={form.message}
                      onChange={handleInputChange}
                      disabled={ui.isLoading}
                      rows={5}
                      className={inputStyles}
                      required
                    />

                    {/* Error Message */}
                    {ui.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-lg"
                        style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', border: '1px solid' }}
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                        <p className="text-xs" style={{ color: '#991B1B' }}>
                          {ui.error}
                        </p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={ui.isLoading || !isFormValid}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
                    >
                      {ui.isLoading ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
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
    </div>
  );
}
