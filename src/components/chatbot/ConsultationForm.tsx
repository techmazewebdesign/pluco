'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface ConsultationFormProps {
  onClose: () => void;
  onSubmitted: (formData: any) => void;
  sessionId: string;
}

const SERVICES = [
  'EU Residency',
  'Second Citizenship / New Identity',
  'Banking Support',
  'Company Registration',
  'International Contracts',
  'Dispute Resolution',
  'Property Purchase',
  'Other',
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'فارسی', value: 'fa' },
  { label: 'Deutsch', value: 'de' },
  { label: 'العربية', value: 'ar' },
];

export default function ConsultationForm({
  onClose,
  onSubmitted,
  sessionId,
}: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'UTC',
    language: 'en',
    caseDescription: '',
    consentAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.phone.trim()) {
        throw new Error('Phone number is required');
      }
      if (!formData.service) {
        throw new Error('Please select a service');
      }
      if (!formData.consentAccepted) {
        throw new Error('Please accept the consent checkbox');
      }

      const now = new Date().toISOString();
      const userUid = auth.currentUser?.uid || 'anonymous';

      const consultationRequest = {
        id: `req_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        source: 'chatbot',
        sessionId,
        userUid,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        preferredDate: formData.preferredDate || null,
        preferredTime: formData.preferredTime || null,
        timezone: formData.timezone,
        language: formData.language,
        caseDescription: formData.caseDescription.trim(),
        consentAccepted: formData.consentAccepted,
        status: 'pending',
        adminNotes: '',
      };

      console.log('[ConsultationForm] Submitting request...');
      const docRef = await addDoc(
        collection(db, 'consultation_requests'),
        consultationRequest
      );
      console.log('[ConsultationForm] Request saved:', docRef.id);

      setSuccess(true);
      onSubmitted(consultationRequest);
    } catch (err: any) {
      console.error('[ConsultationForm] Error:', err?.message);
      setError(err?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">Thank you for your request!</p>
          <p className="text-green-700 text-sm mt-2">
            Your consultation request has been received. This is not a confirmed appointment yet. Our team will review availability and conflict checks, then contact you to confirm.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-600">Request Summary:</p>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-semibold">Name:</span> {formData.fullName}</p>
            <p><span className="font-semibold">Service:</span> {formData.service}</p>
            {formData.preferredDate && (
              <p><span className="font-semibold">Preferred date:</span> {formData.preferredDate}</p>
            )}
            {formData.preferredTime && (
              <p><span className="font-semibold">Preferred time:</span> {formData.preferredTime}</p>
            )}
            <p><span className="font-semibold">Contact:</span> {formData.email} / {formData.phone}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Consultation Request</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            WhatsApp / Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1234567890"
            disabled={isSubmitting}
          />
        </div>

        {/* Service */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Preferred Service *
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select a service...</option>
            {SERVICES.map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Preferred Time
          </label>
          <input
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Timezone
          </label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="UTC, EST, etc."
            disabled={isSubmitting}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Case Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Short Case Description
          </label>
          <textarea
            name="caseDescription"
            value={formData.caseDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us briefly about your situation..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* Consent */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            name="consentAccepted"
            checked={formData.consentAccepted}
            onChange={handleChange}
            className="mt-1"
            disabled={isSubmitting}
          />
          <label className="text-xs text-gray-700">
            I understand that this is only a consultation request and not a confirmed appointment or legal advice.
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#C9A35A',
            color: '#071C3C',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </motion.div>
  );
}
