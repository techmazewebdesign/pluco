'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languageRoutes } from '@/lib/languageRoutes';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const pair = languageRoutes.find(({ en, fa }) => en === pathname || fa === pathname);
  const [mounted, setMounted] = useState(false);

  // Only render interactively after client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pair) {
    return (
      <nav aria-label="Language" className="flex items-center overflow-hidden rounded-full border border-[#1E3A5F] text-xs font-semibold">
        {(['en', 'fa'] as const).map(language => (
          <Link
            key={language}
            href={pair[language]}
            hrefLang={language}
            lang={language}
            aria-current={lang === language ? 'page' : undefined}
            aria-label={language === 'en' ? 'English' : 'فارسی'}
            className={`px-2.5 py-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white ${lang === language ? 'bg-[#C9A35A] text-[#071C3C]' : 'text-slate-300 hover:text-white'}`}
          >
            {language === 'en' ? 'EN' : 'فارسی'}
          </Link>
        ))}
      </nav>
    );
  }

  const isFa = mounted ? lang === 'fa' : false;

  return (
    <div
      className="flex items-center rounded-full overflow-hidden text-xs font-semibold"
      style={{ border: '1px solid #1E3A5F' }}
    >
      <button
        type="button"
        disabled={!mounted}
        onClick={() => setLang('en')}
        aria-label="Switch to English"
        style={{
          padding: '3px 10px',
          backgroundColor: !isFa ? '#C9A35A' : 'transparent',
          color: !isFa ? '#071C3C' : '#64748B',
          fontWeight: !isFa ? 700 : 400,
          cursor: mounted ? 'pointer' : 'default',
          transition: 'background-color 0.2s, color 0.2s',
          border: 'none',
          outline: 'none',
          letterSpacing: '0.05em',
        }}
      >
        EN
      </button>
      <button
        type="button"
        disabled={!mounted}
        onClick={() => setLang('fa')}
        aria-label="Switch to Persian / فارسی"
        style={{
          padding: '3px 10px',
          backgroundColor: isFa ? '#C9A35A' : 'transparent',
          color: isFa ? '#071C3C' : '#64748B',
          fontWeight: isFa ? 700 : 400,
          fontFamily: "'Vazirmatn', 'Tahoma', 'Arial', sans-serif",
          cursor: mounted ? 'pointer' : 'default',
          transition: 'background-color 0.2s, color 0.2s',
          border: 'none',
          outline: 'none',
        }}
      >
        فارسی
      </button>
    </div>
  );
}
