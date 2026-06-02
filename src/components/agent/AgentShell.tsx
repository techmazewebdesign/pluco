'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Inbox, Users, FileSearch,
  FileText, LogOut, ShieldCheck, Menu, X, Flag,
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useAgent } from '@/contexts/AgentContext';
import { AGENT_ROLE_LABELS, ROLE_PERMISSIONS } from '@/lib/types';
import type { AgentRole } from '@/lib/types';

const NAV = [
  { href: '/agent/dashboard',  label: 'Dashboard',        Icon: LayoutDashboard, permission: null },
  { href: '/agent/enquiries',  label: 'Enquiries',        Icon: Inbox,           permission: 'enquiries' },
  { href: '/agent/clients',    label: 'Clients & Cases',  Icon: Users,           permission: 'clients' },
  { href: '/agent/documents',  label: 'Document Review',  Icon: FileSearch,      permission: 'documents' },
  { href: '/agent/followups',  label: 'Follow-Ups',       Icon: Flag,            permission: null },
  { href: '/agent/reports',    label: 'Reports',          Icon: FileText,        permission: 'reports' },
] as const;

export default function AgentShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { agent } = useAgent();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);

  useEffect(() => {
    if (!agent) return;
    const load = async () => {
      try {
        const snap = await getDocs(query(
          collection(db, 'followups'),
          where('status', 'in', ['open', 'in_progress'])
        ));
        setFollowUpCount(snap.size);
      } catch { /* ignore */ }
    };
    load();
  }, [agent]);

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  const role = agent?.role as AgentRole | undefined;
  const roleLabel = role ? AGENT_ROLE_LABELS[role] : null;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#0B234A' }}>
        <Link href="/agent/dashboard" onClick={() => setMobileOpen(false)}>
          <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={130} height={34} className="h-8 w-auto object-contain" />
        </Link>
        <div className="mt-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            Agent Portal
          </span>
        </div>
      </div>

      {/* Agent info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#0B234A' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            {agent?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{agent?.name || user?.email}</p>
            <p className="text-xs truncate" style={{ color: '#C9A35A' }}>{roleLabel?.en || 'Agent'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const allowed = !item.permission || (role && ROLE_PERMISSIONS[role]?.[item.permission as keyof typeof ROLE_PERMISSIONS[AgentRole]]);
          if (!allowed) return null;
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: active ? '#0B234A' : 'transparent', color: active ? '#C9A35A' : '#94A3B8' }}
            >
              <item.Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === '/agent/followups' && followUpCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: '#DC2626', color: 'white' }}>
                  {followUpCount > 9 ? '9+' : followUpCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#0B234A' }}>
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium" style={{ color: '#64748B' }}>
          <ShieldCheck className="w-4 h-4" />Website
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium" style={{ color: '#64748B' }}>
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-40" style={{ backgroundColor: '#071C3C', borderRight: '1px solid #0B234A' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10" style={{ backgroundColor: '#071C3C' }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: '#94A3B8' }}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30" style={{ backgroundColor: '#071C3C', borderColor: '#0B234A' }}>
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg" style={{ color: '#C9A35A' }}>
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={110} height={28} className="h-7 w-auto object-contain" />
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
