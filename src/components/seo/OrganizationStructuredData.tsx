import { SITE_DESCRIPTION, SITE_URL } from '@/lib/siteMetadata';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PLUCO GROUP Sp. z o.o.',
      legalName: 'PLUCO GROUP Sp. z o.o.',
      alternateName: 'PLUCO GROUP',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-pluco.png`,
        contentUrl: `${SITE_URL}/images/logo-pluco.png`,
        width: 1536,
        height: 1024,
      },
      email: 'info@plucogroup.com',
      telephone: '+48 730 962 085',
      iso6523Code: '0060:366206814',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'KRS',
        value: '0000564904',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ksawerów 3',
        postalCode: '02-656',
        addressLocality: 'Warsaw',
        addressCountry: 'PL',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'info@plucogroup.com',
        telephone: '+48 730 962 085',
        availableLanguage: ['English', 'Persian'],
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
