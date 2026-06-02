'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Only render interactively after client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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
