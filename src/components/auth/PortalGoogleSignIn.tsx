'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ensurePortalUser, resolvePortalDestination } from '@/lib/authRouting';

export default function PortalGoogleSignIn() {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { user, loading } = useAuth();
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (loading || !user) return;
    void (async () => {
      try {
        await ensurePortalUser(user);
        const token = await user.getIdToken();
        const claim = await fetch('/api/sales-team/claim', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => response.ok ? response.json() : null).catch(() => null);
        const destination = await resolvePortalDestination(user);
        router.replace(destination === '/dashboard' && claim?.active ? '/sales-team/dashboard' : destination);
      } catch {
        setState('error');
      }
    })();
  }, [loading, router, user]);

  async function signIn() {
    setState('loading');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
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
      <p className="mt-4 text-center text-xs text-slate-500">
        {isRTL ? 'یا با ایمیل ادامه دهید: ' : 'Or continue with email: '}
        <Link className="font-bold text-[#071C3C] underline" href="/login">{isRTL ? 'ورود' : 'Sign in'}</Link>
        {' · '}
        <Link className="font-bold text-[#071C3C] underline" href="/signup">{isRTL ? 'ثبت‌نام' : 'Sign up'}</Link>
      </p>
    </div>
  );
}
