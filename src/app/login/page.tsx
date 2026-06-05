'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, Timestamp } from 'firebase/firestore';
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
      const user = auth.currentUser;
      if (!user) {
        router.push('/dashboard');
        return;
      }

      console.log('=== CHECKING USER ROLE ===');
      console.log('UID:', uid);
      console.log('Email:', user.email);

      // First check Firestore for user role
      let userRole = 'user';
      let found = false;
      let foundLocation = '';

      // Method 1: Check agents collection by UID
      try {
        const agentRef = doc(db, 'agents', uid);
        const agentSnap = await getDoc(agentRef);
        if (agentSnap.exists()) {
          userRole = agentSnap.data()?.role || 'user';
          console.log('✓ Found in agents (by UID) with role:', userRole);
          found = true;
          foundLocation = 'agents-uid';
        }
      } catch (err) {
        console.log('✗ Error checking agents by UID:', err);
      }

      // Method 2: If not found by UID, check agents collection by EMAIL (priority over users)
      if (!found && user.email) {
        try {
          const userEmailLower = user.email.toLowerCase();
          const agentByEmailRef = doc(db, 'agents', userEmailLower);
          const agentByEmailSnap = await getDoc(agentByEmailRef);
          if (agentByEmailSnap.exists()) {
            userRole = agentByEmailSnap.data()?.role || 'user';
            console.log('✓ Found in agents (by email) with role:', userRole);
            found = true;
            foundLocation = 'agents-email';
          }
        } catch (err) {
          console.log('✗ Error checking agents by email:', err);
        }
      }

      // Method 3: If still not found, check users collection by UID
      if (!found) {
        try {
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userRole = userSnap.data()?.role || 'user';
            console.log('✓ Found in users (by UID) with role:', userRole);
            found = true;
            foundLocation = 'users-uid';
          }
        } catch (err) {
          console.log('✗ Error checking users by UID:', err);
        }
      }

      // Method 4: If still not found, search by email in users collection
      if (!found && user.email) {
        try {
          const userEmailLower = user.email.toLowerCase();
          const userByEmailRef = doc(db, 'users', userEmailLower);
          const userByEmailSnap = await getDoc(userByEmailRef);
          if (userByEmailSnap.exists()) {
            userRole = userByEmailSnap.data()?.role || 'user';
            console.log('✓ Found in users (by email) with role:', userRole);
            found = true;
            foundLocation = 'users-email';
          }
        } catch (err) {
          console.log('✗ Error checking users by email:', err);
        }
      }

      if (!found) {
        console.log('⚠ User not found in any collection, creating user document');

        // Create user document if it doesn't exist
        if (user.email) {
          try {
            const userEmailLower = user.email.toLowerCase();
            const userRef = doc(db, 'users', userEmailLower);

            await setDoc(userRef, {
              uid: uid,
              email: userEmailLower,
              displayName: user.displayName || user.email.split('@')[0],
              role: 'user',
              status: 'active',
              createdAt: Timestamp.now(),
              createdVia: user.providerData[0]?.providerId || 'password',
            }, { merge: true });

            console.log('✓ Created new user document for:', userEmailLower);
            foundLocation = 'users-email-created';
          } catch (createErr) {
            console.error('✗ Error creating user document:', createErr);
          }
        }
      }

      console.log('Final role detected:', userRole);
      console.log('Found location:', foundLocation);

      // Redirect based on role
      const roleRoutes: { [key: string]: string } = {
        admin: '/admin/dashboard',
        consultant: '/consultant/dashboard',
        case_manager: '/case-manager/dashboard',
        customer_service: '/customer-service/dashboard',
        document_reviewer: '/document-reviewer/dashboard',
        compliance_officer: '/compliance-officer/dashboard',
        enquiry_handler: '/enquiry-handler/dashboard',
        user: '/dashboard',
        client: '/dashboard',
      };

      const redirectUrl = roleRoutes[userRole] || '/dashboard';
      console.log('Redirecting to:', redirectUrl);
      console.log('=== END ROLE CHECK ===');
      router.push(redirectUrl);
    } catch (err) {
      console.error('=== ERROR IN ROLE CHECK ===');
      console.error('Error:', err);
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

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      console.log('=== STARTING GOOGLE LOGIN ===');
      console.log('Attempting signInWithPopup...');

      let userCredential;
      try {
        // Try popup first
        userCredential = await signInWithPopup(auth, provider);
      } catch (popupErr: any) {
        // If popup blocked, fallback to redirect
        if (popupErr.code === 'auth/popup-blocked') {
          console.log('Popup blocked, falling back to redirect...');
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }

      const user = userCredential.user;

      if (!user.email) {
        throw new Error('Google account does not have email');
      }

      console.log('✓ Google authentication successful');
      console.log('User email:', user.email);
      console.log('User uid:', user.uid);
      console.log('Display name:', user.displayName);
      console.log('Photo URL:', user.photoURL);

      // Check and create/update user profile
      await ensureUserProfileExists(user);

      // Now check role and redirect
      checkAdminAndRedirect(user.uid);
    } catch (err: any) {
      console.error('✗ Google sign-in error:', err);
      console.error('Error code:', err.code);

      let errorMessage = isRTL ? 'خطا در ورود با گوگل' : 'Failed to sign in with Google';

      // Map all error codes to user-friendly messages
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = isRTL
          ? 'پنجره ورود بسته شد. لطفا دوباره سعی کنید'
          : 'Sign-in window was closed. Please try again';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = isRTL
          ? 'پنجره ورود مسدود است. لطفا تنظیمات مرورگر خود را بررسی کنید'
          : 'Sign-in window was blocked. Please check your browser settings';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = isRTL
          ? 'این دامنه برای ورود گوگل مجاز نیست'
          : 'This domain is not authorized for Google sign-in';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = isRTL
          ? 'این ایمیل با روش ورود متفاوتی ثبت شده است'
          : 'This email is already registered with a different sign-in method';
      } else if (err.code === 'auth/operation-not-supported-in-this-environment') {
        errorMessage = isRTL
          ? 'این عملیات در این محیط پشتیبانی نمی‌شود'
          : 'This operation is not supported in this environment';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = isRTL
          ? 'این حساب غیرفعال شده است'
          : 'This account has been disabled';
      } else if (err.message?.includes('email') || err.message?.includes('Email')) {
        errorMessage = isRTL
          ? 'خطا در دریافت ایمیل از حساب گوگل'
          : 'Failed to retrieve email from Google account';
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const ensureUserProfileExists = async (googleUser: any) => {
    try {
      console.log('=== CHECKING/CREATING USER PROFILE ===');

      if (!googleUser.email) {
        throw new Error('Google user has no email');
      }

      const userEmailLower = googleUser.email.toLowerCase();
      const uid = googleUser.uid;

      // First, check if user exists in agents collection by UID
      try {
        const agentByUidRef = doc(db, 'agents', uid);
        const agentByUidSnap = await getDoc(agentByUidRef);
        if (agentByUidSnap.exists()) {
          console.log('✓ User exists in agents (by UID), keeping existing profile');
          return;
        }
      } catch (err) {
        console.log('✗ Error checking agents by UID:', err);
      }

      // Check agents by email
      try {
        const agentByEmailRef = doc(db, 'agents', userEmailLower);
        const agentByEmailSnap = await getDoc(agentByEmailRef);
        if (agentByEmailSnap.exists()) {
          console.log('✓ User exists in agents (by email), keeping existing profile');
          return;
        }
      } catch (err) {
        console.log('✗ Error checking agents by email:', err);
      }

      // Check users collection by UID
      try {
        const userByUidRef = doc(db, 'users', uid);
        const userByUidSnap = await getDoc(userByUidRef);
        if (userByUidSnap.exists()) {
          console.log('✓ User exists in users (by UID), keeping existing profile');
          return;
        }
      } catch (err) {
        console.log('✗ Error checking users by UID:', err);
      }

      // Check users collection by email
      try {
        const userByEmailRef = doc(db, 'users', userEmailLower);
        const userByEmailSnap = await getDoc(userByEmailRef);
        if (userByEmailSnap.exists()) {
          console.log('✓ User exists in users (by email), keeping existing profile');
          return;
        }
      } catch (err) {
        console.log('✗ Error checking users by email:', err);
      }

      // User doesn't exist, create new profile with safe defaults
      console.log('⚠ User profile not found, creating new profile');

      const newUserProfile = {
        uid: uid,
        email: userEmailLower,
        displayName: googleUser.displayName || userEmailLower.split('@')[0],
        photoURL: googleUser.photoURL || null,
        provider: 'google',
        role: 'client', // Always default to client, never admin/consultant
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdVia: 'google',
      };

      // Create in users collection with email as document ID for consistency
      const userRef = doc(db, 'users', userEmailLower);
      await setDoc(userRef, newUserProfile, { merge: true });

      console.log('✓ Created new user profile for:', userEmailLower);
      console.log('Profile:', newUserProfile);
    } catch (err) {
      console.error('✗ Error ensuring user profile exists:', err);
      throw err;
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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pb-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
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
                    href="/forgot-password"
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

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-gray-300 hover:bg-gray-50"
              style={{
                color: '#1E2430',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {isRTL ? 'درحال ورود...' : 'Signing in...'}
                </>
              ) : (
                isRTL ? 'ورود با گوگل' : 'Sign in with Google'
              )}
            </button>

            <p className="text-center text-sm mt-6">
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
