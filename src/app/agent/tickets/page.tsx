'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection, getDocs, query, orderBy, doc, updateDoc,
  addDoc, increment, where, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Loader2, Search, Send, ChevronLeft, Ticket as TicketIcon, Filter } from 'lucide-react';
import type { Ticket, TicketMessage, TicketStatus, TicketCategory } from '@/lib/types';
import {
  TICKET_STATUS_LABELS, TICKET_CATEGORY_LABELS, TICKET_PRIORITY_LABELS,
} from '@/lib/types';
import { createClientNotification } from '@/lib/notifications';

const STATUSES: TicketStatus[] = ['open','in_progress','waiting_client','resolved','closed'];

export default function AgentTickets() {
  const { agent } = useAgent();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('open');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const totalUnread = tickets.reduce((s, t) => s + (t.unreadAgent || 0), 0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, 'tickets'), orderBy('createdAt', 'desc')));
        setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const openTicket = async (ticket: Ticket) => {
    setSelected(ticket); setMobileShowThread(true); setMsgLoading(true);
    try {
      const snap = await getDocs(query(
        collection(db, 'tickets', ticket.id, 'messages'),
        orderBy('timestamp', 'asc'),
      ));
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as TicketMessage)));
      await updateDoc(doc(db, 'tickets', ticket.id), { unreadAgent: 0 });
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unreadAgent: 0 } : t));
    } catch (e) { console.error(e); }
    finally { setMsgLoading(false); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selected) return;
    try {
      await updateDoc(doc(db, 'tickets', selected.id), {
        status, updatedAt: new Date().toISOString(),
        ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
      });
      const updated = { ...selected, status };
      setSelected(updated);
      setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
      // Notify client
      const stLabel = TICKET_STATUS_LABELS[status];
      await createClientNotification(
        selected.clientUid, 'case_update',
        `Ticket ${selected.ticketNumber} — ${stLabel.en}`,
        `تیکت ${selected.ticketNumber} — ${stLabel.fa}`,
        `Your support ticket "${selected.subject}" has been updated to: ${stLabel.en}`,
        `وضعیت تیکت شما "${selected.subject}" به "${stLabel.fa}" تغییر یافت`,
        { createdBy: agent?.uid, createdByName: agent?.name },
      );
    } catch (e) { console.error(e); }
  };

  const handleAssign = async () => {
    if (!selected || !agent) return;
    try {
      await updateDoc(doc(db, 'tickets', selected.id), {
        assignedTo: agent.uid, assignedToName: agent.name,
        status: 'in_progress', updatedAt: new Date().toISOString(),
      });
      const updated = { ...selected, assignedTo: agent.uid, assignedToName: agent.name, status: 'in_progress' as TicketStatus };
      setSelected(updated);
      setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
    } catch (e) { console.error(e); }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected || !agent) return;
    setSending(true);
    try {
      const msg: Omit<TicketMessage, 'id'> = {
        from: 'agent', senderName: agent.name, senderUid: agent.uid,
        content: reply.trim(), timestamp: new Date().toISOString(),
        readByAgent: true, readByClient: false,
      };
      const ref = await addDoc(collection(db, 'tickets', selected.id, 'messages'), msg);
      await updateDoc(doc(db, 'tickets', selected.id), {
        updatedAt: new Date().toISOString(), unreadClient: increment(1),
        status: selected.status === 'open' ? 'in_progress' : selected.status,
        assignedTo: selected.assignedTo || agent.uid,
        assignedToName: selected.assignedToName || agent.name,
      });
      setMessages(prev => [...prev, { id: ref.id, ...msg }]);
      // Notify client
      await createClientNotification(
        selected.clientUid, 'message',
        `Reply on ${selected.ticketNumber}`, `پاسخ به ${selected.ticketNumber}`,
        `${agent.name} replied to your ticket: "${selected.subject}"`,
        `${agent.name} به تیکت شما پاسخ داد: "${selected.subject}"`,
        { createdBy: agent.uid, createdByName: agent.name },
      );
      setReply('');
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const filtered = tickets.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![t.subject, t.ticketNumber, t.clientName, t.clientEmail, t.category].some(x => x?.toLowerCase().includes(s))) return false;
    }
    return true;
  });

  return (
    <AgentShell>
      <div className="flex h-screen overflow-hidden" style={{ maxHeight: 'calc(100vh - 0px)' }}>

        {/* ── Ticket list ── */}
        <div className={`${mobileShowThread ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 xl:w-96 flex-shrink-0 border-r`} style={{ borderColor: '#E5E7EB', backgroundColor: 'white' }}>
          {/* Header */}
          <div className="px-4 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>Tickets</h1>
                <p className="text-xs" style={{ color: '#5E6470' }}>{filtered.length} tickets · {totalUnread > 0 && <span style={{ color: '#DC2626' }}>{totalUnread} unread</span>}</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#94A3B8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-yellow-600" />
            </div>
            <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
              {['all', ...STATUSES].map(s => {
                const cfg = s !== 'all' ? TICKET_STATUS_LABELS[s as TicketStatus] : null;
                const count = s === 'all' ? tickets.length : tickets.filter(t => t.status === s).length;
                return (
                  <button key={s} onClick={() => setFilterStatus(s as TicketStatus | 'all')}
                    className="flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full border transition-all"
                    style={{
                      backgroundColor: filterStatus === s ? (cfg?.bg || '#F1F5F9') : 'white',
                      borderColor: filterStatus === s ? (cfg?.color || '#CBD5E0') : '#E5E7EB',
                      color: filterStatus === s ? (cfg?.color || '#374151') : '#5E6470',
                    }}>
                    {s === 'all' ? `All (${count})` : `${cfg?.en} (${count})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y" >
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10"><p className="text-sm" style={{ color: '#94A3B8' }}>No tickets.</p></div>
            ) : filtered.map(ticket => {
              const st = TICKET_STATUS_LABELS[ticket.status];
              const pr = TICKET_PRIORITY_LABELS[ticket.priority];
              const cat = TICKET_CATEGORY_LABELS[ticket.category];
              const isActive = selected?.id === ticket.id;
              return (
                <button key={ticket.id} onClick={() => openTicket(ticket)}
                  className="w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: isActive ? '#FFF8E8' : (ticket.unreadAgent ? '#FEFCE8' : undefined), borderLeft: `3px solid ${pr.color}` }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{ticket.ticketNumber}</span>
                    <div className="flex items-center gap-1">
                      {(ticket.unreadAgent || 0) > 0 && (
                        <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#DC2626', color: 'white', fontSize: 9 }}>{ticket.unreadAgent}</span>
                      )}
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.en}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold truncate mb-0.5" style={{ color: '#1E2430' }}>{ticket.subject}</p>
                  <p className="text-xs truncate" style={{ color: '#5E6470' }}>{ticket.clientName} · {cat.icon} {cat.en}</p>
                  <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{ticket.createdAt?.split('T')[0]}{ticket.assignedToName && ` · ${ticket.assignedToName}`}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Thread ── */}
        <div className={`${!mobileShowThread ? 'hidden lg:flex' : 'flex'} flex-1 flex-col`} style={{ backgroundColor: '#F8F9FA' }}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <TicketIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                <p className="text-sm" style={{ color: '#94A3B8' }}>Select a ticket to view the conversation</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-4 sm:px-5 py-3.5 border-b bg-white flex items-start gap-3" style={{ borderColor: '#E5E7EB' }}>
                <button className="lg:hidden p-1 rounded" onClick={() => { setMobileShowThread(false); setSelected(null); }}>
                  <ChevronLeft className="w-4 h-4" style={{ color: '#5E6470' }} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>{selected.ticketNumber}</span>
                    <span className="text-xs font-semibold">{TICKET_CATEGORY_LABELS[selected.category].icon} {TICKET_CATEGORY_LABELS[selected.category].en}</span>
                    <span className="text-xs" style={{ color: TICKET_PRIORITY_LABELS[selected.priority].color }}>● {TICKET_PRIORITY_LABELS[selected.priority].en}</span>
                  </div>
                  <p className="text-sm font-bold truncate" style={{ color: '#1E2430' }}>{selected.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{selected.clientName} · {selected.clientEmail}</p>
                </div>
                {/* Status + assign */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  {!selected.assignedTo && (
                    <button onClick={handleAssign} className="text-xs px-2.5 py-1.5 rounded-lg border hover:bg-blue-50 transition-colors" style={{ borderColor: '#BFDBFE', color: '#1E40AF' }}>
                      Assign to me
                    </button>
                  )}
                  <select value={selected.status} onChange={e => handleStatusChange(e.target.value as TicketStatus)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-yellow-600">
                    {STATUSES.map(s => <option key={s} value={s}>{TICKET_STATUS_LABELS[s].en}</option>)}
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {msgLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
                ) : messages.map(msg => {
                  const isAgent = msg.from === 'agent';
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: isAgent ? '#C9A35A' : '#E5E7EB', color: isAgent ? '#071C3C' : '#374151' }}>
                        {msg.senderName?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`max-w-[70%] flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                        <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: isAgent ? '#071C3C' : 'white', border: isAgent ? 'none' : '1px solid #E5E7EB' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: isAgent ? '#C9A35A' : '#1E2430' }}>{msg.senderName}</p>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: isAgent ? '#E2E8F0' : '#374151' }}>{msg.content}</p>
                        </div>
                        <p className="text-xs mt-1 px-1" style={{ color: '#94A3B8' }}>{msg.timestamp?.split('T')[0]} {msg.timestamp?.split('T')[1]?.slice(0,5)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply */}
              {selected.status !== 'closed' && (
                <div className="px-4 sm:px-5 py-4 border-t bg-white" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex gap-3 items-end">
                    <textarea
                      rows={3} value={reply} onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply(); }}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-600 resize-none"
                      placeholder="Reply to client… (Ctrl+Enter to send)"
                    />
                    <button onClick={handleReply} disabled={sending || !reply.trim()}
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
