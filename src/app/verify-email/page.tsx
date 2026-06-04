'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRTL } = useLanguage();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Countdown timer for code expiration
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError(isRTL ? 'لطفا کد تایید را وارد کنید' : 'Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      setError(isRTL ? 'کد باید 6 رقم باشد' : 'Code must be 6 digits');
      return;
    }

    setIsVerifying(true);

    try {
      // Check if verification code exists and is valid
      const verificationRef = doc(db, 'email_verifications', email);
      const verificationDoc = await getDoc(verificationRef);

      if (!verificationDoc.exists()) {
        setError(isRTL ? 'کد تایید معتبر نیست' : 'Invalid verification code');
        setIsVerifying(false);
        return;
      }

      const data = verificationDoc.data();

      // Check if code matches
      if (data.code !== code) {
        setError(isRTL ? 'کد تایید اشتباه است' : 'Incorrect verification code');
        setIsVerifying(false);
        return;
      }

      // Check if code is expired
      if (new Date() > new Date(data.expiresAt)) {
        setError(isRTL ? 'کد تایید منقضی شده است' : 'Verification code has expired');
        setIsVerifying(false);
        return;
      }

      // Mark user as verified in Firestore
      const userRef = doc(db, 'clients', data.userId);
      await updateDoc(userRef, { emailVerified: true });

      // Delete verification record
      await deleteDoc(verificationRef);

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Verification error:', err);
      setError(isRTL ? 'خطا در تایید ایمیل' : 'Error verifying email');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsResending(true);

    try {
      // Call resend verification email API
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || (isRTL ? 'خطا در ارسال ایمیل' : 'Error sending email'));
        setIsResending(false);
        return;
      }

      setResendCooldown(60); // 1 minute cooldown
      setTimeLeft(600); // Reset timer to 10 minutes
    } catch (err) {
      console.error('Resend error:', err);
      setError(isRTL ? 'خطا در ارسال ایمیل' : 'Error sending email');
      setIsResending(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-32 pb-12 flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C9A35A' }}>
              <CheckCircle className="w-12 h-12" style={{ color: '#071C3C' }} />
            </div>
          </motion.div>
          <h2 className="text-2xl font-serif font-bold mb-3" style={{ color: '#071C3C' }}>
            {isRTL ? 'ایمیل تایید شد' : 'Email Verified!'}
          </h2>
          <p style={{ color: '#5E6470' }} className="mb-6">
            {isRTL ? 'ایمیل شما با موفقیت تایید شد. در حال انتقال به صفحه ورود...' : 'Your email has been verified successfully. Redirecting to login...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-32 pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

      <div className="relative z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0EDE6' }}>
                <Mail className="w-8 h-8" style={{ color: '#C9A35A' }} />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'تایید ایمیل' : 'Verify Email'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'کد تایید 6 رقمی را وارد کنید' : 'Enter the 6-digit verification code'}
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F0EDE6' }}>
              <p className="text-sm" style={{ color: '#5E6470' }}>
                {isRTL ? 'کد تایید برای این آدرس ایمیل ارسال شد:' : 'Verification code sent to:'}
              </p>
              <p className="font-semibold mt-2 break-all" style={{ color: '#071C3C' }}>
                {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* Code Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'کد تایید' : 'Verification Code'}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={isRTL ? '000000' : '000000'}
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#C9A35A] disabled:opacity-50"
                  style={{ letterSpacing: '0.5em' }}
                  disabled={isVerifying}
                />
                <p className="text-xs mt-2 flex items-center gap-2" style={{ color: '#5E6470' }}>
                  <Clock className="w-4 h-4" />
                  {isRTL ? 'منقضی شود در:' : 'Code expires in:'} {minutes}:{seconds.toString().padStart(2, '0')}
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isVerifying || code.length !== 6}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#071C3C' }}
              >
                {isVerifying ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isRTL ? 'در حال تایید...' : 'Verifying...'}
                  </>
                ) : (
                  isRTL ? 'تایید کد' : 'Verify Code'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: '#5E6470' }}>
                  {isRTL ? 'یا' : 'Or'}
                </span>
              </div>
            </div>

            {/* Resend */}
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all border"
              style={{
                borderColor: resendCooldown > 0 ? '#E5E7EB' : '#C9A35A',
                color: resendCooldown > 0 ? '#9CA3AF' : '#C9A35A',
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending
                ? (isRTL ? 'در حال ارسال...' : 'Sending...')
                : resendCooldown > 0
                  ? (isRTL ? `دوباره بفرستید در ${resendCooldown}s` : `Resend in ${resendCooldown}s`)
                  : (isRTL ? 'دوباره ایمیل بفرستید' : 'Resend Email')}
            </button>

            {/* Info */}
            <p className="text-center text-xs mt-6" style={{ color: '#5E6470' }}>
              {isRTL ? 'ایمیل پیدا نشد؟ پوشه spam را بررسی کنید' : "Didn't receive the email? Check your spam folder"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A35A]"></div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
