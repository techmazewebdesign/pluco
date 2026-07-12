'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { detectUserRole, getPrimaryDashboardPath, requiresProfileCompletion, getProfileCompletionPath } from '@/lib/utils/roleUtils';

export default function CompleteLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);

      const redirectUser = async () => {
        try {
          console.log('[Auth] current uid:', user.uid);
          console.log('[Auth] email:', user.email);
          console.log('[Auth] Detecting user role...');

          // Detect role using comprehensive role detection system
          const userRole = await detectUserRole(user.uid, user.email || '');
          console.log('[Auth] detected role:', userRole.role);
          console.log('[Auth] normalized role:', userRole.role);
          console.log('[Auth] profileCompleted:', userRole.profileCompleted);

          // Determine redirect path
          let redirectPath = getPrimaryDashboardPath(userRole.role);

          // If profile completion is required and not done, redirect to profile setup
          if (requiresProfileCompletion(userRole.role) && !userRole.profileCompleted) {
            console.log('[Auth] Profile completion required, redirecting to setup...');
            redirectPath = getProfileCompletionPath(userRole.role);
          }

          console.log('[Auth] redirecting to:', redirectPath);

          setTimeout(() => {
            router.push(redirectPath);
          }, 1500);
        } catch (error) {
          console.error('[Auth] Error during redirect:', error);
          // Default to user dashboard on error
          console.log('[Auth] Falling back to /dashboard due to error');
          router.push('/dashboard');
        }
      };

      redirectUser();
    }
  }, [user, loading, isRedirecting, router]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A35A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#071C3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Check Circle Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#C9A35A' }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: '#071C3C' }} />
          </div>
        </motion.div>

        {/* Welcome Text */}
        <h2
          className="text-2xl md:text-3xl font-serif font-bold mb-3"
          style={{ color: '#071C3C' }}
        >
          {isRTL ? 'خوش آمدید' : 'Welcome Back!'}
        </h2>

        {/* Redirect Message */}
        <p style={{ color: '#5E6470' }} className="mb-8 text-sm md:text-base">
          {isRTL
            ? 'درحال انتقال به داشبورد شما...'
            : 'Redirecting to your dashboard...'}
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#C9A35A' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          ></motion.span>
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#C9A35A' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          ></motion.span>
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#C9A35A' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          ></motion.span>
        </div>

        {/* Debug Info (visible in console only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-xs">
            <p style={{ color: '#5E6470' }}>
              <span className="font-semibold">Status:</span> Initializing...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
