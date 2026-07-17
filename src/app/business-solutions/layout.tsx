import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "European Business Solutions | PLUCO GROUP",
  description: "European market expansion, digital infrastructure, automation and operational systems for internationally active businesses.",
  path: "/business-solutions",
});

export default function BusinessSolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
