import Link from 'next/link';
import { SITE_URL } from '@/lib/siteMetadata';

type Locale = 'en' | 'fa';

const content = {
  en: {
    path: '/resources/source-of-funds-checklist',
    alternatePath: '/fa/resources/source-of-funds-checklist',
    home: 'Home',
    resources: 'Resources',
    eyebrow: 'Free bilingual compliance resource · Printable checklist',
    title: 'European Bank Source-of-Funds Evidence Checklist',
    intro:
      'Use this document-led checklist to organise the origin, ownership, route, and purpose of funds before responding to a European bank. It is designed for internationally mobile clients, including Iranian nationals living outside Iran.',
    reviewed: 'Reviewed 26 July 2026',
    prepared: 'Prepared by PLUCO GROUP',
    print: 'Print or save this page as PDF',
    warning:
      'This is a preparation tool, not legal or financial advice and not a guarantee of acceptance. A bank may request different evidence based on the customer, transaction, country, sanctions exposure, and its own risk controls. Do not send identity or banking records through an unsecured first-contact channel.',
    sections: [
      {
        title: '1. Request and transaction summary',
        items: [
          'Bank name, case reference, responsible team, and response deadline',
          'Exact wording of the bank’s request',
          'Transaction amount, currency, date, purpose, and destination',
          'One-paragraph explanation of who owns the funds and why the transaction is occurring',
        ],
      },
      {
        title: '2. Identity, residence, and ownership',
        items: [
          'Current identity and lawful-residence evidence',
          'Current address evidence, where relevant to the request',
          'Beneficial owner of the funds and explanation of every relevant third party',
          'Name variations or transliterations explained consistently across documents',
        ],
      },
      {
        title: '3. Evidence that generated the funds',
        items: [
          'Employment: contract, payslips, tax records, and matching salary credits',
          'Business income: company records, ownership, accounts, invoices, distributions, and tax evidence',
          'Property or asset sale: prior ownership, sale agreement, completion evidence, taxes, and receipt of proceeds',
          'Gift, loan, or inheritance: legal basis, relationship, donor or estate evidence, and ability to provide the funds',
        ],
      },
      {
        title: '4. Complete movement-of-money trail',
        items: [
          'Originating account statement showing the funds before transfer',
          'Every intermediary account and conversion step',
          'Receiving account statement or transaction confirmation',
          'Dates, amounts, currencies, fees, and account holders reconciled in one chronology',
        ],
      },
      {
        title: '5. Consistency and compliance checks',
        items: [
          'Contracts, statements, tax records, and narrative use consistent dates and amounts',
          'Unusual gaps, cash deposits, third parties, or cross-border routing are explained with evidence',
          'Relevant persons, banks, and entities have been screened under the applicable sanctions rules',
          'Translations or certifications meet the receiving institution’s stated requirements',
        ],
      },
      {
        title: '6. Submission pack',
        items: [
          'One-page cover note with the request, answer, and document index',
          'Numbered evidence files linked to each material statement',
          'Only relevant records included; unrelated personal information redacted where lawful and appropriate',
          'Secure delivery method confirmed and a complete copy retained',
        ],
      },
    ],
    chronologyTitle: 'One-page chronology template',
    chronology:
      'For each material step, record: date → event → amount and currency → sender/account holder → recipient/account holder → supporting document number. The ending balance of one step should reconcile with the beginning of the next, allowing for declared fees or currency conversion.',
    redFlagsTitle: 'Stop and resolve these gaps before submission',
    redFlags: [
      'The narrative names a different owner, payer, recipient, amount, or date than the evidence.',
      'Funds appear without a documented generating event or pass through an unexplained third party.',
      'A document has been edited, reconstructed, backdated, or translated without required certification.',
      'The proposed transfer may involve a designated person, prohibited activity, or restricted bank or route.',
    ],
    sourcesTitle: 'Official sources to check before relying on this resource',
    sources: [
      {
        label: 'European Commission — EU anti-money-laundering framework',
        url: 'https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en',
      },
      {
        label: 'Council of the EU — current EU sanctions against Iran',
        url: 'https://www.consilium.europa.eu/en/policies/sanctions-against-iran/',
      },
      {
        label: 'European Commission — sanctions overview and resources',
        url: 'https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures/overview-sanctions-and-related-resources_en',
      },
    ],
    nextTitle: 'Need a structured review?',
    nextBody:
      'PLUCO GROUP can review the request, chronology, supporting records, and material gaps, then define an appropriate scope or coordinate jurisdiction-specific support. No bank or authority outcome is guaranteed.',
    service: 'Review banking and source-of-funds evidence',
    guide: 'Read the full source-of-funds guide',
    language: 'نسخه فارسی',
  },
  fa: {
    path: '/fa/resources/source-of-funds-checklist',
    alternatePath: '/resources/source-of-funds-checklist',
    home: 'صفحه فارسی',
    resources: 'منابع',
    eyebrow: 'منبع رایگان دو‌زبانه انطباق · چک‌لیست قابل چاپ',
    title: 'چک‌لیست مدارک منبع وجوه برای بانک‌های اروپایی',
    intro:
      'پیش از پاسخ به بانک اروپایی، با این چک‌لیست منشأ، مالکیت، مسیر انتقال و هدف وجوه را منظم کنید. این ابزار برای اشخاص دارای زندگی و فعالیت بین‌المللی، از جمله ایرانیان مقیم خارج از ایران، طراحی شده است.',
    reviewed: 'بازبینی‌شده در ۲۶ ژوئیه ۲۰۲۶',
    prepared: 'تهیه‌شده توسط PLUCO GROUP',
    print: 'چاپ یا ذخیره این صفحه به‌صورت PDF',
    warning:
      'این صفحه ابزار آماده‌سازی است، نه مشاوره حقوقی یا مالی و نه تضمین پذیرش بانک. بانک ممکن است با توجه به مشتری، تراکنش، کشورها، ریسک تحریم و کنترل‌های داخلی مدارک متفاوتی بخواهد. مدارک هویتی یا بانکی را از طریق کانال اولیه ناامن ارسال نکنید.',
    sections: [
      {
        title: '۱. خلاصه درخواست و تراکنش',
        items: [
          'نام بانک، شماره پرونده، واحد مسئول و مهلت پاسخ',
          'متن دقیق درخواست بانک',
          'مبلغ، ارز، تاریخ، هدف و مقصد تراکنش',
          'توضیح کوتاه درباره مالک وجوه و دلیل انجام تراکنش',
        ],
      },
      {
        title: '۲. هویت، اقامت و مالکیت',
        items: [
          'مدرک هویت و اقامت قانونی فعلی',
          'مدرک نشانی فعلی، در صورت ارتباط با درخواست',
          'مالک واقعی وجوه و توضیح نقش هر شخص ثالث مرتبط',
          'توضیح یکسان و روشن برای تفاوت املای نام‌ها و تبدیل حروف فارسی به لاتین',
        ],
      },
      {
        title: '۳. مدارک رویدادی که پول را ایجاد کرده است',
        items: [
          'درآمد شغلی: قرارداد، فیش حقوقی، مالیات و واریزهای منطبق',
          'درآمد کسب‌وکار: ثبت و مالکیت شرکت، حساب‌ها، فاکتورها، سود تقسیمی و مالیات',
          'فروش ملک یا دارایی: مالکیت قبلی، قرارداد فروش، تکمیل معامله، مالیات و دریافت مبلغ',
          'هدیه، وام یا ارث: مبنای قانونی، رابطه، مدارک اهداکننده یا ترکه و توانایی تأمین وجوه',
        ],
      },
      {
        title: '۴. زنجیره کامل حرکت پول',
        items: [
          'صورت‌حساب مبدأ که وجود وجوه پیش از انتقال را نشان دهد',
          'تمام حساب‌های واسط و مراحل تبدیل ارز',
          'صورت‌حساب مقصد یا تأیید تراکنش',
          'تطبیق تاریخ، مبلغ، ارز، کارمزد و صاحبان حساب در یک خط زمانی',
        ],
      },
      {
        title: '۵. کنترل سازگاری و انطباق',
        items: [
          'قراردادها، صورت‌حساب‌ها، مالیات و توضیحات دارای تاریخ و مبلغ سازگار هستند',
          'وقفه‌ها، واریز نقدی، شخص ثالث یا مسیر غیرمعمول با مدرک توضیح داده شده است',
          'اشخاص، بانک‌ها و نهادهای مرتبط بر اساس قواعد تحریمی قابل اعمال بررسی شده‌اند',
          'ترجمه یا تأیید مدارک با الزامات اعلام‌شده بانک دریافت‌کننده منطبق است',
        ],
      },
      {
        title: '۶. بسته نهایی ارسال',
        items: [
          'نامه پوششی یک‌صفحه‌ای شامل درخواست، پاسخ و فهرست مدارک',
          'شماره‌گذاری مدارک و اتصال هر ادعای مهم به سند مربوط',
          'ارسال فقط مدارک مرتبط و حذف قانونی اطلاعات شخصی نامرتبط در صورت امکان',
          'تأیید روش امن ارسال و نگهداری یک نسخه کامل',
        ],
      },
    ],
    chronologyTitle: 'الگوی خط زمانی یک‌صفحه‌ای',
    chronology:
      'برای هر مرحله مهم ثبت کنید: تاریخ ← رویداد ← مبلغ و ارز ← فرستنده/صاحب حساب ← گیرنده/صاحب حساب ← شماره سند پشتیبان. مانده پایان هر مرحله باید با آغاز مرحله بعد، با لحاظ کارمزد یا تبدیل ارز اعلام‌شده، قابل تطبیق باشد.',
    redFlagsTitle: 'پیش از ارسال، این شکاف‌ها را متوقف و برطرف کنید',
    redFlags: [
      'توضیحات و مدارک درباره مالک، پرداخت‌کننده، گیرنده، مبلغ یا تاریخ با هم تفاوت دارند.',
      'پول بدون رویداد مولد مستند ظاهر شده یا از شخص ثالث بدون توضیح عبور کرده است.',
      'سندی ویرایش، بازسازی یا عقب‌تاریخ شده یا ترجمه لازم بدون تأیید موردنیاز ارائه شده است.',
      'انتقال ممکن است با شخص تحریم‌شده، فعالیت ممنوع یا بانک و مسیر محدودشده ارتباط داشته باشد.',
    ],
    sourcesTitle: 'منابع رسمی برای کنترل اطلاعات روز',
    sources: [
      {
        label: 'کمیسیون اروپا — چارچوب مبارزه با پول‌شویی اتحادیه اروپا',
        url: 'https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en',
      },
      {
        label: 'شورای اتحادیه اروپا — تحریم‌های جاری اتحادیه اروپا علیه ایران',
        url: 'https://www.consilium.europa.eu/en/policies/sanctions-against-iran/',
      },
      {
        label: 'کمیسیون اروپا — مرور تحریم‌ها و منابع مرتبط',
        url: 'https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures/overview-sanctions-and-related-resources_en',
      },
    ],
    nextTitle: 'به بررسی ساختاریافته نیاز دارید؟',
    nextBody:
      'PLUCO GROUP می‌تواند درخواست بانک، خط زمانی، مدارک پشتیبان و شکاف‌های مهم را بررسی و سپس دامنه مناسب همکاری یا هماهنگی با متخصص کشور مربوط را مشخص کند. نتیجه بانک یا مرجع قابل تضمین نیست.',
    service: 'درخواست بررسی بانکی و منبع وجوه',
    guide: 'مطالعه راهنمای کامل منبع وجوه',
    language: 'English version',
  },
} as const;

