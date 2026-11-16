import { newsletterLocale } from '@/lib/newsletterCopy';
import { requestNewsletter } from '@/lib/newsletter';

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'invalid' }, { status: 415 });
  }

  const raw = await request.text();
  if (raw.length > 1024) return Response.json({ error: 'invalid' }, { status: 413 });

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@<>,";]+@[^\s@<>,";.]+(?:\.[^\s@<>,";.]+)+$/.test(email) || input?.consent !== true) {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  try {
    const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const result = await requestNewsletter(email, newsletterLocale(input.locale), ip);
    if (result === 'limited') return Response.json({ error: 'limited' }, { status: 429 });
    return Response.json({ accepted: true });
  } catch {
    console.error('Newsletter signup failed while saving or sending confirmation');
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
