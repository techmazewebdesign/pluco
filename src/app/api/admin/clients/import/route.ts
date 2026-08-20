import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/server/adminAuthorization';
import type { HistoricalClientInput } from '@/lib/clientImport';
import { sendPlucoEmail } from '@/lib/server/plucoMailer';

const MAX_CLIENTS = 200;

function normalizeClient(value: HistoricalClientInput) {
  const email = String(value.email || '').trim().toLowerCase();
  const fullName = String(value.fullName || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || !fullName) return null;
  return {
    email,
    fullName: fullName.slice(0, 160),
    displayName: fullName.slice(0, 160),
    phone: String(value.phone || '').trim().slice(0, 80),
    country: String(value.country || '').trim().slice(0, 100),
    status: String(value.status || 'historical').trim().slice(0, 40),
    notes: String(value.notes || '').trim().slice(0, 2000),
    legacyId: String(value.legacyId || '').trim().slice(0, 120),
    lastContactAt: String(value.lastContactAt || '').trim().slice(0, 80),
  };
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });

  const payload = await request.json().catch(() => null) as { clients?: HistoricalClientInput[]; sendInvitations?: boolean } | null;
  if (!payload?.clients?.length || payload.clients.length > MAX_CLIENTS) {
    return NextResponse.json({ error: `Provide between 1 and ${MAX_CLIENTS} clients.` }, { status: 400 });
  }

  const normalized = payload.clients.map(normalizeClient);
  if (normalized.some(client => !client)) {
    return NextResponse.json({ error: 'Every client needs a valid email and full name.' }, { status: 400 });
  }
  const clients = normalized.filter(Boolean) as NonNullable<ReturnType<typeof normalizeClient>>[];
  if (new Set(clients.map(client => client.email)).size !== clients.length) {
    return NextResponse.json({ error: 'Duplicate email addresses are not allowed in one import.' }, { status: 400 });
  }

  const db = getAdminDb();
  let created = 0;
  let updated = 0;
  for (const client of clients) {
    const reference = db.collection('clients').doc(client.email);
    const snapshot = await reference.get();
    if (snapshot.exists) updated += 1;
    else created += 1;
    await reference.set({
      ...client,
      role: 'client',
      source: clients.length > 1 ? 'csv_import' : 'manual_entry',
      importedBy: admin.email,
      updatedAt: FieldValue.serverTimestamp(),
      ...(snapshot.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    }, { merge: true });
  }

  const emailErrors: string[] = [];
  let invitationsSent = 0;
  if (payload.sendInvitations) {
    for (const client of clients.slice(0, 20)) {
      try {
        await sendPlucoEmail({
          to: client.email,
          subject: 'Your PLUCO GROUP client portal',
          html: `<p>Hello ${client.fullName.replace(/[<>&"']/g, '')},</p><p>Your PLUCO GROUP client record is ready. Use your email address to create or access your secure portal.</p><p><a href="https://www.plucogroup.com/signup">Open secure portal</a></p>`,
          text: `Hello ${client.fullName},\n\nYour PLUCO GROUP client record is ready. Open https://www.plucogroup.com/signup to create or access your secure portal.`,
        });
        invitationsSent += 1;
      } catch (error) {
        emailErrors.push(`${client.email}: ${error instanceof Error ? error.message : 'delivery failed'}`);
      }
    }
  }

  await db.collection('user_activity').add({
    userId: clients.length === 1 ? clients[0].email : `${clients.length} clients`,
    action: clients.length === 1 ? 'historical_client_added' : 'historical_clients_imported',
    details: `${created} created, ${updated} updated, ${invitationsSent} invitation emails sent`,
    performedBy: admin.email,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, created, updated, invitationsSent, emailErrors });
}
