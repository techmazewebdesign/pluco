import AdvisoryHome from '@/components/home/AdvisoryHome';
import { createPageMetadata } from '@/lib/siteMetadata';

export const metadata = createPageMetadata({
  title: 'Pobyt w Europie i doradztwo transgraniczne | Pluco Group',
  description: 'Pluco Group pomaga rodzinom i przedsiębiorcom w sprawach pobytowych, bankowych, zakupu nieruchomości i rejestracji spółek w Europie.',
  path: '/pl',
});

export default function PolishHome() {
  return <AdvisoryHome locale="pl" />;
}
