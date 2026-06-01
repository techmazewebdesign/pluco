'use client';

import { motion } from 'framer-motion';
import { FileText, Globe, Shield, Users, RefreshCw, Search } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const servicesData = [
  { Icon: FileText, en: { title: 'Contract Drafting', desc: 'Professional drafting of international commercial agreements tailored to your specific transaction and jurisdiction.' }, fa: { title: 'تنظیم قرارداد', desc: 'تنظیم حرفه‌ای قراردادهای تجاری بین‌المللی متناسب با معامله و حوزه قضایی خاص شما.' } },
  { Icon: Search, en: { title: 'Contract Review', desc: 'Detailed review and redline comments on proposed agreements, identifying risks and recommending protective amendments.' }, fa: { title: 'بررسی قرارداد', desc: 'بررسی دقیق و اظهارنظر بر روی پیش‌نویس قراردادها، شناسایی ریسک‌ها و پیشنهاد اصلاحات حمایتی.' } },
  { Icon: Globe, en: { title: 'Cross-Border Transactions', desc: 'Legal support for complex international transactions including joint ventures, partnerships and commercial arrangements.' }, fa: { title: 'معاملات بین‌المللی', desc: 'پشتیبانی حقوقی برای معاملات پیچیده بین‌المللی شامل سرمایه‌گذاری مشترک، مشارکت‌ها و ترتیبات تجاری.' } },
  { Icon: Shield, en: { title: 'Risk Analysis', desc: 'Systematic identification and assessment of legal and commercial risks in proposed contracts and arrangements.' }, fa: { title: 'تحلیل ریسک', desc: 'شناسایی و ارزیابی سیستماتیک ریسک‌های حقوقی و تجاری در قراردادها و ترتیبات پیشنهادی.' } },
  { Icon: Users, en: { title: 'Negotiation Support', desc: 'Strategic negotiation assistance and drafting of counter-proposals to protect your legal and commercial position.' }, fa: { title: 'پشتیبانی مذاکره', desc: 'کمک استراتژیک در مذاکره و تنظیم پیشنهادهای متقابل برای حفاظت از موضع حقوقی و تجاری شما.' } },
  { Icon: RefreshCw, en: { title: 'Contract Monitoring', desc: 'Ongoing monitoring of contractual obligations, deadlines, renewals and performance conditions.' }, fa: { title: 'نظارت بر قرارداد', desc: 'نظارت مستمر بر تعهدات قراردادی، مهلت‌ها، تمدیدها و شرایط عملکرد.' } },
];

const contractTypes = {
  en: ['Service agreements', 'Consultancy agreements', 'Property-related contracts', 'International sale and purchase agreements', 'Joint venture agreements', 'Shareholder arrangements', 'Settlement agreements', 'Distribution agreements', 'Technology and IP agreements', 'Employment contracts'],
  fa: ['قراردادهای خدمات', 'قراردادهای مشاوره', 'قراردادهای مرتبط با ملک', 'قراردادهای بین‌المللی خرید و فروش', 'قراردادهای سرمایه‌گذاری مشترک', 'ترتیبات سهامداران', 'توافق‌نامه‌های سازش', 'قراردادهای توزیع', 'قراردادهای فناوری و مالکیت معنوی', 'قراردادهای استخدامی'],
};

const approachData = {
  en: [
    'International contracts carry risks that local agreements often do not. Choice of governing law, dispute resolution mechanisms, enforcement in multiple jurisdictions, currency risk, sanctions exposure and cross-border compliance requirements all need to be considered carefully.',
    'PLUCO GROUP drafts, reviews and negotiates international commercial agreements with a focus on legal precision, commercial protection and long-term enforceability. We advise private clients, entrepreneurs, investors and companies on the risks present in proposed contracts before signature, and help structure arrangements that protect their interests.',
    'Where specialist jurisdiction-specific advice is required, we coordinate with qualified local counsel in the relevant country to ensure that agreements are legally valid, enforceable and commercially appropriate in their intended jurisdiction.',
  ],
  fa: [
    'قراردادهای بین‌المللی ریسک‌هایی دارند که قراردادهای محلی اغلب از آنها برخوردار نیستند. انتخاب قانون حاکم، مکانیزم‌های حل اختلاف، اجرا در چندین حوزه قضایی، ریسک ارزی، مواجهه با تحریم‌ها و الزامات انطباق بین‌المللی همه نیاز به بررسی دقیق دارند.',
    'PLUCO GROUP قراردادهای تجاری بین‌المللی را با تمرکز بر دقت حقوقی، حمایت تجاری و قابلیت اجرای بلندمدت تنظیم، بررسی و مذاکره می‌کند. به موکلین خصوصی، کارآفرینان، سرمایه‌گذاران و شرکت‌ها در مورد ریسک‌های موجود در قراردادهای پیشنهادی قبل از امضا مشاوره می‌دهیم.',
    'در مواردی که مشاوره تخصصی در حوزه قضایی خاص مورد نیاز است، با وکلای محلی واجد شرایط در کشور مربوطه هماهنگی می‌کنیم تا اطمینان حاصل شود که قراردادها از نظر حقوقی معتبر، قابل اجرا و از نظر تجاری مناسب در حوزه قضایی مورد نظر هستند.',
  ],
};

export default function InternationalContracts() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'قراردادهای بین‌المللی' : 'INTERNATIONAL CONTRACTS'}
        title={isRTL ? 'قراردادهای بین‌المللی تنظیم، بررسی و مذاکره شده با دقت حقوقی' : 'Cross-Border Contracts Drafted, Reviewed and Negotiated with Legal Precision'}
        subtitle={isRTL ? 'PLUCO GROUP به موکلین خصوصی، کارآفرینان، سرمایه‌گذاران و شرکت‌ها در زمینه قراردادهای بین‌المللی، اسناد معاملاتی و مدیریت ریسک حقوقی کمک می‌کند.' : 'PLUCO GROUP assists private clients, entrepreneurs, investors and companies with international contracts, transaction documents and legal risk management.'}
      />

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'خدمات قراردادی' : 'Contract Services'}</h2>
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
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2" style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'انواع قراردادهایی که رسیدگی می‌کنیم' : 'Contract Types We Handle'}</h2>
            <div className="h-px w-20 mx-auto mt-3" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(isRTL ? contractTypes.fa : contractTypes.en).map((type, index) => (
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
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'رویکرد ما در قراردادهای بین‌المللی' : 'Our Approach to International Contracts'}</h2>
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

      <ConsultationCTA />
    </div>
  );
}
