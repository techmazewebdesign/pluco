import Link from 'next/link';
import { notFound } from 'next/navigation';
import ServiceHeroImage from '@/components/shared/ServiceHeroImage';
import { createPageMetadata } from '@/lib/siteMetadata';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/contactDetails';
import { polishPage, polishSlugs } from '@/lib/polishContent';
import { servicePhoto } from '@/lib/pageImages';
import PolishEnquiryForm from './PolishEnquiryForm';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return polishSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = polishPage(slug);
  if (!page) notFound();
  return createPageMetadata({ title: `${page.title} | Pluco Group`, description: page.description, path: `/pl/${slug}` });
}

export default async function PolishPublicPage({ params }: Props) {
  const { slug } = await params;
  const page = polishPage(slug);
  if (!page) notFound();
  const hasPhoto = Boolean(servicePhoto(slug));
  const isLegal = ['privacy-policy', 'imprint', 'disclaimer'].includes(slug);
  return (
    <article className="min-h-[55vh] bg-[#fbf8f1] text-[#142d32]">
      <header className="border-b border-[#d8e1d6] bg-[#eaf3eb]">
        <div className={`mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:py-16 ${hasPhoto ? 'lg:grid-cols-2' : ''}`}>
          <div>
            <Link href="/pl" className="text-sm font-semibold text-[#16574e] underline">Strona główna</Link>
            <h1 className="mt-4 max-w-3xl text-pretty font-serif text-4xl font-semibold leading-tight lg:text-5xl">{page.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#455a58]">{page.description}</p>
          </div>
          {hasPhoto && <ServiceHeroImage service={slug} lang="pl" />}
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {slug === 'enquire' && <PolishEnquiryForm />}
        {slug === 'contact' && (
          <address className="mb-7 space-y-2 not-italic">
            <p>PLUCO GROUP sp. z o.o.</p>
            <p>ul. Ksawerów 3, 02-656 Warszawa, Polska</p>
            <p><a className="underline" href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a></p>
            <p><a className="underline" href="mailto:info@plucogroup.com">info@plucogroup.com</a></p>
          </address>
        )}
        {page.points.length > 0 && (
          <section className="max-w-3xl">
            {!isLegal && <h2 className="mb-4 font-serif text-2xl font-semibold">Jak możemy pomóc</h2>}
            <ul className="list-disc space-y-3 ps-5 leading-relaxed text-[#455a58]">
              {page.points.map(point => <li key={point}>{point}</li>)}
            </ul>
          </section>
        )}
        {slug === 'privacy-policy' && (
          <section id="newsletter-privacy-pl" className="mt-8 max-w-3xl scroll-mt-28">
            <h2 className="mb-3 font-serif text-2xl font-semibold">Newsletter</h2>
            <p>Adres e-mail, preferowany język i informację o zgodzie wykorzystujemy do obsługi newslettera. Wysyłamy go po potwierdzeniu adresu. Dane subskrypcji przechowujemy w Firebase, a e-maile potwierdzające wysyłamy przez Resend. Zgodę można cofnąć za pomocą linku do rezygnacji albo pisząc na info@plucogroup.com. Link potwierdzający wygasa po 48 godzinach.</p>
          </section>
        )}
        {page.related?.length && (
          <ul className="mt-7 space-y-3">
            {page.related.map(([label, href]) => <li key={href}><Link href={href} className="font-medium text-[#16574e] underline">{label}</Link></li>)}
          </ul>
        )}
        {slug !== 'enquire' && !isLegal && (
          <Link href="/pl/enquire" className="mt-8 inline-flex rounded-md bg-[#16574e] px-5 py-3 font-semibold text-white hover:bg-[#10463d]">
            Wyślij poufne zapytanie
          </Link>
        )}
      </div>
    </article>
  );
}
