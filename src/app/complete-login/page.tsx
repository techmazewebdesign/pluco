'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function CompleteLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Check if user is authenticated
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Get verified email from localStorage
        const verifiedEmail = localStorage.getItem('otp_verified_email');
        const sessionToken = localStorage.getItem('otp_session_token');

        if (!verifiedEmail || !sessionToken) {
          // No verified email, redirect to login
          router.push('/login');
          return;
        }

        // Create a temporary authentication state
        // Store the verified state and redirect to dashboard
        localStorage.setItem('auth_verified', 'true');
        localStorage.setItem('auth_email', verifiedEmail);

        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

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
          {isRTL ? 'خوش آمدید' : 'Welcome Back!'}
        </h2>
        <p style={{ color: '#5E6470' }} className="mb-6">
          {isRTL ? 'در حال انتقال به داشبورد...' : 'Redirecting to your dashboard...'}
        </p>
        <div className="flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A35A] animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-[#C9A35A] animate-bounce animation-delay-100"></span>
          <span className="w-2 h-2 rounded-full bg-[#C9A35A] animate-bounce animation-delay-200"></span>
        </div>
      </motion.div>
    </div>
  );
}
