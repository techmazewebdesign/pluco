import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "EU Company Registration | PLUCO GROUP",
  description: "EU jurisdiction selection, company formation, corporate structuring, banking preparation and ongoing compliance coordination.",
  path: "/eu-company-registration",
});

export default function EuCompanyRegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
