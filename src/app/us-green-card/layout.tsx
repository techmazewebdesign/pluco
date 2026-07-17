import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "US Green Card & EB-5 Advisory | PLUCO GROUP",
  description: "Strategic legal coordination for US permanent residence and investment-based immigration pathways, including the EB-5 programme.",
  path: "/us-green-card",
});

export default function UsGreenCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
