'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Patch = { id: string; selector: string; kind: 'text' | 'image' | 'video' | 'visibility' | 'order' | 'clone'; value?: string; assetPath?: string; alt?: string; steps?: number; clone?: { heading?: string; body?: string; assetPath?: string; alt?: string } };
const FEED = 'https://desivo.de/api/public/website-content';
const ASSET = 'https://desivo.de/api/public/website-asset';
const SKIP = ['/admin', '/dashboard', '/api', '/login', '/signup', '/client-sign-in', '/managed-site-content'];

function applyPatch(patch: Patch): boolean {
  const element = document.querySelector<HTMLElement>(patch.selector);
  if (!element) return false;
  if (patch.kind === 'text') element.textContent = patch.value || '';
  if (patch.kind === 'image' && patch.assetPath && element instanceof HTMLImageElement) { element.src = `${ASSET}?path=${encodeURIComponent(patch.assetPath)}`; element.alt = patch.alt || ''; }
  if (patch.kind === 'video' && patch.value && (element instanceof HTMLVideoElement || element instanceof HTMLIFrameElement)) element.src = patch.value;
  if (patch.kind === 'visibility') element.style.display = patch.value === 'hidden' ? 'none' : '';
  if (patch.kind === 'order') {
    let steps = Number(patch.steps) || 0;
    while (steps < 0 && element.previousElementSibling) { element.parentElement?.insertBefore(element, element.previousElementSibling); steps += 1; }
    while (steps > 0 && element.nextElementSibling) { element.parentElement?.insertBefore(element.nextElementSibling, element); steps -= 1; }
  }
  if (patch.kind === 'clone' && !document.querySelector(`[data-desivo-clone="${CSS.escape(patch.id)}"]`)) {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.dataset.desivoClone = patch.id; clone.removeAttribute('id');
    const heading = clone.matches('h1,h2,h3,h4') ? clone : clone.querySelector<HTMLElement>('h1,h2,h3,h4');
    const paragraph = clone.matches('p') ? clone : clone.querySelector<HTMLElement>('p');
    const image = clone.matches('img') ? clone as HTMLImageElement : clone.querySelector<HTMLImageElement>('img');
    if (heading && patch.clone?.heading) heading.textContent = patch.clone.heading;
    if (paragraph && patch.clone?.body) paragraph.textContent = patch.clone.body;
    if (image && patch.clone?.assetPath) { image.src = `${ASSET}?path=${encodeURIComponent(patch.clone.assetPath)}`; image.alt = patch.clone.alt || ''; }
    element.after(clone);
  }
  return true;
}

export function DesivoVisualContent() {
  const pathname = usePathname() || '/';
  useEffect(() => {
    if (SKIP.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return;
    let cancelled = false;
    let observer: MutationObserver | null = null;
    void fetch(`${FEED}?domain=plucogroup.com&path=${encodeURIComponent(pathname)}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (cancelled) return;
        const patches = Array.isArray(payload?.page?.visualPatches) ? payload.page.visualPatches as Patch[] : [];
        if (!patches.length) return;
        const run = () => patches.every(applyPatch);
        if (run()) return;
        observer = new MutationObserver(() => { if (run()) observer?.disconnect(); });
        observer.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(() => observer?.disconnect(), 8_000);
      }).catch(() => undefined);
    return () => { cancelled = true; observer?.disconnect(); };
  }, [pathname]);
  return null;
}
