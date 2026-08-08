import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "US Green Card for Iranians in 2026: Current EB-5 Status",
  description: "Current, source-led guidance on the 2026 US visa-issuance suspension for Iranian nationals, limited exceptions, case status and EB-5 planning.",
  path: "/us-green-card",
});

export default function UsGreenCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
