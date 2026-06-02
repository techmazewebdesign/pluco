'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  User, FolderOpen, MessageSquare, CreditCard,
  LogOut, Menu, X, Home, Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV = [
  { href: '/dashboard',         label: 'Overview',   labelFa: 'خلاصه',       Icon: Home },
  { href: '/dashboard',         label: 'Documents',  labelFa: 'اسناد',        Icon: FolderOpen,    tab: 'documents' },
  { href: '/dashboard',         label: 'Messages',   labelFa: 'پیام‌ها',       Icon: MessageSquare, tab: 'messages' },
  { href: '/dashboard',         label: 'Invoices',   labelFa: 'فاکتورها',     Icon: CreditCard,    tab: 'invoices' },
  { href: '/dashboard/profile', label: 'My Profile', labelFa: 'پروفایل من',   Icon: User },
];

interface DashboardShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userPhoto?: string;
  unreadCount?: number;
}

export default function DashboardShell({
  children, userName, userEmail, userPhoto, unreadCount = 0,
}: DashboardShellProps) {
  const { signOut } = useAuth();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#0B234A' }}>
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={130} height={34} className="h-8 w-auto object-contain" />
        </Link>
        <div className="mt-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            {isRTL ? 'پورتال موکل' : 'Client Portal'}
          </span>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#0B234A' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            {userPhoto ? (
              <Image src={userPhoto} alt="" fill className="object-cover" />
            ) : (
              (userName || userEmail || 'C').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName || userEmail?.split('@')[0]}</p>
            <p className="text-xs truncate" style={{ color: '#64748B' }}>{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href && !item.tab || (pathname === '/dashboard' && !item.tab && !NAV.some(n => n.href === '/dashboard' && n.tab && pathname.includes(n.tab)));
          const isProfile = item.href === '/dashboard/profile' && pathname === '/dashboard/profile';
          const isActive = isProfile || (item.href === '/dashboard' && pathname === '/dashboard' && !item.tab ? true : false);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: isActive ? '#0B234A' : 'transparent',
                color: isActive ? '#C9A35A' : '#94A3B8',
                fontFamily: isRTL ? ff : undefined,
              }}
            >
              <item.Icon className="w-4 h-4 flex-shrink-0" />
              {isRTL ? item.labelFa : item.label}
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className="ml-auto w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#0B234A' }}>
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium" style={{ color: '#64748B' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          {isRTL ? 'وب‌سایت' : 'Website'}
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium" style={{ color: '#64748B' }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isRTL ? 'خروج' : 'Sign Out'}
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

      {/* ── Mobile sidebar drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <aside className="relative w-64 flex flex-col z-10" style={{ backgroundColor: '#071C3C' }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: '#94A3B8' }}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30" style={{ backgroundColor: '#071C3C', borderColor: '#0B234A' }}>
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg" style={{ color: '#C9A35A' }}>
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={110} height={28} className="h-7 w-auto object-contain" />
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <div className="relative">
                <Bell className="w-4 h-4" style={{ color: '#C9A35A' }} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontSize: 9 }}>{unreadCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
