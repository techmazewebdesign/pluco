'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut, FileText, MessageSquare, CreditCard, Clock,
  CheckCircle, AlertCircle, Upload, Loader2, User,
  ChevronRight, Bell, FolderOpen, Calendar, X, Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  doc, getDoc, collection, getDocs, orderBy, query, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import type { Case, Message, Invoice, ClientProfile, DocumentCategory } from '@/lib/types';
import { DOCUMENT_CATEGORY_LABELS, CASE_STATUS_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/types';
import type { DocumentStatus } from '@/lib/types';

interface UploadedDoc {
  id: string;
  name: string;
  category: DocumentCategory;
  description?: string;
  url: string;
  size: number;
  status: DocumentStatus;
  uploadedAt: string;
}

const STATUS_CFG = CASE_STATUS_LABELS;

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'messages' | 'invoices'>('overview');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingCategory, setPendingCategory] = useState<DocumentCategory>('other');
  const [pendingDescription, setPendingDescription] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/client-sign-in');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setDataLoading(true);
      try {
        const [profileSnap, caseSnap] = await Promise.all([
          getDoc(doc(db, 'clients', user.uid)),
          getDoc(doc(db, 'cases', user.uid)),
        ]);
        if (profileSnap.exists()) setProfile(profileSnap.data() as ClientProfile);
        if (caseSnap.exists()) setCaseData(caseSnap.data() as Case);

        const [msgSnap, invSnap, docSnap] = await Promise.all([
          getDocs(query(collection(db, 'messages', user.uid, 'thread'), orderBy('timestamp', 'desc'))),
          getDocs(query(collection(db, 'invoices', user.uid, 'items'), orderBy('issuedAt', 'desc'))),
          getDocs(query(collection(db, 'documents', user.uid, 'files'), orderBy('uploadedAt', 'desc'))),
        ]);
        setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
        setInvoices(invSnap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
        setDocuments(docSnap.docs.map(d => ({ id: d.id, ...d.data() } as UploadedDoc)));
      } catch (e) { console.error(e); }
      finally { setDataLoading(false); }
    };
    load();
  }, [user]);

  const handleFileSelect = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setUploadError(isRTL ? 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.' : 'File must be under 20MB.');
      return;
    }
    setUploadError(null);
    setPendingFile(file);
  };

  const handleUpload = async () => {
    if (!pendingFile || !user) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      const ext = pendingFile.name.split('.').pop();
      const path = `documents/${user.uid}/${Date.now()}-${pendingFile.name}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, pendingFile);

      await new Promise<void>((resolve, reject) => {
        task.on('state_changed',
          s => setUploadProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
          reject,
          resolve,
        );
      });

      const url = await getDownloadURL(storageRef);
      const docData = {
        clientUid: user.uid,
        name: pendingFile.name,
        category: pendingCategory,
        description: pendingDescription || '',
        url,
        storagePath: path,
        size: pendingFile.size,
        mimeType: pendingFile.type,
        status: 'pending' as DocumentStatus,
        uploadedAt: new Date().toISOString(),
      };
      const newDocRef = await addDoc(collection(db, 'documents', user.uid, 'files'), docData);
      setDocuments(prev => [{ id: newDocRef.id, ...docData }, ...prev]);
      setPendingFile(null);
      setPendingDescription('');
      setPendingCategory('other');
    } catch (e) {
      setUploadError(isRTL ? 'خطا در بارگذاری. لطفاً دوباره تلاش کنید.' : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSignOut = async () => { await signOut(); router.push('/'); };

  if (authLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
    </div>
  );

  const unreadCount = messages.filter(m => !m.read && m.from === 'pluco').length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const statusKey = (caseData?.status || 'pending') as keyof typeof STATUS_CFG;
  const status = STATUS_CFG[statusKey] || STATUS_CFG.pending;

  const tabs: { key: typeof activeTab; label: string; labelFa: string; Icon: React.ElementType; badge?: number }[] = [
    { key: 'overview',  label: 'Overview',  labelFa: 'خلاصه',   Icon: User },
    { key: 'documents', label: 'Documents', labelFa: 'اسناد',    Icon: FolderOpen, badge: pendingDocs },
    { key: 'messages',  label: 'Messages',  labelFa: 'پیام‌ها',   Icon: MessageSquare, badge: unreadCount },
    { key: 'invoices',  label: 'Invoices',  labelFa: 'فاکتورها', Icon: CreditCard, badge: pendingInvoices },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40" style={{ backgroundColor: '#071C3C', borderRight: '1px solid #0B234A' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#0B234A' }}>
          <Link href="/">
            <Image src="/images/logo-pluco.png" alt="PLUCO GROUP" width={130} height={34} className="h-8 w-auto object-contain" />
          </Link>
          <div className="mt-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              {isRTL ? 'پورتال موکل' : 'Client Portal'}
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b" style={{ borderColor: '#0B234A' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              {(profile?.name || user.email || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile?.name || user.email?.split('@')[0]}</p>
              <p className="text-xs truncate" style={{ color: '#64748B' }}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left"
              style={{
                backgroundColor: activeTab === tab.key ? '#0B234A' : 'transparent',
                color: activeTab === tab.key ? '#C9A35A' : '#94A3B8',
                fontFamily: isRTL ? ff : undefined,
              }}
            >
              <tab.Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{isRTL ? tab.labelFa : tab.label}</span>
              {!!tab.badge && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#0B234A' }}>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors" style={{ color: '#94A3B8' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A35A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {isRTL ? 'پروفایل من' : 'My Profile'}
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium w-full" style={{ color: '#64748B' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            {isRTL ? 'وب‌سایت' : 'Website'}
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium" style={{ color: '#64748B' }}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {isRTL ? 'خروج' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main content area (offset by sidebar width) ── */}
      <div className="flex-1 ml-56 min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Top bar */}
        <div className="px-8 py-4 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }} dir={isRTL ? 'rtl' : 'ltr'}>
          <div>
            <h1 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {tabs.find(t => t.key === activeTab)?.[isRTL ? 'labelFa' : 'label']}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={() => setActiveTab('messages')} className="relative p-1.5 rounded-lg hover:bg-gray-100">
                <Bell className="w-4 h-4" style={{ color: '#C9A35A' }} />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontSize: 9 }}>{unreadCount}</span>
              </button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        {dataLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} /></div>
        ) : (
          <>
            {/* ── Overview ── */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-8">
                  <h1 className="text-2xl font-serif font-bold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? `خوش آمدید، ${profile?.name || ''}` : `Welcome, ${profile?.name || user.email?.split('@')[0]}`}
                  </h1>
                  <p className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'وضعیت پرونده و فعالیت‌های اخیر' : 'Your case status and recent activity'}</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { Icon: FileText,      label: isRTL ? 'اسناد بارگذاری شده' : 'Documents Uploaded',  value: documents.length,   color: '#1E40AF' },
                    { Icon: AlertCircle,   label: isRTL ? 'در انتظار بررسی'     : 'Pending Review',       value: pendingDocs,        color: '#9333EA' },
                    { Icon: MessageSquare, label: isRTL ? 'پیام‌های خوانده‌نشده' : 'Unread Messages',     value: unreadCount,        color: '#0F766E' },
                    { Icon: CreditCard,    label: isRTL ? 'فاکتور در انتظار'    : 'Pending Invoices',    value: pendingInvoices,    color: '#C9A35A' },
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
                  {/* Case */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-base font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'وضعیت پرونده' : 'Case Status'}</h2>
                    {caseData ? (
                      <div className="space-y-4">
                        {[
                          [isRTL ? 'خدمات' : 'Service', caseData.service || '—'],
                          [isRTL ? 'مرحله' : 'Stage',   caseData.stage   || '—'],
                        ].map(([l, v]) => (
                          <div key={l} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{l}</span>
                            <span className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{v}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'وضعیت' : 'Status'}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: status.bg, color: status.color, fontFamily: isRTL ? ff : undefined }}>
                            {isRTL ? status.fa : status.en}
                          </span>
                        </div>
                        {caseData.nextDeadline && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'مهلت بعدی' : 'Next Deadline'}</span>
                            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#DC2626' }}><Clock className="w-3.5 h-3.5" />{caseData.nextDeadline}</span>
                          </div>
                        )}
                        {caseData.nextAppointment && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'جلسه بعدی' : 'Next Appointment'}</span>
                            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#1E2430' }}><Calendar className="w-3.5 h-3.5" style={{ color: '#C9A35A' }} />{caseData.nextAppointment}</span>
                          </div>
                        )}
                        {caseData.notes && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold mb-1" style={{ color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'یادداشت:' : 'Note from PLUCO GROUP:'}</p>
                            <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{caseData.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                        <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                          {isRTL ? 'اطلاعات پرونده هنوز بارگذاری نشده است.' : 'Case data not yet loaded. Contact info@plucogroup.com.'}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Recent messages */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'پیام‌های اخیر' : 'Recent Messages'}</h2>
                      <button onClick={() => setActiveTab('messages')} className="text-xs flex items-center gap-1" style={{ color: '#C9A35A' }}>{isRTL ? 'همه' : 'View all'}<ChevronRight className="w-3 h-3" /></button>
                    </div>
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.slice(0, 4).map(msg => (
                          <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: !msg.read && msg.from === 'pluco' ? '#FFF8E8' : '#F8F9FA' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: msg.from === 'pluco' ? '#071C3C' : '#E5E7EB', color: msg.from === 'pluco' ? '#C9A35A' : '#374151' }}>
                              {msg.from === 'pluco' ? 'P' : 'C'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold mb-0.5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{msg.from === 'pluco' ? 'PLUCO GROUP' : (isRTL ? 'شما' : 'You')}</p>
                              <p className="text-xs truncate" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{msg.timestamp}</p>
                            </div>
                            {!msg.read && msg.from === 'pluco' && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#C9A35A' }} />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8"><MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'هنوز پیامی وجود ندارد.' : 'No messages yet.'}</p></div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Documents ── */}
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اسناد پرونده' : 'Case Documents'}</h1>

                {/* Required / Received */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4"><CheckCircle className="w-5 h-5" style={{ color: '#16A34A' }} /><h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اسناد دریافتی' : 'Documents Received'}</h2></div>
                    {caseData?.documentsReceived?.length ? <ul className="space-y-2">{caseData.documentsReceived.map((d, i) => <li key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100 last:border-0"><CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#16A34A' }} /><span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{d}</span></li>)}</ul> : <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'هنوز سندی دریافت نشده.' : 'No documents received yet.'}</p>}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5" style={{ color: '#9333EA' }} /><h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اسناد مورد نیاز' : 'Documents Required'}</h2></div>
                    {caseData?.documentsRequired?.length ? <ul className="space-y-2">{caseData.documentsRequired.map((d, i) => <li key={i} className="flex items-center gap-2 text-sm py-2 border-b border-gray-100 last:border-0"><AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#9333EA' }} /><span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{d}</span></li>)}</ul> : <p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'در حال حاضر سند اضافی نیاز نیست.' : 'No additional documents required.'}</p>}
                  </div>
                </div>

                {/* Upload zone */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h2 className="text-base font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'بارگذاری سند جدید' : 'Upload New Document'}</h2>

                  {!pendingFile ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-yellow-500'}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                    >
                      <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                      <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'فایل را اینجا بکشید یا کلیک کنید' : 'Drag & drop or click to browse'}</p>
                      <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'PDF، JPG، PNG، DOCX · حداکثر ۲۰ مگابایت' : 'PDF, JPG, PNG, DOCX · Max 20MB'}</p>
                      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                        <FileText className="w-8 h-8 flex-shrink-0" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{pendingFile.name}</p>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>{(pendingFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => { setPendingFile(null); setUploadError(null); }} className="p-1 rounded hover:bg-gray-200"><X className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'دسته‌بندی سند *' : 'Document Category *'}</label>
                        <select value={pendingCategory} onChange={e => setPendingCategory(e.target.value as DocumentCategory)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                          {(Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, { en: string; fa: string }][]).map(([key, labels]) => (
                            <option key={key} value={key}>{isRTL ? labels.fa : labels.en}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'توضیحات (اختیاری)' : 'Description (optional)'}</label>
                        <input type="text" value={pendingDescription} onChange={e => setPendingDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" style={{ fontFamily: isRTL ? ff : undefined }} placeholder={isRTL ? 'توضیح مختصری در مورد سند...' : 'Brief description of this document...'} />
                      </div>
                      {uploadError && <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>{uploadError}</p>}
                      {uploading && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'در حال بارگذاری...' : 'Uploading...'}</span>
                            <span className="text-xs font-semibold" style={{ color: '#C9A35A' }}>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%`, backgroundColor: '#C9A35A' }} /></div>
                        </div>
                      )}
                      <button onClick={handleUpload} disabled={uploading} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-110 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isRTL ? 'بارگذاری سند' : 'Upload Document'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Uploaded docs list */}
                {documents.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اسناد بارگذاری شده' : 'Uploaded Documents'}</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {documents.map(doc => {
                        const catLabel = DOCUMENT_CATEGORY_LABELS[doc.category] || { en: doc.category, fa: doc.category };
                        const stLabel = DOCUMENT_STATUS_LABELS[doc.status] || DOCUMENT_STATUS_LABELS.pending;
                        return (
                          <div key={doc.id} className="flex items-center gap-4 px-6 py-4">
                            <FileText className="w-8 h-8 flex-shrink-0" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{doc.name}</p>
                              <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? catLabel.fa : catLabel.en} · {(doc.size / 1024 / 1024).toFixed(2)} MB · {doc.uploadedAt?.split('T')[0]}</p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: stLabel.bg, color: stLabel.color, fontFamily: isRTL ? ff : undefined }}>
                              {isRTL ? stLabel.fa : stLabel.en}
                            </span>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="View document">
                              <Eye className="w-4 h-4" style={{ color: '#5E6470' }} />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Messages ── */}
            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'پیام‌ها' : 'Messages'}</h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {messages.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {messages.map(msg => (
                        <div key={msg.id} className="flex items-start gap-4 p-5" style={{ backgroundColor: !msg.read && msg.from === 'pluco' ? '#FFFBEB' : 'white' }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ backgroundColor: msg.from === 'pluco' ? '#071C3C' : '#E5E7EB', color: msg.from === 'pluco' ? '#C9A35A' : '#374151' }}>{msg.from === 'pluco' ? 'P' : 'C'}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{msg.from === 'pluco' ? (msg.senderName || 'PLUCO GROUP') : (isRTL ? 'شما' : 'You')}</span>
                              <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.timestamp}</span>
                              {!msg.read && msg.from === 'pluco' && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'جدید' : 'New'}</span>}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16"><MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'هنوز پیامی وجود ندارد' : 'No messages yet'}</p></div>
                  )}
                </div>
                <p className="text-xs mt-4 text-center" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'برای ارسال پیام با ' : 'To send a message contact '}<a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a></p>
              </motion.div>
            )}

            {/* ── Invoices ── */}
            {activeTab === 'invoices' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'فاکتورها و پرداخت‌ها' : 'Invoices & Payments'}</h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {invoices.length > 0 ? (
                    <table className="w-full">
                      <thead><tr style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                        {[isRTL?'شرح':'Description',isRTL?'مبلغ':'Amount',isRTL?'تاریخ صدور':'Issued',isRTL?'سررسید':'Due Date',isRTL?'وضعیت':'Status'].map(h=><th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-left" style={{color:'#5E6470',fontFamily:isRTL?ff:undefined,letterSpacing:isRTL?'normal':undefined}}>{h}</th>)}
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map(inv=><tr key={inv.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 text-sm" style={{color:'#1E2430',fontFamily:isRTL?ff:undefined}}>{inv.description}</td>
                          <td className="px-5 py-4 text-sm font-semibold" style={{color:'#1E2430'}}>{inv.amount} {inv.currency}</td>
                          <td className="px-5 py-4 text-xs" style={{color:'#5E6470'}}>{inv.issuedAt||'—'}</td>
                          <td className="px-5 py-4 text-xs" style={{color:inv.status==='pending'?'#DC2626':'#5E6470'}}>{inv.dueDate||'—'}</td>
                          <td className="px-5 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{backgroundColor:inv.status==='paid'?'#DCFCE7':'#FEF3C7',color:inv.status==='paid'?'#15803D':'#92400E',fontFamily:isRTL?ff:undefined}}>{inv.status==='paid'?(isRTL?'پرداخت شده':'Paid'):(isRTL?'در انتظار':'Pending')}</span></td>
                        </tr>)}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16"><CreditCard className="w-12 h-12 mx-auto mb-4" style={{color:'#CBD5E0'}} strokeWidth={1}/><p className="text-sm font-medium" style={{color:'#1E2430',fontFamily:isRTL?ff:undefined}}>{isRTL?'هنوز فاکتوری وجود ندارد':'No invoices yet'}</p></div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}
