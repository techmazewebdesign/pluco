import type { SiteLocale } from './languageRoutes';
import { createHash, randomBytes } from 'node:crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { getAdminDb } from '@/lib/firebase-admin';
import { newsletterCopy, newsletterLocale } from '@/lib/newsletterCopy';
import { SITE_URL } from '@/lib/siteMetadata';

const hour = 60 * 60 * 1000;
const collection = 'newsletterSubscribers';
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const secret = () => randomBytes(32).toString('base64url');

export async function requestNewsletter(email: string, locale: SiteLocale, ip: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Newsletter mail is not configured');

  const db = getAdminDb();
  const id = sha256(email);
  const subscriber = db.collection(collection).doc(id);
  // Fixed buckets bound the number of rate-limit records and avoid storing IP addresses.
  const bucket = db.collection('newsletterRateLimits').doc(sha256(ip).slice(0, 3));
  const token = secret();
  const confirmationHash = sha256(token);
  const unsubscribeToken = secret();
  const now = Date.now();

  const result = await db.runTransaction(async transaction => {
    const [entry, limit] = await transaction.getAll(subscriber, bucket);
    const current = entry.data();
    const rate = limit.data();
    const windowStart = rate && now - rate.windowStart < hour ? rate.windowStart : now;
    const count = rate && windowStart === rate.windowStart ? rate.count : 0;
    if (count >= 15) return 'limited';

    transaction.set(bucket, { windowStart, count: count + 1 });
    if (current?.status === 'subscribed' || (current?.requestedAt && now - current.requestedAt.toMillis() < hour)) {
      return 'accepted';
    }

    transaction.set(subscriber, {
      email, locale, status: 'pending', source: 'website-footer',
      consentText: newsletterCopy[locale].consent,
      requestedAt: Timestamp.fromMillis(now),
      confirmationHash,
      confirmationExpiresAt: Timestamp.fromMillis(now + 48 * hour),
      unsubscribeToken,
      unsubscribeUrl: newsletterActionUrl('unsubscribe', id, unsubscribeToken, locale),
    });
    return 'send';
  });

  if (result !== 'send') return result;
  const copy = newsletterCopy[locale];
  const confirm = newsletterActionUrl('confirm', id, token, locale);
  const unsubscribe = newsletterActionUrl('unsubscribe', id, unsubscribeToken, locale);
  try {
    const delivery = await new Resend(apiKey).emails.send({
      from: process.env.RESEND_FROM || 'PLUCO GROUP <noreply@plucogroup.com>',
      replyTo: 'info@plucogroup.com',
      to: email,
      subject: copy.confirm,
      text: `${copy.confirmationEmail}\n\n${copy.confirm}\n${confirm}\n\n${copy.unsubscribe}\n${unsubscribe}`,
      html: `<div lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}"><p>${copy.confirmationEmail}</p><p><a href="${confirm.replaceAll('&', '&amp;')}">${copy.confirm}</a></p><p><a href="${unsubscribe.replaceAll('&', '&amp;')}">${copy.unsubscribe}</a></p></div>`,
    });
    if (delivery.error || !delivery.data?.id) throw new Error('Newsletter email was rejected');
    return 'accepted';
  } catch (error) {
    await db.runTransaction(async transaction => {
      const entry = await transaction.get(subscriber);
      if (entry.get('status') === 'pending' && entry.get('confirmationHash') === confirmationHash) {
        transaction.delete(subscriber);
      }
    });
    throw error;
  }
}

function newsletterActionUrl(action: 'confirm' | 'unsubscribe', id: string, token: string, locale: SiteLocale) {
  const url = new URL('/api/newsletter/manage', SITE_URL);
  url.search = new URLSearchParams({ action, token: `${id}.${token}`, locale }).toString();
  return url.toString();
}

export async function applyNewsletterAction(action: 'confirm' | 'unsubscribe', token: string) {
  const [id, value] = token.split('.');
  const db = getAdminDb();
  const subscriber = db.collection(collection).doc(id);
  return db.runTransaction(async transaction => {
    const entry = (await transaction.get(subscriber)).data();
    if (!entry) return false;

    if (action === 'unsubscribe') {
      if (entry.unsubscribeToken !== value) return false;
      transaction.delete(subscriber);
      return true;
    }

    if (entry.confirmationHash !== sha256(value) || entry.confirmationExpiresAt.toMillis() <= Date.now()) return false;
    transaction.update(subscriber, {
      status: 'subscribed',
      confirmedAt: FieldValue.serverTimestamp(),
      confirmationHash: FieldValue.delete(),
      confirmationExpiresAt: FieldValue.delete(),
    });
    return true;
  });
}

export function parseNewsletterAction(input: URLSearchParams | FormData) {
  const action = input.get('action');
  const token = input.get('token');
  if ((action !== 'confirm' && action !== 'unsubscribe') || typeof token !== 'string' || !/^[a-f0-9]{64}\.[A-Za-z0-9_-]{43}$/.test(token)) {
    return null;
  }
  return { action, token, locale: newsletterLocale(input.get('locale')) } as const;
}
