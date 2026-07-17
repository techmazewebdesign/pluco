import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "International Contracts Advisory | PLUCO GROUP",
  description: "Drafting, review, negotiation and legal risk management for international contracts and cross-border transactions.",
  path: "/international-contracts",
});

export default function InternationalContractsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
