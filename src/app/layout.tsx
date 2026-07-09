import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AgentProvider } from "@/contexts/AgentContext";
import RTLWrapper from "@/components/shared/RTLWrapper";
import SiteShell from "@/components/layout/SiteShell";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

const SITE_TITLE = "PLUCO GROUP – European Immigration Law & Private Client Advisory";
const SITE_DESCRIPTION = "Discreet legal and strategic advisory for internationally mobile individuals and families.";

export const metadata: Metadata = {
  metadataBase: new URL("https://plucogroup.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | PLUCO GROUP",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "European immigration law", "private client advisory", "EU residency", "second citizenship",
    "EU property purchase", "banking compliance", "dispute resolution", "international contracts",
    "EB-5 investor", "EU company registration", "Warsaw law firm", "cross-border legal advisory",
    "high net worth immigration", "Pluco Group",
  ],
  authors: [{ name: "PLUCO GROUP Sp. z o.o." }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: "PLUCO GROUP",
    images: [{ url: "/favicon.svg" }],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/favicon.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <AuthProvider>
          <AgentProvider>
            <LanguageProvider>
              <RTLWrapper>
                <SiteShell>
                  {children}
                </SiteShell>
              </RTLWrapper>
            </LanguageProvider>
          </AgentProvider>
        </AuthProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}
