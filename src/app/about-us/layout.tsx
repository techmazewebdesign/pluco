import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "About PLUCO GROUP | Warsaw Cross-Border Advisory",
  description: "Learn about PLUCO GROUP, a Warsaw-based cross-border legal and private client advisory firm serving internationally mobile clients.",
  path: "/about-us",
});

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
