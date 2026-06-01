'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0 text-xs font-semibold select-none">
      <button
        onClick={() => setLang('en')}
        aria-label="Switch to English"
        className="px-2 py-1 transition-colors"
        style={{
          color: lang === 'en' ? '#C9A35A' : '#94A3B8',
          fontWeight: lang === 'en' ? 700 : 400,
        }}
      >
        EN
      </button>
      <span style={{ color: '#334155' }}>|</span>
      <button
        onClick={() => setLang('fa')}
        aria-label="Switch to Persian"
        className="px-2 py-1 transition-colors"
        style={{
          color: lang === 'fa' ? '#C9A35A' : '#94A3B8',
          fontWeight: lang === 'fa' ? 700 : 400,
          fontFamily: "'Vazirmatn', 'Tahoma', 'Arial', sans-serif",
        }}
      >
        فارسی
      </button>
    </div>
  );
}
