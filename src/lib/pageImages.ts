import { localizedPath, localeForPath, type SiteLocale } from './languageRoutes';

export type ImageLocale = SiteLocale;

type PageImage = {
  src: string;
  width: number;
  height: number;
  alt: Record<ImageLocale, string>;
  socialKey?: string;
};

export const homepageImages = {
  meeting: {
    src: '/images/advisory/advisory-meeting.webp', width: 1400, height: 933,
    alt: {
      en: 'A smiling woman discussing a document with others in a bright office',
      fa: 'زنی خندان در حال گفت‌وگو با دیگران درباره یک سند در دفتری روشن',
      pl: 'Uśmiechnięta kobieta omawia dokument z innymi osobami w jasnym biurze',
    },
  },
  cityWalk: {
    src: '/images/advisory/city-walk.webp', width: 1400, height: 933,
    alt: {
      en: 'A smiling couple walking together on a city street',
      fa: 'زوجی خندان در حال قدم زدن در خیابان شهر',
      pl: 'Uśmiechnięta para spaceruje miejską ulicą',
    },
  },
  warsaw: {
    src: '/images/advisory/warsaw-old-town.webp', width: 1400, height: 1049,
    alt: {
      en: 'People crossing Warsaw’s colourful Old Town square on a sunny day',
      fa: 'مردم در حال عبور از میدان رنگارنگ شهر قدیمی ورشو در یک روز آفتابی',
      pl: 'Przechodnie na Rynku Starego Miasta w Warszawie w słoneczny dzień',
    },
  },
} satisfies Record<string, PageImage>;

export const spainPhoto: PageImage = {
    src: '/images/digital_nomad_hero.png', width: 1536, height: 1024,
    alt: { en: 'A remote-work setup on a Spanish balcony overlooking the city', fa: 'میز کار دورکاری در بالکنی در اسپانیا رو به شهر', pl: 'Stanowisko do pracy zdalnej na balkonie w Hiszpanii z widokiem na miasto' },
  };

const servicePhotos: Partial<Record<string, PageImage>> = {
  'eu-property-purchase': {
    src: '/images/services/eu-property-purchase.webp', width: 1200, height: 840,
    alt: { en: 'Colorful historic buildings along a street in Riga, Latvia', fa: 'ساختمان‌های رنگارنگ تاریخی در خیابانی در ریگا، لتونی', pl: 'Kolorowe zabytkowe budynki przy ulicy w Rydze na Łotwie' },
  },
  'eu-residency': {
    src: '/images/services/eu-residency.webp', width: 1200, height: 840,
    alt: { en: 'A family walking along a sunny European street', fa: 'خانواده‌ای در حال قدم زدن در خیابانی آفتابی در اروپا', pl: 'Rodzina spaceruje słoneczną ulicą w Europie' },
  },
  'new-identity': {
    src: '/images/services/second-citizenship-passport.webp', width: 1200, height: 840,
    socialKey: 'second-citizenship-passport',
    alt: {
      en: 'An unbranded green passport booklet beside a map and pen',
      fa: 'دفترچه سبز گذرنامه بدون نشان کشور، کنار نقشه و خودکار',
      pl: 'Zielona książeczka paszportowa bez oznaczeń kraju obok mapy i długopisu',
    },
  },
  'us-green-card': {
    src: '/images/services/us-green-card.webp', width: 1200, height: 840,
    alt: { en: 'New York City skyline under a blue sky', fa: 'چشم‌انداز شهر نیویورک زیر آسمان آبی', pl: 'Panorama Nowego Jorku pod błękitnym niebem' },
  },
  'banking': {
    src: '/images/services/banking.webp', width: 1200, height: 840,
    alt: { en: 'A bank building with a columned façade', fa: 'نمای ساختمان بانک با ستون‌های بلند', pl: 'Fasada budynku banku z wysokimi kolumnami' },
  },
  'banking-compliance': {
    src: '/images/services/banking-compliance.webp', width: 1200, height: 840,
    alt: { en: 'A person reviewing documents with a laptop and calculator', fa: 'فردی در حال بررسی مدارک با لپ‌تاپ و ماشین‌حساب', pl: 'Osoba przegląda dokumenty przy laptopie i kalkulatorze' },
  },
  'dispute-resolution': {
    src: '/images/services/dispute-resolution.webp', width: 1200, height: 840,
    alt: { en: 'A group in discussion around a conference table', fa: 'گروهی در حال گفت‌وگو دور میز جلسه', pl: 'Grupa osób rozmawia przy stole konferencyjnym' },
  },
  'financial-discrimination': {
    src: '/images/services/financial-discrimination.webp', width: 1200, height: 840,
    alt: { en: 'Two women in conversation at a desk', fa: 'دو زن در حال گفت‌وگو پشت میز', pl: 'Dwie kobiety rozmawiają przy biurku' },
  },
  'international-contracts': {
    src: '/images/services/international-contracts.webp', width: 1200, height: 840,
    alt: { en: 'A person signing a document with a pen', fa: 'فردی در حال امضای سند با خودکار', pl: 'Osoba podpisuje dokument długopisem' },
  },
  'business-solutions': {
    src: '/images/services/business-solutions.webp', width: 1200, height: 840,
    alt: { en: 'Two colleagues working together in front of a laptop', fa: 'دو همکار در حال کار با لپ‌تاپ', pl: 'Dwoje współpracowników pracuje przy laptopie' },
  },
  'eu-company-registration': {
    src: '/images/services/eu-company-registration.webp', width: 1200, height: 840,
    alt: { en: 'Modern towers in Warsaw under a blue sky', fa: 'برج‌های مدرن ورشو زیر آسمان آبی', pl: 'Nowoczesne wieżowce Warszawy pod błękitnym niebem' },
  },
  'iranian-clients': {
    src: '/images/services/iranian-clients.webp', width: 1200, height: 840,
    alt: { en: 'Two women talking in a bright office', fa: 'دو زن در حال گفت‌وگو در دفتری روشن', pl: 'Dwie kobiety rozmawiają w jasnym biurze' },
  },
  'sao-tome-citizenship-by-investment': {
    src: '/images/services/sao-tome-citizenship-by-investment.webp', width: 1300, height: 867,
    alt: { en: 'Pico Cão Grande rising above the forest in São Tomé', fa: 'قله پیکو کائو گرانده بر فراز جنگل سائوتومه', pl: 'Pico Cão Grande wznosi się nad lasem na Wyspie Świętego Tomasza' },
  },
  'spain-digital-nomad-visa': spainPhoto,
};

export function servicePhoto(slug: string) {
  return Object.hasOwn(servicePhotos, slug) ? servicePhotos[slug] : undefined;
}

export function getPageImages(path: string) {
  const englishPath = localizedPath(path, false);
  const slug = englishPath.slice(1);
  const lang: ImageLocale = localeForPath(path);
  if (englishPath === '/en') {
    return { lang, socialKey: 'home', images: Object.values(homepageImages) };
  }

  const photo = servicePhoto(slug);
  return photo ? { lang, socialKey: photo.socialKey ?? slug, images: [photo] } : undefined;
}
