import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Position from "@/components/sections/Position";
import Industries from "@/components/sections/Industries";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <Position />
      <Industries />
      <ContactCTA />
    </div>
  );
}
