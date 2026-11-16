'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PRIVATE_ROUTE } from '@/lib/publicAnalytics';

export default function PublicPageTracking() {
  const path = usePathname();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (PRIVATE_ROUTE.test(path)) { last.current = null; return; }
    if (last.current === path) return;
    const analytics = window as Window & { dataLayer?: unknown[] };
    analytics.dataLayer = analytics.dataLayer || [];
    // The container already sends the first page_view. Record clean route
    // metadata for future GTM reporting without adding a duplicate page_view.
    analytics.dataLayer.push({ event: 'pluco_public_page', page_path: path,
      page_language: path === '/fa' || path.startsWith('/fa/') ? 'fa' : 'en',
      page_location: window.location.origin + path });
    last.current = path;
  }, [path]);
  return null;
}
