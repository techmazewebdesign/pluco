'use client';

import { motion } from 'framer-motion';
import { Lock, Upload, Shield } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import { useLanguage } from '@/contexts/LanguageContext';

const labels = {
  en: {
    loginTitle: 'Existing Client Sign In',
    loginDesc: 'Sign in to access your case status, documents, deadlines and messages from PLUCO GROUP.',
    emailLabel: 'Email Address', emailPlaceholder: 'your@email.com',
    passwordLabel: 'Password', passwordPlaceholder: '••••••••',
    twoFa: 'Enable two-factor authentication',
    forgotPw: 'Forgot password?',
    signIn: 'Secure Sign In',
    loginNote: 'If you experience any difficulty accessing your account, please contact',
    enquiryTitle: 'New Client Confidential Enquiry',
    enquiryDesc: 'Complete the form below to submit a confidential enquiry. All information is treated with strict confidentiality.',
    fullName: 'Full Name *', email: 'Email *', phone: 'Phone / WhatsApp',
    nationality: 'Nationality', country: 'Country of Residence', family: 'Family Members',
    service: 'Preferred Service', selectService: 'Select a service…',
    language: 'Preferred Language', english: 'English', farsi: 'Farsi / Persian',
    description: 'Brief Description of Matter',
    descPlaceholder: 'Please describe your matter in general terms. Do not include sensitive personal data at this stage.',
    uploadLabel: 'Upload Supporting Documents',
    uploadText: 'Drag & drop files here, or click to browse',
    uploadNote: 'Accepted: PDF, JPG, PNG, DOCX · Max 20MB per file · Multiple files accepted',
    uploadCategories: 'Upload categories: Passport · Bank statements · Company documents · Source of funds · Property documents · Contracts · Court documents · Immigration documents · Other',
    consent1: 'I consent to PLUCO GROUP contacting me regarding this enquiry.',
    consent2: 'I consent to PLUCO GROUP processing my personal data for the purpose of assessing my enquiry, in accordance with their Privacy Policy.',
    submit: 'Submit Confidential Enquiry',
    confidentialityTitle: 'Confidentiality Notice',
    confidentialityText: 'All information and documents submitted through this portal are treated as confidential and reviewed only for the purpose of assessing or managing the client\'s matter. Submission of an enquiry does not create a legal or advisory relationship with PLUCO GROUP. A formal engagement will only begin following completion of conflict checks, eligibility review and agreement of terms.',
    services: ['New Identity','EU Residency','EU Property Purchase','US Green Card','Banking','Dispute Resolution','International Contracts','Business Solutions','EU Company Registration','Other / General Enquiry'],
  },
  fa: {
    loginTitle: 'ورود موکلین موجود',
    loginDesc: 'وارد شوید تا به وضعیت پرونده، اسناد، مهلت‌ها و پیام‌های PLUCO GROUP دسترسی داشته باشید.',
    emailLabel: 'آدرس ایمیل', emailPlaceholder: 'your@email.com',
    passwordLabel: 'رمز عبور', passwordPlaceholder: '••••••••',
    twoFa: 'فعال‌سازی احراز هویت دو مرحله‌ای',
    forgotPw: 'رمز عبور را فراموش کردید؟',
    signIn: 'ورود امن',
    loginNote: 'در صورت مشکل در دسترسی به حساب، لطفاً با',
    enquiryTitle: 'استعلام محرمانه موکل جدید',
    enquiryDesc: 'فرم زیر را برای ارسال استعلام محرمانه تکمیل کنید. تمام اطلاعات با رازداری کامل رسیدگی می‌شوند.',
    fullName: 'نام کامل *', email: 'ایمیل *', phone: 'تلفن / واتساپ',
    nationality: 'ملیت', country: 'کشور محل اقامت', family: 'تعداد اعضای خانواده',
    service: 'خدمات مورد نظر', selectService: 'انتخاب خدمات…',
    language: 'زبان ترجیحی', english: 'انگلیسی', farsi: 'فارسی',
    description: 'توضیح مختصر موضوع',
    descPlaceholder: 'لطفاً موضوع خود را به صورت کلی توضیح دهید. در این مرحله اطلاعات شخصی حساس وارد نکنید.',
    uploadLabel: 'بارگذاری اسناد پشتیبان',
    uploadText: 'فایل‌ها را اینجا بکشید و رها کنید، یا کلیک کنید',
    uploadNote: 'قابل قبول: PDF، JPG، PNG، DOCX · حداکثر ۲۰ مگابایت در هر فایل · چندین فایل قابل قبول است',
    uploadCategories: 'دسته‌بندی بارگذاری: گذرنامه · صورت‌حساب بانکی · اسناد شرکت · منبع وجوه · اسناد ملکی · قراردادها · اسناد دادگاهی · اسناد مهاجرتی · سایر',
    consent1: 'موافقت می‌کنم که PLUCO GROUP در مورد این استعلام با من تماس بگیرد.',
    consent2: 'موافقت می‌کنم که PLUCO GROUP اطلاعات شخصی من را برای ارزیابی استعلامم، طبق سیاست حریم خصوصی آنها، پردازش کند.',
    submit: 'ارسال استعلام محرمانه',
    confidentialityTitle: 'اطلاعیه رازداری',
    confidentialityText: 'تمامی اطلاعات و اسناد ارسال شده از طریق این پورتال محرمانه تلقی شده و صرفاً برای ارزیابی یا مدیریت پرونده موکل بررسی می‌شوند. ارسال استعلام رابطه حقوقی یا مشاوره‌ای با PLUCO GROUP ایجاد نمی‌کند. تعامل رسمی تنها پس از تکمیل بررسی تعارض منافع، ارزیابی شرایط و توافق شرایط آغاز می‌شود.',
    services: ['هویت جدید','اقامت اروپا','خرید ملک در اروپا','گرین کارت آمریکا','بانکداری','حل اختلاف','قراردادهای بین‌المللی','راهکارهای تجاری','ثبت شرکت در اروپا','سایر / استعلام عمومی'],
  },
};

