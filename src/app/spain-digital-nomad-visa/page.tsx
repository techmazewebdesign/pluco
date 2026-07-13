'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Users, Briefcase, Building2, Home, MapPin, Landmark, Shield } from 'lucide-react';
import SpainHero from '@/components/spain/SpainHero';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import PrivateEnquiryFormModal from '@/components/shared/PrivateEnquiryFormModal';
import { useLanguage } from '@/contexts/LanguageContext';

const NAVY = '#071C3C';
const GOLD = '#C9A35A';
const INK = '#1E2430';
const BODY = '#5E6470';

const audiences = [
  {
    Icon: Briefcase,
    en: { title: 'Remote Employees', description: 'Salaried professionals employed by a non-Spanish company who wish to relocate to Spain while continuing their employment remotely.' },
    fa: { title: 'کارمندان دورکار', description: 'متخصصانی که برای شرکتی خارج از اسپانیا کار می‌کنند و می‌خواهند بدون توقف مسیر حرفه‌ای خود، زندگی در اسپانیا را آغاز کنند.' },
  },
  {
    Icon: Users,
    en: { title: 'Freelancers & Consultants', description: 'Independent professionals with a portfolio of clients based predominantly outside Spain who bill internationally.' },
    fa: { title: 'فریلنسرها و مشاوران', description: 'متخصصان مستقلی که عمده خدمات خود را از راه دور به مشتریان خارج از اسپانیا ارائه می‌دهند و درآمد بین‌المللی قابل‌مستند دارند.' },
  },
  {
    Icon: Building2,
    en: { title: 'Business Owners', description: 'Directors and shareholders of foreign companies whose management or advisory activity can be carried out remotely.' },
    fa: { title: 'صاحبان کسب‌وکار', description: 'مدیران و سهامداران شرکت‌های خارجی که فعالیت مدیریتی یا مشاوره‌ای آن‌ها از راه دور قابل انجام و مستندسازی است.' },
  },
  {
    Icon: Home,
    en: { title: 'Families', description: 'Principal applicants seeking to relocate with a spouse or partner and dependent children under a single application strategy.' },
    fa: { title: 'خانواده‌ها', description: 'متقاضیانی که می‌خواهند امکان همراهی اعضای واجد شرایط خانواده را از ابتدا در یک برنامه منسجم اقامتی بررسی کنند.' },
  },
];

const routes = [
  {
    Icon: MapPin,
    en: {
      eyebrow: 'ROUTE 01',
      title: 'Consulate Application (Outside Spain)',
      description: 'Application lodged at the competent Spanish Consulate in the applicant\'s country of residence prior to travel, resulting in a national visa that permits entry and initial residence.',
      points: ['Filed before relocation', 'Processed by the consular section', 'Grants an initial national visa on approval', 'Generally suited to applicants planning their move in advance'],
    },
    fa: {
      eyebrow: 'مسیر ۰۱',
      title: 'درخواست کنسولی پیش از ورود به اسپانیا',
      description: 'این مسیر برای متقاضیانی است که می‌خواهند پیش از نقل مکان، درخواست خود را در کنسولگری صلاحیت‌دار اسپانیا در کشور محل اقامتشان ثبت کنند. در صورت موافقت، ویزای ملی برای ورود و اقامت اولیه صادر می‌شود.',
      points: ['ثبت پرونده پیش از نقل مکان', 'رسیدگی توسط بخش کنسولی مربوط', 'صدور ویزای ملی در صورت موافقت', 'مناسب برای برنامه‌ریزی دقیق پیش از جابه‌جایی'],
    },
  },
  {
    Icon: Landmark,
    en: {
      eyebrow: 'ROUTE 02',
      title: 'In-Country Application (Within Spain)',
      description: 'Application submitted to the Spanish Large Business and Strategic Groups Unit (UGE) while the applicant is lawfully present in Spain, such as on a tourist stay.',
      points: ['Filed after arrival, subject to lawful stay', 'Processed centrally by the UGE', 'May offer a faster administrative timeline in eligible cases', 'Requires careful legal review of entry status and timing'],
    },
    fa: {
      eyebrow: 'مسیر ۰۲',
      title: 'درخواست اقامت از داخل اسپانیا',
      description: 'اگر متقاضی هنگام ثبت درخواست به‌صورت قانونی در اسپانیا حضور داشته باشد، ممکن است بتواند پرونده اقامت را مستقیماً به واحد شرکت‌های بزرگ و گروه‌های راهبردی اسپانیا (UGE) ارائه کند.',
      points: ['ثبت در مدت حضور قانونی در اسپانیا', 'رسیدگی متمرکز توسط UGE', 'امکان زمان‌بندی اداری متفاوت در پرونده‌های واجد شرایط', 'نیازمند بررسی دقیق وضعیت ورود و مهلت قانونی اقامت'],
    },
  },
  {
    Icon: Users,
    en: {
      eyebrow: 'ROUTE 03',
      title: 'Family Extension Applications',
      description: 'Dependent applications for spouses, partners and minor children linked to a principal applicant who meets the qualifying income and documentation conditions.',
      points: ['Filed alongside or following the principal application', 'Subject to dependency and income-sufficiency review', 'Coordinated documentation and translation strategy', 'Case-by-case assessment against current requirements'],
    },
    fa: {
      eyebrow: 'مسیر ۰۳',
      title: 'درخواست اعضای واجد شرایط خانواده',
      description: 'همسر یا شریک زندگی، فرزندان وابسته و در موارد واجد شرایط، والدین وابسته می‌توانند همراه با متقاضی اصلی یا پس از او درخواست دهند؛ مشروط به احراز رابطه، وابستگی و توان مالی لازم.',
      points: ['امکان ثبت هم‌زمان یا پس از متقاضی اصلی', 'بررسی رابطه خانوادگی، وابستگی و توان مالی', 'هماهنگی مدارک، ترجمه و تأییدات', 'ارزیابی جداگانه هر عضو بر اساس الزامات جاری'],
    },
  },
];

