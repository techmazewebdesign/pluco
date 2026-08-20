import { resolveMx, resolveTxt } from 'node:dns/promises';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/adminAuthorization';
import { verifyPlucoSmtp } from '@/lib/server/plucoMailer';

const DOMAIN = 'plucogroup.com';
const MAILBOX = 'info@plucogroup.com';

async function dnsStatus() {
  const mx = await resolveMx(DOMAIN).catch(() => []);
  const rootTxt = (await resolveTxt(DOMAIN).catch(() => [])).map(parts => parts.join(''));
  const dmarcTxt = (await resolveTxt(`_dmarc.${DOMAIN}`).catch(() => [])).map(parts => parts.join(''));
  return {
    mxReady: mx.some(record => /hostinger/i.test(record.exchange)),
    spfReady: rootTxt.some(record => record.startsWith('v=spf1') && /hostinger/i.test(record)),
    dmarcReady: dmarcTxt.some(record => record.startsWith('v=DMARC1')),
  };
}

export async function GET(request: NextRequest) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  return NextResponse.json({
    mailbox: MAILBOX,
    ...(await dnsStatus()),
    smtpReady: await verifyPlucoSmtp(),
    automaticDnsReady: Boolean(process.env.CLOUDFLARE_API_TOKEN && process.env.PLUCO_EMAIL_DKIM_NAME && process.env.PLUCO_EMAIL_DKIM_VALUE),
  });
}

type CloudflareRecord = { type: 'MX' | 'TXT'; name: string; content: string; priority?: number };

function selectExistingRecord(record: CloudflareRecord, existing: { id: string; content: string }[]) {
  const exact = existing.find(item => item.content === record.content);
  if (exact) return exact;

  if (record.type === 'MX') {
    if (existing.length > 0) {
      throw new Error(`Existing MX records for ${record.name} conflict with Hostinger. Review them before automatic setup.`);
    }
    return undefined;
  }

  if (record.name === DOMAIN && record.content.startsWith('v=spf1')) {
    return existing.find(item => item.content.startsWith('v=spf1'));
  }
  if (record.name === `_dmarc.${DOMAIN}` && record.content.startsWith('v=DMARC1')) {
    return existing.find(item => item.content.startsWith('v=DMARC1'));
  }

  // A DKIM selector may have only one TXT value. Updating it is safer than
  // publishing multiple keys for the same selector.
  return existing[0];
}

async function upsertRecord(zoneId: string, token: string, record: CloudflareRecord) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const lookup = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=${record.type}&name=${encodeURIComponent(record.name)}`, { headers });
  const lookupJson = await lookup.json() as { success?: boolean; result?: { id: string; content: string }[]; errors?: { message: string }[] };
  if (!lookup.ok || !lookupJson.success) throw new Error(lookupJson.errors?.[0]?.message || 'Cloudflare DNS lookup failed.');
  const existing = selectExistingRecord(record, lookupJson.result || []);
  const body = JSON.stringify({ ...record, ttl: 3600 });
  const response = existing
    ? await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${existing.id}`, { method: 'PUT', headers, body })
    : await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { method: 'POST', headers, body });
  const json = await response.json() as { success?: boolean; errors?: { message: string }[] };
  if (!response.ok || !json.success) throw new Error(json.errors?.[0]?.message || 'Cloudflare DNS update failed.');
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  const body = await request.json().catch(() => null) as { mailbox?: string } | null;
  if (body?.mailbox?.trim().toLowerCase() !== MAILBOX) {
    return NextResponse.json({ error: `Only ${MAILBOX} can be connected from this control.` }, { status: 400 });
  }

  const token = process.env.CLOUDFLARE_API_TOKEN;
  const dkimName = process.env.PLUCO_EMAIL_DKIM_NAME;
  const dkimValue = process.env.PLUCO_EMAIL_DKIM_VALUE;
  if (!token || !dkimName || !dkimValue) {
    return NextResponse.json({
      error: 'Automatic DNS is not configured. Add a least-privilege Cloudflare DNS token and the exact Hostinger DKIM name/value to the production environment.',
    }, { status: 503 });
  }

  const zoneLookup = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}`, { headers: { Authorization: `Bearer ${token}` } });
  const zoneJson = await zoneLookup.json() as { success?: boolean; result?: { id: string }[]; errors?: { message: string }[] };
  const zoneId = zoneJson.result?.[0]?.id;
  if (!zoneLookup.ok || !zoneJson.success || !zoneId) {
    return NextResponse.json({ error: zoneJson.errors?.[0]?.message || 'The Cloudflare zone could not be resolved.' }, { status: 502 });
  }

  const records: CloudflareRecord[] = [
    { type: 'MX', name: DOMAIN, content: 'mx1.hostinger.com', priority: 5 },
    { type: 'MX', name: DOMAIN, content: 'mx2.hostinger.com', priority: 10 },
    { type: 'TXT', name: DOMAIN, content: 'v=spf1 include:_spf.mail.hostinger.com ~all' },
    { type: 'TXT', name: `_dmarc.${DOMAIN}`, content: `v=DMARC1; p=none; rua=mailto:${MAILBOX}; adkim=s; aspf=s` },
    { type: 'TXT', name: dkimName, content: dkimValue },
  ];

  try {
    for (const record of records) await upsertRecord(zoneId, token, record);
    return NextResponse.json({ success: true, mailbox: MAILBOX, recordsAdded: records.length, status: await dnsStatus() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Email DNS setup failed.' }, { status: 502 });
  }
}
