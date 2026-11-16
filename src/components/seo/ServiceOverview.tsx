import Link from 'next/link';
import { ENGLISH_SERVICE_CONTENT } from '@/lib/englishServiceContent';
import { SITE_URL } from '@/lib/siteMetadata';
import { localizedPath } from '@/lib/languageRoutes';

export default function ServiceOverview({ path }: { path: string }) {
  const service = ENGLISH_SERVICE_CONTENT[path];
  if (!service) return null;
  const persian = localizedPath(path, true);
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Service', name: service.title, description: service.description,
      url: SITE_URL + path, provider: { '@id': SITE_URL + '/#organization' }, availableLanguage: ['en', 'fa'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: service.title, item: SITE_URL + path },
    ] },
  ] };
  return <section className="bg-[#F7F5EF] px-5 py-14 text-[#172033]" lang="en">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <div className="mx-auto max-w-5xl">
      <h2 className="text-3xl font-bold">{service.title}</h2>
      <p className="mt-5 text-lg leading-8">{service.description}</p>
      <h3 className="mt-8 text-xl font-bold">Who this service is for</h3>
      <p className="mt-3 leading-8">{service.audience}</p>
      <h3 className="mt-8 text-xl font-bold">What we can help organise</h3>
      <ul className="mt-4 list-inside list-disc space-y-3">{service.scope.map(item => <li key={item}>{item}</li>)}</ul>
      {persian !== path ? <Link href={persian} hrefLang="fa" lang="fa" className="mt-7 inline-block font-bold text-[#71551d] underline">اطلاعات این خدمت به زبان فارسی</Link> : null}
      <p className="mt-7 text-sm leading-7 text-slate-600">The service scope and fees are agreed in writing after an initial review. Outcomes are determined by the relevant authorities or independent providers. Regulated advice is coordinated with an appropriately licensed professional where required.</p>
    </div>
  </section>;
}
