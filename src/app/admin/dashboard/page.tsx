'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LogOut, Users, FileText, MessageSquare, Settings, BarChart3, AlertCircle, Clock, Bot, Zap, Shield, Menu, X, BookOpen } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import RoleBadge from '@/components/shared/RoleBadge';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { isRTL } = useLanguage();

  const [clients, setClients] = useState(0);
  const [leads, setLeads] = useState(0);
  const [cases, setCases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { titleEn: 'AI Leads', titleFa: 'AI سرنخ‌ها', href: '/admin/dashboard/leads', Icon: Zap },
    { titleEn: 'AI Agents', titleFa: 'AI عوامل', href: '/admin/dashboard/ai-agents', Icon: Bot },
    { titleEn: 'Consultants', titleFa: 'مشاورین', href: '/admin/dashboard/consultants', Icon: Users },
    { titleEn: 'User Management', titleFa: 'مدیریت کاربران', href: '/admin/dashboard/users', Icon: Shield },
    { titleEn: 'Training Manual', titleFa: 'راهنمای آموزش', href: '/admin/dashboard/training', Icon: BookOpen },
    { titleEn: 'Activity Logs', titleFa: 'سوابق فعالیت', href: '/admin/dashboard/consultant-activities', Icon: BarChart3 },
    { titleEn: 'Notifications', titleFa: 'اطلاعیه‌ها', href: '/admin/dashboard/notifications', Icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col md:flex-row" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-64 bg-white ${isRTL ? 'border-l' : 'border-r'} border-gray-200 transform transition-transform duration-300 z-40 md:z-0 md:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : isRTL
              ? 'translate-x-64'
              : '-translate-x-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold" style={{ color: '#071C3C' }}>
            PLUCO
          </h1>
          <p className="text-xs mt-1 truncate" style={{ color: '#5E6470' }}>
            {user?.email}
          </p>
        </div>

        {/* Sidebar Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {[
            { titleEn: 'Dashboard', titleFa: 'داشبورد', href: '/admin/dashboard', Icon: BarChart3 },
            { titleEn: 'AI Leads', titleFa: 'AI سرنخ‌ها', href: '/admin/dashboard/leads', Icon: Zap },
            { titleEn: 'AI Agents', titleFa: 'AI عوامل', href: '/admin/dashboard/ai-agents', Icon: Bot },
            { titleEn: 'Consultants', titleFa: 'مشاورین', href: '/admin/dashboard/consultants', Icon: Users },
            { titleEn: 'User Management', titleFa: 'مدیریت کاربران', href: '/admin/dashboard/users', Icon: Shield },
            { titleEn: 'Training Manual', titleFa: 'راهنمای آموزش', href: '/admin/dashboard/training', Icon: BookOpen },
            { titleEn: 'Activity Logs', titleFa: 'سوابق فعالیت', href: '/admin/dashboard/consultant-activities', Icon: BarChart3 },
            { titleEn: 'Notifications', titleFa: 'اطلاعیه‌ها', href: '/admin/dashboard/notifications', Icon: MessageSquare },
          ].map((item) => {
            const { Icon, href, titleEn, titleFa } = item;
            return (
              <Link key={titleEn} href={href}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{ color: '#5E6470' }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{isRTL ? titleFa : titleEn}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all"
            style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}
          >
            <LogOut className="w-5 h-5" />
            {isRTL ? 'خروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:w-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" style={{ color: '#5E6470' }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: '#5E6470' }} />
              )}
            </button>
            <h1 className="text-xl md:text-2xl font-bold hidden md:block flex-1" style={{ color: '#071C3C' }}>
              Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <RoleBadge role="admin" email={user?.email} size="sm" />
              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
          >
          {stats.map((stat, index) => {
            const { Icon, color, value, titleEn, titleFa, badge } = stat;
            return (
              <motion.div
                key={titleEn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200"
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
            <h2 className="text-lg md:text-xl font-serif font-bold mb-4 md:mb-6" style={{ color: '#1E2430' }}>
              {isRTL ? 'دسترسی سریع' : 'Quick Access'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {menuItems.map((item) => {
              const { Icon, href, titleEn, titleFa } = item;
              return (
                <motion.div
                  key={titleEn}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <Link href={href} className="h-full">
                    <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#F0EDE6' }}>
                        <Icon className="w-6 h-6" style={{ color: '#C9A35A' }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#1E2430' }}>
                        {isRTL ? titleFa : titleEn}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 md:mt-12 bg-gradient-to-r from-[#071C3C] to-[#0B234A] rounded-xl p-6 md:p-8 text-white"
          >
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">
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
    </div>
  );
}
