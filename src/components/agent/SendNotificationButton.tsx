'use client';

import { useState } from 'react';
import { Bell, X, Loader2, Send } from 'lucide-react';
import { createClientNotification } from '@/lib/notifications';
import { useAgent } from '@/contexts/AgentContext';
import type { NotificationType } from '@/lib/types';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/types';

const TYPES: NotificationType[] = ['case_update','message','document_reviewed','invoice','follow_up','general'];

const FA_TITLES: Record<string, string> = {
  case_update: 'به‌روزرسانی پرونده',
  message: 'پیام جدید',
  document_reviewed: 'سند بررسی شد',
  invoice: 'فاکتور جدید',
  follow_up: 'پیگیری',
  general: 'اطلاعیه',
};

interface Props {
  clientUid: string;
  clientName?: string;
}

export default function SendNotificationButton({ clientUid, clientName }: Props) {
  const { agent } = useAgent();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<NotificationType>('general');
  const [titleEn, setTitleEn] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [bodyFa, setBodyFa] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Auto-fill Persian title from type
  const handleTypeChange = (t: NotificationType) => {
    setType(t);
    setTitleFa(FA_TITLES[t] || '');
    setTitleEn(NOTIFICATION_TYPE_LABELS[t].en);
  };

  const handleSend = async () => {
    if (!titleEn.trim() || !bodyEn.trim()) return;
    setSaving(true);
    try {
      await createClientNotification(
        clientUid, type,
        titleEn, titleFa || FA_TITLES[type],
        bodyEn, bodyFa || bodyEn,
        { createdBy: agent?.uid, createdByName: agent?.name }
      );
      setDone(true);
      setTimeout(() => { setDone(false); setOpen(false); setTitleEn(''); setBodyEn(''); setTitleFa(''); setBodyFa(''); }, 2000);
    } catch { }
    finally { setSaving(false); }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} title="Send notification to client"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all hover:bg-blue-50"
        style={{ borderColor: '#E5E7EB', color: '#1E40AF' }}>
        <Bell className="w-3.5 h-3.5" />Notify
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: '#1E40AF' }} />
            <h3 className="text-base font-serif font-bold" style={{ color: '#1E2430' }}>
              Send Notification {clientName ? `to ${clientName}` : ''}
            </h3>
          </div>
          <button onClick={() => setOpen(false)}><X className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#DBEAFE' }}>
              <Bell className="w-6 h-6" style={{ color: '#1E40AF' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#1E40AF' }}>Notification sent!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Type</label>
              <select value={type} onChange={e => handleTypeChange(e.target.value as NotificationType)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-yellow-600">
                {TYPES.map(t => <option key={t} value={t}>{NOTIFICATION_TYPE_LABELS[t].icon} {NOTIFICATION_TYPE_LABELS[t].en}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Title (EN) *</label>
                <input value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Title (FA)</label>
                <input value={titleFa} onChange={e => setTitleFa(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" dir="rtl" style={{ fontFamily: 'Tahoma' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Message (EN) *</label>
              <textarea rows={3} value={bodyEn} onChange={e => setBodyEn(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 resize-none" placeholder="Message in English…" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: '#1E2430' }}>Message (FA)</label>
              <textarea rows={2} value={bodyFa} onChange={e => setBodyFa(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600 resize-none" dir="rtl" style={{ fontFamily: 'Tahoma' }} placeholder="متن فارسی (اختیاری)…" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setOpen(false)} className="flex-1 py-2 text-sm font-medium rounded-lg border" style={{ borderColor: '#E5E7EB', color: '#5E6470' }}>Cancel</button>
              <button onClick={handleSend} disabled={saving || !titleEn.trim() || !bodyEn.trim()} className="flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
