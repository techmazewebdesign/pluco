'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import LegalDisclaimer from '@/components/shared/LegalDisclaimer';
import { useLanguage } from '@/contexts/LanguageContext';

const content = {
  en: {
    eyebrow: 'INTERNATIONAL MOBILITY PLANNING',
    title: 'International Mobility and Nationality Planning for Private Clients and Families',
    subtitle:
      'PLUCO GROUP helps internationally mobile clients organise residence, nationality, family, documentation and compliance questions before they select a route or make a financial commitment.',
    cards: [
      {
        title: 'Current-Status Review',
        description: 'Map existing nationalities, residence rights, family relationships and travel constraints.',
        href: '#status-review',
      },
      {
        title: 'Family Mobility Strategy',
        description: 'Coordinate the needs of spouses, children and dependants across relevant jurisdictions.',
        href: '#family-strategy',
      },
      {
        title: 'Compliance Preparation',
        description: 'Organise identity, source-of-funds, tax-residence and background evidence before formal advice.',
        href: '#compliance',
      },
      {
        title: 'Independent Route Verification',
        description: 'Confirm current rules with qualified professionals and competent authorities before proceeding.',
        href: '#verification',
      },
    ],
    sections: [
      {
        id: 'status-review',
        label: 'START WITH THE FACTS',
        title: 'Build a clear picture of your current legal position',
        paragraphs: [
          'Mobility planning begins with the rights and obligations a person already has. Nationality, lawful residence, habitual residence, family status, employment, business ownership and tax residence may each affect which options can be considered.',
          'PLUCO GROUP can help organise this information into a structured brief for review by appropriately qualified immigration, nationality, tax or local counsel. This preliminary work does not determine eligibility or replace jurisdiction-specific legal advice.',
        ],
        items: [
          'Current and previous nationalities and passports',
          'Residence permits, visas and physical-presence history',
          'Family members, dependants and custody considerations',
          'Employment, company ownership and professional activity',
        ],
      },
      {
        id: 'family-strategy',
        label: 'FAMILY COORDINATION',
        title: 'Plan for the whole family, not a single document',
        paragraphs: [
          'A route that appears workable for one person may create different conditions for a spouse, child or dependant. Education, healthcare, work rights, residence continuity and long-term family objectives should be considered together.',
          'The appropriate path depends on verified current law and personal facts. PLUCO GROUP does not promote or recommend a nationality or investment programme on this page and does not guarantee residence, citizenship, passport or travel outcomes.',
        ],
        items: [
          'Family composition and dependency evidence',
          'Education, healthcare and work-right priorities',
          'Renewal, physical-presence and continuity questions',
          'Succession and long-term family planning considerations',
        ],
      },
      {
        id: 'compliance',
        label: 'EVIDENCE AND COMPLIANCE',
        title: 'Prepare a transparent, reviewable evidence file',
        paragraphs: [
          'Identity and mobility matters can involve enhanced due diligence, sanctions screening, tax questions and source-of-funds review. Documents should be complete, consistent and traceable before they are provided to an authority, bank or professional adviser.',
          'No document should be altered, concealed or presented outside its proper context. Where a matter involves sanctions, tax, criminal-record, nationality-loss or investment risk, independent advice from the relevant regulated professional is essential before any commitment.',
        ],
        items: [
          'Civil-status, identity and address records',
          'Source-of-funds and source-of-wealth evidence',
          'Tax residence and financial-history documents',
          'Certified translation and document-validity planning',
        ],
      },
      {
        id: 'verification',
        label: 'BEFORE YOU PROCEED',
        title: 'Verify the route, adviser and authority independently',
        paragraphs: [
          'Programme rules, nationality restrictions, fees, processing practices and authorised-provider lists can change. Before signing an agreement or transferring funds, confirm the current position directly with the competent authority and appropriately licensed professionals.',
          'PLUCO GROUP may coordinate an initial fact review and specialist handoff where appropriate. Formal work begins only after scope, professional responsibility, conflicts, compliance requirements and applicable fees are documented in writing.',
        ],
        items: [
          'Confirm the competent government authority',
          'Verify every agent or professional licence',
          'Obtain a written scope and complete fee schedule',
          'Do not rely on guaranteed approvals or travel benefits',
        ],
      },
    ],
  },
  fa: {
    eyebrow: 'برنامه‌ریزی تحرک بین‌المللی',
    title: 'برنامه‌ریزی تحرک بین‌المللی و وضعیت تابعیتی برای افراد و خانواده‌ها',
    subtitle:
      'PLUCO GROUP به موکلین بین‌المللی کمک می‌کند پیش از انتخاب مسیر یا هر تعهد مالی، پرسش‌های مربوط به اقامت، تابعیت، خانواده، مدارک و انطباق را به‌صورت منظم بررسی کنند.',
    cards: [
      {
        title: 'بررسی وضعیت فعلی',
        description: 'ثبت تابعیت‌ها، حقوق اقامتی، روابط خانوادگی و محدودیت‌های سفر موجود.',
        href: '#status-review',
      },
      {
        title: 'راهبرد تحرک خانوادگی',
        description: 'هماهنگی نیازهای همسر، فرزندان و افراد تحت تکفل در حوزه‌های قضایی مرتبط.',
        href: '#family-strategy',
      },
      {
        title: 'آماده‌سازی انطباق',
        description: 'سامان‌دهی مدارک هویتی، منبع وجوه، اقامت مالیاتی و سوابق پیش از مشاوره رسمی.',
        href: '#compliance',
      },
      {
        title: 'تأیید مستقل مسیر',
        description: 'تأیید مقررات روز با متخصصان واجد صلاحیت و مراجع صالح پیش از اقدام.',
        href: '#verification',
      },
    ],
    sections: [
      {
        id: 'status-review',
        label: 'شروع با واقعیت‌ها',
        title: 'تصویر روشنی از وضعیت حقوقی فعلی خود بسازید',
        paragraphs: [
          'برنامه‌ریزی تحرک با حقوق و تعهداتی آغاز می‌شود که شخص هم‌اکنون دارد. تابعیت، اقامت قانونی، محل سکونت معمول، وضعیت خانوادگی، اشتغال، مالکیت شرکت و اقامت مالیاتی می‌توانند بر گزینه‌های قابل بررسی اثر بگذارند.',
          'PLUCO GROUP می‌تواند این اطلاعات را برای بررسی توسط متخصص واجد صلاحیت مهاجرت، تابعیت، مالیات یا وکیل محلی در قالب یک پرونده منظم آماده کند. این مرحله مقدماتی، اهلیت را تعیین نمی‌کند و جایگزین مشاوره حقوقی مربوط به کشور مقصد نیست.',
        ],
        items: ['تابعیت‌ها و گذرنامه‌های فعلی و پیشین', 'مجوزهای اقامت، ویزاها و سابقه حضور', 'اعضای خانواده، افراد تحت تکفل و ملاحظات حضانت', 'اشتغال، مالکیت شرکت و فعالیت حرفه‌ای'],
      },
      {
        id: 'family-strategy',
        label: 'هماهنگی خانوادگی',
        title: 'برای کل خانواده برنامه‌ریزی کنید، نه فقط یک مدرک',
        paragraphs: [
          'مسیری که برای یک نفر قابل بررسی است ممکن است برای همسر، فرزند یا فرد تحت تکفل شرایط متفاوتی ایجاد کند. آموزش، درمان، حق کار، تداوم اقامت و اهداف بلندمدت خانواده باید در کنار هم بررسی شوند.',
          'مسیر مناسب به قانون روز و واقعیت‌های شخصی بستگی دارد. PLUCO GROUP در این صفحه هیچ برنامه تابعیت یا سرمایه‌گذاری را تبلیغ یا توصیه نمی‌کند و نتیجه اقامت، تابعیت، گذرنامه یا سفر را تضمین نمی‌کند.',
        ],
        items: ['ترکیب خانواده و مدارک وابستگی', 'اولویت‌های آموزش، درمان و حق کار', 'تمدید، حضور فیزیکی و تداوم وضعیت', 'ملاحظات جانشینی و برنامه‌ریزی بلندمدت خانواده'],
      },
      {
        id: 'compliance',
        label: 'مدارک و انطباق',
        title: 'یک پرونده شفاف و قابل بررسی آماده کنید',
        paragraphs: [
          'امور هویتی و تحرک بین‌المللی ممکن است شامل بررسی دقیق پیشرفته، کنترل تحریم، مسائل مالیاتی و بررسی منبع وجوه باشند. مدارک باید پیش از ارائه به مرجع دولتی، بانک یا مشاور حرفه‌ای کامل، هماهنگ و قابل ردیابی باشند.',
          'هیچ مدرکی نباید تغییر داده، پنهان یا خارج از زمینه صحیح ارائه شود. در موارد مرتبط با تحریم، مالیات، سوءپیشینه، از دست‌دادن تابعیت یا ریسک سرمایه‌گذاری، دریافت نظر مستقل از متخصص دارای مجوز پیش از هر تعهد ضروری است.',
        ],
        items: ['مدارک ثبت احوال، هویت و نشانی', 'مدارک منبع وجوه و منبع ثروت', 'اسناد اقامت مالیاتی و سابقه مالی', 'برنامه‌ریزی ترجمه رسمی و اعتبار مدارک'],
      },
      {
        id: 'verification',
        label: 'پیش از اقدام',
        title: 'مسیر، مشاور و مرجع را به‌طور مستقل تأیید کنید',
        paragraphs: [
          'مقررات، محدودیت‌های تابعیتی، هزینه‌ها، رویه‌های بررسی و فهرست ارائه‌دهندگان مجاز ممکن است تغییر کنند. پیش از امضای قرارداد یا انتقال وجه، وضعیت روز را مستقیماً با مرجع صالح و متخصصان دارای مجوز تأیید کنید.',
          'PLUCO GROUP در صورت مناسب‌بودن می‌تواند بررسی اولیه واقعیت‌ها و ارجاع به متخصص را هماهنگ کند. کار رسمی تنها پس از ثبت کتبی دامنه، مسئولیت حرفه‌ای، تعارض منافع، الزامات انطباق و هزینه‌ها آغاز می‌شود.',
        ],
        items: ['مرجع دولتی صالح را تأیید کنید', 'مجوز هر عامل یا متخصص را بررسی کنید', 'دامنه کار و جدول کامل هزینه‌ها را کتبی دریافت کنید', 'به وعده تضمین تأیید یا مزایای سفر اتکا نکنید'],
      },
    ],
  },
} as const;

