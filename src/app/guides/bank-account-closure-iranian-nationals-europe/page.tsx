import type { Metadata } from 'next';
import Link from 'next/link';
import TrackedGuideLink from '@/components/seo/TrackedGuideLink';
import { SITE_URL } from '@/lib/siteMetadata';

const PAGE_PATH = '/guides/bank-account-closure-iranian-nationals-europe';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const PERSIAN_URL = `${SITE_URL}/fa/guides/bank-account-closure-iranians-europe`;
const REVIEWED_ON = '2026-07-25';
const OFFICIAL_SOURCE_URLS = [
  'https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/bank-accounts-eu/index_en.htm',
  'https://www.eba.europa.eu/activities/information-consumers/how-complain',
  'https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en',
  'https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures/contacts-eu-sanctions_en',
];

export const metadata: Metadata = {
  title: 'European Bank Account Closure for Iranian Nationals',
  description:
    'Practical steps for Iranian nationals facing a European bank account restriction, closure notice, source-of-funds review, or compliance request.',
  keywords: [
    'European bank account closure Iranian nationals',
    'Iranian bank account frozen Europe',
    'source of funds review Iranian client',
    'banking discrimination Iranian nationals',
    'European bank compliance lawyer Iranian',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      fa: PERSIAN_URL,
      'x-default': PAGE_URL,
    },
  },
  openGraph: {
    title: 'European Bank Account Closure for Iranian Nationals',
    description:
      'A documented response framework for account restrictions, closure notices, and source-of-funds requests involving Iranian nationals in Europe.',
    url: PAGE_URL,
    type: 'article',
    locale: 'en_US',
    alternateLocale: ['fa_IR'],
  },
};

