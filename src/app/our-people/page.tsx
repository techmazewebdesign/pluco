'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const team = [
  {
    photo: '/images/members/Reza-ostad.JPG',
    nameEn: 'Reza Ostad',
    nameFa: 'رضا استاد',
    titleEn: 'Founder, CEO & Senior Partner',
    titleFa: 'بنیان‌گذار، مدیرعامل و شریک ارشد',
    credentialsEn: 'LLB | LLM | ICA / UK',
    credentialsFa: 'LLB | LLM | ICA / انگلستان',
    languagesEn: 'English, Farsi',
    languagesFa: 'انگلیسی، فارسی',
    areasEn: 'Cross-border legal advisory · Banking discrimination · Private client relocation · International contracts · Compliance strategy · Source-of-funds documentation',
    areasFa: 'مشاوره حقوقی بین‌المللی · تبعیض بانکی · جابجایی موکلین خصوصی · قراردادهای بین‌المللی · استراتژی انطباق · مستندسازی منبع وجوه',
    bioEn: 'International legal, banking, compliance and private client advisory professional. Founder and CEO of PLUCO GROUP. Reza advises internationally mobile clients on European immigration, residency planning, banking compliance, financial exclusion, international contracts and high-net-worth private client matters. He has extensive experience advising clients from complex jurisdictions on lawful fund documentation, source-of-wealth strategy and cross-border legal coordination.',
    bioFa: 'متخصص حقوق بین‌الملل، بانکداری، انطباق و مشاوره موکلین خصوصی. بنیان‌گذار و مدیرعامل PLUCO GROUP. رضا موکلین متحرک بین‌المللی را در زمینه مهاجرت اروپایی، برنامه‌ریزی اقامت، انطباق بانکی، محرومیت مالی، قراردادهای بین‌المللی و امور موکلین با ارزش خالص بالا مشاوره می‌دهد. او تجربه گسترده‌ای در مشاوره به موکلین از حوزه‌های قضایی پیچیده در زمینه مستندسازی قانونی وجوه، استراتژی منبع ثروت و هماهنگی حقوقی بین‌المللی دارد.',
  },
  {
    photo: '/images/members/Sara-Rezaei.PNG',
    nameEn: 'Sara Rezaie',
    nameFa: 'سارا رضایی',
    titleEn: 'Document Handling Manager',
    titleFa: 'مدیر امور اسناد',
    credentialsEn: 'BA English Literature',
    credentialsFa: 'کارشناسی ادبیات انگلیسی',
    languagesEn: 'English, Farsi',
    languagesFa: 'انگلیسی، فارسی',
    areasEn: 'Client documentation · File organisation · Translation coordination · Internal case administration · Communication support',
    areasFa: 'مستندات موکل · سازماندهی پرونده · هماهنگی ترجمه · مدیریت داخلی پرونده · پشتیبانی ارتباطی',
    bioEn: 'Responsible for client documentation, file organisation, document handling, translation coordination, internal case administration and communication support for private client matters. Sara ensures that client files are prepared, organised and managed with precision and confidentiality.',
    bioFa: 'مسئول مستندات موکل، سازماندهی پرونده، مدیریت اسناد، هماهنگی ترجمه، مدیریت داخلی پرونده و پشتیبانی ارتباطی در امور موکلین خصوصی. سارا اطمینان حاصل می‌کند که پرونده‌های موکلین با دقت و رازداری کامل آماده، سازماندهی و مدیریت می‌شوند.',
  },
  {
    photo: '/images/members/Mohammad-hossein-heidarpour.JPG',
    nameEn: 'Mohammad Hossein Heidarpour',
    nameFa: 'محمد حسین حیدرپور',
    titleEn: 'Iranian Certified Attorney-at-Law',
    titleFa: 'وکیل پایه یک دادگستری ایران',
    credentialsEn: 'LLB | LLM | PhD Candidate in Law',
    credentialsFa: 'کارشناسی حقوق | کارشناسی ارشد حقوق | دکتری حقوق (در حال تحصیل)',
    languagesEn: 'Farsi, English',
    languagesFa: 'فارسی، انگلیسی',
    areasEn: 'International business law · Innovation · Technology-related legal matters · Dispute resolution',
    areasFa: 'حقوق تجاری بین‌المللی · نوآوری · مسائل حقوقی مرتبط با فناوری · حل اختلاف',
    bioEn: 'Iranian certified attorney-at-law with academic and professional focus on international business law, innovation, technology-related legal matters and dispute resolution. Currently pursuing doctoral research in law. Mohammad Hossein provides specialist support on matters requiring deep knowledge of Iranian law and international business legal frameworks.',
    bioFa: 'وکیل پایه یک دادگستری ایران با تمرکز علمی و حرفه‌ای بر حقوق تجاری بین‌المللی، نوآوری، مسائل حقوقی مرتبط با فناوری و حل اختلاف. در حال انجام پژوهش دکتری در حقوق. محمد حسین پشتیبانی تخصصی در مواردی که نیاز به دانش عمیق از حقوق ایران و چارچوب‌های حقوقی تجاری بین‌المللی دارند، ارائه می‌دهد.',
  },
  {
    photo: '/images/members/Holly_Gilani.PNG',
    nameEn: 'Holly Gilani',
    nameFa: 'هولی گیلانی',
    titleEn: 'International Lawyer and Arbitrator',
    titleFa: 'وکیل بین‌المللی و داور',
    credentialsEn: 'LLM Harvard Law School | JD Whittier Law School | Member of the State of California and Washington DC Bars | Certified IICRA Arbitrator',
    credentialsFa: 'LLM دانشکده حقوق هاروارد | JD دانشکده حقوق ویتیر | عضو کانون وکلای کالیفرنیا و واشنگتن دی‌سی | داور معتمد IICRA',
    languagesEn: 'English, Farsi',
    languagesFa: 'انگلیسی، فارسی',
    areasEn: 'International legal matters · Dispute resolution · Arbitration · Cross-border advisory',
    areasFa: 'امور حقوقی بین‌المللی · حل اختلاف · داوری · مشاوره بین‌المللی',
    bioEn: 'US-qualified lawyer and certified arbitrator with experience in international legal matters, dispute resolution, arbitration and cross-border advisory work. Holly is a member of the California and Washington DC Bars and holds a Master of Laws degree from Harvard Law School. She supports PLUCO GROUP clients on international arbitration, US-facing legal matters and cross-border dispute coordination.',
    bioFa: 'وکیل واجد شرایط آمریکایی و داور معتمد با تجربه در امور حقوقی بین‌المللی، حل اختلاف، داوری و کار مشاوره بین‌المللی. هولی عضو کانون وکلای کالیفرنیا و واشنگتن دی‌سی است و دارای مدرک کارشناسی ارشد حقوق از دانشکده حقوق هاروارد است. او از موکلین PLUCO GROUP در زمینه داوری بین‌المللی، امور حقوقی مرتبط با آمریکا و هماهنگی اختلافات بین‌المللی پشتیبانی می‌کند.',
  },
];

