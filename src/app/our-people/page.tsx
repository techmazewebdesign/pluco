'use client';

import { motion } from 'framer-motion';


const teamMembers = [
  {
    name: 'Senior Partner',
    title: 'Managing Partner',
    expertise: 'International Corporate Law & Cross-Border Transactions'
  },
  {
    name: 'Legal Director',
    title: 'Senior Legal Counsel',
    expertise: 'Banking Compliance & Financial Regulations'
  },
  {
    name: 'Commercial Advisor',
    title: 'Commercial Strategy Director',
    expertise: 'International Contracts & Risk Management'
  },
  {
    name: 'Dispute Specialist',
    title: 'Dispute Resolution Partner',
    expertise: 'International Dispute Resolution & Settlements'
  },
  {
    name: 'Compliance Officer',
    title: 'Regulatory Compliance Lead',
    expertise: 'Financial Discrimination & Equal Access Rights'
  },
  {
    name: 'Technology Counsel',
    title: 'High-Tech Contracts Specialist',
    expertise: 'Technology Agreements & IP Protection'
  }
];

export default function OurPeople() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-navy-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-navy-900 mb-6">
              Our People
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl leading-relaxed font-medium">
              A team of experienced professionals dedicated to providing exceptional legal and commercial advisory services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Our multidisciplinary team brings together extensive expertise in international law, commercial strategy, and regulatory compliance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto rounded-2xl bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="w-20 h-20 bg-navy-300 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-2">
                  {member.name}
                </h3>
                <p className="text-gold-600 font-medium mb-3">
                  {member.title}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {member.expertise}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-6">
              Our Approach
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
              We combine deep legal expertise with commercial acumen to deliver practical solutions for complex international business challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-gold-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-4">
                  Client-Focused
                </h3>
                <p className="text-gray-600">
                  Tailored solutions that align with your specific business objectives
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-gold-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-4">
                  Internationally Minded
                </h3>
                <p className="text-gray-600">
                  Global perspective with deep understanding of cross-border regulations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-gold-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-4">
                  Results-Driven
                </h3>
                <p className="text-gray-600">
                  Practical solutions that deliver measurable business outcomes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
