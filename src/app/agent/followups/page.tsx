'use client';

import { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy, doc,
  updateDoc, addDoc, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import {
  Loader2, Flag, Plus, Search, CheckCircle,
  Clock, AlertTriangle, XCircle, Filter, ChevronDown,
} from 'lucide-react';
import type { FollowUp, FollowUpPriority, FollowUpStatus } from '@/lib/types';
import { FOLLOWUP_PRIORITY_LABELS, FOLLOWUP_STATUS_LABELS } from '@/lib/types';

const PRIORITIES: FollowUpPriority[] = ['urgent', 'high', 'medium', 'low'];
const STATUSES: FollowUpStatus[] = ['open', 'in_progress', 'resolved'];

const STATUS_ICONS: Record<FollowUpStatus, React.ReactNode> = {
  open: <AlertTriangle className="w-3.5 h-3.5" />,
  in_progress: <Clock className="w-3.5 h-3.5" />,
  resolved: <CheckCircle className="w-3.5 h-3.5" />,
};

export default function AgentFollowUps() {
  const { agent } = useAgent();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FollowUpStatus | 'all'>('open');
  const [filterPriority, setFilterPriority] = useState<FollowUpPriority | 'all'>('all');
  const [filterMine, setFilterMine] = useState(false);
  const [selected, setSelected] = useState<FollowUp | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  // New follow-up form
  const [newFU, setNewFU] = useState({
    title: '', description: '', type: 'custom', priority: 'medium' as FollowUpPriority,
    relatedLabel: '', dueDate: '', notes: '', assignedTo: '', assignedToName: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, 'followups'), orderBy('createdAt', 'desc')));
        setFollowUps(snap.docs.map(d => ({ id: d.id, ...d.data() } as FollowUp)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!newFU.title.trim() || !agent) return;
    setSaving(true);
    try {
      const data: Omit<FollowUp, 'id'> = {
        ...newFU,
        status: 'open',
        createdBy: agent.uid,
        createdByName: agent.name,
        createdAt: new Date().toISOString(),
        type: newFU.type as FollowUp['type'],
        priority: newFU.priority,
      };
      const ref = await addDoc(collection(db, 'followups'), data);
      setFollowUps(prev => [{ id: ref.id, ...data }, ...prev]);
      setNewFU({ title: '', description: '', type: 'custom', priority: 'medium', relatedLabel: '', dueDate: '', notes: '', assignedTo: '', assignedToName: '' });
      setShowCreate(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: FollowUpStatus) => {
    try {
      await updateDoc(doc(db, 'followups', id), {
        status,
        updatedAt: new Date().toISOString(),
        ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}),
      });
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status } : f));
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
    } catch (e) { console.error(e); }
  };

  const handleUpdateNotes = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'followups', selected.id), {
        notes: selected.notes || '',
        priority: selected.priority,
        dueDate: selected.dueDate || '',
        assignedTo: selected.assignedTo || '',
        assignedToName: selected.assignedToName || '',
        updatedAt: new Date().toISOString(),
      });
      setFollowUps(prev => prev.map(f => f.id === selected.id ? selected : f));
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const filtered = followUps.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (filterPriority !== 'all' && f.priority !== filterPriority) return false;
    if (filterMine && f.assignedTo !== agent?.uid && f.createdBy !== agent?.uid) return false;
    if (search) {
      const t = search.toLowerCase();
      if (![f.title, f.description, f.relatedLabel, f.createdByName].some(x => x?.toLowerCase().includes(t))) return false;
    }
    return true;
  });

  const openCount = followUps.filter(f => f.status === 'open' || f.status === 'in_progress').length;
  const urgentCount = followUps.filter(f => f.priority === 'urgent' && f.status !== 'resolved').length;

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 bg-white";
  const sel = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 bg-white";

  return (
    <AgentShell>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>Follow-Ups</h1>
            <p className="text-sm mt-1" style={{ color: '#5E6470' }}>
              {openCount} open · {urgentCount > 0 && <span style={{ color: '#DC2626' }}>{urgentCount} urgent · </span>}
              {followUps.length} total
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg hover:brightness-110 transition-all" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
            <Plus className="w-4 h-4" />New Follow-Up
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {PRIORITIES.map(p => {
            const cfg = FOLLOWUP_PRIORITY_LABELS[p];
            const count = followUps.filter(f => f.priority === p && f.status !== 'resolved').length;
            return (
              <button key={p} onClick={() => setFilterPriority(filterPriority === p ? 'all' : p)}
                className="rounded-xl p-3 border text-left transition-all hover:shadow-md"
                style={{ backgroundColor: filterPriority === p ? cfg.bg : 'white', borderColor: filterPriority === p ? cfg.color : '#E5E7EB' }}>
                <p className="text-xl font-bold" style={{ color: cfg.color }}>{count}</p>
                <p className="text-xs font-medium" style={{ color: '#5E6470' }}>{cfg.en}</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search follow-ups…" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-600 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FollowUpStatus | 'all')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-yellow-600">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{FOLLOWUP_STATUS_LABELS[s].en}</option>)}
          </select>
          <button onClick={() => setFilterMine(!filterMine)} className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors" style={{ borderColor: filterMine ? '#C9A35A' : '#E5E7EB', backgroundColor: filterMine ? '#FFF8E8' : 'white', color: filterMine ? '#92400E' : '#5E6470' }}>
            {filterMine ? '✓ Mine only' : 'Mine only'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Flag className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                <p className="text-sm" style={{ color: '#94A3B8' }}>No follow-ups match your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[640px] overflow-y-auto">
                {filtered.map(fu => {
                  const pCfg = FOLLOWUP_PRIORITY_LABELS[fu.priority];
                  const sCfg = FOLLOWUP_STATUS_LABELS[fu.status];
                  const isSelected = selected?.id === fu.id;
                  return (
                    <button key={fu.id} onClick={() => setSelected(fu)}
                      className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: isSelected ? '#FFF8E8' : undefined }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: pCfg.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{fu.title}</p>
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: pCfg.bg, color: pCfg.color }}>{pCfg.en}</span>
                          </div>
                          {fu.relatedLabel && <p className="text-xs truncate" style={{ color: '#5E6470' }}>Re: {fu.relatedLabel}</p>}
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs flex items-center gap-1" style={{ color: sCfg.color }}>
                              {STATUS_ICONS[fu.status]} {sCfg.en}
                            </span>
                            <span className="text-xs" style={{ color: '#94A3B8' }}>{fu.createdAt?.split('T')[0]}</span>
                            {fu.assignedToName && <span className="text-xs" style={{ color: '#94A3B8' }}>→ {fu.assignedToName}</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail / Create panel */}
          {showCreate ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>New Follow-Up</h2>
                <button onClick={() => setShowCreate(false)} className="text-xs" style={{ color: '#94A3B8' }}>Cancel</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Title *</label>
                  <input value={newFU.title} onChange={e => setNewFU(p => ({ ...p, title: e.target.value }))} className={inp} placeholder="e.g. Review client source of funds" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Type</label>
                    <select value={newFU.type} onChange={e => setNewFU(p => ({ ...p, type: e.target.value }))} className={sel}>
                      {['case','enquiry','document','message','client','custom'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Priority</label>
                    <select value={newFU.priority} onChange={e => setNewFU(p => ({ ...p, priority: e.target.value as FollowUpPriority }))} className={sel}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{FOLLOWUP_PRIORITY_LABELS[p].en}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Reference (client name, enquiry, etc.)</label>
                  <input value={newFU.relatedLabel} onChange={e => setNewFU(p => ({ ...p, relatedLabel: e.target.value }))} className={inp} placeholder="e.g. John Smith - EU Residency" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Due Date</label>
                    <input type="date" value={newFU.dueDate} onChange={e => setNewFU(p => ({ ...p, dueDate: e.target.value }))} className={inp} dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Assign To (name)</label>
                    <input value={newFU.assignedToName} onChange={e => setNewFU(p => ({ ...p, assignedToName: e.target.value }))} className={inp} placeholder="Agent name" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Description</label>
                  <textarea rows={3} value={newFU.description} onChange={e => setNewFU(p => ({ ...p, description: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Internal Notes</label>
                  <textarea rows={2} value={newFU.notes} onChange={e => setNewFU(p => ({ ...p, notes: e.target.value }))} className={inp} />
                </div>
                <button onClick={handleCreate} disabled={saving || !newFU.title.trim()} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                  Create Follow-Up
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>{selected.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>
                      Created by {selected.createdByName} · {selected.createdAt?.split('T')[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: FOLLOWUP_PRIORITY_LABELS[selected.priority].bg, color: FOLLOWUP_PRIORITY_LABELS[selected.priority].color }}>
                      {FOLLOWUP_PRIORITY_LABELS[selected.priority].en}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Status buttons */}
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#1E2430' }}>Status</p>
                  <div className="flex gap-2">
                    {STATUSES.map(s => {
                      const cfg = FOLLOWUP_STATUS_LABELS[s];
                      return (
                        <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                          style={{
                            backgroundColor: selected.status === s ? cfg.bg : 'white',
                            borderColor: selected.status === s ? cfg.color : '#E5E7EB',
                            color: selected.status === s ? cfg.color : '#5E6470',
                          }}
                        >
                          {STATUS_ICONS[s]} {cfg.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selected.relatedLabel && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#64748B' }}>RELATED TO</p>
                    <p className="text-sm font-medium" style={{ color: '#1E2430' }}>{selected.relatedLabel}</p>
                  </div>
                )}

                {selected.description && (
                  <div>
                    <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{selected.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Priority</label>
                    <select value={selected.priority} onChange={e => setSelected(s => s ? { ...s, priority: e.target.value as FollowUpPriority } : s)} className={sel}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{FOLLOWUP_PRIORITY_LABELS[p].en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Due Date</label>
                    <input type="date" value={selected.dueDate || ''} onChange={e => setSelected(s => s ? { ...s, dueDate: e.target.value } : s)} className={inp} dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Assigned To</label>
                  <input value={selected.assignedToName || ''} onChange={e => setSelected(s => s ? { ...s, assignedToName: e.target.value } : s)} className={inp} placeholder="Agent name" />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Internal Notes</label>
                  <textarea rows={4} value={selected.notes || ''} onChange={e => setSelected(s => s ? { ...s, notes: e.target.value } : s)} className={inp} />
                </div>

                <button onClick={handleUpdateNotes} disabled={saving} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center p-12">
              <div className="text-center">
                <Flag className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} />
                <p className="text-sm" style={{ color: '#94A3B8' }}>Select a follow-up to view details, or create a new one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