const fa = {
  eyebrow: 'تیم ما',
  title: 'متخصصان ارشد در امور موکلین خصوصی، مهاجرت، بانکداری و امور حقوقی بین‌المللی',
  subtitle: 'PLUCO GROUP متخصصان حقوقی، انطباق، مستندسازی، فناوری و مشاوره بین‌المللی را برای پشتیبانی از موکلین در مسائل پیچیده بین‌المللی گرد هم آورده است.',
  photoPending: 'عکس حرفه‌ای به زودی اضافه خواهد شد.',
  contactNote: 'برای استعلام مستقیم با ما از طریق',
  contactNote2: 'تماس بگیرید.',
  languages: 'زبان‌ها',
  areas: 'حوزه‌های تخصصی',
};

export default function OurPeople() {
  const { isRTL } = useLanguage();
  const d = isRTL ? fa : null;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? d!.eyebrow : 'OUR TEAM'}
        title={isRTL ? d!.title : 'Senior Professionals for Private Client, Immigration, Banking and Cross-Border Legal Matters'}
        subtitle={isRTL ? d!.subtitle : 'PLUCO GROUP brings together legal, compliance, documentation, technology and international advisory professionals to support clients with complex cross-border matters.'}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="space-y-12">
            {team.map((member, index) => (
              <motion.div
                key={member.nameEn}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.05, type: 'spring', stiffness: 100, damping: 15 }}
                className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`flex flex-col md:flex-row gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden relative flex-shrink-0" style={{ border: '2px solid #C9A35A' }}>
                      <Image
                        src={member.photo}
                        alt={member.nameEn}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-xl font-serif font-bold mb-1"
                      style={{
                        color: '#1E2430',
                        fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined,
                      }}
                    >
                      {isRTL ? member.nameFa : member.nameEn}
                    </h2>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
                      {isRTL ? member.titleFa : member.titleEn}
                    </p>
                    <p className="text-xs mb-3" style={{ color: '#5E6470' }}>
                      {isRTL ? member.credentialsFa : member.credentialsEn}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#071C3C', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                          {isRTL ? d!.languages : 'Languages'}
                        </p>
                        <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
                          {isRTL ? member.languagesFa : member.languagesEn}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#071C3C', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                          {isRTL ? d!.areas : 'Practice Areas'}
                        </p>
                        <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
                          {isRTL ? member.areasFa : member.areasEn}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
                      {isRTL ? member.bioFa : member.bioEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
          <p className="text-xs" style={{ color: '#94A3B8', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}>
            {isRTL
              ? <>عکس‌های حرفه‌ای به هر پروفایل اضافه خواهند شد. برای استعلام مستقیم، لطفاً با <a href="mailto:info@plucogroup.com" className="underline hover:text-gray-600" style={{ color: '#5E6470' }}>info@plucogroup.com</a> تماس بگیرید.</>
              : <>Professional photography will be added to each profile. For direct enquiries, please contact <a href="mailto:info@plucogroup.com" className="underline hover:text-gray-600" style={{ color: '#5E6470' }}>info@plucogroup.com</a>.</>
            }
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
