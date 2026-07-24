'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { type Lang, type TranslationKey, t as translate } from '@/lib/translations';

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
  const pathname = usePathname();
  const routeLanguage: Lang = pathname === '/fa' || pathname.startsWith('/fa/') ? 'fa' : 'en';
  const lang = routeLanguage;

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem('pluco_lang', next);
    } catch {
      // ignore
    }
  }, []);

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
