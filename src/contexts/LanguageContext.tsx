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
    const stored = localStorage.getItem('pluco_lang') as Lang | null;
    if (stored === 'en' || stored === 'fa') {
      setLangState(stored);
    }
  }, []);

  // Sync <html> dir/lang attributes whenever lang changes
  useEffect(() => {
    const html = document.documentElement;
    if (lang === 'fa') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'fa');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem('pluco_lang', next);
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
