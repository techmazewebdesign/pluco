import type { Metadata } from 'next';
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Position from "@/components/sections/Position";
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
      <Position />
      <ContactCTA />
    </div>
  );
}
