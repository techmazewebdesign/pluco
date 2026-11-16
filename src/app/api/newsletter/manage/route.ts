import { applyNewsletterAction, parseNewsletterAction } from '@/lib/newsletter';
import { newsletterCopy, newsletterLocale } from '@/lib/newsletterCopy';

type Action = NonNullable<ReturnType<typeof parseNewsletterAction>>;

function page(locale: 'en' | 'fa', message: string, status = 200, action?: Action) {
  const copy = newsletterCopy[locale];
  const form = action ? `<form method="post" action="/api/newsletter/manage">
    <input type="hidden" name="action" value="${action.action}">
    <input type="hidden" name="token" value="${action.token}">
    <input type="hidden" name="locale" value="${locale}">
    <button type="submit">${copy[action.action]}</button>
  </form>` : '';
  return new Response(`<!doctype html><html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${copy.title}</title>
      <style>
        body{margin:0;background:#071c3c;color:#f1f5f9;font:1rem/1.6 system-ui,sans-serif}
        main{box-sizing:border-box;width:min(34rem,calc(100% - 2rem));margin:12vh auto;padding:2rem;border:1px solid #9e814d;border-radius:.75rem}
        h1{margin:0 0 1rem;font-size:1.65rem} button{font:inherit;font-weight:600;border:0;border-radius:.35rem;padding:.65rem 1rem;background:#e0bb75;color:#071c3c;cursor:pointer}
        a{display:inline-block;margin-top:1rem;color:#e0bb75}
      </style>
    </head><body><main><h1>${copy.title}</h1><p>${message}</p>${form}
      <a href="${locale === 'fa' ? '/fa' : '/'}#newsletter">${copy.back}</a>
    </main></body></html>`, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const locale = newsletterLocale(params.get('locale'));
  const action = parseNewsletterAction(params);
  return action ? page(locale, newsletterCopy[locale][action.action], 200, action) : page(locale, newsletterCopy[locale].invalid, 400);
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');
  if (!contentType?.startsWith('application/x-www-form-urlencoded')) return page('en', newsletterCopy.en.invalid, 415);
  const raw = await request.text();
  if (raw.length > 1024) return page('en', newsletterCopy.en.invalid, 413);
  const form = new URLSearchParams(raw);
  const locale = newsletterLocale(form.get('locale'));
  const copy = newsletterCopy[locale];
  const action = parseNewsletterAction(form);
  if (!action) return page(locale, copy.invalid, 400);

  try {
    if (!await applyNewsletterAction(action.action, action.token)) return page(locale, copy.invalid, 400);
    return page(locale, action.action === 'confirm' ? copy.confirmed : copy.unsubscribed);
  } catch {
    console.error('Newsletter subscription action failed');
    return page(locale, copy.error, 503, action);
  }
}
