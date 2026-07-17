import { SITE_DESCRIPTION, SITE_URL } from '@/lib/siteMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PLUCO GROUP Sp. z o.o.',
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-pluco.png`,
      email: 'info@plucogroup.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ksawerów 3',
        postalCode: '02-656',
        addressLocality: 'Warsaw',
        addressCountry: 'PL',
      },
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'PLUCO GROUP',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: ['en', 'fa'],
    },
  ],
};

export default function OrganizationStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
      }}
    />
  );
}
