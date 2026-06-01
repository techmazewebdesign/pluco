'use client';

import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const feeDisclaimer = {
  en: 'Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.',
  fa: 'حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
};

const serviceCards = {
  en: [
    { title: 'Commonwealth of Dominica Citizenship by Investment', desc: 'A government-regulated Caribbean citizenship by investment route for qualified applicants seeking lawful second citizenship.', href: '#dominica' },
    { title: 'Vanuatu Second Passport', desc: 'A fast and discreet second citizenship pathway for eligible international families seeking lawful mobility and family protection.', href: '#vanuatu' },
    { title: 'Second Citizenship Strategy', desc: 'Strategic planning for second citizenship covering programme selection, compliance structure and long-term family protection.', href: '#strategy' },
    { title: 'Family Mobility Planning', desc: 'Coordinated identity, residency and mobility planning for families requiring greater international freedom and legal security.', href: '#family' },
    { title: 'Compliance & Source-of-Funds Review', desc: 'Preparation of a legally defensible source-of-funds and source-of-wealth file before any application or investment.', href: '#compliance' },
    { title: 'Alternative Residency & Nationality Pathways', desc: 'Assessment of alternative residence and nationality routes tailored to individual and family circumstances.', href: '#alternative' },
  ],
  fa: [
    { title: 'تابعیت مشترک‌المنافع دومینیکا از طریق سرمایه‌گذاری', desc: 'یک مسیر دریافت تابعیت کاریبی تحت نظارت دولت برای متقاضیان واجد شرایط که به دنبال تابعیت دوم قانونی هستند.', href: '#dominica' },
    { title: 'گذرنامه دوم وانواتو', desc: 'یک مسیر سریع و محرمانه برای تابعیت دوم برای خانواده‌های بین‌المللی واجد شرایط که به دنبال تحرک قانونی و حمایت خانوادگی هستند.', href: '#vanuatu' },
    { title: 'استراتژی تابعیت دوم', desc: 'برنامه‌ریزی استراتژیک برای تابعیت دوم شامل انتخاب برنامه، ساختار انطباق و حمایت بلندمدت خانوادگی.', href: '#strategy' },
    { title: 'برنامه‌ریزی تحرک خانوادگی', desc: 'برنامه‌ریزی هماهنگ هویت، اقامت و تحرک برای خانواده‌هایی که به آزادی بین‌المللی و امنیت حقوقی بیشتری نیاز دارند.', href: '#family' },
    { title: 'بررسی انطباق و منبع وجوه', desc: 'تهیه پرونده منبع وجوه و منبع ثروت قابل دفاع حقوقی قبل از هرگونه درخواست یا سرمایه‌گذاری.', href: '#compliance' },
    { title: 'مسیرهای جایگزین اقامت و ملیت', desc: 'ارزیابی مسیرهای جایگزین اقامت و ملیت متناسب با شرایط فردی و خانوادگی.', href: '#alternative' },
  ],
};

