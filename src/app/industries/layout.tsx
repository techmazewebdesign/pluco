import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Industries We Serve | PLUCO GROUP",
  description: "Cross-border commercial and legal advisory for energy, petrochemicals, machinery, engineering, international trade and financial services.",
  path: "/industries",
});

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
