import type { InsightSource, PlucoInsight } from './plucoInsights';

const euImmigrationPortal: InsightSource = {
  title: { en: 'EU Immigration Portal', fa: 'درگاه رسمی مهاجرت اتحادیه اروپا' },
  publisher: { en: 'European Commission', fa: 'کمیسیون اروپا' },
  url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal_en',
};

const euAlreadyResident: InsightSource = {
  title: { en: 'Already in the EU: family, long-term residence and mobility', fa: 'حضور در اتحادیه اروپا؛ خانواده، اقامت بلندمدت و جابه‌جایی' },
  publisher: { en: 'European Commission', fa: 'کمیسیون اروپا' },
  url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/already-eu_en',
};

const digitalNomadFaq: InsightSource = {
  title: { en: 'International teleworker residence and work authorisations — official FAQ', fa: 'پرسش‌های رسمی مجوز اقامت و کار دورکاران بین‌المللی' },
  publisher: { en: 'Spanish Ministry of Inclusion, Social Security and Migration', fa: 'وزارت شمول، تأمین اجتماعی و مهاجرت اسپانیا' },
  url: 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/nomadas-digitales-faqs-espanol',
};

const digitalNomadProcedure: InsightSource = {
  title: { en: 'International teleworkers — official information', fa: 'دورکاران بین‌المللی — اطلاعات رسمی' },
  publisher: { en: 'Spanish Ministry of Inclusion, Social Security and Migration', fa: 'وزارت شمول، تأمین اجتماعی و مهاجرت اسپانیا' },
  url: 'https://www.inclusion.gob.es/gl/web/unidadgrandesempresas/teletrabajadores',
};

const euAmlFramework: InsightSource = {
  title: { en: 'Anti-money laundering and countering terrorist financing at EU level', fa: 'چارچوب مبارزه با پول‌شویی و تأمین مالی تروریسم در اتحادیه اروپا' },
  publisher: { en: 'European Commission', fa: 'کمیسیون اروپا' },
  url: 'https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en',
};

const euDueDiligenceGuidance: InsightSource = {
  title: { en: 'EU due-diligence guidance', fa: 'راهنمای دقت لازم اتحادیه اروپا' },
  publisher: { en: 'European Commission', fa: 'کمیسیون اروپا' },
  url: 'https://finance.ec.europa.eu/publications/guidance-due-diligence_en',
};

const euBankAccounts: InsightSource = {
  title: { en: 'Bank accounts in the EU', fa: 'حساب‌های بانکی در اتحادیه اروپا' },
  publisher: { en: 'Your Europe — European Union', fa: 'Your Europe — اتحادیه اروپا' },
  url: 'https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/bank-accounts-eu/index_en.htm',
};

const ebaConsumers: InsightSource = {
  title: { en: 'Information for financial consumers', fa: 'اطلاعات برای مصرف‌کنندگان خدمات مالی' },
  publisher: { en: 'European Banking Authority', fa: 'مرجع بانکی اروپا' },
  url: 'https://www.eba.europa.eu/activities/information-consumers',
};

const spanishLandRegistry: InsightSource = {
  title: { en: 'Spanish Land Registry information for international buyers', fa: 'اطلاعات ثبت املاک اسپانیا برای خریداران بین‌المللی' },
  publisher: { en: 'College of Registrars of Spain', fa: 'سازمان ثبت‌کنندگان اسپانیا' },
  url: 'https://sede.registradores.org/contenido/buyingahouse/',
};

const spanishPropertyRegistry: InsightSource = {
  title: { en: 'Land Registry services and ownership information', fa: 'خدمات ثبت ملک و اطلاعات مالکیت' },
  publisher: { en: 'College of Registrars of Spain', fa: 'سازمان ثبت‌کنندگان اسپانیا' },
  url: 'https://sede.registradores.org/site/propiedad?lang=en_EN',
};

