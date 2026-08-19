import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import admin from 'firebase-admin';
import { escapeHtml, invitationId, normalizeSalesEmail, verifySalesRequest } from '@/lib/plucoSalesTeam';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const access = await verifySalesRequest(request);
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });
  if (!access.activeMember) return NextResponse.json({ error: 'Only active PLUCO Sales Team members can invite another salesperson.' }, { status: 403 });
  const body = await request.json().catch(() => null) as { email?: string; displayName?: string } | null;
  const email = normalizeSalesEmail(body?.email);
  const displayName = typeof body?.displayName === 'string' ? body.displayName.trim().slice(0, 100) : '';
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  const id = invitationId(email);
  const ref = access.db.collection('plucoSalesTeamInvitations').doc(id);
  const prior = await ref.get();
  if (prior.exists && ['sending', 'pending', 'claimed'].includes(prior.data()?.status)) {
    return NextResponse.json({ error: prior.data()?.status === 'claimed' ? 'This email already belongs to the Sales Team.' : 'An invitation is already being processed or is pending for this email.' }, { status: 409 });
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'The invitation email provider is not configured.' }, { status: 503 });
  const now = admin.firestore.FieldValue.serverTimestamp();
  await ref.set({ email, displayName, status: 'sending', invitedByUid: access.auth.uid, invitedByEmail: access.email, sender: 'info@plucogroup.com', createdAt: now, updatedAt: now }, { merge: true });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const inviteUrl = 'https://plucogroup.com/client-sign-in';
  let result;
  try {
    result = await resend.emails.send({
      from: 'PLUCO GROUP <info@plucogroup.com>', to: email,
      subject: 'Invitation to join the PLUCO GROUP Sales Team',
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#071c3c"><div style="padding:28px;background:#071c3c;color:white"><h1 style="margin:0">PLUCO GROUP Sales Team</h1></div><div style="padding:28px;border:1px solid #e5e7eb"><p>Hello ${escapeHtml(displayName || 'there')},</p><p>${escapeHtml(access.member?.displayName || access.email)} invited you to join the protected PLUCO GROUP Sales Team workspace.</p><p>You will receive approved product materials, tracked proposal codes, demo links and a clear opportunity workflow. Membership does not create employment or guarantee earnings.</p><p><a href="${inviteUrl}" style="display:inline-block;padding:13px 20px;background:#c9a35a;color:#071c3c;text-decoration:none;font-weight:700;border-radius:8px">Accept with this Google account</a></p><p>Sign in using <strong>${escapeHtml(email)}</strong>. The invitation cannot be claimed by another email.</p><p style="font-size:13px;color:#64748b">Questions? Reply to info@plucogroup.com.</p></div></div>`,
      text: `You are invited to join the PLUCO GROUP Sales Team. Sign in with ${email} at ${inviteUrl}. Membership does not create employment or guarantee earnings. Questions: info@plucogroup.com.`,
      replyTo: 'info@plucogroup.com',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email provider request failed.';
    await ref.set({ status: 'failed', providerError: message, updatedAt: now }, { merge: true });
    return NextResponse.json({ error: message }, { status: 502 });
  }
  if (result.error || !result.data?.id) {
    await ref.set({ status: 'failed', providerError: result.error?.message || 'Provider did not accept the message.', updatedAt: now }, { merge: true });
    return NextResponse.json({ error: result.error?.message || 'The email provider did not accept the invitation.' }, { status: 502 });
  }
  await ref.set({ status: 'pending', messageId: result.data.id, updatedAt: now }, { merge: true });
  return NextResponse.json({ ok: true, status: 'pending', messageId: result.data.id });
}
