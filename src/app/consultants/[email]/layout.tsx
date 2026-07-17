import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

type ConsultantProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ email: string }>;
};

export async function generateMetadata({ params }: ConsultantProfileLayoutProps): Promise<Metadata> {
  const { email } = await params;

  return createPageMetadata({
    title: "Consultant Profile | PLUCO GROUP",
    description: "Professional profile and consultation information for a PLUCO GROUP consultant.",
    path: `/consultants/${encodeURIComponent(decodeURIComponent(email))}`,
  });
}

export default function ConsultantProfileLayout({ children }: ConsultantProfileLayoutProps) {
  return children;
}
