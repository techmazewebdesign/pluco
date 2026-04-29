'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Dispute Resolution & Settlements', href: '/dispute-resolution' },
  { name: 'Banking Compliance', href: '/banking-compliance' },
  { name: 'Financial Discrimination', href: '/financial-discrimination' },
  { name: 'Industries', href: '/industries' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: '#071C3C', borderBottom: '1px solid #0B234A' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 pl-1">
            <Image
              src="/images/logo-pluco.png"
              alt="Pluco Group Sp. z o.o. logo"
              width={170}
              height={48}
              className="w-[130px] md:w-[170px] h-auto object-contain"
              style={{ opacity: 1 }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium py-2 relative group transition-colors whitespace-nowrap"
                style={{ color: '#FFFFFF' }}
              >
                {item.name}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: '#C9A35A' }}
                />
              </Link>
            ))}
            <Link
              href="/enquire"
              className="px-5 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap"
              style={{ borderColor: '#C9A35A', color: '#C9A35A' }}
            >
              Enquire Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden"
          style={{ backgroundColor: '#071C3C', borderTop: '1px solid #0B234A' }}
        >
          <nav className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-white hover:text-gold-500 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block px-3 py-2 bg-gold-500 text-navy-900 font-medium rounded-lg text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Enquire Now
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