export const PLUCO_INSIGHTS_EXPANSION_A: Record<string, PlucoInsight> = {
  'eu-residency-route-map-iranian-family': {
    slug: 'eu-residency-route-map-iranian-family',
    category: { en: 'Mobility Planning', fa: 'برنامه‌ریزی جابه‌جایی' },
    country: { en: 'European Union', fa: 'اتحادیه اروپا' },
    title: { en: 'How an Iranian Family Can Build an EU Residency Route Map', fa: 'خانواده ایرانی چگونه نقشه مسیر اقامت اروپا را طراحی کند؟' },
    description: {
      en: 'A private-client method for comparing European residence routes by work, family, funds and the life you intend to build—not by headlines alone.',
      fa: 'روشی برای مقایسه مسیرهای اقامت اروپا بر اساس کار، خانواده، منابع مالی و زندگی مورد نظر؛ نه صرفاً تیترهای تبلیغاتی.',
    },
    seoTitle: { en: 'EU Residency Route Map for Iranian Families', fa: 'نقشه مسیر اقامت اروپا برای خانواده‌های ایرانی' },
    seoDescription: {
      en: 'Compare EU residence routes for an Iranian family using work, income, family, banking and long-term mobility factors before selecting a country.',
      fa: 'مسیرهای اقامت اروپا را با توجه به کار، درآمد، خانواده، بانکداری و جابه‌جایی بلندمدت مقایسه کنید.',
    },
    eyebrow: { en: 'MOBILITY STRATEGY', fa: 'راهبرد جابه‌جایی' },
    introduction: {
      en: 'A residence permit is not a destination; it is one legal layer of a much larger family decision. The useful starting point is therefore not “Which country is easiest?” but “What must remain possible after the move?” Work, schooling, healthcare, access to capital, travel patterns and the family’s tolerance for administrative uncertainty should shape the route map before a country is selected.',
      fa: 'مجوز اقامت مقصد نیست؛ تنها یک لایه حقوقی از تصمیمی بزرگ‌تر برای خانواده است. نقطه شروع مفید این نیست که «کدام کشور آسان‌تر است؟» بلکه باید پرسید «پس از جابه‌جایی چه چیزهایی باید همچنان ممکن بماند؟» کار، مدرسه، درمان، دسترسی به سرمایه، الگوی سفر و میزان تحمل خانواده در برابر عدم قطعیت اداری باید پیش از انتخاب کشور، نقشه مسیر را شکل دهند.',
    },
    image: '/images/insights/eu-residency-route-map-iranian-family.webp',
    imageAlt: { en: 'Iranian family comparing a European residence route map with a private mobility adviser', fa: 'خانواده ایرانی در حال مقایسه نقشه مسیرهای اقامت اروپا با مشاور جابه‌جایی' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08',
    readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: {
      en: ['EU residency for Iranian families', 'European residence route comparison', 'move family from Iran to Europe', 'EU mobility planning'],
      fa: ['اقامت اروپا برای خانواده ایرانی', 'مقایسه مسیرهای اقامت اروپا', 'مهاجرت خانوادگی از ایران به اروپا', 'برنامه‌ریزی اقامت اروپا'],
    },
    sections: [
      {
        heading: { en: 'Start with the family facts, not a country ranking', fa: 'از واقعیت‌های خانواده آغاز کنید، نه رتبه‌بندی کشورها' },
        paragraphs: {
          en: ['The EU Immigration Portal separates routes by purpose and by Member State because long-stay immigration is not one uniform European product. Employment, self-employment, highly qualified work, study and family routes can lead to very different rights and obligations. A route that suits one founder may be unusable for a spouse with a regulated profession or a child approaching an important school year.', 'Map nationality, current residence, work structure, income, family composition, criminal and travel history, insurance, language and available documentation. A credible assessment should expose weak points early rather than hide them behind a country shortlist.'],
          fa: ['درگاه مهاجرت اتحادیه اروپا مسیرها را بر اساس هدف و کشور عضو تفکیک می‌کند، زیرا مهاجرت بلندمدت یک محصول یکسان اروپایی نیست. استخدام، خوداشتغالی، کار تخصصی، تحصیل و پیوست خانواده می‌توانند حقوق و تعهدات بسیار متفاوتی ایجاد کنند. مسیری که برای یک بنیان‌گذار مناسب است ممکن است برای همسری با حرفه تحت نظارت یا فرزندی در سال مهم تحصیلی کارآمد نباشد.', 'ملیت، محل اقامت فعلی، ساختار کار، درآمد، اعضای خانواده، سابقه کیفری و سفر، بیمه، زبان و مدارک در دسترس را روی نقشه قرار دهید. ارزیابی معتبر باید نقاط ضعف را زود آشکار کند، نه اینکه آن‌ها را پشت فهرست کشورها پنهان سازد.'],
        },
      },
      {
        heading: { en: 'Compare rights after arrival, not only entry conditions', fa: 'حقوق پس از ورود را مقایسه کنید، نه فقط شرایط اولیه را' },
        paragraphs: {
          en: ['The value of a route appears after approval: whether a spouse can work, how children are documented, what renewals require, and whether time counts toward a more durable status. EU-level information is a starting framework, while national authorities determine the operational detail.', 'Create a twelve-month scenario for each serious option. Include the renewal calendar, actual days in the country, tax-residence analysis, healthcare, school timing, banking, document legalisation and the cost of maintaining compliant activity.'],
          fa: ['ارزش یک مسیر پس از تأیید آشکار می‌شود: آیا همسر حق کار دارد، فرزندان چگونه مستند می‌شوند، تمدید چه می‌خواهد و آیا زمان اقامت برای وضعیت پایدارتر محاسبه می‌شود. اطلاعات سطح اتحادیه اروپا چارچوب آغازین است و جزئیات اجرایی را مراجع ملی تعیین می‌کنند.', 'برای هر گزینه جدی، یک سناریوی دوازده‌ماهه بسازید. تقویم تمدید، روزهای حضور واقعی، تحلیل اقامت مالیاتی، درمان، زمان مدرسه، بانکداری، تأیید مدارک و هزینه حفظ فعالیت منطبق را وارد کنید.'],
        },
        bullets: { en: ['Principal applicant and dependants', 'Work rights for each adult', 'Renewal and physical-presence rules', 'Banking and source-of-funds readiness', 'Tax and social-security review'], fa: ['متقاضی اصلی و همراهان', 'حق کار هر بزرگسال', 'شرایط تمدید و حضور فیزیکی', 'آمادگی بانک و منشأ وجوه', 'بررسی مالیات و تأمین اجتماعی'] },
      },
      {
        heading: { en: 'Keep a primary route and a lawful alternative', fa: 'یک مسیر اصلی و یک جایگزین قانونی داشته باشید' },
        paragraphs: {
          en: ['Rules, administrative practice and family circumstances can change. A resilient plan identifies a primary route, the facts that make it viable and one genuine alternative—not a collection of speculative applications.', 'The decision becomes stronger when the family can explain why the selected country fits both the legal basis and the intended life. The objective is not the fastest card; it is a route the family can maintain without distorting its work, finances or relationships.'],
          fa: ['قواعد، رویه اداری و شرایط خانواده می‌تواند تغییر کند. برنامه مقاوم یک مسیر اصلی، واقعیت‌های پشتیبان آن و یک جایگزین واقعی را مشخص می‌کند؛ نه مجموعه‌ای از درخواست‌های احتمالی.', 'تصمیم زمانی قوی‌تر می‌شود که خانواده بتواند توضیح دهد چرا کشور انتخابی هم با مبنای حقوقی و هم با زندگی مورد نظر هماهنگ است. هدف سریع‌ترین کارت نیست؛ مسیری است که بدون تحریف کار، مالی یا روابط خانواده قابل حفظ باشد.'],
        },
      },
    ],
    sources: [euImmigrationPortal, euAlreadyResident],
    servicePath: { en: '/eu-residency', fa: '/fa/services/eu-residency' },
    serviceLabel: { en: 'Map your European residence options', fa: 'ترسیم گزینه‌های اقامت اروپا' },
    relatedSlugs: ['moving-family-spain-digital-nomad-route', 'first-year-spain-family-life-plan', 'eu-company-substance-management-residence'],
  },

  'first-year-spain-family-life-plan': {
    slug: 'first-year-spain-family-life-plan',
    category: { en: 'Family Life in Spain', fa: 'زندگی خانوادگی در اسپانیا' },
    country: { en: 'Spain', fa: 'اسپانیا' },
    title: { en: 'The First Year in Spain: A Family Life Plan Beyond the Residence Card', fa: 'سال نخست در اسپانیا؛ برنامه زندگی خانواده فراتر از کارت اقامت' },
    description: { en: 'A practical twelve-month plan for Iranian families aligning residence, school, healthcare, home, banking and a new Mediterranean rhythm.', fa: 'برنامه دوازده‌ماهه برای هماهنگی اقامت، مدرسه، درمان، خانه، بانکداری و ریتم تازه زندگی مدیترانه‌ای خانواده ایرانی.' },
    seoTitle: { en: 'First Year in Spain for Iranian Families', fa: 'سال نخست زندگی در اسپانیا برای خانواده ایرانی' },
    seoDescription: { en: 'Plan the first year in Spain around residence, school, healthcare, housing, banking and family routines—not the permit alone.', fa: 'سال نخست اسپانیا را با اقامت، مدرسه، درمان، خانه، بانکداری و عادت‌های خانواده برنامه‌ریزی کنید.' },
    eyebrow: { en: 'LIFE AFTER APPROVAL', fa: 'زندگی پس از تأیید' },
    introduction: { en: 'Approval closes one administrative chapter and opens a more human one. A successful first year is built in ordinary mornings: children reaching school calmly, adults knowing where they can work, medical cover functioning, payments moving lawfully and the family finding a social rhythm that does not feel temporary.', fa: 'تأیید پرونده یک فصل اداری را می‌بندد و فصل انسانی‌تری را باز می‌کند. سال نخست موفق در صبح‌های عادی ساخته می‌شود: کودکان با آرامش به مدرسه برسند، بزرگسالان بدانند کجا و چگونه می‌توانند کار کنند، پوشش درمانی عمل کند، پرداخت‌ها به‌صورت قانونی جریان یابد و خانواده ریتم اجتماعی پایداری پیدا کند.' },
    image: '/images/insights/first-year-spain-family-life.webp',
    imageAlt: { en: 'Iranian family preparing for school and work on a normal morning in a Valencia home', fa: 'خانواده ایرانی در حال آماده‌شدن برای مدرسه و کار در یک صبح عادی در خانه‌ای در والنسیا' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08', readTime: { en: '8 minute read', fa: '۸ دقیقه مطالعه' },
    keywords: { en: ['first year living in Spain Iranian family', 'move family to Spain checklist', 'Spain school healthcare relocation', 'family life Spain'], fa: ['سال اول زندگی در اسپانیا', 'چک‌لیست مهاجرت خانوادگی اسپانیا', 'مدرسه و درمان در اسپانیا', 'زندگی خانواده ایرانی در اسپانیا'] },
    sections: [
      { heading: { en: 'Sequence the essentials before arrival', fa: 'کارهای ضروری را پیش از ورود زمان‌بندی کنید' }, paragraphs: { en: ['School calendars, document legalisation, health cover, housing and registration do not all move at the same speed. Build a single arrival plan showing what must be completed before travel, during the first week and after a stable address is available.', 'Keep originals, certified copies and translations in a controlled family archive. Names and dates should be consistent across immigration, school, insurance and banking records.'], fa: ['تقویم مدرسه، تأیید مدارک، پوشش درمانی، خانه و ثبت‌های محلی با سرعت یکسان پیش نمی‌روند. یک برنامه ورود واحد بسازید که نشان دهد چه کاری پیش از سفر، در هفته نخست و پس از داشتن نشانی پایدار انجام می‌شود.', 'اصل مدارک، نسخه‌های تأییدشده و ترجمه‌ها را در بایگانی کنترل‌شده خانواده نگه دارید. نام‌ها و تاریخ‌ها باید در اسناد مهاجرت، مدرسه، بیمه و بانک هماهنگ باشند.'] } },
      { heading: { en: 'Design weekdays, not only weekends', fa: 'روزهای کاری را طراحی کنید، نه فقط آخر هفته را' }, paragraphs: { en: ['A beautiful city must also work at 8 a.m. Test school travel, workspace, groceries, healthcare, airport access and the family’s language needs. A smaller radius often creates a better life than a more prestigious address.', 'Children need continuity and adults need professional identity. Agree how much of the first year is for adaptation, what work remains international and which local relationships should be built deliberately.'], fa: ['یک شهر زیبا باید ساعت هشت صبح نیز کارآمد باشد. مسیر مدرسه، محل کار، خرید روزانه، درمان، دسترسی به فرودگاه و نیازهای زبانی را آزمایش کنید. شعاع کوچک‌تر زندگی گاهی از نشانی پرآوازه کیفیت بیشتری می‌سازد.', 'کودکان به تداوم و بزرگسالان به هویت حرفه‌ای نیاز دارند. مشخص کنید چه بخشی از سال نخست برای سازگاری است، کدام کار بین‌المللی باقی می‌ماند و چه روابط محلی باید آگاهانه ساخته شود.'] } },
      { heading: { en: 'Review the plan at 30, 90 and 180 days', fa: 'برنامه را در روزهای ۳۰، ۹۰ و ۱۸۰ بازبینی کنید' }, paragraphs: { en: ['Early reviews catch expiring documents, unplanned tax exposure, weak banking arrangements and routines that exhaust the family. Track residence conditions separately from quality-of-life goals.', 'A good relocation becomes quieter over time. The measure of success is not how impressive the move appears, but whether the family can live, work and plan the next year with confidence.'], fa: ['بازبینی‌های زودهنگام، مدارک رو به انقضا، مواجهه مالیاتی پیش‌بینی‌نشده، ضعف بانکداری و عادت‌های فرساینده را آشکار می‌کند. شرایط اقامت را جدا از اهداف کیفیت زندگی پیگیری کنید.', 'جابه‌جایی خوب با گذر زمان آرام‌تر می‌شود. معیار موفقیت ظاهر چشمگیر مهاجرت نیست؛ توان خانواده برای زندگی، کار و برنامه‌ریزی سال بعد با اطمینان است.'] } },
    ],
    sources: [euImmigrationPortal, euAlreadyResident],
    servicePath: { en: '/eu-residency', fa: '/fa/services/eu-residency' }, serviceLabel: { en: 'Plan a family move to Europe', fa: 'برنامه‌ریزی جابه‌جایی خانواده به اروپا' },
    relatedSlugs: ['eu-residency-route-map-iranian-family', 'moving-family-spain-digital-nomad-route', 'private-side-of-spain-culture-wellness-mediterranean-life'],
  },

  'spain-digital-nomad-contract-audit': {
    slug: 'spain-digital-nomad-contract-audit', category: { en: 'Spain Digital Nomad', fa: 'دیجیتال نومد اسپانیا' }, country: { en: 'Spain', fa: 'اسپانیا' },
    title: { en: 'Before Spain: Audit the Remote-Work Contracts Behind a Digital Nomad File', fa: 'پیش از اسپانیا؛ قراردادهای دورکاری پرونده دیجیتال نومد را بازبینی کنید' },
    description: { en: 'How employees, consultants and founders can align contracts, company evidence, income and actual remote activity before a Spanish Digital Nomad application.', fa: 'نحوه هماهنگی قرارداد، مدارک شرکت، درآمد و واقعیت دورکاری برای کارمند، مشاور یا بنیان‌گذار پیش از درخواست دیجیتال نومد اسپانیا.' },
    seoTitle: { en: 'Spain Digital Nomad Contract Audit', fa: 'بازبینی قرارداد ویزای دیجیتال نومد اسپانیا' },
    seoDescription: { en: 'Audit remote-work contracts, employer evidence, income and role descriptions before a Spain Digital Nomad application.', fa: 'قرارداد دورکاری، مدارک کارفرما، درآمد و شرح وظایف را پیش از درخواست دیجیتال نومد اسپانیا بررسی کنید.' },
    eyebrow: { en: 'WORK EVIDENCE', fa: 'مدارک فعالیت حرفه‌ای' },
    introduction: { en: 'The strongest remote-work file reads like one professional story. The contract explains the relationship, the company evidence explains the counterparty, the role can genuinely be performed online, and incoming payments match the written terms. An audit finds contradictions before an authority or bank does.', fa: 'پرونده قوی دورکاری یک روایت حرفه‌ای واحد دارد. قرارداد رابطه را توضیح می‌دهد، مدارک شرکت طرف مقابل را معرفی می‌کند، وظایف واقعاً آنلاین انجام‌پذیرند و پرداخت‌ها با شرایط مکتوب هماهنگ‌اند. بازبینی، تناقض‌ها را پیش از مرجع مهاجرت یا بانک پیدا می‌کند.' },
    image: '/images/insights/spain-digital-nomad-contract-audit.webp', imageAlt: { en: 'Iranian remote consultant reviewing international work contracts in a Madrid home office', fa: 'مشاور دورکار ایرانی در حال بازبینی قراردادهای کاری بین‌المللی در دفتر خانگی مادرید' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08', readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: { en: ['Spain digital nomad contract requirements', 'remote work contract Spain visa', 'digital nomad employee consultant evidence', 'Iranian remote worker Spain'], fa: ['قرارداد ویزای دیجیتال نومد اسپانیا', 'مدارک دورکاری اسپانیا', 'قرارداد فریلنسری دیجیتال نومد', 'دورکار ایرانی در اسپانیا'] },
    sections: [
      { heading: { en: 'Identify the real relationship', fa: 'ماهیت واقعی رابطه را مشخص کنید' }, paragraphs: { en: ['The official framework distinguishes employment from professional activity. An employee’s file should show a genuine overseas employer and permission to work remotely; a self-employed professional should show the commercial relationships supporting the activity. Labels cannot replace operating reality.', 'Review who controls hours and work, who bears commercial risk, how invoices or salary are calculated and whether the contract matches actual conduct. A founder should separate ownership from the personal service or employment basis relied upon.'], fa: ['چارچوب رسمی میان استخدام و فعالیت حرفه‌ای تفاوت می‌گذارد. پرونده کارمند باید کارفرمای واقعی خارجی و اجازه دورکاری را نشان دهد؛ فرد خوداشتغال باید روابط تجاری پشتیبان فعالیت را ثابت کند. عنوان‌ها جای واقعیت عملی را نمی‌گیرند.', 'بررسی کنید چه کسی ساعات و کار را کنترل می‌کند، ریسک تجاری بر عهده کیست، فاکتور یا حقوق چگونه محاسبه می‌شود و آیا قرارداد با رفتار واقعی هماهنگ است. بنیان‌گذار باید مالکیت شرکت را از مبنای خدمت یا استخدام شخصی تفکیک کند.'] } },
      { heading: { en: 'Make every document tell the same story', fa: 'همه مدارک باید یک روایت واحد داشته باشند' }, paragraphs: { en: ['Company registry records, website activity, contracts, invoices, payslips, bank receipts and professional experience should identify the same counterparties and commercial logic. Explain mergers, brand names, payment agents or currency changes rather than leaving the reviewer to infer them.', 'The official FAQ allows authorities to examine company activity and structure when deciding whether the role is genuinely remote. A description that depends on regular physical supervision, production control or in-person sales may raise questions even if the title sounds digital.'], fa: ['سوابق ثبت شرکت، فعالیت وب‌سایت، قراردادها، فاکتورها، فیش حقوق و واریزهای بانکی باید طرف‌ها و منطق تجاری یکسانی را نشان دهند. ادغام، نام تجاری، عامل پرداخت یا تغییر ارز را توضیح دهید و آن را به حدس بررسی‌کننده نسپارید.', 'پرسش‌های رسمی اجازه می‌دهد فعالیت و ساختار شرکت برای تشخیص واقعی‌بودن دورکاری بررسی شود. شرح وظیفه‌ای که به نظارت فیزیکی، کنترل تولید یا فروش حضوری وابسته است حتی با عنوان دیجیتال می‌تواند پرسش ایجاد کند.'] } },
      { heading: { en: 'Audit the contract before changing it', fa: 'قرارداد را پیش از تغییر بازبینی کنید' }, paragraphs: { en: ['Do not manufacture a new agreement solely for an application. Compare the existing relationship with the required evidence, then document legitimate clarifications, remote-work permission and duration through properly authorised company action.', 'Finish with a consistency table: document, issuer, date, counterparty, amount and claim supported. The objective is not more paper; it is fewer unexplained differences.'], fa: ['صرفاً برای درخواست، قرارداد ساختگی جدید نسازید. رابطه موجود را با مدارک لازم مقایسه کنید و سپس توضیحات مشروع، اجازه دورکاری و مدت را از طریق اقدام مجاز شرکت مستند سازید.', 'در پایان جدول هماهنگی بسازید: مدرک، صادرکننده، تاریخ، طرف، مبلغ و ادعای پشتیبانی‌شده. هدف کاغذ بیشتر نیست؛ تفاوت‌های توضیح‌داده‌نشده کمتر است.'] }, bullets: { en: ['Role and remote-work feasibility', 'Authorised signatures', 'Company identity and activity', 'Payment terms and actual receipts', 'Duration and termination provisions'], fa: ['شرح نقش و امکان دورکاری', 'امضاهای مجاز', 'هویت و فعالیت شرکت', 'شرایط پرداخت و واریزهای واقعی', 'مدت و شرایط خاتمه'] } },
    ],
    sources: [digitalNomadFaq, digitalNomadProcedure],
    servicePath: { en: '/spain-digital-nomad-visa', fa: '/fa/services/spain-digital-nomad-visa' }, serviceLabel: { en: 'Review a Spain Digital Nomad file', fa: 'بازبینی پرونده دیجیتال نومد اسپانیا' },
    relatedSlugs: ['spain-digital-nomad-visa-iranian-applicants-2026', 'apply-spain-digital-nomad-visa-tehran-or-spain', 'cross-border-contract-governing-law-jurisdiction'],
  },

  'source-of-funds-story-european-bank': {
    slug: 'source-of-funds-story-european-bank', category: { en: 'Banking & Compliance', fa: 'بانکداری و انطباق' }, country: { en: 'European Union', fa: 'اتحادیه اروپا' },
    title: { en: 'Source of Funds Is a Story With Evidence—not a Bank Balance', fa: 'منشأ وجوه یک روایت مستند است، نه فقط موجودی حساب' },
    description: { en: 'A private-client framework for connecting a transaction to its lawful economic origin across sale proceeds, income, dividends, inheritance or savings.', fa: 'چارچوبی برای اتصال یک تراکنش به منشأ اقتصادی قانونی آن؛ از فروش دارایی و درآمد تا سود شرکت، ارث یا پس‌انداز.' },
    seoTitle: { en: 'Source of Funds Evidence for European Banks', fa: 'مدارک منشأ وجوه برای بانک‌های اروپایی' },
    seoDescription: { en: 'Build a clear source-of-funds evidence trail for European banking, property or company transactions without hiding ownership or payment routes.', fa: 'مسیر مستند و روشن منشأ وجوه را برای بانک، ملک یا شرکت اروپایی آماده کنید.' },
    eyebrow: { en: 'PRIVATE BANKING FILE', fa: 'پرونده بانکداری خصوصی' },
    introduction: { en: 'A statement showing enough money answers only one question: where the funds are now. Compliance review may also ask which economic event created them, who owned them along the way and why this transaction makes sense. A good file connects those stages without gaps.', fa: 'صورتحسابی که موجودی کافی نشان می‌دهد فقط به یک پرسش پاسخ می‌دهد: پول اکنون کجاست. بررسی انطباق ممکن است بپرسد چه رویداد اقتصادی آن را ایجاد کرده، در طول مسیر متعلق به چه کسی بوده و چرا این تراکنش منطقی است. پرونده خوب این مراحل را بدون فاصله به هم متصل می‌کند.' },
    image: '/images/insights/source-of-funds-story-european-bank.webp', imageAlt: { en: 'Iranian entrepreneur and compliance adviser organising a European source-of-funds evidence file', fa: 'کارآفرین ایرانی و مشاور انطباق در حال تنظیم پرونده منشأ وجوه اروپا' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08', readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: { en: ['source of funds European bank', 'source of wealth evidence Iranian client', 'bank compliance documents Europe', 'property purchase source of funds'], fa: ['منشأ وجوه بانک اروپایی', 'مدارک منشأ ثروت ایرانیان', 'مدارک کامپلاینس بانکی', 'منشأ پول خرید ملک اروپا'] },
    sections: [
      { heading: { en: 'Separate the transaction from the wider wealth history', fa: 'تراکنش را از سابقه کلی ثروت تفکیک کنید' }, paragraphs: { en: ['Source of funds explains the money used for a specific transaction. Source of wealth explains how the client’s overall economic position developed. They overlap, but they are not interchangeable.', 'Start with the final amount and work backwards to the originating event. A property sale needs the sale agreement, ownership history and receipt; a dividend needs company accounts, resolution, ownership and payment; accumulated savings need income and account continuity.'], fa: ['منشأ وجوه، پول مورد استفاده در یک تراکنش مشخص را توضیح می‌دهد. منشأ ثروت نشان می‌دهد وضعیت اقتصادی کلی موکل چگونه شکل گرفته است. این دو هم‌پوشانی دارند اما یکسان نیستند.', 'از مبلغ نهایی آغاز کنید و به رویداد اولیه بازگردید. فروش ملک به قرارداد فروش، سابقه مالکیت و دریافت وجه نیاز دارد؛ سود شرکت به حساب‌ها، مصوبه، مالکیت و پرداخت؛ و پس‌انداز انباشته به درآمد و تداوم حساب.'] } },
      { heading: { en: 'Explain every person, account and conversion', fa: 'هر شخص، حساب و تبدیل را توضیح دهید' }, paragraphs: { en: ['Third-party accounts, family transfers, exchange conversions and payment intermediaries can be lawful, but they create additional links to evidence. Identify the legal owner, purpose, date, amount and authority for every step.', 'Never conceal nationality, beneficial ownership or the real payment route. Controlled disclosure through appropriate professionals protects privacy more effectively than incomplete information that later appears contradictory.'], fa: ['حساب شخص ثالث، انتقال خانوادگی، تبدیل ارز و واسطه پرداخت می‌تواند قانونی باشد، اما حلقه‌های بیشتری برای اثبات ایجاد می‌کند. مالک قانونی، هدف، تاریخ، مبلغ و اختیار هر مرحله را مشخص کنید.', 'ملیت، ذی‌نفع واقعی یا مسیر واقعی پرداخت را پنهان نکنید. افشای کنترل‌شده از طریق متخصص مناسب، حریم خصوصی را بهتر از اطلاعات ناقصی حفظ می‌کند که بعداً متناقض به نظر می‌رسد.'] } },
      { heading: { en: 'Build a reviewer-friendly file', fa: 'پرونده را برای بررسی‌کننده قابل فهم بسازید' }, paragraphs: { en: ['Lead with a one-page chronology and an index. Use stable filenames, complete statements and certified translations where needed. Cross-reference the evidence rather than sending an unexplained archive.', 'Requirements vary by institution, transaction and risk assessment. The purpose of preparation is not to guarantee acceptance; it is to give lawful funds the clearest possible documentary path.'], fa: ['پرونده را با گاه‌شمار یک‌صفحه‌ای و فهرست آغاز کنید. نام فایل ثابت، صورتحساب کامل و ترجمه تأییدشده در صورت نیاز استفاده کنید. مدارک را به هم ارجاع دهید و آرشیوی بدون توضیح ارسال نکنید.', 'الزامات بر اساس مؤسسه، تراکنش و ارزیابی ریسک متفاوت است. هدف آماده‌سازی تضمین پذیرش نیست؛ بلکه ساختن روشن‌ترین مسیر مستند برای وجوه قانونی است.'] }, bullets: { en: ['One-page narrative', 'Chronology of funds', 'Underlying economic event', 'Account-to-account trail', 'Translations and ownership evidence'], fa: ['روایت یک‌صفحه‌ای', 'گاه‌شمار وجوه', 'رویداد اقتصادی اولیه', 'مسیر حساب به حساب', 'ترجمه و مدارک مالکیت'] } },
    ],
    sources: [euAmlFramework, euDueDiligenceGuidance],
    servicePath: { en: '/banking', fa: '/fa/services/banking' }, serviceLabel: { en: 'Review banking and funds evidence', fa: 'بازبینی مدارک بانک و منشأ وجوه' },
    relatedSlugs: ['european-bank-onboarding-iranian-client', 'buying-property-spain-after-golden-visa', 'poland-company-first-90-days-iranian-founder'],
  },

  'european-bank-onboarding-iranian-client': {
    slug: 'european-bank-onboarding-iranian-client', category: { en: 'Banking & Compliance', fa: 'بانکداری و انطباق' }, country: { en: 'European Union', fa: 'اتحادیه اروپا' },
    title: { en: 'European Bank Onboarding for an Iranian Client: Make the Account Understandable', fa: 'افتتاح حساب اروپا برای موکل ایرانی؛ حساب را قابل فهم کنید' },
    description: { en: 'Prepare residence, tax, business, ownership, source-of-funds and expected-transaction evidence as one coherent European banking profile.', fa: 'مدارک اقامت، مالیات، کسب‌وکار، مالکیت، منشأ وجوه و تراکنش‌های مورد انتظار را در یک پروفایل بانکی منسجم آماده کنید.' },
    seoTitle: { en: 'European Bank Onboarding for Iranian Clients', fa: 'افتتاح حساب بانکی اروپا برای ایرانیان' },
    seoDescription: { en: 'A practical bank-onboarding framework for Iranian clients covering residence, tax, business purpose, ownership, funds and expected transactions.', fa: 'چارچوب عملی افتتاح حساب اروپا برای ایرانیان؛ اقامت، مالیات، هدف حساب، مالکیت، وجوه و تراکنش‌ها.' },
    eyebrow: { en: 'BANKING READINESS', fa: 'آمادگی بانکی' },
    introduction: { en: 'A bank does not assess a passport in isolation; it assesses a proposed relationship. Where does the client live, what creates the income, who owns the company, which countries will send or receive money, and why is this institution appropriate? The account becomes easier to evaluate when those answers agree.', fa: 'بانک گذرنامه را به‌تنهایی ارزیابی نمی‌کند؛ رابطه پیشنهادی را می‌سنجد. موکل کجا زندگی می‌کند، درآمد چگونه ایجاد می‌شود، مالک شرکت کیست، پول با کدام کشورها رفت‌وآمد دارد و چرا این مؤسسه مناسب است؟ وقتی پاسخ‌ها هماهنگ باشند، ارزیابی حساب روشن‌تر می‌شود.' },
    image: '/images/insights/european-bank-onboarding-iranian-client.webp', imageAlt: { en: 'Iranian international client discussing a European bank onboarding profile with a compliance professional in Warsaw', fa: 'موکل ایرانی در حال گفت‌وگو درباره پروفایل افتتاح حساب اروپا با متخصص انطباق در ورشو' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08', readTime: { en: '8 minute read', fa: '۸ دقیقه مطالعه' },
    keywords: { en: ['open European bank account Iranian', 'EU bank onboarding Iranian national', 'bank compliance Iranian client', 'European account documents'], fa: ['افتتاح حساب بانکی اروپا برای ایرانیان', 'کامپلاینس بانکی ایرانیان', 'مدارک حساب اروپا', 'بانک اروپایی برای ایرانیان'] },
    sections: [
      { heading: { en: 'Define the purpose before choosing the bank', fa: 'پیش از انتخاب بانک، هدف حساب را تعریف کنید' }, paragraphs: { en: ['Personal living costs, salary receipt, investment, property purchase and company operations are different account purposes. Select the institution and product only after mapping currencies, transaction countries, typical amounts and counterparties.', 'A basic payment-account right may exist in some EU circumstances, but it is not an unconditional right to every product or bank. Eligibility, residence and AML requirements still matter.'], fa: ['هزینه زندگی شخصی، دریافت حقوق، سرمایه‌گذاری، خرید ملک و عملیات شرکت اهداف متفاوتی برای حساب‌اند. مؤسسه و محصول را پس از تعیین ارزها، کشورهای تراکنش، مبالغ معمول و طرف‌های پرداخت انتخاب کنید.', 'در برخی شرایط اتحادیه اروپا ممکن است حق حساب پرداخت پایه وجود داشته باشد، اما این به معنی حق بی‌قیدوشرط برای هر محصول یا هر بانک نیست. شرایط، اقامت و الزامات مبارزه با پول‌شویی همچنان اهمیت دارند.'] } },
      { heading: { en: 'Build one coherent customer profile', fa: 'یک پروفایل منسجم از مشتری بسازید' }, paragraphs: { en: ['Residence documents, tax identification, professional activity, company ownership, source of income and source of funds should describe the same economic life. Explain multiple residences, historic addresses and inactive companies before they appear as discrepancies.', 'Expected transactions should be specific enough to test later: who pays, why, from where, how often and in which currency. A realistic modest profile is stronger than a broad claim designed to cover every future possibility.'], fa: ['مدارک اقامت، شناسه مالیاتی، فعالیت حرفه‌ای، مالکیت شرکت، منشأ درآمد و منشأ وجوه باید یک زندگی اقتصادی واحد را توصیف کنند. اقامت‌های متعدد، نشانی‌های قدیمی و شرکت‌های غیرفعال را پیش از آنکه تناقض به نظر برسند توضیح دهید.', 'تراکنش‌های مورد انتظار باید به‌اندازه کافی مشخص باشند: چه کسی، چرا، از کجا، چند بار و با چه ارزی پرداخت می‌کند. پروفایل محدود و واقعی از ادعایی گسترده که همه احتمال‌ها را پوشش می‌دهد قوی‌تر است.'] } },
      { heading: { en: 'Treat follow-up questions as part of onboarding', fa: 'پرسش‌های تکمیلی را بخشی از افتتاح حساب بدانید' }, paragraphs: { en: ['A request for more evidence is not itself an accusation or approval. Respond precisely, preserve the question and answer, and avoid changing the explanation without addressing why.', 'If service is refused or later restricted, obtain the communication available, follow the institution’s written complaint procedure and then consider the competent national authority or ombudsman. No adviser can guarantee account opening or continued service.'], fa: ['درخواست مدرک بیشتر به‌خودی‌خود اتهام یا تأیید نیست. دقیق پاسخ دهید، پرسش و پاسخ را نگه دارید و توضیح خود را بدون بیان علت تغییر ندهید.', 'اگر خدمت رد یا بعداً محدود شد، ارتباط موجود را دریافت کنید، مسیر شکایت مکتوب مؤسسه را طی کنید و سپس مرجع ملی یا آمبودزمان مربوط را بررسی کنید. هیچ مشاوری نمی‌تواند افتتاح یا ادامه حساب را تضمین کند.'] } },
    ],
    sources: [euBankAccounts, ebaConsumers],
    servicePath: { en: '/banking', fa: '/fa/services/banking' }, serviceLabel: { en: 'Prepare for European bank onboarding', fa: 'آمادگی برای افتتاح حساب اروپا' },
    relatedSlugs: ['source-of-funds-story-european-bank', 'cross-border-dispute-evidence-first-72-hours', 'eu-company-substance-management-residence'],
  },

  'spain-property-city-selection-private-client': {
    slug: 'spain-property-city-selection-private-client', category: { en: 'Spanish Property', fa: 'ملک اسپانیا' }, country: { en: 'Spain', fa: 'اسپانیا' },
    title: { en: 'Madrid, Valencia, Mallorca or the Costa del Sol? Choose the Life Before the Property', fa: 'مادرید، والنسیا، مایورکا یا کوستا دل سول؟ پیش از ملک، زندگی را انتخاب کنید' },
    description: { en: 'A private-client framework for comparing Spanish locations by twelve-month use, family routines, privacy, access and property due diligence.', fa: 'چارچوبی برای مقایسه مقاصد اسپانیا بر اساس استفاده دوازده‌ماهه، زندگی خانواده، حریم خصوصی، دسترسی و بررسی حقوقی ملک.' },
    seoTitle: { en: 'Where to Buy Property in Spain: Private Client Guide', fa: 'کجا در اسپانیا ملک بخریم؟ راهنمای موکل خصوصی' },
    seoDescription: { en: 'Compare Madrid, Valencia, Mallorca and Costa del Sol property around daily life, access, privacy, costs and independent legal checks.', fa: 'ملک مادرید، والنسیا، مایورکا و کوستا دل سول را با زندگی روزانه، دسترسی، حریم خصوصی و بررسی مستقل مقایسه کنید.' },
    eyebrow: { en: 'PLACE BEFORE PURCHASE', fa: 'مکان پیش از خرید' },
    introduction: { en: 'A Spanish home should be selected twice: first as a place inside a real year, then as a legal and financial asset. The view that works for a week may not solve school travel, winter life, airport access, privacy, staff, healthcare or the practical management of an empty property.', fa: 'خانه در اسپانیا باید دو بار انتخاب شود: نخست به‌عنوان مکانی در یک سال واقعی و سپس به‌عنوان دارایی حقوقی و مالی. منظره‌ای که برای یک هفته عالی است لزوماً مسیر مدرسه، زندگی زمستانی، فرودگاه، حریم خصوصی، کارکنان، درمان یا مدیریت ملک خالی را حل نمی‌کند.' },
    image: '/images/insights/spain-property-city-selection.webp', imageAlt: { en: 'Iranian couple comparing Spanish coastal property locations with an independent adviser', fa: 'زوج ایرانی در حال مقایسه موقعیت‌های ملک ساحلی اسپانیا با مشاور مستقل' },
    publishedOn: '2026-08-08', reviewedOn: '2026-08-08', readTime: { en: '9 minute read', fa: '۹ دقیقه مطالعه' },
    keywords: { en: ['where to buy property Spain Iranian', 'Madrid Valencia Mallorca Costa del Sol property', 'best Spanish city international family', 'private client Spain property'], fa: ['کجا در اسپانیا ملک بخریم', 'ملک مادرید والنسیا مایورکا ماربیا', 'بهترین شهر اسپانیا برای خانواده ایرانی', 'خرید ملک خصوصی اسپانیا'] },
    sections: [
      { heading: { en: 'Write the use case before viewing homes', fa: 'پیش از بازدید، شیوه استفاده را بنویسید' }, paragraphs: { en: ['Decide whether the property is a primary home, seasonal base, family meeting point or managed investment. Record likely months of use, occupants, work and school needs, visiting patterns and the acceptable management burden.', 'Madrid rewards connectivity and cultural depth; Valencia can offer a measured Mediterranean rhythm; Mallorca prioritises landscape and privacy; the Costa del Sol combines coastal life with established international communities. The right answer depends on the calendar, not a universal ranking.'], fa: ['مشخص کنید ملک خانه اصلی، پایگاه فصلی، محل گردهم‌آیی خانواده یا سرمایه‌گذاری مدیریت‌شده است. ماه‌های استفاده، ساکنان، نیازهای کار و مدرسه، الگوی مهمان و میزان قابل قبول مدیریت را ثبت کنید.', 'مادرید ارتباط و عمق فرهنگی می‌دهد؛ والنسیا می‌تواند ریتمی متعادل و مدیترانه‌ای داشته باشد؛ مایورکا بر طبیعت و حریم خصوصی تکیه دارد و کوستا دل سول زندگی ساحلی را با جامعه بین‌المللی پیوند می‌دهد. پاسخ درست به تقویم بستگی دارد، نه رتبه‌بندی عمومی.'] } },
      { heading: { en: 'Compare access, friction and full-year cost', fa: 'دسترسی، اصطکاک و هزینه سال کامل را مقایسه کنید' }, paragraphs: { en: ['Test direct flights, travel time to the airport, healthcare, schools, professional services, climate outside peak season and the reliability of property management. A remote villa may offer privacy while creating dependence on cars, staff and maintenance.', 'Model acquisition costs, community charges, insurance, utilities, works, security, furnishing and vacancy management. Price per square metre cannot express the cost of making a property genuinely usable.'], fa: ['پرواز مستقیم، زمان فرودگاه، درمان، مدرسه، خدمات حرفه‌ای، آب‌وهوای خارج از فصل و قابلیت اعتماد مدیریت ملک را بسنجید. ویلای دورافتاده ممکن است حریم خصوصی بدهد اما وابستگی به خودرو، کارکنان و نگهداری ایجاد کند.', 'هزینه خرید، شارژ مجتمع، بیمه، خدمات، بازسازی، امنیت، مبلمان و مدیریت دوره خالی را محاسبه کنید. قیمت هر متر نمی‌تواند هزینه قابل استفاده‌کردن واقعی ملک را نشان دهد.'] } },
      { heading: { en: 'Only then begin independent due diligence', fa: 'پس از آن بررسی مستقل را آغاز کنید' }, paragraphs: { en: ['Spanish registry information can identify ownership and current charges, but the wider review may also need planning, licences, community obligations, occupation, technical condition and contract terms. Use advisers responsible to the buyer, not only the sale.', 'Property ownership and residence remain separate legal questions. The refined purchase is a home that fits the family and survives independent legal, technical, banking and tax review.'], fa: ['اطلاعات ثبتی اسپانیا می‌تواند مالکیت و محدودیت‌های جاری را نشان دهد، اما بررسی گسترده‌تر ممکن است وضعیت شهرسازی، مجوزها، تعهدات مجتمع، تصرف، وضعیت فنی و شرایط قرارداد را نیز دربرگیرد. از مشاورانی استفاده کنید که مسئول منافع خریدارند، نه فقط فروش.', 'مالکیت ملک و اقامت همچنان دو پرسش حقوقی جدا هستند. خرید سنجیده خانه‌ای است که با خانواده هماهنگ باشد و بررسی مستقل حقوقی، فنی، بانکی و مالیاتی را پشت سر بگذارد.'] }, bullets: { en: ['Twelve-month use case', 'Airport and daily-life access', 'Full holding-cost model', 'Independent title and contract review', 'Separate residence and tax planning'], fa: ['کاربری دوازده‌ماهه', 'دسترسی فرودگاه و زندگی روزانه', 'مدل کامل هزینه نگهداری', 'بررسی مستقل مالکیت و قرارداد', 'برنامه جداگانه اقامت و مالیات'] } },
    ],
    sources: [spanishLandRegistry, spanishPropertyRegistry],
    servicePath: { en: '/eu-property-purchase', fa: '/fa/services/eu-property-purchase' }, serviceLabel: { en: 'Plan a Spanish property decision', fa: 'برنامه‌ریزی تصمیم ملک در اسپانیا' },
    relatedSlugs: ['buying-property-spain-after-golden-visa', 'private-side-of-spain-culture-wellness-mediterranean-life', 'first-year-spain-family-life-plan'],
  },
};
