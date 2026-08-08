export type InsightLocale = 'en' | 'fa';

export type LocalizedText = Record<InsightLocale, string>;

export type InsightSection = {
  heading: LocalizedText;
  paragraphs: Record<InsightLocale, string[]>;
  bullets?: Record<InsightLocale, string[]>;
};

export type InsightSource = {
  title: LocalizedText;
  publisher: LocalizedText;
  url: string;
};

export type PlucoInsight = {
  slug: string;
  category: LocalizedText;
  country: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  eyebrow: LocalizedText;
  introduction: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  publishedOn: string;
  reviewedOn: string;
  readTime: LocalizedText;
  keywords: Record<InsightLocale, string[]>;
  sections: InsightSection[];
  sources: InsightSource[];
  servicePath: Record<InsightLocale, string>;
  serviceLabel: LocalizedText;
  relatedSlugs: string[];
};

const digitalNomadFaq: InsightSource = {
  title: {
    en: 'International teleworker residence and work authorisations — official FAQ',
    fa: 'پرسش‌های رسمی درباره مجوز اقامت و کار دورکاران بین‌المللی',
  },
  publisher: {
    en: 'Spanish Ministry of Inclusion, Social Security and Migration',
    fa: 'وزارت شمول، تأمین اجتماعی و مهاجرت اسپانیا',
  },
  url: 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/nomadas-digitales-faqs-espanol',
};

const officialDigitalNomadProcedure: InsightSource = {
  title: {
    en: 'Application for the Digital Nomad Visa',
    fa: 'فرایند رسمی درخواست ویزای دیجیتال نومد',
  },
  publisher: {
    en: 'Government of Spain — Plataforma ONE',
    fa: 'دولت اسپانیا — پلتفرم ONE',
  },
  url: 'https://one.gob.es/en/procedures/application-digital-nomad-visa',
};

const spainTourismLuxury: InsightSource = {
  title: {
    en: 'Luxury destinations and experiences in Spain',
    fa: 'مقاصد و تجربه‌های لوکس در اسپانیا',
  },
  publisher: {
    en: 'Spain.info — official Spanish tourism portal',
    fa: 'Spain.info — درگاه رسمی گردشگری اسپانیا',
  },
  url: 'https://www.spain.info/en/top/luxury-suggestions-spain/',
};

const spainTourismWellness: InsightSource = {
  title: {
    en: 'Hotels and wellness experiences in Spain',
    fa: 'هتل‌ها و تجربه‌های تندرستی در اسپانیا',
  },
  publisher: {
    en: 'Spain.info — official Spanish tourism portal',
    fa: 'Spain.info — درگاه رسمی گردشگری اسپانیا',
  },
  url: 'https://www.spain.info/en/top/hotels-wellness-luxury-spain/',
};

