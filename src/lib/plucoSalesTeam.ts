import { createHash, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export type PlucoSalesRole = 'team_leader' | 'sales_member';

export function normalizeSalesEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function invitationId(email: string): string {
  return createHash('sha256').update(normalizeSalesEmail(email)).digest('hex');
}

export function newProposalCode(discount: 5 | 10 | 15): string {
  return `PLUCO-${discount}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export function proposalCodePolicy(discount: number) {
  if (discount === 5) return { approval: 'sales_ready', label: 'Standard introductory offer' };
  if (discount === 10) return { approval: 'manager_approved', label: 'Manager-approved offer' };
  if (discount === 15) return { approval: 'exceptional_written_approval', label: 'Exceptional written approval' };
  throw new Error('Discount must be 5, 10, or 15 percent.');
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character);
}

async function profileIsAdmin(uid: string, email: string) {
  const db = getAdminDb();
  const refs = [
    db.collection('agents').doc(uid), db.collection('users').doc(uid),
    db.collection('agents').doc(email), db.collection('users').doc(email),
  ];
  for (const ref of refs) {
    const snapshot = await ref.get();
    const data = snapshot.data();
    if (snapshot.exists && (data?.role === 'admin' || data?.isAdmin === true || data?.is_admin === true)) return true;
  }
  return false;
}

export async function verifySalesRequest(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return { ok: false as const, status: 401, error: 'Sign in is required.' };
  try {
    const decoded = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const email = normalizeSalesEmail(decoded.email);
    if (!email || decoded.email_verified !== true) return { ok: false as const, status: 403, error: 'A verified email account is required.' };
    const db = getAdminDb();
    const memberSnapshot = await db.collection('plucoSalesTeamMembers').doc(decoded.uid).get();
    const member = memberSnapshot.data();
    const isAdmin = decoded.admin === true || await profileIsAdmin(decoded.uid, email);
    return {
      ok: true as const,
      db,
      auth: decoded,
      email,
      isAdmin,
      member: memberSnapshot.exists ? { uid: decoded.uid, ...member } as Record<string, unknown> & { uid: string } : null,
      activeMember: memberSnapshot.exists && member?.status === 'active',
    };
  } catch {
    return { ok: false as const, status: 401, error: 'The session could not be verified.' };
  }
}

export const PLUCO_SALES_MATERIALS = [
  { title: 'PLUCO company introduction', type: 'Demo', href: '/about-us', purpose: 'Explain the firm, its cross-border focus, and the correct next step.' },
  { title: 'EU residency pathways', type: 'Product guide', href: '/eu-residency', purpose: 'Qualify residency interest without promising an outcome.' },
  { title: 'Spain Digital Nomad Visa', type: 'Product guide', href: '/spain-digital-nomad-visa', purpose: 'Use the published requirements as the source; invite a private review.' },
  { title: 'EU company registration', type: 'Product guide', href: '/eu-company-registration', purpose: 'Introduce company formation and compliance support.' },
  { title: 'Banking and compliance', type: 'Product guide', href: '/banking-compliance', purpose: 'Explain documentation and compliance coordination carefully.' },
  { title: 'Private enquiry handoff', type: 'Conversion', href: '/enquire', purpose: 'Send qualified prospects to the secure enquiry form with your tracked code.' },
] as const;
