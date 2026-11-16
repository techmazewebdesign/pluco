import Image from 'next/image';

import { servicePhoto, type ImageLocale } from '@/lib/pageImages';
import { localizedPath } from '@/lib/languageRoutes';
import PageImageStructuredData from '@/components/seo/PageImageStructuredData';

export default function ServiceHeroImage({ service, lang }: { service: string; lang: ImageLocale }) {
  const photo = servicePhoto(service);
  if (!photo) return null;

  return (
    <figure className="min-w-0">
      <PageImageStructuredData path={localizedPath(`/${service}`, lang === 'fa')} />
      <div className="relative aspect-[10/7] overflow-hidden rounded-2xl bg-slate-800 sm:max-lg:aspect-[16/9]">
        <Image
          src={photo.src}
          alt={photo.alt[lang]}
          fill
          sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 94vw"
          fetchPriority="high"
          loading="eager"
          className="object-cover"
        />
      </div>
      {service === 'sao-tome-citizenship-by-investment' && (
        <figcaption className="mt-2 text-xs text-slate-300">
          <a href="https://commons.wikimedia.org/wiki/File:Pico_Cao_Grande.jpg" className="underline">Yakoo1986 / Wikimedia Commons</a>
          {' · '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline">CC BY-SA 4.0</a>
          {lang === 'fa' ? ' · برش و تغییر اندازه' : ' · cropped and resized'}
        </figcaption>
      )}
    </figure>
  );
}
