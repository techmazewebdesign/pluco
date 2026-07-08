'use client';

import Link from 'next/link';
import { MapPin, Mail, FileText } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, isRTL } = useLanguage();

  const services = [
    [t('nav.newIdentity'),            '/new-identity'],
    [t('nav.euResidency'),            '/eu-residency'],
    [t('nav.spainDigitalNomad'),      '/spain-digital-nomad-visa'],
    [t('nav.euPropertyPurchase'),     '/eu-property-purchase'],
    [t('nav.usGreenCard'),            '/us-green-card'],
    [t('nav.banking'),                '/banking'],
    [t('nav.disputeResolution'),      '/dispute-resolution'],
    [t('nav.internationalContracts'), '/international-contracts'],
    [t('nav.businessSolutions'),      '/business-solutions'],
    [t('nav.euCompanyRegistration'),  '/eu-company-registration'],
  ];

  const quickLinks = [
    [t('nav.ourPeople'),          '/our-people'],
    [t('nav.publications'),       '/publications'],
    [t('nav.clientSignIn'),       '/client-sign-in'],
    ['Contact',                   '/contact'],
    [t('footer.privacyPolicy'),   '/privacy-policy'],
    [t('footer.legalDisclaimer'), '/disclaimer'],
  ];

  return (
    <footer style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Column 1: Logo + tagline */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-pluco.png"
                alt="Pluco Group Sp. z o.o."
                width={220}
                height={56}
                className="w-[160px] sm:w-[200px] h-auto object-contain"
              />
            </div>
            <p className="text-sm mb-2 leading-snug" style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A35A' }}>
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A35A' }} />
                <a href="mailto:info@plucogroup.com" className="text-xs hover:text-white transition-colors" style={{ color: '#CBD5E0' }}>
                  info@plucogroup.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A35A' }} />
                <span className="text-xs" style={{ color: '#CBD5E0' }}>Ksawerów 3, 02-656 Warsaw, Poland</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A35A' }} />
                <span className="text-xs" style={{ color: '#CBD5E0' }}>KRS: 0000564904</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A35A' }}>
              {t('footer.services')}
            </h4>
            <ul className="space-y-2">
              {services.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs transition-colors hover:text-white" style={{ color: '#CBD5E0' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A35A' }}>
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs transition-colors hover:text-white" style={{ color: '#CBD5E0' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t pt-6 mb-4" style={{ borderColor: '#0B234A' }}>
          <p
            className="text-xs leading-relaxed"
            style={{
              color: '#475569',
              fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="text-center">
          <p className="text-xs" style={{ color: '#64748B' }}>
            © {new Date().getFullYear()} Pluco Group Sp. z o.o. {t('footer.copyright')} &nbsp;·&nbsp;
            <Link href="/privacy-policy" className="hover:text-white transition-colors" style={{ color: '#64748B' }}>{t('footer.privacyPolicy')}</Link>
            &nbsp;·&nbsp;
            <Link href="/disclaimer" className="hover:text-white transition-colors" style={{ color: '#64748B' }}>{t('footer.legalDisclaimer')}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
