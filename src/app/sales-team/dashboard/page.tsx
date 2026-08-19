'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, BookOpen, CheckCircle2, Copy, ExternalLink, Globe2, LogOut, MailPlus, Menu, Percent, Send, ShieldCheck, Target, Users, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Overview = {
  member: { displayName?: string; email?: string; role?: string };
  isAdmin: boolean; canInvite: boolean;
  team: Array<{ uid: string; displayName: string; role: string }>;
  invitations: Array<{ id: string; email: string; displayName?: string; status: string }>;
  codes: Array<{ id: string; code: string; discount: number; status: string; approval: string }>;
  materials: Array<{ title: string; type: string; href: string; purpose: string }>;
};

const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(7,28,60,.07)]';

export default function PlucoSalesDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [menu, setMenu] = useState(false);
  const [writtenApproval, setWrittenApproval] = useState(false);
  const [invite, setInvite] = useState({ email: '', displayName: '' });

  const request = useCallback(async (path: string, init?: RequestInit) => {
    if (!user) throw new Error('Sign in is required.');
    const token = await user.getIdToken();
    return fetch(path, { ...init, headers: { ...(init?.headers || {}), Authorization: `Bearer ${token}` } });
  }, [user]);

  const load = useCallback(async () => {
    if (!user) return;
    setError('');
    const response = await request('/api/sales-team/overview', { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Could not load the Sales Team dashboard.');
    setData(payload);
  }, [request, user]);

  useEffect(() => {
    if (!loading && !user) router.replace('/client-sign-in');
    // Loading is an authenticated external request; its state updates resolve asynchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) void load().catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load dashboard.'));
  }, [loading, user, load, router]);

  async function sendInvite(event: FormEvent) {
    event.preventDefault(); setBusy('invite'); setError('');
    try {
      const response = await request('/api/sales-team/invitations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invite) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not send the invitation.');
      setInvite({ email: '', displayName: '' }); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not send invitation.'); }
    finally { setBusy(''); }
  }

  async function createCode(discount: 5 | 10 | 15) {
    setBusy(`code:${discount}`); setError('');
    try {
      const response = await request('/api/sales-team/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ discount, writtenApproval: discount === 15 && writtenApproval }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not create the proposal code.');
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not create code.'); }
    finally { setBusy(''); }
  }

  if (loading || (user && !data && !error)) return <main className="min-h-screen bg-[#f6f7f9] grid place-items-center text-[#071c3c]">Loading PLUCO Sales Team…</main>;
  if (error && !data) return <main className="min-h-screen bg-[#f6f7f9] grid place-items-center p-6"><div className={`${panel} max-w-lg text-center`}><ShieldCheck className="mx-auto text-[#c9a35a]"/><h1 className="mt-4 text-2xl font-bold text-[#071c3c]">Protected Sales Team access</h1><p className="mt-3 text-sm leading-7 text-slate-600">{error}</p><Link className="mt-5 inline-block rounded-xl bg-[#071c3c] px-5 py-3 text-sm font-bold text-white" href="/client-sign-in">Return to sign in</Link></div></main>;
  if (!data) return null;

  const leader = data.member.role === 'team_leader';
  const nav = [
    { label: 'Operating plan', href: '#plan', icon: Target }, { label: 'Prospects', href: '#prospects', icon: Send },
    { label: 'Materials', href: '#materials', icon: BookOpen }, { label: 'Proposal codes', href: '#codes', icon: Percent },
    { label: 'Invite team', href: '#team', icon: Users },
  ];

  return <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3"><button className="rounded-lg p-2 lg:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X/> : <Menu/>}</button><div><strong className="text-lg tracking-[.12em] text-[#071c3c]">PLUCO</strong><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9a762f]">Global Sales Team</p></div></div>
        <div className="flex items-center gap-3"><span className="hidden text-right sm:block"><strong className="block text-xs text-[#071c3c]">{data.member.displayName || user?.displayName || 'Sales member'}</strong><span className="text-[10px] text-slate-500">{leader ? 'Team leader' : 'Sales member'}</span></span><button onClick={async()=>{await signOut();router.push('/')}} className="rounded-lg border border-slate-200 p-2 text-slate-500" aria-label="Sign out"><LogOut size={17}/></button></div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
      <aside className={`${menu ? 'block' : 'hidden'} fixed inset-x-0 top-[65px] z-30 border-b border-slate-200 bg-white p-4 lg:static lg:block lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r`}>
        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[.14em] text-slate-400">Workspaces</p>
        <nav className="space-y-1">{nav.map(({label,href,icon:Icon})=><a key={label} href={href} onClick={()=>setMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-[#f4efe5] hover:text-[#071c3c]"><Icon size={17}/>{label}</a>)}</nav>
        {data.isAdmin ? <Link href="/admin/dashboard" className="mt-6 flex items-center gap-3 rounded-xl bg-[#071c3c] px-3 py-3 text-sm font-bold text-white"><ShieldCheck size={17}/>Open admin dashboard</Link> : null}
        <p className="mt-6 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500">Use published PLUCO information only. Never promise a visa, bank account, ranking, result, or guaranteed income.</p>
      </aside>

      <main className="min-w-0 p-4 sm:p-7 lg:p-10">
        <section id="plan" className="overflow-hidden rounded-[28px] bg-[#071c3c] p-6 text-white shadow-2xl sm:p-9">
          <p className="text-xs font-black uppercase tracking-[.17em] text-[#d9b86f]">Your role at PLUCO GROUP</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">Turn relevant global conversations into qualified private enquiries.</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">Learn the services, select an appropriate published guide, start a respectful conversation, record the prospect, follow up, and hand qualified enquiries to PLUCO. The dashboard keeps the team consistent and accountable.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3"><Metric label="Active team" value={String(data.team.length)}/><Metric label="Your available codes" value={String(data.codes.filter(code=>code.status==='available').length)}/><Metric label="Pending invitations" value={String(data.invitations.filter(item=>item.status==='pending').length)}/></div>
        </section>

        {error ? <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <section id="prospects" className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <article className={panel}><div className="flex items-center gap-3"><Target className="text-[#c9a35a]"/><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#9a762f]">Weekly operating rhythm</p><h2 className="text-2xl font-bold text-[#071c3c]">A clear path from traffic to follow-up</h2></div></div><ol className="mt-5 grid gap-3">{[
            ['Choose one audience','Focus on a market and a specific need; do not broadcast generic promises.'],
            ['Share one relevant guide','Use a PLUCO product page or prepared demo with a tracked proposal code.'],
            ['Record consent and context','Add the prospect only when there is a lawful business reason and record the source.'],
            ['Follow up with value','Answer the question, reference the guide, and propose the secure enquiry form.'],
            ['Hand off qualified interest','PLUCO reviews eligibility, conflicts, scope, and pricing before any commitment.'],
          ].map(([title,body],i)=><li key={title} className="flex gap-3 rounded-xl bg-slate-50 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c9a35a] text-sm font-black text-[#071c3c]">{i+1}</span><span><strong className="block text-sm text-[#071c3c]">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span></span></li>)}</ol></article>
          <article className={panel}><BarChart3 className="text-[#c9a35a]"/><h2 className="mt-3 text-xl font-bold text-[#071c3c]">Admin CRM and follow-up</h2><p className="mt-2 text-sm leading-6 text-slate-600">Sara and PLUCO administrators use the existing lead desk to upload CSV contacts, add prospects, review source information, and record follow-up status.</p><div className="mt-5 grid gap-3">{data.isAdmin ? <><Link href="/admin/dashboard/leads" className="rounded-xl bg-[#071c3c] px-4 py-3 text-center text-sm font-bold text-white">Open leads and CSV import</Link><Link href="/admin/dashboard" className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-[#071c3c]">Open PLUCO admin</Link></> : <p className="rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-800">Salespeople should submit qualified prospect context to a PLUCO administrator. Private cases and full client records remain separated from this workspace.</p>}</div></article>
        </section>

        <section id="materials" className="mt-7"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.13em] text-[#9a762f]">Approved sales kit</p><h2 className="text-2xl font-bold text-[#071c3c]">Demos and materials to use globally</h2></div><Globe2 className="text-[#c9a35a]"/></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.materials.map(item=><article key={item.title} className={panel}><span className="rounded-full bg-[#f4efe5] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#8a6929]">{item.type}</span><h3 className="mt-4 text-lg font-bold text-[#071c3c]">{item.title}</h3><p className="mt-2 min-h-14 text-xs leading-6 text-slate-500">{item.purpose}</p><Link href={item.href} target="_blank" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#9a762f]">Open material <ExternalLink size={14}/></Link></article>)}</div></section>

        <section id="codes" className="mt-7 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <article className={panel}><Percent className="text-[#c9a35a]"/><h2 className="mt-3 text-xl font-bold text-[#071c3c]">Create a tracked proposal code</h2><p className="mt-2 text-xs leading-6 text-slate-500">Codes are single-owner references for a manually verified PLUCO proposal or invoice. They are not automatic checkout coupons and cannot be transferred.</p><div className="mt-5 grid grid-cols-3 gap-2">{([5,10,15] as const).map(value=><button key={value} disabled={busy===`code:${value}` || (value>5&&!leader) || (value===15&&!writtenApproval)} onClick={()=>void createCode(value)} className="rounded-xl border border-slate-200 px-2 py-3 text-sm font-black text-[#071c3c] disabled:cursor-not-allowed disabled:opacity-40">{value}%</button>)}</div>{leader ? <label className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-slate-500"><input type="checkbox" checked={writtenApproval} onChange={event=>setWrittenApproval(event.target.checked)} className="mt-1"/>I confirm written exceptional approval exists before issuing a 15% code.</label> : null}<p className="mt-3 text-[10px] leading-5 text-slate-400">5% is sales-ready. 10% requires a team leader. 15% requires exceptional written approval.</p></article>
          <article className={panel}><h2 className="text-xl font-bold text-[#071c3c]">Your code wallet</h2><div className="mt-4 grid gap-2">{data.codes.length ? data.codes.map(code=><div key={code.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><span><code className="font-black text-[#071c3c]">{code.code}</code><span className="ml-2 text-xs text-slate-500">{code.discount}% · {code.status}</span></span><button onClick={()=>navigator.clipboard.writeText(code.code)} className="rounded-lg border border-slate-200 bg-white p-2" aria-label="Copy code"><Copy size={14}/></button></div>) : <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No proposal codes yet.</p>}</div></article>
        </section>

        <section id="team" className="mt-7 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className={panel}><MailPlus className="text-[#c9a35a]"/><h2 className="mt-3 text-xl font-bold text-[#071c3c]">Invite a Sales Team member</h2><p className="mt-2 text-xs leading-6 text-slate-500">Only an active Sales Team member can send an invitation. It is delivered by info@plucogroup.com and can be claimed only by the exact verified Google account.</p><form onSubmit={sendInvite} className="mt-5 grid gap-3"><input required type="email" value={invite.email} onChange={event=>setInvite({...invite,email:event.target.value})} placeholder="Business email" className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-[#c9a35a]"/><input value={invite.displayName} onChange={event=>setInvite({...invite,displayName:event.target.value})} placeholder="Display name (optional)" className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-[#c9a35a]"/><button disabled={busy==='invite'} className="min-h-12 rounded-xl bg-[#071c3c] px-5 font-bold text-white disabled:opacity-50">{busy==='invite'?'Sending…':'Send protected invitation'}</button></form></article>
          <article className={panel}><Users className="text-[#c9a35a]"/><h2 className="mt-3 text-xl font-bold text-[#071c3c]">Active team</h2><div className="mt-4 grid gap-2">{data.team.map(member=><div key={member.uid} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#071c3c] text-xs font-black text-white">{member.displayName.slice(0,1).toUpperCase()}</span><span><strong className="block text-sm text-[#071c3c]">{member.displayName}</strong><span className="text-[10px] text-slate-500">{member.role.replace('_',' ')}</span></span></span><CheckCircle2 size={17} className="text-emerald-600"/></div>)}</div></article>
        </section>
      </main>
    </div>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><strong className="block text-2xl text-[#d9b86f]">{value}</strong><span className="mt-1 block text-xs text-slate-300">{label}</span></div>;
}
