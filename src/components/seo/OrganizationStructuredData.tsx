import { SITE_DESCRIPTION, SITE_URL } from '@/lib/siteMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LegalService'],
      '@id': `${SITE_URL}/#organization`,
      name: 'PLUCO GROUP Sp. z o.o.',
      alternateName: 'PLUCO GROUP',
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-pluco.png`,
      email: 'info@plucogroup.com',
      areaServed: ['EU', 'PL', 'ES', 'US'],
      knowsLanguage: ['en', 'fa'],
      knowsAbout: [
        'European immigration law',
        'EU residency by investment',
        'Second citizenship',
        'Spain digital nomad visa',
        'EB-5 investor visa',
        'EU company registration',
        'Cross-border banking compliance',
      ],
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
