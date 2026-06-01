'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] bg-white';

export default function EnquirePage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry — ${form.name}${form.company ? ` (${form.company})` : ''}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'N/A'}\nCompany: ${form.company || 'N/A'}\nService of Interest: ${form.service || 'N/A'}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:info@plucogroup.com?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#071C3C' }}>
      {/* Dark navy header band */}
      <section className="pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C9A35A' }}>
              CONFIDENTIAL ENQUIRY
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-5">Enquire Now</h1>
            <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: '#CBD5E0' }}>
              Tell us about your legal or commercial challenge. All enquiries are handled with complete confidentiality.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Lock className="w-4 h-4" style={{ color: '#C9A35A' }} />
              <span className="text-xs" style={{ color: '#C9A35A' }}>All communications are strictly confidential</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form card */}
      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Enquiry Prepared</h3>
                <p className="text-sm mb-6" style={{ color: '#5E6470' }}>
                  Your email client has opened with your enquiry addressed to info@plucogroup.com. Please send it from there and we will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold underline"
                  style={{ color: '#C9A35A' }}
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif mb-1" style={{ color: '#1E2430' }}>Your Enquiry</h2>
                <p className="text-xs mb-8" style={{ color: '#5E6470' }}>
                  We respond to all enquiries within 24 hours on business days.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Full Name *</label>
                      <input name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Email Address *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+48 ..." className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Company / Organisation</label>
                      <input name="company" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Area of Interest</label>
                    <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                      <option value="">Select an area</option>
                      <option>International Contracts</option>
                      <option>Dispute Resolution & Settlements</option>
                      <option>Banking Compliance</option>
                      <option>Financial Discrimination</option>
                      <option>High-Tech Industrial Contracts</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Briefly describe your matter *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Please briefly describe your legal or commercial matter..."
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                    style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                  >
                    Send Enquiry
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs" style={{ color: '#5E6470' }}>
                    By submitting this form you consent to being contacted by Pluco Group Sp. z o.o. regarding your enquiry.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