export default function ClientSignIn() {
  const { isRTL } = useLanguage();
  const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";
  const l = isRTL ? labels.fa : labels.en;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'پورتال موکل' : 'CLIENT PORTAL'}
        title={isRTL ? 'دسترسی امن موکل و پورتال استعلام محرمانه' : 'Secure Client Access & Confidential Enquiry Portal'}
        subtitle={isRTL ? 'موکلین موجود می‌توانند وضعیت پرونده و اسناد خود را در زیر مشاهده کنند. موکلین جدید می‌توانند استعلام محرمانه ارسال کرده و اسناد پشتیبانی را به صورت امن بارگذاری کنند.' : 'Existing clients may access their case status and documents below. New and prospective clients may submit a confidential enquiry and upload supporting documents securely.'}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Sign In */}
            <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '2px solid #C9A35A' }}>
                  <Lock className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{l.loginTitle}</h2>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{l.loginDesc}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.emailLabel}</label>
                  <input type="email" placeholder={l.emailPlaceholder} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.passwordLabel}</label>
                  <input type="password" placeholder={l.passwordPlaceholder} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 transition-colors" dir="ltr" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                    <input type="checkbox" className="rounded" />{l.twoFa}
                  </label>
                  <a href="mailto:info@plucogroup.com" className="text-xs underline" style={{ color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>{l.forgotPw}</a>
                </div>
                <button type="button" className="w-full py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#071C3C', color: '#C9A35A', fontFamily: isRTL ? ff : undefined }}>{l.signIn}</button>
              </div>
              <p className="text-xs mt-4 leading-relaxed" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>
                {l.loginNote}{' '}
                <a href="mailto:info@plucogroup.com" className="underline" style={{ color: '#C9A35A' }}>info@plucogroup.com</a>
                {isRTL ? ' تماس بگیرید.' : '.'}
              </p>
            </motion.div>

            {/* Enquiry Form */}
            <motion.div initial={{ opacity: 0, x: isRTL ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }} className="border border-gray-200 rounded-xl p-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '2px solid #C9A35A' }}>
                  <Upload className="w-5 h-5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-serif font-bold" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{l.enquiryTitle}</h2>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{l.enquiryDesc}</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['text', l.fullName, ''], ['email', l.email, '']].map(([type, label]) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{label}</label>
                      <input type={type} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[[l.phone], [l.nationality]].map(([label]) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{label}</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[[l.country], [l.family]].map(([label], i) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{label}</label>
                      <input type={i === 1 ? 'number' : 'text'} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.service}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                    <option value="">{l.selectService}</option>
                    {l.services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.language}</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 bg-white" style={{ fontFamily: isRTL ? ff : undefined }}>
                    <option>{l.english}</option>
                    <option>{l.farsi}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.description}</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-600 resize-none" placeholder={l.descPlaceholder} style={{ fontFamily: isRTL ? ff : undefined }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}>{l.uploadLabel}</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-600 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
                    <p className="text-sm font-medium" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{l.uploadText}</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{l.uploadNote}</p>
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" />
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#94A3B8', fontFamily: isRTL ? ff : undefined }}>{l.uploadCategories}</p>
                </div>
                <div className="space-y-2">
                  {[l.consent1, l.consent2].map(text => (
                    <label key={text} className="flex items-start gap-2 text-xs" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>
                      <input type="checkbox" className="rounded mt-0.5 flex-shrink-0" /><span>{text}</span>
                    </label>
                  ))}
                </div>
                <button type="button" className="w-full py-3 text-sm font-semibold rounded-lg transition-all hover:brightness-110" style={{ backgroundColor: '#C9A35A', color: '#071C3C', fontFamily: isRTL ? ff : undefined }}>{l.submit}</button>
              </div>
            </motion.div>
          </div>

          {/* Confidentiality Notice */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-10 rounded-xl p-6 flex items-start gap-4" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#C9A35A' }} strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#1E2430', fontFamily: isRTL ? ff : undefined }}>{l.confidentialityTitle}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#5E6470', fontFamily: isRTL ? ff : undefined }}>{l.confidentialityText}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
