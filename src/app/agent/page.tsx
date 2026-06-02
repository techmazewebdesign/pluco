'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAgent } from '@/contexts/AgentContext';

export default function AgentPage() {
  const { isAgent, loadingAgent } = useAgent();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAgent) {
      router.replace(isAgent ? '/agent/dashboard' : '/client-sign-in');
    }
  }, [isAgent, loadingAgent, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
    </div>
  );
}
