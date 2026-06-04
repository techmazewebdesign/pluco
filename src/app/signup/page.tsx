'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, signUp, error, clearError } = useAuth();
  const { isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError(isRTL ? 'لطفا نام خود را وارد کنید' : 'Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setValidationError(isRTL ? 'لطفا ایمیل خود را وارد کنید' : 'Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationError(isRTL ? 'لطفا ایمیل معتبر وارد کنید' : 'Please enter a valid email');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setValidationError(isRTL ? 'رمز عبور باید حداقل 6 حرف باشد' : 'Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError(isRTL ? 'رمز عبور و تایید آن مطابقت ندارند' : 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      router.push('/dashboard');
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const inputStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A] disabled:opacity-50';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-32 pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" style={{ color: '#071C3C' }}>
              {isRTL ? 'ثبت نام' : 'Create Account'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'به درگاه موکل PLUCO GROUP خود ترتیب کنید' : 'Set up your PLUCO GROUP client portal'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'نام کامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    name="name"
                    placeholder={isRTL ? 'نام کامل خود را وارد کنید' : 'Enter your full name'}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputStyles} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'ایمیل' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder={isRTL ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputStyles} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'رمز عبور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    name="password"
                    placeholder={isRTL ? 'رمز عبور خود را وارد کنید' : 'Enter password'}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputStyles} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E2430' }}>
                  {isRTL ? 'تایید رمز عبور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder={isRTL ? 'رمز عبور را تایید کنید' : 'Confirm password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${inputStyles} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>

              {/* Validation Error */}
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{validationError}</p>
                </motion.div>
              )}

              {/* Auth Error */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ backgroundColor: '#071C3C' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isRTL ? 'در حال ثبت نام...' : 'Signing up...'}
                  </>
                ) : (
                  <>
                    {isRTL ? 'ثبت نام' : 'Sign up'}
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

            {/* Sign In Link */}
            <p className="text-center text-sm">
              <span style={{ color: '#5E6470' }}>
                {isRTL ? 'حساب کاربری دارید؟' : 'Already have an account?'}
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
