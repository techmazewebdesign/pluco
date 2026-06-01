'use client';

import { motion } from 'framer-motion';
import { Landmark, Shield, FileText, AlertCircle, Lock, UserX, Globe, MessageSquare } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const servicesData = [
  {
    en: { title: 'Personal Bank Account Support', desc: 'Assistance with banking access issues, account applications, compliance questions and documentation for private individuals.' },
    fa: { title: 'پشتیبانی حساب بانکی شخصی', desc: 'کمک در مسائل دسترسی بانکی، درخواست حساب، سؤالات انطباق و مستندسازی برای افراد.' },
  },
  {
    en: { title: 'Corporate Bank Account Support', desc: 'Support for companies experiencing banking barriers, account opening challenges or excessive compliance questioning.' },
    fa: { title: 'پشتیبانی حساب بانکی شرکتی', desc: 'پشتیبانی برای شرکت‌هایی که با موانع بانکی، چالش‌های افتتاح حساب یا سؤالات بیش از حد انطباق مواجه هستند.' },
  },
  {
    en: { title: 'Banking Relationship Preparation', desc: 'Preparation of a professionally structured KYC/AML-compliant banking file to support new banking relationships.' },
    fa: { title: 'آماده‌سازی رابطه بانکی', desc: 'تهیه پرونده بانکی منطبق با KYC/AML برای پشتیبانی از روابط بانکی جدید.' },
  },
  {
    en: { title: 'Source-of-Funds Documentation', desc: 'Preparation of a legally defensible source-of-funds narrative and supporting document package for banking purposes.' },
    fa: { title: 'مستندسازی منبع وجوه', desc: 'تهیه روایت قابل دفاع حقوقی از منبع وجوه و بسته اسناد پشتیبان برای اهداف بانکی.' },
  },
  {
    en: { title: 'Source-of-Wealth Documentation', desc: 'Comprehensive source-of-wealth analysis and documentation for private clients with complex international financial histories.' },
    fa: { title: 'مستندسازی منبع ثروت', desc: 'تجزیه‌وتحلیل جامع منبع ثروت و مستندسازی برای موکلین خصوصی با سوابق مالی بین‌المللی پیچیده.' },
  },
  {
    en: { title: 'Frozen Accounts', desc: 'Strategic response to account freezes, asset blocks and restrictions imposed by financial institutions.' },
    fa: { title: 'حساب‌های مسدود', desc: 'پاسخ استراتژیک به انجماد حساب، مسدودیت دارایی و محدودیت‌های اعمال شده توسط مؤسسات مالی.' },
  },
  {
    en: { title: 'Account Closures', desc: 'Legal and compliance response to unilateral account closures, including communication strategy and documentation.' },
    fa: { title: 'بستن حساب‌ها', desc: 'پاسخ حقوقی و انطباقی به بستن یکطرفه حساب، از جمله استراتژی ارتباطی و مستندسازی.' },
  },
  {
    en: { title: 'Nationality-Related Banking Barriers', desc: 'Strategic support for clients experiencing banking exclusion related to their nationality, country of origin or political exposure.' },
    fa: { title: 'موانع بانکی مرتبط با ملیت', desc: 'پشتیبانی استراتژیک برای موکلینی که محرومیت بانکی مرتبط با ملیت، کشور مبدأ یا مواجهه سیاسی را تجربه می‌کنند.' },
  },
  {
    en: { title: 'Compliance Letters & Communication', desc: 'Preparation of professional legal and compliance correspondence to banks, regulators and financial institutions.' },
    fa: { title: 'مکاتبات انطباق', desc: 'تهیه مکاتبات حقوقی و انطباقی حرفه‌ای برای بانک‌ها، نهادهای نظارتی و مؤسسات مالی.' },
  },
  {
    en: { title: 'Banking Discrimination Strategy', desc: 'Legal strategy for clients experiencing systematic financial exclusion or discriminatory treatment by financial institutions.' },
    fa: { title: 'استراتژی تبعیض بانکی', desc: 'استراتژی حقوقی برای موکلینی که محرومیت مالی سیستماتیک یا رفتار تبعیض‌آمیز از سوی مؤسسات مالی را تجربه می‌کنند.' },
  },
];

