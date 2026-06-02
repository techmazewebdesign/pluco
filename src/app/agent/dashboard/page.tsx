'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import AgentShell from '@/components/agent/AgentShell';
import { Inbox, Users, FileSearch, Clock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Enquiry, ClientDocument } from '@/lib/types';
import { ENQUIRY_STATUS_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/types';

export default function AgentDashboard() {
  const { agent, can } = useAgent();
  const [stats, setStats] = useState({ newEnquiries: 0, activeClients: 0, pendingDocs: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [pendingDocsList, setPendingDocsList] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          can('enquiries') ? getDocs(query(collection(db, 'enquiries'), where('status', '==', 'new'), orderBy('submittedAt', 'desc'), limit(5))) : Promise.resolve(null),
          can('clients') ? getDocs(query(collection(db, 'clients'))) : Promise.resolve(null),
          can('documents') ? getDocs(query(collection(db, 'enquiries'), orderBy('submittedAt', 'desc'), limit(100))) : Promise.resolve(null),
        ]);

        const r0 = results[0];
        const r1 = results[1];
        if (r0.status === 'fulfilled' && r0.value != null) {
          const snap = r0.value;
          setRecentEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry)));
          setStats(s => ({ ...s, newEnquiries: snap.size }));
        }
        if (r1.status === 'fulfilled' && r1.value != null) {
          setStats(s => ({ ...s, activeClients: r1.value!.size }));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (agent) load();
  }, [agent, can]);

  return (
    <AgentShell>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold mb-1" style={{ color: '#1E2430' }}>
            Welcome back, {agent?.name}
          </h1>
          <p className="text-sm" style={{ color: '#5E6470' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Warsaw time
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A35A' }} /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {[
                { label: 'New Enquiries', value: stats.newEnquiries, Icon: Inbox,       color: '#1E40AF', href: '/agent/enquiries', show: can('enquiries') },
                { label: 'Active Clients', value: stats.activeClients, Icon: Users,     color: '#0F766E', href: '/agent/clients',   show: can('clients') },
                { label: 'Pending Docs',  value: stats.pendingDocs,   Icon: FileSearch, color: '#9333EA', href: '/agent/documents', show: can('documents') },
              ].filter(s => s.show).map(s => (
                <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <s.Icon className="w-5 h-5" style={{ color: s.color }} strokeWidth={1.5} />
                    <span className="text-3xl font-bold" style={{ color: '#1E2430' }}>{s.value}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#5E6470' }}>{s.label}</p>
                </Link>
              ))}
            </div>

            {/* Recent enquiries */}
            {can('enquiries') && recentEnquiries.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>New Enquiries</h2>
                  <Link href="/agent/enquiries" className="flex items-center gap-1 text-xs font-medium" style={{ color: '#C9A35A' }}>View all<ArrowRight className="w-3 h-3" /></Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentEnquiries.map(enq => {
                    const st = ENQUIRY_STATUS_LABELS[enq.status];
                    return (
                      <Link key={enq.id} href={`/agent/enquiries`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#F1F5F9', color: '#071C3C' }}>
                          {enq.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1E2430' }}>{enq.fullName}</p>
                          <p className="text-xs truncate" style={{ color: '#5E6470' }}>{enq.service || 'General'} · {enq.nationality || '—'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.en}</span>
                          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{enq.submittedAt?.split('T')[0]}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Role notice */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#0369A1' }}>Your Access Level</p>
              <p className="text-sm" style={{ color: '#0C4A6E' }}>
                You are signed in as <strong>{agent?.name}</strong> with role <strong>{agent?.role.replace(/_/g, ' ').toUpperCase()}</strong>.
                Your permissions: {Object.entries({
                  enquiries: can('enquiries'), clients: can('clients'), cases: can('cases'),
                  documents: can('documents'), messages: can('messages'), invoices: can('invoices'),
                  reports: can('reports'), agents: can('agents'),
                }).filter(([, v]) => v).map(([k]) => k).join(', ')}.
              </p>
            </div>
          </>
        )}
      </div>
    </AgentShell>
  );
}
