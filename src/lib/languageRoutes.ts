import { ENGLISH_TO_PERSIAN_PATH } from './plucoPersianServices';
export const languageRoutes: { en: string; fa: string }[] = [
  { en: '/', fa: '/fa' },
  { en: '/iranian-clients', fa: '/fa/iranians-abroad' },
  { en: '/sao-tome-citizenship-by-investment', fa: '/fa/sao-tome-citizenship-by-investment' },
  ...Object.entries(ENGLISH_TO_PERSIAN_PATH).map(([en, fa]) => ({ en, fa })),
];
export function localizedPath(path: string, persian: boolean) {
  const pair = languageRoutes.find(route => route.en === path || route.fa === path);
  return pair ? (persian ? pair.fa : pair.en) : path;
}
export function languageAlternates(path: string, base: string) {
  const pair = languageRoutes.find(route => route.en === path || route.fa === path);
  if (!pair) return undefined;
  const en = new URL(pair.en, base).href;
  return { en, fa: new URL(pair.fa, base).href, 'x-default': en };
}
