'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isRTL } = useLanguage();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(isRTL ? 'لطفا ایمیل خود را وارد کنید' : 'Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isRTL ? 'لطفا ایمیل معتبر وارد کنید' : 'Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isRTL ? 'خطا در ارسال ایمیل' : 'Error sending email'));
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setSubmittedEmail(email);
      setEmail('');
      console.log('Password reset email sent to:', email);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(isRTL ? 'خطا در ارسال ایمیل' : 'Error sending email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 px-4 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: '#15803D' }} />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'ایمیل ارسال شد' : 'Check Your Email'}
            </h2>

            <p style={{ color: '#5E6470' }} className="mb-6">
              {isRTL
                ? `ایمیل بازنشانی رمز عبور به ${submittedEmail} ارسال شد. لطفا صندوق پست خود را بررسی کنید.`
                : `Password reset link sent to ${submittedEmail}. Please check your inbox and spam folder.`}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <p style={{ color: '#1E40AF', fontSize: '14px' }}>
                {isRTL
                  ? '💡 لینک فقط 24 ساعت معتبر است. اگر ایمیل را دریافت نکردید، صندوق spam را بررسی کنید.'
                  : '💡 The link expires in 24 hours. Check your spam folder if you don\'t see the email.'
              }
              </p>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all"
              style={{ backgroundColor: '#071C3C' }}
            >
              {isRTL ? 'بازگشت به ورود' : 'Back to Login'}
            </button>
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
          {/* Back Button */}
          <Link href="/login" className="flex items-center gap-2 mb-8" style={{ color: '#C9A35A' }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">{isRTL ? 'بازگشت' : 'Back'}</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'بازنشانی رمز عبور' : 'Reset Password'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL
                ? 'ایمیل خود را وارد کنید و لینک بازنشانی رمز عبور را دریافت کنید'
                : 'Enter your email to receive a password reset link'
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'ایمیل' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="email"
                    placeholder={isRTL ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    disabled={isLoading}
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
                disabled={isLoading || !email.trim()}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ backgroundColor: '#071C3C' }}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {isRTL ? 'درحال ارسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {isRTL ? 'ارسال لینک بازنشانی' : 'Send Reset Link'}
                  </>
                )}
              </button>
            </form>

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

            <p className="text-center text-sm">
              <span style={{ color: '#5E6470' }}>
                {isRTL ? 'حساب ندارید؟' : "Don't have an account?"}
              </span>
              {' '}
              <Link
                href="/signup"
                className="font-semibold hover:underline"
                style={{ color: '#C9A35A' }}
              >
                {isRTL ? 'ثبت نام' : 'Sign up'}
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#5E6470' }}>
            {isRTL ? 'سوالی دارید؟' : 'Need help?'}{' '}
            <Link href="/contact" className="font-semibold hover:underline" style={{ color: '#C9A35A' }}>
              {isRTL ? 'با ما تماس بگیرید' : 'Contact us'}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
