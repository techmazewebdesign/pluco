import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "International Mobility & Nationality Planning | PLUCO GROUP",
  description: "Neutral mobility, nationality, family and compliance planning before selecting a route or making a financial commitment.",
  path: "/new-identity",
});

export default function NewIdentityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
