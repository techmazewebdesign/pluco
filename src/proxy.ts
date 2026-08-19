import { NextResponse, type NextRequest } from 'next/server';

const FEED = 'https://desivo.de/api/public/website-content';
const SKIP = ['/api', '/_next', '/managed-site-content', '/dashboard', '/agent', '/admin', '/consultant', '/case-manager', '/customer-service', '/document-reviewer', '/compliance-officer', '/enquiry-handler', '/bookings', '/login', '/signup', '/client-sign-in', '/complete-login', '/forgot-password', '/reset-password', '/verify-email', '/verify-otp'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (request.method !== 'GET' || SKIP.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return NextResponse.next();
  try {
    const response = await fetch(`${FEED}?domain=plucogroup.com&path=${encodeURIComponent(path)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return NextResponse.next();
    const payload = await response.json() as { page?: { managed?: boolean } };
    if (payload.page?.managed !== true) return NextResponse.next();
    const destination = request.nextUrl.clone();
    destination.pathname = '/managed-site-content';
    destination.search = `?path=${encodeURIComponent(path)}`;
    return NextResponse.rewrite(destination);
  } catch {
    return NextResponse.next();
  }
}

export const config = { matcher: ['/((?!.*\\.[a-zA-Z0-9]+$).*)'] };
