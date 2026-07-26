import type { Metadata } from 'next';

const VISA_SIGNAL_URL = 'https://visasignal-pluco.roozos.chatgpt.site';

export const metadata: Metadata = {
  title: 'VisaSignal Appointment Alerts',
  description:
    'Independent visa appointment availability alerts by PLUCO. Receive an alert, then log in and book yourself on the official provider website.',
  alternates: {
    canonical: 'https://www.plucogroup.com/visasignal',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'VisaSignal Appointment Alerts by PLUCO',
    description:
      'Stop refreshing. Be ready when a visa appointment slot appears.',
    url: 'https://www.plucogroup.com/visasignal',
    type: 'website',
    images: [`${VISA_SIGNAL_URL}/og.png`],
  },
};

export default function VisaSignalPage() {
  return (
    <main className="h-[100dvh] min-h-[720px] w-full bg-[#f7f5ef]">
      <iframe
        title="VisaSignal appointment alerts"
        src={VISA_SIGNAL_URL}
        className="h-full w-full border-0"
        allow="payment"
      />
      <noscript>
        <p className="p-6 text-center">
          VisaSignal needs JavaScript.{' '}
          <a className="underline" href={VISA_SIGNAL_URL}>
            Open VisaSignal directly
          </a>
          .
        </p>
      </noscript>
    </main>
  );
}
