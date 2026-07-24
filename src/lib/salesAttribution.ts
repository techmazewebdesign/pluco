export type SalesAttribution = {
  landingPage: string;
  currentPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  msclkid: string;
};

const EMPTY_ATTRIBUTION: SalesAttribution = {
  landingPage: '',
  currentPage: '',
  referrer: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  gclid: '',
  msclkid: '',
};

const STORAGE_KEY = 'pluco_sales_attribution_v1';

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 500) : '';
}

export function normalizeSalesAttribution(value: unknown): SalesAttribution {
  const raw = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {};

  return Object.fromEntries(
    Object.keys(EMPTY_ATTRIBUTION).map((key) => [key, clean(raw[key])]),
  ) as SalesAttribution;
}

export function readSalesAttribution(): SalesAttribution {
  if (typeof window === 'undefined') return EMPTY_ATTRIBUTION;

  let stored: Partial<SalesAttribution> = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = normalizeSalesAttribution({
    ...stored,
    landingPage: stored.landingPage || `${window.location.pathname}${window.location.search}`,
    currentPage: window.location.pathname,
    referrer: stored.referrer || document.referrer,
    utmSource: stored.utmSource || params.get('utm_source'),
    utmMedium: stored.utmMedium || params.get('utm_medium'),
    utmCampaign: stored.utmCampaign || params.get('utm_campaign'),
    utmTerm: stored.utmTerm || params.get('utm_term'),
    utmContent: stored.utmContent || params.get('utm_content'),
    gclid: stored.gclid || params.get('gclid'),
    msclkid: stored.msclkid || params.get('msclkid'),
  });

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution must never block a lead submission.
  }

  return attribution;
}

export function trackSalesEvent(
  event: string,
  parameters: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return;
  const analyticsWindow = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  analyticsWindow.gtag?.('event', event, parameters);
  if (!analyticsWindow.gtag && Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event, ...parameters });
  }
}
