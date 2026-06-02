'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Loader2, Send, FileText } from 'lucide-react';
import type { Report, ReportType } from '@/lib/types';
import { REPORT_TYPE_LABELS } from '@/lib/types';

const REPORT_TYPES: ReportType[] = ['weekly_summary','enquiry_report','client_update','document_review','compliance_report','custom'];

export default function AgentReports() {
  const { can, agent } = useAgent();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ReportType>('weekly_summary');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, 'reports'), orderBy('sentAt', 'desc')));
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() } as Report)));
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setSending(true); setSent(false); setError('');
    try {
      // Save to Firestore
      const reportData = {
        type, title: title.trim(), content: content.trim(),
        createdBy: agent?.uid || '', createdByName: agent?.name || '',
        sentTo: 'info@plucogroup.com', sentAt: new Date().toISOString(),
      };
      const ref = await addDoc(collection(db, 'reports'), reportData);
      // Send email
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error('Email failed');
      setReports(prev => [{ id: ref.id, ...reportData }, ...prev]);
      setTitle(''); setContent(''); setSent(true);
    } catch (e) {
      setError('Failed to send report. Please try again.');
    } finally { setSending(false); }
  };

  if (!can('reports')) return <AgentShell><div className="p-8 text-center" style={{ color: '#94A3B8' }}>Access denied.</div></AgentShell>;

  return (
    <AgentShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E2430' }}>Reports</h1>
          <p className="text-sm mt-1" style={{ color: '#5E6470' }}>Create and send reports to info@plucogroup.com</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create report */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-serif font-bold mb-5" style={{ color: '#1E2430' }}>New Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Report Type</label>
                <select value={type} onChange={e => setType(e.target.value as ReportType)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-yellow-600">
                  {REPORT_TYPES.map(t => <option key={t} value={t}>{REPORT_TYPE_LABELS[t].en}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Report Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600" placeholder={`${REPORT_TYPE_LABELS[type].en} – ${new Date().toLocaleDateString('en-GB')}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430' }}>Report Content</label>
                <textarea rows={10} value={content} onChange={e => setContent(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-yellow-600" placeholder={`Write your ${REPORT_TYPE_LABELS[type].en.toLowerCase()} here.\n\nInclude:\n- Key findings\n- Actions taken\n- Recommendations\n- Next steps`} />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                  <span className="text-xs font-bold">{agent?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#1E2430' }}>{agent?.name}</p>
                  <p className="text-xs" style={{ color: '#5E6470' }}>Will send to info@plucogroup.com</p>
                </div>
              </div>

              {error && <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>{error}</p>}
              {sent && <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>✓ Report sent to info@plucogroup.com and saved.</p>}

              <button onClick={handleSend} disabled={sending} className="w-full py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Report to info@plucogroup.com
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>Report History</h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A35A' }} /></div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12"><FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E0' }} strokeWidth={1} /><p className="text-sm" style={{ color: '#94A3B8' }}>No reports sent yet.</p></div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
                {reports.map(r => (
                  <div key={r.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{r.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#5E6470' }}>{REPORT_TYPE_LABELS[r.type]?.en} · {r.createdByName}</p>
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: '#94A3B8' }}>{r.content.slice(0, 100)}…</p>
                      </div>
                      <p className="text-xs flex-shrink-0" style={{ color: '#94A3B8' }}>{r.sentAt?.split('T')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentShell>
  );
}
