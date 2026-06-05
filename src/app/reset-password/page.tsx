'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, AlertCircle, Loader, CheckCircle } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRTL } = useLanguage();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setError(isRTL ? 'لینک نامعتبر است' : 'Invalid reset link');
          return;
        }

        // Call API to verify token
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || (isRTL ? 'لینک نامعتبر است' : 'Invalid reset link'));
          return;
        }

        setTokenValid(true);
        setEmail(data.email);
      } catch (err) {
        console.error('Error verifying token:', err);
        setError(isRTL ? 'خطا در بررسی لینک' : 'Error verifying reset link');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError(isRTL ? 'لطفا رمز عبور جدید را وارد کنید' : 'Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError(isRTL ? 'رمز عبور باید حداقل 6 حرف باشد' : 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(isRTL ? 'رمز عبور و تایید آن مطابقت ندارند' : 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call API to reset password
      const response = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: password,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isRTL ? 'خطا در بازنشانی رمز عبور' : 'Error resetting password'));
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(isRTL ? 'خطا در بازنشانی رمز عبور' : 'Error resetting password');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>{isRTL ? 'درحال بررسی لینک...' : 'Verifying reset link...'}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 px-4 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#DCFCE7' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: '#15803D' }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'رمز عبور بازنشانی شد' : 'Password Reset'}
            </h2>

            <p style={{ color: '#5E6470' }} className="mb-6">
              {isRTL ? 'رمز عبور شما با موفقیت بازنشانی شد. لطفا به صفحه ورود بروید.' : 'Your password has been reset successfully. Redirecting to login...'}
            </p>

            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all"
              style={{ backgroundColor: '#071C3C' }}
            >
              {isRTL ? 'رفتن به ورود' : 'Go to Login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 px-4 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FEE2E2' }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: '#DC2626' }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: '#071C3C' }}>
              {isRTL ? 'لینک نامعتبر' : 'Invalid Link'}
            </h2>

            <p style={{ color: '#5E6470' }} className="mb-6 text-center">
              {error}
            </p>

            <Link
              href="/forgot-password"
              className="w-full py-3 px-4 rounded-lg font-semibold text-center text-white transition-all block"
              style={{ backgroundColor: '#071C3C' }}
            >
              {isRTL ? 'درخواست جدید' : 'Request New Link'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'رمز عبور جدید' : 'New Password'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'رمز عبور جدید برای حساب خود را وارد کنید' : 'Enter your new password'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'رمز عبور جدید' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    placeholder={isRTL ? 'رمز عبور جدید را وارد کنید' : 'Enter new password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] disabled:opacity-50 transition-all ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'تأیید رمز عبور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    placeholder={isRTL ? 'رمز عبور را تأیید کنید' : 'Confirm password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] disabled:opacity-50 transition-all ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    }`}
                    required
                  />
                </div>
              </div>

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

              <button
                type="submit"
                disabled={isSubmitting || !password.trim() || !confirmPassword.trim()}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ backgroundColor: '#071C3C' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {isRTL ? 'درحال بازنشانی...' : 'Resetting...'}
                  </>
                ) : (
                  <>
                    {isRTL ? 'بازنشانی رمز عبور' : 'Reset Password'}
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6">
              <span style={{ color: '#5E6470' }}>
                {isRTL ? 'حساب دارید؟' : 'Have an account?'}
              </span>
              {' '}
              <Link
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: '#C9A35A' }}
              >
                {isRTL ? 'ورود' : 'Sign in'}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#5E6470' }}>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
