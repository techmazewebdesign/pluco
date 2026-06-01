'use client';

import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Shows a discreet Persian-language notice when a page body has not yet
 * been translated. Only visible when lang === 'fa'.
 */
export default function TranslationPending() {
  const { lang } = useLanguage();
  if (lang !== 'fa') return null;

  return (
    <div
      className="mx-auto max-w-4xl px-4 py-4 my-8 rounded-lg text-sm text-right"
      style={{
        backgroundColor: '#FFF8E8',
        border: '1px solid #E8C96A',
        color: '#92681A',
        fontFamily: "'Vazirmatn', 'Tahoma', 'Arial', sans-serif",
        direction: 'rtl',
      }}
    >
      محتوای این صفحه به زودی به فارسی ترجمه خواهد شد. برای مشاوره به زبان فارسی، لطفاً با ما از طریق{' '}
      <a href="mailto:info@plucogroup.com" className="underline font-semibold">info@plucogroup.com</a>{' '}
      تماس بگیرید.
    </div>
  );
}