const dominica = {
  en: {
    label: 'CITIZENSHIP BY INVESTMENT',
    title: 'Commonwealth of Dominica Citizenship by Investment',
    body: [
      'The Commonwealth of Dominica maintains an established government-regulated Citizenship by Investment programme. Dominica\'s programme offers two principal investment routes: a contribution to the Economic Diversification Fund and an approved real estate investment route. Both routes are subject to official eligibility requirements, due diligence, background checks and the final decision of the competent Dominican authorities.',
      'Current minimum investment thresholds should be verified directly against the official Dominica Citizenship by Investment Unit and applicable regulations before any commitment is made. Official figures generally indicate minimum contributions from USD 200,000, depending on route and family structure; however, these amounts are subject to change and must be confirmed before engagement.',
      'All applicants are subject to enhanced due diligence and background review. Additional fees may apply, including due diligence fees, processing fees, government fees, passport fees and professional service fees. Processing timelines are not guaranteed. Citizenship approval is always subject to the decision of the competent Dominican authorities.',
    ],
    iranNote: 'Iranian national applicants may only be considered for this service where they have lived outside Iran for a substantial period, have their financial sources outside Iran, can fully evidence lawful source of funds outside Iran, and meet all enhanced due diligence and government eligibility requirements applicable at the time of application. Eligibility must be confirmed before any engagement or payment.',
    iranTitle: 'Important Note for Iranian National Applicants',
    servicesTitle: 'How PLUCO GROUP May Assist',
    services: ['Initial eligibility review', 'Family composition assessment', 'Source-of-funds and source-of-wealth documentation', 'Sanctions and compliance risk review', 'Coordination with authorised agents and local professionals', 'Document preparation and certified translation coordination', 'Family application planning', 'Post-approval document management'],
  },
  fa: {
    label: 'تابعیت از طریق سرمایه‌گذاری',
    title: 'تابعیت مشترک‌المنافع دومینیکا از طریق سرمایه‌گذاری',
    body: [
      'مشترک‌المنافع دومینیکا یک برنامه تابعیت از طریق سرمایه‌گذاری تحت نظارت دولت دارد. برنامه دومینیکا دو مسیر اصلی سرمایه‌گذاری ارائه می‌دهد: کمک به صندوق تنوع اقتصادی و مسیر سرمایه‌گذاری در مستغلات تأیید شده. هر دو مسیر تابع الزامات رسمی واجد شرایط بودن، بررسی دقیق، بررسی سوابق و تصمیم نهایی مقامات صالح دومینیکا هستند.',
      'آستانه‌های حداقل سرمایه‌گذاری فعلی باید مستقیماً با واحد رسمی تابعیت از طریق سرمایه‌گذاری دومینیکا و مقررات قابل اجرا قبل از هرگونه تعهد تأیید شوند. اعداد رسمی معمولاً حداقل کمک‌هایی از USD 200,000 را نشان می‌دهند، بسته به مسیر و ساختار خانوادگی.',
      'تمامی متقاضیان تابع بررسی دقیق و بررسی سوابق پیشرفته هستند. هزینه‌های اضافی ممکن است شامل هزینه‌های بررسی دقیق، هزینه‌های پردازش، هزینه‌های دولتی، هزینه‌های گذرنامه و هزینه‌های خدمات حرفه‌ای باشد. جداول زمانی پردازش تضمین نمی‌شوند.',
    ],
    iranNote: 'متقاضیان ایرانی تنها در صورتی می‌توانند برای این خدمت بررسی شوند که برای مدت قابل توجهی خارج از ایران زندگی کرده باشند، منابع مالی خود را خارج از ایران داشته باشند، بتوانند به طور کامل منبع قانونی وجوه خارج از ایران را اثبات کنند و تمامی الزامات بررسی دقیق پیشرفته و شرایط واجد بودن دولتی در زمان درخواست را برآورده کنند.',
    iranTitle: 'نکته مهم برای متقاضیان ایرانی',
    servicesTitle: 'روش‌های پشتیبانی PLUCO GROUP',
    services: ['بررسی اولیه واجد شرایط بودن', 'ارزیابی ترکیب خانوادگی', 'مستندسازی منبع وجوه و منبع ثروت', 'بررسی ریسک تحریم و انطباق', 'هماهنگی با عوامل مجاز و متخصصان محلی', 'آماده‌سازی اسناد و هماهنگی ترجمه رسمی', 'برنامه‌ریزی درخواست خانوادگی', 'مدیریت اسناد پس از تأیید'],
  },
};

