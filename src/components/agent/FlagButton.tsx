'use client';

import { useState } from 'react';
import { Flag, X, Loader2 } from 'lucide-react';
import { createFollowUp } from '@/lib/notifications';
import { useAgent } from '@/contexts/AgentContext';
import type { FollowUpPriority } from '@/lib/types';
import { FOLLOWUP_PRIORITY_LABELS } from '@/lib/types';

interface FlagButtonProps {
  type: string;
  relatedLabel: string;
  relatedUid?: string;
  relatedId?: string;
}

export default function FlagButton({ type, relatedLabel, relatedUid, relatedId }: FlagButtonProps) {
  const { agent } = useAgent();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<FollowUpPriority>('medium');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !agent) return;
    setSaving(true);
    try {
      await createFollowUp({
        type, title, priority, notes,
        relatedLabel, relatedUid, relatedId,
        createdBy: agent.uid,
        createdByName: agent.name,
        description: `Flagged from ${type}: ${relatedLabel}`,
      });
      setDone(true);
      setTimeout(() => { setDone(false); setOpen(false); setTitle(''); setNotes(''); setPriority('medium'); }, 2000);
    } catch { }
    finally { setSaving(false); }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Flag for follow-up"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all hover:bg-orange-50"
        style={{ borderColor: '#E5E7EB', color: '#92400E' }}
      >
        <Flag className="w-3.5 h-3.5" />Flag
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5" style={{ color: '#C9A35A' }} />
            <h3 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>Flag for Follow-Up</h3>
          </div>
          <button onClick={() => setOpen(false)}><X className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#DCFCE7' }}>
              <Flag className="w-6 h-6" style={{ color: '#16A34A' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#15803D' }}>Follow-up created successfully!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#FFF8E8', color: '#92400E' }}>
              <strong>Flagging:</strong> {relatedLabel}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Follow-up Title *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
                placeholder="e.g. Check source of funds documentation"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Priority</label>
              <div className="flex gap-2">
                {(['urgent','high','medium','low'] as FollowUpPriority[]).map(p => {
                  const cfg = FOLLOWUP_PRIORITY_LABELS[p];
                  return (
                    <button key={p} onClick={() => setPriority(p)}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                      style={{ backgroundColor: priority === p ? cfg.bg : 'white', borderColor: priority === p ? cfg.color : '#E5E7EB', color: priority === p ? cfg.color : '#5E6470' }}
                    >{cfg.en}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Notes (optional)</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setOpen(false)} className="flex-1 py-2 text-sm font-medium rounded-lg border" style={{ borderColor: '#E5E7EB', color: '#5E6470' }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving || !title.trim()} className="flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flag className="w-3.5 h-3.5" />}
                Create Flag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
