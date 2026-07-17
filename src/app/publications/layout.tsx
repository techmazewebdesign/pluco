import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Publications & Legal Insights | PLUCO GROUP",
  description: "PLUCO GROUP publications and analysis on banking discrimination, compliance, immigration and cross-border private client protection.",
  path: "/publications",
});

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
