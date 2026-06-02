'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAgent } from '@/contexts/AgentContext';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAgent, loadingAgent } = useAgent();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading || loadingAgent) return;
    if (!user) { router.push('/client-sign-in'); return; }
    if (!isAgent && pathname !== '/agent') { router.push('/'); }
  }, [user, isAgent, authLoading, loadingAgent, pathname, router]);

  if (authLoading || loadingAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  return <>{children}</>;
}
