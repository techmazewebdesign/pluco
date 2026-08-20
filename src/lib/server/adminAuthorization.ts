import type { NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

const APPROVED_ADMIN_EMAILS = new Set([
  'desivo.de@gmail.com',
  'techmazewebdesign@gmail.com',
  'sara.rezai9031@gmail.com',
]);

export async function requireAdmin(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const email = decoded.email?.trim().toLowerCase() || '';
    if (decoded.admin === true || APPROVED_ADMIN_EMAILS.has(email)) return { decoded, email };

    const db = getAdminDb();
    const references = [
      db.collection('users').doc(decoded.uid),
      db.collection('agents').doc(decoded.uid),
      ...(email ? [db.collection('users').doc(email), db.collection('agents').doc(email)] : []),
    ];
    for (const reference of references) {
      const snapshot = await reference.get();
      const data = snapshot.data();
      if (snapshot.exists && (data?.role === 'admin' || data?.isAdmin === true || data?.is_admin === true)) {
        return { decoded, email };
      }
    }
  } catch {
    return null;
  }
  return null;
}

