import { mkdirSync, writeFileSync } from 'node:fs';

const clusters = [
  ['spain-digital-nomad', 'Spain digital nomad residence', 'ویزای دیجیتال نومد اسپانیا', 'Spain', '/spain-digital-nomad-visa'],
  ['spain-family-relocation', 'Family relocation to Spain', 'مهاجرت خانوادگی به اسپانیا', 'Spain', '/spain-digital-nomad-visa'],
  ['spain-property', 'Buying property in Spain', 'خرید ملک در اسپانیا', 'Spain', '/eu-property-purchase'],
  ['spain-private-life', 'Private and Mediterranean life in Spain', 'زندگی خصوصی و مدیترانه‌ای در اسپانیا', 'Spain', '/eu-residency'],
  ['spain-travel', 'Travel to Spain for Iranian citizens', 'سفر ایرانیان به اسپانیا', 'Spain', '/eu-residency'],
  ['spain-banking', 'Banking and funds in Spain', 'بانک و انتقال وجوه در اسپانیا', 'Spain', '/banking'],
  ['spain-business', 'Building a business base in Spain', 'ایجاد پایگاه کسب‌وکار در اسپانیا', 'Spain', '/business-solutions'],
  ['eu-residence', 'Choosing a European residence route', 'انتخاب مسیر اقامت اروپا', 'European Union', '/eu-residency'],
  ['eu-family-mobility', 'European family mobility planning', 'برنامه‌ریزی تحرک خانوادگی در اروپا', 'European Union', '/new-identity'],
  ['eu-banking', 'European banking for Iranian nationals', 'بانکداری اروپایی برای ایرانیان', 'European Union', '/banking'],
  ['source-of-funds', 'Source-of-funds and source-of-wealth preparation', 'آماده‌سازی منشأ وجوه و ثروت', 'Cross-border', '/banking-compliance'],
  ['eu-company', 'European company formation', 'ثبت شرکت در اروپا', 'European Union', '/eu-company-registration'],
  ['poland-founders', 'Poland company and founder planning', 'شرکت و برنامه‌ریزی بنیان‌گذار در لهستان', 'Poland', '/eu-company-registration'],
  ['france-talent', 'France professional and talent residence', 'اقامت حرفه‌ای و استعداد فرانسه', 'France', '/eu-residency'],
  ['france-private-life', 'Private life and business in France', 'زندگی خصوصی و کسب‌وکار در فرانسه', 'France', '/eu-residency'],
  ['greece-residence', 'Greece residence and property planning', 'برنامه‌ریزی اقامت و ملک یونان', 'Greece', '/eu-residency'],
  ['greece-lifestyle', 'Island, city and family life in Greece', 'زندگی خانوادگی، شهری و جزیره‌ای در یونان', 'Greece', '/eu-residency'],
  ['latvia-residence', 'Latvia residence and business planning', 'برنامه‌ریزی اقامت و کسب‌وکار لتونی', 'Latvia', '/eu-residency'],
  ['hungary-residence', 'Hungary residence and investment planning', 'برنامه‌ریزی اقامت و سرمایه‌گذاری مجارستان', 'Hungary', '/eu-residency'],
  ['portugal-mobility', 'Portugal residence and lifestyle planning', 'برنامه‌ریزی اقامت و سبک زندگی پرتغال', 'Portugal', '/eu-residency'],
  ['us-eb5', 'United States EB-5 planning', 'برنامه‌ریزی EB-5 آمریکا', 'United States', '/us-green-card'],
  ['international-contracts', 'International contracts for mobile founders', 'قراردادهای بین‌المللی برای بنیان‌گذاران', 'Cross-border', '/international-contracts'],
  ['cross-border-disputes', 'Cross-border dispute strategy', 'راهبرد اختلافات بین‌المللی', 'Cross-border', '/dispute-resolution'],
  ['financial-exclusion', 'Financial exclusion and banking discrimination', 'محرومیت مالی و تبعیض بانکی', 'Europe', '/financial-discrimination'],
  ['private-client-architecture', 'Private-client mobility architecture', 'ساختار تحرک موکل خصوصی', 'Global', '/new-identity'],
];

const angles = [
  ['current-rule briefing', 'مرور مقررات جاری'],
  ['eligibility decision framework', 'چارچوب تصمیم‌گیری برای احراز شرایط'],
  ['document preparation map', 'نقشه آماده‌سازی مدارک'],
  ['Iranian applicant evidence issues', 'چالش‌های اثباتی متقاضی ایرانی'],
  ['family and dependent planning', 'برنامه‌ریزی خانواده و افراد وابسته'],
  ['banking and payment readiness', 'آمادگی بانکی و پرداخت'],
  ['source-of-funds preparation', 'آماده‌سازی منشأ وجوه'],
  ['tax questions to resolve before acting', 'پرسش‌های مالیاتی پیش از اقدام'],
  ['Social Security and insurance questions', 'پرسش‌های بیمه و تأمین اجتماعی'],
  ['common myths and misleading promises', 'باورهای نادرست و وعده‌های گمراه‌کننده'],
  ['ten preventable file mistakes', 'ده اشتباه قابل پیشگیری در پرونده'],
  ['timeline and professional coordination', 'زمان‌بندی و هماهنگی حرفه‌ای'],
  ['private-client risk checklist', 'چک‌لیست ریسک موکل خصوصی'],
  ['family lifestyle and city selection', 'سبک زندگی خانواده و انتخاب شهر'],
  ['housing and arrival planning', 'برنامه‌ریزی مسکن و ورود'],
  ['what happens after approval', 'اقدامات پس از موافقت'],
  ['renewal and long-term planning', 'تمدید و برنامه‌ریزی بلندمدت'],
  ['comparison with adjacent routes', 'مقایسه با مسیرهای نزدیک'],
  ['case-study questions without outcome claims', 'پرسش‌های مطالعه موردی بدون ادعای نتیجه'],
  ['annual review and official-source update', 'بازبینی سالانه و به‌روزرسانی منابع رسمی'],
];

const backlog = clusters.flatMap(([cluster, enSubject, faSubject, country, servicePath]) =>
  angles.map(([enAngle, faAngle], angleIndex) => ({
    id: `${cluster}-${String(angleIndex + 1).padStart(2, '0')}`,
    cluster,
    country,
    servicePath,
    titleEn: `${enSubject}: ${enAngle}`,
    titleFa: `${faSubject}؛ ${faAngle}`,
    status: 'planned',
    indexable: false,
    requiredBeforePublication: [
      'primary-source research',
      'English and Persian editorial review',
      'regulated-claims review',
      'distinct article body',
      'original editorial image and localized alt text',
      'internal-link and search-intent check',
      'review date and update owner',
    ],
  })),
);

if (backlog.length !== 500) throw new Error(`Expected 500 topics, received ${backlog.length}`);

mkdirSync('docs', { recursive: true });
writeFileSync(
  'docs/pluco-insights-backlog.json',
  `${JSON.stringify({ generatedOn: '2026-08-08', publicationPolicy: 'Draft inventory only. Nothing becomes indexable without all required checks.', count: backlog.length, topics: backlog }, null, 2)}\n`,
);

console.log(`Generated ${backlog.length} private editorial topics.`);
