'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Globe, Lock, Briefcase, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const trustItems = [
  {
    titleEn: 'Discreet & Confidential',
    titleFa: 'محرمانه و ایمن',
    descEn: 'We handle sensitive matters with complete confidentiality. No public announcements, no unnecessary correspondence, no disclosure of your affairs.',
    descFa: 'ما امور حساس را با رازداری کامل مدیریت می‌کنیم. هیچ اعلام عمومی، هیچ مکاتبه غیر ضروری، هیچ افشای امور شما.',
    Icon: Lock,
  },
  {
    titleEn: 'Legal Rigor & Compliance',
    titleFa: 'دقت حقوقی و انطباق',
    descEn: 'Every engagement follows strict conflict checks, regulatory compliance and professional standards. We act within legal frameworks, not around them.',
    descFa: 'هر مشاركت بر اساس بررسی‌های دقیق تعارض منافع، انطباق نظارتی و استانداردهای حرفه‌ای صورت می‌گیرد.',
    Icon: Shield,
  },
  {
    titleEn: 'Cross-Border Expertise',
    titleFa: 'تخصص بین‌المللی',
    descEn: 'Our team spans European legal systems, tax jurisdictions, banking regulations and immigration frameworks. Coordinated advice across borders.',
    descFa: 'تیم ما در نظام‌های حقوقی اروپایی، حوزه‌های مالیاتی، مقررات بانکی و چارچوب‌های مهاجرتی فعالیت دارد.',
    Icon: Globe,
  },
  {
    titleEn: 'Senior-Led & Experienced',
    titleFa: 'رهبری ارشد و تجربه‌شده',
    descEn: 'Led by Reza Ostad, an international banking, compliance and immigration lawyer. Your matters are handled by experienced professionals, not junior staff.',
    descFa: 'تحت رهبری رضا استاد، وکیل بین‌المللی متخصص در بانکداری، انطباق و مهاجرت. امور شما توسط متخصصین مجرب رسیدگی می‌شود.',
    Icon: Users,
  },
  {
    titleEn: 'Proactive Strategic Thinking',
    titleFa: 'تفکر استراتژیک فعال',
    descEn: 'We anticipate risks and opportunities. Rather than reactive problem-solving, we structure solutions to protect your interests long-term.',
    descFa: 'ما ریسک‌ها و فرصت‌ها را پیش‌بینی می‌کنیم. به جای حل مسائل به صورت واکنشی، راهکارهایی ساختار می‌دهیم که منافع شما را در دراز مدت حفاظت کند.',
    Icon: Briefcase,
  },
  {
    titleEn: 'Outcome-Focused Results',
    titleFa: 'نتایج متمرکز بر اهداف',
    descEn: 'We measure success by your success. Clear milestones, transparent communication, and documented outcomes on every engagement.',
    descFa: 'موفقیت ما بر اساس موفقیت شما سنجیده می‌شود. سنگ‌نشان‌های واضح، ارتباط شفاف و نتایج مستندسازی شده در هر پروژه.',
    Icon: CheckCircle2,
  },
];

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

export default function Trust() {
  const { isRTL } = useLanguage();

  return (
    <section className="py-24 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {isRTL ? 'اعتماد و تجربه' : 'TRUST & AUTHORITY'}
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif font-bold tracking-wide mb-5"
            style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL ? 'چرا موکلین PLUCO GROUP را انتخاب می‌کنند' : 'Why Clients Choose PLUCO GROUP'}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 mx-auto mb-5"
            style={{ backgroundColor: '#C9A35A' }}
          />
          <p
            className="text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
          >
            {isRTL
              ? 'ما خدمات حقوقی ارائه نمی‌دهیم — ما پشتیبانی استراتژیک، رازداری و محافظت دراز‌مدت برای خانواده‌ها و کارآفرینان بین‌المللی فراهم می‌کنیم.'
              : 'We don\'t provide legal services—we provide strategic support, confidentiality and long-term protection for internationally mobile families and entrepreneurs.'}
          </p>
        </motion.div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.titleEn}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="flex flex-col p-7 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow duration-300"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{ backgroundColor: '#FFF8E8' }}
              >
                <item.Icon className="w-6 h-6" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
              </motion.div>
              <h3
                className="text-sm font-bold mb-3 leading-snug"
                style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? item.titleFa : item.titleEn}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? item.descFa : item.descEn}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Trust Markers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-center mb-8"
            style={{ color: '#C9A35A', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {isRTL ? 'تحقیقات و انتشارات' : 'RESEARCH & PUBLICATIONS'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p
                className="text-lg font-serif font-bold"
                style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? 'نویسندگی کتاب' : 'Published Author'}
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL
                  ? '"شهروند درجه دوم" — بررسی تبعیض بانکی و محرومیت مالی'
                  : '"Second Class Citizen" — examination of banking discrimination and financial exclusion'}
              </p>
            </div>
            <div>
              <p
                className="text-lg font-serif font-bold"
                style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? 'حقوق بشر' : 'Human Rights'}
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL
                  ? 'تخصص در حمایت از افراد تحریم‌شده و محروم شده از خدمات مالی'
                  : 'Expertise in supporting sanctioned and financially excluded individuals'}
              </p>
            </div>
            <div>
              <p
                className="text-lg font-serif font-bold"
                style={{ color: '#1E2430', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL ? 'شفافیت کامل' : 'Full Transparency'}
              </p>
              <p
                className="text-xs mt-2"
                style={{ color: '#5E6470', fontFamily: isRTL ? "'Vazirmatn', Tahoma, Arial, sans-serif" : undefined }}
              >
                {isRTL
                  ? 'پیش‌تر از اشتباه‌های معاملاتی و پیچیدگی‌های نظارتی'
                  : 'Years ahead of transactional mistakes and regulatory complexity'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
