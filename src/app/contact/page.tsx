'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import ConsultationProcess from '@/components/sections/ConsultationProcess';
import DiscreetFirstContact from '@/components/sections/DiscreetFirstContact';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const inputStyle = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A35A] focus:border-[#C9A35A]';

export default function ContactPage() {
  const { isRTL } = useLanguage();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [mail, setMail] = useState('');
  const [tel, setTel] = useState('');
  const [corp, setCorp] = useState('');
  const [svc, setSvc] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    console.log('[FORM] Form submission started');
    setSending(true);
    setErr('');

    try {
      console.log('[FORM] Sending to /api/contact');
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${fName} ${lName}`,
          email: mail,
          phone: tel,
          currentCountry: corp,
          preferredLanguage: 'English',
          serviceNeeded: svc,
          shortCaseDescription: msg,
        }),
      });

      const data = await result.json();
      console.log('[FORM] Response received:', { status: result.status, data });

      if (result.ok && data.success) {
        console.log('[FORM] Success! Showing thank you message');
        setDone(true);
        setFName('');
        setLName('');
        setMail('');
        setTel('');
        setCorp('');
        setSvc('');
        setMsg('');
      } else {
        console.error('[FORM] Submission failed');
        setErr(data.error || 'Something went wrong. Please try again.');
      }
    } catch (e) {
      console.error('[FORM] Error:', e);
      setErr('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="pt-28 pb-14" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A' }}>GET IN TOUCH</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 max-w-2xl text-sm leading-relaxed">Ready to discuss your international legal and commercial needs? Reach out for a confidential consultation.</p>
          </motion.div>
        </div>
      </section>

      <ConsultationProcess />

      <section className="py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-2xl font-serif mb-8" style={{ color: '#1E2430' }}>Get in Touch</h2>
              <div className="space-y-7">
                {[
                  { Icon: Mail, title: 'Email', lines: ['info@plucogroup.com', 'General enquiries & consultations'] },
                  { Icon: MapPin, title: 'Office', lines: ['Ksawerów 3', '02-656 Warsaw, Poland', 'By appointment only'] },
                  { Icon: Clock, title: 'Business Hours', lines: ['Mon – Fri: 9:00 AM – 6:00 PM CET', 'International clients accommodated across time zones'] },
                ].map(({ Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                      <Icon className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: '#1E2430' }}>{title}</p>
                      {lines.map(l => <p key={l} className="text-xs leading-relaxed" style={{ color: '#5E6470' }}>{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              {done ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CheckCircle className="w-16 h-16 mb-6" style={{ color: '#C9A35A' }} />
                  <h3 className="text-2xl font-serif mb-3" style={{ color: '#1E2430' }}>Thank You</h3>
                  <p className="text-sm mb-6" style={{ color: '#5E6470' }}>Your enquiry has been received. Our team will contact you shortly.</p>
                  <button onClick={() => setDone(false)} className="text-xs font-semibold underline" style={{ color: '#C9A35A' }}>Send another message</button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-serif mb-2" style={{ color: '#1E2430' }}>Request a Consultation</h2>
                  <p className="text-xs mb-8" style={{ color: '#5E6470' }}>Fill in the form and we will be in touch within 24 hours.</p>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input type="text" placeholder="First Name *" required value={fName} onChange={e => setFName(e.target.value)} className={inputStyle} />
                      <input type="text" placeholder="Last Name *" required value={lName} onChange={e => setLName(e.target.value)} className={inputStyle} />
                    </div>
                    <input type="email" placeholder="Email Address *" required value={mail} onChange={e => setMail(e.target.value)} className={inputStyle} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input type="tel" placeholder="Phone Number" value={tel} onChange={e => setTel(e.target.value)} className={inputStyle} />
                      <input type="text" placeholder="Company / Organisation" value={corp} onChange={e => setCorp(e.target.value)} className={inputStyle} />
                    </div>
                    <select required value={svc} onChange={e => setSvc(e.target.value)} className={inputStyle}>
                      <option value="">Select a service *</option>
                      <option>International Contracts</option>
                      <option>Dispute Resolution & Settlements</option>
                      <option>Banking Compliance</option>
                      <option>Financial Discrimination</option>
                      <option>High-Tech Industrial Contracts</option>
                      <option>General Consultation</option>
                    </select>
                    <textarea placeholder="Please describe your legal or commercial needs..." required value={msg} onChange={e => setMsg(e.target.value)} rows={5} className={inputStyle} />
                    {err && <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' }}><p className="text-xs font-medium">{err}</p></div>}
                    <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: '#071C3C', color: '#FFFFFF' }}>
                      {sending ? 'Sending...' : 'Send Message'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <DiscreetFirstContact />
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  );
}
