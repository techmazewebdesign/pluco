'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserX, AlertCircle, Scale, Briefcase, ArrowRight } from 'lucide-react';

const services = [
  { Icon: UserX, title: 'Discriminatory Denial of Services', description: 'Representation of clients denied banking, financial, or commercial services on discriminatory or unjustified grounds.' },
  { Icon: AlertCircle, title: 'Unfair Treatment by Institutions', description: 'Challenge of unlawful, arbitrary, or disproportionate treatment by banks, payment providers, and financial institutions.' },
  { Icon: Scale, title: 'Regulatory Complaints & Proceedings', description: 'Preparation and management of complaints before regulatory bodies and competent authorities across jurisdictions.' },
  { Icon: Briefcase, title: 'Commercial Discrimination Claims', description: 'Legal action and strategic advisory for businesses subjected to discriminatory treatment in commercial relationships.' },
];

export default function FinancialDiscrimination() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>OUR SERVICES</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Financial Discrimination</h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Representation in matters of financial discrimination and unfair treatment by financial institutions — defending your rights with rigour and determination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-3xl font-serif mb-6" style={{ color: '#1E2430' }}>When Institutions Treat You Unfairly</h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#5E6470' }}>
                <p>Financial discrimination occurs when individuals or businesses are subjected to unjustified, disproportionate, or discriminatory treatment by banks, financial institutions, or regulated entities — including wrongful account closures, denial of services, or arbitrary application of compliance procedures.</p>
                <p>Pluco Group has specialist expertise in identifying, documenting, and challenging financial discrimination. We combine deep knowledge of banking regulation, anti-discrimination law, and commercial practice to build robust cases on behalf of our clients.</p>
                <p>Whether you have been wrongfully excluded from financial services, subjected to disproportionate AML measures, or treated discriminatorily in a commercial context, we provide strategic legal support to assert and enforce your rights.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h3 className="text-2xl font-serif mb-6" style={{ color: '#1E2430' }}>Common Situations We Address</h3>
              <ul className="space-y-4 text-sm" style={{ color: '#5E6470' }}>
                {[
                  'Wrongful account closure or freezing by banks',
                  'Denial of payment services without justification',
                  'Discriminatory application of AML/KYC procedures',
                  'Refusal of credit or financial products on improper grounds',
                  'Unequal treatment in commercial lending or financing',
                  'Regulatory complaints and supervisory authority proceedings',
                ].map(item => (
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

      {/* CTA */}
      <section className="py-20 text-white" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-5">Experiencing Financial Discrimination?</h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">Contact us in confidence. We will assess your situation and advise on the most effective course of action.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              Request a Confidential Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
