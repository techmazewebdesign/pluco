'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LogOut, Users, FileText, MessageSquare, Settings, BarChart3, AlertCircle, Clock, Bot } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { isRTL } = useLanguage();

  const [clients, setClients] = useState(0);
  const [leads, setLeads] = useState(0);
  const [cases, setCases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load admin stats
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const clientsSnap = await getDocs(collection(db, 'clients'));
        setClients(clientsSnap.size);

        const leadsSnap = await getDocs(collection(db, 'email_verifications'));
        setLeads(leadsSnap.size);

        const casesSnap = await getDocs(collection(db, 'cases'));
        setCases(casesSnap.size);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A35A] rounded-full animate-spin"></div>
          <p style={{ color: '#5E6470' }}>{isRTL ? 'درحال بارگذاری...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      titleEn: 'Total Clients',
      titleFa: 'کل موکلین',
      value: clients,
      Icon: Users,
      color: '#1E40AF',
    },
    {
      titleEn: 'Pending Leads',
      titleFa: 'سرنخ‌های منتظر',
      value: leads,
      Icon: FileText,
      color: '#9333EA',
    },
    {
      titleEn: 'Active Cases',
      titleFa: 'پرونده‌های فعال',
      value: cases,
      Icon: MessageSquare,
      color: '#0F766E',
    },
    {
      titleEn: 'AI Agents',
      titleFa: 'AI عوامل',
      value: 1,
      Icon: Bot,
      color: '#C9A35A',
      badge: '🟢 Active',
    },
  ];

  const menuItems = [
    { titleEn: 'View Clients', titleFa: 'مشاهده موکلین', href: '/agent/clients', Icon: Users },
    { titleEn: 'View Cases', titleFa: 'مشاهده پرونده‌ها', href: '/agent/clients', Icon: FileText },
    { titleEn: 'Messages', titleFa: 'پیام‌ها', href: '/agent/enquiries', Icon: MessageSquare },
    { titleEn: 'AI Agents', titleFa: 'AI عوامل', href: '/admin/dashboard/ai-agents', Icon: Bot },
    { titleEn: 'Reports', titleFa: 'گزارش‌ها', href: '/agent/reports', Icon: BarChart3 },
    { titleEn: 'Settings', titleFa: 'تنظیمات', href: '/agent/profile', Icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
              PLUCO Admin
            </h1>
            <p className="text-sm" style={{ color: '#5E6470' }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
            style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
          >
            <LogOut className="w-4 h-4" />
            {isRTL ? 'خروج' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const { Icon, color, value, titleEn, titleFa, badge } = stat;
            return (
              <motion.div
                key={titleEn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold block" style={{ color: '#1E2430' }}>
                      {value}
                    </span>
                    {badge && (
                      <span className="text-xs font-semibold" style={{ color: '#15803D' }}>
                        {badge}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#5E6470' }}>
                  {isRTL ? titleFa : titleEn}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430' }}>
            {isRTL ? 'دسترسی سریع' : 'Quick Access'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {menuItems.map((item) => {
              const { Icon, href, titleEn, titleFa } = item;
              return (
                <Link key={titleEn} href={href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#F0EDE6' }}>
                      <Icon className="w-6 h-6" style={{ color: '#C9A35A' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>
                      {isRTL ? titleFa : titleEn}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-[#071C3C] to-[#0B234A] rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-serif font-bold mb-3">
            {isRTL ? 'خوش آمدید به پنل ادمین' : 'Welcome to Admin Panel'}
          </h3>
          <p className="text-sm opacity-90 max-w-2xl">
            {isRTL
              ? 'از اینجا می‌توانید تمام موکلین، پرونده‌ها، پیام‌ها و گزارش‌ها را مدیریت کنید.'
              : 'Manage all clients, cases, messages, and reports from this centralized admin panel.'}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
