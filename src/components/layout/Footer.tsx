'use client';

import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';
import { newsletterCopy } from '@/lib/newsletterCopy';
import { localizedPath } from '@/lib/languageRoutes';
import { MapPin, Mail, FileText } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/components/privacy/ConsentManager';

export default function Footer() {
  const { t, lang, isRTL } = useLanguage();

  const services = [
    [t('nav.saoTomeCitizenship'),     '/sao-tome-citizenship-by-investment'],
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
    [lang === 'pl' ? 'O nas' : 'About Us',                  '/about-us'],
    [isRTL ? 'راهنمای ایرانیان خارج از کشور' : lang === 'pl' ? 'Wsparcie dla klientów z Iranu' : 'Services for Iranian clients', '/iranian-clients'],
    [isRTL ? 'مشاوران' : lang === 'pl' ? 'Konsultanci' : 'Consultants', '/consultants'],
    [t('nav.publications'),       '/publications'],
    [lang === 'pl' ? 'Klienci i branże' : 'Industries',                '/industries'],
    [lang === 'pl' ? 'Dokumentacja zgodności bankowej' : 'Banking Compliance',        '/banking-compliance'],
    [lang === 'pl' ? 'Bariery w dostępie do usług finansowych' : 'Financial Discrimination',  '/financial-discrimination'],
    [t('nav.clientSignIn'),       '/client-sign-in'],
    [lang === 'pl' ? 'Kontakt' : 'Contact',                   '/contact'],
    [t('footer.privacyPolicy'),   '/privacy-policy'],
    [lang === 'pl' ? 'Informacje o operatorze' : 'Legal Notice',              '/imprint'],
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
            <p className="text-xs leading-relaxed mt-4" style={{ color: '#CBD5E0', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
              {isRTL ? <>DESIVO، دپارتمان رشد دیجیتال و سیستم‌های کسب‌وکار PLUCO GROUP است. <a href="https://desivo.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">desivo.de</a> · <a href="https://desivo.pl" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">desivo.pl</a></> : <>{lang === 'pl' ? 'DESIVO to dział Pluco Group zajmujący się rozwojem cyfrowym i systemami biznesowymi.' : "DESIVO is PLUCO GROUP’s digital growth and business systems department."} <a href="https://desivo.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">desivo.de</a> · <a href="https://desivo.pl" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">desivo.pl</a></>}
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
                  <Link href={localizedPath(href, lang)} className="text-xs transition-colors hover:text-white" style={{ color: '#CBD5E0' }}>
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
              <li>
                <a href="#newsletter" className="text-xs text-[#E0BB75] underline-offset-2 hover:underline">
                  {newsletterCopy[lang].link}
                </a>
              </li>
              {quickLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedPath(href, lang)} className="text-xs transition-colors hover:text-white" style={{ color: '#CBD5E0' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <NewsletterSignup locale={lang} />

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
            <Link href={localizedPath("/privacy-policy", lang)} className="hover:text-white transition-colors" style={{ color: '#64748B' }}>{t('footer.privacyPolicy')}</Link>
            &nbsp;·&nbsp;
            <Link href={localizedPath("/imprint", lang)} className="hover:text-white transition-colors" style={{ color: '#64748B' }}>{lang === 'pl' ? 'Informacje o operatorze' : 'Legal Notice'}</Link>
            &nbsp;·&nbsp;
            <Link href={localizedPath("/disclaimer", lang)} className="hover:text-white transition-colors" style={{ color: '#64748B' }}>{t('footer.legalDisclaimer')}</Link>
            &nbsp;·&nbsp;
            <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))} className="hover:text-white transition-colors" style={{ padding: 0, border: 0, background: 'transparent', color: '#64748B', cursor: 'pointer' }}>{t('footer.cookieSettings')}</button>
          </p>
        </div>
      </div>
    </footer>
  );
}
