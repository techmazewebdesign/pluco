import type { Metadata } from "next";

const TITLE = "Spain Digital Nomad Visa";
const DESCRIPTION = "Structured preparation, documentation coordination and legal partner handoff for the Spain Digital Nomad Visa — Bronze, Silver and Gold support packages for employees, freelancers, business owners and families.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/favicon.svg" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/favicon.svg"],
  },
};

export default function SpainDigitalNomadVisaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
