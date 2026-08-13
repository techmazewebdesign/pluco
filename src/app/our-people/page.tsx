'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/shared/PageHero';
import ConsultationCTA from '@/components/shared/ConsultationCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLUCO_PEOPLE } from '@/lib/plucoPeople';

export default function OurPeople() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow={isRTL ? 'تیم ما' : 'OUR TEAM'}
        title={isRTL ? 'متخصصان معرفی‌شده برای امور موکلین خصوصی و فرامرزی' : 'Named Professionals for Private Client and Cross-Border Matters'}
        subtitle={isRTL ? 'نقش، سوابق اعلام‌شده، زبان‌ها و حوزه فعالیت هر عضو تیم را پیش از شروع همکاری ببینید.' : 'Review each team member’s stated role, background, languages and areas of work before an engagement begins.'}
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="mb-10 rounded-2xl border border-[#D9C79D] bg-[#FFF9E9] p-6 text-sm leading-7 text-slate-700">
            {isRTL
              ? 'عناوین حرفه‌ای زیر حوزه فعالیت هر فرد را توصیف می‌کنند. پذیرش هر موضوع، نقش مسئول و نیاز به وکیل دارای مجوز در حوزه قضایی مربوط، فقط پس از بررسی و در محدوده توافق کتبی مشخص می‌شود.'
              : 'The professional descriptions below identify each person’s stated area of work. Matter acceptance, the responsible role and any need for locally licensed counsel are confirmed only after review and in a written scope.'}
          </div>
          <div className="space-y-12">
            {PLUCO_PEOPLE.map((member, index) => (
              <motion.article
                key={member.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                className="rounded-xl border border-gray-200 p-8 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className={`flex flex-col gap-8 md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border-2 border-[#C9A35A]">
                    <Image src={member.photo} alt={`${member.nameEn}, ${member.titleEn} at PLUCO GROUP`} fill sizes="144px" className="object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl font-bold text-[#1E2430]">{isRTL ? member.nameFa : member.nameEn}</h2>
                    <p className="mt-1 text-sm font-semibold text-[#9A742E]">{isRTL ? member.titleFa : member.titleEn}</p>
                    <p className="mt-1 text-xs text-[#5E6470]">{isRTL ? member.credentialsFa : member.credentialsEn}</p>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div><dt className="text-xs font-bold uppercase tracking-wider text-[#071C3C]">{isRTL ? 'زبان‌ها' : 'Languages'}</dt><dd className="mt-1 text-sm text-[#5E6470]">{(isRTL ? member.languagesFa : member.languagesEn).join('، ')}</dd></div>
                      <div><dt className="text-xs font-bold uppercase tracking-wider text-[#071C3C]">{isRTL ? 'حوزه‌های فعالیت' : 'Areas of work'}</dt><dd className="mt-1 text-sm leading-6 text-[#5E6470]">{(isRTL ? member.areasFa : member.areasEn).join(' · ')}</dd></div>
                    </dl>
                    <p className="mt-5 text-sm leading-7 text-[#374151]">{isRTL ? member.bioFa : member.bioEn}</p>
                    <Link href={`/our-people/${member.slug}`} className="mt-5 inline-block font-bold text-[#71551D] underline underline-offset-4">
                      {isRTL ? 'مشاهده پروفایل حرفه‌ای' : 'View professional profile'}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </div>
  );
}
