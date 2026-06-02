'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Loader2, Eye, CheckCircle, XCircle, Flag, Search } from 'lucide-react';
import type { ClientDocument, DocumentStatus } from '@/lib/types';
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/types';

export default function AgentDocuments() {
  const { can, agent } = useAgent();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [selected, setSelected] = useState<ClientDocument | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collectionGroup(db, 'files'), orderBy('uploadedAt', 'desc')));
        setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleAction = async (status: DocumentStatus) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'documents', selected.clientUid, 'files', selected.id), {
        status, reviewNotes, reviewedBy: agent?.uid || '', reviewedAt: new Date().toISOString(),
      });
      const updated = { ...selected, status, reviewNotes, reviewedBy: agent?.uid };
      setDocuments(prev => prev.map(d => d.id === selected.id ? updated : d));
      setSelected(updated);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const filtered = documents.filter(d => {
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchSearch = !search || [d.name, d.clientUid, d.category, d.description].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  if (!can('documents')) return <AgentShell><div className="p-8 text-center" style={{ color: '#94A3B8' }}>Access denied.</div></AgentShell>;

  return (
    <AgentShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>Document Review</h1>
          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>{documents.filter(d => d.status === 'pending').length} pending · {documents.length} total</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input type="text" placeholder="Search by filename, client UID, category..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-600 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as DocumentStatus | 'all')} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-yellow-600">
            <option value="all">All Statuses</option>
            {(['pending','reviewed','approved','rejected','flagged'] as DocumentStatus[]).map(s => <option key={s} value={s}>{DOCUMENT_STATUS_LABELS[s].en}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doc list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12"><p className="text-sm" style={{ color: '#94A3B8' }}>No documents found.</p></div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filtered.map(d => {
                  const st = DOCUMENT_STATUS_LABELS[d.status] || DOCUMENT_STATUS_LABELS.pending;
                  const cat = DOCUMENT_CATEGORY_LABELS[d.category] || { en: d.category, fa: '' };
                  const isSelected = selected?.id === d.id;
                  return (
                    <button key={d.id} onClick={() => { setSelected(d); setReviewNotes(d.reviewNotes || ''); }} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left" style={{ backgroundColor: isSelected ? '#FFF8E8' : undefined }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: '#F1F5F9', color: '#5E6470' }}>
                        {d.name.split('.').pop()?.toUpperCase().slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{d.name}</p>
                        <p className="text-xs" style={{ color: '#5E6470' }}>{cat.en} · {(d.size / 1024 / 1024).toFixed(2)}MB · {d.uploadedAt?.split('T')[0]}</p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: '#94A3B8' }}>Client: {d.clientUid?.slice(0,16)}…</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>{st.en}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review panel */}
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-serif font-bold truncate" style={{ color: '#1E2430' }}>{selected.name}</h2>
                  <p className="text-xs mt-1" style={{ color: '#5E6470' }}>
                    {DOCUMENT_CATEGORY_LABELS[selected.category]?.en} · {(selected.size/1024/1024).toFixed(2)}MB · {selected.uploadedAt?.split('T')[0]}
                  </p>
                </div>
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="ml-3 p-2 rounded-lg hover:bg-gray-100 flex-shrink-0" title="View document">
                  <Eye className="w-5 h-5" style={{ color: '#C9A35A' }} />
                </a>
              </div>

              {selected.description && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>CLIENT DESCRIPTION</p>
                  <p className="text-sm" style={{ color: '#374151' }}>{selected.description}</p>
                </div>
              )}

              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>CLIENT UID</p>
                <p className="text-xs font-mono" style={{ color: '#374151' }}>{selected.clientUid}</p>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Review Notes</label>
                <textarea rows={4} value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-600" placeholder="Add your review notes (compliance issues, approval notes, rejection reason)..." />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { status: 'approved' as DocumentStatus, label: 'Approve',  Icon: CheckCircle, bg: '#DCFCE7', color: '#15803D' },
                  { status: 'rejected' as DocumentStatus, label: 'Reject',   Icon: XCircle,    bg: '#FEE2E2', color: '#DC2626' },
                  { status: 'flagged'  as DocumentStatus, label: 'Flag',     Icon: Flag,       bg: '#F3E8FF', color: '#9333EA' },
                ].map(({ status, label, Icon, bg, color }) => (
                  <button key={status} onClick={() => handleAction(status)} disabled={saving} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg hover:brightness-90 disabled:opacity-60 transition-all" style={{ backgroundColor: bg, color }}>
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                    {label}
                  </button>
                ))}
              </div>

              {selected.reviewedAt && (
                <p className="text-xs mt-3 text-center" style={{ color: '#94A3B8' }}>
                  Last reviewed {selected.reviewedAt?.split('T')[0]} by {selected.reviewedBy?.slice(0,12)}…
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center p-12">
              <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Select a document to review, approve, reject or flag.</p>
            </div>
          )}
        </div>
      </div>
    </AgentShell>
  );
}
