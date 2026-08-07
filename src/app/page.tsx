import type { Metadata } from 'next';
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
  title: "PLUCO GROUP – European Immigration Law & Private Client Advisory",
  description: "PLUCO GROUP assists international families and entrepreneurs with European residency, mobility planning, property, banking and cross-border legal matters.",
  path: "/",
});

export default function Home() {
  return (
    <div className="pluco-dark-home min-h-screen">
      <Hero />
      <FeaturedResidencyService />
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
