import { ENGLISH_SERVICE_CONTENT } from './englishServiceContent';
import { POLISH_PAGES } from './polishContent';
import type { SiteLocale } from './languageRoutes';
import { PERSIAN_SERVICES } from './plucoPersianServices';

const topics = [
  { match: /\b(?:eb[- ]?5|green card|us immigration)\b|گرین کارت|سرمایه.گذاری آمریکا|zielon[aą] kart|do usa/iu, path: '/us-green-card', slug: 'us-green-card' },
  { match: /digital nomad|remote work|نومد|دورکار|nomad|prac[ay] zdaln/iu, path: '/spain-digital-nomad-visa', slug: 'spain-digital-nomad-visa' },
  { match: /citizenship|passport|تابعیت|پاسپورت|گذرنامه|obywatelstw|paszport/iu, path: '/new-identity', slug: 'second-citizenship' },
  { match: /bank|compliance|source.of.funds|بانک|انطباق|منبع وجوه|pochodzeni[eu] środków/iu, path: '/banking', slug: 'banking' },
  { match: /property|real estate|خرید ملک|املاک|nieruchomoś/iu, path: '/eu-property-purchase', slug: 'eu-property-purchase' },
  { match: /dispute|arbitration|اختلاف|داوری|spor[uy]|spór/iu, path: '/dispute-resolution', slug: 'dispute-resolution' },
  { match: /contract|agreement|قرارداد|umow|umów/iu, path: '/international-contracts', slug: 'international-contracts' },
  { match: /compan(?:y|ies)|incorporat|ثبت شرکت|تأسیس شرکت|spółk/iu, path: '/eu-company-registration', slug: 'eu-company-registration' },
  { match: /residen(?:cy|ce)|relocat|\bvisas?\b|اقامت|مهاجرت|ویزا|pobyt|wiz[ayę]|przeprowadzk/iu, path: '/eu-residency', slug: 'eu-residency' },
  { match: /business|market entry|کسب.وکار|firm[ayę]|działalnoś/iu, path: '/business-solutions', slug: 'business-solutions' },
] as const;

export function getChatbotAnswer(message: string, previousQuestion: string, locale: SiteLocale) {
  const topic = topics.find(({ match }) => match.test(message));
  const persian = locale === 'fa';
  if (locale === 'pl') {
    const handoff = 'Jeśli chcesz omówić swoją sytuację, wybierz „Wyślij poufne zapytanie”.';
    if (/gwarancj|gwarant|czy się kwalifikuj/iu.test(message)) {
      return 'Wynik zależy od okoliczności sprawy, aktualnych przepisów i decyzji właściwych organów. ' + handoff;
    }

    if (/dokument|zaświadczeni/iu.test(message)) {
      const service = topic ?? topics.find(({ match }) => match.test(previousQuestion));
      return service
        ? POLISH_PAGES[service.path.slice(1) as keyof typeof POLISH_PAGES].points.slice(0, 2).join(' ') + ' ' + handoff
        : 'Potrzebne dokumenty zależą od rodzaju sprawy i kraju. Opisz swój cel i kraj zamieszkania. Zachowaj dokumenty tożsamości i dane bankowe do rozmowy z zespołem.';
    }

    if (topic) return POLISH_PAGES[topic.path.slice(1) as keyof typeof POLISH_PAGES].description + ' ' + handoff;
    if (/konsultac|spotkanie|zapytani|umówi/iu.test(message)) return 'Zespół Pluco zapozna się z Twoją sprawą i skontaktuje się w sprawie dalszych kroków. ' + handoff;
    return 'Mogę odpowiedzieć na ogólne pytania o pobyt, obywatelstwo, bankowość, nieruchomości, rejestrację spółki, umowy i spory transgraniczne. Który temat Cię interesuje?';
  }

  const handoff = persian
    ? 'برای بررسی شرایط پرونده، گزینه «درخواست محرمانه» را انتخاب کنید.'
    : 'For a review of your specific situation, choose “Start Private Inquiry” below.';

  if (/guarantee|am i eligible|do i qualify|تضمین|واجد شرایط/iu.test(message)) {
    return persian
      ? 'نتیجه یا زمان رسیدگی به پرونده قابل تضمین نیست. بررسی شرایط به مدارک، مقررات روز و تصمیم مراجع مربوط بستگی دارد. ' + handoff
      : 'Eligibility, timing and outcomes depend on your circumstances, current rules and the relevant authorities. ' + handoff;
  }

  if (/document|paperwork|مدارک|اسناد/iu.test(message)) {
    const service = topic ?? topics.find(({ match }) => match.test(previousQuestion));
    if (service) {
      const scope = persian
        ? PERSIAN_SERVICES[service.slug].process.slice(0, 2).join('. ')
        : ENGLISH_SERVICE_CONTENT[service.path].scope.slice(0, 2).join('. ');
      return (persian ? 'برای آمادگی اولیه، تیم این موارد را بررسی می‌کند. ' : 'To get started, our team can help with the following. ') + scope + '. ' + handoff;
    }
    return persian
      ? 'مدارک لازم به نوع خدمت و کشور مربوط بستگی دارد. برای شروع، موضوع و کشور محل اقامت خود را مشخص کنید. لطفاً مدارک هویتی یا اطلاعات بانکی را در چت نفرستید.'
      : 'The documents depend on the service and country. Start by describing your goal and country of residence. Please keep identity documents and banking details out of the chat.';
  }

  if (topic) {
    const summary = persian ? PERSIAN_SERVICES[topic.slug].description : ENGLISH_SERVICE_CONTENT[topic.path].description;
    return summary + ' ' + handoff;
  }

  if (/consultation|appointment|inquiry|book(?:ing)?|مشاوره|رزرو|درخواست محرمانه/iu.test(message)) {
    return persian
      ? 'با گزینه «درخواست محرمانه» موضوع خود و زمان پیشنهادی را ارسال کنید. تیم پلوکو درخواست را بررسی می‌کند و برای هماهنگی مرحله بعد با شما تماس می‌گیرد.'
      : 'Use “Start Private Inquiry” to tell us what you need and suggest a time. Pluco Group reviews the request and contacts you to confirm the next step.';
  }

  return persian
    ? 'می‌توانم درباره خدمات پلوکو در زمینه اقامت اروپا، تابعیت دوم، امور بانکی، ثبت شرکت، خرید ملک، قراردادها و اختلافات فرامرزی راهنمایی کلی ارائه کنم. درباره کدام موضوع سؤال دارید؟'
    : 'I can help with general questions about Pluco’s European residency, second citizenship, banking, company registration, property, contracts and dispute services. Which area would you like to ask about?';
}
