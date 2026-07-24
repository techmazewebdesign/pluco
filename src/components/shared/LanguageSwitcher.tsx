'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ENGLISH_TO_PERSIAN_PATH,
  PERSIAN_TO_ENGLISH_PATH,
} from '@/lib/plucoPersianServices';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isFa = lang === 'fa';

  function switchLanguage(next: 'en' | 'fa') {
    setLang(next);
    if (next === 'fa') {
      router.push(ENGLISH_TO_PERSIAN_PATH[pathname] || '/fa');
      return;
    }
    router.push(PERSIAN_TO_ENGLISH_PATH[pathname] || '/');
  }

  return (
    <div
      className="flex items-center rounded-full overflow-hidden text-xs font-semibold"
      style={{ border: '1px solid #1E3A5F' }}
    >
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        aria-label="Switch to English"
        style={{
          padding: '3px 10px',
          backgroundColor: !isFa ? '#C9A35A' : 'transparent',
          color: !isFa ? '#071C3C' : '#64748B',
          fontWeight: !isFa ? 700 : 400,
          cursor: 'pointer',
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
        onClick={() => switchLanguage('fa')}
        aria-label="Switch to Persian / فارسی"
        style={{
          padding: '3px 10px',
          backgroundColor: isFa ? '#C9A35A' : 'transparent',
          color: isFa ? '#071C3C' : '#64748B',
          fontWeight: isFa ? 700 : 400,
          fontFamily: "'Vazirmatn', 'Tahoma', 'Arial', sans-serif",
          cursor: 'pointer',
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
