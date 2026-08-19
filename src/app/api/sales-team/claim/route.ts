import { NextRequest, NextResponse } from 'next/server';
import { invitationId, verifySalesRequest } from '@/lib/plucoSalesTeam';
import admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  const access = await verifySalesRequest(request);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  if (access.activeMember) return NextResponse.json({ ok: true, active: true, role: access.member?.role });
  const ref = access.db.collection('plucoSalesTeamInvitations').doc(invitationId(access.email));
  const invitation = await ref.get();
  if (!invitation.exists || invitation.data()?.status !== 'pending' || invitation.data()?.email !== access.email) {
    return NextResponse.json({ ok: true, active: false });
  }
  const now = admin.firestore.FieldValue.serverTimestamp();
  const batch = access.db.batch();
  batch.set(access.db.collection('plucoSalesTeamMembers').doc(access.auth.uid), {
    uid: access.auth.uid,
    email: access.email,
    displayName: invitation.data()?.displayName || access.auth.name || access.email.split('@')[0],
    role: 'sales_member', status: 'active', invitedByUid: invitation.data()?.invitedByUid,
    invitedByEmail: invitation.data()?.invitedByEmail, joinedAt: now, updatedAt: now,
  }, { merge: true });
  batch.set(ref, { status: 'claimed', claimedByUid: access.auth.uid, claimedAt: now, updatedAt: now }, { merge: true });
  await batch.commit();
  return NextResponse.json({ ok: true, active: true, role: 'sales_member' });
}

