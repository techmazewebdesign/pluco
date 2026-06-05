'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, RefreshCw, Clock, ArrowRight } from 'lucide-react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRTL } = useLanguage();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Countdown timer for OTP expiration
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

    if (!otp.trim()) {
      setError(isRTL ? 'لطفا کد OTP را وارد کنید' : 'Please enter the OTP code');
      return;
    }

    if (otp.length !== 6) {
      setError(isRTL ? 'کد باید 6 رقم باشد' : 'Code must be 6 digits');
      return;
    }

    setIsVerifying(true);

    try {
      // Check if OTP exists and is valid
      const otpRef = doc(db, 'login_otps', email);
      const otpDoc = await getDoc(otpRef);

      if (!otpDoc.exists()) {
        setError(isRTL ? 'کد OTP معتبر نیست' : 'Invalid OTP code');
        setIsVerifying(false);
        return;
      }

      const data = otpDoc.data();

      // Check if code matches
      if (data.otp !== otp) {
        setError(isRTL ? 'کد OTP اشتباه است' : 'Incorrect OTP code');
        setIsVerifying(false);
        return;
      }

      // Check if code is expired
      if (new Date() > new Date(data.expiresAt)) {
        setError(isRTL ? 'کد OTP منقضی شده است' : 'OTP code has expired');
        setIsVerifying(false);
        return;
      }

      // Delete OTP record (consumed)
      await deleteDoc(otpRef);

      // Complete login
      const completeResponse = await fetch('/api/auth/complete-otp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!completeResponse.ok) {
        throw new Error('Failed to complete login');
      }

      const { sessionToken } = await completeResponse.json();

      // Store verified email and session token
      localStorage.setItem('otp_verified_email', email);
      localStorage.setItem('otp_session_token', sessionToken);
      localStorage.setItem('otp_verified_at', new Date().toISOString());

      // Redirect to final login completion
      setTimeout(() => {
        router.push('/complete-login');
      }, 1500);
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(isRTL ? 'خطا در تایید OTP' : 'Error verifying OTP');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsResending(true);

    try {
      // Call resend OTP API
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || (isRTL ? 'خطا در ارسال OTP' : 'Error sending OTP'));
        setIsResending(false);
        return;
      }

      setResendCooldown(60); // 1 minute cooldown
      setTimeLeft(600); // Reset timer to 10 minutes
    } catch (err) {
      console.error('Resend error:', err);
      setError(isRTL ? 'خطا در ارسال OTP' : 'Error sending OTP');
      setIsResending(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
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
              {isRTL ? 'تایید کد OTP' : 'Verify OTP'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'کد OTP 6 رقمی را وارد کنید' : 'Enter the 6-digit OTP code'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F0EDE6' }}>
              <p className="text-sm" style={{ color: '#5E6470' }}>
                {isRTL ? 'کد OTP برای این آدرس ایمیل ارسال شد:' : 'OTP code sent to:'}
              </p>
              <p className="font-semibold mt-2 break-all" style={{ color: '#071C3C' }}>
                {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'کد OTP' : 'OTP Code'}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#071C3C' }}
              >
                {isVerifying ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRTL ? 'در حال تایید...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    {isRTL ? 'تایید کد' : 'Verify Code'}
                    <ArrowRight className="w-4 h-4" />
                  </>
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
                  : (isRTL ? 'دوباره OTP بفرستید' : 'Resend OTP')}
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

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A35A]"></div></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
