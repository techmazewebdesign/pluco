import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "European Property Purchase Advisory | PLUCO GROUP",
  description: "European property purchase planning, legal due diligence coordination, fund-transfer documentation and residence-linked property strategies.",
  path: "/eu-property-purchase",
});

export default function EuPropertyPurchaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
