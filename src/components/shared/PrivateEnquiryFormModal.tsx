'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PrivateEnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultantId?: string;
  consultantName?: string;
  defaultService?: string;
  defaultMessage?: string;
  packageInterest?: string;
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
const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

// Canonical values are kept in English (used for submission and matched by admin dashboards);
// only the displayed label is translated.
const SERVICE_OPTIONS: { value: string; en: string; fa: string }[] = [
  { value: 'New Identity / Second Citizenship', en: 'New Identity / Second Citizenship', fa: 'هویت جدید / تابعیت دوم' },
  { value: 'EU Residency', en: 'EU Residency', fa: 'اقامت اروپا' },
  { value: 'Spain Digital Nomad Visa / Remote Residency Support', en: 'Spain Digital Nomad Visa / Remote Residency Support', fa: 'ویزای دیجیتال نومد / پشتیبانی اقامت ریموت' },
  { value: 'EU Property Purchase', en: 'EU Property Purchase', fa: 'خرید ملک' },
  { value: 'US Green Card / EB-5', en: 'US Green Card / EB-5', fa: 'گرین کارت آمریکا / EB-5' },
  { value: 'Banking & Compliance', en: 'Banking & Compliance', fa: 'خدمات بانکی و مالی' },
  { value: 'Dispute Resolution', en: 'Dispute Resolution', fa: 'حل اختلاف' },
  { value: 'International Contracts', en: 'International Contracts', fa: 'قراردادهای بین‌المللی' },
  { value: 'Business Solutions', en: 'Business Solutions', fa: 'راهکارهای تجاری' },
  { value: 'EU Company Registration', en: 'EU Company Registration', fa: 'ثبت شرکت' },
  { value: 'Private Client Advisory', en: 'Private Client Advisory', fa: 'مشاوره خصوصی' },
  { value: 'Other', en: 'Other', fa: 'سایر موارد' },
];

// Values (Normal/Urgent/Very Urgent) must stay canonical — admin dashboards match on them.
const URGENCY_OPTIONS: { value: string; en: string; fa: string }[] = [
  { value: 'Normal', en: 'Low / General enquiry', fa: 'کم / درخواست عمومی' },
  { value: 'Urgent', en: 'Medium / Planning soon', fa: 'متوسط / برنامه‌ریزی در آینده نزدیک' },
  { value: 'Very Urgent', en: 'High / Time-sensitive', fa: 'بالا / زمان‌حساس' },
];

const LANGUAGE_OPTIONS: { value: string; en: string; fa: string }[] = [
  { value: 'English', en: 'English', fa: 'انگلیسی' },
  { value: 'Farsi / Persian', en: 'Persian / Farsi', fa: 'فارسی' },
  { value: 'German', en: 'German', fa: 'آلمانی' },
  { value: 'Polish', en: 'Polish', fa: 'لهستانی' },
];

const CONTACT_OPTIONS: { value: string; en: string; fa: string }[] = [
  { value: 'Email', en: 'Email', fa: 'ایمیل' },
  { value: 'Phone', en: 'Phone', fa: 'تماس تلفنی' },
  { value: 'WhatsApp', en: 'WhatsApp', fa: 'واتساپ' },
  { value: 'Telegram', en: 'Telegram', fa: 'تلگرام' },
  { value: 'No preference', en: 'No preference', fa: 'فرقی ندارد' },
];