export const PLUCO_INSIGHTS: Record<string, PlucoInsight> = {
  'spain-digital-nomad-visa-iranian-applicants-2026': {
    slug: 'spain-digital-nomad-visa-iranian-applicants-2026',
    category: { en: 'Spain Digital Nomad', fa: 'دیجیتال نومد اسپانیا' },
    country: { en: 'Spain', fa: 'اسپانیا' },
    title: {
      en: 'Spain Digital Nomad Visa in 2026: What Iranian Applicants Should Know',
      fa: 'ویزای دیجیتال نومد اسپانیا در سال ۲۰۲۶؛ آنچه متقاضیان ایرانی باید بدانند',
    },
    description: {
      en: 'A source-led briefing for Iranian remote professionals on Spain’s 2026 Digital Nomad framework, including work structure, income evidence, insurance, Social Security and family planning.',
      fa: 'راهنمای مستند برای متخصصان دورکار ایرانی درباره چارچوب دیجیتال نومد اسپانیا در سال ۲۰۲۶؛ از ساختار کار و درآمد تا بیمه، تأمین اجتماعی و برنامه‌ریزی خانوادگی.',
    },
    seoTitle: {
      en: 'Spain Digital Nomad Visa for Iranians: 2026 Guide',
      fa: 'ویزای دیجیتال نومد اسپانیا برای ایرانیان در ۲۰۲۶',
    },
    seoDescription: {
      en: 'A 2026 guide for Iranian remote professionals covering eligibility, income evidence, insurance, Social Security and family planning in Spain.',
      fa: 'راهنمای ۲۰۲۶ برای دورکاران ایرانی درباره شرایط، درآمد، بیمه، تأمین اجتماعی و خانواده در مسیر دیجیتال نومد اسپانیا.',
    },
    eyebrow: { en: 'PRIVATE CLIENT BRIEFING', fa: 'یادداشت موکل خصوصی' },
    introduction: {
      en: 'Spain can offer internationally mobile professionals something increasingly valuable: the possibility of continuing a global career while building a more settled European life. For Iranian applicants, however, a persuasive file is not created by lifestyle ambition alone. It is built through a coherent professional history, contracts that match the proposed remote activity, traceable income and documents that can withstand both immigration and compliance review.',
      fa: 'اسپانیا برای متخصصان بین‌المللی یک امکان ارزشمند فراهم می‌کند: ادامه مسیر حرفه‌ای جهانی در کنار ساختن یک زندگی باثبات‌تر در اروپا. با این حال، برای متقاضی ایرانی صرف علاقه به سبک زندگی اسپانیا کافی نیست. پرونده قابل اتکا باید بر سابقه حرفه‌ای منسجم، قراردادهای متناسب با دورکاری، درآمد قابل ردیابی و مدارکی استوار باشد که هم در بررسی مهاجرتی و هم در ارزیابی‌های انطباقی قابل دفاع باشند.',
    },
    image: '/images/insights/spain-digital-nomad-iranian-2026.webp',
    imageAlt: {
      en: 'Iranian remote professional working from an elegant apartment in Valencia, Spain',
      fa: 'متخصص دورکار ایرانی در آپارتمانی آرام و مدرن در والنسیا، اسپانیا',
    },
    publishedOn: '2026-08-08',
    reviewedOn: '2026-08-08',
    readTime: { en: '10 minute read', fa: '۱۰ دقیقه مطالعه' },
    keywords: {
      en: ['Spain digital nomad visa Iranian applicants', 'Spain remote work visa 2026', 'Iranian freelancer Spain residence', 'move to Spain from Iran'],
      fa: ['ویزای دیجیتال نومد اسپانیا برای ایرانیان', 'ویزای دورکاری اسپانیا ۲۰۲۶', 'اقامت اسپانیا برای فریلنسر ایرانی', 'مهاجرت به اسپانیا از ایران'],
    },
    sections: [
      {
        heading: { en: 'The route is about the work, not simply the location', fa: 'موضوع اصلی نوع کار است، نه فقط محل زندگی' },
        paragraphs: {
          en: [
            'The Spanish framework is intended for non-EU nationals who carry out employment or professional activity remotely for organisations located outside Spain, using digital and telecommunications systems. The authorities may look beyond a job title and examine whether the duties genuinely can be performed without a physical presence at the overseas workplace.',
            'For an Iranian technology professional, consultant, designer, founder or online business operator, this makes the operating reality important. Contracts, invoices, company information, professional qualifications and bank receipts should tell the same story. A generic letter stating that a person “works online” is rarely a substitute for a documented professional structure.',
          ],
          fa: [
            'این چارچوب برای اتباع خارج از اتحادیه اروپا طراحی شده است که فعالیت استخدامی یا حرفه‌ای خود را با استفاده از ابزارهای دیجیتال و مخابراتی، از راه دور و برای مجموعه‌هایی خارج از اسپانیا انجام می‌دهند. مرجع رسیدگی ممکن است فراتر از عنوان شغلی، ماهیت واقعی وظایف و امکان انجام آن‌ها بدون حضور فیزیکی در محل کار خارجی را بررسی کند.',
            'برای متخصص فناوری، مشاور، طراح، بنیان‌گذار یا صاحب کسب‌وکار آنلاین ایرانی، واقعیت عملی فعالیت اهمیت زیادی دارد. قراردادها، فاکتورها، اطلاعات شرکت، مدارک حرفه‌ای و گردش‌های بانکی باید یک روایت واحد و قابل فهم ارائه دهند. یک نامه کلی با این مضمون که فرد «آنلاین کار می‌کند» جایگزین ساختار حرفه‌ای مستند نیست.',
          ],
        },
      },
      {
        heading: { en: 'Employee and self-employed files require different evidence', fa: 'مدارک کارمند و فرد خوداشتغال یکسان نیست' },
        paragraphs: {
          en: [
            'An employee normally needs to demonstrate a genuine relationship with a non-Spanish employer and permission to perform the role remotely from Spain. A self-employed professional needs to show the commercial relationships behind the activity. The official FAQ states that a self-employed applicant should evidence a commercial contract with the overseas company for at least three months.',
            'Self-employed applicants may conduct professional activity for Spanish companies, provided that the Spanish activity remains professional rather than employment and does not exceed 20% of total professional activity. This distinction should be documented carefully before relying on it.',
          ],
          fa: [
            'کارمند معمولاً باید رابطه واقعی استخدامی با کارفرمای خارج از اسپانیا و اجازه انجام کار از راه دور در اسپانیا را ثابت کند. فرد خوداشتغال باید روابط تجاری پشت فعالیت خود را نشان دهد. در پرسش‌های رسمی آمده است که متقاضی خوداشتغال باید حداقل سه ماه رابطه قراردادی تجاری با شرکت خارجی را اثبات کند.',
            'فرد خوداشتغال می‌تواند در محدوده مشخصی برای شرکت‌های اسپانیایی نیز فعالیت حرفه‌ای داشته باشد، مشروط بر آنکه این رابطه استخدامی نباشد و سهم آن از ۲۰ درصد کل فعالیت حرفه‌ای فراتر نرود. پیش از اتکا به این امکان، ماهیت قرارداد و جریان درآمد باید دقیق بررسی شود.',
          ],
        },
      },
      {
        heading: { en: 'Income is a threshold and an evidence exercise', fa: 'درآمد هم یک حد نصاب است و هم یک موضوع اثباتی' },
        paragraphs: {
          en: [
            'The official framework connects the principal applicant’s minimum resources to 200% of Spain’s minimum wage, with further percentages for accompanying family members. Because the minimum wage and administrative interpretation can change, a responsible article should not freeze an old euro figure into a future application plan.',
            'For Iranian applicants, the evidence layer can be as important as the numerical threshold. The origin of payments, contractual basis, currency conversion, continuity of income and relationship between invoices and bank receipts may all need to be explained. Transfers that pass through multiple people or accounts can create avoidable questions.',
          ],
          fa: [
            'در چارچوب رسمی، حداقل منابع مالی متقاضی اصلی به ۲۰۰ درصد حداقل دستمزد اسپانیا مرتبط است و برای اعضای همراه خانواده درصدهای اضافی در نظر گرفته می‌شود. چون حداقل دستمزد و تفسیر اداری ممکن است تغییر کند، نباید یک مبلغ قدیمی یورویی را مبنای قطعی برنامه آینده قرار داد.',
            'برای متقاضی ایرانی، نحوه اثبات درآمد گاهی به اندازه عدد درآمد مهم است. منشأ پرداخت‌ها، مبنای قراردادی، تبدیل ارز، استمرار درآمد و ارتباط میان فاکتور و گردش بانکی ممکن است نیازمند توضیح باشند. انتقال‌هایی که بدون مستندات روشن از چند حساب یا شخص عبور می‌کنند، می‌توانند پرسش‌های اضافی ایجاد کنند.',
          ],
        },
        bullets: {
          en: ['Contract and remote-work permission', 'Employer or client corporate evidence', 'Invoices, payslips and matching receipts', 'Professional qualifications or experience', 'A clear source-of-funds narrative'],
          fa: ['قرارداد و مجوز انجام کار از راه دور', 'مدارک شرکتی کارفرما یا مشتری', 'فاکتورها، فیش‌های حقوقی و واریزهای متناظر', 'مدارک تحصیلی یا سابقه حرفه‌ای', 'روایت روشن و قابل مستند از منشأ وجوه'],
        },
      },
      {
        heading: { en: 'Insurance and Social Security should be resolved early', fa: 'بیمه و تأمین اجتماعی را باید از ابتدا روشن کرد' },
        paragraphs: {
          en: [
            'Spain distinguishes qualifying health cover from ordinary travel insurance. The official guidance describes public coverage through Social Security or private health insurance from an insurer authorised to operate in Spain, with cover equivalent to the public system and without common exclusions such as waiting periods or co-payments.',
            'The Social Security position depends on whether the applicant is employed or self-employed and whether any applicable international arrangement can be relied upon. The official FAQ states that self-employed international teleworkers should register in Spain’s self-employed system. This is an area for coordinated immigration, employment and tax advice rather than assumptions.',
          ],
          fa: [
            'اسپانیا میان پوشش درمانی قابل قبول و بیمه عادی سفر تفاوت قائل می‌شود. راهنمای رسمی به پوشش عمومی از طریق تأمین اجتماعی یا بیمه درمانی خصوصی از شرکت مجاز در اسپانیا اشاره دارد؛ پوششی هم‌سطح نظام عمومی و بدون محدودیت‌هایی مانند دوره انتظار یا پرداخت سهم درمان.',
            'وضعیت تأمین اجتماعی به استخدامی یا خوداشتغال بودن فرد و امکان استفاده از توافق‌های بین‌المللی مرتبط بستگی دارد. در پرسش‌های رسمی تصریح شده است که دورکار خوداشتغال باید در نظام خوداشتغالی اسپانیا ثبت شود. این موضوع نیازمند هماهنگی مشاوره مهاجرتی، کاری و مالیاتی است و نباید بر پایه فرض پیش برود.',
          ],
        },
      },
      {
        heading: { en: 'A lifestyle decision still needs a legal sequence', fa: 'تصمیم برای سبک زندگی همچنان به یک ترتیب حقوقی نیاز دارد' },
        paragraphs: {
          en: [
            'The most successful relocation plan usually separates four questions: eligibility, application route, tax and Social Security exposure, and the practical move. Housing, schools, banking and city choice become easier to assess once the legal foundation is understood.',
            'PLUCO GROUP treats the visa as one tool within a broader private-client plan. The objective is not simply to obtain a document; it is to build a defensible route toward the life the client is seeking, without overlooking the obligations that arrive with Spanish residence.',
          ],
          fa: [
            'یک برنامه مهاجرتی منظم معمولاً چهار موضوع را از هم تفکیک می‌کند: احراز شرایط، مسیر ثبت درخواست، آثار مالیاتی و تأمین اجتماعی، و اجرای عملی جابه‌جایی. وقتی پایه حقوقی روشن باشد، انتخاب شهر، مسکن، مدرسه و بانک نیز واقع‌بینانه‌تر می‌شود.',
            'PLUCO GROUP ویزا را تنها یکی از ابزارهای برنامه‌ریزی موکل خصوصی می‌داند. هدف فقط دریافت یک مدرک نیست؛ هدف ساختن مسیری قابل دفاع به سوی زندگی مورد نظر موکل است، بدون نادیده گرفتن تعهداتی که با اقامت اسپانیا همراه می‌شوند.',
          ],
        },
      },
    ],
    sources: [digitalNomadFaq, officialDigitalNomadProcedure],
    servicePath: { en: '/spain-digital-nomad-visa', fa: '/fa/services/spain-digital-nomad-visa' },
    serviceLabel: { en: 'Explore Spain Digital Nomad support', fa: 'بررسی خدمات دیجیتال نومد اسپانیا' },
    relatedSlugs: ['apply-spain-digital-nomad-visa-tehran-or-spain', 'moving-family-spain-digital-nomad-route'],
  },

  'apply-spain-digital-nomad-visa-tehran-or-spain': {
    slug: 'apply-spain-digital-nomad-visa-tehran-or-spain',
    category: { en: 'Application Strategy', fa: 'استراتژی درخواست' },
    country: { en: 'Spain', fa: 'اسپانیا' },
    title: {
      en: 'Apply from Tehran or From Inside Spain? Comparing Two Digital Nomad Routes',
      fa: 'درخواست از تهران یا داخل اسپانیا؟ مقایسه دو مسیر دیجیتال نومد',
    },
    description: {
      en: 'A careful comparison of the Spanish consular visa route and an in-country residence application for Iranian remote professionals.',
      fa: 'مقایسه دقیق مسیر ویزای کنسولی و درخواست اقامت از داخل اسپانیا برای متخصصان دورکار ایرانی.',
    },
    seoTitle: {
      en: 'Spain Digital Nomad Visa: Apply from Iran or Spain?',
      fa: 'دیجیتال نومد اسپانیا؛ درخواست از ایران یا اسپانیا؟',
    },
    seoDescription: {
      en: 'Compare Spain’s consular visa and in-country residence routes for Iranian remote professionals, including timing, lawful presence and documents.',
      fa: 'مقایسه مسیر کنسولی و درخواست داخل اسپانیا برای دورکاران ایرانی؛ شامل حضور قانونی، زمان‌بندی و مدارک لازم.',
    },
    eyebrow: { en: 'ROUTE COMPARISON', fa: 'مقایسه مسیرها' },
    introduction: {
      en: 'The question “Where should I apply?” is not merely administrative. It affects travel planning, timing, documentary risk and the position a family may be in while waiting for a decision. The correct route depends on lawful presence, residence history, the competent authority and the quality of the evidence available at the moment of filing.',
      fa: 'پرسش «از کجا درخواست بدهم؟» صرفاً اداری نیست. پاسخ آن بر برنامه سفر، زمان‌بندی، ریسک مدارک و وضعیت خانواده در دوره انتظار اثر می‌گذارد. مسیر مناسب به حضور قانونی، سابقه اقامت، مرجع صالح و کیفیت مدارکی بستگی دارد که در زمان ثبت درخواست در دسترس است.',
    },
    image: '/images/insights/tehran-or-spain-application.webp',
    imageAlt: {
      en: 'Iranian professional considering an international move from an airport toward Madrid',
      fa: 'متخصص ایرانی در حال بررسی مسیر جابه‌جایی بین‌المللی به مادرید',
    },
    publishedOn: '2026-08-08',
    reviewedOn: '2026-08-08',
    readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: {
      en: ['apply Spain digital nomad visa from Iran', 'Spain digital nomad visa Tehran', 'apply digital nomad residence in Spain', 'Spanish UGE remote worker'],
      fa: ['درخواست ویزای دیجیتال نومد اسپانیا از ایران', 'ویزای دیجیتال نومد اسپانیا تهران', 'درخواست دیجیتال نومد از داخل اسپانیا', 'اقامت دورکاری UGE اسپانیا'],
    },
    sections: [
      {
        heading: { en: 'The consular route begins before relocation', fa: 'مسیر کنسولی پیش از جابه‌جایی آغاز می‌شود' },
        paragraphs: {
          en: [
            'A person applying from their country of lawful residence normally approaches the competent Spanish consular authority for a Digital Nomad visa. The official FAQ explains that an applicant outside Spain does not apply directly for the in-country residence authorisation; the overseas path begins with the visa, which authorises residence and work for its stated period.',
            'This route can create a clearer legal sequence: prepare, file, receive a decision and then relocate. It may suit families that do not want to move children, housing or business arrangements before the initial immigration decision. Competence, appointment availability and local document requirements must still be verified at the time of filing.',
          ],
          fa: [
            'فردی که در کشور محل اقامت قانونی خود درخواست می‌دهد، معمولاً باید برای ویزای دیجیتال نومد به مرجع کنسولی صالح اسپانیا مراجعه کند. در پرسش‌های رسمی توضیح داده شده که متقاضی خارج از اسپانیا مستقیماً مجوز اقامت داخل کشور را درخواست نمی‌کند؛ مسیر خارج از کشور با ویزایی آغاز می‌شود که در مدت اعتبار خود اجازه اقامت و کار می‌دهد.',
            'این مسیر می‌تواند ترتیب حقوقی روشن‌تری داشته باشد: آماده‌سازی، ثبت، دریافت تصمیم و سپس جابه‌جایی. برای خانواده‌ای که نمی‌خواهد پیش از تصمیم اولیه، مدرسه، مسکن یا کسب‌وکار خود را جابه‌جا کند، این ترتیب ممکن است مناسب‌تر باشد. با این حال، صلاحیت مرجع، دسترسی به وقت و الزامات محلی مدارک باید در زمان اقدام بررسی شوند.',
          ],
        },
      },
      {
        heading: { en: 'The in-country route depends on lawful presence', fa: 'مسیر داخل اسپانیا به حضور قانونی وابسته است' },
        paragraphs: {
          en: [
            'Spain also provides a residence-authorisation process for eligible applicants who are lawfully present in the country. This is not a shortcut that cures an irregular stay. The applicant’s entry, permitted stay and filing date need to be checked before relying on the in-country option.',
            'An in-country filing may offer a different residence duration and process, but it also places more pressure on timing. Travel plans, expiring permission to stay, availability of criminal-record documents and access to electronic filing or authorised representation should be mapped before arrival rather than after the clock has started.',
          ],
          fa: [
            'اسپانیا برای متقاضی واجد شرایطی که به‌صورت قانونی در این کشور حضور دارد، مسیر درخواست مجوز اقامت نیز پیش‌بینی کرده است. این گزینه میان‌بری برای اصلاح اقامت غیرقانونی نیست. نحوه ورود، مدت مجاز حضور و تاریخ ثبت درخواست باید پیش از اتکا به این مسیر بررسی شوند.',
            'ثبت درخواست از داخل اسپانیا ممکن است از نظر مدت مجوز و فرایند تفاوت داشته باشد، اما فشار زمانی بیشتری نیز ایجاد می‌کند. برنامه سفر، پایان مهلت حضور، دسترسی به گواهی عدم سوءپیشینه و امکان ثبت الکترونیکی یا استفاده از نماینده مجاز باید پیش از ورود مشخص شوند، نه زمانی که مهلت قانونی در حال سپری شدن است.',
          ],
        },
      },
      {
        heading: { en: 'The strongest route is the one your evidence supports', fa: 'بهترین مسیر، مسیری است که مدارک شما آن را پشتیبانی می‌کند' },
        paragraphs: {
          en: [
            'Applicants sometimes choose a route because it appears faster on social media. A private-client assessment asks different questions: Where is the applicant legally resident? Which authority is competent? Are original civil and criminal documents available? Does the employment structure satisfy Spanish rules? Can the applicant remain compliant while waiting?',
            'For Iranian applicants, document legalisation, translation, payment trails and access to records can affect the practical choice. A theoretically available route may be unhelpful if the essential evidence cannot be obtained or properly prepared within the filing window.',
          ],
          fa: [
            'برخی متقاضیان صرفاً به دلیل ادعای سرعت بیشتر در شبکه‌های اجتماعی، یک مسیر را انتخاب می‌کنند. ارزیابی موکل خصوصی پرسش‌های دیگری دارد: محل اقامت قانونی کجاست؟ کدام مرجع صلاحیت دارد؟ اصل مدارک مدنی و کیفری در دسترس است؟ ساختار استخدامی با قواعد اسپانیا سازگار است؟ آیا فرد در زمان انتظار وضعیت قانونی خود را حفظ می‌کند؟',
            'برای متقاضی ایرانی، قانونی‌سازی، ترجمه، مسیر پرداخت و دسترسی به سوابق می‌تواند انتخاب عملی را تغییر دهد. یک مسیر ممکن است از نظر نظری در دسترس باشد، اما اگر مدارک اصلی در مهلت مقرر قابل تهیه و آماده‌سازی نباشند، گزینه مناسبی نخواهد بود.',
          ],
        },
        bullets: {
          en: ['Confirm lawful residence and competent authority', 'Audit document availability before travel', 'Compare family timing and housing commitments', 'Review tax and Social Security consequences separately', 'Do not rely on an assumed processing time'],
          fa: ['اقامت قانونی و مرجع صالح را مشخص کنید', 'پیش از سفر، دسترسی به مدارک را بررسی کنید', 'زمان‌بندی خانواده و تعهدات مسکن را مقایسه کنید', 'آثار مالیاتی و تأمین اجتماعی را جداگانه بررسی کنید', 'بر زمان رسیدگی فرضی تکیه نکنید'],
        },
      },
      {
        heading: { en: 'Plan the arrival, not only the application', fa: 'فقط درخواست را برنامه‌ریزی نکنید؛ ورود را هم ببینید' },
        paragraphs: {
          en: [
            'A residence decision is followed by practical obligations: registration, identification documents, Social Security where applicable, housing, banking and tax analysis. The route should therefore be chosen as part of an arrival plan, not as an isolated form-filling exercise.',
            'PLUCO GROUP’s role is to help organise the facts, identify documentary gaps and coordinate the appropriate professional handoff. No route removes the authority’s discretion, and neither lawful entry nor complete documents guarantee approval.',
          ],
          fa: [
            'پس از تصمیم اقامتی، تعهدات عملی آغاز می‌شوند: ثبت‌های اداری، مدارک هویتی، تأمین اجتماعی در صورت لزوم، مسکن، بانک و بررسی مالیاتی. بنابراین انتخاب مسیر باید بخشی از برنامه ورود باشد، نه صرفاً تکمیل چند فرم.',
            'نقش PLUCO GROUP سازمان‌دهی اطلاعات، شناسایی خلأهای مدارک و هماهنگی ارجاع حرفه‌ای مناسب است. هیچ مسیری اختیار مرجع تصمیم‌گیر را حذف نمی‌کند و ورود قانونی یا کامل بودن ظاهری مدارک نیز تضمین‌کننده موافقت نیست.',
          ],
        },
      },
    ],
    sources: [digitalNomadFaq, officialDigitalNomadProcedure],
    servicePath: { en: '/spain-digital-nomad-visa', fa: '/fa/services/spain-digital-nomad-visa' },
    serviceLabel: { en: 'Request a route assessment', fa: 'درخواست ارزیابی مسیر' },
    relatedSlugs: ['spain-digital-nomad-visa-iranian-applicants-2026', 'moving-family-spain-digital-nomad-route'],
  },

  'moving-family-spain-digital-nomad-route': {
    slug: 'moving-family-spain-digital-nomad-route',
    category: { en: 'Family Relocation', fa: 'جابه‌جایی خانوادگی' },
    country: { en: 'Spain', fa: 'اسپانیا' },
    title: {
      en: 'Moving to Spain With Your Family Under the Digital Nomad Route',
      fa: 'مهاجرت خانوادگی به اسپانیا از مسیر دیجیتال نومد',
    },
    description: {
      en: 'A private-client guide to family inclusion, financial evidence, work rights and practical relocation planning under Spain’s Digital Nomad framework.',
      fa: 'راهنمای موکل خصوصی درباره الحاق خانواده، مدارک مالی، حق کار و برنامه‌ریزی عملی زندگی خانوادگی در مسیر دیجیتال نومد اسپانیا.',
    },
    seoTitle: {
      en: 'Spain Digital Nomad Visa for Families',
      fa: 'ویزای دیجیتال نومد اسپانیا برای خانواده‌ها',
    },
    seoDescription: {
      en: 'Family inclusion, income evidence, work rights, schooling and practical relocation planning under Spain’s Digital Nomad framework.',
      fa: 'راهنمای الحاق خانواده، درآمد، حق کار، مدرسه و برنامه‌ریزی زندگی خانوادگی در مسیر دیجیتال نومد اسپانیا.',
    },
    eyebrow: { en: 'FAMILY MOBILITY', fa: 'تحرک خانوادگی' },
    introduction: {
      en: 'For a family, relocation is never only an immigration file. It is a decision about continuity: work, schooling, healthcare, housing, language and the emotional pace of change. Spain’s Digital Nomad framework can include qualifying family members, but the legal possibility should be translated into a practical family plan before commitments are made.',
      fa: 'برای یک خانواده، مهاجرت هرگز فقط یک پرونده اقامتی نیست. این تصمیم درباره تداوم زندگی است: کار، مدرسه، درمان، مسکن، زبان و سرعت روانی تغییر. چارچوب دیجیتال نومد اسپانیا می‌تواند اعضای واجد شرایط خانواده را در بر گیرد، اما این امکان حقوقی باید پیش از ایجاد تعهدات مالی و خانوادگی، به یک برنامه عملی تبدیل شود.',
    },
    image: '/images/insights/family-digital-nomad-spain.webp',
    imageAlt: {
      en: 'Iranian family walking together on a calm residential street in Valencia',
      fa: 'خانواده ایرانی در خیابانی آرام و مسکونی در والنسیا',
    },
    publishedOn: '2026-08-08',
    reviewedOn: '2026-08-08',
    readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: {
      en: ['Spain digital nomad visa family', 'move to Spain with children remote work', 'Iranian family residence Spain', 'digital nomad spouse work Spain'],
      fa: ['ویزای دیجیتال نومد اسپانیا با خانواده', 'مهاجرت خانوادگی به اسپانیا', 'اقامت اسپانیا برای خانواده ایرانی', 'حق کار همسر دیجیتال نومد اسپانیا'],
    },
    sections: [
      {
        heading: { en: 'Who may be included?', fa: 'چه کسانی می‌توانند همراه باشند؟' },
        paragraphs: {
          en: [
            'The official Spanish guidance identifies a spouse or analogous partner, minor children, certain economically dependent adult children who have not formed their own family unit, and dependent ascendants as potential accompanying family members. Each relationship and, where relevant, dependency must be evidenced.',
            'For Iranian families, civil-status records, translations and legalisation may require time. Names, dates and family relationships should be consistent across passports, birth records, marriage documents and application forms. Variations in transliteration should be addressed before submission rather than left unexplained.',
          ],
          fa: [
            'در راهنمای رسمی اسپانیا، همسر یا شریک دارای رابطه مشابه، فرزندان زیر سن قانونی، برخی فرزندان بزرگسال وابسته که واحد خانوادگی مستقلی تشکیل نداده‌اند و والدین وابسته به‌عنوان همراهان احتمالی شناخته شده‌اند. رابطه خانوادگی و در موارد لازم، وابستگی اقتصادی باید با مدرک اثبات شود.',
            'برای خانواده ایرانی، تهیه اسناد احوال شخصیه، ترجمه و قانونی‌سازی ممکن است زمان‌بر باشد. نام‌ها، تاریخ‌ها و روابط خانوادگی باید در گذرنامه، شناسنامه، سند ازدواج و فرم‌ها با یکدیگر سازگار باشند. تفاوت در شیوه نوشتن نام‌ها با حروف لاتین باید پیش از ثبت درخواست مدیریت شود.',
          ],
        },
      },
      {
        heading: { en: 'Family income is not an afterthought', fa: 'توان مالی خانواده موضوع فرعی نیست' },
        paragraphs: {
          en: [
            'The resources requirement increases when family members are included. The official FAQ links the principal applicant to 200% of the Spanish minimum wage, adds 75% for a second person in the family unit and 25% for each further member. The euro amount should be recalculated against the current minimum wage at the time of filing.',
            'A family budget should go further than the immigration minimum. Deposit and rent, school choices, health cover, transport, professional advice and a period without easy local banking access can create a very different practical threshold. A compliant application is not automatically a comfortable relocation plan.',
          ],
          fa: [
            'با اضافه شدن اعضای خانواده، شرط منابع مالی نیز افزایش می‌یابد. در پرسش‌های رسمی، برای متقاضی اصلی ۲۰۰ درصد حداقل دستمزد اسپانیا، برای نفر دوم خانواده ۷۵ درصد و برای هر عضو اضافی ۲۵ درصد در نظر گرفته شده است. مبلغ یورویی باید در زمان اقدام و بر اساس حداقل دستمزد روز محاسبه شود.',
            'بودجه واقعی خانواده باید فراتر از حداقل مهاجرتی باشد. ودیعه و اجاره، انتخاب مدرسه، پوشش درمانی، حمل‌ونقل، مشاوره حرفه‌ای و دوره‌ای که دسترسی بانکی محلی هنوز ساده نیست، می‌تواند حد عملی کاملاً متفاوتی ایجاد کند. پرونده قابل قبول لزوماً به معنای جابه‌جایی راحت نیست.',
          ],
        },
      },
      {
        heading: { en: 'Work rights can change the family strategy', fa: 'حق کار می‌تواند استراتژی خانواده را تغییر دهد' },
        paragraphs: {
          en: [
            'Spanish guidance states that qualifying family residence authorisations allow family members to work as employees or on a self-employed basis. This can be important for a spouse who intends to continue a career or build a new professional activity in Spain.',
            'The immigration permission does not remove professional licensing, tax, Social Security or sector-specific requirements. A regulated profession or a new Spanish business still requires its own analysis. The family plan should distinguish permission to work from readiness to work.',
          ],
          fa: [
            'در راهنمای اسپانیا آمده است که مجوز اقامت اعضای واجد شرایط خانواده می‌تواند امکان کار استخدامی یا خوداشتغالی را فراهم کند. این موضوع برای همسری که قصد ادامه مسیر حرفه‌ای یا ایجاد فعالیت جدید در اسپانیا را دارد اهمیت دارد.',
            'مجوز مهاجرتی، الزامات مجوز حرفه‌ای، مالیات، تأمین اجتماعی یا قواعد خاص هر صنعت را حذف نمی‌کند. حرفه‌های تنظیم‌شده یا راه‌اندازی کسب‌وکار در اسپانیا همچنان به بررسی جداگانه نیاز دارند. برنامه خانواده باید میان «اجازه کار» و «آمادگی برای کار» تفاوت قائل شود.',
          ],
        },
      },
      {
        heading: { en: 'Choose the city around the family’s real rhythm', fa: 'شهر را بر اساس ریتم واقعی خانواده انتخاب کنید' },
        paragraphs: {
          en: [
            'Madrid and Barcelona offer international networks, schools and professional density, while Valencia, Málaga and smaller coastal locations may offer a different balance of space, pace and cost. There is no universally best Spanish city. The right answer depends on work time zones, airport access, language, education, healthcare and the kind of daily life the family wants.',
            'A short exploratory stay can be useful, but it should not be confused with legal residence or used to make irreversible commitments before eligibility is understood. Housing viewings and school conversations become more valuable when they are guided by an agreed immigration and financial timeline.',
          ],
          fa: [
            'مادرید و بارسلونا شبکه‌های بین‌المللی، مدارس و تراکم حرفه‌ای بیشتری دارند؛ در حالی که والنسیا، مالاگا و شهرهای کوچک‌تر ساحلی ممکن است تعادل متفاوتی از فضا، سرعت زندگی و هزینه ارائه دهند. هیچ شهری برای همه بهترین نیست. پاسخ مناسب به منطقه زمانی کار، دسترسی به فرودگاه، زبان، آموزش، درمان و شکل زندگی روزمره مورد نظر خانواده بستگی دارد.',
            'سفر کوتاه برای شناخت شهر می‌تواند مفید باشد، اما نباید با اقامت قانونی اشتباه گرفته شود یا پیش از روشن شدن شرایط، به تعهدات غیرقابل بازگشت منجر شود. بازدید مسکن و گفت‌وگو با مدارس زمانی ارزشمندتر است که بر اساس برنامه زمانی مهاجرتی و مالی مشخص انجام شود.',
          ],
        },
        bullets: {
          en: ['Immigration sequence', 'Family document audit', 'Realistic twelve-month budget', 'School and language plan', 'Healthcare and insurance', 'Banking and source-of-funds preparation'],
          fa: ['ترتیب مراحل مهاجرتی', 'ممیزی مدارک خانوادگی', 'بودجه واقع‌بینانه دوازده‌ماهه', 'برنامه مدرسه و زبان', 'درمان و بیمه', 'آمادگی بانکی و منشأ وجوه'],
        },
      },
    ],
    sources: [digitalNomadFaq, officialDigitalNomadProcedure],
    servicePath: { en: '/spain-digital-nomad-visa', fa: '/fa/services/spain-digital-nomad-visa' },
    serviceLabel: { en: 'Discuss a family relocation plan', fa: 'گفت‌وگو درباره برنامه مهاجرت خانوادگی' },
    relatedSlugs: ['spain-digital-nomad-visa-iranian-applicants-2026', 'apply-spain-digital-nomad-visa-tehran-or-spain'],
  },

  'private-side-of-spain-culture-wellness-mediterranean-life': {
    slug: 'private-side-of-spain-culture-wellness-mediterranean-life',
    category: { en: 'Spain Lifestyle', fa: 'سبک زندگی در اسپانیا' },
    country: { en: 'Spain', fa: 'اسپانیا' },
    title: {
      en: 'The Private Side of Spain: Culture, Wellness and Mediterranean Living',
      fa: 'چهره خصوصی اسپانیا؛ فرهنگ، آرامش و زندگی مدیترانه‌ای',
    },
    description: {
      en: 'An editorial journey through the quieter, more cultivated side of Spanish life—from private culture and historic stays to wellness, gastronomy and the Mediterranean coast.',
      fa: 'روایتی از چهره آرام‌تر و فرهیخته‌تر زندگی در اسپانیا؛ از فرهنگ و اقامتگاه‌های تاریخی تا تندرستی، غذا و ساحل مدیترانه.',
    },
    seoTitle: {
      en: 'Luxury Life in Spain: Culture, Wellness and Privacy',
      fa: 'زندگی لوکس در اسپانیا؛ فرهنگ، آرامش و حریم خصوصی',
    },
    seoDescription: {
      en: 'Discover Spain’s cultivated private lifestyle through culture, historic stays, wellness, gastronomy and Mediterranean living.',
      fa: 'نگاهی به زندگی خصوصی و فرهیخته در اسپانیا؛ از فرهنگ و اقامتگاه تاریخی تا تندرستی، غذا و مدیترانه.',
    },
    eyebrow: { en: 'THE LIFE BEYOND THE VISA', fa: 'زندگی فراتر از ویزا' },
    introduction: {
      en: 'A residence permit can open a door, but it does not define the life on the other side. Spain’s deeper appeal is found in the rhythm it makes possible: serious work without surrendering time, private access to culture, long meals built around conversation, restorative landscapes and cities where history remains part of ordinary life.',
      fa: 'مجوز اقامت می‌تواند دری را باز کند، اما زندگی پشت آن در را تعریف نمی‌کند. جذابیت عمیق‌تر اسپانیا در ریتمی است که ممکن می‌سازد: کار جدی بدون از دست دادن زمان، دسترسی آرام و خصوصی به فرهنگ، وعده‌های طولانی همراه با گفت‌وگو، طبیعت ترمیم‌کننده و شهرهایی که تاریخ هنوز بخشی از زندگی روزمره آن‌هاست.',
    },
    image: '/images/insights/private-life-spain.webp',
    imageAlt: {
      en: 'Private Mediterranean terrace in Mallorca overlooking the sea at blue hour',
      fa: 'تراس خصوصی مدیترانه‌ای در مایورکا با چشم‌انداز دریا هنگام غروب',
    },
    publishedOn: '2026-08-08',
    reviewedOn: '2026-08-08',
    readTime: { en: '8 minute read', fa: '۸ دقیقه مطالعه' },
    keywords: {
      en: ['luxury life in Spain', 'private lifestyle Spain', 'Mediterranean living Spain', 'Spain lifestyle for international families'],
      fa: ['زندگی لوکس در اسپانیا', 'سبک زندگی خصوصی در اسپانیا', 'زندگی مدیترانه‌ای', 'زندگی در اسپانیا برای خانواده‌های بین‌المللی'],
    },
    sections: [
      {
        heading: { en: 'Luxury in Spain is often about access, not display', fa: 'لوکس بودن در اسپانیا بیشتر درباره دسترسی است تا نمایش' },
        paragraphs: {
          en: [
            'Spain’s official tourism portal presents luxury through experiences: a private visit to the Prado or the Royal Palace in Madrid, closer access to Gaudí’s work in Barcelona, an intimate flamenco performance in Seville, or a journey aboard historic luxury trains. The common thread is not spectacle. It is time, context and the absence of crowds.',
            'For a private client, this interpretation is more durable than conspicuous consumption. A well-positioned home, trusted local relationships and the freedom to choose when and how to travel can matter more than collecting visible symbols of wealth.',
          ],
          fa: [
            'درگاه رسمی گردشگری اسپانیا، لوکس بودن را از مسیر تجربه تعریف می‌کند: بازدید خصوصی از موزه پرادو یا کاخ سلطنتی مادرید، دسترسی نزدیک‌تر به آثار گائودی در بارسلونا، اجرای صمیمی فلامنکو در سویا یا سفر با قطارهای تاریخی لوکس. وجه مشترک این تجربه‌ها نمایش نیست؛ زمان، زمینه و دوری از ازدحام است.',
            'برای موکل خصوصی، این برداشت از تجمل پایدارتر از مصرف نمایشی است. خانه‌ای در موقعیت مناسب، روابط محلی قابل اعتماد و آزادی انتخاب زمان و شیوه سفر می‌تواند مهم‌تر از جمع‌آوری نشانه‌های ظاهری ثروت باشد.',
          ],
        },
      },
      {
        heading: { en: 'Different regions offer different versions of a good life', fa: 'هر منطقه تصویری متفاوت از زندگی خوب ارائه می‌دهد' },
        paragraphs: {
          en: [
            'Madrid offers cultural depth, private clubs, international schools and direct global connections. Barcelona combines architecture, design, business and the sea. Valencia brings a more measured Mediterranean pace. Marbella and the wider Costa del Sol connect coastal living with international communities, golf and marinas. Mallorca offers privacy, landscape and seasonal rhythm.',
            'Choosing among them should begin with daily life rather than holiday impressions. Airport routes, professional networks, school calendars, healthcare, climate through the full year and access to trusted advisers determine whether a destination continues to feel right after the first beautiful month.',
          ],
          fa: [
            'مادرید عمق فرهنگی، باشگاه‌های خصوصی، مدارس بین‌المللی و ارتباطات مستقیم جهانی ارائه می‌دهد. بارسلونا معماری، طراحی، کسب‌وکار و دریا را کنار هم قرار می‌دهد. والنسیا ریتمی متعادل‌تر و مدیترانه‌ای دارد. ماربیا و منطقه کوستا دل سول، زندگی ساحلی را با جامعه بین‌المللی، گلف و مارینا پیوند می‌دهند. مایورکا حریم خصوصی، طبیعت و ریتم فصلی خاص خود را دارد.',
            'انتخاب میان این مقاصد باید از زندگی روزمره آغاز شود، نه از برداشت یک تعطیلات کوتاه. مسیرهای پروازی، شبکه حرفه‌ای، تقویم مدرسه، درمان، آب‌وهوا در تمام سال و دسترسی به مشاوران قابل اعتماد تعیین می‌کنند که آیا یک مقصد پس از ماه نخست همچنان انتخاب درستی است یا نه.',
          ],
        },
      },
      {
        heading: { en: 'Wellness can become part of the calendar', fa: 'تندرستی می‌تواند بخشی از تقویم زندگی شود' },
        paragraphs: {
          en: [
            'Spain’s wellness landscape ranges from ecological retreats near Barcelona and mountain properties in Alicante to thermal experiences in Mallorca and family-oriented coastal resorts in the Canary Islands. The value is not only a weekend escape. Proximity can make restoration part of an ordinary month rather than an annual emergency.',
            'The Mediterranean pattern—walking, seasonal food, social time and outdoor life—cannot be purchased as a package, but it can be supported through location and routine. A thoughtful relocation asks not only where the family will live, but how the chosen place will change the way time is used.',
          ],
          fa: [
            'چشم‌انداز تندرستی اسپانیا از اقامتگاه‌های بوم‌گرا نزدیک بارسلونا و هتل‌های کوهستانی آلیکانته تا چشمه‌های آب‌گرم مایورکا و مجموعه‌های ساحلی خانوادگی در جزایر قناری گسترده است. ارزش این امکانات فقط یک آخر هفته نیست؛ نزدیکی آن‌ها می‌تواند بازیابی آرامش را به بخشی از یک ماه عادی تبدیل کند، نه یک اقدام اضطراری سالانه.',
            'الگوی مدیترانه‌ای—پیاده‌روی، غذای فصلی، زمان اجتماعی و زندگی در فضای باز—به شکل یک بسته فروخته نمی‌شود، اما انتخاب محل و عادت‌های روزمره می‌تواند آن را تقویت کند. یک مهاجرت سنجیده فقط نمی‌پرسد خانواده کجا زندگی خواهد کرد؛ می‌پرسد آن مکان شیوه استفاده از زمان را چگونه تغییر می‌دهد.',
          ],
        },
      },
      {
        heading: { en: 'The legal tools should serve the life', fa: 'ابزارهای حقوقی باید در خدمت زندگی باشند' },
        paragraphs: {
          en: [
            'A visa, residence card, property or company is not the lifestyle itself. Each is a tool. The private-client task is to select the tools that fit the family’s nationality, work, assets, risk tolerance and intended relationship with Spain.',
            'That distinction matters because an attractive property does not create an immigration right, a residence permit may create tax consequences, and access to European life still depends on compliant banking and documented funds. The refined result comes from aligning the legal structure with the human intention.',
          ],
          fa: [
            'ویزا، کارت اقامت، ملک یا شرکت خودِ سبک زندگی نیستند؛ هر کدام یک ابزارند. وظیفه برنامه‌ریزی موکل خصوصی این است که ابزارهایی متناسب با ملیت، کار، دارایی‌ها، میزان تحمل ریسک و نوع رابطه مورد نظر خانواده با اسپانیا انتخاب شوند.',
            'این تفاوت اهمیت دارد؛ زیرا ملک جذاب حق مهاجرتی ایجاد نمی‌کند، اقامت می‌تواند آثار مالیاتی داشته باشد و دسترسی پایدار به زندگی اروپایی همچنان به بانکداری منطبق و منشأ وجوه مستند وابسته است. نتیجه سنجیده زمانی حاصل می‌شود که ساختار حقوقی با نیت انسانی هماهنگ باشد.',
          ],
        },
        bullets: {
          en: ['Define the life before selecting the legal route', 'Test a city against twelve months, not one season', 'Separate property, residence, tax and banking decisions', 'Build local professional relationships early', 'Protect privacy without sacrificing documentation'],
          fa: ['پیش از انتخاب مسیر حقوقی، شکل زندگی مطلوب را تعریف کنید', 'شهر را با دوازده ماه بسنجید، نه با یک فصل', 'تصمیم‌های ملک، اقامت، مالیات و بانک را از هم تفکیک کنید', 'روابط حرفه‌ای محلی را زود شکل دهید', 'حریم خصوصی را بدون تضعیف مستندسازی حفظ کنید'],
        },
      },
    ],
    sources: [spainTourismLuxury, spainTourismWellness],
    servicePath: { en: '/eu-residency', fa: '/fa/services/eu-residency' },
    serviceLabel: { en: 'Explore European residence planning', fa: 'بررسی برنامه‌ریزی اقامت اروپا' },
    relatedSlugs: ['spain-digital-nomad-visa-iranian-applicants-2026', 'moving-family-spain-digital-nomad-route'],
  },
};

export const PLUCO_INSIGHT_LIST = Object.values(PLUCO_INSIGHTS);

export function getInsight(slug: string) {
  return PLUCO_INSIGHTS[slug];
}
