'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Loader } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('=== LOGIN FORM SUBMITTED ===');
    console.log('Email:', email);
    console.log('Password:', password ? '***' : 'empty');

    // Clear previous errors
    setError('');
    setStatusMessage('');

    // Validate inputs
    if (!email.trim()) {
      setError(isRTL ? 'لطفا ایمیل را وارد کنید' : 'Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError(isRTL ? 'لطفا رمز عبور را وارد کنید' : 'Please enter your password');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(isRTL ? 'در حال ورود...' : 'Signing in...');

    try {
      console.log('Step 1: Verifying credentials...');
      setStatusMessage(isRTL ? 'در حال تأیید ایمیل و رمز عبور...' : 'Verifying credentials...');

      const verifyResponse = await fetch('/api/auth/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      console.log('Verify response status:', verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        console.error('Credentials verification failed:', errorData);
        setError(errorData.error || (isRTL ? 'ایمیل یا رمز عبور اشتباه است' : 'Invalid email or password'));
        setIsSubmitting(false);
        setStatusMessage('');
        return;
      }

      const verifyData = await verifyResponse.json();
      console.log('Credentials verified successfully');
      console.log('User email:', verifyData.email);

      console.log('Step 2: Sending OTP...');
      setStatusMessage(isRTL ? 'در حال ارسال کد OTP...' : 'Sending OTP code...');

      const otpResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyData.email }),
      });

      console.log('OTP response status:', otpResponse.status);

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        console.error('OTP send failed:', errorData);
        setError(errorData.error || (isRTL ? 'خطا در ارسال کد OTP' : 'Failed to send OTP'));
        setIsSubmitting(false);
        setStatusMessage('');
        return;
      }

      const otpData = await otpResponse.json();
      console.log('OTP sent successfully');

      console.log('Step 3: Redirecting to OTP verification...');
      setStatusMessage(isRTL ? 'بازگردایی به صفحه تأیید...' : 'Redirecting to verification...');

      // Redirect to OTP verification page
      setTimeout(() => {
        const redirectUrl = `/verify-otp?email=${encodeURIComponent(verifyData.email)}`;
        console.log('Redirecting to:', redirectUrl);
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error details:', err);
      setError(isRTL ? 'خطا در ورود. لطفا دوباره تلاش کنید' : 'Login failed. Please try again.');
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          <p style={{ color: '#5E6470' }}>{isRTL ? 'درحال بارگذاری...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-20 pb-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'ورود' : 'Sign In'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'به درگاه موکل PLUCO GROUP خود وارد شوید' : 'Access your PLUCO GROUP client portal'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
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
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] disabled:opacity-50 transition-all ${
                      isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: '#1E2430' }}>
                    {isRTL ? 'رمز عبور' : 'Password'}
                  </label>
                  <Link
                    href="/contact"
                    className="text-xs hover:underline"
                    style={{ color: '#C9A35A' }}
                  >
                    {isRTL ? 'فراموشی رمز عبور؟' : 'Forgot password?'}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    placeholder={isRTL ? 'رمز عبور خود را وارد کنید' : 'Enter your password'}
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

              {/* Error Message */}
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

              {/* Status Message */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200"
                >
                  <Loader className="w-4 h-4 animate-spin" style={{ color: '#1E40AF' }} />
                  <p className="text-sm" style={{ color: '#1E40AF' }}>
                    {statusMessage}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !email.trim() || !password.trim()}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all mt-6"
                style={{
                  backgroundColor: isSubmitting ? '#5E6470' : '#071C3C',
                  opacity: isSubmitting || (!email.trim() || !password.trim()) ? 0.6 : 1,
                  cursor: isSubmitting || (!email.trim() || !password.trim()) ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && email.trim() && password.trim()) {
                    (e.target as HTMLButtonElement).style.filter = 'brightness(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.filter = 'brightness(1)';
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {isRTL ? 'درحال ورود...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {isRTL ? 'ورود' : 'Sign in'}
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

            {/* Sign Up Link */}
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

          {/* Help */}
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
