'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  nationality?: string;
  currentCountry?: string;
  language?: string;
  familyMembers?: string;
  numFamilyMembers?: string;
  urgency?: string;
  preferredContact?: string;
  consent?: boolean;
};

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] bg-white';

export default function EnquirePage() {
  const { isRTL } = useLanguage();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '', service: '', message: '',
    nationality: '', currentCountry: '', language: 'English', familyMembers: '', numFamilyMembers: '', urgency: '', preferredContact: '', consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError('Please confirm the consent checkbox before submitting.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: form.service,
          description: form.message,
          nationality: form.nationality,
          country: form.currentCountry,
          language: form.language,
          familyMembers: form.familyMembers,
          numFamilyMembers: form.numFamilyMembers,
          urgency: form.urgency,
          preferredContact: form.preferredContact,
          consent: form.consent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit enquiry. Please try again or contact us directly at info@plucogroup.com');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dark navy header band */}
      <section className="pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
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
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Thank You</h3>
                <p className="text-sm mb-6 leading-relaxed max-w-md" style={{ color: '#5E6470' }}>
                  Your enquiry has been received. PLUCO GROUP will review your information confidentially and contact you regarding the next appropriate step.
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
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Service of Interest *</label>
                    <select name="service" required value={form.service} onChange={handleChange} className={inputClass}>
                      <option value="">Select a service</option>
                      <option>New Identity / Second Citizenship</option>
                      <option>EU Residency</option>
                      <option>EU Property Purchase</option>
                      <option>US Green Card / EB-5</option>
                      <option>Banking & Compliance</option>
                      <option>Dispute Resolution</option>
                      <option>International Contracts</option>
                      <option>Business Solutions</option>
                      <option>EU Company Registration</option>
                      <option>Private Client Advisory</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Nationality</label>
                      <input type="text" name="nationality" value={form.nationality || ''} onChange={handleChange} placeholder="Your nationality" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Current Country of Residence</label>
                      <input type="text" name="currentCountry" value={form.currentCountry || ''} onChange={handleChange} placeholder="Current country" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Preferred Language</label>
                      <select name="language" value={form.language || 'English'} onChange={handleChange} className={inputClass}>
                        <option value="English">English</option>
                        <option value="Farsi / Persian">Farsi / Persian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Family Members Included</label>
                      <select name="familyMembers" value={form.familyMembers || ''} onChange={handleChange} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  {form.familyMembers === 'Yes' && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Number of Family Members</label>
                      <input type="number" name="numFamilyMembers" value={form.numFamilyMembers || ''} onChange={handleChange} placeholder="e.g., 2, 3, 4..." min="1" className={inputClass} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Urgency</label>
                      <select name="urgency" value={form.urgency || ''} onChange={handleChange} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Very Urgent">Very Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>Preferred Contact Method</label>
                      <select name="preferredContact" value={form.preferredContact || ''} onChange={handleChange} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>
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

                  <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent || false}
                      onChange={(e) => setForm(prev => ({ ...prev, consent: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded"
                      style={{ accentColor: '#C9A35A' }}
                      disabled={isLoading}
                    />
                    <label className="text-xs leading-relaxed" style={{ color: '#5E6470' }}>
                      I understand that submitting this form does not create a lawyer-client relationship and does not guarantee any result. By submitting, I consent to being contacted by PLUCO GROUP regarding my enquiry.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!form.consent || isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                  >
                    {isLoading ? 'Submitting...' : 'Send Enquiry'}
                    <ArrowRight className={`w-4 h-4 ${isLoading ? 'opacity-50' : ''}`} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
