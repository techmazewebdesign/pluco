import type { Metadata } from 'next';
import PortalEmailAuth from '@/components/auth/PortalEmailAuth';

export const metadata: Metadata = { title: 'Client Login', robots: { index: false, follow: false } };

export default function LoginPage() {
  return <PortalEmailAuth mode="login" />;
}
