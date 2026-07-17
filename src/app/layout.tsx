import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AgentProvider } from "@/contexts/AgentContext";
import RTLWrapper from "@/components/shared/RTLWrapper";
import SiteShell from "@/components/layout/SiteShell";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import ConsentManager from "@/components/privacy/ConsentManager";
import {
  createPageMetadata,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/siteMetadata";

const defaultPageMetadata = createPageMetadata();

export const metadata: Metadata = {
  ...defaultPageMetadata,
  metadataBase: new URL(SITE_URL),
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
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
                <ConsentManager />
              </RTLWrapper>
            </LanguageProvider>
          </AgentProvider>
        </AuthProvider>
        <ChatbotWidget />
      </body>
    </html>
  );
}
