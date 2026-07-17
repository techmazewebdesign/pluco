import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

const TITLE = "Spain Digital Nomad Visa";
const DESCRIPTION = "Structured preparation, documentation coordination and legal partner handoff for the Spain Digital Nomad Visa — Bronze, Silver and Gold support packages for employees, freelancers, business owners and families.";

export const metadata: Metadata = createPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/spain-digital-nomad-visa",
  image: "/images/spain-digital-nomad-social-preview.png",
  imageAlt: "PLUCO GROUP – Spain Digital Nomad Visa advisory",
});

export default function SpainDigitalNomadVisaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