const packages = [
  {
    tier: 'Bronze',
    faTier: 'برنز',
    accent: '#8C8F94',
    en: {
      tagline: 'Eligibility & Preparation',
      price: 'Main applicant: €3,150',
      familyPricing: ['First family member: €1,200', 'Each additional family member: €525'],
      features: [
        'Initial eligibility review',
        'Route comparison (consulate vs in-country)',
        'Personalised document checklist',
        'Income and contract documentation guidance',
        'One coordination call with our team',
      ],
    },
    fa: {
      tagline: 'ارزیابی اولیه و نقشه راه پرونده',
      price: 'متقاضی اصلی: ۳٬۱۵۰ یورو',
      familyPricing: ['اولین عضو خانواده: ۱٬۲۰۰ یورو', 'هر عضو خانواده اضافی: ۵۲۵ یورو'],
      features: [
        'ارزیابی اولیه شرایط و ریسک‌های پرونده',
        'مقایسه مسیر کنسولی و درخواست داخل اسپانیا',
        'چک‌لیست شخصی‌سازی‌شده مدارک',
        'راهنمایی برای مستندسازی درآمد و قراردادها',
        'یک جلسه هماهنگی مستقیم با تیم ما',
      ],
    },
  },
  {
    tier: 'Silver',
    faTier: 'نقره‌ای',
    accent: GOLD,
    featured: true,
    en: {
      tagline: 'Guided Application Support',
      price: 'Main applicant: €7,175',
      familyPricing: ['First family member: €1,900', 'Each additional family member: €975'],
      features: [
        'Everything in Bronze',
        'Full document review and file preparation',
        'Translation and certification coordination',
        'Application form preparation support',
        'Health insurance coordination',
        'Direct case-progress updates',
      ],
    },
    fa: {
      tagline: 'آماده‌سازی و همراهی کامل پرونده',
      price: 'متقاضی اصلی: ۷٬۱۷۵ یورو',
      familyPricing: ['اولین عضو خانواده: ۱٬۹۰۰ یورو', 'هر عضو خانواده اضافی: ۹۷۵ یورو'],
      features: [
        'همه موارد بسته برنز',
        'بازبینی کامل مدارک و سازمان‌دهی پرونده',
        'هماهنگی ترجمه و تأییدات مورد نیاز',
        'پشتیبانی در آماده‌سازی فرم‌های درخواست',
        'هماهنگی بیمه درمانی',
        'اطلاع‌رسانی مستقیم درباره روند پرونده',
      ],
    },
  },
  {
    tier: 'Gold',
    faTier: 'طلایی',
    accent: NAVY,
    en: {
      tagline: 'Full-Family Coordination',
      price: 'Main applicant: €8,050',
      familyPricing: ['First family member: on engagement', 'Each additional family member: on engagement'],
      features: [
        'Everything in Silver',
        'Family member applications coordinated together',
        'Source-of-funds and payment-trail documentation support',
        'Legal partner handoff for filing and representation',
        'Priority scheduling and dedicated case coordinator',
        'Post-approval settlement guidance',
      ],
    },
    fa: {
      tagline: 'هماهنگی اختصاصی برای شما و خانواده',
      price: 'متقاضی اصلی: ۸٬۰۵۰ یورو',
      familyPricing: ['اولین عضو خانواده: بر اساس تعهد', 'هر عضو خانواده اضافی: بر اساس تعهد'],
      features: [
        'همه موارد بسته نقره‌ای',
        'هماهنگی یکپارچه پرونده اعضای واجد شرایط خانواده',
        'پشتیبانی در مستندسازی منبع وجوه و مسیر پرداخت',
        'ارجاع به همکار حقوقی برای ثبت و نمایندگی، در صورت نیاز',
        'زمان‌بندی اولویت‌دار و هماهنگ‌کننده اختصاصی پرونده',
        'راهنمایی مراحل استقرار پس از موافقت',
      ],
    },
  },
];

