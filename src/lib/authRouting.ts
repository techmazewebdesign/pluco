import type { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin/dashboard',
  consultant: '/consultant/dashboard',
  case_manager: '/case-manager/dashboard',
  customer_service: '/customer-service/dashboard',
  document_reviewer: '/document-reviewer/dashboard',
  compliance_officer: '/compliance-officer/dashboard',
  enquiry_handler: '/enquiry-handler/dashboard',
  user: '/dashboard',
  client: '/dashboard',
};

export async function ensurePortalUser(user: User, displayName?: string) {
  try {
    const reference = doc(db, 'users', user.uid);
    const snapshot = await getDoc(reference);
    if (snapshot.exists()) return;

    await setDoc(reference, {
      uid: user.uid,
      email: user.email?.trim().toLowerCase() || '',
      displayName: displayName?.trim() || user.displayName || '',
      role: 'user',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch {
    // Some verified accounts are provisioned centrally and cannot create a
    // profile document. Authentication must still reach the empty dashboard.
  }
}

export async function resolvePortalDestination(user: User) {
  const normalizedEmail = user.email?.trim().toLowerCase() || '';
  const references = [
    doc(db, 'agents', user.uid),
    ...(normalizedEmail ? [doc(db, 'agents', normalizedEmail)] : []),
    doc(db, 'users', user.uid),
    ...(normalizedEmail ? [doc(db, 'users', normalizedEmail)] : []),
  ];

  for (const reference of references) {
    try {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) continue;
      const data = snapshot.data();
      const role = data.is_admin === true || data.isAdmin === true
        ? 'admin'
        : String(data.role || 'user').toLowerCase();
      return ROLE_ROUTES[role] || '/dashboard';
    } catch {
      // Some legacy profile locations are intentionally unreadable to clients.
    }
  }

  return '/dashboard';
}