const vanuatu = {
  en: {
    label: 'SECOND PASSPORT',
    title: 'Vanuatu Citizenship by Investment for International Families and Private Clients',
    body: [
      'Vanuatu offers a citizenship investment framework for qualified foreign applicants seeking second citizenship through an official government-regulated process. The programme may be suitable for internationally mobile individuals, entrepreneurs and families who require alternative citizenship planning, greater international mobility, family security, asset and lifestyle diversification or lawful second passport strategy.',
      'All applications are subject to due diligence, government review and final approval by the competent authorities of Vanuatu. The following figures are indicative only and must be verified against current official Vanuatu Citizenship Office guidance before any engagement or payment.',
    ],
    amounts: [['Single applicant', 'from USD 130,000'], ['Married couple', 'from USD 150,000'], ['Married couple + 1 child', 'from USD 165,000'], ['Married couple + 2 children', 'from USD 180,000'], ['Additional applicant', 'USD 10,000'], ['FIU due diligence fee', 'USD 5,000']],
    amountNote: 'All figures must be verified with the official Vanuatu Citizenship Office, authorised agents and applicable regulations before any client engagement, payment or application. No benefit, travel access, processing time or approval should be guaranteed.',
    iranNote: 'This service may be available for Iranian national applicants, subject to enhanced due diligence, government eligibility rules and case-by-case approval. Iranian applicants must be able to fully demonstrate lawful source of funds, clear banking history, transparent international financial activity and compliance with all applicable sanctions, banking and government requirements. Iranian national applicants should not transfer funds, sign any investment document or proceed with an application before PLUCO GROUP and the relevant authorised professionals have completed a preliminary eligibility and compliance review.',
    iranTitle: 'Important Note for Iranian National Applicants',
    servicesTitle: 'How PLUCO GROUP May Assist',
    services: ['Initial eligibility review', 'Family application strategy', 'Source-of-funds and source-of-wealth analysis', 'Banking and sanctions-risk review', 'Preparation of a compliance-ready client file', 'Coordination with authorised agents and local professionals', 'Document checklist and document handling', 'Certified translation coordination', 'Application timeline planning', 'Post-approval document management'],
    feeNote: 'Legal fees, government fees, FIU due diligence fees, authorised agent fees, passport fees, bank charges, translation fees, courier fees, certification fees and out-of-pocket expenses will be added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.',
    legalNote: 'The information on this page is provided for general informational purposes only and does not constitute legal, immigration, tax, investment or financial advice. Vanuatu citizenship applications are subject to official eligibility rules, due diligence, source-of-funds review, government approval and applicable law. PLUCO GROUP does not guarantee approval, processing time, passport issuance, visa-free access or any particular legal outcome.',
  },
  fa: {
    label: 'گذرنامه دوم',
    title: 'تابعیت وانواتو از طریق سرمایه‌گذاری برای خانواده‌های بین‌المللی و موکلین خصوصی',
    body: [
      'وانواتو یک چارچوب سرمایه‌گذاری تابعیت برای متقاضیان خارجی واجد شرایط که به دنبال تابعیت دوم از طریق فرآیند رسمی تحت نظارت دولت هستند، ارائه می‌دهد. این برنامه ممکن است برای افراد متحرک بین‌المللی، کارآفرینان و خانواده‌هایی که به برنامه‌ریزی تابعیت جایگزین، تحرک بین‌المللی بیشتر، امنیت خانوادگی یا استراتژی گذرنامه دوم قانونی نیاز دارند، مناسب باشد.',
      'تمامی درخواست‌ها تابع بررسی دقیق، بررسی دولتی و تأیید نهایی توسط مقامات صالح وانواتو هستند. ارقام زیر صرفاً جنبه راهنمایی دارند و باید قبل از هرگونه تعامل یا پرداخت با راهنمایی فعلی دفتر تابعیت وانواتو تأیید شوند.',
    ],
    amounts: [['متقاضی مجرد', 'از USD 130,000'], ['زوج متأهل', 'از USD 150,000'], ['زوج + ۱ فرزند', 'از USD 165,000'], ['زوج + ۲ فرزند', 'از USD 180,000'], ['متقاضی اضافی', 'USD 10,000'], ['هزینه بررسی دقیق FIU', 'USD 5,000']],
    amountNote: 'تمامی ارقام باید قبل از هرگونه تعامل با موکل، پرداخت یا درخواست با دفتر رسمی تابعیت وانواتو، عوامل مجاز و مقررات قابل اجرا تأیید شوند. هیچ مزیت، دسترسی به سفر، مدت زمان پردازش یا تأییدی نباید تضمین شود.',
    iranNote: 'این خدمت ممکن است برای متقاضیان ایرانی در صورت بررسی دقیق پیشرفته، قوانین واجد بودن دولتی و تأیید موردی در دسترس باشد. متقاضیان ایرانی باید بتوانند منبع قانونی وجوه، سابقه بانکی شفاف، فعالیت مالی بین‌المللی شفاف و رعایت کلیه الزامات تحریم، بانکی و دولتی قابل اجرا را به طور کامل اثبات کنند. متقاضیان ایرانی نباید قبل از تکمیل بررسی اولیه واجد شرایط بودن و انطباق توسط PLUCO GROUP وجوه منتقل، سندی امضا یا درخواستی ارائه دهند.',
    iranTitle: 'نکته مهم برای متقاضیان ایرانی',
    servicesTitle: 'روش‌های پشتیبانی PLUCO GROUP',
    services: ['بررسی اولیه واجد شرایط بودن', 'استراتژی درخواست خانوادگی', 'تجزیه‌وتحلیل منبع وجوه و منبع ثروت', 'بررسی ریسک بانکی و تحریم', 'آماده‌سازی پرونده موکل انطباق‌محور', 'هماهنگی با عوامل مجاز و متخصصان محلی', 'چک‌لیست و مدیریت اسناد', 'هماهنگی ترجمه رسمی', 'برنامه‌ریزی جدول زمانی درخواست', 'مدیریت اسناد پس از تأیید'],
    feeNote: 'حق‌الوکاله، هزینه‌های دولتی، هزینه‌های بررسی دقیق FIU، هزینه‌های عامل مجاز، هزینه‌های گذرنامه، کارمزد بانک، هزینه‌های ترجمه، هزینه‌های پیک، هزینه‌های گواهی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    legalNote: 'اطلاعات این صفحه صرفاً برای اهداف اطلاع‌رسانی عمومی ارائه شده و مشاوره حقوقی، مهاجرتی، مالیاتی، سرمایه‌گذاری یا مالی محسوب نمی‌شود. درخواست‌های تابعیت وانواتو تابع قوانین رسمی واجد شرایط بودن، بررسی دقیق، بررسی منبع وجوه، تأیید دولتی و قانون قابل اجرا هستند. PLUCO GROUP تأیید، مدت زمان پردازش، صدور گذرنامه، دسترسی بدون ویزا یا هیچ نتیجه حقوقی خاصی را تضمین نمی‌کند.',
  },
};

