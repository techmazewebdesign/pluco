import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Legal Notice / Impressum - Pluco Group',
  description: 'Company and provider information for Pluco Group Sp. z o.o.',
  path: '/impressum',
});

const section = 'rounded-2xl border border-navy-100 bg-white p-6 shadow-sm md:p-8';

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-navy-50 to-slate-50 px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-700">Legal disclosure</p>
          <h1 className="font-serif text-4xl text-navy-900 md:text-5xl">Legal Notice / Impressum</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Provider information pursuant to § 5 of the German Digital Services Act (DDG).
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-5">
          <article className={section}>
            <h2 className="mb-4 font-serif text-2xl text-navy-900">Service provider</h2>
            <p className="leading-8 text-gray-700">
              <strong>PLUCO GROUP SP. Z O.O.</strong><br />
              ul. Ksawerów 3<br />
              02-656 Warszawa<br />
              Poland
            </p>
          </article>

          <article className={section}>
            <h2 className="mb-4 font-serif text-2xl text-navy-900">Registration and management</h2>
            <p className="leading-8 text-gray-700">
              Polish National Court Register (KRS): 0000564904<br />
              NIP: 5272739549<br />
              REGON: 361874067<br />
              Share capital: PLN 100,000<br />
              Management board: Hamidreza Ostadmohammadi
            </p>
          </article>

          <article className={section}>
            <h2 className="mb-4 font-serif text-2xl text-navy-900">Contact</h2>
            <p className="leading-8 text-gray-700">
              Email: <a className="text-navy-800 underline" href="mailto:info@plucogroup.com">info@plucogroup.com</a><br />
              Website: <a className="text-navy-800 underline" href="https://www.plucogroup.com">www.plucogroup.com</a>
            </p>
          </article>

          <article className={section}>
            <h2 className="mb-4 font-serif text-2xl text-navy-900">Dispute resolution</h2>
            <p className="leading-8 text-gray-700">
              Complaints can be submitted by email. We are not obliged to participate in consumer arbitration proceedings before a German consumer arbitration board. Mandatory rights remain unaffected.
            </p>
          </article>

          <nav className="flex flex-wrap gap-4 py-5 text-sm font-semibold text-navy-800" aria-label="Related legal pages">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/disclaimer">Legal Disclaimer</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
