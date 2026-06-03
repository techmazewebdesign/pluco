import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Banking & Compliance Advisory for International Clients | PLUCO GROUP',
  description: 'Strategic banking and compliance support for international private clients facing account closures, source-of-funds reviews, and cross-border financial scrutiny. Specializing in banking discrimination, documentation, and regulatory compliance.',
  keywords: 'banking compliance, international private clients, source of funds, source of wealth, banking discrimination, compliance documentation, cross-border finance',
};

export default function BankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
