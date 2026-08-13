export type PlucoPerson = {
  slug: string;
  photo: string;
  nameEn: string;
  nameFa: string;
  titleEn: string;
  titleFa: string;
  credentialsEn: string;
  credentialsFa: string;
  languagesEn: string[];
  languagesFa: string[];
  areasEn: string[];
  areasFa: string[];
  bioEn: string;
  bioFa: string;
};

export const PLUCO_PEOPLE: PlucoPerson[] = [
  {
    slug: 'reza-ostad',
    photo: '/images/members/Reza-ostad.JPG',
    nameEn: 'Reza Ostad',
    nameFa: 'رضا استاد',
    titleEn: 'Founder, CEO & Senior Partner',
    titleFa: 'بنیان‌گذار، مدیرعامل و شریک ارشد',
    credentialsEn: 'LLB | LLM | ICA / UK',
    credentialsFa: 'LLB | LLM | ICA / انگلستان',
    languagesEn: ['English', 'Farsi'],
    languagesFa: ['انگلیسی', 'فارسی'],
    areasEn: ['Cross-border legal advisory', 'Banking discrimination', 'Private client relocation', 'International contracts', 'Compliance strategy', 'Source-of-funds documentation'],
    areasFa: ['مشاوره حقوقی بین‌المللی', 'تبعیض بانکی', 'جابجایی موکلین خصوصی', 'قراردادهای بین‌المللی', 'استراتژی انطباق', 'مستندسازی منبع وجوه'],
    bioEn: 'International legal, banking, compliance and private client advisory professional. Founder and CEO of PLUCO GROUP. Reza advises internationally mobile clients on European immigration, residency planning, banking compliance, financial exclusion, international contracts and high-net-worth private client matters. He has extensive experience advising clients from complex jurisdictions on lawful fund documentation, source-of-wealth strategy and cross-border legal coordination.',
    bioFa: 'متخصص حقوق بین‌الملل، بانکداری، انطباق و مشاوره موکلین خصوصی. بنیان‌گذار و مدیرعامل PLUCO GROUP. رضا موکلین متحرک بین‌المللی را در زمینه مهاجرت اروپایی، برنامه‌ریزی اقامت، انطباق بانکی، محرومیت مالی، قراردادهای بین‌المللی و امور موکلین با ارزش خالص بالا مشاوره می‌دهد. او تجربه گسترده‌ای در مشاوره به موکلین از حوزه‌های قضایی پیچیده در زمینه مستندسازی قانونی وجوه، استراتژی منبع ثروت و هماهنگی حقوقی بین‌المللی دارد.',
  },
  {
    slug: 'sara-rezaie',
    photo: '/images/members/Sara-Rezaei.PNG',
    nameEn: 'Sara Rezaie',
    nameFa: 'سارا رضایی',
    titleEn: 'Document Handling Manager',
    titleFa: 'مدیر امور اسناد',
    credentialsEn: 'BA English Literature',
    credentialsFa: 'کارشناسی ادبیات انگلیسی',
    languagesEn: ['English', 'Farsi'],
    languagesFa: ['انگلیسی', 'فارسی'],
    areasEn: ['Client documentation', 'File organisation', 'Translation coordination', 'Internal case administration', 'Communication support'],
    areasFa: ['مستندات موکل', 'سازماندهی پرونده', 'هماهنگی ترجمه', 'مدیریت داخلی پرونده', 'پشتیبانی ارتباطی'],
    bioEn: 'Responsible for client documentation, file organisation, document handling, translation coordination, internal case administration and communication support for private client matters. Sara ensures that client files are prepared, organised and managed with precision and confidentiality.',
    bioFa: 'مسئول مستندات موکل، سازماندهی پرونده، مدیریت اسناد، هماهنگی ترجمه، مدیریت داخلی پرونده و پشتیبانی ارتباطی در امور موکلین خصوصی. سارا اطمینان حاصل می‌کند که پرونده‌های موکلین با دقت و رازداری کامل آماده، سازماندهی و مدیریت می‌شوند.',
  },
  {
    slug: 'mohammad-hossein-heidarpour',
    photo: '/images/members/Mohammad-hossein-heidarpour.JPG',
    nameEn: 'Mohammad Hossein Heidarpour',
    nameFa: 'محمد حسین حیدرپور',
    titleEn: 'Iranian Certified Attorney-at-Law',
    titleFa: 'وکیل پایه یک دادگستری ایران',
    credentialsEn: 'LLB | LLM | PhD Candidate in Law',
    credentialsFa: 'کارشناسی حقوق | کارشناسی ارشد حقوق | دکتری حقوق (در حال تحصیل)',
    languagesEn: ['Farsi', 'English'],
    languagesFa: ['فارسی', 'انگلیسی'],
    areasEn: ['International business law', 'Innovation', 'Technology-related legal matters', 'Dispute resolution'],
    areasFa: ['حقوق تجاری بین‌المللی', 'نوآوری', 'مسائل حقوقی مرتبط با فناوری', 'حل اختلاف'],
    bioEn: 'Iranian certified attorney-at-law with academic and professional focus on international business law, innovation, technology-related legal matters and dispute resolution. Currently pursuing doctoral research in law. Mohammad Hossein provides specialist support on matters requiring deep knowledge of Iranian law and international business legal frameworks.',
    bioFa: 'وکیل پایه یک دادگستری ایران با تمرکز علمی و حرفه‌ای بر حقوق تجاری بین‌المللی، نوآوری، مسائل حقوقی مرتبط با فناوری و حل اختلاف. در حال انجام پژوهش دکتری در حقوق. محمد حسین پشتیبانی تخصصی در مواردی که نیاز به دانش عمیق از حقوق ایران و چارچوب‌های حقوقی تجاری بین‌المللی دارند، ارائه می‌دهد.',
  },
  {
    slug: 'holly-gilani',
    photo: '/images/members/Holly_Gilani.PNG',
    nameEn: 'Holly Gilani',
    nameFa: 'هولی گیلانی',
    titleEn: 'International Lawyer and Arbitrator',
    titleFa: 'وکیل بین‌المللی و داور',
    credentialsEn: 'LLM Harvard Law School | JD Whittier Law School | Member of the State of California and Washington DC Bars | Certified IICRA Arbitrator',
    credentialsFa: 'LLM دانشکده حقوق هاروارد | JD دانشکده حقوق ویتیر | عضو کانون وکلای کالیفرنیا و واشنگتن دی‌سی | داور معتمد IICRA',
    languagesEn: ['English', 'Farsi'],
    languagesFa: ['انگلیسی', 'فارسی'],
    areasEn: ['International legal matters', 'Dispute resolution', 'Arbitration', 'Cross-border advisory'],
    areasFa: ['امور حقوقی بین‌المللی', 'حل اختلاف', 'داوری', 'مشاوره بین‌المللی'],
    bioEn: 'US-qualified lawyer and certified arbitrator with experience in international legal matters, dispute resolution, arbitration and cross-border advisory work. Holly is a member of the California and Washington DC Bars and holds a Master of Laws degree from Harvard Law School. She supports PLUCO GROUP clients on international arbitration, US-facing legal matters and cross-border dispute coordination.',
    bioFa: 'وکیل واجد شرایط آمریکایی و داور معتمد با تجربه در امور حقوقی بین‌المللی، حل اختلاف، داوری و کار مشاوره بین‌المللی. هولی عضو کانون وکلای کالیفرنیا و واشنگتن دی‌سی است و دارای مدرک کارشناسی ارشد حقوق از دانشکده حقوق هاروارد است. او از موکلین PLUCO GROUP در زمینه داوری بین‌المللی، امور حقوقی مرتبط با آمریکا و هماهنگی اختلافات بین‌المللی پشتیبانی می‌کند.',
  },
];

export function getPlucoPerson(slug: string) {
  return PLUCO_PEOPLE.find((person) => person.slug === slug);
}
