import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from "@/components/sections/Hero";
import FeaturedResidencyService from "@/components/sections/FeaturedResidencyService";
import Services from "@/components/sections/Services";
import Trust from "@/components/sections/Trust";
import ConsultationProcess from "@/components/sections/ConsultationProcess";
import DiscreetContact from "@/components/sections/DiscreetContact";
import Position from "@/components/sections/Position";
import DiscreetFirstContact from "@/components/sections/DiscreetFirstContact";
import ContactCTA from "@/components/sections/ContactCTA";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "European Residency & Private Client Advisory | PLUCO GROUP",
  description: "PLUCO GROUP assists high-net-worth individuals, families, investors and entrepreneurs with European residency, second citizenship, property acquisition, banking support and cross-border legal protection.",
  path: "/",
});
metadata.alternates = { canonical: "https://www.plucogroup.com/", languages: { en: "https://www.plucogroup.com/", fa: "https://www.plucogroup.com/fa", "x-default": "https://www.plucogroup.com/" } };

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedResidencyService />
      <Services />
      <Trust />
      <ConsultationProcess />
      <DiscreetContact />
      <Position />
      <DiscreetFirstContact />
      <ContactCTA />
      <nav aria-label="Client information" className="mx-auto flex max-w-6xl flex-wrap gap-6 px-5 py-8 text-sm">
        <Link href="/iranian-clients">Information for Iranian clients</Link>
        <Link href="/fa" hrefLang="fa" lang="fa" dir="rtl">اطلاعات به فارسی</Link>
      </nav>
    </div>
  );
}