const approachData = {
  en: [
    'Banking exclusion and financial discrimination are serious legal and human rights issues affecting internationally mobile individuals, entrepreneurs and families from certain jurisdictions. PLUCO GROUP has direct experience advising private clients on banking compliance, source-of-funds documentation and strategic responses to financial exclusion.',
    'Our work in this area includes preparing professionally structured compliance narratives, source-of-funds documentation, source-of-wealth analysis and banking communication packages designed to assist clients in navigating complex banking compliance processes in European financial institutions.',
    'We also advise on strategies for clients who have experienced frozen accounts, unilateral account closures or repeated refusals based on nationality or country of origin. Where legal challenge or formal complaint is appropriate, we coordinate with qualified litigators and regulators in the relevant jurisdiction.',
  ],
  fa: [
    'محرومیت بانکی و تبعیض مالی مسائل جدی حقوقی و حقوق بشری هستند که افراد متحرک بین‌المللی، کارآفرینان و خانواده‌هایی از برخی حوزه‌های قضایی را تحت تأثیر قرار می‌دهند. PLUCO GROUP تجربه مستقیم در مشاوره به موکلین خصوصی در زمینه انطباق بانکی، مستندسازی منبع وجوه و پاسخ‌های استراتژیک به محرومیت مالی دارد.',
    'کار ما در این حوزه شامل تهیه روایت‌های انطباق ساختاریافته حرفه‌ای، مستندسازی منبع وجوه، تحلیل منبع ثروت و بسته‌های ارتباطی بانکی است که برای کمک به موکلین در ناوبری فرآیندهای پیچیده انطباق بانکی در مؤسسات مالی اروپایی طراحی شده‌اند.',
    'همچنین در زمینه استراتژی‌هایی برای موکلینی که حساب‌های مسدود، بستن یکطرفه حساب یا رد مکرر بر اساس ملیت یا کشور مبدأ را تجربه کرده‌اند، مشاوره می‌دهیم. در مواردی که اعتراض حقوقی یا شکایت رسمی مناسب باشد، با وکلای دادگستری و نهادهای نظارتی در حوزه قضایی مربوطه هماهنگی می‌کنیم.',
  ],
};

export default function Banking() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'بانکداری و امور مالی' : 'BANKING & FINANCE'}
        title={isRTL ? 'پشتیبانی بانکداری بین‌المللی، انطباق و محرومیت مالی' : 'International Banking, Compliance and Financial Exclusion Support'}
        subtitle={isRTL ? 'PLUCO GROUP به موکلین خصوصی، کارآفرینان و شرکت‌ها در زمینه دسترسی بانکی، مستندات انطباق، حساب‌های مسدود، بستن حساب و محرومیت مالی مرتبط با ملیت کمک می‌کند.' : 'PLUCO GROUP assists private clients, entrepreneurs and companies with banking access, compliance documentation, frozen accounts, account closures and nationality-related financial exclusion.'}
      />

      <section className="py-12" style={{ backgroundColor: '#071C3C' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl md:text-2xl font-serif italic"
            style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}
          >
            {isRTL ? '«ملیت نباید به زندان مالی تبدیل شود.»' : '"Nationality should never become a financial prison."'}
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'خدمات بانکی و مالی' : 'Banking & Financial Services'}
            </h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-0.5 mx-auto mt-4" style={{ backgroundColor: '#C9A35A' }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesData.map((s, index) => (
              <motion.div
                key={s.en.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05, type: 'spring', stiffness: 100, damping: 15 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? s.fa.title : s.en.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? s.fa.desc : s.en.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'رویکرد ما در امور بانکی' : 'Our Approach to Banking Matters'}
            </h2>
            <div className="space-y-4">
              {(isRTL ? approachData.fa : approachData.en).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{para}</p>
              ))}
            </div>

            <div className="rounded-xl p-5 mt-8" style={{ backgroundColor: '#FFF8E8', border: '1px solid #E8C96A' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL
                    ? <><strong style={{ color: '#1E2430' }}>سلب مسئولیت: </strong>PLUCO GROUP به عنوان بانک عمل نمی‌کند و افتتاح حساب، بازگشایی حساب، آزادسازی وجوه یا تأیید بانک را تضمین نمی‌کند. تمامی تصمیمات بانکی تابع سیاست‌های داخلی و تعهدات قانونی مؤسسه مالی مربوطه می‌باشند.</>
                    : <><strong style={{ color: '#1E2430' }}>Disclaimer: </strong>PLUCO GROUP does not act as a bank and does not guarantee account opening, account reopening, fund release or bank approval. All bank decisions remain subject to the internal policies and legal obligations of the relevant financial institution.</>
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            {isRTL
              ? <><strong>سلب مسئولیت هزینه‌ها: </strong>حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند، مگر اینکه صریحاً به صورت کتبی توافق شده باشد.</>
              : <><strong>Global Fee Disclaimer: </strong>Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.</>
            }
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
