'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ensurePortalUser, resolvePortalDestination } from '@/lib/authRouting';

type Mode = 'login' | 'signup';

function authMessage(code?: string) {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Sign in instead.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'The email or password is incorrect.';
    case 'auth/operation-not-allowed': return 'Email and password access is temporarily unavailable.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait or reset your password.';
    case 'auth/weak-password': return 'Use at least 8 characters, including a letter and a number.';
    default: return 'Authentication could not be completed. Please try again.';
  }
}

export default function PortalEmailAuth({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) return;
    void resolvePortalDestination(user).then((destination) => router.replace(destination));
  }, [loading, router, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'signup') {
      if (name.trim().length < 2) {
        setError('Enter your full name.');
        return;
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Use at least 8 characters, including a letter and a number.');
        return;
      }
      if (password !== confirmPassword) {
        setError('The passwords do not match.');
        return;
      }
    }

    setBusy(true);
    try {
      const authenticatedUser = mode === 'signup'
        ? await signUp(cleanEmail, password, name)
        : await signIn(cleanEmail, password);
      await ensurePortalUser(authenticatedUser, name);
      router.replace(await resolvePortalDestination(authenticatedUser));
    } catch (caught) {
      setError(authMessage((caught as { code?: string })?.code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A35A]">Secure client access</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#071C3C]">
          {mode === 'login' ? 'Sign in to your portal' : 'Create your portal account'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {mode === 'login'
            ? 'Use your registered email and password. Administrators are routed to the admin dashboard automatically.'
            : 'New accounts receive an empty private workspace. Client case access is added after verification by PLUCO GROUP.'}
        </p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          {mode === 'signup' ? (
            <label className="block text-sm font-semibold text-slate-700">
              Full name
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-[#C9A35A]">
                <UserRound className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent outline-none" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
              </span>
            </label>
          ) : null}
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-[#C9A35A]">
              <Mail className="h-4 w-4 text-slate-400" />
              <input className="w-full bg-transparent outline-none" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </span>
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-[#C9A35A]">
              <Lock className="h-4 w-4 text-slate-400" />
              <input className="w-full bg-transparent outline-none" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </span>
          </label>
          {mode === 'signup' ? (
            <label className="block text-sm font-semibold text-slate-700">
              Confirm password
              <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:border-[#C9A35A]">
                <Lock className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent outline-none" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </span>
            </label>
          ) : null}
          {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A35A] px-5 py-3 text-sm font-bold text-[#071C3C] disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link className="font-semibold text-[#071C3C] underline" href={mode === 'login' ? '/signup' : '/login'}>
            {mode === 'login' ? 'Create an account' : 'Already have an account?'}
          </Link>
          <span className="text-slate-300">|</span>
          <Link className="font-semibold text-[#071C3C] underline" href="/client-sign-in">Use Google</Link>
        </div>
      </div>
    </main>
  );
}
