'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { LogOut, Users, FileText, MessageSquare, BarChart3, Bot, Zap, Shield, Menu, X, BookOpen, Calendar, BriefcaseBusiness } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isAdminUser } from '@/lib/utils/adminUtils';
import Link from 'next/link';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import RoleBadge from '@/components/shared/RoleBadge';
import DashboardTourProvider from '@/components/tour/DashboardTourProvider';
import { adminDashboardTour, adminDashboardTourFa } from '@/lib/tours/adminDashboardTour';
import GuideMeButton from '@/components/tour/GuideMeButton';
import HelpPanel from '@/components/tour/HelpPanel';
import ConsultationRequestsSection from '@/components/admin/ConsultationRequestsSection';
import EmailConnectionCard from '@/components/admin/EmailConnectionCard';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { isRTL } = useLanguage();

  const [clients, setClients] = useState(0);
  const [leads, setLeads] = useState(0);
  const [cases, setCases] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [persianOverride, setPersianOverride] = useState<boolean | null>(null);
  const persianAdmin = persianOverride ?? isRTL;

  // Check if user is logged in and is admin
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      console.log('[AdminGuard] No user, redirecting to login');
      router.push('/login');
      return;
    }

    const checkAdminAccess = async () => {
      try {
        console.log('[AdminGuard] user:', user.email);

        // Get user profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userProfile = userDocSnap.exists() ? userDocSnap.data() : null;

        console.log('[AdminGuard] profile:', userProfile);

        // Check if admin
        const adminStatus = isAdminUser(userProfile);
        console.log('[AdminGuard] isAdmin:', adminStatus);

        if (!adminStatus) {
          console.log('[AdminGuard] User is not admin, redirecting to /dashboard');
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        setCheckingAdmin(false);
      } catch (error) {
        console.error('[AdminGuard] Error checking admin status:', error);
        router.push('/dashboard');
      }
    };

    checkAdminAccess();
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
        // Dashboard remains usable even when an optional statistic is unavailable.
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

  if (loading || checkingAdmin || !isAdmin) {
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

  const sidebarMenuItems = [
    { titleEn: 'Dashboard', titleFa: 'داشبورد', href: '/admin/dashboard', Icon: BarChart3 },
    { titleEn: 'Enquiry Bookings', titleFa: 'رزروهای درخواست', href: '/admin/dashboard/bookings', Icon: Calendar },
    { titleEn: 'AI Leads', titleFa: 'AI سرنخ‌ها', href: '/admin/dashboard/leads', Icon: Zap },
    { titleEn: 'AI Agents', titleFa: 'AI عوامل', href: '/admin/dashboard/ai-agents', Icon: Bot },
    { titleEn: 'Consultants', titleFa: 'مشاورین', href: '/admin/dashboard/consultants', Icon: Users },
    { titleEn: 'User Management', titleFa: 'مدیریت کاربران', href: '/admin/dashboard/users', Icon: Shield },
    { titleEn: 'Sales Team', titleFa: 'تیم فروش', href: '/sales-team/dashboard', Icon: BriefcaseBusiness },
    { titleEn: 'Training Manual', titleFa: 'راهنمای آموزش', href: '/admin/dashboard/training', Icon: BookOpen },
    { titleEn: 'Activity Logs', titleFa: 'سوابق فعالیت', href: '/admin/dashboard/consultant-activities', Icon: BarChart3 },
    { titleEn: 'Notifications', titleFa: 'اطلاعیه‌ها', href: '/admin/dashboard/notifications', Icon: MessageSquare },
  ];

  const quickAccessItems = [
    { titleEn: 'Enquiry Bookings', titleFa: 'رزروهای درخواست', href: '/admin/dashboard/bookings', Icon: Calendar },
    { titleEn: 'AI Leads', titleFa: 'AI سرنخ‌ها', href: '/admin/dashboard/leads', Icon: Zap },
    { titleEn: 'AI Agents', titleFa: 'AI عوامل', href: '/admin/dashboard/ai-agents', Icon: Bot },
    { titleEn: 'Consultants', titleFa: 'مشاورین', href: '/admin/dashboard/consultants', Icon: Users },
    { titleEn: 'User Management', titleFa: 'مدیریت کاربران', href: '/admin/dashboard/users', Icon: Shield },
    { titleEn: 'Sales Team', titleFa: 'تیم فروش', href: '/sales-team/dashboard', Icon: BriefcaseBusiness },
    { titleEn: 'Training Manual', titleFa: 'راهنمای آموزش', href: '/admin/dashboard/training', Icon: BookOpen },
  ];

  const helpPanelItems = [
    {
      title: 'Dashboard Overview',
      description: 'See at a glance: total clients, pending leads, active cases, and AI agent status.',
      icon: <BarChart3 className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'Enquiry Bookings',
      description: 'View and manage all consultation bookings. Confirm, assign, reschedule, or cancel appointments.',
      icon: <Calendar className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'AI Leads',
      description: 'Review leads generated by the FAQ chatbot. Check conversations, mark as contacted, and manage follow-ups.',
      icon: <Zap className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'AI Agents',
      description: 'Configure and monitor AI agents. Manage chatbot settings, knowledge base, and agent performance.',
      icon: <Bot className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'Consultants',
      description: 'Manage consultant profiles, availability, specializations, and client assignments.',
      icon: <Users className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'User Management',
      description: 'Control user accounts, roles, and permissions. Create, edit, or deactivate user accounts.',
      icon: <Shield className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'Notifications',
      description: 'Check important system alerts, new leads, assigned tasks, and updates.',
      icon: <MessageSquare className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
    {
      title: 'Logout',
      description: 'Securely sign out of the admin dashboard. You will be returned to the login page.',
      icon: <LogOut className="w-5 h-5" style={{ color: '#C9A35A' }} />,
    },
  ];

  const dashboardContent = (
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
          {sidebarMenuItems.map((item) => {
            const { Icon, href, titleEn, titleFa } = item;
            return (
              <Link
                key={titleEn}
                href={href}
                onClick={() => setSidebarOpen(false)}
              >
                <div
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
            data-tour="admin-logout"
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
      <div className="flex-1 w-full">
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
              {isRTL ? 'داشبورد' : 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPersianOverride(!persianAdmin)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-[#071C3C]"
                aria-label="Switch admin guide language"
              >
                {persianAdmin ? 'EN' : 'فارسی'}
              </button>
              <button
                onClick={() => setShowHelpPanel(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
                title="View help panel"
              >
                <BookOpen className="w-5 h-5" style={{ color: '#5E6470' }} />
              </button>
              <GuideMeButton
                onClick={() => (window as Window & { __dashboardTour?: { reopenTour?: () => void } }).__dashboardTour?.reopenTour?.()}
                tourCompleted={tourCompleted}
              />
              <RoleBadge role="admin" email={user?.email} size="sm" />
              <div data-tour="admin-notifications">
                <NotificationDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <EmailConnectionCard />
          <section className="mb-8 grid items-center gap-5 overflow-hidden rounded-2xl border border-[#D7BF83]/50 bg-white p-5 shadow-md lg:grid-cols-[.72fr_1.28fr] lg:p-7" aria-label="PLUCO admin dashboard video guide" dir={persianAdmin ? 'rtl' : 'ltr'}>
            <div>
              <p className="text-xs font-black uppercase tracking-[.14em]" style={{ color: '#9A762F' }}>{persianAdmin ? 'راهنمای ویدیویی مدیریت' : 'Admin video guide'}</p>
              <h2 className="mt-2 text-2xl font-bold" style={{ color: '#071C3C' }}>{persianAdmin ? 'مدیریت موکلان، پیگیری‌ها، نقش‌ها و تیم فروش' : 'Run clients, follow-up, roles and Sales Team hand-offs'}</h2>
              <p className="mt-3 text-sm leading-7" style={{ color: '#5E6470' }}>{persianAdmin ? 'از نمای کلی شروع کنید، موکلان قدیمی را دستی یا با فایل CSV وارد کنید، اقدام بعدی را ثبت کنید و دسترسی پرونده‌ها را محرمانه نگه دارید.' : 'Start with the overview, import a clean client CSV, keep the next action current, protect private case access, and use Desivo when website content needs editing.'}</p>
              <p className="mt-3 text-xs" style={{ color: '#8A93A0' }}>{persianAdmin ? 'روایت و زیرنویس فارسی است. هیچ اطلاعات واقعی موکلان در ویدیو نمایش داده نمی‌شود.' : 'Narrated in clear American English. No private client records are shown.'}</p>
            </div>
            <video key={persianAdmin ? 'fa' : 'en'} className="aspect-video w-full rounded-2xl bg-[#071C3C] shadow-lg" controls preload="metadata" playsInline src={persianAdmin ? '/training/pluco-admin-dashboard-tour-fa.mp4' : '/training/pluco-admin-dashboard-tour.mp4'}>
              {persianAdmin ? <track kind="captions" src="/training/pluco-admin-dashboard-tour-fa.vtt" srcLang="fa" label="فارسی" default /> : null}
              {persianAdmin ? 'مرورگر شما از ویدیوی آموزشی پشتیبانی نمی‌کند.' : 'Your browser does not support the admin tutorial video.'}
            </video>
          </section>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
          >
            {stats.map((stat, index) => {
              const { Icon, color, value, titleEn, titleFa, badge } = stat;
              const dataAttrId = titleEn === 'Total Clients' ? 'admin-total-clients' : titleEn === 'Pending Leads' ? 'admin-pending-leads' : titleEn === 'Active Cases' ? 'admin-active-cases' : 'admin-ai-agents';
              return (
                <motion.div
                  key={titleEn}
                  data-tour={dataAttrId}
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
            data-tour="admin-quick-access"
          >
            <h2 className="text-lg md:text-xl font-serif font-bold mb-4 md:mb-6" style={{ color: '#1E2430' }}>
              {isRTL ? 'دسترسی سریع' : 'Quick Access'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {quickAccessItems.map((item) => {
                const { Icon, href, titleEn, titleFa } = item;
                const dataAttrId = titleEn === 'Enquiry Bookings' ? 'admin-enquiry-bookings' : titleEn === 'AI Leads' ? 'admin-ai-leads' : titleEn === 'AI Agents' ? 'admin-ai-agents-mgmt' : titleEn === 'Consultants' ? 'admin-consultants' : titleEn === 'User Management' ? 'admin-user-management' : 'admin-training';
                return (
                  <Link key={titleEn} href={href}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      data-tour={dataAttrId}
                      className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center"
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

          {/* Consultation Requests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 md:mt-16"
          >
            <ConsultationRequestsSection />
          </motion.div>
        </main>
      </div>
    </div>
  );

  return (
    <>
      <DashboardTourProvider
        userId={user?.uid}
        userRole="admin"
        tour={persianAdmin ? adminDashboardTourFa : adminDashboardTour}
        language={persianAdmin ? 'fa' : 'en'}
        onTourStart={() => {
          setTourCompleted(false);
        }}
        onTourFinish={() => {
          setTourCompleted(true);
        }}
      >
        {dashboardContent}
      </DashboardTourProvider>

      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        title="Admin Dashboard Guide"
        items={helpPanelItems}
      />
    </>
  );
}
