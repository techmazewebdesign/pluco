import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Secure Client Sign In | PLUCO GROUP",
  description: "Secure access for PLUCO GROUP clients.",
  path: "/client-sign-in",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
});

export default function ClientSignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
