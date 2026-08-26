import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export const PLUCO_CONTACT_EMAIL = 'info@plucogroup.com';
const FROM = `PLUCO GROUP <${PLUCO_CONTACT_EMAIL}>`;

function smtpTransport() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

export async function sendPlucoEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const { replyTo = PLUCO_CONTACT_EMAIL, ...message } = options;
  const smtp = smtpTransport();
  if (smtp) {
    try {
      const result = await smtp.sendMail({ ...message, from: FROM, replyTo });
      return { id: result.messageId, transport: 'smtp' as const };
    } catch {
      // Keep delivery available through the configured transactional provider
      // while surfacing the mailbox login separately in the dashboard health card.
    }
  }
  if (process.env.RESEND_API_KEY) {
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ ...message, from: FROM, replyTo });
    if (result.error) throw new Error('PLUCO email delivery failed. Check the verified sender configuration.');
    return { id: result.data?.id || '', transport: 'resend' as const };
  }
  throw new Error(smtp
    ? 'The PLUCO mailbox login failed and no fallback mail provider is configured.'
    : 'Neither the PLUCO SMTP mailbox nor a fallback mail provider is configured.');
}

export async function verifyPlucoSmtp() {
  const smtp = smtpTransport();
  if (!smtp) return false;
  try {
    await smtp.verify();
    return true;
  } catch {
    return false;
  }
}
