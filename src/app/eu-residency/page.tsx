'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const programmes = [
  {
    id: 'france',
    en: {
      eyebrow: 'FRANCE', cardTitle: 'France Talent Passport',
      cardShort: 'For entrepreneurs, investors, innovators and senior professionals seeking a multi-year French residence route connected to business, innovation or professional activity.',
      title: 'France Talent Passport',
      body: [
        'France is a major EU and Schengen member state offering an internationally recognised quality of life, legal system and business environment. The Talent Passport (Passeport Talent) is a category of residence permit for qualified non-EU applicants who meet the relevant criteria.',
        'The permit may cover a range of categories including business investors, business creators, innovative project founders and senior professionals with qualifying employment. Where conditions are met, the Talent Passport may provide a multi-year residence permit, generally up to four years depending on category, and may be renewed subject to continued compliance with applicable conditions.',
        'Family inclusion for a spouse and minor children may be available for eligible applicants. There is no automatic guarantee of permanent residence or French nationality. Long-term residence planning towards permanent residence or nationality may be possible, subject to compliance with residence, integration, language and other legal requirements applicable at the time.',
      ],
      services: ['Eligibility review and category selection', 'Business plan coordination', 'Financial documentation review', 'KYC/AML file preparation', 'Coordination with French legal professionals', 'Family relocation planning', 'Document preparation and translation coordination'],
      fee: 'All legal fees, government fees, translation fees, company formation fees, banking charges, local counsel fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    },
    fa: {
      eyebrow: 'فرانسه', cardTitle: 'پاسپورت استعداد فرانسه',
      cardShort: 'برای کارآفرینان، سرمایه‌گذاران، نوآوران و متخصصان ارشد که به دنبال مسیر اقامت چند ساله فرانسه مرتبط با فعالیت تجاری، نوآوری یا حرفه‌ای هستند.',
      title: 'پاسپورت استعداد فرانسه (Passeport Talent)',
      body: [
        'فرانسه یکی از اعضای اصلی اتحادیه اروپا و منطقه شنگن است که کیفیت زندگی، سیستم حقوقی و محیط تجاری با شهرت بین‌المللی ارائه می‌دهد. پاسپورت استعداد (Passeport Talent) یک دسته از مجوز اقامت برای متقاضیان غیر اروپایی واجد شرایط است.',
        'این مجوز ممکن است طیفی از دسته‌ها از جمله سرمایه‌گذاران تجاری، سازندگان کسب‌وکار، بنیان‌گذاران پروژه‌های نوآورانه و متخصصان ارشد با اشتغال واجد شرایط را پوشش دهد. در صورت رعایت شرایط، پاسپورت استعداد ممکن است مجوز اقامت چند ساله، معمولاً تا چهار سال بسته به دسته، ارائه دهد.',
        'الحاق خانواده برای همسر و فرزندان صغیر ممکن است برای متقاضیان واجد شرایط در دسترس باشد. هیچ تضمین خودکاری برای اقامت دائم یا ملیت فرانسوی وجود ندارد.',
      ],
      services: ['بررسی واجد شرایط بودن و انتخاب دسته', 'هماهنگی طرح تجاری', 'بررسی مستندات مالی', 'آماده‌سازی پرونده KYC/AML', 'هماهنگی با متخصصان حقوقی فرانسوی', 'برنامه‌ریزی جابجایی خانوادگی', 'آماده‌سازی اسناد و هماهنگی ترجمه'],
      fee: 'کلیه حق‌الوکاله، هزینه‌های دولتی، هزینه‌های ترجمه، هزینه‌های تأسیس شرکت، کارمزد بانکی، هزینه‌های وکیل محلی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    },
  },
  {
    id: 'spain',
    en: {
      eyebrow: 'SPAIN', cardTitle: 'Spain Digital Nomad Residency',
      cardShort: 'For remote professionals, entrepreneurs, freelancers and international business owners who wish to live in Spain while working mainly for clients or companies outside Spain.',
      title: 'Spain Digital Nomad Residency',
      body: [
        "Spain's Digital Nomad Visa is designed for non-EU nationals who carry out remote or telework activity for companies or clients based primarily outside Spain. The route is suitable for consultants, technology professionals, freelancers, online business owners, directors and globally mobile families seeking to establish a life in Spain.",
        'Income must generally be generated predominantly from outside Spain. Income thresholds, documentation requirements and eligibility criteria must be checked against current Spanish legal provisions before any application. Family members may be included where the principal applicant meets the required income conditions.',
        'Tax implications of Spanish residence should be reviewed independently by qualified Spanish tax advisers before any decision is made. Long-term residence planning, Schengen mobility and quality-of-life access may all be relevant considerations for internationally mobile clients.',
      ],
      services: ['Remote work eligibility review', 'Contract and income documentation', 'Family planning', 'Health insurance coordination', 'Translation review', 'Local adviser coordination', 'Submission strategy'],
      fee: 'All legal fees, government fees, translation fees, tax adviser fees, insurance costs, bank charges and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    },
    fa: {
      eyebrow: 'اسپانیا', cardTitle: 'اقامت نومد دیجیتال اسپانیا',
      cardShort: 'برای متخصصان دورکار، کارآفرینان، فریلنسرها و صاحبان کسب‌وکارهای بین‌المللی که مایلند در اسپانیا زندگی کنند و عمدتاً برای مشتریان یا شرکت‌های خارج از اسپانیا کار کنند.',
      title: 'اقامت نومد دیجیتال اسپانیا',
      body: [
        'ویزای نومد دیجیتال اسپانیا برای اتباع غیر اروپایی طراحی شده که فعالیت دورکاری یا تله‌ورک برای شرکت‌ها یا مشتریانی که عمدتاً خارج از اسپانیا مستقر هستند انجام می‌دهند. این مسیر برای مشاوران، متخصصان فناوری، فریلنسرها، صاحبان کسب‌وکارهای آنلاین، مدیران و خانواده‌های متحرک جهانی که به دنبال استقرار در اسپانیا هستند مناسب است.',
        'درآمد باید عمدتاً از خارج از اسپانیا تولید شود. آستانه‌های درآمد، الزامات مستندسازی و معیارهای واجد شرایط بودن باید قبل از هر درخواستی با مقررات حقوقی فعلی اسپانیا بررسی شوند.',
        'پیامدهای مالیاتی اقامت اسپانیایی باید به طور مستقل توسط مشاوران مالیاتی اسپانیایی واجد شرایط قبل از هر تصمیمی بررسی شوند.',
      ],
      services: ['بررسی واجد شرایط بودن دورکاری', 'مستندسازی قرارداد و درآمد', 'برنامه‌ریزی خانوادگی', 'هماهنگی بیمه درمانی', 'بررسی ترجمه', 'هماهنگی مشاور محلی', 'استراتژی ارائه درخواست'],
      fee: 'کلیه حق‌الوکاله، هزینه‌های دولتی، هزینه‌های ترجمه، هزینه‌های مشاور مالیاتی، هزینه‌های بیمه، کارمزد بانکی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    },
  },
  {
    id: 'greece-fip',
    en: {
      eyebrow: 'GREECE', cardTitle: 'Greece Financially Independent Person Visa',
      cardShort: 'For financially independent individuals and families who can support themselves through lawful income or assets from outside Greece without working locally.',
      title: 'Greece Financially Independent Person Visa',
      body: [
        'Greece offers a long-term residence route for non-EU nationals with sufficient independent financial resources. The Financially Independent Person (FIP) visa is suitable for retirees, investors, financially independent families and private clients with adequate passive income or savings.',
        'Applicants must normally demonstrate lawful external income or sufficient financial means to support themselves and any dependants without engaging in local employment. Employment or active business activity in Greece may be restricted depending on the specific permit category and applicable rules.',
        'Family members may be included subject to financial thresholds and applicable eligibility requirements. Greek residence may offer Schengen mobility and access to the Greek lifestyle and business environment.',
      ],
      services: ['Financial eligibility review', 'Source-of-funds documentation', 'Accommodation planning', 'Health insurance coordination', 'Family document preparation', 'Translation and certification', 'Local adviser coordination'],
      fee: 'All legal fees, government fees, translation fees, insurance costs, local counsel fees, bank charges and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    },
    fa: {
      eyebrow: 'یونان', cardTitle: 'ویزای شخص مستقل از نظر مالی یونان',
      cardShort: 'برای افراد و خانواده‌های مستقل از نظر مالی که می‌توانند از طریق درآمد یا دارایی‌های قانونی خارج از یونان بدون کار محلی امرار معاش کنند.',
      title: 'ویزای شخص مستقل از نظر مالی یونان (FIP)',
      body: [
        'یونان یک مسیر اقامت بلندمدت برای اتباع غیر اروپایی با منابع مالی مستقل کافی ارائه می‌دهد. ویزای شخص مستقل از نظر مالی (FIP) برای بازنشستگان، سرمایه‌گذاران، خانواده‌های مستقل از نظر مالی و موکلین خصوصی با درآمد غیرفعال یا پس‌انداز کافی مناسب است.',
        'متقاضیان باید معمولاً درآمد خارجی قانونی یا وسایل مالی کافی برای امرار معاش خود و هر نفر وابسته بدون اشتغال محلی اثبات کنند.',
        'اعضای خانواده ممکن است تابع آستانه‌های مالی و الزامات واجد شرایط بودن قابل اجرا باشند. اقامت یونانی ممکن است تحرک شنگن و دسترسی به محیط زندگی و تجاری یونان را ارائه دهد.',
      ],
      services: ['بررسی واجد شرایط بودن مالی', 'مستندسازی منبع وجوه', 'برنامه‌ریزی اقامت', 'هماهنگی بیمه درمانی', 'آماده‌سازی اسناد خانوادگی', 'ترجمه و گواهی', 'هماهنگی مشاور محلی'],
      fee: 'کلیه حق‌الوکاله، هزینه‌های دولتی، هزینه‌های ترجمه، هزینه‌های بیمه، هزینه‌های وکیل محلی، کارمزد بانکی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    },
  },
  {
    id: 'latvia',
    en: {
      eyebrow: 'LATVIA', cardTitle: 'Latvia Residency by Investment',
      cardShort: 'For investors and entrepreneurs seeking a European residence pathway through business, investment or property-linked planning in Latvia.',
      title: 'Latvia Residency by Investment',
      body: [
        'Latvia is a member state of the European Union and the Schengen Area. European residence planning in Latvia may be possible through qualifying investment routes, including business and share-capital investment structures, subject to official conditions and current Latvian immigration law.',
        'Real estate, banking or other investment routes may also be relevant depending on current rules, and must be verified with qualified Latvian professionals before any action is taken. Family inclusion may be possible depending on applicable rules at the time of application.',
        'The Latvia route may be of particular interest to clients seeking a cost-conscious European residence option. However, strong emphasis should be placed on KYC/AML compliance, lawful source of funds and banking defensibility, as Latvian financial institutions apply rigorous international compliance standards.',
      ],
      services: ['Investment route comparison and assessment', 'Source-of-funds review', 'Local adviser coordination', 'Bank-readiness file preparation', 'Family document preparation', 'Post-residence planning support'],
      fee: 'All legal fees, government fees, state duties, bank charges, local counsel fees, translation fees, investment costs and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    },
    fa: {
      eyebrow: 'لتونی', cardTitle: 'اقامت لتونی از طریق سرمایه‌گذاری',
      cardShort: 'برای سرمایه‌گذاران و کارآفرینان که به دنبال مسیر اقامت اروپایی از طریق تجارت، سرمایه‌گذاری یا برنامه‌ریزی مرتبط با ملک در لتونی هستند.',
      title: 'اقامت لتونی از طریق سرمایه‌گذاری',
      body: [
        'لتونی عضو اتحادیه اروپا و منطقه شنگن است. برنامه‌ریزی اقامت اروپایی در لتونی ممکن است از طریق مسیرهای سرمایه‌گذاری واجد شرایط، از جمله ساختارهای سرمایه‌گذاری تجاری و سرمایه سهام، تابع شرایط رسمی و قانون مهاجرتی فعلی لتونی امکان‌پذیر باشد.',
        'مستغلات، بانکداری یا سایر مسیرهای سرمایه‌گذاری ممکن است بسته به قوانین فعلی نیز مرتبط باشند و باید قبل از هر اقدامی با متخصصان لتونی واجد شرایط تأیید شوند.',
        'مسیر لتونی ممکن است برای موکلینی که به دنبال گزینه اقامت اروپایی مقرون به صرفه هستند جالب باشد. با این حال، تأکید قوی بر انطباق KYC/AML، منبع قانونی وجوه و قابلیت دفاع بانکی باید وجود داشته باشد.',
      ],
      services: ['مقایسه و ارزیابی مسیر سرمایه‌گذاری', 'بررسی منبع وجوه', 'هماهنگی مشاور محلی', 'آماده‌سازی پرونده بانکی', 'آماده‌سازی اسناد خانوادگی', 'پشتیبانی برنامه‌ریزی پس از اقامت'],
      fee: 'کلیه حق‌الوکاله، هزینه‌های دولتی، عوارض دولتی، کارمزد بانکی، هزینه‌های وکیل محلی، هزینه‌های ترجمه، هزینه‌های سرمایه‌گذاری و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    },
  },
  {
    id: 'greece-gv',
    en: {
      eyebrow: 'GREECE', cardTitle: 'Greece Golden Visa / Investment Residency',
      cardShort: 'For private clients seeking Greek residence through qualifying investment, particularly property-linked or investment-based structures.',
      title: 'Greece Golden Visa / Investment Residency',
      body: [
        'Greece offers an investor residence route commonly known as the Golden Visa, which may allow qualifying non-EU investors to obtain renewable Greek residence permits through qualifying investment. Property investment thresholds vary by location and property type.',
        'Higher investment thresholds generally apply in prime urban areas, including central Athens and certain islands. Lower thresholds may apply to specific conversion, restoration or other qualifying investment categories, subject to current official Greek rules. All investment thresholds and eligibility requirements must be verified before any property purchase or investment is made.',
        'The residence permit may be renewable subject to maintaining the qualifying investment and complying with applicable legal conditions. Family inclusion may be available for eligible family members subject to current rules. Greek residence may provide Schengen mobility and long-term European lifestyle planning.',
      ],
      services: ['Route selection and investment planning', 'Property due diligence coordination', 'Legal review and notary coordination', 'Fund transfer documentation', 'Family application planning', 'Post-acquisition legal support'],
      fee: 'All legal fees, government fees, notary fees, property taxes, due diligence costs, bank charges, local counsel fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    },
    fa: {
      eyebrow: 'یونان', cardTitle: 'ویزای طلایی یونان / اقامت سرمایه‌گذاری',
      cardShort: 'برای موکلین خصوصی که به دنبال اقامت یونانی از طریق سرمایه‌گذاری واجد شرایط، به ویژه ساختارهای مرتبط با ملک یا مبتنی بر سرمایه‌گذاری هستند.',
      title: 'ویزای طلایی یونان / اقامت سرمایه‌گذاری',
      body: [
        'یونان یک مسیر اقامت برای سرمایه‌گذاران که معمولاً به عنوان ویزای طلایی شناخته می‌شود ارائه می‌دهد که ممکن است به سرمایه‌گذاران غیر اروپایی واجد شرایط اجازه دهد از طریق سرمایه‌گذاری واجد شرایط مجوز اقامت یونانی قابل تمدید دریافت کنند.',
        'آستانه‌های سرمایه‌گذاری بالاتر معمولاً در مناطق شهری اصلی از جمله مرکز آتن و جزایر خاص اعمال می‌شوند. آستانه‌های پایین‌تر ممکن است برای دسته‌های خاص تبدیل، بازسازی یا سایر سرمایه‌گذاری‌های واجد شرایط اعمال شوند. تمامی آستانه‌ها باید قبل از هر خرید ملک یا سرمایه‌گذاری تأیید شوند.',
        'مجوز اقامت ممکن است تابع حفظ سرمایه‌گذاری واجد شرایط و رعایت شرایط حقوقی قابل اجرا قابل تمدید باشد. اقامت یونانی ممکن است تحرک شنگن و برنامه‌ریزی سبک زندگی اروپایی بلندمدت را ارائه دهد.',
      ],
      services: ['انتخاب مسیر و برنامه‌ریزی سرمایه‌گذاری', 'هماهنگی بررسی دقیق ملک', 'بررسی حقوقی و هماهنگی دفترخانه', 'مستندسازی انتقال وجه', 'برنامه‌ریزی درخواست خانوادگی', 'پشتیبانی حقوقی پس از خرید'],
      fee: 'کلیه حق‌الوکاله، هزینه‌های دولتی، حق دفترخانه، مالیات ملک، هزینه‌های بررسی دقیق، کارمزد بانکی، هزینه‌های وکیل محلی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    },
  },
];

export default function EUResidency() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'اقامت اروپا' : 'EU RESIDENCY'}
        title={isRTL ? 'راهکارهای اقامت اروپایی برای خانواده‌های بین‌المللی، سرمایه‌گذاران و کارآفرینان' : 'European Residency Solutions for International Families, Investors and Entrepreneurs'}
        subtitle={isRTL ? 'PLUCO GROUP پشتیبانی حقوقی و استراتژیک محرمانه‌ای را برای موکلین با ارزش خالص بالا که به دنبال اقامت قانونی اروپایی از طریق سرمایه‌گذاری، تجارت، استقلال مالی، دورکاری، برنامه‌ریزی مرتبط با ملک و ساختارهای جابجایی خانوادگی هستند، ارائه می‌دهد.' : 'PLUCO GROUP provides discreet legal and strategic support for high-net-worth clients seeking lawful European residence through investment, business, financial independence, remote work, property-linked planning and family relocation structures.'}
      />

      {/* Cards */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((prog, index) => {
              const p = isRTL ? prog.fa : prog.en;
              return (
                <motion.div key={prog.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 group flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{p.eyebrow}</p>
                  <h3 className="text-base font-serif font-bold mb-3 group-hover:text-[#C9A35A] transition-colors" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{p.cardTitle}</h3>
                  <p className="text-sm leading-relaxed flex-grow mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{p.cardShort}</p>
                  <a href={`#${prog.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#C9A35A' }}>
                    <span style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'بیشتر بدانید' : 'Learn More'}</span>
                    <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      {programmes.map((prog, index) => {
        const p = isRTL ? prog.fa : prog.en;
        return (
          <section key={prog.id} id={prog.id} className="py-20" style={{ backgroundColor: index % 2 === 0 ? '#F8F9FA' : '#FFFFFF' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{p.eyebrow}</p>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{p.title}</h2>
                <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
                {p.body.map((para, i) => <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{para}</p>)}
                <h3 className="text-base font-serif font-semibold mb-3 mt-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                  {isRTL ? 'روش‌های پشتیبانی PLUCO GROUP' : 'How PLUCO GROUP May Assist'}
                </h3>
                <ul className="text-sm space-y-1.5 mb-6" style={{ color: '#374151' }}>
                  {p.services.map(item => <li key={item} className="flex items-start gap-2"><span style={{ color: '#C9A35A' }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span></li>)}
                </ul>
                <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
                  <strong>{isRTL ? 'سلب مسئولیت هزینه‌ها: ' : 'Fee Disclaimer: '}</strong>{p.fee}
                </p>
              </motion.div>
            </div>
          </section>
        );
      })}

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
