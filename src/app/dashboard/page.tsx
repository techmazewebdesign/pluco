'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut, FileText, MessageSquare, CreditCard, Clock,
  CheckCircle, AlertCircle, Upload, Loader2, User,
  ChevronRight, Bell, FolderOpen, Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ── Firestore types ────────────────────────────────────────────────────
interface CaseData {
  service?: string;
  status?: 'pending' | 'in_progress' | 'awaiting_documents' | 'under_review' | 'approved' | 'closed';
  stage?: string;
  documentsReceived?: string[];
  documentsRequired?: string[];
  nextDeadline?: string;
  nextAppointment?: string;
  notes?: string;
  updatedAt?: string;
}

interface Message {
  id: string;
  from: 'pluco' | 'client';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid';
  dueDate?: string;
  issuedAt?: string;
}

interface ClientProfile {
  name?: string;
  nationality?: string;
  country?: string;
  preferredLanguage?: string;
}

// ── Status config ──────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; labelFa: string; color: string; bg: string }> = {
  pending:             { label: 'Pending',              labelFa: 'در انتظار',            color: '#92400E', bg: '#FEF3C7' },
  in_progress:         { label: 'In Progress',          labelFa: 'در حال پیشرفت',        color: '#1E40AF', bg: '#DBEAFE' },
  awaiting_documents:  { label: 'Awaiting Documents',   labelFa: 'در انتظار اسناد',      color: '#9333EA', bg: '#F3E8FF' },
  under_review:        { label: 'Under Review',         labelFa: 'در حال بررسی',         color: '#0F766E', bg: '#CCFBF1' },
  approved:            { label: 'Approved',             labelFa: 'تأیید شده',            color: '#15803D', bg: '#DCFCE7' },
  closed:              { label: 'Closed',               labelFa: 'بسته شده',             color: '#374151', bg: '#F3F4F6' },
};

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'messages' | 'invoices'>('overview');

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/client-sign-in');
    }
  }, [user, authLoading, router]);

  // Load Firestore data
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setDataLoading(true);
      try {
        // Client profile
        const profileSnap = await getDoc(doc(db, 'clients', user.uid));
        if (profileSnap.exists()) setProfile(profileSnap.data() as ClientProfile);

        // Case data
        const caseSnap = await getDoc(doc(db, 'cases', user.uid));
        if (caseSnap.exists()) setCaseData(caseSnap.data() as CaseData);

        // Messages
        const msgQ = query(
          collection(db, 'messages', user.uid, 'thread'),
          orderBy('timestamp', 'desc')
        );
        const msgSnap = await getDocs(msgQ);
        setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));

        // Invoices
        const invQ = query(
          collection(db, 'invoices', user.uid, 'items'),
          orderBy('issuedAt', 'desc')
        );
        const invSnap = await getDocs(invQ);
        setInvoices(invSnap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
      } catch (e) {
        console.error('Firestore load error:', e);
      } finally {
        setDataLoading(false);
      }
    };

    load();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read && m.from === 'pluco').length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const statusKey = caseData?.status || 'pending';
  const status = statusConfig[statusKey] || statusConfig.pending;

  const tabs: { key: 'overview' | 'documents' | 'messages' | 'invoices'; label: string; labelFa: string; Icon: React.ElementType; badge?: number }[] = [
    { key: 'overview',   label: 'Overview',   labelFa: 'خلاصه',    Icon: User },
    { key: 'documents',  label: 'Documents',  labelFa: 'اسناد',     Icon: FolderOpen },
    { key: 'messages',   label: 'Messages',   labelFa: 'پیام‌ها',    Icon: MessageSquare, badge: unreadCount },
    { key: 'invoices',   label: 'Invoices',   labelFa: 'فاکتورها',  Icon: CreditCard, badge: pendingInvoices },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ── Dashboard Header ── */}
      <div style={{ backgroundColor: '#071C3C', borderBottom: '1px solid #0B234A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={140} height={36} className="h-9 w-auto object-contain" />
            </Link>
            <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: '#0B234A', color: '#C9A35A' }}>
              {isRTL ? 'پورتال موکل' : 'Client Portal'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5" style={{ color: '#CBD5E0' }} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>{unreadCount}</span>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs font-medium text-white">{profile?.name || user.email}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#0B234A', color: '#C9A35A' }}>
              <LogOut className="w-3.5 h-3.5" />
              {isRTL ? 'خروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors relative"
                style={{
                  color: activeTab === tab.key ? '#C9A35A' : '#94A3B8',
                  borderColor: activeTab === tab.key ? '#C9A35A' : 'transparent',
                  fontFamily: isRTL ? ff : undefined,
                }}
              >
                <tab.Icon className="w-4 h-4" />
                {isRTL ? tab.labelFa : tab.label}
                {tab.badge ? (
                  <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
          </div>
        ) : (
          <>
            {/* ── Overview ── */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                {/* Welcome */}
                <div className="mb-8">
                  <h1 className="text-2xl font-serif font-bold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? `خوش آمدید، ${profile?.name || ''}` : `Welcome, ${profile?.name || user.email?.split('@')[0]}`}
                  </h1>
                  <p className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'وضعیت پرونده و فعالیت‌های اخیر شما' : 'Your case status and recent activity'}
                  </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { Icon: FileText,     label: isRTL ? 'اسناد دریافتی'  : 'Documents Received',  value: caseData?.documentsReceived?.length ?? 0, color: '#1E40AF' },
                    { Icon: AlertCircle,  label: isRTL ? 'اسناد مورد نیاز' : 'Documents Required',  value: caseData?.documentsRequired?.length ?? 0, color: '#9333EA' },
                    { Icon: MessageSquare,label: isRTL ? 'پیام‌های خوانده‌نشده' : 'Unread Messages', value: unreadCount, color: '#0F766E' },
                    { Icon: CreditCard,   label: isRTL ? 'فاکتور در انتظار' : 'Pending Invoices',  value: pendingInvoices, color: '#C9A35A' },
                  ].map(({ Icon, label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                        <span className="text-2xl font-bold" style={{ color: '#1E2430' }}>{value}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Case status */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-base font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'وضعیت پرونده' : 'Case Status'}
                    </h2>
                    {caseData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'خدمات' : 'Service'}</span>
                          <span className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{caseData.service || '—'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'وضعیت' : 'Status'}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: status.bg, color: status.color, fontFamily: isRTL ? ff : undefined }}>
                            {isRTL ? status.labelFa : status.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'مرحله فعلی' : 'Current Stage'}</span>
                          <span className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{caseData.stage || '—'}</span>
                        </div>
                        {caseData.nextDeadline && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'مهلت بعدی' : 'Next Deadline'}</span>
                            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#DC2626' }}>
                              <Clock className="w-3.5 h-3.5" />
                              {caseData.nextDeadline}
                            </span>
                          </div>
                        )}
                        {caseData.nextAppointment && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'جلسه بعدی' : 'Next Appointment'}</span>
                            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#1E2430' }}>
                              <Calendar className="w-3.5 h-3.5" style={{ color: '#C9A35A' }} />
                              {caseData.nextAppointment}
                            </span>
                          </div>
                        )}
                        {caseData.notes && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold mb-1" style={{ color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'یادداشت از PLUCO GROUP:' : 'Note from PLUCO GROUP:'}</p>
                            <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{caseData.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                        <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'اطلاعات پرونده هنوز بارگذاری نشده است.' : 'Case information has not yet been loaded. Contact info@plucogroup.com for your case reference.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recent messages */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'پیام‌های اخیر' : 'Recent Messages'}
                      </h2>
                      <button onClick={() => setActiveTab('messages')} className="text-xs flex items-center gap-1" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'همه' : 'View all'} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.slice(0, 4).map(msg => (
                          <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: !msg.read && msg.from === 'pluco' ? '#FFF8E8' : '#F8F9FA' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: msg.from === 'pluco' ? '#071C3C' : '#E5E7EB', color: msg.from === 'pluco' ? '#C9A35A' : '#374151' }}>
                              {msg.from === 'pluco' ? 'P' : 'C'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold mb-0.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                                {msg.from === 'pluco' ? 'PLUCO GROUP' : (isRTL ? 'شما' : 'You')}
                              </p>
                              <p className="text-xs truncate" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{msg.timestamp}</p>
                            </div>
                            {!msg.read && msg.from === 'pluco' && (
                              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#C9A35A' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                        <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'هنوز پیامی وجود ندارد.' : 'No messages yet.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Documents ── */}
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'اسناد پرونده' : 'Case Documents'}
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Received */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5" style={{ color: '#16A34A' }} />
                      <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'اسناد دریافتی' : 'Documents Received'}
                      </h2>
                    </div>
                    {caseData?.documentsReceived?.length ? (
                      <ul className="space-y-2">
                        {caseData.documentsReceived.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100 last:border-0">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#16A34A' }} />
                            <span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'هنوز سندی دریافت نشده است.' : 'No documents received yet.'}
                      </p>
                    )}
                  </div>

                  {/* Required */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5" style={{ color: '#9333EA' }} />
                      <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'اسناد مورد نیاز' : 'Documents Still Required'}
                      </h2>
                    </div>
                    {caseData?.documentsRequired?.length ? (
                      <ul className="space-y-2">
                        {caseData.documentsRequired.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100 last:border-0">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#9333EA' }} />
                            <span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'در حال حاضر سند اضافی نیاز نیست.' : 'No additional documents required at this time.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload area */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-base font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? 'بارگذاری سند جدید' : 'Upload New Document'}
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-yellow-600 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'فایل‌ها را اینجا بکشید یا کلیک کنید' : 'Drag & drop files here or click to browse'}
                    </p>
                    <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? 'PDF، JPG، PNG، DOCX · حداکثر ۲۰ مگابایت' : 'PDF, JPG, PNG, DOCX · Max 20MB per file'}
                    </p>
                    <p className="text-xs mt-3" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                      {isRTL
                        ? 'برای بارگذاری امن اسناد با info@plucogroup.com تماس بگیرید.'
                        : 'For secure document submission, please email info@plucogroup.com with your case reference.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Messages ── */}
            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'پیام‌ها' : 'Messages'}
                </h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {messages.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {messages.map(msg => (
                        <div key={msg.id} className="flex items-start gap-4 p-5" style={{ backgroundColor: !msg.read && msg.from === 'pluco' ? '#FFFBEB' : 'white' }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ backgroundColor: msg.from === 'pluco' ? '#071C3C' : '#E5E7EB', color: msg.from === 'pluco' ? '#C9A35A' : '#374151' }}>
                            {msg.from === 'pluco' ? 'P' : 'C'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                                {msg.from === 'pluco' ? 'PLUCO GROUP' : (isRTL ? 'شما' : 'You')}
                              </span>
                              <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.timestamp}</span>
                              {!msg.read && msg.from === 'pluco' && (
                                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontFamily: isRTL ? ff : undefined }}>
                                  {isRTL ? 'جدید' : 'New'}
                                </span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                      <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'هنوز پیامی وجود ندارد' : 'No messages yet'}
                      </p>
                      <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'پیام‌های PLUCO GROUP اینجا نمایش داده می‌شوند.' : 'Messages from PLUCO GROUP will appear here.'}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs mt-4 text-center" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'برای ارسال پیام با ' : 'To send a message contact '}
                  <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a>
                </p>
              </motion.div>
            )}

            {/* ── Invoices ── */}
            {activeTab === 'invoices' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'فاکتورها و پرداخت‌ها' : 'Invoices & Payments'}
                </h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {invoices.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                          {[
                            isRTL ? 'شرح' : 'Description',
                            isRTL ? 'مبلغ' : 'Amount',
                            isRTL ? 'تاریخ صدور' : 'Issued',
                            isRTL ? 'سررسید' : 'Due Date',
                            isRTL ? 'وضعیت' : 'Status',
                          ].map(h => (
                            <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-left" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 text-sm" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{inv.description}</td>
                            <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#1E2430' }}>{inv.amount} {inv.currency}</td>
                            <td className="px-5 py-4 text-xs" style={{ color: '#5E6470' }}>{inv.issuedAt || '—'}</td>
                            <td className="px-5 py-4 text-xs" style={{ color: inv.status === 'pending' ? '#DC2626' : '#5E6470' }}>{inv.dueDate || '—'}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                                backgroundColor: inv.status === 'paid' ? '#DCFCE7' : '#FEF3C7',
                                color: inv.status === 'paid' ? '#15803D' : '#92400E',
                                fontFamily: isRTL ? ff : undefined,
                              }}>
                                {inv.status === 'paid' ? (isRTL ? 'پرداخت شده' : 'Paid') : (isRTL ? 'در انتظار' : 'Pending')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                      <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'هنوز فاکتوری وجود ندارد' : 'No invoices yet'}
                      </p>
                      <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                        {isRTL ? 'فاکتورهای PLUCO GROUP اینجا نمایش داده می‌شوند.' : 'Invoices from PLUCO GROUP will appear here.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
