import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Financial Discrimination Advisory | PLUCO GROUP",
  description: "Strategic support for discriminatory denial of financial services, unfair institutional treatment and regulatory complaints.",
  path: "/financial-discrimination",
});

export default function FinancialDiscriminationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
