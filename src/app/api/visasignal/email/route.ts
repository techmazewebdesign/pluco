import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

type Template = 'subscription_active' | 'payment_failed' | 'subscription_cancelled';

type EmailRequest = {
  to?: string;
  template?: Template;
  plan?: string;
  manageUrl?: string;
  dryRun?: boolean;
};

const subjects: Record<Template, string> = {
  subscription_active: 'Your VisaSignal subscription is active',
  payment_failed: 'Action required: VisaSignal payment failed',
  subscription_cancelled: 'Your VisaSignal subscription was cancelled',
};

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.VISASIGNAL_EMAIL_GATEWAY_SECRET;
  const suppliedSecret = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!configuredSecret || !suppliedSecret || !safeEqual(configuredSecret, suppliedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as EmailRequest;
  if (
    !body.template ||
    !(body.template in subjects) ||
    !body.to ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.to) ||
    !body.plan ||
    body.plan.length > 24
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      providerConfigured: Boolean(process.env.RESEND_API_KEY),
      from: 'VisaSignal by PLUCO <info@plucogroup.com>',
      subject: subjects[body.template],
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email provider unavailable' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: 'VisaSignal by PLUCO <info@plucogroup.com>',
    to: body.to,
    subject: subjects[body.template],
    html: emailHtml(body.template, body.plan, body.manageUrl),
    text: emailText(body.template, body.plan, body.manageUrl),
  });
  if (result.error) {
    console.error('visasignal_email_failed', result.error.name);
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: result.data?.id });
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function emailText(template: Template, plan: string, manageUrl?: string): string {
  const manage = manageUrl ? `\n\nManage billing: ${manageUrl}` : '';
  if (template === 'subscription_active') {
    return `Your VisaSignal ${plan} subscription is active. Immediate Telegram alerts are enabled.${manage}\n\nVisaSignal alerts you about reported availability; it does not guarantee or book appointments.`;
  }
  if (template === 'payment_failed') {
    return `Stripe could not collect your VisaSignal ${plan} subscription payment. Please update your payment method to keep immediate alerts active.${manage}`;
  }
  return `Your VisaSignal ${plan} subscription has been cancelled. You can continue using the delayed free feed.${manage}`;
}

function emailHtml(template: Template, plan: string, manageUrl?: string): string {
  const safePlan = escapeHtml(plan);
  const copy = template === 'subscription_active'
    ? `Your <strong>${safePlan}</strong> subscription is active. Immediate Telegram alerts are enabled.`
    : template === 'payment_failed'
      ? `Stripe could not collect your <strong>${safePlan}</strong> subscription payment. Please update your payment method to keep immediate alerts active.`
      : `Your <strong>${safePlan}</strong> subscription has been cancelled. You can continue using the delayed free feed.`;
  const button = manageUrl && /^https:\/\//.test(manageUrl)
    ? `<p style="margin:28px 0"><a href="${escapeHtml(manageUrl)}" style="background:#174c3c;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px">Manage billing</a></p>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#f7f5ef;color:#10251f;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:40px 24px"><p style="font-size:12px;letter-spacing:.12em;color:#ff6b3d">VISASIGNAL BY PLUCO</p><h1 style="font-family:Georgia,serif;font-weight:500">${escapeHtml(subjects[template])}</h1><p style="font-size:16px;line-height:1.7">${copy}</p>${button}<p style="font-size:12px;line-height:1.6;color:#5f6f69">VisaSignal is an independent alert service. It does not guarantee or book appointments and is not affiliated with VFS Global or any embassy.</p></div></body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char] || char);
}
