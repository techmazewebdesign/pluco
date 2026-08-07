'use client';

import { motion } from 'framer-motion';
import { Globe, Scale, Landmark, Building2, BookOpen, Briefcase, Key, Home } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const services = [
  { titleKey: 'nav.newIdentity' as const,             descEn: 'Neutral mobility, nationality, family and compliance planning before selecting a route.', descFa: 'برنامه‌ریزی بی‌طرفانه تحرک، تابعیت، خانواده و انطباق پیش از انتخاب مسیر.',      Icon: Key,        href: '/new-identity' },
  { titleKey: 'nav.euResidency' as const,             descEn: 'European residence solutions through investment, business and professional routes.',         descFa: 'راهکارهای اقامت اروپایی از طریق سرمایه‌گذاری، تجارت و مسیرهای حرفه‌ای.',         Icon: Home,       href: '/eu-residency' },
  { titleKey: 'nav.euPropertyPurchase' as const,      descEn: 'Property acquisition with legal due diligence, fund-transfer documentation and residency strategy.', descFa: 'خرید ملک با بررسی حقوقی دقیق، مستندات انتقال وجه و استراتژی اقامت.',           Icon: Building2,  href: '/eu-property-purchase' },
  { titleKey: 'nav.usGreenCard' as const,             descEn: 'EB-5 investment-based US permanent residence planning for qualified investors.',            descFa: 'برنامه‌ریزی اقامت دائم آمریکا از طریق برنامه سرمایه‌گذاری EB-5.',                Icon: Globe,      href: '/us-green-card' },
  { titleKey: 'nav.banking' as const,                 descEn: 'Banking access, compliance documentation and financial exclusion support.',                  descFa: 'پشتیبانی دسترسی بانکی، مستندات انطباق و حمایت در برابر محرومیت مالی.',         Icon: Landmark,   href: '/banking' },
  { titleKey: 'nav.disputeResolution' as const,       descEn: 'Strategic dispute resolution through negotiation, documentation and specialist counsel.',     descFa: 'حل استراتژیک اختلافات از طریق مذاکره، مستندسازی و مشاور متخصص.',              Icon: Scale,      href: '/dispute-resolution' },
  { titleKey: 'nav.internationalContracts' as const,  descEn: 'Cross-border contracts drafted, reviewed and negotiated with legal precision.',              descFa: 'تنظیم، بررسی و مذاکره قراردادهای بین‌المللی با دقت حقوقی.',                    Icon: Globe,      href: '/international-contracts' },
  { titleKey: 'nav.businessSolutions' as const,       descEn: 'European market entry, digital growth, automation and operational expansion support.',       descFa: 'پشتیبانی ورود به بازار اروپا، رشد دیجیتال، اتوماسیون و توسعه عملیاتی.',      Icon: Briefcase,  href: '/business-solutions' },
  { titleKey: 'nav.euCompanyRegistration' as const,   descEn: 'EU company formation, corporate structuring and post-incorporation legal coordination.',     descFa: 'تأسیس شرکت در اروپا، ساختاردهی شرکتی و هماهنگی حقوقی پس از ثبت.',           Icon: Building2,  href: '/eu-company-registration' },
  { titleKey: 'nav.publications' as const,            descEn: 'Legal commentary and strategic insights on banking discrimination, compliance and immigration.', descFa: 'تفسیر حقوقی و بینش‌های استراتژیک درباره تبعیض بانکی، انطباق و مهاجرت.',    Icon: BookOpen,   href: '/publications' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: index * 0.06, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

export default function Services() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="pluco-home-services py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {t('services.eyebrow')}
          </p>
          <h2
            className="text-2xl md:text-3xl font-serif font-bold tracking-wide"
            style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {t('services.heading')}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mt-4"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <p
            className="text-sm mt-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {t('services.body')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.href}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -8, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
              className="pluco-home-service-card flex flex-col p-6 border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            >
              <Link href={service.href} className="contents">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ border: '2px solid #C9A35A' }}
                >
                  <service.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </motion.div>
                <h3
                  className="text-sm font-bold mb-3 leading-snug group-hover:text-[#C9A35A] transition-colors"
                  style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
                >
                  {t(service.titleKey)}
                </h3>
                <p
                  className="text-xs leading-relaxed flex-grow"
                  style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
                >
                  {isRTL ? service.descFa : service.descEn}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
