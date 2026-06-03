'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  en: {
    box1Title: 'Latvia Property & Residence Planning',
    box1Desc: 'For clients considering Latvian property acquisition as part of a broader European residence, investment and family relocation strategy.',
    box2Title: 'Hungary Property & Guest Investor Planning',
    box2Desc: 'For clients exploring Hungary as a residence, investment and family relocation destination, including guest investor residence planning where legally available.',
    latviaLabel: 'EU & SCHENGEN',
    latviaTitle: 'Latvia Property & Residence Planning',
    latviaBody: [
      'Latvia is a member state of the European Union and the Schengen Area, offering internationally mobile clients access to the European market and Schengen travel zone. Property acquisition in Latvia may be relevant for clients considering European residence, investment planning or family relocation, depending on the client\'s specific circumstances and the current legal framework.',
      'Any potential link between property purchase and residence planning must be assessed against the current Latvian immigration laws, applicable investment thresholds, state duties, property valuation and cadastral requirements. Rules in this area have changed in recent years and must be verified before any commitment is made. Legal due diligence is essential before any reservation, deposit or purchase agreement is signed.',
      'Source of funds and the fund-transfer route must be documented clearly and in compliance with Latvian banking and anti-money-laundering requirements. Family inclusion conditions and permit renewal requirements should be reviewed carefully before any financial commitment.',
    ],
    latviaServices: ['Property route assessment', 'Coordination with local real estate lawyers', 'Due diligence checklist', 'Review of purchase structure', 'Source-of-funds file preparation', 'Banking and transfer preparation', 'Residence application coordination', 'Family relocation planning'],
    latviaFee: 'Legal fees, notary fees, property taxes, government fees, bank charges, valuation fees, translation fees, local counsel fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    hungaryLabel: 'EU & SCHENGEN',
    hungaryTitle: 'Hungary Property & Guest Investor Planning',
    hungaryBody: [
      'Hungary is a member state of the European Union and the Schengen Area. For internationally mobile clients, Hungary may offer a combination of investment-linked residence planning, European access and lifestyle benefits. Hungary\'s guest investor residence framework should be checked carefully against the latest official Hungarian rules before any action is taken.',
      'Qualifying investment under the current Hungarian framework may involve regulated investment fund structures rather than direct residential property purchase. Residential property may nonetheless be relevant for accommodation, address registration and lifestyle purposes. All investment and residence planning must be coordinated carefully with Hungarian lawyers, tax advisers, fund managers and immigration professionals before any financial commitment is made.',
      'No property or investment should be purchased before legal eligibility, investment compliance and immigration suitability have been confirmed by qualified professionals.',
    ],
    hungaryServices: ['Hungary route assessment', 'Coordination with Hungarian legal professionals', 'Investment structure review', 'Property and lifestyle planning', 'Banking and compliance preparation', 'Family residence strategy', 'Document coordination', 'Post-arrival support'],
    hungaryFee: 'Legal fees, government fees, fund charges, bank charges, property costs, tax adviser fees, local counsel fees, translation fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees.',
    servicesTitle: 'How PLUCO GROUP May Assist',
    feeLabel: 'Fee Disclaimer:',
    globalFee: 'Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.',
  },
  fa: {
    box1Title: 'برنامه‌ریزی ملک و اقامت لتونی',
    box1Desc: 'برای موکلینی که خرید ملک در لتونی را به عنوان بخشی از استراتژی گسترده‌تر اقامت اروپایی، سرمایه‌گذاری و جابجایی خانوادگی بررسی می‌کنند.',
    box2Title: 'برنامه‌ریزی ملک و سرمایه‌گذار مهمان مجارستان',
    box2Desc: 'برای موکلینی که مجارستان را به عنوان مقصد اقامت، سرمایه‌گذاری و جابجایی خانوادگی، از جمله برنامه‌ریزی اقامت سرمایه‌گذار مهمان در صورت وجود قانونی، بررسی می‌کنند.',
    latviaLabel: 'اروپا و شنگن',
    latviaTitle: 'برنامه‌ریزی ملک و اقامت لتونی',
    latviaBody: [
      'لتونی عضو اتحادیه اروپا و منطقه شنگن است و به موکلین متحرک بین‌المللی دسترسی به بازار اروپا و منطقه سفر شنگن را ارائه می‌دهد. خرید ملک در لتونی ممکن است برای موکلینی که اقامت اروپایی، برنامه‌ریزی سرمایه‌گذاری یا جابجایی خانوادگی را بررسی می‌کنند مرتبط باشد.',
      'هرگونه ارتباط احتمالی بین خرید ملک و برنامه‌ریزی اقامت باید در برابر قوانین مهاجرتی فعلی لتونی، آستانه‌های سرمایه‌گذاری قابل اجرا، عوارض دولتی، ارزیابی ملک و الزامات کاداسترال ارزیابی شود. قبل از هرگونه رزرو، سپرده‌گذاری یا امضای قرارداد خرید، بررسی حقوقی دقیق ضروری است.',
      'منبع وجوه و مسیر انتقال وجه باید به وضوح و مطابق با الزامات بانکی و ضد پولشویی لتونی مستند باشند. شرایط الحاق خانواده و الزامات تمدید مجوز باید قبل از هرگونه تعهد مالی بررسی شوند.',
    ],
    latviaServices: ['ارزیابی مسیر ملکی', 'هماهنگی با وکلای محلی معاملات ملک', 'چک‌لیست بررسی دقیق', 'بررسی ساختار خرید', 'آماده‌سازی پرونده منبع وجوه', 'آماده‌سازی بانکی و انتقال', 'هماهنگی درخواست اقامت', 'برنامه‌ریزی جابجایی خانوادگی'],
    latviaFee: 'حق‌الوکاله، حق دفترخانه، مالیات ملک، هزینه‌های دولتی، کارمزد بانک، هزینه‌های ارزیابی، هزینه‌های ترجمه، هزینه‌های وکیل محلی و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    hungaryLabel: 'اروپا و شنگن',
    hungaryTitle: 'برنامه‌ریزی ملک و سرمایه‌گذار مهمان مجارستان',
    hungaryBody: [
      'مجارستان عضو اتحادیه اروپا و منطقه شنگن است. برای موکلین متحرک بین‌المللی، مجارستان ممکن است ترکیبی از برنامه‌ریزی اقامت مرتبط با سرمایه‌گذاری، دسترسی اروپایی و مزایای سبک زندگی ارائه دهد. چارچوب اقامت سرمایه‌گذار مهمان مجارستان باید قبل از هر اقدامی با آخرین قوانین رسمی مجارستانی تأیید شود.',
      'سرمایه‌گذاری واجد شرایط در چارچوب فعلی مجارستان ممکن است شامل ساختارهای صندوق سرمایه‌گذاری تنظیم‌شده به جای خرید مستقیم ملک مسکونی باشد. ملک مسکونی با این حال ممکن است برای اهداف اقامت، ثبت آدرس و سبک زندگی مرتبط باشد.',
      'هیچ ملک یا سرمایه‌گذاری نباید قبل از تأیید واجد شرایط بودن حقوقی، انطباق سرمایه‌گذاری و تناسب مهاجرتی توسط متخصصان واجد شرایط خریداری شود.',
    ],
    hungaryServices: ['ارزیابی مسیر مجارستان', 'هماهنگی با متخصصان حقوقی مجارستانی', 'بررسی ساختار سرمایه‌گذاری', 'برنامه‌ریزی ملک و سبک زندگی', 'آماده‌سازی بانکی و انطباقی', 'استراتژی اقامت خانوادگی', 'هماهنگی اسناد', 'پشتیبانی پس از ورود'],
    hungaryFee: 'حق‌الوکاله، هزینه‌های دولتی، کارمزد صندوق، کارمزد بانک، هزینه‌های ملک، هزینه‌های مشاور مالیاتی، هزینه‌های وکیل محلی، هزینه‌های ترجمه و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
    servicesTitle: 'روش‌های پشتیبانی PLUCO GROUP',
    feeLabel: 'سلب مسئولیت هزینه‌ها:',
    globalFee: 'حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.',
  },
};

