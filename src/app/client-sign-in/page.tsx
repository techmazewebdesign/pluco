'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Upload, Shield, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/shared/PageHero';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const serviceOptions = {
  en: ['New Identity','EU Residency','EU Property Purchase','US Green Card','Banking','Dispute Resolution','International Contracts','Business Solutions','EU Company Registration','Other / General Enquiry'],
  fa: ['هویت جدید','اقامت اروپا','خرید ملک در اروپا','گرین کارت آمریکا','بانکداری','حل اختلاف','قراردادهای بین‌المللی','راهکارهای تجاری','ثبت شرکت در اروپا','سایر / استعلام عمومی'],
};

export default function ClientSignIn() {
  const { user, loading, signIn, resetPassword, error, clearError } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Enquiry form state
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiry, setEnquiry] = useState({
    fullName: '', email: '', phone: '', nationality: '',
    country: '', familyMembers: '', service: '', language: 'English', description: '',
    consentContact: false, consentData: false,
  });

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSigningIn(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch {
      // error handled in context
    } finally {
      setSigningIn(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    await resetPassword(resetEmail);
    setResetSent(true);
    setResetLoading(false);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      // Step 1 — always save to Firestore directly (no server needed)
      await addDoc(collection(db, 'enquiries'), {
        ...enquiry,
        status: 'new',
        submittedAt: new Date().toISOString(),
      });

      // Step 2 — try sending emails via API (best-effort, silent fail)
      try {
        await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiry),
        });
      } catch {
        // Email failed silently — enquiry still saved to Firestore
        console.warn('Email send failed, but enquiry was saved to Firestore');
      }

      setEnquirySubmitted(true);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      alert(isRTL
        ? 'خطا در ارسال. لطفاً مستقیماً با info@plucogroup.com تماس بگیرید.'
        : 'Submission failed. Please contact info@plucogroup.com directly.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'پورتال موکل' : 'CLIENT PORTAL'}
        title={isRTL ? 'دسترسی امن موکل و پورتال استعلام محرمانه' : 'Secure Client Access & Confidential Enquiry Portal'}
        subtitle={isRTL
          ? 'موکلین موجود می‌توانند وارد شوند. موکلین جدید می‌توانند استعلام محرمانه ارسال کنند.'
          : 'Existing clients may sign in below. New and prospective clients may submit a confidential enquiry.'}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Sign In ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}
              className="border border-gray-200 rounded-xl p-8"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                  <Lock className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'ورود موکلین موجود' : 'Existing Client Sign In'}
                </h2>
              </div>

              {!resetMode ? (
                <>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'وارد شوید تا به وضعیت پرونده، اسناد و پیام‌های PLUCO GROUP دسترسی داشته باشید.' : 'Sign in to access your case status, documents and messages from PLUCO GROUP.'}
                  </p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'آدرس ایمیل' : 'Email Address'}
                      </label>
                      <input
                        type="email" required dir="ltr"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'رمز عبور' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'} required dir="ltr"
                          value={password} onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button type="button" onClick={() => { setResetMode(true); clearError(); }} className="text-xs underline" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'رمز عبور را فراموش کردید؟' : 'Forgot password?'}
                      </button>
                    </div>
                    <button
                      type="submit" disabled={signingIn}
                      className="w-full py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ backgroundColor: '#071C3C', color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}
                    >
                      {signingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isRTL ? 'ورود امن' : 'Secure Sign In'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'آدرس ایمیل خود را وارد کنید. لینک بازنشانی رمز عبور برایتان ارسال می‌شود.' : 'Enter your email address and we will send you a password reset link.'}
                  </p>
                  {resetSent ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#16A34A' }} />
                      <p className="text-sm" style={{ color: '#16A34A', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'لینک بازنشانی ارسال شد. لطفاً ایمیل خود را بررسی کنید.' : 'Reset link sent. Please check your email.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                          {isRTL ? 'آدرس ایمیل' : 'Email Address'}
                        </label>
                        <input
                          type="email" required dir="ltr"
                          value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600"
                        />
                      </div>
                      <button type="submit" disabled={resetLoading} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                        {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isRTL ? 'ارسال لینک بازنشانی' : 'Send Reset Link'}
                      </button>
                    </form>
                  )}
                  <button onClick={() => { setResetMode(false); setResetSent(false); clearError(); }} className="mt-4 text-xs underline" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? '← بازگشت به ورود' : '← Back to Sign In'}
                  </button>
                </>
              )}

              <p className="text-xs mt-5 leading-relaxed" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? <>در صورت مشکل در ورود با <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a> تماس بگیرید.</>
                  : <>If you experience difficulty signing in, contact <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a>.</>
                }
              </p>
            </motion.div>

            {/* ── New Client Enquiry ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}
              className="border border-gray-200 rounded-xl p-8"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                  <Upload className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'استعلام محرمانه موکل جدید' : 'New Client Confidential Enquiry'}
                </h2>
              </div>

              {enquirySubmitted ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <CheckCircle className="w-12 h-12" style={{ color: '#C9A35A' }} />
                  <h3 className="text-lg font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'استعلام شما دریافت شد' : 'Enquiry Received'}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL
                      ? 'تیم PLUCO GROUP ظرف ۲ روز کاری با شما تماس خواهد گرفت. تمام اطلاعات شما محرمانه است.'
                      : 'The PLUCO GROUP team will be in touch within 2 business days. All information you provided is treated as strictly confidential.'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'فرم زیر را تکمیل کنید. تمام اطلاعات با رازداری کامل رسیدگی می‌شوند.' : 'Complete the form below. All information is treated with strict confidentiality.'}
                  </p>
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'نام کامل *' : 'Full Name *'}</label>
                        <input type="text" required value={enquiry.fullName} onChange={e => setEnquiry(p => ({ ...p, fullName: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'ایمیل *' : 'Email *'}</label>
                        <input type="email" required dir="ltr" value={enquiry.email} onChange={e => setEnquiry(p => ({ ...p, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'تلفن / واتساپ' : 'Phone / WhatsApp'}</label>
                        <input type="tel" dir="ltr" value={enquiry.phone} onChange={e => setEnquiry(p => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'ملیت' : 'Nationality'}</label>
                        <input type="text" value={enquiry.nationality} onChange={e => setEnquiry(p => ({ ...p, nationality: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'خدمات مورد نظر' : 'Preferred Service'}</label>
                      <select value={enquiry.service} onChange={e => setEnquiry(p => ({ ...p, service: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                        <option value="">{isRTL ? 'انتخاب کنید…' : 'Select a service…'}</option>
                        {(isRTL ? serviceOptions.fa : serviceOptions.en).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'توضیح مختصر موضوع' : 'Brief Description of Matter'}</label>
                      <textarea
                        rows={3}
                        value={enquiry.description}
                        onChange={e => setEnquiry(p => ({ ...p, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 resize-none"
                        style={{ fontFamily: isRTL ? ff : undefined }}
                        placeholder={isRTL ? 'موضوع را به صورت کلی توضیح دهید.' : 'Describe your matter in general terms. Do not include sensitive personal data at this stage.'}
                      />
                    </div>
                    <div className="space-y-2">
                      {[
                        [isRTL ? 'موافقت می‌کنم که PLUCO GROUP با من تماس بگیرد.' : 'I consent to PLUCO GROUP contacting me regarding this enquiry.', 'consentContact'],
                        [isRTL ? 'موافقت می‌کنم داده‌های شخصی‌ام برای ارزیابی استعلام پردازش شود.' : 'I consent to PLUCO GROUP processing my personal data to assess this enquiry.', 'consentData'],
                      ].map(([label, field]) => (
                        <label key={field} className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                          <input type="checkbox" required className="rounded mt-0.5 flex-shrink-0" checked={(enquiry as Record<string, unknown>)[field] as boolean} onChange={e => setEnquiry(p => ({ ...p, [field]: e.target.checked }))} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    <button type="submit" disabled={enquiryLoading} className="w-full py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                      {enquiryLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isRTL ? 'ارسال استعلام محرمانه' : 'Submit Confidential Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>

          {/* Confidentiality Notice */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-10 rounded-xl p-6 flex items-start gap-4" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اطلاعیه رازداری' : 'Confidentiality Notice'}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? 'تمامی اطلاعات و اسناد ارسال شده محرمانه تلقی می‌شوند. ارسال استعلام رابطه حقوقی ایجاد نمی‌کند. تعامل رسمی تنها پس از بررسی تعارض منافع، ارزیابی شرایط و توافق شرایط آغاز می‌شود.'
                  : 'All information submitted is treated as confidential and reviewed only for the purpose of assessing the client\'s matter. Submission does not create a legal or advisory relationship. A formal engagement will only begin following completion of conflict checks, eligibility review and agreement of terms.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
