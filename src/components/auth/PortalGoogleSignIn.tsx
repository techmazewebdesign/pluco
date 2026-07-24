'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';

const ROLE_ROUTES: Record<string, string> = {
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

async function resolveDestination(uid: string, email: string | null) {
  const normalizedEmail = email?.toLowerCase() || '';
  const references = [
    doc(db, 'agents', uid),
    ...(normalizedEmail ? [doc(db, 'agents', normalizedEmail)] : []),
    doc(db, 'users', uid),
    ...(normalizedEmail ? [doc(db, 'users', normalizedEmail)] : []),
  ];

  for (const reference of references) {
    try {
      const snapshot = await getDoc(reference);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const role = data.is_admin === true || data.isAdmin === true
          ? 'admin'
          : String(data.role || 'user').toLowerCase();
        return ROLE_ROUTES[role] || '/dashboard';
      }
    } catch {
      // Continue to the next known profile location.
    }
  }

  return '/dashboard';
}

export default function PortalGoogleSignIn() {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  async function signIn() {
    setState('loading');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      const destination = await resolveDestination(
        credential.user.uid,
        credential.user.email,
      );
      router.push(destination);
    } catch {
      setState('error');
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <button
        type="button"
        onClick={signIn}
        disabled={state === 'loading'}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        {state === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.56c2.09-1.92 3.28-4.75 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.24 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.52H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.37c1.62 0 3.07.56 4.21 1.64l3.15-3.15A10.56 10.56 0 0 0 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84C6.71 7.3 9.14 5.37 12 5.37Z" />
          </svg>
        )}
        {isRTL ? 'ورود امن با حساب گوگل' : 'Secure sign-in with Google'}
      </button>
      <p className="mt-3 text-center text-xs leading-6 text-slate-500">
        {isRTL
          ? 'ورود فقط برای موکلان و اعضای تیم تأییدشده است.'
          : 'Access is limited to verified PLUCO clients and team members.'}
      </p>
      {state === 'error' ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-center text-xs leading-6 text-red-700">
          {isRTL
            ? 'ورود انجام نشد. لطفاً دوباره تلاش کنید یا با تیم پرونده تماس بگیرید.'
            : 'Sign-in was not completed. Try again or contact your case team.'}
        </p>
      ) : null}
    </div>
  );
}
