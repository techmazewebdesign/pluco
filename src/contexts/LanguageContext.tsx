'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type Lang, type TranslationKey, t as translate } from '@/lib/translations';

import { homePaths, localeForPath, routeForLanguage } from '@/lib/languageRoutes';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<{ pathname: string; lang: Lang } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  // Discard a page-only override when navigation leaves its URL. This guarded
  // render adjustment also prevents a stale override reappearing on browser back.
  if (selection && selection.pathname !== pathname) {
    setSelection(null);
  }
  const pair = routeForLanguage(pathname);
  // URL language wins on every navigation, including ordinary Links and history.
  // A manual toggle on a generic page cannot leak into another page.
  const lang: Lang = pair || localeForPath(pathname) !== 'en'
    ? localeForPath(pathname)
    : selection?.pathname === pathname ? selection.lang : 'en';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  // The URL determines the initial language for server output and hydration.
  const setLang = useCallback((next: Lang) => {
    const routes = routeForLanguage(pathname);
    const target = routes?.[next];
    if (target) {
      router.push(target);
    } else if (next === 'pl' || routes || localeForPath(pathname) !== 'en') {
      router.push(homePaths[next]);
    } else {
      // A generic page's presentation toggle belongs only to that URL.
      // Navigation to another English URL always starts in English.
      setSelection({ pathname, lang: next });
    }
  }, [pathname, router]);

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'fa' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
