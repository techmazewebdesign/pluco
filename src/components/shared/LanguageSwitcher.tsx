'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { homePaths, routeForLanguage, type SiteLocale } from '@/lib/languageRoutes';
import { useLanguage } from '@/contexts/LanguageContext';

const choices = [
  { locale: 'fa', label: 'فارسی', name: 'فارسی' },
  { locale: 'en', label: 'EN', name: 'English' },
  { locale: 'pl', label: 'PL', name: 'Polski' },
] as const;

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const pair = routeForLanguage(pathname);
  const active = 'bg-[#C9A35A] text-[#071C3C]';
  const inactive = 'text-slate-300 hover:text-white';
  const label: Record<SiteLocale, string> = { en: 'Language', fa: 'زبان', pl: 'Język' };
  return (
    <nav aria-label={label[lang]} className="flex shrink-0 items-center overflow-hidden rounded-full border border-[#1E3A5F] text-xs font-semibold">
      {choices.map(({ locale, label, name }) => {
        const className = `px-2 py-[3px] sm:px-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white ${lang === locale ? active : inactive}`;
        const href = pair?.[locale] ?? (locale === 'pl' || pair ? homePaths[locale] : undefined);
        return href ? (
          <Link key={locale} href={href} hrefLang={locale} lang={locale}
            aria-label={name} aria-current={lang === locale ? 'page' : undefined} className={className}>
            {label}
          </Link>
        ) : (
          <button key={locale} type="button" lang={locale} onClick={() => setLang(locale)}
            aria-label={name} aria-pressed={lang === locale} className={className}>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
