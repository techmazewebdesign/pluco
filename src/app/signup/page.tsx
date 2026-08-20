import type { Metadata } from 'next';
import PortalEmailAuth from '@/components/auth/PortalEmailAuth';

export const metadata: Metadata = { title: 'Create Client Account', robots: { index: false, follow: false } };

export default function SignUpPage() {
  return <PortalEmailAuth mode="signup" />;
}
