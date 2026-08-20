'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { resolveGooglePortalDestination } from '@/lib/authRouting';

const SUPPRESSION_KEY = 'pluco-one-tap-suppressed';
const ALLOWED_HOSTS = new Set([
  'plucogroup.com',
  'www.plucogroup.com',
  'localhost',
  '127.0.0.1',
]);

export default function GoogleOneTap({ clientId }: { clientId?: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const initialized = useRef(false);

  const handleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) return;

    try {
      window.sessionStorage.removeItem('pluco-logout');
      window.sessionStorage.removeItem(SUPPRESSION_KEY);
      const firebaseCredential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithCredential(auth, firebaseCredential);
      router.replace(await resolveGooglePortalDestination(result.user));
    } catch (error) {
      console.warn('[GoogleOneTap] Sign-in was not completed:', error);
    }
  }, [router]);

  useEffect(() => {
    if (!clientId || !scriptReady || loading || user || initialized.current) return;
    if (!ALLOWED_HOSTS.has(window.location.hostname)) return;
    if (window.sessionStorage.getItem(SUPPRESSION_KEY) === '1') return;
    if (!window.google?.accounts?.id) return;

    initialized.current = true;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: 'signin',
      itp_support: true,
    });
    window.google.accounts.id.prompt();

    return () => window.google?.accounts?.id.cancel();
  }, [clientId, handleCredential, loading, scriptReady, user]);

  if (!clientId) return null;

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptReady(true)}
      onReady={() => setScriptReady(true)}
    />
  );
}
