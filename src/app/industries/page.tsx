'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Flame, Factory, Settings2, Wrench, Globe, Landmark, ArrowRight } from 'lucide-react';

const industries = [
  {
    Icon: Flame,
    name: 'Oil & Gas',
    description: 'Energy sector contract drafting, JV agreements, supply chain disputes, and regulatory compliance for upstream, midstream, and downstream operations.',
    areas: ['Production sharing agreements', 'Energy sector JV contracts', 'Supply and offtake agreements', 'Cross-border energy transactions'],
  },
  {
    Icon: Factory,
    name: 'Petrochemical Industry',
    description: 'Commercial and legal advisory for petrochemical manufacturers and traders, covering complex supply agreements, regulatory compliance, and commercial disputes.',
    areas: ['Long-term supply contracts', 'Trading agreements', 'Environmental compliance', 'Industrial dispute resolution'],
  },
  {
    Icon: Settings2,
    name: 'Machinery & Industrial Equipment',
    description: 'International contracts for machinery supply, installation, and maintenance, including export agreements, warranties, and product liability matters.',
    areas: ['Equipment supply contracts', 'Installation and service agreements', 'Export and import compliance', 'Warranty and liability disputes'],
  },
  {
    Icon: Wrench,
    name: 'Engineering & Technical Services',
    description: 'Contractual and legal support for engineering firms and technical service providers operating on complex international projects.',
    areas: ['Engineering services contracts', 'EPC and EPCM agreements', 'Subcontracting arrangements', 'Technical services disputes'],
  },
  {
    Icon: Globe,
    name: 'International Trade',
    description: 'Advisory on cross-border commercial transactions, trade finance, customs compliance, and international sales under CISG and other frameworks.',
    areas: ['International sale of goods', 'Trade finance and letters of credit', 'Customs and trade compliance', 'Incoterms and logistics contracts'],
  },
  {
    Icon: Landmark,
    name: 'Banking & Financial Services',
    description: 'Regulatory compliance, financial discrimination representation, and commercial legal support for banks, fintechs, and financial services businesses.',
    areas: ['Banking regulatory compliance', 'Fintech commercial agreements', 'Financial discrimination claims', 'Payment services and e-money'],
  },
];

export default function Industries() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>SECTORS WE COVER</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Industries We Serve</h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Deep sector knowledge across energy, industrial, trade, and financial services — delivering specialist legal and commercial advice tailored to your industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map(({ Icon, name, description, areas }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border border-gray-200 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow"
              >
                {/* Gold icon */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ border: '2px solid #C9A35A' }}>
                  <Icon className="w-7 h-7" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold font-serif mb-3" style={{ color: '#1E2430' }}>{name}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#5E6470' }}>{description}</p>
                <ul className="space-y-2">
                  {areas.map(area => (
                    <li key={area} className="flex items-start gap-2 text-xs" style={{ color: '#5E6470' }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#C9A35A' }} />
                      {area}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-5">Operating in One of These Sectors?</h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">
              Our team has the sector-specific knowledge to support your legal and commercial needs across international markets.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              Speak to Our Team <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
