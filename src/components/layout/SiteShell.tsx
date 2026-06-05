'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Routes that have their own full-screen layout (no site header/footer)
const PORTAL_PREFIXES = [
  '/dashboard',
  '/agent',
  '/admin',
  '/consultant',
  '/case-manager',
  '/customer-service',
  '/document-reviewer',
  '/compliance-officer',
  '/enquiry-handler',
  '/bookings'
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = PORTAL_PREFIXES.some(p => pathname.startsWith(p));

  if (isPortal) {
    // Portal pages manage their own header/nav/sidebar
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
