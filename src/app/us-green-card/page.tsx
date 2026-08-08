'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  en: {
    statusLabel: 'CURRENT POLICY STATUS — REVIEWED 8 AUGUST 2026',
    statusTitle: 'Visa issuance for Iranian nationals is currently suspended, subject to limited exceptions',
    status: 'The U.S. Department of State states that, effective 1 January 2026, visa issuance is fully suspended for Iranian nationals across immigrant and nonimmigrant categories, subject to limited exceptions. A petition, investment or EB-5 category does not itself overcome this restriction. Current nationality, passports, residence, existing U.S. status and any possible exception or discretionary waiver must be assessed before any investment or filing decision.',
    sourceLabel: 'Read the current U.S. Department of State notice',
    programmeLabel: 'EB-5 PROGRAMME',
    programmeTitle: 'EB-5 Immigrant Investor Programme',
    intro: 'The EB-5 Immigrant Investor Programme remains a statutory investment-based category administered by US Citizenship and Immigration Services (USCIS). It allows qualifying investors to petition through an eligible investment and job-creation framework. For an Iranian national, however, category eligibility, petition processing, visa issuance and admission are separate questions. The current visa-issuance suspension must be analysed first and no investment should be presented as a route around it.',
    featuresTitle: 'Key Features of the EB-5 Programme',
    features: [
      'Current nationality-based visa-issuance restrictions, exceptions and waiver policy must be reviewed before assessing the practical viability of an EB-5 strategy.',
      'Investment-based route to US permanent residence for qualifying investors and eligible family members.',
      'Investment must be made into a qualifying new commercial enterprise or into an approved USCIS-designated Regional Centre project.',
      'The investment must create or preserve at least 10 full-time jobs for qualifying US workers, either directly or through approved Regional Centre indirect-job methodologies.',
      'Investment amount thresholds are set by USCIS and differ depending on whether the project is located in a Targeted Employment Area (TEA) or a standard area. Amounts should be verified against current USCIS guidance before any action.',
      'Investor funds must be derived from lawful sources and fully documented. Source-of-funds review is a critical part of the EB-5 process.',
      'US immigration, tax and securities law consequences must be reviewed by qualified US professionals before any investment commitment.',
      'No investment outcome, immigration approval, processing timeline or green card result should be guaranteed.',
    ],
    warningTitle: 'Important Notice',
    warning: 'PLUCO GROUP does not guarantee an exception or waiver, visa issuance, admission, immigration approval, investment performance, return of capital or processing timelines. Current policy must be confirmed immediately before action. Final advice and filing must be coordinated with licensed US immigration counsel and relevant regulated US professionals. EB-5 investments involve risk and repayment of capital is not guaranteed.',
    servicesTitle: 'How PLUCO GROUP May Assist',
    services: [
      'Current nationality-restriction and case-status screening before any pathway discussion',
      'Initial EB-5 suitability review',
      'Source-of-funds and source-of-wealth analysis',
      'Coordination with licensed US immigration counsel',
      'Coordination with US tax and securities professionals',
      "Review of family objectives and children's education planning",
      'Document preparation strategy',
      'Banking and fund-transfer documentation',
      'Risk review before referral to US licensed professionals',
    ],
    feeDisclaimer: 'Legal fees, US counsel fees, government filing fees, regional centre fees, investment administration fees, banking fees, tax adviser fees and out-of-pocket expenses will be added to the standard PLUCO GROUP service fees.',
    globalFeeLabel: 'Global Fee Disclaimer:',
    globalFee: 'Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.',
  },
  fa: {
    statusLabel: 'وضعیت جاری سیاست — بازبینی ۸ اوت ۲۰۲۶',
    statusTitle: 'صدور ویزا برای اتباع ایرانی در حال حاضر با استثناهای محدود تعلیق است',
    status: 'وزارت امور خارجه آمریکا اعلام می‌کند از ۱ ژانویه ۲۰۲۶ صدور ویزا برای اتباع ایرانی در گروه‌های مهاجرتی و غیرمهاجرتی، با استثناهای محدود، به‌طور کامل تعلیق است. داشتن دادخواست، سرمایه‌گذاری یا گروه EB-5 به‌خودی‌خود این محدودیت را کنار نمی‌زند. پیش از هر تصمیم برای سرمایه‌گذاری یا درخواست، ملیت فعلی، گذرنامه‌ها، محل اقامت، وضعیت موجود آمریکا و هر استثنا یا معافیت اختیاری احتمالی باید بررسی شود.',
    sourceLabel: 'مطالعه اطلاعیه جاری وزارت امور خارجه آمریکا',
    programmeLabel: 'برنامه EB-5',
    programmeTitle: 'برنامه سرمایه‌گذار مهاجر EB-5',
    intro: 'برنامه سرمایه‌گذار مهاجر EB-5 یک گروه قانونی مبتنی بر سرمایه‌گذاری است که توسط اداره خدمات شهروندی و مهاجرت آمریکا (USCIS) اداره می‌شود. سرمایه‌گذار واجد شرایط می‌تواند در چارچوب سرمایه‌گذاری و ایجاد شغل درخواست بدهد. با این حال، برای تبعه ایرانی، صلاحیت گروه، پردازش دادخواست، صدور ویزا و ورود پرسش‌های جدا هستند. تعلیق جاری صدور ویزا باید ابتدا بررسی شود و هیچ سرمایه‌گذاری نباید به‌عنوان راه دورزدن آن معرفی گردد.',
    featuresTitle: 'ویژگی‌های کلیدی برنامه EB-5',
    features: [
      'محدودیت‌های جاری صدور ویزا بر اساس ملیت، استثناها و سیاست معافیت باید پیش از بررسی امکان عملی راهبرد EB-5 ارزیابی شود.',
      'مسیر مبتنی بر سرمایه‌گذاری برای اقامت دائم آمریکا برای سرمایه‌گذاران واجد شرایط و اعضای خانواده واجد شرایط.',
      'سرمایه‌گذاری باید در یک شرکت تجاری جدید واجد شرایط یا در یک پروژه مرکز منطقه‌ای مورد تأیید USCIS انجام شود.',
      'سرمایه‌گذاری باید حداقل ۱۰ شغل تمام‌وقت برای کارگران آمریکایی واجد شرایط، به صورت مستقیم یا از طریق روش‌های غیرمستقیم مرکز منطقه‌ای تأیید شده، ایجاد یا حفظ کند.',
      'آستانه‌های مبلغ سرمایه‌گذاری توسط USCIS تعیین می‌شود و بسته به اینکه پروژه در منطقه اشتغال هدفمند (TEA) یا منطقه استاندارد قرار دارد، متفاوت است. مبالغ باید قبل از هر اقدامی با راهنمایی USCIS فعلی تأیید شوند.',
      'وجوه سرمایه‌گذار باید از منابع قانونی مشتق شده و کاملاً مستند باشند. بررسی منبع وجوه بخش مهمی از فرآیند EB-5 است.',
      'پیامدهای قانون مهاجرت، مالیات و اوراق بهادار آمریکا باید توسط متخصصان آمریکایی واجد شرایط قبل از هر تعهد سرمایه‌گذاری بررسی شوند.',
      'هیچ نتیجه سرمایه‌گذاری، تأیید مهاجرت، جدول زمانی پردازش یا نتیجه گرین کارت نباید تضمین شود.',
    ],
    warningTitle: 'اطلاعیه مهم',
    warning: 'PLUCO GROUP استثنا یا معافیت، صدور ویزا، ورود، تأیید مهاجرت، عملکرد سرمایه‌گذاری، بازگشت سرمایه یا زمان پردازش را تضمین نمی‌کند. سیاست جاری باید بلافاصله پیش از اقدام دوباره تأیید شود. مشاوره نهایی و ثبت باید با وکیل مهاجرت دارای مجوز آمریکا و متخصصان تحت نظارت هماهنگ شود. سرمایه‌گذاری EB-5 ریسک دارد و بازپرداخت سرمایه تضمین نمی‌شود.',
    servicesTitle: 'روش‌های پشتیبانی PLUCO GROUP',
    services: [
      'غربالگری محدودیت ملیتی و وضعیت پرونده پیش از هر بحث درباره مسیر',
      'بررسی اولیه تناسب EB-5',
      'تجزیه‌وتحلیل منبع وجوه و منبع ثروت',
      'هماهنگی با وکیل مهاجرتی دارای مجوز آمریکا',
      'هماهنگی با متخصصان مالیاتی و اوراق بهادار آمریکا',
      'بررسی اهداف خانوادگی و برنامه‌ریزی تحصیلی فرزندان',
      'استراتژی آماده‌سازی اسناد',
      'مستندسازی بانکی و انتقال وجوه',
      'بررسی ریسک قبل از ارجاع به متخصصان دارای مجوز آمریکا',
    ],
    feeDisclaimer: 'حق‌الوکاله، هزینه‌های وکیل آمریکا، هزینه‌های ثبت دولتی، هزینه‌های مرکز منطقه‌ای، هزینه‌های اداره سرمایه‌گذاری، هزینه‌های بانکی، هزینه‌های مشاور مالیاتی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    globalFeeLabel: 'سلب مسئولیت هزینه‌ها:',
    globalFee: 'حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
  },
};

