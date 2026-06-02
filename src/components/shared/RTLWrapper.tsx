'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  return (
    <div
      id="lang-root"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={isRTL ? 'fa' : 'en'}
      className="flex flex-col min-h-screen"
    >
      {children}
    </div>
  );
}
