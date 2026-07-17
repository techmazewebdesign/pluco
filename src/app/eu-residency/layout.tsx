import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "European Residency Solutions | PLUCO GROUP",
  description: "Structured European residency planning for international families, investors, entrepreneurs and professionals.",
  path: "/eu-residency",
});

export default function EuResidencyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
