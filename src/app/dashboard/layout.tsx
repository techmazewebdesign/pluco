'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ name?: string; photo?: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/client-sign-in');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'clients', user.uid));
        if (snap.exists()) setProfile(snap.data() as { name?: string; photo?: string });
      } catch { /* ignore */ }
    };
    load();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  return (
    <DashboardShell
      userName={profile?.name || user.displayName || undefined}
      userEmail={user.email || undefined}
      userPhoto={profile?.photo}
      unreadCount={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