const faqs = [
  {
    question: 'Does Iranian nationality automatically mean an EU bank account must be closed?',
    answer:
      'No single answer applies to every case. Nationality, residence, the source and route of funds, sanctions listings, customer due diligence, and a bank’s internal risk policy are distinct issues. The legal position and available complaint route depend on the country, account type, facts, and notice issued.',
  },
  {
    question: 'What should I send when a bank asks for source-of-funds evidence?',
    answer:
      'Send a concise explanation linked to independently verifiable documents. Typical evidence may include contracts, payslips, sale documents, tax records, corporate records, and statements showing the path from the originating account to the destination account. Only send documents relevant to the bank’s request.',
  },
  {
    question: 'Can PLUCO GROUP guarantee that the bank will reopen or retain my account?',
    answer:
      'No. PLUCO GROUP can review correspondence, organise documentation, identify gaps, and coordinate appropriate specialist support. The financial institution and competent authorities retain their own decision-making powers.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'European Bank Account Closure for Iranian Nationals',
      description:
        'Practical steps for Iranian nationals facing a European bank account restriction, closure notice, source-of-funds review, or compliance request.',
      inLanguage: 'en',
      datePublished: REVIEWED_ON,
      dateModified: REVIEWED_ON,
      mainEntityOfPage: PAGE_URL,
      author: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'PLUCO GROUP',
        url: SITE_URL,
      },
      publisher: { '@id': `${SITE_URL}/#organization` },
      citation: OFFICIAL_SOURCE_URLS,
      about: [
        'Bank account closure',
        'Source of funds',
        'Banking compliance',
        'Iranian nationals in Europe',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Banking & Compliance', item: `${SITE_URL}/banking` },
        { '@type': 'ListItem', position: 3, name: 'Bank Account Closure Guide', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

const firstActions = [
  'Save the notice, in-app messages, reference numbers, and dates of every call.',
  'Identify whether the bank has held one transfer, restricted access, requested documents, or terminated the relationship.',
  'Ask for the response deadline, responsible department, case reference, and required documents in writing.',
  'List urgent salary, rent, tax, loan, and household payments that may be affected.',
  'Preserve original files and never alter a document or invent an explanation to fill a gap.',
];

const evidence = [
  'Current identity, lawful residence, and address evidence',
  'The contract or event that generated the funds',
  'Originating, intermediary, and receiving account statements',
  'Relevant tax, ownership, employment, or corporate records',
  'An explanation of third parties and the beneficial owner of the funds',
  'Certified translations where the receiving institution requires them',
];

export default function BankAccountClosureGuidePage() {
  return (
    <main className="bg-[#F7F5EF] text-[#172033]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <article>
        <header className="bg-[#071C3C] text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
              <Link href="/">Home</Link>
              <span className="px-2">/</span>
              <Link href="/banking">Banking &amp; Compliance</Link>
            </nav>
            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-[#E3C783]">
              Banking compliance guide · 12 minute read
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              European Bank Account Closure for Iranian Nationals
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              A practical response framework for Iranian nationals who receive an account
              restriction, closure notice, source-of-funds request, or enhanced due-diligence
              enquiry from a European financial institution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span>
                Prepared by{' '}
                <Link href="/editorial-standards" className="underline underline-offset-4">
                  PLUCO GROUP
                </Link>
              </span>
              <span>·</span>
              <time dateTime={REVIEWED_ON}>Updated 25 July 2026</time>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
          <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-5 text-sm leading-7 text-slate-700">
            This guide provides general information, not legal advice for a specific case. Rules,
            deadlines, complaint bodies, and a bank&apos;s contractual rights vary by country and
            institution. Do not send full bank statements or identity documents through an
            unsecured first-contact form.
          </div>

          <section className="mt-12">
            <h2 className="text-3xl font-black">1. Identify what the bank has actually done</h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
              <p>
                “Frozen account” is often used for several different events: a single payment may
                be held, online access may be restricted, the bank may request additional customer
                information, or it may issue notice that the banking relationship will end. Record
                the exact wording, effective date, and response deadline.
              </p>
              <p>
                Ask the institution to confirm the case reference, responsible team, deadline, and
                requested evidence in writing. The bank may be unable to disclose every detail of
                an internal or regulatory review, but a precise written request helps prevent an
                unfocused document dump.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-black">2. Actions for the first 24–48 hours</h2>
            <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-6">
              {firstActions.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-[#8B6A23]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-8 text-slate-700">
              If the deadline is short, acknowledge the request before it expires. Identify what
              can be provided immediately, state which relevant records are still being obtained,
              and request a reasonable extension where necessary.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-black">3. Build a traceable source-of-funds file</h2>
            <p className="mt-5 leading-8 text-slate-700">
              A useful file connects the origin of the money, its beneficial owner, its route, and
              the purpose of the transaction. Begin with a one-page chronology, then link each
              material statement to independent evidence, dates, amounts, and currencies.
            </p>
            <ul className="mt-6 grid gap-3 rounded-2xl bg-white p-6 sm:grid-cols-2">
              {evidence.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-[#8B6A23]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 leading-8 text-slate-700">
              For employment income, connect the employment agreement, payslips, tax treatment,
              and incoming credits. For a property or company sale, connect ownership, the sale
              agreement, taxes, and the payment route. For a gift or inheritance, explain the
              relationship, legal basis, donor or estate evidence, and banking trail.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-black">
              4. Separate nationality, sanctions, and customer-risk questions
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-slate-700">
              <p>
                Iranian nationality, place of birth, residence, an Iran-linked transaction, and
                designation on a sanctions list are not interchangeable facts. Financial
                institutions must comply with applicable sanctions and anti-money-laundering rules,
                while also applying their own risk policies and customer due diligence.
              </p>
              <p>
                A response should separate the relevant facts: who owns the funds, how they were
                generated, whether any party is designated, and which countries and institutions
                were involved in the transfer. The outcome depends on the applicable law, account
                type, contractual position, and evidence.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-black">5. Escalate a complaint in the correct order</h2>
            <p className="mt-5 leading-8 text-slate-700">
              The European Banking Authority recommends contacting the institution first and
              supporting the complaint with relevant records. If the final response is
              unsatisfactory, identify the competent national authority, financial ombudsman, or
              out-of-court dispute body for the country concerned. Deadlines and jurisdiction vary.
            </p>
            <ol className="mt-6 grid gap-4 rounded-2xl bg-white p-6">
              <li><strong>1.</strong> Submit a formal, evidenced complaint to the bank.</li>
              <li><strong>2.</strong> Request a final response and preserve its reference number.</li>
              <li><strong>3.</strong> Check the national regulator, ombudsman, or dispute-resolution route.</li>
              <li><strong>4.</strong> Seek urgent local legal advice if access to essential funds or a short legal deadline is at risk.</li>
            </ol>
          </section>

          <section className="mt-12 rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-black">Official sources</h2>
            <ul className="mt-5 grid gap-3 leading-7">
              <li>
                <a className="font-bold text-[#71551d] underline" href="https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/bank-accounts-eu/index_en.htm" target="_blank" rel="noopener noreferrer">
                  Your Europe: bank accounts and the right to a basic payment account
                </a>
              </li>
              <li>
                <a className="font-bold text-[#71551d] underline" href="https://www.eba.europa.eu/activities/information-consumers/how-complain" target="_blank" rel="noopener noreferrer">
                  European Banking Authority: how to complain
                </a>
              </li>
              <li>
                <a className="font-bold text-[#71551d] underline" href="https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en" target="_blank" rel="noopener noreferrer">
                  European Commission: EU anti-money-laundering framework
                </a>
              </li>
              <li>
                <a className="font-bold text-[#71551d] underline" href="https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures/contacts-eu-sanctions_en" target="_blank" rel="noopener noreferrer">
                  European Commission: national competent authorities for EU sanctions
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-black">Frequently asked questions</h2>
            <div className="mt-6 grid gap-4">
              {faqs.map((item) => (
                <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <summary className="cursor-pointer font-black leading-7">{item.question}</summary>
                  <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <nav aria-label="Related guides" className="mt-12">
            <h2 className="text-2xl font-black">Related practical guides</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  href: '/guides/source-of-funds-file',
                  title: 'How to prepare a source-of-funds file',
                },
                {
                  href: '/guides/eu-bank-account-opening-iranian-nationals',
                  title: 'Opening an EU bank account as an Iranian national',
                },
                {
                  href: '/guides/eu-company-versus-residency',
                  title: 'EU company registration versus personal residency',
                },
              ].map((relatedGuide) => (
                <TrackedGuideLink
                  key={relatedGuide.href}
                  href={relatedGuide.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 font-black leading-7 transition hover:border-[#C9A35A] hover:shadow-md"
                  guideSlug="bank-account-closure-iranian-nationals-europe"
                  locale="en"
                  action="related_guide"
                >
                  {relatedGuide.title}
                </TrackedGuideLink>
              ))}
            </div>
          </nav>

          <section className="mt-12 rounded-3xl bg-[#071C3C] p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-[#E3C783]">Private review</p>
            <h2 className="mt-3 text-3xl font-black">
              Organise the facts before replying to the bank
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-200">
              PLUCO GROUP can review the timeline, bank correspondence, source-of-funds structure,
              and documentation gaps, then coordinate appropriate jurisdiction-specific support
              where required. No account-opening, retention, transfer, or complaint outcome is
              guaranteed.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/enquire" className="rounded-full bg-[#C9A35A] px-6 py-3 font-bold text-[#071C3C]">
                Start a private enquiry
              </Link>
              <Link href={PERSIAN_URL.replace(SITE_URL, '')} className="rounded-full border border-white/40 px-6 py-3 font-bold text-white">
                نسخه فارسی
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
