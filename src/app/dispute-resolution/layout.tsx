import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cross-Border Dispute Resolution | PLUCO GROUP",
  description: "Strategic dispute assessment, negotiation, settlement documentation and specialist counsel coordination for cross-border matters.",
  path: "/dispute-resolution",
});

export default function DisputeResolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