export default function USGreenCard() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const c = isRTL ? content.fa : content.en;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'مهاجرت به آمریکا' : 'US IMMIGRATION'}
        title={isRTL ? 'وضعیت جاری اقامت دائم آمریکا و برنامه EB-5 برای اتباع ایرانی' : 'Current US Permanent Residence and EB-5 Planning for Iranian Nationals'}
        subtitle={isRTL ? 'هر ارزیابی باید از تعلیق جاری صدور ویزا، استثناهای محدود و وضعیت واقعی پرونده آغاز شود؛ نه از سرمایه‌گذاری یا عنوان یک برنامه.' : 'Every assessment must begin with the current visa-issuance suspension, limited exceptions and the client’s actual case posture—not with an investment or programme label.'}
      />

      <section className="border-y border-amber-300 bg-amber-50 py-10" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-amber-800" style={{ fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{c.statusLabel}</p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900" style={{ fontFamily: isRTL ? ff : undefined }}>{c.statusTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700" style={{ fontFamily: isRTL ? ff : undefined }}>{c.status}</p>
          <a className="mt-5 inline-flex text-sm font-bold text-amber-900 underline underline-offset-4" href="https://travel.state.gov/content/travel/en/News/visas-news/suspension-of-visa-issuance-to-foreign-nationals-to-protect-the-security-of-the-united-states.html" target="_blank" rel="noopener noreferrer">{c.sourceLabel}</a>
        </div>
      </section>

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{c.programmeLabel}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{c.programmeTitle}</h2>
            <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{c.intro}</p>

            <h3 className="text-base font-serif font-semibold mb-4 mt-8" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{c.featuresTitle}</h3>
            <ul className="text-sm space-y-3 mb-6" style={{ color: '#374151' }}>
              {c.features.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1" style={{ color: '#C9A35A' }}>·</span>
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-xl p-5 mb-8" style={{ backgroundColor: '#FFF8E8', border: '1px solid #E8C96A' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{c.warningTitle}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{c.warning}</p>
                </div>
              </div>
            </div>

            <h3 className="text-base font-serif font-semibold mb-3" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{c.servicesTitle}</h3>
            <ul className="text-sm space-y-1.5 mb-6" style={{ color: '#374151' }}>
              {c.services.map(item => (
                <li key={item} className="flex items-start gap-2"><span style={{ color: '#C9A35A' }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span></li>
              ))}
            </ul>

            <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
              <strong>{isRTL ? 'سلب مسئولیت هزینه‌ها: ' : 'Fee Disclaimer: '}</strong>{c.feeDisclaimer}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{c.globalFeeLabel} </strong>{c.globalFee}
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