const comparisonRows = [
  {
    en: ['Filing location', 'Spanish Consulate abroad', 'UGE (Large Business Unit), Spain'],
    fa: ['محل ثبت', 'کنسولگری اسپانیا در خارج از کشور', 'UGE (واحد تجارت بزرگ)، اسپانیا'],
  },
  {
    en: ['Applicant location at filing', 'Outside Spain', 'Physically present in Spain, lawful stay'],
    fa: ['موقعیت متقاضی هنگام ثبت', 'خارج از اسپانیا', 'حضور فیزیکی در اسپانیا، اقامت قانونی'],
  },
  {
    en: ['Typical use case', 'Planning relocation in advance', 'Already in Spain and reviewing options'],
    fa: ['کاربرد معمول', 'برنامه‌ریزی نقل مکان از پیش', 'در حال حاضر در اسپانیا و در حال بررسی گزینه‌ها'],
  },
  {
    en: ['Document legalisation', 'Generally home-country apostille/legalisation', 'May involve additional local verification'],
    fa: ['تأیید مدارک', 'معمولاً آپوستیل/تأیید کشور مبدأ', 'ممکن است شامل تأیید محلی اضافی باشد'],
  },
  {
    en: ['Outcome on approval', 'National visa, exchanged for residence card in Spain', 'Residence authorisation processed directly in Spain'],
    fa: ['نتیجه در صورت موافقت', 'ویزای ملی برای ورود و اقامت اولیه؛ مراحل کارت اقامت در اسپانیا انجام می‌شود', 'مجوز اقامت مستقیماً در اسپانیا بررسی می‌شود'],
  },
  {
    en: ['Entry status risk', 'Lower — application precedes travel', 'Requires careful review of visa-free stay and status'],
    fa: ['ریسک وضعیت ورود', 'کمتر — درخواست پیش از سفر ثبت می‌شود', 'نیازمند بررسی دقیق اقامت بدون ویزا و وضعیت'],
  },
];

const paymentTrailPoints = {
  en: [
    'Structured source-of-funds file preparation',
    'International payment and transfer documentation review',
    'Coordination with compliance and sanctions-screening specialists',
    'Coordination with independent banking and tax professionals',
    'Legal partner handoff for complex or cross-border structures',
  ],
  fa: [
    'آماده‌سازی ساختاریافته پرونده منبع وجوه',
    'بررسی مستندات پرداخت و انتقال بین‌المللی',
    'هماهنگی با متخصصان انطباق و غربالگری تحریم‌ها',
    'هماهنگی با متخصصان مستقل بانکی و مالیاتی',
    'انتقال به همکار حقوقی برای ساختارهای پیچیده یا فرامرزی',
  ],
};

const SERVICE_NAME = 'Spain Digital Nomad Visa / Remote Residency Support';
const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

