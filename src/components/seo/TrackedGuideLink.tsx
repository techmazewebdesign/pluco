'use client';

import Link from 'next/link';
import { trackSalesEvent } from '@/lib/salesAttribution';

type Props = {
  href: string;
  className: string;
  children: React.ReactNode;
  guideSlug: string;
  locale: 'en' | 'fa';
  action: 'service_cta' | 'language_switch';
};

export default function TrackedGuideLink({
  href,
  className,
  children,
  guideSlug,
  locale,
  action,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackSalesEvent('select_content', {
        content_type: 'seo_guide',
        item_id: guideSlug,
        locale,
        action,
        destination: href,
      })}
    >
      {children}
    </Link>
  );
}
