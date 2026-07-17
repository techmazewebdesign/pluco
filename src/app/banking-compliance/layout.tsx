import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Banking Compliance Advisory | PLUCO GROUP",
  description: "Cross-border banking regulation, AML and KYC, compliance frameworks, banking relationships and regulatory risk advisory.",
  path: "/banking-compliance",
});

export default function BankingComplianceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
