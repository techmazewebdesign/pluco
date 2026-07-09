'use client';

/**
 * Storytelling hero for the Spain Digital Nomad Visa page.
 *
 * Visual: public/images/digital_nomad_hero.png (a remote-work relocation scene — balcony,
 * laptop, suitcase, Barcelona skyline at sunset, no people) is rendered as a full-bleed
 * layer behind the copy, not a bordered card. The source PNG already has an organic
 * alpha cutout fading out on its left edge, which does most of the blending work; CSS
 * gradients + a mask-image on top guarantee the text column stays readable regardless of
 * how the browser crops the image at a given viewport width.
 *
 * Motion is intentionally minimal: a very slow, continuous "ken burns" scale on the image
 * layer, a staggered fade-up for the copy column, and a staggered fade-in for the three
 * eligibility/document/advisor story-beat steps. No spinning, no hard card, no light-sweep
 * gimmick. Everything collapses to a static frame when prefers-reduced-motion is set.
 */

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, SearchCheck, FileText, UserCheck } from 'lucide-react';

const NAVY = '#071C3C';
const NAVY_DEEP = '#051530';
const GOLD = '#C9A35A';

interface SpainHeroProps {
  isRTL: boolean;
  onRequestAssessment: () => void;
  onViewPackages: () => void;
}

const ff = "'Vazirmatn', Tahoma, Arial, sans-serif";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.25 } },
};

const containerVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const steps = [
  {
    Icon: SearchCheck,
    en: { title: 'Eligibility check', description: 'Initial review of your situation against current requirements.' },
    fa: { title: 'بررسی واجد شرایط بودن', description: 'بررسی اولیه شرایط شما بر اساس الزامات فعلی.' },
  },
  {
    Icon: FileText,
    en: { title: 'Document preparation', description: 'Structured coordination of the file you will need.' },
    fa: { title: 'آماده‌سازی مدارک', description: 'هماهنگی ساختاریافته پرونده مورد نیاز شما.' },
  },
  {
    Icon: UserCheck,
    en: { title: 'Advisor review', description: 'Legal partner handoff before any application is filed.' },
    fa: { title: 'بررسی مشاور', description: 'انتقال به همکار حقوقی پیش از ثبت هرگونه درخواست.' },
  },
];

