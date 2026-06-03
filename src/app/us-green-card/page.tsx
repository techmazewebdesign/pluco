'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  en: {
    programmeLabel: 'EB-5 PROGRAMME',
    programmeTitle: 'EB-5 Immigrant Investor Programme',
    intro: 'The EB-5 Immigrant Investor Programme is the principal investment-based route to US permanent residence (green card). The programme was created by the United States Congress and is administered by US Citizenship and Immigration Services (USCIS). It allows eligible foreign investors to petition for US permanent residence by making a qualifying investment in a new commercial enterprise and satisfying applicable job-creation requirements under US immigration law.',
    featuresTitle: 'Key Features of the EB-5 Programme',
    features: [
      'Investment-based route to US permanent residence for qualifying investors and eligible family members.',
      'Investment must be made into a qualifying new commercial enterprise or into an approved USCIS-designated Regional Centre project.',
      'The investment must create or preserve at least 10 full-time jobs for qualifying US workers, either directly or through approved Regional Centre indirect-job methodologies.',
      'Investment amount thresholds are set by USCIS and differ depending on whether the project is located in a Targeted Employment Area (TEA) or a standard area. Amounts should be verified against current USCIS guidance before any action.',
      'Investor funds must be derived from lawful sources and fully documented. Source-of-funds review is a critical part of the EB-5 process.',
      'US immigration, tax and securities law consequences must be reviewed by qualified US professionals before any investment commitment.',
      'No investment outcome, immigration approval, processing timeline or green card result should be guaranteed.',
    ],
    warningTitle: 'Important Notice',
    warning: 'PLUCO GROUP does not guarantee US immigration approval, investment performance, return of capital or processing timelines. Final advice and filing must be coordinated with licensed US immigration counsel and relevant regulated US professionals. EB-5 investments involve risk and the repayment of capital is not guaranteed.',
    servicesTitle: 'How PLUCO GROUP May Assist',
    services: [
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
    programmeLabel: 'برنامه EB-5',
    programmeTitle: 'برنامه سرمایه‌گذار مهاجر EB-5',
    intro: 'برنامه سرمایه‌گذار مهاجر EB-5 مسیر اصلی مبتنی بر سرمایه‌گذاری برای اقامت دائم آمریکا (گرین کارت) است. این برنامه توسط کنگره ایالات متحده ایجاد شده و توسط اداره خدمات شهروندی و مهاجرت آمریکا (USCIS) اداره می‌شود. این برنامه به سرمایه‌گذاران خارجی واجد شرایط اجازه می‌دهد با انجام سرمایه‌گذاری واجد شرایط در یک شرکت تجاری جدید و رعایت الزامات ایجاد شغل تحت قانون مهاجرت آمریکا، درخواست اقامت دائم آمریکا را بدهند.',
    featuresTitle: 'ویژگی‌های کلیدی برنامه EB-5',
    features: [
      'مسیر مبتنی بر سرمایه‌گذاری برای اقامت دائم آمریکا برای سرمایه‌گذاران واجد شرایط و اعضای خانواده واجد شرایط.',
      'سرمایه‌گذاری باید در یک شرکت تجاری جدید واجد شرایط یا در یک پروژه مرکز منطقه‌ای مورد تأیید USCIS انجام شود.',
      'سرمایه‌گذاری باید حداقل ۱۰ شغل تمام‌وقت برای کارگران آمریکایی واجد شرایط، به صورت مستقیم یا از طریق روش‌های غیرمستقیم مرکز منطقه‌ای تأیید شده، ایجاد یا حفظ کند.',
      'آستانه‌های مبلغ سرمایه‌گذاری توسط USCIS تعیین می‌شود و بسته به اینکه پروژه در منطقه اشتغال هدفمند (TEA) یا منطقه استاندارد قرار دارد، متفاوت است. مبالغ باید قبل از هر اقدامی با راهنمایی USCIS فعلی تأیید شوند.',
      'وجوه سرمایه‌گذار باید از منابع قانونی مشتق شده و کاملاً مستند باشند. بررسی منبع وجوه بخش مهمی از فرآیند EB-5 است.',
      'پیامدهای قانون مهاجرت، مالیات و اوراق بهادار آمریکا باید توسط متخصصان آمریکایی واجد شرایط قبل از هر تعهد سرمایه‌گذاری بررسی شوند.',
      'هیچ نتیجه سرمایه‌گذاری، تأیید مهاجرت، جدول زمانی پردازش یا نتیجه گرین کارت نباید تضمین شود.',
    ],
    warningTitle: 'اطلاعیه مهم',
    warning: 'PLUCO GROUP تأیید مهاجرت به آمریکا، عملکرد سرمایه‌گذاری، بازگشت سرمایه یا جداول زمانی پردازش را تضمین نمی‌کند. مشاوره نهایی و ثبت باید با وکیل مهاجرتی دارای مجوز آمریکا و متخصصان تنظیم‌شده آمریکایی مربوطه هماهنگ شود. سرمایه‌گذاری‌های EB-5 با ریسک همراه هستند و بازپرداخت سرمایه تضمین نمی‌شود.',
    servicesTitle: 'روش‌های پشتیبانی PLUCO GROUP',
    services: [
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
        title={isRTL ? 'برنامه‌ریزی اقامت دائم آمریکا برای سرمایه‌گذاران، کارآفرینان و خانواده‌های ثروتمند' : 'US Permanent Residence Planning for Investors, Entrepreneurs and High-Net-Worth Families'}
        subtitle={isRTL ? 'PLUCO GROUP هماهنگی حقوقی استراتژیک برای موکلینی که گزینه‌های اقامت دائم آمریکا از جمله مسیرهای مهاجرتی مبتنی بر سرمایه‌گذاری مانند برنامه EB-5 را بررسی می‌کنند، ارائه می‌دهد.' : 'PLUCO GROUP provides strategic legal coordination for clients exploring US permanent residence options, including investment-based immigration pathways such as the EB-5 Immigrant Investor Programme.'}
      />

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