export default function SourceOfFundsChecklist({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const isFa = locale === 'fa';
  const url = `${SITE_URL}${copy.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: copy.title,
        description: copy.intro,
        url,
        inLanguage: locale,
        datePublished: '2026-07-26',
        dateModified: '2026-07-26',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: copy.home, item: isFa ? `${SITE_URL}/fa` : SITE_URL },
          { '@type': 'ListItem', position: 2, name: copy.resources, item: url },
          { '@type': 'ListItem', position: 3, name: copy.title, item: url },
        ],
      },
    ],
  };

  return (
    <main lang={locale} dir={isFa ? 'rtl' : 'ltr'} className="bg-[#F7F5EF] text-[#172033] print:bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <article>
        <header className="bg-[#071C3C] text-white print:bg-white print:text-black">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24 print:py-6">
            <nav aria-label={isFa ? 'مسیر صفحه' : 'Breadcrumb'} className="text-sm text-slate-300 print:hidden">
              <Link href={isFa ? '/fa' : '/'}>{copy.home}</Link>
              <span className="px-2">/</span>
              <Link href={isFa ? '/fa/guides' : '/guides'}>{copy.resources}</Link>
            </nav>
            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-[#E3C783] print:mt-0 print:text-black">
              {copy.eyebrow}
            </p>
            <h1 className={`mt-5 text-4xl font-black sm:text-5xl ${isFa ? 'leading-[1.55]' : 'leading-tight'}`}>
              {copy.title}
            </h1>
            <p className={`mt-6 max-w-4xl text-lg text-slate-200 print:text-slate-700 ${isFa ? 'leading-9' : 'leading-8'}`}>
              {copy.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300 print:text-slate-600">
              <span>{copy.prepared}</span><span>·</span><span>{copy.reviewed}</span>
            </div>
            <p className="mt-5 text-sm font-bold text-[#E3C783] print:hidden">{copy.print}</p>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 print:py-4">
          <div className={`rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-5 text-sm text-slate-700 ${isFa ? 'leading-8' : 'leading-7'}`}>
            {copy.warning}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 print:grid-cols-2 print:gap-4">
            {copy.sections.map((section) => (
              <section key={section.title} className="break-inside-avoid rounded-2xl bg-white p-6 shadow-sm print:border print:border-slate-300 print:shadow-none">
                <h2 className={`text-xl font-black ${isFa ? 'leading-9' : 'leading-8'}`}>{section.title}</h2>
                <ul className="mt-5 grid gap-4">
                  {section.items.map((item) => (
                    <li key={item} className={`flex gap-3 text-slate-700 ${isFa ? 'leading-8' : 'leading-7'}`}>
                      <span aria-hidden="true" className="mt-1 inline-block h-5 w-5 shrink-0 rounded border-2 border-[#8B6A23]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section className="mt-10 break-inside-avoid rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-2xl font-black">{copy.chronologyTitle}</h2>
            <p className={`mt-4 text-slate-700 ${isFa ? 'leading-9' : 'leading-8'}`}>{copy.chronology}</p>
          </section>

          <section className="mt-10 break-inside-avoid rounded-2xl border border-red-200 bg-red-50 p-7">
            <h2 className="text-2xl font-black text-red-950">{copy.redFlagsTitle}</h2>
            <ul className="mt-5 grid gap-3">
              {copy.redFlags.map((item) => (
                <li key={item} className={`flex gap-3 text-red-950 ${isFa ? 'leading-8' : 'leading-7'}`}>
                  <span className="font-black">!</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 break-inside-avoid rounded-2xl bg-white p-7">
            <h2 className="text-2xl font-black">{copy.sourcesTitle}</h2>
            <ul className="mt-5 grid gap-3">
              {copy.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className={`font-bold text-[#71551d] underline ${isFa ? 'leading-8' : 'leading-7'}`}>
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-3xl bg-[#071C3C] p-8 text-white print:hidden">
            <h2 className={`text-3xl font-black ${isFa ? 'leading-[1.55]' : 'leading-tight'}`}>{copy.nextTitle}</h2>
            <p className={`mt-4 max-w-3xl text-slate-200 ${isFa ? 'leading-9' : 'leading-8'}`}>{copy.nextBody}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href={isFa ? '/fa/services/banking#service-enquiry' : '/banking'} className="rounded-full bg-[#C9A35A] px-6 py-3 font-bold text-[#071C3C]">
                {copy.service}
              </Link>
              <Link href={isFa ? '/fa/guides/source-of-funds-file' : '/guides/source-of-funds-file'} className="rounded-full border border-white/40 px-6 py-3 font-bold text-white">
                {copy.guide}
              </Link>
              <Link href={copy.alternatePath} hrefLang={isFa ? 'en' : 'fa'} className="rounded-full border border-white/40 px-6 py-3 font-bold text-white">
                {copy.language}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
