import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import RTLWrapper from "@/components/shared/RTLWrapper";

export const metadata: Metadata = {
  title: {
    default: "PLUCO GROUP – European Immigration Law & Private Client Advisory",
    template: "%s | PLUCO GROUP",
  },
  description: "PLUCO GROUP provides discreet legal and strategic advisory services for high-net-worth individuals, families, investors and entrepreneurs seeking European residency, second citizenship, property acquisition, banking support and cross-border legal protection.",
  keywords: [
    "European immigration law", "private client advisory", "EU residency", "second citizenship",
    "EU property purchase", "banking compliance", "dispute resolution", "international contracts",
    "EB-5 investor", "EU company registration", "Warsaw law firm", "cross-border legal advisory",
    "high net worth immigration", "Pluco Group",
  ],
  authors: [{ name: "PLUCO GROUP Sp. z o.o." }],
  icons: {
    icon: "/images/logo-pluco.png",
    apple: "/images/logo-pluco.png",
  },
  openGraph: {
    title: "PLUCO GROUP – European Immigration Law & Private Client Advisory",
    description: "Discreet legal and strategic advisory for internationally mobile individuals and families seeking European residency, second citizenship, property, banking and cross-border legal support.",
    type: "website",
    locale: "en_US",
    siteName: "PLUCO GROUP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <AuthProvider>
        <LanguageProvider>
          <RTLWrapper>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </RTLWrapper>
        </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
