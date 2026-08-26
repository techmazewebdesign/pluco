import { SITE_DESCRIPTION, SITE_URL } from '@/lib/siteMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PLUCO GROUP Sp. z o.o.',
      legalName: 'PLUCO GROUP SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
      alternateName: 'PLUCO GROUP',
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-pluco.png`,
      email: 'info@plucogroup.com',
      telephone: '+48730962085',
      taxID: '5272739549',
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'KRS', value: '0000564904' },
        { '@type': 'PropertyValue', propertyID: 'REGON', value: '361874067' },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ksawerów 3',
        postalCode: '02-656',
        addressLocality: 'Warsaw',
        addressCountry: 'PL',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'info@plucogroup.com',
        telephone: '+48730962085',
        availableLanguage: ['English', 'Persian', 'Polish'],
      },
      knowsAbout: [
        'European immigration and residency',
        'Private client advisory',
        'Cross-border contracts',
        'Company registration in the European Union',
      ],
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
