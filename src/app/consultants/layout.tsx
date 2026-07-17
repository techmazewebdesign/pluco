import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "PLUCO GROUP Consultants",
  description: "Browse PLUCO GROUP consultants and their areas of cross-border professional expertise.",
  path: "/consultants",
});

export default function ConsultantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
