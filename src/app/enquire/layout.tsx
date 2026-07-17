import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Confidential Enquiry | PLUCO GROUP",
  description: "Submit a confidential enquiry to PLUCO GROUP about an immigration, residency, banking, property, commercial or cross-border legal matter.",
  path: "/enquire",
});

export default function EnquireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
