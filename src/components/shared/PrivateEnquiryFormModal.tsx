'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ArrowRight, Lock } from 'lucide-react';

interface PrivateEnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultantId?: string;
  consultantName?: string;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  nationality?: string;
  currentCountry?: string;
  language?: string;
  urgency?: string;
  preferredContact?: string;
  consent?: boolean;
};

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] bg-white';

export default function PrivateEnquiryFormModal({
  isOpen,
  onClose,
  consultantId,
  consultantName,
}: PrivateEnquiryFormModalProps) {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    nationality: '',
    currentCountry: '',
    language: 'English',
    urgency: '',
    preferredContact: '',
    consent: false,
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

    if (!form.firstName || !form.lastName || !form.email || !form.service || !form.message) {
      setError('Please fill in all required fields.');
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
          fullName: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: form.service,
          description: form.message,
          nationality: form.nationality,
          country: form.currentCountry,
          language: form.language,
          urgency: form.urgency,
          preferredContact: form.preferredContact,
          // Consultant-specific fields
          ...(consultantId && {
            consultantId,
            consultantName,
            status: 'assigned',
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2000);
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#071C3C] to-[#0a2655] p-6 flex items-center justify-between text-white z-10">
              <div>
                <h2 className="text-2xl font-serif font-bold">Private Enquiry</h2>
                {consultantName && (
                  <p className="text-sm mt-1" style={{ color: '#CBD5E0' }}>
                    Consultant: {consultantName}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                  <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Thank You</h3>
                  <p className="text-sm mb-6 leading-relaxed max-w-md" style={{ color: '#5E6470' }}>
                    Your enquiry has been received. {consultantName ? `${consultantName} and our team` : 'Our team'} will review your information confidentially and contact you regarding the next appropriate step.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <Lock className="w-4 h-4" style={{ color: '#C9A35A' }} />
                    <span className="text-xs" style={{ color: '#5E6470' }}>
                      All communications are strictly confidential
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Your first name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Your last name"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+48 ..."
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Company & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Company / Organisation
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Your company name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Service of Interest *
                        </label>
                        <select
                          name="service"
                          required
                          value={form.service}
                          onChange={handleChange}
                          className={inputClass}
                        >
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
                    </div>

                    {/* Country Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Nationality
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={form.nationality || ''}
                          onChange={handleChange}
                          placeholder="Your nationality"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Current Country of Residence
                        </label>
                        <input
                          type="text"
                          name="currentCountry"
                          value={form.currentCountry || ''}
                          onChange={handleChange}
                          placeholder="Current country"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Preferred Language
                        </label>
                        <select
                          name="language"
                          value={form.language || 'English'}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="English">English</option>
                          <option value="Farsi / Persian">Farsi / Persian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                          Urgency
                        </label>
                        <select
                          name="urgency"
                          value={form.urgency || ''}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select...</option>
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Very Urgent">Very Urgent</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Contact */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferredContact"
                        value={form.preferredContact || ''}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select...</option>
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430' }}>
                        Briefly describe your matter *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Please briefly describe your legal or commercial matter..."
                        className={inputClass}
                      />
                    </div>

                    {/* Error Message */}
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

                    {/* Consent */}
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!form.consent || isLoading}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
