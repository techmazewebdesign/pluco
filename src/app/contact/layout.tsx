import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact PLUCO GROUP | Private Client Advisory",
  description: "Contact PLUCO GROUP in Warsaw for a confidential discussion about immigration, residency, banking, property or cross-border legal matters.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
