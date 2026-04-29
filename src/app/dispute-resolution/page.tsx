'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scale, MessageSquare, FileSearch, Handshake, ArrowRight } from 'lucide-react';

const services = [
  { Icon: Scale, title: 'Arbitration', description: 'Representation and strategic advisory in international and domestic arbitration proceedings under ICC, UNCITRAL, and other major rules.' },
  { Icon: MessageSquare, title: 'Mediation', description: 'Facilitated negotiation and mediation to resolve commercial disputes efficiently, preserving business relationships where possible.' },
  { Icon: FileSearch, title: 'Dispute Assessment', description: 'Early-stage analysis of disputes to evaluate merits, risks, and the most effective resolution strategy for your situation.' },
  { Icon: Handshake, title: 'Settlement Negotiation', description: 'Strategic negotiation of commercially advantageous settlements, avoiding the cost and uncertainty of prolonged litigation.' },
];

export default function DisputeResolution() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>OUR SERVICES</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Dispute Resolution &amp; Settlements</h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Strategic dispute assessment and resolution through negotiation, mediation or arbitration — protecting your commercial interests at every stage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-3xl font-serif mb-6" style={{ color: '#1E2430' }}>Commercial Disputes Require Precision</h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#5E6470' }}>
                <p>Cross-border commercial disputes carry significant financial and reputational stakes. Pluco Group provides expert dispute resolution services that combine strategic legal analysis with pragmatic commercial thinking.</p>
                <p>We act for businesses, financial institutions, and individuals in complex disputes involving international contracts, banking relationships, and commercial agreements — navigating multiple legal systems with confidence and rigour.</p>
                <p>Our approach prioritises your commercial objectives: whether that means achieving a swift negotiated settlement or pursuing robust enforcement through arbitration or litigation.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h3 className="text-2xl font-serif mb-6" style={{ color: '#1E2430' }}>Key Areas of Focus</h3>
              <ul className="space-y-4 text-sm" style={{ color: '#5E6470' }}>
                {['International contract disputes and enforcement', 'Cross-border commercial arbitration', 'Banking and financial services disputes', 'Supply chain and industrial contract disputes', 'Settlement negotiation and ADR', 'Enforcement of arbitral awards'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#C9A35A' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430' }}>How We Help</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(({ Icon, title, description }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ border: '2px solid #C9A35A' }}>
                  <Icon className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: '#1E2430' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5E6470' }}>{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430' }}>Our Approach</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Dispute Assessment', desc: 'Thorough analysis of the dispute, applicable law, and realistic outcomes' },
              { step: '02', title: 'Strategy Development', desc: 'Tailored strategy balancing commercial objectives and legal merits' },
              { step: '03', title: 'Resolution Process', desc: 'Representation through negotiation, mediation or arbitration' },
              { step: '04', title: 'Enforcement', desc: 'Ensuring awards and settlements are effectively enforced' },
            ].map(({ step, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-white font-bold" style={{ backgroundColor: '#C9A35A' }}>{step}</div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#1E2430' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5E6470' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-5">Facing a Commercial Dispute?</h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">Contact us for a confidential assessment of your dispute and strategic options.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              Request a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
