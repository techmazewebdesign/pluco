import { Metadata } from 'next';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Banking & Compliance Advisory for International Clients | PLUCO GROUP',
    description: 'Banking and compliance support for international clients facing account closures, source-of-funds reviews and cross-border financial scrutiny.',
    path: '/banking',
  }),
  keywords: 'banking compliance, international private clients, source of funds, source of wealth, banking discrimination, compliance documentation, cross-border finance',
};

export default function BankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
