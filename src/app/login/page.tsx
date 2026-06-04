'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { isRTL } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        checkAdminAndRedirect(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAdminAndRedirect = async (uid: string) => {
    try {
      const agentDoc = await getDoc(doc(db, 'agents', uid));

      if (agentDoc.exists() && agentDoc.data()?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');

    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to sign in with email:', email);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Reload user to get latest emailVerified status
      await user.reload();

      console.log('User signed in, emailVerified:', user.emailVerified);

      if (!user.emailVerified) {
        console.log('Email not verified, signing out');
        setUnverifiedEmail(user.email || email);
        await signOut(auth);
        setError(
          isRTL
            ? 'لطفا ایمیل خود را تایید کنید تا بتوانید وارد شوید'
            : 'Please verify your email before logging in'
        );
        setIsSubmitting(false);
        return;
      }

      // Email is verified, check admin status and redirect
      console.log('Email verified, checking admin status');
      checkAdminAndRedirect(user.uid);
    } catch (err: any) {
      console.error('Sign in error:', err);

      let errorMessage = isRTL ? 'ایمیل یا رمز عبور اشتباه است' : 'Invalid email or password';

      if (err.code === 'auth/user-not-found') {
        errorMessage = isRTL ? 'حساب کاربری پیدا نشد' : 'Account not found';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = isRTL ? 'رمز عبور اشتباه است' : 'Incorrect password';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = isRTL ? 'حساب کاربری غیرفعال است' : 'Account is disabled';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = isRTL
          ? 'تلاش‌های بیش‌ازحد زیاد. لطفا بعدا دوباره تلاش کنید'
          : 'Too many login attempts. Please try again later';
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setIsResendingEmail(true);
    setError('');

    try {
      console.log('Temporarily signing in to resend verification email');

      // Sign in temporarily to send verification
      const userCredential = await signInWithEmailAndPassword(auth, unverifiedEmail, password);
      const user = userCredential.user;

      console.log('Sending verification email');
      await sendEmailVerification(user);

      console.log('Signing out after sending verification');
      await signOut(auth);

      setError(
        isRTL
          ? 'ایمیل تایید مجددا ارسال شد. لطفا پوشه spam را بررسی کنید'
          : 'Verification email resent. Check your inbox and spam folder'
      );
      setUnverifiedEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(isRTL ? 'خطا در ارسال ایمیل' : 'Failed to resend email');
    } finally {
      setIsResendingEmail(false);
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
              {isRTL ? 'ورود' : 'Sign In'}
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {isRTL ? 'به درگاه موکل PLUCO GROUP خود وارد شوید' : 'Access your PLUCO GROUP client portal'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {unverifiedEmail && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingEmail || isSubmitting}
                  className="w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all border"
                  style={{
                    borderColor: '#C9A35A',
                    color: '#C9A35A',
                    opacity: isResendingEmail ? 0.6 : 1,
                    cursor: isResendingEmail ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isResendingEmail ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      {isRTL ? 'درحال ارسال...' : 'Sending...'}
                    </>
                  ) : (
                    isRTL ? 'ارسال دوباره ایمیل تایید' : 'Resend verification email'
                  )}
                </button>
              )}

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
