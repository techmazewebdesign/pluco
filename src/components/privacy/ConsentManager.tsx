'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type ConsentRecord = {
  version: 1;
  analytics: boolean;
  timestamp: string;
};

type ConsentState = 'loading' | 'unset' | 'accepted' | 'rejected';

const CONSENT_KEY = 'pluco_cookie_consent';
const GA_ID = 'G-56MTBRMS79';
export const OPEN_COOKIE_SETTINGS_EVENT = 'pluco:open-cookie-settings';

const copy = {
  en: {
    label: 'Confidential by design', title: 'Your privacy, clearly handled.',
    description: 'We use optional analytics to improve this website. Google Analytics remains off until you choose to allow it.',
    reject: 'Essential only', accept: 'Accept all', privacy: 'Privacy policy',
  },
  fa: {
    label: 'محرمانگی در طراحی', title: 'حریم خصوصی شما، شفاف و محترمانه.',
    description: 'برای بهبود این وب‌سایت از تحلیل‌های اختیاری استفاده می‌کنیم. گوگل آنالیتیکس تا زمانی که اجازه ندهید غیرفعال می‌ماند.',
    reject: 'فقط ضروری', accept: 'پذیرش همه', privacy: 'سیاست حریم خصوصی',
  },
} as const;

function readConsent(): ConsentState {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (!saved) return 'unset';
    const record = JSON.parse(saved) as Partial<ConsentRecord>;
    if (record.version === 1 && typeof record.analytics === 'boolean' && typeof record.timestamp === 'string') {
      return record.analytics ? 'accepted' : 'rejected';
    }
  } catch {
    // Treat unreadable or blocked storage as no choice.
  }
  return 'unset';
}

function storeConsent(analytics: boolean) {
  const record: ConsentRecord = { version: 1, analytics, timestamp: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // The choice still applies for the current page when storage is unavailable.
  }
}

function clearGoogleAnalyticsCookies() {
  const names = document.cookie.split(';').map((part) => part.trim().split('=')[0]);
  const domains = [undefined, window.location.hostname, `.${window.location.hostname}`];
  names.filter((name) => name === '_ga' || name.startsWith('_ga_')).forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    });
  });
}

export default function ConsentManager() {
  const { lang, isRTL } = useLanguage();
  const [consent, setConsent] = useState<ConsentState>('loading');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setConsent(readConsent()));
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  if (consent === 'loading') return null;

  const text = copy[lang];
  const showPanel = consent === 'unset' || settingsOpen;

  function choose(analytics: boolean) {
    storeConsent(analytics);
    if (!analytics) clearGoogleAnalyticsCookies();
    if (consent === 'accepted' && !analytics) {
      window.location.reload();
      return;
    }
    setConsent(analytics ? 'accepted' : 'rejected');
    setSettingsOpen(false);
  }

  return (
    <>
      {consent === 'accepted' ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="pluco-ga-gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {showPanel ? (
        <aside className="pluco-consent" dir={isRTL ? 'rtl' : 'ltr'} role="dialog" aria-modal="false" aria-labelledby="pluco-consent-title" aria-describedby="pluco-consent-description">
          <div className="pluco-consent__rule" aria-hidden="true"><span /></div>
          <div className="pluco-consent__copy">
            <span className="pluco-consent__label">{text.label}</span>
            <strong id="pluco-consent-title">{text.title}</strong>
            <p id="pluco-consent-description">{text.description}</p>
            <a href="/privacy-policy">{text.privacy}</a>
          </div>
          <div className="pluco-consent__actions">
            <button type="button" onClick={() => choose(false)}>{text.reject}</button>
            <button className="pluco-consent__accept" type="button" onClick={() => choose(true)}>{text.accept}</button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
