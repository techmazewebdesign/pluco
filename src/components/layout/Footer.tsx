import Link from 'next/link';
import { MapPin, Mail, FileText } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#071C3C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Column 1: Logo + tagline */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo-pluco.png"
                alt="Pluco Group Sp. z o.o. logo"
                width={180}
                height={40}
                className="h-auto"
              />
            </div>
            <p className="text-sm mb-1" style={{ color: '#C9A35A' }}>
              Commercial &amp; Legal Consultancy
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
              International legal insight. Commercial precision. Strategic protection.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#C9A35A' }}
            >
              CONTACT
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A35A' }} />
                <span className="text-xs" style={{ color: '#CBD5E0' }}>info@plucogroup.com</span>
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
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#C9A35A' }}
            >
              SERVICES
            </h4>
            <ul className="space-y-2">
              {[
                ['International Contracts', '/international-contracts'],
                ['Dispute Resolution & Settlements', '/dispute-resolution'],
                ['Banking Compliance', '/banking-compliance'],
                ['Financial Discrimination', '/financial-discrimination'],
                ['High-Tech Industrial Contracts', '/international-contracts'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs transition-colors hover:text-white"
                    style={{ color: '#CBD5E0' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: '#C9A35A' }}
            >
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              {[
                ['About Us', '/about-us'],
                ['Our People', '/our-people'],
                ['Industries', '/industries'],
                ['Contact', '/contact'],
                ['Privacy Policy', '/privacy-policy'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs transition-colors hover:text-white"
                    style={{ color: '#CBD5E0' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 text-center"
          style={{ borderColor: '#0B234A' }}
        >
          <p className="text-xs" style={{ color: '#64748B' }}>
            © 2026 Pluco Group Sp. z o.o. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
