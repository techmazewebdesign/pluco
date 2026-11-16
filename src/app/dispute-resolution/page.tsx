'use client';

import { motion } from 'framer-motion';
import { Scale, MessageSquare, FileSearch, Handshake, Globe, FileText } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const servicesData = [
  {
    Icon: Scale,
    en: { title: 'Contractual Disputes', desc: 'Legal strategy and documentation for contractual disagreements, breaches and cross-border commercial conflicts.' },
    fa: { title: 'اختلافات قراردادی', desc: 'استراتژی حقوقی و مستندسازی برای اختلافات، نقض قرارداد و تعارضات تجاری بین‌المللی.' },
  },
  {
    Icon: FileSearch,
    en: { title: 'Dispute Assessment', desc: 'Early-stage analysis of the legal merits, risks and appropriate strategy for resolving a dispute efficiently.' },
    fa: { title: 'ارزیابی اختلاف', desc: 'تحلیل مرحله اولیه مزایای حقوقی، ریسک‌ها و استراتژی مناسب برای حل مؤثر اختلاف.' },
  },
  {
    Icon: MessageSquare,
    en: { title: 'Negotiation Support', desc: 'Strategic negotiation support and legal correspondence to achieve commercially sound resolutions.' },
    fa: { title: 'پشتیبانی مذاکره', desc: 'پشتیبانی استراتژیک مذاکره و مکاتبات حقوقی برای دستیابی به راه‌حل‌های تجاری معقول.' },
  },
  {
    Icon: Handshake,
    en: { title: 'Settlement Strategy', desc: 'Structuring and negotiating settlement agreements that protect client interests and provide long-term certainty.' },
    fa: { title: 'استراتژی سازش', desc: 'ساختاردهی و مذاکره توافق‌نامه‌های سازش که منافع موکل را حفظ کرده و قطعیت بلندمدت ایجاد می‌کنند.' },
  },
  {
    Icon: Globe,
    en: { title: 'Arbitration Coordination', desc: 'Support in preparing for international arbitration, including evidence organisation and coordination with specialist arbitration counsel.' },
    fa: { title: 'هماهنگی داوری', desc: 'پشتیبانی در آماده‌سازی برای داوری بین‌المللی، از جمله سازماندهی شواهد و هماهنگی با وکیل متخصص داوری.' },
  },
  {
    Icon: FileText,
    en: { title: 'Legal Correspondence', desc: 'Drafting of legal letters, formal notices, demands and compliance correspondence on behalf of private clients and businesses.' },
    fa: { title: 'مکاتبات حقوقی', desc: 'تنظیم نامه‌های حقوقی، اطلاعیه‌های رسمی، مطالبات و مکاتبات انطباقی از طرف موکلین خصوصی و مشاغل.' },
  },
];

const disputeTypes = {
  en: ['Contractual disputes', 'Banking disputes', 'Property disputes', 'Shareholder disputes', 'Business conflicts', 'Cross-border financial disputes', 'Settlement negotiations', 'Pre-litigation strategy', 'Evidence preparation', 'International arbitration support'],
  fa: ['اختلافات قراردادی', 'اختلافات بانکی', 'اختلافات ملکی', 'اختلافات سهامداران', 'تعارضات تجاری', 'اختلافات مالی بین‌المللی', 'مذاکرات سازش', 'استراتژی پیش از دادرسی', 'آماده‌سازی شواهد', 'پشتیبانی داوری بین‌المللی'],
};

const approachData = {
  en: [
    'PLUCO GROUP approaches dispute resolution with strategic calm, legal rigour and a focus on protecting our clients\' long-term interests. We understand that disputes — whether commercial, banking, property or personal — are often sensitive, time-critical and financially significant.',
    'Our role is to provide structured legal support: assessing the matter clearly, organising evidence effectively, drafting precise legal correspondence and coordinating specialist external counsel where litigation, arbitration or formal proceedings are required.',
    'For cross-border matters, we work with qualified litigators and arbitration specialists in relevant jurisdictions. Our primary focus is on protecting our clients\' position, achieving commercially realistic outcomes and preserving confidentiality throughout.',
  ],
  fa: [
    'PLUCO GROUP با آرامش استراتژیک، دقت حقوقی و تمرکز بر حفاظت از منافع بلندمدت موکلین به حل اختلاف می‌پردازد. ما درک می‌کنیم که اختلافات — چه تجاری، بانکی، ملکی یا شخصی — اغلب حساس، زمان‌بحرانی و از نظر مالی مهم هستند.',
    'نقش ما ارائه پشتیبانی حقوقی ساختاریافته است: ارزیابی روشن موضوع، سازماندهی مؤثر شواهد، تنظیم مکاتبات حقوقی دقیق و هماهنگی با وکلای متخصص خارجی در مواردی که دادرسی، داوری یا رسیدگی رسمی مورد نیاز است.',
    'برای مسائل بین‌المللی، با وکلای دادگستری واجد شرایط و متخصصان داوری در حوزه‌های قضایی مربوطه همکاری می‌کنیم. تمرکز اصلی ما بر حفاظت از موضع موکل، دستیابی به نتایج تجاری واقعی و حفظ محرمانگی در تمام مراحل است.',
  ],
};

export default function DisputeResolution() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'حل اختلاف' : 'DISPUTE RESOLUTION'}
        title={isRTL ? 'حل اختلاف استراتژیک برای امور موکلین خصوصی و تجاری بین‌المللی' : 'Strategic Dispute Resolution for Cross-Border Private Client and Business Matters'}
        subtitle={isRTL ? 'PLUCO GROUP از موکلین خصوصی، کارآفرینان و شرکت‌ها در حل اختلافات بین‌المللی حساس از طریق استراتژی حقوقی، مستندسازی و هماهنگی با مشاور متخصص پشتیبانی می‌کند.' : 'PLUCO GROUP supports private clients, entrepreneurs and companies in resolving sensitive international disputes through legal strategy, negotiation, documentation and coordination with specialist counsel where required.'}
      />

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'خدمات حل اختلاف ما' : 'Our Dispute Services'}
            </h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesData.map((s, index) => (
              <motion.div key={s.en.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ border: '2px solid #C9A35A' }}>
                  <s.Icon className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? s.fa.title : s.en.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{isRTL ? s.fa.desc : s.en.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#071C3C' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2" style={{ fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'موضوعاتی که رسیدگی می‌کنیم' : 'Matters We Handle'}
            </h2>
            <div className="h-px w-20 mx-auto mt-3" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(isRTL ? disputeTypes.fa : disputeTypes.en).map((type, index) => (
              <motion.div key={type} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} className="text-center py-3 px-3 rounded-lg text-xs font-medium" style={{ border: '1px solid #0B234A', color: '#CBD5E0', fontFamily: isRTL ? ff : undefined }}>
                {type}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'رویکرد ما' : 'Our Approach'}
            </h2>
            <div className="space-y-4">
              {(isRTL ? approachData.fa : approachData.en).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{para}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? <><strong>سلب مسئولیت هزینه‌ها: </strong>حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.</> : <><strong>Global Fee Disclaimer: </strong>Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.</>}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
