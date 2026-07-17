import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Second Citizenship & New Identity Planning | PLUCO GROUP",
  description: "Lawful second citizenship, identity, compliance and family mobility planning for internationally mobile private clients.",
  path: "/new-identity",
});

export default function NewIdentityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
