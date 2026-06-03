'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Send, ChevronLeft, Loader2, Ticket as TicketIcon,
  Clock, CheckCircle, MessageSquare, AlertCircle,
} from 'lucide-react';
import {
  collection, addDoc, getDocs, query, orderBy,
  doc, getDoc, updateDoc, increment, serverTimestamp, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Ticket, TicketMessage, TicketCategory, TicketPriority } from '@/lib/types';
import {
  TICKET_CATEGORY_LABELS, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS,
} from '@/lib/types';

const CATEGORIES: TicketCategory[] = ['general','case_update','document','banking','billing','immigration','technical','urgent'];

let ticketCounter = 0;
async function generateTicketNumber(): Promise<string> {
  const n = Date.now().toString().slice(-6);
  return `TKT-${n}`;
}

export default function ClientTickets() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const bottomRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<'list' | 'new' | 'thread'>('list');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('general');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [replyError, setReplyError] = useState('');

  // Load ticket list
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(
          collection(db, 'tickets'),
          where('clientUid', '==', user.uid),
          orderBy('createdAt', 'desc'),
        ));
        setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  // Load thread
  const openTicket = async (ticket: Ticket) => {
    setSelected(ticket); setView('thread'); setMsgLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db, 'tickets', ticket.id, 'messages'),
        orderBy('timestamp', 'asc'),
      ));
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as TicketMessage)));
      // Mark agent messages as read
      await updateDoc(doc(db, 'tickets', ticket.id), { unreadClient: 0 });
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unreadClient: 0 } : t));
    } catch (e) { console.error(e); }
    finally { setMsgLoading(false); }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreate = async () => {
    if (!user || !subject.trim() || !description.trim()) return;
    setCreating(true); setError('');
    try {
      const snap = await getDoc(doc(db, 'clients', user.uid));
      const profile = snap.exists() ? snap.data() : {};
      const ticketNumber = await generateTicketNumber();
      const ticket: Omit<Ticket, 'id'> = {
        ticketNumber, subject: subject.trim(), category, priority,
        status: 'open', description: description.trim(),
        clientUid: user.uid, clientName: profile.name || user.email || '',
        clientEmail: user.email || '', language: isRTL ? 'fa' : 'en',
        createdAt: new Date().toISOString(), unreadAgent: 1, unreadClient: 0,
      };
      const ref = await addDoc(collection(db, 'tickets'), ticket);
      await addDoc(collection(db, 'tickets', ref.id, 'messages'), {
        from: 'client', senderName: profile.name || user.email || 'Client',
        senderUid: user.uid, content: description.trim(),
        timestamp: new Date().toISOString(), readByAgent: false, readByClient: true,
      });
      const newTicket = { id: ref.id, ...ticket };
      setTickets(prev => [newTicket, ...prev]);
      setSubject(''); setDescription(''); setCategory('general'); setPriority('medium');
      await openTicket(newTicket);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code || String(e);
      const msg = code === 'permission-denied' ? 'Permission denied. Check Firestore security rules.' : `Failed: ${code}`;
      setError(msg);
      console.error('Ticket creation error:', e);
    }
    finally { setCreating(false); }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected || !user) return;
    setSending(true); setReplyError('');
    try {
      const snap = await getDoc(doc(db, 'clients', user.uid));
      const profile = snap.exists() ? snap.data() : {};
      const msg: Omit<TicketMessage, 'id'> = {
        from: 'client', senderName: profile.name || user.email || 'Client',
        senderUid: user.uid, content: reply.trim(),
        timestamp: new Date().toISOString(), readByAgent: false, readByClient: true,
      };
      const ref = await addDoc(collection(db, 'tickets', selected.id, 'messages'), msg);
      await updateDoc(doc(db, 'tickets', selected.id), {
        updatedAt: new Date().toISOString(), unreadAgent: increment(1),
        status: selected.status === 'waiting_client' ? 'in_progress' : selected.status,
      });
      setMessages(prev => [...prev, { id: ref.id, ...msg }]);
      setReply('');
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code || String(e);
      const msg = code === 'permission-denied' ? 'Permission denied. Check Firestore rules.' : `Failed: ${code}`;
      setReplyError(msg);
      console.error('Reply error:', e);
    }
    finally { setSending(false); }
  };

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white";
  const totalUnread = tickets.reduce((s, t) => s + (t.unreadClient || 0), 0);

  // ── List view ──────────────────────────────────────────────────────────
  if (view === 'list') return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'تیکت‌های پشتیبانی' : 'Support Tickets'}
          </h1>
          <p className="text-xs mt-1" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'مکاتبه مستقیم با تیم PLUCO GROUP' : 'Direct communication with the PLUCO GROUP team'}
          </p>
        </div>
        <button onClick={() => setView('new')} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg hover:brightness-110 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
          <Plus className="w-4 h-4" />
          {isRTL ? 'تیکت جدید' : 'New Ticket'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin" style={{ color: '#C9A35A' }} /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <TicketIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
          <p className="text-sm font-medium mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'هنوز تیکتی ندارید' : 'No tickets yet'}
          </p>
          <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'برای شروع یک تیکت جدید ایجاد کنید.' : 'Create a new ticket to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const st = TICKET_STATUS_LABELS[ticket.status];
            const cat = TICKET_CATEGORY_LABELS[ticket.category];
            const pr = TICKET_PRIORITY_LABELS[ticket.priority];
            return (
              <button key={ticket.id} onClick={() => openTicket(ticket)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
                style={{ borderLeft: `4px solid ${pr.color}` }}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{ticket.ticketNumber}</span>
                      <span className="text-xs" style={{ color: cat.icon ? '#5E6470' : '#5E6470' }}>{cat.icon} {isRTL ? cat.fa : cat.en}</span>
                    </div>
                    <p className="text-sm font-semibold truncate" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{ticket.subject}</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{ticket.createdAt?.split('T')[0]}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(ticket.unreadClient || 0) > 0 && (
                      <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#DC2626', color: 'white' }}>{ticket.unreadClient}</span>
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color, fontFamily: isRTL ? ff : undefined }}>
                      {isRTL ? st.fa : st.en}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── New ticket ─────────────────────────────────────────────────────────
  if (view === 'new') return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-xs mb-5" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
        <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        {isRTL ? 'بازگشت' : 'Back to tickets'}
      </button>
      <h1 className="text-xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
        {isRTL ? 'تیکت جدید' : 'New Support Ticket'}
      </h1>
      {error && (
        <div className="mb-4 p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
          ⚠ {error}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
            {isRTL ? 'موضوع *' : 'Subject *'}
          </label>
          <input value={subject} onChange={e => setSubject(e.target.value)} className={inp} style={{ fontFamily: isRTL ? ff : undefined }}
            placeholder={isRTL ? 'عنوان تیکت...' : 'Brief title of your issue...'} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
              {isRTL ? 'دسته‌بندی' : 'Category'}
            </label>
            <select value={category} onChange={e => setCategory(e.target.value as TicketCategory)} className={inp} style={{ fontFamily: isRTL ? ff : undefined }}>
              {CATEGORIES.map(c => {
                const l = TICKET_CATEGORY_LABELS[c];
                return <option key={c} value={c}>{l.icon} {isRTL ? l.fa : l.en}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
              {isRTL ? 'اولویت' : 'Priority'}
            </label>
            <div className="flex gap-2">
              {(['low','medium','high','urgent'] as TicketPriority[]).map(p => {
                const l = TICKET_PRIORITY_LABELS[p];
                return (
                  <button key={p} onClick={() => setPriority(p)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg border transition-all"
                    style={{ borderColor: priority === p ? l.color : '#E5E7EB', backgroundColor: priority === p ? `${l.color}15` : 'white', color: priority === p ? l.color : '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    {isRTL ? l.fa : l.en}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
            {isRTL ? 'توضیحات *' : 'Description *'}
          </label>
          <textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} className={inp}
            style={{ fontFamily: isRTL ? ff : undefined, resize: 'none' }}
            placeholder={isRTL ? 'موضوع را به تفصیل شرح دهید...' : 'Describe your issue in detail. Include any relevant case references, dates, or document names.'} />
        </div>
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs mb-3" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? 'تمامی ارتباطات محرمانه است.' : 'All communications are strictly confidential.'}
          </p>
          <button onClick={handleCreate} disabled={creating || !subject.trim() || !description.trim()}
            className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all"
            style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <TicketIcon className="w-4 h-4" />}
            {isRTL ? 'ارسال تیکت' : 'Submit Ticket'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Thread view ────────────────────────────────────────────────────────
  if (view === 'thread' && selected) {
    const st = TICKET_STATUS_LABELS[selected.status];
    const cat = TICKET_CATEGORY_LABELS[selected.category];
    return (
      <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 100px)' }} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Thread header */}
        <div className="px-4 sm:px-6 py-4 border-b bg-white flex items-start gap-3" style={{ borderColor: '#E5E7EB' }}>
          <button onClick={() => setView('list')} className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0">
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} style={{ color: '#5E6470' }} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{selected.ticketNumber}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: st.bg, color: st.color, fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? st.fa : st.en}
              </span>
              <span className="text-xs" style={{ color: '#5E6470' }}>{cat.icon} {isRTL ? cat.fa : cat.en}</span>
            </div>
            <p className="text-sm font-bold mt-0.5 truncate" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{selected.subject}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ backgroundColor: '#F8F9FA' }}>
          {msgLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
          ) : messages.map(msg => {
            const isClient = msg.from === 'client';
            return (
              <div key={msg.id} className={`flex gap-3 ${isClient ? (isRTL ? 'flex-row-reverse' : 'flex-row-reverse') : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: isClient ? '#C9A35A' : '#071C3C', color: isClient ? '#071C3C' : '#C9A35A' }}>
                  {isClient ? (msg.senderName?.charAt(0).toUpperCase() || 'C') : 'P'}
                </div>
                <div className={`max-w-[75%] ${isClient ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: isClient ? '#071C3C' : 'white', border: isClient ? 'none' : '1px solid #E5E7EB' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: isClient ? '#C9A35A' : '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                      {isClient ? (isRTL ? 'شما' : 'You') : (msg.senderName || 'PLUCO GROUP')}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: isClient ? '#E2E8F0' : '#374151', fontFamily: isRTL ? ff : undefined }}>{msg.content}</p>
                  </div>
                  <p className="text-xs mt-1 px-1" style={{ color: '#94A3B8' }}>{msg.timestamp?.split('T')[0]} {msg.timestamp?.split('T')[1]?.slice(0,5)}</p>
                </div>
              </div>
            );
          })}
          {(selected.status === 'resolved' || selected.status === 'closed') && (
            <div className="text-center py-4">
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#374151', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? `این تیکت ${isRTL ? TICKET_STATUS_LABELS[selected.status].fa : TICKET_STATUS_LABELS[selected.status].en} است.` : `This ticket is ${TICKET_STATUS_LABELS[selected.status].en.toLowerCase()}.`}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Reply box */}
        {selected.status !== 'closed' && (
          <div className="px-4 sm:px-6 py-4 border-t bg-white" style={{ borderColor: '#E5E7EB' }}>
            {replyError && (
              <div className="mb-3 p-2 rounded text-xs" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: isRTL ? ff : undefined }}>
                ⚠ {replyError}
              </div>
            )}
            <div className="flex gap-3 items-end">
              <textarea
                rows={3} value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply(); }}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-600 resize-none"
                style={{ fontFamily: isRTL ? ff : undefined }}
                placeholder={isRTL ? 'پاسخ خود را بنویسید... (Ctrl+Enter برای ارسال)' : 'Write your reply… (Ctrl+Enter to send)'}
              />
              <button onClick={handleReply} disabled={sending || !reply.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all"
                style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
