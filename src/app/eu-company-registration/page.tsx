'use client';

import { motion } from 'framer-motion';
import { Building2, FileText, Users, Landmark, Shield, Globe } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const servicesData = [
  { Icon: Globe,     en: { title: 'Jurisdiction Selection',         desc: 'Analysis of EU jurisdictions to identify the most suitable corporate domicile for your business objectives.' }, fa: { title: 'انتخاب حوزه قضایی', desc: 'تحلیل حوزه‌های قضایی اروپایی برای شناسایی مناسب‌ترین محل ثبت شرکت برای اهداف تجاری شما.' } },
  { Icon: Building2, en: { title: 'Company Registration',          desc: 'Coordination of the full company registration process, including government filings and registered address.' }, fa: { title: 'ثبت شرکت',          desc: 'هماهنگی فرآیند کامل ثبت شرکت شامل ثبت دولتی و آدرس ثبت‌شده.' } },
  { Icon: FileText,  en: { title: 'Articles of Association',        desc: 'Drafting and review of articles of association and corporate constitutional documents.' }, fa: { title: 'اساسنامه',            desc: 'تنظیم و بررسی اساسنامه و اسناد قانون اساسی شرکت.' } },
  { Icon: Users,     en: { title: 'Shareholder & Director Structuring', desc: 'Advisory on shareholder and director arrangements, including family structures and investor arrangements.' }, fa: { title: 'ساختار سهامداران و مدیران', desc: 'مشاوره در زمینه ترتیبات سهامداران و مدیران از جمله ساختارهای خانوادگی و ترتیبات سرمایه‌گذاری.' } },
  { Icon: Landmark,  en: { title: 'Corporate Bank Account Preparation', desc: 'Preparation of a banking-ready corporate file to support account opening with European financial institutions.' }, fa: { title: 'آماده‌سازی حساب بانکی شرکتی', desc: 'تهیه پرونده شرکتی آماده برای بانکداری جهت پشتیبانی از افتتاح حساب در مؤسسات مالی اروپایی.' } },
  { Icon: Shield,    en: { title: 'Ongoing Compliance Coordination', desc: 'Coordination of ongoing corporate compliance including annual filings, accounting, tax and regulatory requirements.' }, fa: { title: 'هماهنگی انطباق مستمر', desc: 'هماهنگی انطباق مستمر شرکتی شامل ثبت‌های سالانه، حسابداری، مالیات و الزامات نظارتی.' } },
];

const steps = {
  en: [
    { n: '01', title: 'Jurisdiction Selection',   desc: 'We assess your business objectives and identify the most suitable EU jurisdiction.' },
    { n: '02', title: 'Corporate Structure Planning', desc: 'We plan shareholder and director structure, share capital and constitutional framework.' },
    { n: '03', title: 'Document Preparation',     desc: 'We coordinate preparation and translation of all required corporate documents.' },
    { n: '04', title: 'Registration Coordination',desc: 'We coordinate filing and registration with the relevant authority, working with local counsel.' },
    { n: '05', title: 'Banking Preparation',       desc: 'We prepare your corporate banking file for presentation to European financial institutions.' },
    { n: '06', title: 'Post-Incorporation Support',desc: 'We provide ongoing coordination of compliance, accounting, tax and legal requirements.' },
  ],
  fa: [
    { n: '۰۱', title: 'انتخاب حوزه قضایی',      desc: 'اهداف تجاری شما را ارزیابی می‌کنیم و مناسب‌ترین حوزه قضایی اروپایی را شناسایی می‌کنیم.' },
    { n: '۰۲', title: 'برنامه‌ریزی ساختار شرکتی', desc: 'ساختار سهامداران و مدیران، سرمایه سهام و چارچوب قانون اساسی را برنامه‌ریزی می‌کنیم.' },
    { n: '۰۳', title: 'آماده‌سازی اسناد',          desc: 'آماده‌سازی و ترجمه تمامی اسناد شرکتی مورد نیاز را هماهنگ می‌کنیم.' },
    { n: '۰۴', title: 'هماهنگی ثبت',              desc: 'ثبت و پرونده را با مرجع مربوطه، با همکاری وکیل محلی، هماهنگ می‌کنیم.' },
    { n: '۰۵', title: 'آماده‌سازی بانکی',          desc: 'پرونده بانکی شرکتی شما را برای ارائه به مؤسسات مالی اروپایی آماده می‌کنیم.' },
    { n: '۰۶', title: 'پشتیبانی پس از ثبت',       desc: 'هماهنگی مستمر انطباق، حسابداری، مالیات و الزامات حقوقی را ارائه می‌دهیم.' },
  ],
};

