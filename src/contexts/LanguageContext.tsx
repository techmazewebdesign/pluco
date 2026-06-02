'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [lang, setLangState] = useState<Lang>('en');

  // Read persisted preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pluco_lang') as Lang | null;
      if (stored === 'en' || stored === 'fa') {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (private mode etc.)
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem('pluco_lang', next);
    } catch {
      // ignore
    }
    setLangState(next);
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
