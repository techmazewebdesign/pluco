'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, UserPlus, Eye, EyeOff, CheckCircle, Loader2, Upload, Shield, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PageHero from '@/components/shared/PageHero';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type AuthMode = 'signin' | 'signup' | 'reset';

const serviceOptions = {
  en: ['New Identity','EU Residency','EU Property Purchase','US Green Card','Banking','Dispute Resolution','International Contracts','Business Solutions','EU Company Registration','Other / General Enquiry'],
  fa: ['هویت جدید','اقامت اروپا','خرید ملک در اروپا','گرین کارت آمریکا','بانکداری','حل اختلاف','قراردادهای بین‌المللی','راهکارهای تجاری','ثبت شرکت در اروپا','سایر / استعلام عمومی'],
};

export default function ClientSignIn() {
  const { user, loading: authLoading, signIn, signUp, resetPassword, error, clearError } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const [mode, setMode] = useState<AuthMode>('signin');
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [localError, setLocalError] = useState('');

  // Sign in fields
  const [siEmail, setSiEmail] = useState('');
  const [siPw, setSiPw] = useState('');

  // Sign up fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPw, setSuPw] = useState('');
  const [suConfirm, setSuConfirm] = useState('');

  // Reset field
  const [resetEmail, setResetEmail] = useState('');

  // Enquiry form
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiry, setEnquiry] = useState({
    fullName: '', email: '', phone: '', nationality: '',
    country: '', familyMembers: '', service: '', language: isRTL ? 'Farsi / Persian' : 'English',
    description: '', consentContact: false, consentData: false,
  });

  useEffect(() => {
    if (!authLoading && user) router.push('/dashboard');
  }, [user, authLoading, router]);

  const switchMode = (m: AuthMode) => {
    setMode(m); clearError(); setLocalError(''); setResetDone(false);
  };

  // ── Sign In ──────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); setLocalError('');
    if (!siEmail.trim() || !siPw) { setLocalError('Please enter your email and password.'); return; }
    setSubmitting(true);
    try {
      await signIn(siEmail, siPw);
      router.push('/dashboard');
    } catch { /* error set in context */ }
    finally { setSubmitting(false); }
  };

  // ── Sign Up ──────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); setLocalError('');
    if (!suName.trim()) { setLocalError('Please enter your full name.'); return; }
    if (!suEmail.trim()) { setLocalError('Please enter your email address.'); return; }
    if (suPw.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
    if (suPw !== suConfirm) { setLocalError('Passwords do not match.'); return; }
    setSubmitting(true);
    try {
      await signUp(suEmail, suPw, suName);
      router.push('/dashboard');
    } catch { /* error set in context */ }
    finally { setSubmitting(false); }
  };

  // ── Reset Password ───────────────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); setLocalError('');
    if (!resetEmail.trim()) { setLocalError('Please enter your email address.'); return; }
    setSubmitting(true);
    try {
      await resetPassword(resetEmail);
      setResetDone(true);
    } catch { /* error set in context */ }
    finally { setSubmitting(false); }
  };

  // ── Enquiry ──────────────────────────────────────────────────────
  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...enquiry, status: 'new', submittedAt: new Date().toISOString(),
      });
      try {
        await fetch('/api/enquiry', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiry),
        });
      } catch { /* email best-effort */ }
      setEnquirySubmitted(true);
    } catch {
      alert(isRTL ? 'خطا. با info@plucogroup.com تماس بگیرید.' : 'Error. Please contact info@plucogroup.com.');
    } finally { setEnquiryLoading(false); }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
    </div>
  );

  const displayError = localError || error || '';

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'پورتال موکل' : 'CLIENT PORTAL'}
        title={isRTL ? 'دسترسی امن موکل' : 'Secure Client Access'}
        subtitle={isRTL
          ? 'وارد شوید، حساب جدید بسازید یا استعلام محرمانه ارسال کنید.'
          : 'Sign in to your account, create a new account, or submit a confidential enquiry.'}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* ── Auth Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Mode tabs */}
              <div className="flex border-b border-gray-100">
                {([
                  { key: 'signin', labelEn: 'Sign In',        labelFa: 'ورود',         Icon: Lock },
                  { key: 'signup', labelEn: 'Create Account', labelFa: 'ثبت نام',      Icon: UserPlus },
                  { key: 'reset',  labelEn: 'Reset Password', labelFa: 'بازنشانی',     Icon: KeyRound },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => switchMode(tab.key)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3.5 text-xs font-medium border-b-2 transition-colors"
                    style={{
                      borderColor: mode === tab.key ? '#C9A35A' : 'transparent',
                      color: mode === tab.key ? '#C9A35A' : '#94A3B8',
                      backgroundColor: mode === tab.key ? '#FFFBEB' : 'white',
                      fontFamily: isRTL ? ff : undefined,
                    }}
                  >
                    <tab.Icon className="w-3.5 h-3.5" />
                    {isRTL ? tab.labelFa : tab.labelEn}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Error banner */}
                <AnimatePresence>
                  {displayError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}
                    >
                      {displayError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Sign In form ── */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'آدرس ایمیل' : 'Email Address'}
                      </label>
                      <input type="email" required dir="ltr" autoComplete="email"
                        value={siEmail} onChange={e => setSiEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'رمز عبور' : 'Password'}
                      </label>
                      <div className="relative">
                        <input type={showPw ? 'text' : 'password'} required dir="ltr" autoComplete="current-password"
                          value={siPw} onChange={e => setSiPw(e.target.value)}
                          placeholder="••••••••"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => switchMode('reset')} className="text-xs underline" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'رمز عبور را فراموش کردید؟' : 'Forgot password?'}
                      </button>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#071C3C', color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {isRTL ? 'ورود امن' : 'Sign In'}
                    </button>
                    <p className="text-center text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'حساب ندارید؟ ' : "Don't have an account? "}
                      <button type="button" onClick={() => switchMode('signup')} className="underline font-semibold" style={{ color: '#C9A35A' }}>
                        {isRTL ? 'ثبت نام کنید' : 'Create one'}
                      </button>
                    </p>
                  </form>
                )}

                {/* ── Sign Up form ── */}
                {mode === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'نام کامل *' : 'Full Name *'}
                      </label>
                      <input type="text" required autoComplete="name"
                        value={suName} onChange={e => setSuName(e.target.value)}
                        placeholder={isRTL ? 'نام و نام خانوادگی' : 'Your full name'}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                        style={{ fontFamily: isRTL ? ff : undefined }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'آدرس ایمیل *' : 'Email Address *'}
                      </label>
                      <input type="email" required dir="ltr" autoComplete="email"
                        value={suEmail} onChange={e => setSuEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'رمز عبور *' : 'Password *'}
                      </label>
                      <div className="relative">
                        <input type={showPw ? 'text' : 'password'} required dir="ltr" autoComplete="new-password"
                          value={suPw} onChange={e => setSuPw(e.target.value)}
                          placeholder={isRTL ? 'حداقل ۶ کاراکتر' : 'Minimum 6 characters'}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                        {isRTL ? 'تأیید رمز عبور *' : 'Confirm Password *'}
                      </label>
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} required dir="ltr" autoComplete="new-password"
                          value={suConfirm} onChange={e => setSuConfirm(e.target.value)}
                          placeholder={isRTL ? 'رمز عبور را تأیید کنید' : 'Repeat your password'}
                          className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none transition-colors ${suConfirm && suPw !== suConfirm ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-yellow-600'}`}
                        />
                        <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {suConfirm && suPw !== suConfirm && (
                        <p className="text-xs mt-1" style={{ color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'رمزها مطابقت ندارند.' : 'Passwords do not match.'}
                        </p>
                      )}
                    </div>
                    <button type="submit" disabled={submitting} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      {isRTL ? 'ساخت حساب' : 'Create Account'}
                    </button>
                    <p className="text-center text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'قبلاً ثبت‌نام کرده‌اید؟ ' : 'Already have an account? '}
                      <button type="button" onClick={() => switchMode('signin')} className="underline font-semibold" style={{ color: '#C9A35A' }}>
                        {isRTL ? 'وارد شوید' : 'Sign in'}
                      </button>
                    </p>
                  </form>
                )}

                {/* ── Reset Password ── */}
                {mode === 'reset' && (
                  <div>
                    {resetDone ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A35A' }} />
                        <h3 className="text-base font-serif font-bold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'لینک ارسال شد' : 'Reset Link Sent'}
                        </h3>
                        <p className="text-sm mb-6" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL
                            ? 'اگر این ایمیل در سیستم ما وجود داشته باشد، لینک بازنشانی رمز عبور ارسال شده است. پوشه اسپم خود را نیز بررسی کنید.'
                            : 'If this email exists in our system, a password reset link has been sent. Please also check your spam folder.'}
                        </p>
                        <button type="button" onClick={() => switchMode('signin')} className="text-xs underline" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? '← بازگشت به ورود' : '← Back to Sign In'}
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleReset} className="space-y-4">
                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL
                            ? 'آدرس ایمیل ثبت‌نام‌شده خود را وارد کنید. لینک بازنشانی رمز عبور برایتان ارسال می‌شود.'
                            : 'Enter your registered email address and we will send you a password reset link.'}
                        </p>
                        <div>
                          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                            {isRTL ? 'آدرس ایمیل' : 'Email Address'}
                          </label>
                          <input type="email" required dir="ltr" autoComplete="email"
                            value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                          />
                        </div>
                        <button type="submit" disabled={submitting} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                          {isRTL ? 'ارسال لینک بازنشانی' : 'Send Reset Link'}
                        </button>
                        <button type="button" onClick={() => switchMode('signin')} className="w-full text-xs text-center underline mt-2" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? '← بازگشت به ورود' : '← Back to Sign In'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Support note */}
                <p className="text-xs mt-6 text-center leading-relaxed" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL
                    ? <>برای پشتیبانی با <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a> تماس بگیرید.</>
                    : <>Need help? Contact <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a></>
                  }
                </p>
              </div>
            </motion.div>

            {/* ── Enquiry Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="border border-gray-200 rounded-xl p-8"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                  <Upload className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'استعلام محرمانه' : 'Confidential Enquiry'}
                </h2>
              </div>

              {enquirySubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10 gap-4">
                  <CheckCircle className="w-12 h-12" style={{ color: '#C9A35A' }} />
                  <h3 className="text-lg font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'استعلام دریافت شد' : 'Enquiry Received'}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL
                      ? 'PLUCO GROUP ظرف ۲ روز کاری با شما تماس خواهد گرفت. اطلاعات شما محرمانه است.'
                      : 'The PLUCO GROUP team will be in touch within 2 business days. All information is strictly confidential.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: isRTL ? 'نام کامل *' : 'Full Name *', field: 'fullName', type: 'text', req: true },
                      { label: isRTL ? 'ایمیل *' : 'Email *', field: 'email', type: 'email', req: true },
                      { label: isRTL ? 'تلفن / واتساپ' : 'Phone / WhatsApp', field: 'phone', type: 'tel', req: false },
                      { label: isRTL ? 'ملیت' : 'Nationality', field: 'nationality', type: 'text', req: false },
                    ].map(({ label, field, type, req }) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{label}</label>
                        <input
                          type={type} required={req} dir={type === 'email' || type === 'tel' ? 'ltr' : undefined}
                          value={(enquiry as unknown as Record<string, string>)[field]}
                          onChange={e => setEnquiry(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600"
                          style={{ fontFamily: isRTL ? ff : undefined }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'خدمات مورد نظر' : 'Preferred Service'}</label>
                    <select value={enquiry.service} onChange={e => setEnquiry(p => ({ ...p, service: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                      <option value="">{isRTL ? 'انتخاب کنید…' : 'Select a service…'}</option>
                      {(isRTL ? serviceOptions.fa : serviceOptions.en).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'توضیح مختصر' : 'Brief Description'}</label>
                    <textarea rows={3} value={enquiry.description} onChange={e => setEnquiry(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 resize-none" style={{ fontFamily: isRTL ? ff : undefined }} placeholder={isRTL ? 'موضوع را به صورت کلی توضیح دهید.' : 'Briefly describe your matter.'} />
                  </div>
                  <div className="space-y-2">
                    {[
                      [isRTL ? 'موافقت با تماس PLUCO GROUP' : 'I consent to PLUCO GROUP contacting me.', 'consentContact'],
                      [isRTL ? 'موافقت با پردازش داده‌ها طبق سیاست حریم خصوصی' : 'I consent to processing of my data per the Privacy Policy.', 'consentData'],
                    ].map(([label, field]) => (
                      <label key={field} className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                        <input type="checkbox" required className="rounded mt-0.5 flex-shrink-0" checked={(enquiry as Record<string, unknown>)[field] as boolean} onChange={e => setEnquiry(p => ({ ...p, [field]: e.target.checked }))} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  <button type="submit" disabled={enquiryLoading} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                    {enquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isRTL ? 'ارسال استعلام محرمانه' : 'Submit Confidential Enquiry'}
                  </button>
                </form>
              )}

              {/* Confidentiality notice */}
              <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL
                    ? 'تمامی اطلاعات محرمانه است. ارسال استعلام رابطه حقوقی ایجاد نمی‌کند.'
                    : 'All information is treated as strictly confidential. Submission does not create a legal relationship with PLUCO GROUP.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
