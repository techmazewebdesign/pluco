'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to login
    router.replace('/login');
  }, [router]);

  return null;
}
