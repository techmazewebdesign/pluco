import { ENGLISH_TO_PERSIAN_PATH } from './plucoPersianServices';
import { polishSlugs } from './polishContent';

export type SiteLocale = 'en' | 'fa' | 'pl';
type LanguageRoute = Partial<Record<SiteLocale, string>> & { en: string };
export const homePaths = { en: '/en', fa: '/fa', pl: '/pl' } as const;

const pairs = new Map<string, LanguageRoute>([
  ['/en', homePaths],
  ['/iranian-clients', { en: '/iranian-clients', fa: '/fa/iranians-abroad' }],
  ['/sao-tome-citizenship-by-investment', { en: '/sao-tome-citizenship-by-investment', fa: '/fa/sao-tome-citizenship-by-investment' }],
  ...Object.entries(ENGLISH_TO_PERSIAN_PATH).map(([en, fa]): [string, LanguageRoute] => [en, { en, fa }]),
]);
for (const slug of polishSlugs) {
  const en = `/${slug}`;
  pairs.set(en, { ...(pairs.get(en) ?? { en }), pl: `/pl/${slug}` });
}

export const languageRoutes = Array.from(pairs.values());

export function routeForLanguage(path: string) {
  return languageRoutes.find(({ en, fa, pl }) => en === path || fa === path || pl === path);
}

export function localeForPath(path: string): SiteLocale {
  if (path === '/' || path === '/fa' || path.startsWith('/fa/')) return 'fa';
  if (path === '/pl' || path.startsWith('/pl/')) return 'pl';
  return 'en';
}

export function localizedPath(path: string, language: SiteLocale | boolean) {
  const locale = typeof language === 'boolean' ? (language ? 'fa' : 'en') : language;
  return routeForLanguage(path)?.[locale] ?? path;
}

export function languageAlternates(path: string, base: string) {
  const pair = routeForLanguage(path);
  if (!pair) return undefined;
  const absolute = (target: string) => new URL(target, base).href;
  return {
    en: absolute(pair.en),
    ...(pair.fa ? { fa: absolute(pair.fa) } : {}),
    ...(pair.pl ? { pl: absolute(pair.pl) } : {}),
    'x-default': absolute(pair.fa ?? pair.en),
  };
}
