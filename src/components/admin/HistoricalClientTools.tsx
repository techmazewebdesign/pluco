'use client';

import { useState } from 'react';
import { FileUp, UserRoundPlus, X } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { parseHistoricalClientCsv, type HistoricalClientInput } from '@/lib/clientImport';

const SAMPLE_CSV = `fullName,email,phone,country,status,lastContactAt,legacyId,notes
Old Client,old.client@example.com,+48 000 000 000,Poland,historical,2024-06-15,PLUCO-001,"Existing client imported without an automatic email"`;

interface ImportResult {
  created: number;
  updated: number;
  invitationsSent: number;
  emailErrors: string[];
}

export default function HistoricalClientTools({ onComplete }: { onComplete: () => Promise<void> }) {
  const [mode, setMode] = useState<'manual' | 'csv' | null>(null);
  const [csvContent, setCsvContent] = useState('');
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [sendInvitations, setSendInvitations] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState<HistoricalClientInput>({ email: '', fullName: '', phone: '', country: '', status: 'historical', notes: '', legacyId: '', lastContactAt: '' });

  async function save(clients: HistoricalClientInput[]) {
    const token = await getAuth().currentUser?.getIdToken();
    if (!token) throw new Error('Your administrator session expired. Sign in again.');
    const response = await fetch('/api/admin/clients/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ clients, sendInvitations }),
    });
    const result = await response.json() as ImportResult & { error?: string };
    if (!response.ok) throw new Error(result.error || 'The client records could not be saved.');
    return result;
  }

  async function submitManual(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const result = await save([manual]);
      setMessage(`Saved: ${result.created} new, ${result.updated} updated. Emails sent: ${result.invitationsSent}.${result.emailErrors.length ? ` ${result.emailErrors.join(' ')}` : ''}`);
      setManual({ email: '', fullName: '', phone: '', country: '', status: 'historical', notes: '', legacyId: '', lastContactAt: '' });
      await onComplete();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The client could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  async function submitCsv() {
    const parsed = parseHistoricalClientCsv(csvContent);
    setCsvErrors(parsed.errors);
    if (!parsed.clients.length || parsed.errors.length) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await save(parsed.clients);
      setMessage(`Imported: ${result.created} new, ${result.updated} updated. Emails sent: ${result.invitationsSent}.${result.emailErrors.length ? ` ${result.emailErrors.join(' ')}` : ''}`);
      await onComplete();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The CSV could not be imported.');
    } finally {
      setBusy(false);
    }
  }

  function loadFile(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') || file.size > 2_000_000) {
      setCsvErrors(['Choose a CSV file smaller than 2 MB.']);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      setCsvContent(content);
      setCsvErrors(parseHistoricalClientCsv(content).errors);
    };
    reader.readAsText(file);
  }

  function close() {
    setMode(null);
    setMessage('');
    setCsvErrors([]);
    setSendInvitations(false);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode('manual')} className="flex items-center gap-2 rounded-lg bg-[#071C3C] px-4 py-2 text-sm font-semibold text-white">
          <UserRoundPlus className="h-4 w-4" /> Add old client
        </button>
        <button onClick={() => setMode('csv')} className="flex items-center gap-2 rounded-lg border border-[#C9A35A] bg-white px-4 py-2 text-sm font-semibold text-[#071C3C]">
          <FileUp className="h-4 w-4" /> Import client CSV
        </button>
      </div>

      {mode ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#071C3C]">{mode === 'manual' ? 'Add an existing client' : 'Import existing clients from CSV'}</h2>
                <p className="mt-1 text-sm text-slate-500">Saving a historical client does not send an email unless you explicitly enable it.</p>
              </div>
              <button aria-label="Close client tool" onClick={close}><X className="h-6 w-6" /></button>
            </div>

            {mode === 'manual' ? (
              <form onSubmit={submitManual} className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">Full name *<input required value={manual.fullName} onChange={event => setManual({ ...manual, fullName: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold">Email *<input required type="email" value={manual.email} onChange={event => setManual({ ...manual, email: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold">Phone<input value={manual.phone} onChange={event => setManual({ ...manual, phone: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold">Country<input value={manual.country} onChange={event => setManual({ ...manual, country: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold">Legacy client ID<input value={manual.legacyId} onChange={event => setManual({ ...manual, legacyId: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold">Last contact<input type="date" value={manual.lastContactAt} onChange={event => setManual({ ...manual, lastContactAt: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" /></label>
                <label className="text-sm font-semibold sm:col-span-2">Notes<textarea value={manual.notes} onChange={event => setManual({ ...manual, notes: event.target.value })} className="mt-1 w-full rounded-lg border p-3 font-normal" rows={3} /></label>
                <label className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm sm:col-span-2"><input type="checkbox" checked={sendInvitations} onChange={event => setSendInvitations(event.target.checked)} className="mt-1" /><span><strong>Send a portal invitation email now.</strong><br />Leave this off when recording an old client who should not be contacted.</span></label>
                <button disabled={busy} className="rounded-lg bg-[#C9A35A] px-5 py-3 font-bold text-[#071C3C] disabled:opacity-50 sm:col-span-2">{busy ? 'Saving…' : 'Save historical client'}</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">Required columns: <strong>fullName</strong> and <strong>email</strong>. Optional: phone, country, status, lastContactAt, legacyId and notes. Quoted commas are supported.</div>
                <button onClick={() => { const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'pluco-existing-clients-sample.csv'; anchor.click(); URL.revokeObjectURL(url); }} className="rounded-lg border px-4 py-2 text-sm font-semibold">Download sample CSV</button>
                <input aria-label="Existing clients CSV file" type="file" accept=".csv,text/csv" onChange={event => loadFile(event.target.files?.[0])} className="block w-full rounded-lg border p-3" />
                <textarea aria-label="Existing clients CSV content" value={csvContent} onChange={event => { setCsvContent(event.target.value); setCsvErrors(parseHistoricalClientCsv(event.target.value).errors); }} rows={9} className="w-full rounded-lg border p-3 font-mono text-xs" placeholder="Paste CSV content here" />
                {csvContent ? <p className="text-sm text-slate-600">Readable client rows: {parseHistoricalClientCsv(csvContent).clients.length}</p> : null}
                {csvErrors.map(error => <p key={error} role="alert" className="text-sm text-red-700">{error}</p>)}
                <label className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm"><input type="checkbox" checked={sendInvitations} onChange={event => setSendInvitations(event.target.checked)} className="mt-1" /><span><strong>Email every imported client after saving.</strong><br />This is off by default so old clients are not contacted accidentally. A single import can send at most 20 invitations.</span></label>
                <button onClick={submitCsv} disabled={busy || !csvContent.trim() || csvErrors.length > 0} className="w-full rounded-lg bg-[#C9A35A] px-5 py-3 font-bold text-[#071C3C] disabled:opacity-50">{busy ? 'Importing…' : 'Import clients'}</button>
              </div>
            )}
            {message ? <p role="status" className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{message}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

