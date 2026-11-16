import { getPageImages } from '@/lib/pageImages';
import { SITE_URL } from '@/lib/siteMetadata';

export default function PageImageStructuredData({ path }: { path: string }) {
  const pageImages = getPageImages(path);
  if (!pageImages) return null;

  const url = new URL(path, SITE_URL).href;
  const images = pageImages.images.map(({ src, width, height, alt }) => ({
    '@type': 'ImageObject',
    contentUrl: new URL(src, SITE_URL).href,
    width,
    height,
    description: alt[pageImages.lang],
    inLanguage: pageImages.lang,
    ...(pageImages.socialKey === 'sao-tome-citizenship-by-investment' ? {
      creator: { '@type': 'Person', name: 'Yakoo1986' },
      creditText: 'Yakoo1986 / Wikimedia Commons',
      license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    } : {}),
  }));

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    inLanguage: pageImages.lang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    primaryImageOfPage: images[0],
    ...(images.length > 1 ? { image: images.slice(1) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
