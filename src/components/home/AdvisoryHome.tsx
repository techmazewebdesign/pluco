import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { advisoryContent, advisoryServicePath, serviceIcons } from './advisoryContent';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/contactDetails';
import { homepageImages } from '@/lib/pageImages';
import PageImageStructuredData from '@/components/seo/PageImageStructuredData';
import styles from './AdvisoryHome.module.css';

export default function AdvisoryHome({ locale }: { locale: 'en' | 'fa' }) {
  const isPersian = locale === 'fa';
  const copy = advisoryContent[locale];
  const consultationHref = isPersian ? '/enquire' : '/contact';
  return (
    <div className={styles.home} dir={isPersian ? 'rtl' : 'ltr'} lang={locale}>
      <PageImageStructuredData path={isPersian ? '/fa' : '/'} />
      <section className={styles.hero} aria-labelledby="advisory-hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.kicker}>{copy.category}</p>
            <h1 id="advisory-hero-title">{copy.title}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <div className={styles.actions}>
              <Link href={consultationHref} className={styles.primary}>{copy.consultation} <ArrowUpRight aria-hidden="true" size={18} /></Link>
              <a href="#advisory-services" className={styles.secondary}>{copy.explore} <ArrowDown aria-hidden="true" size={16} /></a>
            </div>
          </div>
          <figure className={styles.heroPhoto}>
            <div className={styles.heroImage}>
              {/* Andrea Piacquadio / Pexels, photo 3860641. */}
              <Image src={homepageImages.meeting.src} fill preload sizes="(max-width: 760px) 94vw, (max-width: 1100px) 47vw, 560px" alt={homepageImages.meeting.alt[locale]} />
            </div>
            <figcaption><MapPin aria-hidden="true" size={16} />{copy.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      <nav className={styles.pageNav} aria-label={copy.navigation}>
        <a href="#advisory-process">{copy.processLink} <ArrowDown aria-hidden="true" size={15} /></a>
        <a href="#advisory-services">{copy.servicesLink} <ArrowDown aria-hidden="true" size={15} /></a>
        <a href="#advisory-contact">{copy.contactLink} <ArrowDown aria-hidden="true" size={15} /></a>
      </nav>

      <section id="advisory-process" className={styles.section} aria-labelledby="advisory-process-title">
        <h2 id="advisory-process-title">{copy.processTitle}</h2>
        <ol className={styles.steps}>
          {copy.steps.map(({ title, description }, index) => (
            <li key={title}>
              <span className={styles.stepNumber} aria-hidden="true">{new Intl.NumberFormat(locale).format(index + 1)}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="advisory-services" className={styles.serviceBand} aria-labelledby="advisory-services-title">
        <div className={styles.section}>
          <h2 id="advisory-services-title">{copy.servicesTitle}</h2>
          <p className={styles.sectionIntro}>{copy.servicesIntro}</p>
          <div className={styles.serviceGrid}>
            {copy.services.map(({ title, description, links }, group) => {
              const Icon = serviceIcons[group];
              return (
                <article className={styles.service} key={title}>
                  <Icon className={styles.serviceIcon} size={26} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul>
                    {links.map((label, index) => (
                      <li key={label}>
                        <Link href={advisoryServicePath(group, index, isPersian)}>{label}<ArrowRight size={16} aria-hidden="true" /></Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.feature} aria-labelledby="advisory-spain-title">
        <div className={styles.featureImage}>
          {/* Roman Odintsov / Pexels, photo 5933280. */}
          <Image src={homepageImages.cityWalk.src} fill sizes="(max-width: 760px) 94vw, 46vw" alt={homepageImages.cityWalk.alt[locale]} />
        </div>
        <div className={styles.featureText}>
          <h2 id="advisory-spain-title">{copy.spainTitle}</h2>
          <p>{copy.spainBody}</p>
          <Link href={advisoryServicePath(0, 1, isPersian)} className={styles.textLink}>{copy.spainLink}<ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="advisory-resources-title">
        <h2 id="advisory-resources-title">{copy.insightsTitle}</h2>
        <ul>
          {copy.articles.map(({ label, href }) => (
            <li key={href}><Link href={href}>{label}<ArrowRight size={17} aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </section>

      <section id="advisory-contact" className={styles.contact} aria-labelledby="advisory-contact-title">
        <div className={styles.contactInner}>
          <div className={styles.contactText}>
            <h2 id="advisory-contact-title">{copy.contactTitle}</h2>
            <p>{copy.contactText}</p>
            <Link href={consultationHref} className={styles.primary}>{copy.consultation}<ArrowUpRight aria-hidden="true" size={18} /></Link>
            <div className={styles.contactLinks}>
              <a href="mailto:info@plucogroup.com" dir="ltr">info@plucogroup.com</a>
              <a href={CONTACT_PHONE_HREF}><bdi dir="ltr">{CONTACT_PHONE}</bdi></a>
              <a href="https://wa.me/48730962085">{copy.whatsapp}</a>
              <Link href="/about-us">{copy.about}</Link>
            </div>
          </div>
          <div className={styles.contactImage}>
            {/* Egor Komarov / Pexels, photo 17741460. */}
            <Image src={homepageImages.warsaw.src} sizes="(max-width: 760px) 94vw, 43vw" fill alt={homepageImages.warsaw.alt[locale]} />
          </div>
        </div>
      </section>
    </div>
  );
}
