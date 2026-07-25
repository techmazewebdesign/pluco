import { NextResponse } from 'next/server';

export function proxy() {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/agent/:path*',
    '/dashboard/:path*',
    '/consultant/:path*',
    '/compliance-officer/:path*',
    '/case-manager/:path*',
    '/document-reviewer/:path*',
    '/enquiry-handler/:path*',
    '/customer-service/:path*',
    '/bookings/:path*',
    '/help/consultant-guide',
    '/client-sign-in',
    '/login',
    '/signup',
    '/complete-login',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/verify-otp',
  ],
};
