import { NextRequest, NextResponse } from 'next/server';
import { PLUCO_SALES_MATERIALS, verifySalesRequest } from '@/lib/plucoSalesTeam';

function iso(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value) return (value as FirebaseFirestore.Timestamp).toDate().toISOString();
  return typeof value === 'string' ? value : null;
}

export async function GET(request: NextRequest) {
  const access = await verifySalesRequest(request);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  if (!access.activeMember) return NextResponse.json({ error: 'Active PLUCO Sales Team membership is required.' }, { status: 403 });
  const [members, invitations, codes] = await Promise.all([
    access.db.collection('plucoSalesTeamMembers').where('status', '==', 'active').get(),
    access.db.collection('plucoSalesTeamInvitations').orderBy('createdAt', 'desc').limit(30).get(),
    access.db.collection('plucoSalesProposalCodes').where('ownerUid', '==', access.auth.uid).limit(50).get(),
  ]);
  const isLeader = access.member?.role === 'team_leader';
  return NextResponse.json({
    member: access.member,
    isAdmin: access.isAdmin,
    canInvite: access.activeMember,
    materials: PLUCO_SALES_MATERIALS,
    team: members.docs.map((doc) => ({ uid: doc.id, displayName: doc.data().displayName || 'Sales member', role: doc.data().role, joinedAt: iso(doc.data().joinedAt) })),
    invitations: isLeader ? invitations.docs.map((doc) => ({ id: doc.id, email: doc.data().email, displayName: doc.data().displayName, status: doc.data().status, createdAt: iso(doc.data().createdAt) })) : [],
    codes: codes.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: iso(doc.data().createdAt) })),
  });
}

