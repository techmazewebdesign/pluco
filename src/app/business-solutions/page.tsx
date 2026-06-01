'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Zap, Globe, Users, BarChart3, Cpu, ShoppingBag } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';

const desivoServices = {
  en: [
    { Icon: Users,     title: 'Systematic Customer Acquisition',   desc: 'Structured approaches to building a reliable, scalable customer base across European markets.' },
    { Icon: Cpu,       title: 'Business Automation & AI',          desc: 'Integration of AI-supported workflows and automation tools to streamline business operations.' },
    { Icon: Globe,     title: 'European Market Expansion',         desc: 'Strategic support for entering and growing across European markets with local positioning.' },
    { Icon: ShoppingBag, title: 'Multilingual Digital Infrastructure', desc: 'Building digital presence and customer-facing systems across multiple European languages.' },
    { Icon: BarChart3, title: 'CRM & Workflow Integration',        desc: 'CRM setup, workflow automation and operational system integration for growing businesses.' },
    { Icon: Zap,       title: 'Digital Transformation Strategy',   desc: 'End-to-end digital transformation planning and implementation for established businesses.' },
  ],
  fa: [
    { Icon: Users,     title: 'جذب مشتری سیستماتیک',             desc: 'رویکردهای ساختاریافته برای ساخت پایگاه مشتری قابل اطمینان و مقیاس‌پذیر در سراسر بازارهای اروپایی.' },
    { Icon: Cpu,       title: 'اتوماسیون کسب‌وکار و هوش مصنوعی', desc: 'یکپارچه‌سازی گردش کار با پشتیبانی هوش مصنوعی و ابزارهای اتوماسیون برای ساده‌سازی عملیات کسب‌وکار.' },
    { Icon: Globe,     title: 'توسعه بازار اروپایی',              desc: 'پشتیبانی استراتژیک برای ورود و رشد در سراسر بازارهای اروپایی با موضع‌گیری محلی.' },
    { Icon: ShoppingBag, title: 'زیرساخت دیجیتال چندزبانه',      desc: 'ساخت حضور دیجیتال و سیستم‌های مواجه با مشتری در چندین زبان اروپایی.' },
    { Icon: BarChart3, title: 'یکپارچه‌سازی CRM و گردش کار',     desc: 'راه‌اندازی CRM، اتوماسیون گردش کار و یکپارچه‌سازی سیستم عملیاتی برای کسب‌وکارهای در حال رشد.' },
    { Icon: Zap,       title: 'استراتژی تحول دیجیتال',            desc: 'برنامه‌ریزی و اجرای تحول دیجیتال از ابتدا تا انتها برای کسب‌وکارهای موجود.' },
  ],
};

export default function BusinessSolutions() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const services = isRTL ? desivoServices.fa : desivoServices.en;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'راهکارهای تجاری' : 'BUSINESS SOLUTIONS'}
        title={isRTL ? 'راهکارهای استراتژیک تجاری، رشد دیجیتال و توسعه بازار اروپایی' : 'Strategic Business, Digital Growth and European Market Expansion Solutions'}
        subtitle={isRTL ? 'PLUCO GROUP با شرکای تجاری منتخب همکاری می‌کند تا از کارآفرینان و شرکت‌ها در ورود به بازار اروپا، توسعه کسب‌وکار، رشد دیجیتال، اتوماسیون و توسعه عملیاتی پشتیبانی کند.' : 'PLUCO GROUP works with selected business partners to support entrepreneurs and companies with European market entry, business development, digital growth, automation and operational expansion.'}
      />

      <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                {isRTL ? 'شریک رشد دیجیتال' : 'DIGITAL GROWTH PARTNER'}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>
                {isRTL ? 'شریک رشد دیجیتال و توسعه بازار' : 'Digital Growth & Market Expansion Partner'}
              </h2>
              <div className="h-px mb-6" style={{ backgroundColor: '#C9A35A', width: 60 }} />
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? <>برای موکلین تجاری منتخبی که به زیرساخت دیجیتال، سیستم‌های جذب مشتری، اتوماسیون، گردش‌های کاری با پشتیبانی هوش مصنوعی، توسعه بازار اروپایی یا تحول دیجیتال نیاز دارند، PLUCO GROUP ممکن است موکلین را به <strong>گروه مشاوره DESIVO</strong> معرفی کند.</>
                  : <>For selected business clients requiring digital infrastructure, customer acquisition systems, automation, AI-supported workflows, European market expansion or digital transformation, PLUCO GROUP may refer clients to <strong>DESIVO Consulting Group</strong>.</>
                }
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#374151', fontFamily: isRTL ? ff : undefined }}>
                {isRTL
                  ? 'DESIVO یک گروه مشاوره مستقل است که در جذب مشتری سیستماتیک، اتوماسیون کسب‌وکار و توسعه بازار دیجیتال اروپایی تخصص دارد. PLUCO GROUP ممکن است معرفی یا هماهنگی استراتژیک را در جایی که نیازهای موکل با خدمات DESIVO همسو است، تسهیل کند.'
                  : 'DESIVO is an independent consulting group specialising in systematic customer acquisition, business automation and European digital market expansion. PLUCO GROUP may facilitate introductions or strategic coordination where client needs align with DESIVO\'s services.'
                }
              </p>
              <a href="https://www.desivo.de" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#071C3C', color: '#C9A35A' }}>
                {isRTL ? 'مشاهده DESIVO' : 'Visit DESIVO'}
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: isRTL ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }} className="rounded-xl p-8" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>
                {isRTL ? 'خدمات DESIVO' : 'DESIVO SERVICES'}
              </p>
              <div className="space-y-3">
                {services.map(s => (
                  <div key={s.title} className="flex items-start gap-3">
                    <s.Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{s.title}</p>
                      <p className="text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-xl p-6" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E5E7EB' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
              {isRTL
                ? <><strong style={{ color: '#1E2430' }}>سلب مسئولیت مشارکت: </strong>خدمات DESIVO به صورت جداگانه توسط گروه مشاوره DESIVO ارائه می‌شود. PLUCO GROUP ممکن است معرفی یا هماهنگی استراتژیک را در موارد مرتبط هماهنگ کند، اما تعامل، قیمت‌گذاری، عملکرد و نتایج DESIVO تابع شرایط و ضوابط خود DESIVO می‌باشد.</>
                : <><strong style={{ color: '#1E2430' }}>Partnership Disclaimer: </strong>DESIVO services are provided separately by DESIVO Consulting Group. PLUCO GROUP may coordinate introductions or strategic alignment where relevant, but DESIVO engagement, pricing, performance and deliverables remain subject to DESIVO's own terms and conditions.</>
              }
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed" style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}>
            {isRTL ? <><strong>سلب مسئولیت هزینه‌ها: </strong>حق‌الوکاله، هزینه‌های دولتی، کارمزد بانک، هزینه‌های مشاوران محلی، هزینه‌های ترجمه، حق دفترخانه، مالیات، هزینه‌های متخصصان شخص ثالث و هزینه‌های جانبی به هزینه‌های استاندارد خدمات PLUCO GROUP اضافه می‌شوند.</> : <><strong>Global Fee Disclaimer: </strong>Legal fees, government fees, bank charges, local counsel fees, translation fees, notary fees, taxes, third-party professional fees and out-of-pocket expenses are added to the standard PLUCO GROUP service fees unless expressly agreed otherwise in writing.</>}
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