export default function SpainDigitalNomadVisaPage() {
  const { isRTL } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const openEnquiry = (tier?: string) => {
    setSelectedTier(tier || null);
    setIsModalOpen(true);
  };

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SpainHero
        isRTL={isRTL}
        onRequestAssessment={() => openEnquiry()}
        onViewPackages={scrollToPackages}
      />

      {/* Elegant section divider */}
      <div className="flex justify-center bg-white pt-14">
        <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      </div>

      {/* Who this is for */}
      <section className="py-14 md:py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'آیا این مسیر برای شما مناسب است؟' : 'WHO THIS IS FOR'}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'برای حرفه‌ای‌هایی که کارشان مرز جغرافیایی ندارد' : 'Built for internationally mobile professionals and families'}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((a, i) => {
              const c = isRTL ? a.fa : a.en;
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="border border-gray-200 rounded-xl p-6">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ border: `2px solid ${GOLD}` }}>
                    <a.Icon className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-serif font-bold mb-2" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{c.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{c.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three application routes */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'سه مسیر برای شرایط متفاوت' : 'THREE APPLICATION ROUTES'}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'مسیر درست، پیش از صرف زمان و هزینه مشخص می‌شود' : 'Choosing the right pathway for your circumstances'}</h2>
            <p className="text-sm leading-relaxed mt-4" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'محل حضور فعلی، ملیت، وضعیت ورود، نوع فعالیت حرفه‌ای و شرایط خانواده بر انتخاب مسیر اثر می‌گذارند. پیش از هر توصیه، پرونده شما به‌صورت فردی بررسی می‌شود تا گزینه مناسب با ریسک‌های روشن مشخص شود.' : 'The most suitable route depends on your current location, timeline and personal circumstances. Our team reviews each case individually before recommending a strategy.'}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {routes.map((r, i) => {
              const c = isRTL ? r.fa : r.en;
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ border: `2px solid ${GOLD}` }}>
                    <r.Icon className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{c.eyebrow}</p>
                  <h3 className="text-base font-serif font-bold mb-3" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{c.description}</p>
                  <ul className="text-xs space-y-2 mt-auto" style={{ color: '#374151' }}>
                    {c.points.map(p => (
                      <li key={p} className="flex items-start gap-2">
                        <span style={{ color: GOLD }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Package comparison */}
      <section id="packages" className="py-20 md:py-24 bg-white scroll-mt-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'سطح همراهی متناسب با نیاز شما' : 'PACKAGE COMPARISON'}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'از ارزیابی اولیه تا هماهنگی کامل خانوادگی' : 'Bronze, Silver and Gold support packages'}</h2>
            <p className="text-sm leading-relaxed mt-4" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'هر بسته دامنه مشخصی از ارزیابی، آماده‌سازی و هماهنگی را پوشش می‌دهد تا متناسب با پیچیدگی پرونده خود انتخاب کنید. هزینه خدمات به معنای تضمین موافقت با ویزا یا اقامت نیست.' : 'Packages describe the scope of preparation and coordination support provided by PLUCO GROUP. They do not represent a guarantee of any visa, residence or government outcome.'}</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg, i) => {
              const c = isRTL ? pkg.fa : pkg.en;
              return (
                <motion.div
                  key={pkg.tier}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl"
                  style={{
                    border: pkg.featured ? `2px solid ${GOLD}` : '1px solid #E5E7EB',
                    backgroundColor: pkg.featured ? '#FFFDF8' : '#FFFFFF',
                    boxShadow: pkg.featured ? '0 12px 30px rgba(201,163,90,0.18)' : 'none',
                  }}
                >
                  {pkg.featured && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'پرتقاضاترین بسته' : 'Most Requested'}</p>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: pkg.accent, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? pkg.faTier : pkg.tier}</p>
                  <h3 className="text-xl font-serif font-bold mb-1" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{c.tagline}</h3>
                  <p className="text-sm font-semibold mb-1" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{c.price}</p>
                  <div className="mb-6">
                    {c.familyPricing.map(line => (
                      <p key={line} className="text-xs" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{line}</p>
                    ))}
                  </div>
                  <ul className="text-sm space-y-3 mb-8 flex-grow">
                    {c.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} strokeWidth={2} />
                        <span style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openEnquiry(pkg.tier)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110"
                    style={{
                      backgroundColor: pkg.featured ? GOLD : NAVY,
                      color: pkg.featured ? NAVY : '#FFFFFF',
                      fontFamily: isRTL ? ff : undefined,
                    }}
                  >
                    {isRTL ? `بررسی بسته ${pkg.faTier} برای پرونده من` : `Enquire About ${pkg.tier}`}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </motion.div>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed mt-8 p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{isRTL ? 'توضیح مهم درباره هزینه‌ها: ' : 'Fee Disclaimer: '}</strong>
            {isRTL
              ? 'حق‌الوکاله، هزینه‌های دولتی، ترجمه، دفتر اسناد رسمی، بیمه، کارمزد بانکی، وکیل محلی و سایر مخارج جانبی در قیمت استاندارد بسته‌های PLUCO GROUP منظور نشده‌اند و جداگانه محاسبه می‌شوند.'
              : 'All legal fees, government fees, translation fees, notary fees, insurance costs, bank charges, local counsel fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees for each package.'}
          </p>
        </div>
      </section>

      {/* Iran and international payment-trail support */}
      <section className="py-20" style={{ backgroundColor: '#F8F9FA' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.5} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'شفافیت مالی پیش از ثبت پرونده' : 'PAYMENT-TRAIL & SOURCE-OF-FUNDS SUPPORT'}</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'مسیر درآمد و وجوه شما باید روشن، منسجم و قابل‌اثبات باشد' : 'Iran and international payment-trail support'}</h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? (
                <>
                  <p>برای متقاضیانی که درآمد، پس‌انداز یا فعالیت تجاری مرتبط با ایران یا حوزه‌های قضایی تحت بررسی مضاعف دارند، اثبات درآمد قانونی و منبع وجوه معمولاً به مدارک دقیق‌تر و یک روایت مالی منسجم نیاز دارد.</p>
                  <p>PLUCO GROUP به شما کمک می‌کند سوابق درآمد، اسناد بانکی، مدارک شرکتی و انتقالات را به شکلی منظم و قابل‌پیگیری آماده کنید. پرونده در صورت نیاز برای بررسی تخصصی به مشاوران مستقل حقوقی، مالیاتی یا انطباق تحریم‌ها ارجاع می‌شود.</p>
                  <p>این خدمت مقدماتی و مشاوره‌ای است و هیچ تحریم، الزام بانکی یا بررسی نظارتی را حذف نمی‌کند. پذیرش مدارک منبع وجوه همواره به تصمیم بانک‌ها، نهادها و مقامات ذی‌صلاح بستگی دارد و قابل تضمین نیست.</p>
                </>
              ) : (
                <>
                  <p>Applicants with income, savings or business ties connected to Iran or other jurisdictions subject to enhanced due diligence often face additional documentation requirements when demonstrating lawful income and source of funds to Spanish authorities and financial institutions.</p>
                  <p>PLUCO GROUP supports clients in organising a coherent, verifiable payment trail — including income statements, banking records, corporate documentation and transfer records — for review by our team and, where required, handoff to independent Spanish legal and tax professionals and to sanctions-compliance specialists.</p>
                  <p>This support is preparatory and advisory in nature. It does not remove or override any applicable sanctions regime, banking compliance requirement or regulatory screening. Every case is subject to independent sanctions screening, compliance review and the applicable rules of the relevant financial institutions and authorities, and PLUCO GROUP cannot guarantee that any bank, authority or institution will accept a given source-of-funds file.</p>
                </>
              )}
            </div>
            <ul className="text-sm space-y-2 mt-6" style={{ color: '#374151' }}>
              {(isRTL ? paymentTrailPoints.fa : paymentTrailPoints.en).map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: GOLD }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Spain application vs consulate application */}
      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{isRTL ? 'مقایسه' : 'COMPARISON'}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'درخواست داخل اسپانیا در مقابل درخواست کنسولی' : 'Spain (in-country) application vs. consulate application'}</h2>
          </motion.div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={isRTL ? 'text-right border-b-2' : 'text-left border-b-2'} style={{ borderColor: GOLD }}>
                  <th className="py-3 pr-4 font-serif" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'ملاحظات' : 'Consideration'}</th>
                  <th className="py-3 px-4 font-serif" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'درخواست کنسولی' : 'Consulate Application'}</th>
                  <th className="py-3 pl-4 font-serif" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'درخواست داخل اسپانیا' : 'Spain In-Country Application'}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(row => {
                  const c = isRTL ? row.fa : row.en;
                  return (
                    <tr key={c[0]} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium" style={{ color: INK, fontFamily: isRTL ? ff : undefined }}>{c[0]}</td>
                      <td className="py-3 px-4" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{c[1]}</td>
                      <td className="py-3 pl-4" style={{ color: BODY, fontFamily: isRTL ? ff : undefined }}>{c[2]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed mt-6" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            {isRTL
              ? 'این مقایسه صرفاً جهت آشنایی کلی ارائه شده است. مناسب‌ترین مسیر به ملیت، موقعیت فعلی، سابقه سفر و شرایط شخصی شما بستگی دارد و باید از طریق بررسی فردی واجد شرایط بودن تأیید شود.'
              : 'This comparison is provided for general orientation only. The most appropriate route depends on your nationality, current location, travel history and personal circumstances, and must be confirmed through an individual eligibility review.'}
          </p>
        </div>
      </section>

      {/* CTA form */}
      <section className="relative overflow-hidden py-20 md:py-24" style={{ backgroundColor: NAVY }} dir={isRTL ? 'rtl' : 'ltr'}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(201,163,90,0.14) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="w-10 h-px mx-auto mb-6" style={{ backgroundColor: GOLD }} />
            <h2 className="text-2xl md:text-3xl font-serif text-white mb-4" style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'آینده‌تان را به حدس و آزمون‌وخطا نسپارید' : 'Start a confidential eligibility review'}</h2>
            <p className="text-sm max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#CBD5E0', fontFamily: isRTL ? ff : undefined }}>
              {isRTL
                ? 'هر پرونده مهاجرتی جزئیات و ریسک‌های خاص خود را دارد. شرایطتان را محرمانه با ما در میان بگذارید تا پیش از انتخاب بسته یا شروع هزینه‌ها، تناسب ویزای دیجیتال نومد و مسیر مناسب برای شما بررسی شود.'
                : 'Share your situation and our team will review your circumstances against current Spanish Digital Nomad Visa requirements before recommending a package and route.'}
            </p>
            <motion.button
              onClick={() => openEnquiry()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg transition-colors hover:brightness-110"
              style={{ backgroundColor: GOLD, color: NAVY, fontFamily: isRTL ? ff : undefined }}
            >
              {isRTL ? 'درخواست ارزیابی محرمانه پرونده' : 'Request Eligibility Review'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </motion.button>
            <p className="text-xs mt-6" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
              {isRTL ? 'ایمیل: ' : 'Email: '}<a href="mailto:info@plucogroup.com" className="hover:text-white transition-colors">info@plucogroup.com</a> · Ksawerów 3, Warsaw, 02-656, Poland
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="py-16 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <LegalDisclaimer />
          <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{isRTL ? 'توضیح حقوقی درباره نتیجه پرونده: ' : 'Visa Outcome Disclaimer: '}</strong>
            {isRTL
              ? 'PLUCO GROUP در ارتباط با ویزای دیجیتال نومد اسپانیا خدمات آماده‌سازی، هماهنگی و ارجاع به همکار حقوقی ارائه می‌دهد. تأیید ویزا یا اقامت، پذیرش اعضای خانواده و تصمیم کنسولگری اسپانیا، UGE یا هر مرجع دولتی دیگری قابل تضمین نیست. همه درخواست‌ها تابع ارزیابی شرایط، قوانین جاری مهاجرت اسپانیا، بررسی‌های تحریمی و انطباق و تصمیم نهایی مراجع ذی‌صلاح هستند. آثار مالیاتی اقامت در اسپانیا نیز باید جداگانه با مشاور مالیاتی واجد صلاحیت در اسپانیا بررسی شود.'
              : 'PLUCO GROUP provides preparation, coordination and legal partner handoff services in connection with the Spain Digital Nomad Visa. We do not guarantee visa approval, residence, family inclusion, or any decision of the Spanish Consulate, the UGE, or any other government authority. All applications are subject to eligibility review, current Spanish immigration law, sanctions and compliance screening, and the sole discretion of the competent authorities. Tax implications of Spanish residence should be reviewed independently with qualified Spanish tax advisers.'}
          </p>
        </div>
      </section>

      <PrivateEnquiryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={SERVICE_NAME}
        defaultMessage={selectedTier ? `Package interest: ${selectedTier}. ` : undefined}
        packageInterest={selectedTier || undefined}
      />
    </div>
  );
}