const approach = {
  en: [
    'Establishing a company within the European Union provides access to the EU single market, IBAN banking, European commercial credibility and, in some cases, a platform for residence planning. PLUCO GROUP assists internationally mobile entrepreneurs and investors with the full process of EU company formation, with particular experience in Polish company registration.',
    'Poland is a leading EU jurisdiction for company formation, offering a well-established corporate legal framework, competitive formation costs and a commercially developed business environment. PLUCO GROUP coordinates the formation process with qualified Polish lawyers and accountants, ensuring compliance with Polish corporate, tax and registration law.',
    'A critical element of EU company formation for internationally mobile clients is banking. We prepare corporate banking files designed to meet the compliance requirements of European financial institutions, including source-of-funds documentation, business activity descriptions, corporate structure charts and AML/KYC supporting materials.',
  ],
  fa: [
    'تأسیس شرکت در اتحادیه اروپا دسترسی به بازار واحد اروپا، بانکداری IBAN، اعتبار تجاری اروپایی و در برخی موارد، بستری برای برنامه‌ریزی اقامت را فراهم می‌کند. PLUCO GROUP به کارآفرینان و سرمایه‌گذاران متحرک بین‌المللی در فرآیند کامل تأسیس شرکت در اروپا، با تجربه خاص در ثبت شرکت لهستانی کمک می‌کند.',
    'لهستان یکی از حوزه‌های قضایی پیشرو در اروپا برای تأسیس شرکت است و چارچوب حقوقی شرکتی مستقر، هزینه‌های تأسیس رقابتی و محیط تجاری توسعه‌یافته دارد. PLUCO GROUP فرآیند تأسیس را با وکلا و حسابداران لهستانی واجد شرایط هماهنگ می‌کند.',
    'یک عنصر حیاتی در تأسیس شرکت اروپایی برای موکلین متحرک بین‌المللی، بانکداری است. پرونده‌های بانکی شرکتی را آماده می‌کنیم که برای پاسخگویی به الزامات انطباق مؤسسات مالی اروپایی طراحی شده‌اند، از جمله مستندات منبع وجوه، توضیحات فعالیت تجاری، نمودارهای ساختار شرکتی و مواد پشتیبان AML/KYC.',
  ],
};

export default function EUCompanyRegistration() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'ثبت شرکت در اروپا' : 'EU COMPANY REGISTRATION'}
        title={isRTL ? 'تأسیس شرکت اروپایی و ساختاردهی شرکتی برای کارآفرینان بین‌المللی' : 'European Company Formation and Corporate Structuring for International Entrepreneurs'}
        subtitle={isRTL ? 'PLUCO GROUP به موکلین بین‌المللی در زمینه ثبت شرکت در اروپا، ساختاردهی شرکتی، آماده‌سازی اسناد، آمادگی بانکی و هماهنگی حقوقی پس از ثبت کمک می‌کند.' : 'PLUCO GROUP assists international clients with EU company registration, corporate structuring, document preparation, bank-readiness and post-incorporation legal coordination.'}
      />

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'خدمات شرکتی' : 'Corporate Services'}</h2>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2" style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'فرآیند ما' : 'Our Process'}</h2>
            <div className="h-px w-20 mx-auto mt-3" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isRTL ? steps.fa : steps.en).map((step, index) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }} className="p-6 rounded-xl" style={{ border: '1px solid #0B234A' }}>
                <p className="text-2xl font-serif font-bold mb-3" style={{ color: '#C9A35A' }}>{step.n}</p>
                <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: isRTL ? ff : undefined }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'ثبت شرکت اروپایی برای کارآفرینان بین‌المللی' : 'EU Company Registration for International Entrepreneurs'}</h2>
            <div className="space-y-4">
              {(isRTL ? approach.fa : approach.en).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{para}</p>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E5E7EB' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? <><strong style={{ color: '#1E2430' }}>سلب مسئولیت: </strong>PLUCO GROUP ممکن است تأسیس شرکت و ساختاردهی شرکتی را با وکلا، حسابداران و مشاوران مالیاتی محلی دارای مجوز در موارد ضروری هماهنگ کند. حق‌الوکاله، هزینه‌های دولتی، حق دفترخانه، هزینه‌های حسابداری، هزینه‌های ترجمه، هزینه‌های بانکی و هزینه‌های جانبی اضافی هستند.</>
                  : <><strong style={{ color: '#1E2430' }}>Disclaimer: </strong>PLUCO GROUP may coordinate company formation and corporate structuring with licensed local lawyers, accountants and tax advisers where required. Legal fees, government fees, notary fees, accounting fees, translation fees, bank fees and out-of-pocket expenses are additional.</>
                }
              </p>
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
