import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

type Template =
  | 'account_welcome'
  | 'subscription_active'
  | 'payment_failed'
  | 'subscription_cancelled';

type EmailRequest = {
  to?: string;
  template?: Template;
  plan?: string;
  manageUrl?: string;
  displayName?: string | null;
  dashboardUrl?: string;
  telegramUrl?: string;
  dryRun?: boolean;
};

const subjects: Record<Template, string> = {
  account_welcome: 'Welcome to VisaSignal — how it works',
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
  const validatedBody = body as EmailRequest & {
    to: string;
    template: Template;
    plan: string;
  };

  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      providerConfigured: Boolean(process.env.RESEND_API_KEY),
      from: 'VisaSignal by PLUCO <info@plucogroup.com>',
      subject: subjects[validatedBody.template],
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email provider unavailable' }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: 'VisaSignal by PLUCO <info@plucogroup.com>',
    to: validatedBody.to,
    subject: subjects[validatedBody.template],
    html: emailHtml(validatedBody),
    text: emailText(validatedBody),
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

function emailText(input: Required<Pick<EmailRequest, 'template' | 'plan'>> & EmailRequest): string {
  const manageUrl = safeHttpsUrl(input.manageUrl);
  const dashboardUrl = safeHttpsUrl(input.dashboardUrl);
  const telegramUrl = safeHttpsUrl(input.telegramUrl);
  const manage = manageUrl ? `\n\nManage billing: ${manageUrl}` : '';
  if (input.template === 'account_welcome') {
    const name = cleanDisplayName(input.displayName);
    const greeting = name ? `Welcome, ${name}.` : 'Welcome to VisaSignal.';
    const dashboard = dashboardUrl ? `\n\nOpen your dashboard: ${dashboardUrl}` : '';
    const telegram = telegramUrl ? `\nConnect Telegram alerts: ${telegramUrl}` : '';
    return `${greeting}

Your VisaSignal account is ready. Here is how it works:

1. Connect Telegram and activate one watch profile.
2. VisaSignal waits for a genuine availability report matching your route.
3. When a signal arrives, act quickly and book yourself on the official provider website.

VisaSignal never signs in to VFS, never asks for your VFS password or OTP, and never books an appointment for you.${dashboard}${telegram}

An availability signal is not an appointment guarantee.`;
  }
  if (input.template === 'subscription_active') {
    return `Your VisaSignal ${input.plan} subscription is active. Immediate Telegram alerts are enabled.${manage}\n\nVisaSignal alerts you about reported availability; it does not guarantee or book appointments.`;
  }
  if (input.template === 'payment_failed') {
    return `Stripe could not collect your VisaSignal ${input.plan} subscription payment. Please update your payment method to keep immediate alerts active.${manage}`;
  }
  return `Your VisaSignal ${input.plan} subscription has been cancelled. You can continue using the delayed free feed.${manage}`;
}

function emailHtml(input: Required<Pick<EmailRequest, 'template' | 'plan'>> & EmailRequest): string {
  if (input.template === 'account_welcome') return welcomeEmailHtml(input);

  const safePlan = escapeHtml(input.plan);
  const copy = input.template === 'subscription_active'
    ? `Your <strong>${safePlan}</strong> subscription is active. Immediate Telegram alerts are enabled.`
    : input.template === 'payment_failed'
      ? `Stripe could not collect your <strong>${safePlan}</strong> subscription payment. Please update your payment method to keep immediate alerts active.`
      : `Your <strong>${safePlan}</strong> subscription has been cancelled. You can continue using the delayed free feed.`;
  const manageUrl = safeHttpsUrl(input.manageUrl);
  const button = manageUrl
    ? `<p style="margin:28px 0"><a href="${escapeHtml(manageUrl)}" style="background:#174c3c;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px">Manage billing</a></p>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#f7f5ef;color:#10251f;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:40px 24px"><p style="font-size:12px;letter-spacing:.12em;color:#ff6b3d">VISASIGNAL BY PLUCO</p><h1 style="font-family:Georgia,serif;font-weight:500">${escapeHtml(subjects[input.template])}</h1><p style="font-size:16px;line-height:1.7">${copy}</p>${button}<p style="font-size:12px;line-height:1.6;color:#5f6f69">VisaSignal is an independent alert service. It does not guarantee or book appointments and is not affiliated with VFS Global or any embassy.</p></div></body></html>`;
}

function welcomeEmailHtml(input: EmailRequest): string {
  const name = cleanDisplayName(input.displayName);
  const greeting = name ? `Welcome, ${escapeHtml(name)}.` : 'Welcome to VisaSignal.';
  const dashboardUrl = safeHttpsUrl(input.dashboardUrl);
  const telegramUrl = safeHttpsUrl(input.telegramUrl);
  const dashboardButton = dashboardUrl
    ? `<a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;margin:0 8px 10px 0;background:#ff6b3d;color:#fff;padding:13px 18px;text-decoration:none;border-radius:7px;font-weight:700">Open your dashboard</a>`
    : '';
  const telegramButton = telegramUrl
    ? `<a href="${escapeHtml(telegramUrl)}" style="display:inline-block;margin:0 0 10px;background:#174c3c;color:#fff;padding:13px 18px;text-decoration:none;border-radius:7px;font-weight:700">Connect Telegram alerts</a>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#f1f2ec;color:#10251f;font-family:Arial,sans-serif">
    <div style="max-width:640px;margin:0 auto;padding:38px 18px">
      <div style="background:#10251f;border-radius:14px 14px 0 0;padding:30px;color:#fff">
        <div style="display:inline-block;width:42px;height:42px;line-height:42px;text-align:center;border-radius:11px;background:#c9f06a;color:#174c3c;font-family:Georgia,serif;font-size:25px;font-style:italic">V</div>
        <p style="margin:18px 0 8px;font-size:11px;letter-spacing:.14em;color:#c9f06a">VISASIGNAL</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-size:36px;line-height:1.1;font-weight:500">${greeting}</h1>
      </div>
      <div style="background:#fff;border:1px solid #dce2de;border-top:0;border-radius:0 0 14px 14px;padding:30px">
        <p style="margin:0 0 24px;font-size:16px;line-height:1.7">Your account is ready. VisaSignal helps you react quickly when genuine appointment availability is reported.</p>
        <div style="padding:18px;background:#f7f5ef;border-radius:9px">
          <p style="margin:0 0 12px;font-weight:700;color:#ff6b3d">How it works</p>
          <p style="margin:0 0 12px;line-height:1.6"><strong>1.</strong> Connect Telegram and activate one watch profile.</p>
          <p style="margin:0 0 12px;line-height:1.6"><strong>2.</strong> VisaSignal waits for a genuine availability report matching your route.</p>
          <p style="margin:0;line-height:1.6"><strong>3.</strong> When a signal arrives, act quickly and book yourself on the official provider website.</p>
        </div>
        <p style="margin:26px 0 18px">${dashboardButton}${telegramButton}</p>
        <p style="margin:0 0 12px;font-size:13px;line-height:1.65;color:#5f6f69"><strong>Safe by design:</strong> VisaSignal never signs in to VFS, never asks for your VFS password or OTP, and never books an appointment for you.</p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#7b8883">An availability signal is not an appointment guarantee. VisaSignal is independent and is not affiliated with VFS Global or any embassy.</p>
      </div>
    </div>
  </body></html>`;
}

function cleanDisplayName(value?: string | null): string {
  return typeof value === 'string' ? value.trim().slice(0, 80) : '';
}

function safeHttpsUrl(value?: string): string | null {
  if (!value || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
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
