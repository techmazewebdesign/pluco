import type { Metadata } from 'next';
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Trust from "@/components/sections/Trust";
import ConsultationProcess from "@/components/sections/ConsultationProcess";
import DiscreetContact from "@/components/sections/DiscreetContact";
import Position from "@/components/sections/Position";
import DiscreetFirstContact from "@/components/sections/DiscreetFirstContact";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "PLUCO GROUP – European Immigration Law & Private Client Advisory",
  description: "PLUCO GROUP assists high-net-worth individuals, families, investors and entrepreneurs with European residency, second citizenship, property acquisition, banking support and cross-border legal protection.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Trust />
      <ConsultationProcess />
      <DiscreetContact />
      <Position />
      <DiscreetFirstContact />
      <ContactCTA />
    </div>
  );
}
