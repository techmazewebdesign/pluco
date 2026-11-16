import type { Metadata } from 'next';
import AdvisoryHome from '@/components/home/AdvisoryHome';
import { SITE_URL } from '@/lib/siteMetadata';

const url = `${SITE_URL}/fa`;

export const metadata: Metadata = {
  title: { absolute: "مشاوره اقامت اروپا برای ایرانیان | پلوکو گروپ" },
  description: "اطلاعات عمومی پلوکو گروپ درباره اقامت اروپا، امور بانکی و تطبیق، ثبت شرکت و مسائل فرامرزی برای ایرانیان.",
  alternates: { canonical: url, languages: { en: SITE_URL, fa: url, "x-default": SITE_URL } },
  openGraph: { title: "مشاوره اقامت اروپا برای ایرانیان | پلوکو گروپ", description: "اطلاعات عمومی درباره امور اقامت، بانکی، ثبت شرکت و مسائل فرامرزی.", url, locale: "fa_IR", alternateLocale: ["en_US"], type: "website" },
};

export default function PersianHomePage() {
  return <AdvisoryHome locale="fa" />;
}