export default function NewIdentity() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const dom = isRTL ? dominica.fa : dominica.en;
  const van = isRTL ? vanuatu.fa : vanuatu.en;
  const cards = isRTL ? serviceCards.fa : serviceCards.en;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'برنامه‌ریزی هویت' : 'IDENTITY PLANNING'}
        title={isRTL ? 'برنامه‌ریزی قانونی هویت، تحرک و تابعیت دوم برای خانواده‌های بین‌المللی' : 'Lawful Identity, Mobility and Second Citizenship Planning for International Families'}
        subtitle={isRTL ? 'PLUCO GROUP به افراد و خانواده‌های متحرک بین‌المللی در برنامه‌ریزی قانونی تابعیت دوم، اقامت و هویت بین‌المللی با تمرکز بر رازداری، انطباق، مستندسازی منبع وجوه و حمایت بلندمدت خانوادگی کمک می‌کند.' : 'PLUCO GROUP assists internationally mobile individuals and families with lawful second citizenship, residency and international identity planning, with a focus on discretion, compliance, source-of-funds documentation and long-term family protection.'}
      />

      {/* Cards */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((s, index) => (
              <motion.div key={s.href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group flex flex-col">
                <h3 className="text-base font-serif font-bold mb-3 group-hover:text-[#C9A35A] transition-colors" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{s.title}</h3>
                <p className="text-sm leading-relaxed flex-grow mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{s.desc}</p>
                <a href={s.href} className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#C9A35A' }}>
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'بیشتر بدانید' : 'Learn More'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dominica */}
      <section id="dominica" className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{dom.label}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{dom.title}</h2>
            <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
            {dom.body.map((p, i) => <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{p}</p>)}
            <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: '#FFF8E8', border: '1px solid #E8C96A' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{dom.iranTitle}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{dom.iranNote}</p>
                </div>
              </div>
            </div>
            <h3 className="text-base font-serif font-semibold mb-3" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{dom.servicesTitle}</h3>
            <ul className="text-sm space-y-1.5 mb-6" style={{ color: '#374151' }}>
              {dom.services.map(item => <li key={item} className="flex items-start gap-2"><span style={{ color: '#C9A35A' }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span></li>)}
            </ul>
            <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
              <strong>{isRTL ? 'سلب مسئولیت هزینه‌ها: ' : 'Fee Disclaimer: '}</strong>{isRTL ? feeDisclaimer.fa : feeDisclaimer.en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vanuatu */}
      <section id="vanuatu" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{van.label}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{van.title}</h2>
            <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
            {van.body.map((p, i) => <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{p}</p>)}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {van.amounts.map(([label, amount]) => (
                <div key={label} className="border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#C9A35A' }}>{amount}</p>
                  <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mb-6 italic" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{van.amountNote}</p>

            <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: '#FFF8E8', border: '1px solid #E8C96A' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{van.iranTitle}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{van.iranNote}</p>
                </div>
              </div>
            </div>

            <h3 className="text-base font-serif font-semibold mb-3" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{van.servicesTitle}</h3>
            <ul className="text-sm space-y-1.5 mb-6" style={{ color: '#374151' }}>
              {van.services.map(item => <li key={item} className="flex items-start gap-2"><span style={{ color: '#C9A35A' }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span></li>)}
            </ul>
            <p className="text-xs leading-relaxed p-4 rounded-lg mb-4" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
              <strong>{isRTL ? 'سلب مسئولیت هزینه‌ها: ' : 'Fee Disclaimer: '}</strong>{van.feeNote}
            </p>
            <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
              <strong>{isRTL ? 'سلب مسئولیت حقوقی: ' : 'Legal Disclaimer: '}</strong>{van.legalNote}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{isRTL ? 'سلب مسئولیت هزینه‌ها: ' : 'Global Fee Disclaimer: '}</strong>{isRTL ? feeDisclaimer.fa : feeDisclaimer.en}
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
