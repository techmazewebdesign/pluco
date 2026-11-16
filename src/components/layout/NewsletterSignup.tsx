'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { newsletterCopy } from '@/lib/newsletterCopy';

export default function NewsletterSignup({ isRTL }: { isRTL: boolean }) {
  const locale = isRTL ? 'fa' : 'en';
  const copy = newsletterCopy[locale];
  const [status, setStatus] = useState<'idle' | 'sending' | 'submitted' | 'limited' | 'error'>('idle');

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), consent: data.get('consent') === 'on', locale }),
      });
      if (response.ok) {
        form.reset();
        setStatus('submitted');
      } else {
        setStatus(response.status === 429 ? 'limited' : 'error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="mb-8 grid scroll-mt-24 gap-5 rounded-lg border border-[#C9A35A]/35 px-4 py-5 sm:px-6 md:grid-cols-2 md:items-start">
      <div>
        <h2 id="newsletter-title" className="mb-2 text-lg font-semibold text-[#E0BB75]">{copy.title}</h2>
        <p className="max-w-sm text-sm text-slate-300">{copy.description}</p>
      </div>
      <form onSubmit={subscribe} aria-busy={status === 'sending'}>
        <label htmlFor="newsletter-email" className="mb-1 block text-sm font-medium text-slate-100">{copy.email}</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input id="newsletter-email" name="email" type="email" autoComplete="email" dir="ltr" maxLength={254} required className="min-w-0 flex-1 rounded border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0BB75]" />
          <button type="submit" disabled={status === 'sending'} className="rounded bg-[#E0BB75] px-4 py-2 font-semibold text-[#071C3C] hover:bg-[#EED2A0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0BB75] disabled:opacity-60">
            {status === 'sending' ? copy.sending : copy.subscribe}
          </button>
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm text-slate-200">
          <input id="newsletter-consent" name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[#E0BB75]" />
          <label htmlFor="newsletter-consent">{copy.consent}</label>
        </div>
        <Link href={`/privacy-policy#newsletter-privacy-${locale}`} className="mt-2 inline-block text-sm text-slate-200 underline underline-offset-2 hover:text-white">{copy.privacy}</Link>
        <p role="status" className="mt-2 text-sm text-[#E0BB75]">
          {status === 'submitted' || status === 'limited' || status === 'error' ? copy[status] : ''}
        </p>
      </form>
    </section>
  );
}
