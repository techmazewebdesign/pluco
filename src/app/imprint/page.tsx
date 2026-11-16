import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Legal Notice - PLUCO GROUP SP. Z O.O.',
  description: 'Operator and company information for PLUCO GROUP SP. Z O.O.',
  path: '/imprint',
});

export default function Imprint() {
  return <main className="min-h-screen bg-white px-4 pb-20 pt-32 text-gray-700">
    <article className="mx-auto max-w-4xl space-y-8">
      <header><h1 className="font-serif text-4xl text-navy-900 md:text-5xl">Legal Notice</h1><p className="mt-4">Operator information for this commercial website.</p></header>
      <section><h2 className="mb-3 font-serif text-2xl text-navy-900">Company</h2><p>PLUCO GROUP SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ<br/>Ksawerów 3, 02-656 Warsaw, Poland<br/>Email: <a className="underline" href="mailto:info@plucogroup.com">info@plucogroup.com</a></p></section>
      <section><h2 className="mb-3 font-serif text-2xl text-navy-900">Registration</h2><p>KRS: 0000564904<br/>NIP: 5272739549<br/>REGON: 361874067</p></section>
      <section><h2 className="mb-3 font-serif text-2xl text-navy-900">PLUCO GROUP and DESIVO</h2><p>DESIVO is a department of PLUCO GROUP dedicated to digital growth, business systems, automation and European market expansion. PLUCO GROUP confirms <a className="underline" href="https://desivo.de" target="_blank" rel="noopener noreferrer">desivo.de</a> and <a className="underline" href="https://desivo.pl" target="_blank" rel="noopener noreferrer">desivo.pl</a> as the official service domains for DESIVO. Project scope, pricing, deliverables and any applicable third-party arrangements are defined in the relevant written engagement.</p></section>
      <section><h2 className="mb-3 font-serif text-2xl text-navy-900">Professional-services notice</h2><p>Website information is general information, not legal, tax, financial, immigration or investment advice. A website enquiry does not create a lawyer-client relationship. Regulated legal work is undertaken only where a formal engagement identifies the appropriately qualified professional and applicable professional rules; otherwise PLUCO GROUP provides coordination and strategic support with independent licensed advisers.</p></section>
    </article>
  </main>;
}
