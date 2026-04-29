'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Globe, Shield, Users, ArrowRight } from 'lucide-react';

export default function InternationalContracts() {
  const services = [
    {
      icon: FileText,
      title: 'Contract Drafting & Review',
      description: 'Comprehensive drafting and review of international commercial agreements tailored to your specific business needs and regulatory requirements.'
    },
    {
      icon: Globe,
      title: 'Cross-Border Transactions',
      description: 'Expert guidance on complex international transactions including mergers, acquisitions, and joint ventures across multiple jurisdictions.'
    },
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Strategic risk assessment and mitigation strategies for international contracts, including dispute resolution mechanisms and compliance frameworks.'
    },
    {
      icon: Users,
      title: 'Negotiation Support',
      description: 'Professional negotiation support and strategic advisory for complex international commercial agreements and partnerships.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>OUR SERVICES</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              International Contracts
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Sophisticated legal expertise for complex cross-border commercial agreements and international business transactions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg max-w-none"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-serif text-navy-900 mb-6">
                  Expert International Contract Services
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our international contract services provide comprehensive legal support for businesses operating across borders. We combine deep expertise in international law with practical commercial understanding to deliver solutions that protect your interests while facilitating successful business relationships.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're entering new markets, establishing international partnerships, or managing complex cross-border transactions, our team ensures your agreements are robust, compliant, and strategically aligned with your business objectives.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-serif text-navy-900 mb-6">
                  Key Areas of Focus
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">International Sales & Distribution:</strong> Cross-border sales agreements, distribution networks, and agency relationships
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">Licensing & Technology Transfer:</strong> International licensing agreements and intellectual property protection
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">Joint Ventures & Partnerships:</strong> Structuring international partnerships and joint venture agreements
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">Supply Chain Contracts:</strong> International supply agreements and procurement contracts
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-4">
              Our Contract Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive legal support for all aspects of international commercial contracting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-navy-100 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-navy-700" />
                </div>
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-4">
              Our Approach
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A systematic approach to international contract development and management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Needs Assessment', description: 'Understanding your business objectives and international requirements' },
              { step: '02', title: 'Risk Analysis', description: 'Identifying and mitigating potential legal and commercial risks' },
              { step: '03', title: 'Contract Development', description: 'Drafting tailored agreements that protect your interests' },
              { step: '04', title: 'Negotiation Support', description: 'Strategic guidance during contract negotiations' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Ready to Secure Your International Contracts?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss how we can help protect your interests in international business transactions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: '#C9A35A', color: '#071C3C' }}
            >
              Schedule a Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
