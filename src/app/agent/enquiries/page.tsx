'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Loader2, Search } from 'lucide-react';
import FlagButton from '@/components/agent/FlagButton';
import type { Enquiry, EnquiryStatus } from '@/lib/types';
import { ENQUIRY_STATUS_LABELS } from '@/lib/types';

const STATUSES: EnquiryStatus[] = ['new', 'assigned', 'in_progress', 'closed'];

export default function AgentEnquiries() {
  const { can, agent } = useAgent();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | 'all'>('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, 'enquiries'), orderBy('submittedAt', 'desc')));
        setEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = enquiries.filter(e => {
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchSearch = !search || [e.fullName, e.email, e.service, e.nationality].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'enquiries', selected.id), {
        status: selected.status,
        assignedTo: selected.assignedTo || '',
        agentNotes: selected.agentNotes || '',
        updatedAt: new Date().toISOString(),
      });
      setEnquiries(prev => prev.map(e => e.id === selected.id ? selected : e));
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (!can('enquiries')) return <AgentShell><div className="p-8 text-center" style={{ color: '#94A3B8' }}>Access denied.</div></AgentShell>;

  return (
    <AgentShell>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>Enquiries</h1>
            <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{enquiries.length} total · {enquiries.filter(e => e.status === 'new').length} new</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" placeholder="Search by name, email, service..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-600 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as EnquiryStatus | 'all')} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-yellow-600">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{ENQUIRY_STATUS_LABELS[s].en}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12"><p className="text-sm" style={{ color: '#94A3B8' }}>No enquiries found.</p></div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filtered.map(enq => {
                  const st = ENQUIRY_STATUS_LABELS[enq.status];
                  const isSelected = selected?.id === enq.id;
                  return (
                    <button key={enq.id} onClick={() => setSelected(enq)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left" style={{ backgroundColor: isSelected ? '#FFF8E8' : undefined }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#F1F5F9', color: '#071C3C' }}>
                        {enq.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{enq.fullName}</p>
                        <p className="text-xs" style={{ color: '#5E6470' }}>{enq.email} · {enq.service || 'General'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{enq.nationality || '—'} · {enq.submittedAt?.split('T')[0]}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>{st.en}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6 gap-2">
                <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>{selected.fullName}</h2>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: ENQUIRY_STATUS_LABELS[selected.status].bg, color: ENQUIRY_STATUS_LABELS[selected.status].color }}>{ENQUIRY_STATUS_LABELS[selected.status].en}</span>
                  <FlagButton type="enquiry" relatedLabel={`${selected.fullName} – ${selected.service || 'Enquiry'}`} relatedId={selected.id} />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  ['Email', selected.email],
                  ['Phone', selected.phone || '—'],
                  ['Nationality', selected.nationality || '—'],
                  ['Country', selected.country || '—'],
                  ['Family Members', selected.familyMembers || '—'],
                  ['Service', selected.service || '—'],
                  ['Language', selected.language || '—'],
                  ['Submitted', selected.submittedAt?.split('T')[0] || '—'],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-3">
                    <span className="text-xs w-28 flex-shrink-0 font-semibold" style={{ color: '#64748B' }}>{l}</span>
                    <span className="text-xs" style={{ color: '#1E2430' }}>{v}</span>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>DESCRIPTION</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{selected.description}</p>
                </div>
              )}

              {/* Agent actions */}
              <div className="space-y-3 border-t border-gray-100 pt-5">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Status</label>
                  <select value={selected.status} onChange={e => setSelected(s => s ? { ...s, status: e.target.value as EnquiryStatus } : s)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-yellow-600">
                    {STATUSES.map(s => <option key={s} value={s}>{ENQUIRY_STATUS_LABELS[s].en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Agent Notes</label>
                  <textarea rows={3} value={selected.agentNotes || ''} onChange={e => setSelected(s => s ? { ...s, agentNotes: e.target.value } : s)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-600" placeholder="Internal notes (not visible to client)..." />
                </div>
                <button onClick={handleSave} disabled={saving} className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center p-12">
              <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Select an enquiry to view details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
