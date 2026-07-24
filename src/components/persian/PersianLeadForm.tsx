'use client';

import { useState } from 'react';
import Link from 'next/link';
import { readSalesAttribution, trackSalesEvent } from '@/lib/salesAttribution';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

export default function PersianLeadForm({ service }: { service: string }) {
  const [state, setState] = useState<SubmitState>('idle');
  const [consent, setConsent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || state === 'sending') return;

    setState('sending');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          phone: data.get('phone'),
          country: data.get('country'),
          service,
          description: data.get('message'),
          language: 'Farsi / Persian',
          preferredContact: data.get('preferredContact'),
          consent,
          locale: 'fa',
          sourcePage: window.location.pathname,
          attribution: readSalesAttribution(),
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      trackSalesEvent('generate_lead', {
        method: 'persian_private_enquiry',
        service,
        locale: 'fa',
        page_path: window.location.pathname,
      });
      form.reset();
      setConsent(false);
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-right">
        <strong className="block text-lg text-emerald-900">درخواست شما ثبت شد.</strong>
        <p className="mt-2 leading-8 text-emerald-800">
          تیم PLUCO GROUP پس از بررسی اطلاعات، از طریق روش انتخابی با شما تماس می‌گیرد.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#C9A35A] focus:ring-2 focus:ring-[#C9A35A]/20';

  return (
    <form onSubmit={submit} className="grid gap-4" dir="rtl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          نام
          <input name="firstName" required autoComplete="given-name" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          نام خانوادگی
          <input name="lastName" required autoComplete="family-name" className={inputClass} />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        ایمیل
        <input name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          شماره تماس یا واتساپ
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          کشور محل اقامت
          <input name="country" autoComplete="country-name" className={inputClass} />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        روش تماس ترجیحی
        <select name="preferredContact" defaultValue="WhatsApp" className={inputClass}>
          <option value="WhatsApp">واتساپ</option>
          <option value="Email">ایمیل</option>
          <option value="Phone">تماس تلفنی</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        شرح کوتاه شرایط و سؤال
        <textarea name="message" required rows={5} className={inputClass} />
      </label>
      <label className="flex items-start gap-3 text-xs leading-7 text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1.5 h-4 w-4 accent-[#071C3C]"
        />
        <span>
          با ارسال فرم، پردازش اطلاعات برای پاسخ به این درخواست را می‌پذیرم و
          {' '}
          <Link href="/privacy-policy" className="font-semibold text-[#71551d] underline">سیاست حریم خصوصی</Link>
          {' '}
          را خوانده‌ام. ارسال فرم به معنی پذیرش پرونده یا تضمین نتیجه نیست.
        </span>
      </label>
      {state === 'error' ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800">
          ارسال انجام نشد. لطفاً دوباره تلاش کنید یا به info@plucogroup.com ایمیل بزنید.
        </p>
      ) : null}
      <button
        disabled={!consent || state === 'sending'}
        className="rounded-full bg-[#071C3C] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B2A58] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === 'sending' ? 'در حال ارسال…' : 'درخواست بررسی محرمانه'}
      </button>
    </form>
  );
}
