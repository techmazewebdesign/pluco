'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, MessageSquare, CreditCard, Clock,
  CheckCircle, AlertCircle, Upload, Loader2, User,
  ChevronRight, FolderOpen, Calendar, X, Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Case, Message, Invoice, ClientProfile, DocumentCategory } from '@/lib/types';
import { DOCUMENT_CATEGORY_LABELS, CASE_STATUS_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/types';
import type { DocumentStatus } from '@/lib/types';

interface UploadedDoc {
  id: string; name: string; category: DocumentCategory; description?: string;
  url: string; size: number; status: DocumentStatus; uploadedAt: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
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
    if (file.size > 20 * 1024 * 1024) { setUploadError(isRTL ? 'حداکثر ۲۰ مگابایت' : 'Max 20MB'); return; }
    setUploadError(null); setPendingFile(file);
  };

  const handleUpload = async () => {
    if (!pendingFile || !user) return;
    setUploading(true); setUploadProgress(0); setUploadError(null);
    try {
      const path = `documents/${user.uid}/${Date.now()}-${pendingFile.name}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, pendingFile);
      await new Promise<void>((res, rej) => task.on('state_changed', s => setUploadProgress(Math.round(s.bytesTransferred / s.totalBytes * 100)), rej, res));
      const url = await getDownloadURL(storageRef);
      const docData = { clientUid: user.uid, name: pendingFile.name, category: pendingCategory, description: pendingDescription || '', url, storagePath: path, size: pendingFile.size, mimeType: pendingFile.type, status: 'pending' as DocumentStatus, uploadedAt: new Date().toISOString() };
      const newRef = await addDoc(collection(db, 'documents', user.uid, 'files'), docData);
      setDocuments(prev => [{ id: newRef.id, ...docData }, ...prev]);
      setPendingFile(null); setPendingDescription(''); setPendingCategory('other');
    } catch { setUploadError(isRTL ? 'خطا در بارگذاری' : 'Upload failed'); }
    finally { setUploading(false); setUploadProgress(0); }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#071C3C' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} />
    </div>
  );

  const unreadCount = messages.filter(m => !m.read && m.from === 'pluco').length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;
  const status = CASE_STATUS_LABELS[caseData?.status || 'pending'] || CASE_STATUS_LABELS.pending;

  const tabs: { key: typeof activeTab; label: string; labelFa: string; Icon: React.ElementType; badge?: number }[] = [
    { key: 'overview',  label: 'Overview',  labelFa: 'خلاصه',    Icon: User },
    { key: 'documents', label: 'Documents', labelFa: 'اسناد',     Icon: FolderOpen, badge: pendingDocs },
    { key: 'messages',  label: 'Messages',  labelFa: 'پیام‌ها',    Icon: MessageSquare, badge: unreadCount },
    { key: 'invoices',  label: 'Invoices',  labelFa: 'فاکتورها',  Icon: CreditCard, badge: pendingInvoices },
  ];

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Scrollable tab bar */}
      <div className="border-b overflow-x-auto" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex min-w-max px-2">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ borderColor: activeTab === tab.key ? '#C9A35A' : 'transparent', color: activeTab === tab.key ? '#C9A35A' : '#94A3B8', fontFamily: isRTL ? ff : undefined }}
            >
              <tab.Icon className="w-4 h-4" />
              {isRTL ? tab.labelFa : tab.label}
              {!!tab.badge && <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>{tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        {dataLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} /></div>
        ) : (
          <>
            {/* ── Overview ── */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? `خوش آمدید، ${profile?.name || ''}` : `Welcome, ${profile?.name || user.email?.split('@')[0]}`}
                  </h1>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { Icon: FileText,      label: isRTL ? 'اسناد' : 'Documents',       value: documents.length, color: '#1E40AF' },
                    { Icon: AlertCircle,   label: isRTL ? 'در انتظار' : 'Pending Review', value: pendingDocs,    color: '#9333EA' },
                    { Icon: MessageSquare, label: isRTL ? 'پیام جدید' : 'Unread',        value: unreadCount,    color: '#0F766E' },
                    { Icon: CreditCard,    label: isRTL ? 'فاکتور' : 'Invoices',          value: pendingInvoices,color: '#C9A35A' },
                  ].map(({ Icon, label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
                        <span className="text-2xl font-bold" style={{ color: '#1E2430' }}>{value}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Case */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-sm font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'وضعیت پرونده' : 'Case Status'}</h2>
                    {caseData ? (
                      <div className="space-y-3">
                        {[[isRTL?'خدمات':'Service', caseData.service||'—'], [isRTL?'مرحله':'Stage', caseData.stage||'—']].map(([l,v])=>(
                          <div key={l} className="flex items-center justify-between gap-4">
                            <span className="text-xs flex-shrink-0" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{l}</span>
                            <span className="text-xs font-semibold text-right" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{v}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs flex-shrink-0" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL?'وضعیت':'Status'}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: status.bg, color: status.color, fontFamily: isRTL ? ff : undefined }}>{isRTL ? status.fa : status.en}</span>
                        </div>
                        {caseData.nextDeadline && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs flex-shrink-0" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL?'مهلت':'Deadline'}</span>
                            <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#DC2626' }}><Clock className="w-3 h-3" />{caseData.nextDeadline}</span>
                          </div>
                        )}
                        {caseData.notes && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{caseData.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                        <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'اطلاعات پرونده در دسترس نیست.' : 'No case data yet. Contact info@plucogroup.com.'}</p>
                      </div>
                    )}
                  </div>
                  {/* Recent messages */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'پیام‌های اخیر':'Recent Messages'}</h2>
                      <button onClick={() => setActiveTab('messages')} className="text-xs flex items-center gap-1" style={{ color: '#C9A35A' }}>{isRTL?'همه':'All'}<ChevronRight className="w-3 h-3" /></button>
                    </div>
                    {messages.length > 0 ? (
                      <div className="space-y-2">
                        {messages.slice(0,3).map(msg => (
                          <div key={msg.id} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ backgroundColor: !msg.read && msg.from==='pluco' ? '#FFF8E8' : '#F8F9FA' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: msg.from==='pluco'?'#071C3C':'#E5E7EB', color: msg.from==='pluco'?'#C9A35A':'#374151' }}>{msg.from==='pluco'?'P':'C'}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{msg.timestamp?.split('T')[0]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6"><MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'پیامی نیست':'No messages yet'}</p></div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Documents ── */}
            {activeTab === 'documents' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="text-lg font-serif font-bold mb-5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'اسناد':'Documents'}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3"><CheckCircle className="w-4 h-4" style={{ color: '#16A34A' }} /><h2 className="text-sm font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'دریافتی':'Received'}</h2></div>
                    {caseData?.documentsReceived?.length ? <ul className="space-y-1.5">{caseData.documentsReceived.map((d,i)=><li key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-gray-100 last:border-0"><CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#16A34A' }} /><span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{d}</span></li>)}</ul> : <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'هنوز سندی نیست':'None yet'}</p>}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4" style={{ color: '#9333EA' }} /><h2 className="text-sm font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'مورد نیاز':'Required'}</h2></div>
                    {caseData?.documentsRequired?.length ? <ul className="space-y-1.5">{caseData.documentsRequired.map((d,i)=><li key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-gray-100 last:border-0"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9333EA' }} /><span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{d}</span></li>)}</ul> : <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'موردی نیست':'None required'}</p>}
                  </div>
                </div>

                {/* Upload */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
                  <h2 className="text-sm font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'بارگذاری سند':'Upload Document'}</h2>
                  {!pendingFile ? (
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver?'border-yellow-500 bg-yellow-50':'border-gray-300 hover:border-yellow-500'}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
                      onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFileSelect(f)}}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                      <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'بکشید یا کلیک کنید':'Drag & drop or tap to browse'}</p>
                      <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>PDF, JPG, PNG, DOCX · Max 20MB</p>
                      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFileSelect(f)}} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                        <FileText className="w-7 h-7 flex-shrink-0" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{pendingFile.name}</p><p className="text-xs" style={{ color: '#94A3B8' }}>{(pendingFile.size/1024/1024).toFixed(2)} MB</p></div>
                        <button onClick={()=>{setPendingFile(null);setUploadError(null)}}><X className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>
                      </div>
                      <select value={pendingCategory} onChange={e=>setPendingCategory(e.target.value as DocumentCategory)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                        {(Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory,{en:string;fa:string}][]).map(([k,l])=><option key={k} value={k}>{isRTL?l.fa:l.en}</option>)}
                      </select>
                      <input type="text" value={pendingDescription} onChange={e=>setPendingDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600" placeholder={isRTL?'توضیحات (اختیاری)':'Description (optional)'} style={{ fontFamily: isRTL ? ff : undefined }} />
                      {uploadError && <p className="text-xs p-2 rounded" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>{uploadError}</p>}
                      {uploading && <div><div className="flex justify-between text-xs mb-1"><span style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL?'در حال بارگذاری...':'Uploading...'}</span><span style={{ color: '#C9A35A' }}>{uploadProgress}%</span></div><div className="w-full bg-gray-200 rounded-full h-1.5"><div className="h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%`, backgroundColor: '#C9A35A' }} /></div></div>}
                      <button onClick={handleUpload} disabled={uploading} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
                        {uploading?<Loader2 className="w-4 h-4 animate-spin"/>:<Upload className="w-4 h-4"/>}
                        {isRTL?'بارگذاری':'Upload'}
                      </button>
                    </div>
                  )}
                </div>

                {/* List */}
                {documents.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100"><h2 className="text-sm font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'بارگذاری شده':'Uploaded'}</h2></div>
                    <div className="divide-y divide-gray-100">
                      {documents.map(d => {
                        const cat = DOCUMENT_CATEGORY_LABELS[d.category]||{en:d.category,fa:d.category};
                        const st = DOCUMENT_STATUS_LABELS[d.status]||DOCUMENT_STATUS_LABELS.pending;
                        return (
                          <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                            <FileText className="w-7 h-7 flex-shrink-0" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate" style={{ color: '#1E2430' }}>{d.name}</p>
                              <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?cat.fa:cat.en} · {(d.size/1024/1024).toFixed(2)}MB</p>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color, fontFamily: isRTL ? ff : undefined }}>{isRTL?st.fa:st.en}</span>
                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-gray-100 flex-shrink-0"><Eye className="w-3.5 h-3.5" style={{ color: '#5E6470' }} /></a>
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
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="text-lg font-serif font-bold mb-5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'پیام‌ها':'Messages'}</h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {messages.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {messages.map(msg=>(
                        <div key={msg.id} className="flex items-start gap-3 p-4" style={{ backgroundColor: !msg.read&&msg.from==='pluco'?'#FFFBEB':'white' }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: msg.from==='pluco'?'#071C3C':'#E5E7EB', color: msg.from==='pluco'?'#C9A35A':'#374151' }}>{msg.from==='pluco'?'P':'C'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{msg.from==='pluco'?(msg.senderName||'PLUCO GROUP'):(isRTL?'شما':'You')}</span>
                              <span className="text-xs" style={{ color: '#94A3B8' }}>{msg.timestamp?.split('T')[0]}</span>
                              {!msg.read&&msg.from==='pluco'&&<span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontFamily: isRTL ? ff : undefined }}>{isRTL?'جدید':'New'}</span>}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12"><MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'پیامی نیست':'No messages yet'}</p></div>
                  )}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'برای تماس: ':'Contact: '}<a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a></p>
              </motion.div>
            )}

            {/* ── Invoices ── */}
            {activeTab === 'invoices' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className="text-lg font-serif font-bold mb-5" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL?'فاکتورها':'Invoices'}</h1>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[480px]">
                        <thead><tr style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E7EB' }}>
                          {[isRTL?'شرح':'Description',isRTL?'مبلغ':'Amount',isRTL?'سررسید':'Due',isRTL?'وضعیت':'Status'].map(h=><th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-left" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL?'normal':'0.05em' }}>{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {invoices.map(inv=><tr key={inv.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{inv.description}</td>
                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1E2430' }}>{inv.amount} {inv.currency}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: inv.status==='pending'?'#DC2626':'#5E6470' }}>{inv.dueDate||'—'}</td>
                            <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: inv.status==='paid'?'#DCFCE7':'#FEF3C7', color: inv.status==='paid'?'#15803D':'#92400E', fontFamily: isRTL ? ff : undefined }}>{inv.status==='paid'?(isRTL?'پرداخت شده':'Paid'):(isRTL?'در انتظار':'Pending')}</span></td>
                          </tr>)}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12"><CreditCard className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-sm" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{isRTL?'فاکتوری نیست':'No invoices yet'}</p></div>
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