export default function SpainHero({ isRTL, onRequestAssessment, onViewPackages }: SpainHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const copy = isRTL
    ? {
        beat: 'اقامت دورکاری اسپانیا',
        headline: 'اقامت اسپانیا، برنامه‌ریزی‌شده با احتیاط و شفافیت حقوقی.',
        sub: 'PLUCO GROUP از افراد و خانواده‌های بین‌المللی متحرک، کارآفرینان، متخصصان دورکار و صاحبان کسب‌وکار در برنامه‌ریزی ساختاریافته ویزای نومد دیجیتال و اقامت اسپانیا پشتیبانی می‌کند.',
        trust: 'حقوق مهاجرت اروپا و مشاوره موکلین خصوصی.',
        primary: 'درخواست ارزیابی خصوصی',
        secondary: 'مشاهده بسته‌های خدمات',
        disclaimer: 'مشمول بررسی واجد شرایط بودن طبق قوانین فعلی اسپانیا — تضمین تأیید ویزا نیست.',
      }
    : {
        beat: 'SPAIN REMOTE-WORK RESIDENCY',
        headline: 'Spain residency, planned with discretion and legal clarity.',
        sub: 'Pluco Group supports internationally mobile individuals, founders, remote professionals, and families with structured Spain Digital Nomad Visa and residency advisory.',
        trust: 'European immigration law & private client advisory.',
        primary: 'Request private assessment',
        secondary: 'View service packages',
        disclaimer: 'Subject to eligibility review under current Spanish law — not a guarantee of visa approval.',
      };

  return (
    <section
      className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 min-h-[88vh] flex items-center"
      style={{ background: `radial-gradient(120% 100% at 15% 0%, ${NAVY} 0%, ${NAVY_DEEP} 65%, #030d24 100%)` }}
    >
      {/* Image layer — full-bleed, starts around mid-frame and fades into the navy background.
          No border, no card: the PNG's own alpha cutout plus these gradients do the blending.
          Mirrored for RTL: image visual focus moves to the left, text stays on the right, so
          the fade still runs from the image toward the text side in both directions. */}
      <div
        aria-hidden
        className={`absolute inset-y-0 w-full lg:w-[64%] overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}
        style={{
          WebkitMaskImage: isRTL
            ? 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 16%, black 40%, black 100%)'
            : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 16%, black 40%, black 100%)',
          maskImage: isRTL
            ? 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.4) 16%, black 40%, black 100%)'
            : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 16%, black 40%, black 100%)',
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: prefersReducedMotion ? 1 : [1.08, 1.14, 1.08],
          }}
          transition={
            prefersReducedMotion
              ? { opacity: { duration: 0.9 } }
              : {
                  opacity: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <Image
            src="/images/digital_nomad_hero.png"
            alt="Remote work setup on a Spanish balcony overlooking the city at sunset"
            fill
            priority
            className={`object-cover ${isRTL ? 'object-left' : 'object-right'}`}
          />
        </motion.div>

        {/* Navy fade from the text side into the image — direction mirrors for RTL */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(${isRTL ? 270 : 90}deg, ${NAVY} 0%, rgba(7,28,60,0.85) 20%, rgba(7,28,60,0.35) 45%, transparent 68%)` }} />
        {/* Top/bottom fade into the section background */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(7,28,60,0.35) 0%, transparent 22%, transparent 78%, ${NAVY} 100%)` }} />
        {/* Radial vignette for focus + extra text-side legibility — mirrored for RTL */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${isRTL ? 28 : 72}% 45%, transparent 0%, rgba(7,24,47,0.18) 45%, rgba(7,24,47,0.7) 100%)` }} />
        {/* Stronger scrim on small screens, where the image sits behind the full-width copy */}
        <div className="absolute inset-0 lg:hidden" style={{ backgroundColor: 'rgba(5,21,48,0.62)' }} />
      </div>

      {/* Copy */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          dir={isRTL ? 'rtl' : 'ltr'}
          initial="hidden"
          animate="visible"
          variants={prefersReducedMotion ? containerVariantsReduced : containerVariants}
          className={`max-w-2xl ${isRTL ? 'ml-auto' : ''}`}
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2.5"
            style={{ color: GOLD, fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            <span className="inline-block w-6 h-px" style={{ backgroundColor: GOLD }} />
            {copy.beat}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl xl:text-[46px] font-serif text-white leading-[1.15] mb-6"
            style={{ fontFamily: isRTL ? ff : undefined }}
          >
            {copy.headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base leading-relaxed mb-8 max-w-xl"
            style={{ color: '#CBD5E0', fontFamily: isRTL ? ff : undefined }}
          >
            {copy.sub}
          </motion.p>

          {/* Three story beats: eligibility -> documents -> advisor review */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
            {steps.map((step, i) => {
              const s = isRTL ? step.fa : step.en;
              return (
                <div key={s.title} className="flex sm:flex-col items-start sm:items-start gap-3 sm:gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1.5px solid ${GOLD}` }}
                  >
                    <step.Icon className="w-4 h-4" style={{ color: GOLD }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#FFFFFF', fontFamily: isRTL ? ff : undefined }}>
                      <span className="opacity-60 mr-1">{i + 1}.</span>{s.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: '#8A93A6', fontFamily: isRTL ? ff : undefined }}>{s.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs uppercase tracking-widest font-semibold mb-8"
            style={{ color: '#8A93A6', fontFamily: isRTL ? ff : undefined, letterSpacing: isRTL ? 'normal' : undefined }}
          >
            {copy.trust}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.button
              type="button"
              onClick={onRequestAssessment}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg transition-colors hover:brightness-110"
              style={{ backgroundColor: GOLD, color: NAVY, fontFamily: isRTL ? ff : undefined }}
            >
              {copy.primary}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </motion.button>
            <motion.button
              type="button"
              onClick={onViewPackages}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium rounded-lg border transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#FFFFFF', fontFamily: isRTL ? ff : undefined }}
            >
              {copy.secondary}
            </motion.button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xs leading-relaxed mt-5 max-w-md"
            style={{ color: '#64748B', fontFamily: isRTL ? ff : undefined }}
          >
            {copy.disclaimer}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
