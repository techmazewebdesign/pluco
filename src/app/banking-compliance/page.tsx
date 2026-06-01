'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Landmark, ShieldCheck, FileText, BarChart3, ArrowRight } from 'lucide-react';

const services = [
  { Icon: ShieldCheck, title: 'Regulatory Compliance', description: 'Advisory on banking regulations, AML/KYC requirements, and financial services governance frameworks across jurisdictions.' },
  { Icon: Landmark, title: 'Banking Relationships', description: 'Assistance with establishing, maintaining, and defending client rights in relationships with banks and financial institutions.' },
  { Icon: FileText, title: 'Compliance Frameworks', description: 'Development and review of internal compliance programmes, policies, and procedures for financial institutions and corporates.' },
  { Icon: BarChart3, title: 'Regulatory Risk Assessment', description: 'Identification and analysis of regulatory risks in complex financial transactions and cross-border operations.' },
];

export default function BankingCompliance() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>OUR SERVICES</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Banking Compliance</h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Advisory on regulatory compliance, risk frameworks and governance for businesses and financial institutions operating internationally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-3xl font-serif mb-6" style={{ color: '#1E2430' }}>Navigating the Regulatory Landscape</h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#5E6470' }}>
                <p>Banking regulation has become increasingly complex across international markets. Businesses operating across borders face a constantly evolving web of compliance requirements that carry significant legal and financial consequences if not properly managed.</p>
                <p>Pluco Group provides practical, commercially-oriented banking compliance advisory — helping clients understand their regulatory obligations, build robust compliance frameworks, and defend their rights when institutions apply rules improperly or unfairly.</p>
                <p>We work with both financial institutions seeking to maintain regulatory compliance and businesses challenging unjust treatment by banks or financial regulators.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h3 className="text-2xl font-serif mb-6" style={{ color: '#1E2430' }}>Key Areas of Focus</h3>
              <ul className="space-y-4 text-sm" style={{ color: '#5E6470' }}>
                {['AML/KYC compliance advisory', 'Banking regulatory frameworks (EU, UK, international)', 'Account freezing, blocking and termination disputes', 'Payment services regulation', 'Cross-border financial compliance', 'Internal compliance programme development'].map(item => (
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
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-5">Need Banking Compliance Advice?</h2>
            <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">Speak with our team about your regulatory obligations or challenges with financial institutions.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}>
              Request a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
