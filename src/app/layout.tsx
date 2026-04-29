import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PLUCO GROUP SP. Z O.O. - Commercial & Legal Consultancy",
  description: "International legal insight. Commercial precision. Strategic protection. Warsaw-based commercial and legal consultancy providing cross-border advisory services.",
  keywords: ["commercial consultancy", "legal advisory", "international contracts", "dispute resolution", "banking compliance", "financial discrimination", "Warsaw law firm"],
  authors: [{ name: "PLUCO GROUP SP. Z O.O." }],
  openGraph: {
    title: "PLUCO GROUP SP. Z O.O. - Commercial & Legal Consultancy",
    description: "International legal insight. Commercial precision. Strategic protection.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
