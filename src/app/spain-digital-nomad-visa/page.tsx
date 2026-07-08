'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Users, Briefcase, Building2, Home, MapPin, Landmark, Shield } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import PrivateEnquiryFormModal from '@/components/shared/PrivateEnquiryFormModal';

const NAVY = '#071C3C';
const GOLD = '#C9A35A';
const INK = '#1E2430';
const BODY = '#5E6470';

const audiences = [
  { Icon: Briefcase, title: 'Remote Employees', description: 'Salaried professionals employed by a non-Spanish company who wish to relocate to Spain while continuing their employment remotely.' },
  { Icon: Users, title: 'Freelancers & Consultants', description: 'Independent professionals with a portfolio of clients based predominantly outside Spain who bill internationally.' },
  { Icon: Building2, title: 'Business Owners', description: 'Directors and shareholders of foreign companies whose management or advisory activity can be carried out remotely.' },
  { Icon: Home, title: 'Families', description: 'Principal applicants seeking to relocate with a spouse or partner and dependent children under a single application strategy.' },
];

const routes = [
  {
    Icon: MapPin,
    eyebrow: 'ROUTE 01',
    title: 'Consulate Application (Outside Spain)',
    description: 'Application lodged at the competent Spanish Consulate in the applicant\'s country of residence prior to travel, resulting in a national visa that permits entry and initial residence.',
    points: ['Filed before relocation', 'Processed by the consular section', 'Grants an initial national visa on approval', 'Generally suited to applicants planning their move in advance'],
  },
  {
    Icon: Landmark,
    eyebrow: 'ROUTE 02',
    title: 'In-Country Application (Within Spain)',
    description: 'Application submitted to the Spanish Large Business and Strategic Groups Unit (UGE) while the applicant is lawfully present in Spain, such as on a tourist stay.',
    points: ['Filed after arrival, subject to lawful stay', 'Processed centrally by the UGE', 'May offer a faster administrative timeline in eligible cases', 'Requires careful legal review of entry status and timing'],
  },
  {
    Icon: Users,
    eyebrow: 'ROUTE 03',
    title: 'Family Extension Applications',
    description: 'Dependent applications for spouses, partners and minor children linked to a principal applicant who meets the qualifying income and documentation conditions.',
    points: ['Filed alongside or following the principal application', 'Subject to dependency and income-sufficiency review', 'Coordinated documentation and translation strategy', 'Case-by-case assessment against current requirements'],
  },
];

const packages = [
  {
    tier: 'Bronze',
    tagline: 'Eligibility & Preparation',
    price: 'Main applicant: €3,150',
    familyPricing: ['First family member: €1,200', 'Each additional family member: €525'],
    accent: '#8C8F94',
    features: [
      'Initial eligibility review',
      'Route comparison (consulate vs in-country)',
      'Personalised document checklist',
      'Income and contract documentation guidance',
      'One coordination call with our team',
    ],
  },
  {
    tier: 'Silver',
    tagline: 'Guided Application Support',
    price: 'Main applicant: €7,175',
    familyPricing: ['First family member: €1,900', 'Each additional family member: €975'],
    accent: GOLD,
    featured: true,
    features: [
      'Everything in Bronze',
      'Full document review and file preparation',
      'Translation and certification coordination',
      'Application form preparation support',
      'Health insurance coordination',
      'Direct case-progress updates',
    ],
  },
  {
    tier: 'Gold',
    tagline: 'Full-Family Coordination',
    price: 'Main applicant: €8,050',
    familyPricing: ['First family member: on engagement', 'Each additional family member: on engagement'],
    accent: NAVY,
    features: [
      'Everything in Silver',
      'Family member applications coordinated together',
      'Source-of-funds and payment-trail documentation support',
      'Legal partner handoff for filing and representation',
      'Priority scheduling and dedicated case coordinator',
      'Post-approval settlement guidance',
    ],
  },
];

const SERVICE_NAME = 'Spain Digital Nomad Visa / Remote Residency Support';

export default function SpainDigitalNomadVisaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const openEnquiry = (tier?: string) => {
    setSelectedTier(tier || null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="SPAIN · DIGITAL NOMAD VISA"
        title="Spain Digital Nomad Visa Support Packages"
        subtitle="PLUCO GROUP provides structured preparation, documentation coordination and legal partner handoff for employees, freelancers, business owners and families considering Spain's remote-work residence route. We do not guarantee visa approval — every case is subject to eligibility review, applicable Spanish law and the discretion of the competent authorities."
      />

      {/* Who this is for */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>WHO THIS IS FOR</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK }}>Built for internationally mobile professionals and families</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map(({ Icon, title, description }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="border border-gray-200 rounded-xl p-6">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ border: `2px solid ${GOLD}` }}>
                  <Icon className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-serif font-bold mb-2" style={{ color: INK }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: BODY }}>{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three application routes */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>THREE APPLICATION ROUTES</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK }}>Choosing the right pathway for your circumstances</h2>
            <p className="text-sm leading-relaxed mt-4" style={{ color: BODY }}>The most suitable route depends on your current location, timeline and personal circumstances. Our team reviews each case individually before recommending a strategy.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {routes.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ border: `2px solid ${GOLD}` }}>
                  <r.Icon className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: GOLD }}>{r.eyebrow}</p>
                <h3 className="text-base font-serif font-bold mb-3" style={{ color: INK }}>{r.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: BODY }}>{r.description}</p>
                <ul className="text-xs space-y-2 mt-auto" style={{ color: '#374151' }}>
                  {r.points.map(p => (
                    <li key={p} className="flex items-start gap-2">
                      <span style={{ color: GOLD }}>·</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Package comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>PACKAGE COMPARISON</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK }}>Bronze, Silver and Gold support packages</h2>
            <p className="text-sm leading-relaxed mt-4" style={{ color: BODY }}>Packages describe the scope of preparation and coordination support provided by PLUCO GROUP. They do not represent a guarantee of any visa, residence or government outcome.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl p-8 flex flex-col"
                style={{
                  border: pkg.featured ? `2px solid ${GOLD}` : '1px solid #E5E7EB',
                  backgroundColor: pkg.featured ? '#FFFDF8' : '#FFFFFF',
                  boxShadow: pkg.featured ? '0 12px 30px rgba(201,163,90,0.18)' : 'none',
                }}
              >
                {pkg.featured && (
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Most Requested</p>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: pkg.accent }}>{pkg.tier}</p>
                <h3 className="text-xl font-serif font-bold mb-1" style={{ color: INK }}>{pkg.tagline}</h3>
                <p className="text-sm font-semibold mb-1" style={{ color: INK }}>{pkg.price}</p>
                <div className="mb-6">
                  {pkg.familyPricing.map(line => (
                    <p key={line} className="text-xs" style={{ color: BODY }}>{line}</p>
                  ))}
                </div>
                <ul className="text-sm space-y-3 mb-8 flex-grow">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} strokeWidth={2} />
                      <span style={{ color: '#374151' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openEnquiry(pkg.tier)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                  style={{
                    backgroundColor: pkg.featured ? GOLD : NAVY,
                    color: pkg.featured ? NAVY : '#FFFFFF',
                  }}
                >
                  Enquire About {pkg.tier}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <p className="text-xs leading-relaxed mt-8 p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
            <strong>Fee Disclaimer: </strong>All legal fees, government fees, translation fees, notary fees, insurance costs, bank charges, local counsel fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees for each package.
          </p>
        </div>
      </section>

      {/* Iran and international payment-trail support */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD }}>PAYMENT-TRAIL & SOURCE-OF-FUNDS SUPPORT</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: INK }}>Iran and international payment-trail support</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#374151' }}>
              <p>Applicants with income, savings or business ties connected to Iran or other jurisdictions subject to enhanced due diligence often face additional documentation requirements when demonstrating lawful income and source of funds to Spanish authorities and financial institutions.</p>
              <p>PLUCO GROUP supports clients in organising a coherent, verifiable payment trail — including income statements, banking records, corporate documentation and transfer records — for review by our team and, where required, handoff to independent Spanish legal and tax professionals and to sanctions-compliance specialists.</p>
              <p>This support is preparatory and advisory in nature. It does not remove or override any applicable sanctions regime, banking compliance requirement or regulatory screening. Every case is subject to independent sanctions screening, compliance review and the applicable rules of the relevant financial institutions and authorities, and PLUCO GROUP cannot guarantee that any bank, authority or institution will accept a given source-of-funds file.</p>
            </div>
            <ul className="text-sm space-y-2 mt-6" style={{ color: '#374151' }}>
              {[
                'Structured source-of-funds file preparation',
                'International payment and transfer documentation review',
                'Coordination with compliance and sanctions-screening specialists',
                'Coordination with independent banking and tax professionals',
                'Legal partner handoff for complex or cross-border structures',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: GOLD }}>·</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Spain application vs consulate application */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>COMPARISON</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK }}>Spain (in-country) application vs. consulate application</h2>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b-2" style={{ borderColor: GOLD }}>
                  <th className="py-3 pr-4 font-serif" style={{ color: INK }}>Consideration</th>
                  <th className="py-3 px-4 font-serif" style={{ color: INK }}>Consulate Application</th>
                  <th className="py-3 pl-4 font-serif" style={{ color: INK }}>Spain In-Country Application</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Filing location', 'Spanish Consulate abroad', 'UGE (Large Business Unit), Spain'],
                  ['Applicant location at filing', 'Outside Spain', 'Physically present in Spain, lawful stay'],
                  ['Typical use case', 'Planning relocation in advance', 'Already in Spain and reviewing options'],
                  ['Document legalisation', 'Generally home-country apostille/legalisation', 'May involve additional local verification'],
                  ['Outcome on approval', 'National visa, exchanged for residence card in Spain', 'Residence authorisation processed directly in Spain'],
                  ['Entry status risk', 'Lower — application precedes travel', 'Requires careful review of visa-free stay and status'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium" style={{ color: INK }}>{row[0]}</td>
                    <td className="py-3 px-4" style={{ color: BODY }}>{row[1]}</td>
                    <td className="py-3 pl-4" style={{ color: BODY }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed mt-6" style={{ color: '#64748B' }}>
            This comparison is provided for general orientation only. The most appropriate route depends on your nationality, current location, travel history and personal circumstances, and must be confirmed through an individual eligibility review.
          </p>
        </div>
      </section>

      {/* CTA form */}
      <section className="py-20" style={{ backgroundColor: NAVY }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">Start a confidential eligibility review</h2>
            <p className="text-sm max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#CBD5E0' }}>
              Share your situation and our team will review your circumstances against current Spanish Digital Nomad Visa requirements before recommending a package and route.
            </p>
            <button
              onClick={() => openEnquiry()}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Request Eligibility Review
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs mt-6" style={{ color: '#94A3B8' }}>
              Email: <a href="mailto:info@plucogroup.com" className="hover:text-white transition-colors">info@plucogroup.com</a> · Ksawerów 3, Warsaw, 02-656, Poland
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <LegalDisclaimer />
          <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
            <strong>Visa Outcome Disclaimer: </strong>PLUCO GROUP provides preparation, coordination and legal partner handoff services in connection with the Spain Digital Nomad Visa. We do not guarantee visa approval, residence, family inclusion, or any decision of the Spanish Consulate, the UGE, or any other government authority. All applications are subject to eligibility review, current Spanish immigration law, sanctions and compliance screening, and the sole discretion of the competent authorities. Tax implications of Spanish residence should be reviewed independently with qualified Spanish tax advisers.
          </p>
        </div>
      </section>

      <PrivateEnquiryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={SERVICE_NAME}
        defaultMessage={selectedTier ? `Package interest: ${selectedTier}` : undefined}
      />
    </div>
  );
}
