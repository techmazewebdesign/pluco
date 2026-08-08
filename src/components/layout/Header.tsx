'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { t, isRTL } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const services = [
    { key: 'nav.newIdentity' as const,             href: isRTL ? '/fa/services/second-citizenship' : '/new-identity' },
    { key: 'nav.euPropertyPurchase' as const,      href: isRTL ? '/fa/services/eu-property-purchase' : '/eu-property-purchase' },
    { key: 'nav.euResidency' as const,             href: isRTL ? '/fa/services/eu-residency' : '/eu-residency' },
    { key: 'nav.spainDigitalNomad' as const,       href: isRTL ? '/fa/services/spain-digital-nomad-visa' : '/spain-digital-nomad-visa' },
    { key: 'nav.banking' as const,                 href: isRTL ? '/fa/services/banking' : '/banking' },
    { key: 'nav.disputeResolution' as const,       href: isRTL ? '/fa/services/dispute-resolution' : '/dispute-resolution' },
    { key: 'nav.internationalContracts' as const,  href: isRTL ? '/fa/services/international-contracts' : '/international-contracts' },
    { key: 'nav.euCompanyRegistration' as const,   href: isRTL ? '/fa/services/eu-company-registration' : '/eu-company-registration' },
  ];

  const mobileBase = [
    { key: 'nav.home' as const,                    href: isRTL ? '/fa' : '/' },
    ...(!isRTL ? [{ key: 'nav.ourPeople' as const, href: '/our-people' }] : []),
    ...services,
    ...(isRTL ? [
      { key: 'nav.publications' as const, href: '/fa/guides', label: 'راهنماها' },
      { key: 'nav.publications' as const, href: '/fa/insights', label: 'بینش‌ها' },
    ] : []),
    ...(!isRTL ? [{ key: 'nav.publications' as const, href: '/publications' }] : []),
    ...(!isRTL ? [{ key: 'nav.publications' as const, href: '/insights', label: 'Insights' }] : []),
  ];

  const mobileAll = [...mobileBase];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: '#071C3C', borderBottom: '1px solid #0B234A' }}
    >
      {/* ── Top bar: language switcher ── */}
      <div
        className="border-b px-4 sm:px-6 lg:px-8 py-2 flex items-center"
        style={{ borderColor: '#0B234A', backgroundColor: '#051530', position: 'relative', zIndex: 60 }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* ── Main nav row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href={isRTL ? '/fa' : '/'} className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo-pluco.png"
              alt="Pluco Group Sp. z o.o."
              width={220}
              height={56}
              className="w-[140px] md:w-[180px] h-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Home */}
            <Link href={isRTL ? '/fa' : '/'} className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
              {t('nav.home')}
              <span
                className={`absolute bottom-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${isRTL ? 'right-0' : 'left-0'}`}
                style={{ backgroundColor: '#C9A35A' }}
              />
            </Link>

            {/* Our People */}
            {!isRTL ? (
              <Link href="/our-people" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
                {t('nav.ourPeople')}
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </Link>
            ) : (
              <Link href="/fa/guides" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
                راهنماها
                <span
                  className="absolute bottom-0 right-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </Link>
            )}

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white"
              >
                {t('nav.services')}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span
                  className={`absolute bottom-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${isRTL ? 'right-0' : 'left-0'}`}
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full mt-1 w-56 rounded-lg shadow-2xl py-1 z-50 ${isRTL ? 'right-0' : 'left-0'}`}
                    style={{ backgroundColor: '#071C3C', border: '1px solid #0B234A' }}
                  >
                    {services.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2.5 text-xs font-medium transition-colors hover:text-white"
                        style={{ color: '#CBD5E0' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0B234A')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Publications */}
            {!isRTL ? (
              <Link href="/publications" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
                {t('nav.publications')}
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </Link>
            ) : null}

            {!isRTL ? (
              <Link href="/guides" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
                Guides
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </Link>
            ) : null}

            <Link href={isRTL ? '/fa/insights' : '/insights'} className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
              {isRTL ? 'بینش‌ها' : 'Insights'}
              <span
                className={`absolute bottom-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}
                style={{ backgroundColor: '#C9A35A' }}
              />
            </Link>

            {/* Auth Links */}
            {!loading && !user ? (
              <Link
                href="/client-sign-in"
                className="px-5 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap"
                style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
              >
                {isRTL ? 'درگاه موکل' : 'Client portal'}
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-5 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap"
                  style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
                >
                  <User className="w-4 h-4" />
                  {isRTL ? 'پنل' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap text-white hover:opacity-80"
                  style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                >
                  <LogOut className="w-4 h-4" />
                  {isRTL ? 'خروج' : 'Logout'}
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: '#071C3C', borderTop: '1px solid #0B234A' }}
          >
            <nav
              className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {mobileAll.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm font-medium rounded transition-colors"
                  style={{ color: '#CBD5E0' }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A35A')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E0')}
                >
                  {'label' in item && item.label ? item.label : t(item.key)}
                </Link>
              ))}

              {/* Auth Links */}
              <div className="border-t border-gray-700 pt-3 mt-3">
                {!loading && !user ? (
                  <Link
                    href="/client-sign-in"
                    className="block px-3 py-2.5 text-sm font-medium rounded transition-colors"
                    style={{ color: '#C9A35A' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isRTL ? 'درگاه موکل' : 'Client portal'}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded transition-colors"
                      style={{ color: '#C9A35A' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      {isRTL ? 'پنل' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium rounded transition-colors flex items-center gap-2"
                      style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
                    >
                      <LogOut className="w-4 h-4" />
                      {isRTL ? 'خروج' : 'Logout'}
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
