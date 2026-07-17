import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Our People | PLUCO GROUP",
  description: "Meet PLUCO GROUP's legal, compliance, documentation, technology and international advisory professionals.",
  path: "/our-people",
});

export default function OurPeopleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
