'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LegalDisclaimer() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

  const disclaimerEn = `Information on this website is provided for general informational purposes only and does not constitute legal advice. Submitting an enquiry does not create a lawyer-client relationship. PLUCO GROUP does not guarantee visa, residence, citizenship, banking, investment, court, government, or institutional outcomes. All services are subject to eligibility review, conflict checks, compliance checks, applicable law, and formal engagement.`;

  const disclaimerFa = `اطلاعات موجود در این وب‌سایت فقط برای اطلاع عمومی است و تشکیل مشاوره حقوقی نمی‌دهد. ارسال استعلام رابطه‌ای وکیل و موکل را ایجاد نمی‌کند. PLUCO GROUP نتیجه‌ی ویزا، اقامت، شهروندی، بانکی، سرمایه‌گذاری، دادگاه، دولتی یا نهادی را تضمین نمی‌کند. تمام خدمات مشروط به بررسی شرایط واجد شرایط، بررسی تعارض منافع، بررسی انطباق، قوانین قابل اجرا و تعهد رسمی است.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="flex gap-3 p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Shield
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        style={{ color: '#C9A35A' }}
        strokeWidth={1.5}
      />
      <p
        className="text-xs leading-relaxed"
        style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}
      >
        <span style={{ fontWeight: '600', color: '#909399', display: 'block', marginBottom: '4px' }}>
          {isRTL ? '📋 توجه حقوقی' : '📋 Legal Notice'}
        </span>
        {isRTL ? disclaimerFa : disclaimerEn}
      </p>
    </motion.div>
  );
}
