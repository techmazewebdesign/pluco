import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { newProposalCode, proposalCodePolicy, verifySalesRequest } from '@/lib/plucoSalesTeam';

export async function POST(request: NextRequest) {
  const access = await verifySalesRequest(request);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  if (!access.activeMember) return NextResponse.json({ error: 'Active Sales Team membership is required.' }, { status: 403 });
  const body = await request.json().catch(() => null) as { discount?: number; writtenApproval?: boolean } | null;
  const discount = Number(body?.discount);
  let policy: ReturnType<typeof proposalCodePolicy>;
  try { policy = proposalCodePolicy(discount); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid discount.' }, { status: 400 }); }
  if (discount > 5 && access.member?.role !== 'team_leader') return NextResponse.json({ error: 'A team leader must issue 10% or 15% proposal codes.' }, { status: 403 });
  if (discount === 15 && body?.writtenApproval !== true) return NextResponse.json({ error: 'Written exceptional approval is required for a 15% code.' }, { status: 400 });
  const cycle = new Date().toISOString().slice(0, 7);
  const wallet = await access.db.collection('plucoSalesProposalCodes').where('ownerUid', '==', access.auth.uid).get();
  const issuedThisCycle = wallet.docs.filter((doc) => doc.data().cycle === cycle && doc.data().discount === discount).length;
  if (issuedThisCycle >= 7) return NextResponse.json({ error: `The monthly wallet already contains seven ${discount}% codes.` }, { status: 409 });
  const code = newProposalCode(discount as 5 | 10 | 15);
  const now = admin.firestore.FieldValue.serverTimestamp();
  await access.db.collection('plucoSalesProposalCodes').doc(code).set({
    code, ownerUid: access.auth.uid, ownerEmail: access.email, discount,
    approval: policy.approval, label: policy.label, status: 'available',
    redemptionMode: 'manual_verified_invoice', transferable: false,
    cycle, createdAt: now, updatedAt: now,
  });
  return NextResponse.json({ ok: true, code, discount, approval: policy.approval });
}
