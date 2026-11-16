import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteMetadata";

const path = "/iranian-clients";
const url = `${SITE_URL}${path}`;
const persianUrl = `${SITE_URL}/fa/iranians-abroad`;

export const metadata: Metadata = {
  title: { absolute: "European immigration, banking and business support for Iranian clients | PLUCO GROUP" },
  description:
    "General information about PLUCO GROUP support for Iranian clients considering European residency, company formation, banking compliance and cross-border matters.",
  alternates: {
    canonical: url,
    languages: { en: url, fa: persianUrl, "x-default": url },
  },
  openGraph: {
    title: "European immigration, banking and business support for Iranian clients | PLUCO GROUP",
    description:
      "General information about European residency, company formation, banking compliance and cross-border matters.",
    url,
    locale: "en_US",
    alternateLocale: ["fa_IR"],
    type: "website",
  },
};

const services = [
  ["European residency planning", "Compare relevant residence options against work, family, income and documentation circumstances.", "/eu-residency"],
  ["Spain remote-work residency", "Understand the questions to review before preparing a Spain digital-nomad residence file.", "/spain-digital-nomad-visa"],
  ["Banking and compliance", "Prepare clear records for source-of-funds, source-of-wealth and banking compliance discussions.", "/banking"],
  ["European company registration", "Separate corporate formation, banking and personal immigration considerations before taking formal steps.", "/eu-company-registration"],
  ["International contracts", "Identify contractual and cross-border questions that may require an appropriately qualified professional.", "/international-contracts"],
] as const;

export default function IranianClientsPage() {
  return (
    <main className="bg-[#F7F5EF] text-[#172033]">
      <section className="bg-[#071C3C] text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#E3C783]">For Iranian clients worldwide</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">European immigration, banking and business support for Iranian clients</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">A factual starting point for families, professionals and entrepreneurs facing European residency, banking, company or cross-border questions.</p>
          <Link href="/fa/iranians-abroad" hrefLang="fa" className="mt-8 inline-block rounded-full border border-[#E3C783] px-6 py-3 font-bold text-[#E3C783]">مطالعه به فارسی</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 leading-8 text-slate-700"><strong>Start with the facts, not a promised outcome.</strong> Nationality, residence, family, income, source of funds and the rules of the relevant country can affect the available options. This page is general information, not legal, tax, financial or immigration advice.</div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map(([title, summary, href]) => (
            <article key={title} className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-4 leading-7 text-slate-700">{summary}</p>
              <Link href={href} className="mt-6 inline-block font-bold text-[#71551d] underline underline-offset-4">View service information</Link>
            </article>
          ))}
        </div>
        <section className="mt-14 rounded-3xl bg-[#071C3C] p-8 text-white sm:p-10"><h2 className="text-3xl font-black">Need help identifying a sensible first step?</h2><p className="mt-4 max-w-3xl leading-8 text-slate-200">Submit a short factual outline of the country, current status and issue. Do not send passwords, access codes or complete identity and banking documents in an initial enquiry.</p><Link href="/enquire" className="mt-7 inline-block rounded-full bg-[#E3C783] px-6 py-3 font-bold text-[#071C3C]">Start a private enquiry</Link></section>
      </section>
    </main>
  );
}
