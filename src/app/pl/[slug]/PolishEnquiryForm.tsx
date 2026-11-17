'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { POLISH_PAGES } from '@/lib/polishContent';

const services = ['eu-residency', 'spain-digital-nomad-visa', 'new-identity', 'sao-tome-citizenship-by-investment', 'us-green-card', 'banking', 'eu-company-registration', 'eu-property-purchase', 'business-solutions', 'international-contracts', 'dispute-resolution'] as const;
const inputClass = 'block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-base';

export default function PolishEnquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get('firstName') ?? '').trim();
    const lastName = String(form.get('lastName') ?? '').trim();
    setState('sending');
    try {
      const result = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, fullName: `${firstName} ${lastName}`,
          email: form.get('email'), phone: form.get('phone'),
          service: form.get('service'), description: form.get('description'),
          company: '', nationality: '', country: '', familyMembers: '', numFamilyMembers: '',
          urgency: '', preferredContact: 'Email',
          consent: form.get('consent') === 'on', language: 'Polish', locale: 'pl',
          sourcePage: '/pl/enquire',
        }),
      });
      const data = await result.json();
      setState(result.ok && data.success ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') return <p role="status">Dziękujemy. Otrzymaliśmy Twoje zapytanie i skontaktujemy się z Tobą.</p>;

  return (
    <form onSubmit={submit} aria-busy={state === 'sending'} className="grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Imię<input className={inputClass} name="firstName" autoComplete="given-name" required maxLength={100} /></label>
        <label>Nazwisko<input className={inputClass} name="lastName" autoComplete="family-name" required maxLength={100} /></label>
      </div>
      <label>Adres e-mail<input className={inputClass} name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>Telefon (opcjonalnie)<input className={inputClass} name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
      <label>Temat zapytania
        <select className={inputClass} name="service" defaultValue="" required>
          <option disabled value="">Wybierz temat</option>
          {services.map(service => <option key={service} value={service}>{POLISH_PAGES[service].title}</option>)}
          <option value="General">Inna sprawa</option>
        </select>
      </label>
      <label>Krótki opis sprawy<textarea className={inputClass} name="description" rows={5} maxLength={2000} required /></label>
      <label className="flex items-start gap-2"><input className="mt-1" type="checkbox" name="consent" required /> Wyrażam zgodę na przetwarzanie podanych danych w celu obsługi mojego zapytania.</label>
      <Link className="w-fit underline" href="/pl/privacy-policy">Polityka prywatności</Link>
      <button type="submit" className="w-fit rounded-md bg-[#16574e] px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={state === 'sending'}>
        {state === 'sending' ? 'Wysyłanie…' : 'Wyślij zapytanie'}
      </button>
      {state === 'error' && <p role="alert" className="text-red-800">Nie udało się wysłać zapytania. Spróbuj ponownie lub napisz na info@plucogroup.com.</p>}
    </form>
  );
}
