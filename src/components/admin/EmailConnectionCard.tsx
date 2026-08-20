'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { MailCheck, RefreshCw } from 'lucide-react';

interface EmailStatus {
  mailbox: string;
  mxReady: boolean;
  spfReady: boolean;
  dmarcReady: boolean;
  dkimReady: boolean;
  smtpReady: boolean;
  outboundReady: boolean;
  automaticDnsReady: boolean;
}

export default function EmailConnectionCard() {
  const [mailbox, setMailbox] = useState('info@plucogroup.com');
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function request(method: 'GET' | 'POST') {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('Your administrator session expired.');
    const response = await fetch('/api/admin/email-connection', {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify({ mailbox }) } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Email connection check failed.');
    return data;
  }

  async function refresh() {
    setBusy(true);
    setMessage('');
    try {
      const data = await request('GET');
      setStatus(data);
      setMailbox(data.mailbox);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Email connection check failed.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
    // The initial status check runs once after the authenticated page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connect() {
    setBusy(true);
    setMessage('');
    try {
      await request('POST');
      setMessage('DNS records were added. DNS propagation and mailbox authentication are being rechecked.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Email connection failed.');
    } finally {
      setBusy(false);
    }
  }

  const indicators = [
    ['Incoming mail (MX)', status?.mxReady],
    ['Sender policy (SPF)', status?.spfReady],
    ['Domain policy (DMARC)', status?.dmarcReady],
    ['Email signature (DKIM)', status?.dkimReady],
    ['Outgoing email delivery', status?.outboundReady],
  ] as const;

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-md" aria-label="PLUCO business email connection">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.14em] text-[#9A762F]">Business email</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-[#071C3C]"><MailCheck className="h-6 w-6" /> Connect info@plucogroup.com</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">This control checks both public DNS and the configured mailbox login. It never reports “connected” from DNS alone.</p>
        </div>
        <button onClick={refresh} disabled={busy} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50"><RefreshCw className="h-4 w-4" /> Recheck</button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {indicators.map(([label, ready]) => <div key={label} className={`rounded-lg p-3 text-sm font-semibold ${ready ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>{ready ? 'Ready' : 'Not ready'} · {label}</div>)}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input aria-label="Business email address" type="email" value={mailbox} onChange={event => setMailbox(event.target.value)} className="min-h-11 flex-1 rounded-lg border px-4" />
        <button onClick={connect} disabled={busy || mailbox.trim().toLowerCase() !== 'info@plucogroup.com'} className="min-h-11 rounded-lg bg-[#071C3C] px-5 font-bold text-white disabled:opacity-50">{busy ? 'Checking…' : 'Add DNS records and connect'}</button>
      </div>
      {status && !status.automaticDnsReady ? <p className="mt-3 text-xs text-amber-800">Automatic DNS is locked until a least-privilege Cloudflare DNS token is configured.</p> : null}
      {message ? <p role="status" className="mt-3 rounded-lg bg-slate-100 p-3 text-sm">{message}</p> : null}
    </section>
  );
}
