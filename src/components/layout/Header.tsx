'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { t, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const services = [
    { key: 'nav.newIdentity' as const,             href: '/new-identity' },
    { key: 'nav.euPropertyPurchase' as const,      href: '/eu-property-purchase' },
    { key: 'nav.euResidency' as const,             href: '/eu-residency' },
    { key: 'nav.usGreenCard' as const,             href: '/us-green-card' },
    { key: 'nav.banking' as const,                 href: '/banking' },
    { key: 'nav.disputeResolution' as const,       href: '/dispute-resolution' },
    { key: 'nav.internationalContracts' as const,  href: '/international-contracts' },
    { key: 'nav.businessSolutions' as const,       href: '/business-solutions' },
    { key: 'nav.euCompanyRegistration' as const,   href: '/eu-company-registration' },
  ];

  const mobileAll = [
    { key: 'nav.home' as const,                    href: '/' },
    { key: 'nav.ourPeople' as const,               href: '/our-people' },
    ...services,
    { key: 'nav.publications' as const,            href: '/publications' },
    { key: 'nav.clientSignIn' as const,            href: '/client-sign-in' },
  ];

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
          <Link href="/" className="flex items-center flex-shrink-0">
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
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6" dir="ltr">
            {/* Home */}
            <Link href="/" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
              {t('nav.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#C9A35A' }} />
            </Link>

            {/* Our People */}
            <Link href="/our-people" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
              {t('nav.ourPeople')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#C9A35A' }} />
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white"
              >
                {t('nav.services')}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#C9A35A' }} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-lg shadow-2xl py-1 z-50"
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
            <Link href="/publications" className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap text-white">
              {t('nav.publications')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ backgroundColor: '#C9A35A' }} />
            </Link>

            {/* Client Sign In */}
            <Link
              href="/client-sign-in"
              className="px-5 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap"
              style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
            >
              {t('nav.clientSignIn')}
            </Link>
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
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
