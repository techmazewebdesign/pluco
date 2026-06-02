'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  User, FolderOpen, MessageSquare, CreditCard,
  LogOut, Menu, X, Home, Bell, CheckCheck, Ticket as TicketIcon,
} from 'lucide-react';
import {
  collection, getDocs, query, orderBy, doc, writeBatch, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ClientNotification } from '@/lib/types';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/types';

const NAV = [
  { href: '/dashboard',         label: 'Overview',   labelFa: 'خلاصه',       Icon: Home },
  { href: '/dashboard',         label: 'Documents',  labelFa: 'اسناد',        Icon: FolderOpen,    tab: 'documents' },
  { href: '/dashboard',         label: 'Messages',   labelFa: 'پیام‌ها',       Icon: MessageSquare, tab: 'messages' },
  { href: '/dashboard',         label: 'Invoices',   labelFa: 'فاکتورها',     Icon: CreditCard,    tab: 'invoices' },
  { href: '/dashboard/tickets', label: 'Tickets',    labelFa: 'تیکت‌ها',       Icon: TicketIcon },
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
  const { user, signOut } = useAuth();
  const { isRTL } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Load notifications when bell opened
  useEffect(() => {
    if (!notifOpen || !user) return;
    const load = async () => {
      setNotifLoading(true);
      try {
        const snap = await getDocs(query(
          collection(db, 'notifications', user.uid, 'items'),
          orderBy('createdAt', 'desc')
        ));
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientNotification)));
      } catch { }
      finally { setNotifLoading(false); }
    };
    load();
  }, [notifOpen, user]);

  // Load count on mount
  useEffect(() => {
    if (!user) return;
    const loadCount = async () => {
      try {
        const snap = await getDocs(query(
          collection(db, 'notifications', user.uid, 'items'),
          where('read', '==', false)
        ));
        setNotifications(prev => {
          // Only update count, not full list
          const unread = snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientNotification));
          return unread;
        });
      } catch { }
    };
    loadCount();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.read);
    if (!unread.length) return;
    try {
      const batch = writeBatch(db);
      unread.forEach(n => batch.update(doc(db, 'notifications', user.uid, 'items', n.id), { read: true }));
      await batch.commit();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { }
  };

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
          const isProfile = item.href === '/dashboard/profile' && pathname === '/dashboard/profile';
          const isDashMain = item.href === '/dashboard' && !item.tab && pathname === '/dashboard';
          const isActive = isProfile || isDashMain;
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
              <span className="flex-1">{isRTL ? item.labelFa : item.label}</span>
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>{unreadCount}</span>
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

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-40" style={{ backgroundColor: '#071C3C', borderRight: '1px solid #0B234A' }}>
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
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

      {/* Notification drawer */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setNotifOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
              <div>
                <h2 className="text-sm font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'اعلان‌ها' : 'Notifications'}
                </h2>
                {unreadNotifCount > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {unreadNotifCount} {isRTL ? 'خوانده نشده' : 'unread'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadNotifCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium" style={{ color: '#C9A35A' }}>
                    <CheckCheck className="w-3.5 h-3.5" />
                    {isRTL ? 'همه خوانده شد' : 'Mark all read'}
                  </button>
                )}
                <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                  <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'اعلانی ندارید' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(n => {
                    const typeCfg = NOTIFICATION_TYPE_LABELS[n.type];
                    return (
                      <div key={n.id} className="px-5 py-4" style={{ backgroundColor: !n.read ? '#FFFBEB' : 'white' }}>
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{typeCfg.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                              {isRTL ? n.titleFa : n.titleEn}
                            </p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                              {isRTL ? n.bodyFa : n.bodyEn}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                              {n.createdAt?.split('T')[0]} · {n.createdByName || 'PLUCO GROUP'}
                            </p>
                          </div>
                          {!n.read && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: '#C9A35A' }} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30" style={{ backgroundColor: '#071C3C', borderColor: '#0B234A' }}>
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg" style={{ color: '#C9A35A' }}>
            <Menu className="w-5 h-5" />
          </button>
          <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={110} height={28} className="h-7 w-auto object-contain" />
          <button onClick={() => setNotifOpen(true)} className="relative p-1.5">
            <Bell className="w-5 h-5" style={{ color: '#C9A35A' }} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: 9 }}>{unreadNotifCount > 9 ? '9+' : unreadNotifCount}</span>
            )}
          </button>
        </div>

        {/* Desktop notification bell (top right of content) */}
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-b" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
          <button onClick={() => setNotifOpen(true)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" style={{ color: '#5E6470' }} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: 9 }}>{unreadNotifCount > 9 ? '9+' : unreadNotifCount}</span>
            )}
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
