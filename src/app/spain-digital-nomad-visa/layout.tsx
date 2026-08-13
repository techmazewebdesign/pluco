import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

const TITLE = "Spain Digital Nomad Visa";
const DESCRIPTION = "Spain Digital Nomad Visa preparation for employees, freelancers, founders and families, including document coordination and specialist handoff.";

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