export default function PrivateEnquiryFormModal({
  isOpen,
  onClose,
  consultantId,
  consultantName,
  defaultService,
  defaultMessage,
  packageInterest,
}: PrivateEnquiryFormModalProps) {
  const { isRTL } = useLanguage();
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: defaultService || '',
    message: defaultMessage || '',
    nationality: '',
    currentCountry: '',
    language: 'English',
    urgency: '',
    preferredContact: '',
    consent: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    setForm(prev => ({
      ...prev,
      service: prev.service || defaultService || '',
      message: defaultMessage && !prev.message ? defaultMessage : prev.message,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultService, defaultMessage]);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError(isRTL ? 'این فیلد الزامی است' : 'Please confirm the consent checkbox before submitting.');
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.service || !form.message) {
      setError(isRTL ? 'این فیلد الزامی است' : 'Please fill in all required fields.');
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
          consent: form.consent,
          packageInterest: packageInterest || undefined,
          locale: isRTL ? 'fa' : 'en',
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
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
        setError(data.error || (isRTL ? 'ارسال درخواست با مشکل مواجه شد. لطفاً دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.' : 'Failed to submit enquiry. Please try again.'));
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(isRTL ? 'ارسال درخواست با مشکل مواجه شد. لطفاً دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.' : 'Failed to submit enquiry. Please try again or contact us directly at info@plucogroup.com');
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
            dir={isRTL ? 'rtl' : 'ltr'}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#071C3C] to-[#0a2655] p-6 flex items-center justify-between text-white z-10">
              <div>
                <h2 className="text-2xl font-serif font-bold" style={{ fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'درخواست محرمانه' : 'Private Enquiry'}
                </h2>
                {consultantName && (
                  <p className="text-sm mt-1" style={{ color: '#CBD5E0', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? `مشاور: ${consultantName}` : `Consultant: ${consultantName}`}
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
                  <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'متشکریم' : 'Thank You'}
                  </h3>
                  <p className="text-sm mb-6 leading-relaxed max-w-md" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL
                      ? 'درخواست شما با موفقیت ارسال شد. تیم PLUCO GROUP پس از بررسی با شما تماس خواهد گرفت.'
                      : `Your enquiry has been received. ${consultantName ? `${consultantName} and our team` : 'Our team'} will review your information confidentially and contact you regarding the next appropriate step.`}
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <Lock className="w-4 h-4" style={{ color: '#C9A35A' }} />
                    <span className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'تمام مکاتبات کاملاً محرمانه است' : 'All communications are strictly confidential'}
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'نام *' : 'First Name *'}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder={isRTL ? 'نام شما' : 'Your first name'}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'نام خانوادگی *' : 'Last Name *'}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder={isRTL ? 'نام خانوادگی شما' : 'Your last name'}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'آدرس ایمیل *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          dir="ltr"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={inputClass}
                          style={{ textAlign: isRTL ? 'right' : 'left' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'شماره تلفن' : 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          dir="ltr"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder={isRTL ? '‎+49 ...' : '+48 ...'}
                          className={inputClass}
                          style={{ textAlign: isRTL ? 'right' : 'left' }}
                        />
                      </div>
                    </div>

                    {/* Company & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'شرکت / سازمان' : 'Company / Organisation'}
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder={isRTL ? 'نام شرکت شما' : 'Your company name'}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'خدمت مورد نظر *' : 'Service of Interest *'}
                        </label>
                        <select
                          name="service"
                          required
                          value={form.service}
                          onChange={handleChange}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        >
                          <option value="">{isRTL ? 'انتخاب کنید' : 'Select a service'}</option>
                          {SERVICE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{isRTL ? opt.fa : opt.en}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Country Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'تابعیت' : 'Nationality'}
                        </label>
                        <input
                          type="text"
                          name="nationality"
                          value={form.nationality || ''}
                          onChange={handleChange}
                          placeholder={isRTL ? 'تابعیت شما' : 'Your nationality'}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'کشور محل اقامت فعلی' : 'Current Country of Residence'}
                        </label>
                        <input
                          type="text"
                          name="currentCountry"
                          value={form.currentCountry || ''}
                          onChange={handleChange}
                          placeholder={isRTL ? 'کشور فعلی شما' : 'Current country'}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'زبان مورد ترجیح' : 'Preferred Language'}
                        </label>
                        <select
                          name="language"
                          value={form.language || 'English'}
                          onChange={handleChange}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        >
                          {LANGUAGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{isRTL ? opt.fa : opt.en}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'میزان فوریت' : 'Urgency'}
                        </label>
                        <select
                          name="urgency"
                          value={form.urgency || ''}
                          onChange={handleChange}
                          className={inputClass}
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        >
                          <option value="">{isRTL ? 'انتخاب کنید' : 'Select...'}</option>
                          {URGENCY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{isRTL ? opt.fa : opt.en}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Preferred Contact */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'روش تماس مورد ترجیح' : 'Preferred Contact Method'}
                      </label>
                      <select
                        name="preferredContact"
                        value={form.preferredContact || ''}
                        onChange={handleChange}
                        className={inputClass}
                        style={{ fontFamily: isRTL ? ff : undefined }}
                      >
                        <option value="">{isRTL ? 'انتخاب کنید' : 'Select...'}</option>
                        {CONTACT_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{isRTL ? opt.fa : opt.en}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'لطفاً موضوع خود را کوتاه توضیح دهید *' : 'Briefly describe your matter *'}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder={isRTL ? 'لطفاً موضوع حقوقی، اقامتی یا تجاری خود را کوتاه توضیح دهید' : 'Please briefly describe your legal or commercial matter...'}
                        className={inputClass}
                        style={{ fontFamily: isRTL ? ff : undefined }}
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
                        <p className="text-xs font-medium" style={{ fontFamily: isRTL ? ff : undefined }}>{error}</p>
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
                      <label className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL
                          ? 'من می‌دانم که ارسال این فرم ایجادکننده رابطه وکیل-موکل نیست و تضمینی برای نتیجه نمی‌دهد. با ارسال این فرم، رضایت می‌دهم که PLUCO GROUP در خصوص درخواستم با من تماس بگیرد.'
                          : 'I understand that submitting this form does not create a lawyer-client relationship and does not guarantee any result. By submitting, I consent to being contacted by PLUCO GROUP regarding my enquiry.'}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!form.consent || isLoading}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isRTL ? 'در حال ارسال...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          {isRTL ? 'ارسال درخواست' : 'Send Enquiry'}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
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