export default function EUPropertyPurchase() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const c = isRTL ? content.fa : content.en;

  const renderSection = (
    id: string,
    bg: string,
    eyebrow: string,
    title: string,
    body: string[],
    servicesTitle: string,
    services: string[],
    fee: string,
    feeLabel: string,
  ) => (
    <section id={id} className="py-20" style={{ backgroundColor: bg }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{eyebrow}</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{title}</h2>
          <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
          {body.map((para, i) => <p key={i} className="text-sm leading-relaxed mb-4" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>{para}</p>)}
          <h3 className="text-base font-serif font-semibold mb-3 mt-6" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{servicesTitle}</h3>
          <ul className="text-sm space-y-1.5 mb-6" style={{ color: '#374151' }}>
            {services.map(item => <li key={item} className="flex items-start gap-2"><span style={{ color: '#C9A35A' }}>·</span><span style={{ fontFamily: isRTL ? ff : undefined }}>{item}</span></li>)}
          </ul>
          <p className="text-xs leading-relaxed p-4 rounded-lg" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{feeLabel} </strong>{fee}
          </p>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'ملک در اروپا' : 'EU PROPERTY'}
        title={isRTL ? 'خرید ملک اروپایی با دقت حقوقی، استراتژی اقامت و مراقبت از موکلین خصوصی' : 'European Property Acquisition with Legal Precision, Residency Strategy and Private Client Care'}
        subtitle={isRTL ? 'PLUCO GROUP به موکلین بین‌المللی در زمینه برنامه‌ریزی خرید ملک اروپایی، هماهنگی بررسی حقوقی دقیق، مستندات انتقال وجه و استراتژی‌های ملکی مرتبط با اقامت کمک می‌کند.' : 'PLUCO GROUP assists international clients with European property purchase planning, legal due diligence coordination, fund-transfer documentation and residence-linked property strategies.'}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ title: c.box1Title, desc: c.box1Desc, href: '#latvia' }, { title: c.box2Title, desc: c.box2Desc, href: '#hungary' }].map((item, index) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300 group">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-[#C9A35A] transition-colors" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{item.desc}</p>
                <a href={item.href} className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#C9A35A' }}>
                  <span style={{ fontFamily: isRTL ? ff : undefined }}>{isRTL ? 'بیشتر بدانید' : 'Learn More'}</span>
                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {renderSection('latvia', '#F8F9FA', c.latviaLabel, c.latviaTitle, c.latviaBody, c.servicesTitle, c.latviaServices, c.latviaFee, c.feeLabel)}
      {renderSection('hungary', '#FFFFFF', c.hungaryLabel, c.hungaryTitle, c.hungaryBody, c.servicesTitle, c.hungaryServices, c.hungaryFee, c.feeLabel)}

      <section className="py-8 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            <strong>{c.feeLabel} </strong>{c.globalFee}
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
