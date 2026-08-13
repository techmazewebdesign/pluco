'use client';

import { motion } from 'framer-motion';

// Note: Metadata moved to a separate file or handled differently since this is now a client component

export default function AboutUs() {
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
              About PLUCO GROUP
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              International legal insight. Commercial precision. Strategic protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-serif text-navy-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PLUCO GROUP SP. Z O.O. was founded to help internationally mobile clients organise complex legal, compliance and commercial decisions before they commit money, sign documents or begin a cross-border process.
                </p>
                <p>
                  Based in Warsaw, Poland, we provide cross-border advisory, documentation and professional coordination within a written scope. When local law or a matter requires licensed counsel or another regulated specialist, that role and jurisdiction are identified before the work begins.
                </p>
                <p>
                  Our named team brings together legal, compliance, documentation and international advisory experience. Public profiles explain each person’s stated role, languages and areas of work.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-serif text-navy-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our mission is to give clients a clear, documented process for understanding the facts, evidence, risks and professional responsibilities around an international matter.
                </p>
                <p>
                  Our mission is built on three core principles:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">International Legal Insight:</strong> Deep understanding of cross-border legal frameworks and regulatory environments.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">Commercial Precision:</strong> Business-focused solutions aligned with the documented objectives of each client.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong className="text-navy-900">Strategic Protection:</strong> Comprehensive risk management and protective legal frameworks.
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide our practice and define our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Excellence', description: 'Uncompromising commitment to quality and professional standards in all our services.' },
              { title: 'Integrity', description: 'Ethical practice and transparent communication in all client relationships.' },
              { title: 'Innovation', description: 'Creative solutions and forward-thinking approaches to complex legal challenges.' },
              { title: 'Partnership', description: 'Collaborative engagement with clients as trusted advisors and strategic partners.' }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-gold-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-serif text-navy-900 font-semibold mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4">Legal Entity</h3>
                <p className="text-gray-300">Pluco Group Sp. z o.o.</p>
                <p className="text-gray-300">Cross-Border Advisory & Professional Coordination</p>
                <p className="text-gray-300">KRS: 0000564904</p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4">Address</h3>
                <p className="text-gray-300">Ksawerów 3</p>
                <p className="text-gray-300">02-656 Warsaw, Poland</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
