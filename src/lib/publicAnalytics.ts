export const PRIVATE_ROUTE = /^\/(?:admin|dashboard|agent|consultant|case-manager|customer-service|document-reviewer|compliance-officer|enquiry-handler|sales-team|login|signup|verify-email|verify-otp|complete-login|forgot-password|reset-password)(?:\/|$)/;

export function trackPublicLead(service: string, language: 'en' | 'fa', formName: string) {
  if (typeof window === 'undefined' || PRIVATE_ROUTE.test(window.location.pathname)) return;
  try {
    const consent = JSON.parse(window.localStorage.getItem('pluco_cookie_consent') || '{}');
    if (consent.version !== 1 || consent.analytics !== true) return;
  } catch { return; }
  const analytics = window as Window & { dataLayer?: unknown[] };
  analytics.dataLayer = analytics.dataLayer || [];
  // Send one GA event through the existing Google tag destination. This avoids
  // duplicating the container's separate generate_lead custom event trigger.
  function command(..._args: unknown[]) { analytics.dataLayer!.push(arguments); }
  command('event', 'generate_lead', {
    send_to: 'G-56MTBRMS79', form_name: formName, service, language,
    page_location: window.location.origin + window.location.pathname,
    page_referrer: '',
  });
}