export default function NewIdentity() {
  const { isRTL } = useLanguage();
  const page = isRTL ? content.fa : content.en;
  const fontFamily = isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined;

  return (
    <div className="min-h-screen bg-white">
      <PageHero eyebrow={page.eyebrow} title={page.title} subtitle={page.subtitle} />

      <section className="bg-white py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {page.cards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="flex flex-col rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-3 font-serif text-lg font-bold text-[#1E2430]" style={{ fontFamily }}>{card.title}</h2>
              <p className="mb-5 flex-grow text-sm leading-relaxed text-[#5E6470]" style={{ fontFamily }}>{card.description}</p>
              <a href={card.href} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7428]">
                <span style={{ fontFamily }}>{isRTL ? 'ادامه مطلب' : 'Continue'}</span>
                <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {page.sections.map((section, index) => (
        <section key={section.id} id={section.id} className={`py-20 ${index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-white'}`}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#9A7428]" style={{ fontFamily, letterSpacing: isRTL ? 'normal' : undefined }}>
              {section.label}
            </p>
            <h2 className="mb-4 font-serif text-2xl font-bold text-[#1E2430] md:text-3xl" style={{ fontFamily }}>{section.title}</h2>
            <div className="mb-6 h-px w-16 bg-[#C9A35A]" />
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 text-sm leading-7 text-[#374151]" style={{ fontFamily }}>{paragraph}</p>
            ))}
            <ul className="mt-6 grid gap-3 text-sm text-[#374151] sm:grid-cols-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-4">
                  <span className="text-[#9A7428]">•</span>
                  <span style={{ fontFamily }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
