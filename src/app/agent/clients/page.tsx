'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Loader2, Search, Save, MessageSquare, Eye } from 'lucide-react';
import FlagButton from '@/components/agent/FlagButton';
import SendNotificationButton from '@/components/agent/SendNotificationButton';
import type { ClientProfile, Case, CaseStatus, Message } from '@/lib/types';
import { CASE_STATUS_LABELS } from '@/lib/types';

interface ClientRow {
  uid: string;
  profile: ClientProfile;
  caseData?: Case;
}

const CASE_STATUSES: CaseStatus[] = ['pending','in_progress','awaiting_documents','under_review','approved','closed'];

export default function AgentClients() {
  const { can, agent } = useAgent();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClientRow | null>(null);
  const [editCase, setEditCase] = useState<Case | null>(null);
  const [saving, setSaving] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [tab, setTab] = useState<'case' | 'message'>('case');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, 'clients')));
        const rows: ClientRow[] = await Promise.all(
          snap.docs.map(async d => {
            const profile = { uid: d.id, ...d.data() } as ClientProfile;
            try {
              const cSnap = await getDoc(doc(db, 'cases', d.id));
              return { uid: d.id, profile, caseData: cSnap.exists() ? cSnap.data() as Case : undefined };
            } catch { return { uid: d.id, profile }; }
          })
        );
        setClients(rows);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSelectClient = (row: ClientRow) => {
    setSelected(row);
    setEditCase(row.caseData ? { ...row.caseData } : {
      service: '', status: 'pending', stage: '',
      documentsReceived: [], documentsRequired: [],
      nextDeadline: '', nextAppointment: '', notes: '',
    });
    setMsgSent(false); setNewMsg('');
  };

  const handleSaveCase = async () => {
    if (!selected || !editCase) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'cases', selected.uid), { ...editCase, updatedAt: new Date().toISOString(), updatedBy: agent?.uid || '' }, { merge: true });
      setClients(prev => prev.map(c => c.uid === selected.uid ? { ...c, caseData: editCase } : c));
      setSelected(s => s ? { ...s, caseData: editCase } : s);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleSendMessage = async () => {
    if (!newMsg.trim() || !selected) return;
    setSendingMsg(true);
    try {
      await addDoc(collection(db, 'messages', selected.uid, 'thread'), {
        from: 'pluco', content: newMsg.trim(),
        timestamp: new Date().toISOString(), read: false,
        sentBy: agent?.uid || '', senderName: agent?.name || 'PLUCO GROUP',
      });
      setNewMsg(''); setMsgSent(true);
    } catch (e) { console.error(e); }
    finally { setSendingMsg(false); }
  };

  const filtered = clients.filter(c => {
    if (!search) return true;
    const t = search.toLowerCase();
    return [c.profile.name, c.profile.email, c.profile.nationality, c.uid].some(f => f?.toLowerCase().includes(t));
  });

  if (!can('clients')) return <AgentShell><div className="p-8 text-center" style={{ color: '#94A3B8' }}>Access denied.</div></AgentShell>;

  return (
    <AgentShell>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>Clients & Cases</h1>
          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{clients.length} registered clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-600 bg-white" />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12"><p className="text-sm" style={{ color: '#94A3B8' }}>No clients found.</p></div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
                {filtered.map(row => {
                  const st = row.caseData?.status ? CASE_STATUS_LABELS[row.caseData.status] : null;
                  const isSelected = selected?.uid === row.uid;
                  return (
                    <button key={row.uid} onClick={() => handleSelectClient(row)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left" style={{ backgroundColor: isSelected ? '#FFF8E8' : undefined }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                        {(row.profile.name || row.profile.email || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{row.profile.name || row.profile.email || row.uid}</p>
                        <p className="text-xs truncate" style={{ color: '#5E6470' }}>{row.profile.nationality || '—'} · {row.caseData?.service || 'No case'}</p>
                      </div>
                      {st && <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>{st.en}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && editCase ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Client header */}
              <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>{selected.profile.name || selected.profile.email}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{selected.profile.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <FlagButton type="client" relatedLabel={selected.profile.name || selected.profile.email || selected.uid} relatedUid={selected.uid} />
                    <SendNotificationButton clientUid={selected.uid} clientName={selected.profile.name} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {[{ key: 'case', label: 'Case Management' }, { key: 'message', label: 'Send Message' }].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key as 'case' | 'message')} className="px-5 py-3 text-xs font-medium border-b-2 transition-colors" style={{ color: tab === t.key ? '#C9A35A' : '#94A3B8', borderColor: tab === t.key ? '#C9A35A' : 'transparent' }}>{t.label}</button>
                ))}
              </div>

              <div className="p-6">
                {tab === 'case' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Service</label>
                        <input type="text" value={editCase.service || ''} onChange={e => setEditCase(c => c ? { ...c, service: e.target.value } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" placeholder="EU Residency, Banking..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Status</label>
                        <select value={editCase.status || 'pending'} onChange={e => setEditCase(c => c ? { ...c, status: e.target.value as CaseStatus } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-yellow-600">
                          {CASE_STATUSES.map(s => <option key={s} value={s}>{CASE_STATUS_LABELS[s].en}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Current Stage</label>
                      <input type="text" value={editCase.stage || ''} onChange={e => setEditCase(c => c ? { ...c, stage: e.target.value } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" placeholder="e.g. Initial document collection" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Next Deadline</label>
                        <input type="date" value={editCase.nextDeadline || ''} onChange={e => setEditCase(c => c ? { ...c, nextDeadline: e.target.value } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Next Appointment</label>
                        <input type="date" value={editCase.nextAppointment || ''} onChange={e => setEditCase(c => c ? { ...c, nextAppointment: e.target.value } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Documents Received (one per line)</label>
                      <textarea rows={3} value={(editCase.documentsReceived || []).join('\n')} onChange={e => setEditCase(c => c ? { ...c, documentsReceived: e.target.value.split('\n').filter(Boolean) } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Documents Required (one per line)</label>
                      <textarea rows={3} value={(editCase.documentsRequired || []).join('\n')} onChange={e => setEditCase(c => c ? { ...c, documentsRequired: e.target.value.split('\n').filter(Boolean) } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Notes to Client</label>
                      <textarea rows={3} value={editCase.notes || ''} onChange={e => setEditCase(c => c ? { ...c, notes: e.target.value } : c)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-600" placeholder="This note will be visible to the client in their dashboard." />
                    </div>
                    <button onClick={handleSaveCase} disabled={saving} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Case Data
                    </button>
                  </div>
                )}

                {tab === 'message' && (
                  <div className="space-y-4">
                    <p className="text-sm" style={{ color: '#5E6470' }}>Send a message to <strong style={{ color: '#1E2430' }}>{selected.profile.name || selected.profile.email}</strong>. It will appear in their client dashboard.</p>
                    <textarea rows={5} value={newMsg} onChange={e => setNewMsg(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-yellow-600" placeholder="Write your message to the client..." />
                    {msgSent && <p className="text-sm font-medium" style={{ color: '#16A34A' }}>✓ Message sent successfully.</p>}
                    <button onClick={handleSendMessage} disabled={sendingMsg || !newMsg.trim()} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                      {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      Send Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center p-12">
              <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Select a client to manage their case, send messages and update status.</p>
            </div>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
