import type { Metadata } from "next";
import { languageAlternates, localeForPath, type SiteLocale } from "./languageRoutes";
import { getPageImages } from "./pageImages";

export const SITE_URL = "https://www.plucogroup.com";
export const SITE_NAME = "PLUCO GROUP";
export const SITE_TITLE = "European Residency & Private Client Advisory | PLUCO GROUP";
export const SITE_DESCRIPTION =
  "European residency advisory, Spain digital nomad visa support, banking documentation and company formation for international families and entrepreneurs. English, Persian and Polish support.";
export const DEFAULT_SOCIAL_IMAGE = "/images/pluco-social-preview.png";
export const DEFAULT_SOCIAL_IMAGE_ALT =
  "European Residency & Private Client Advisory | PLUCO GROUP";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  locale?: string;
  alternateLocales?: string[];
  robots?: Metadata["robots"];
  keywords?: string[];
};

export function createPageMetadata({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path,
  image,
  imageAlt,
  locale,
  alternateLocales,
  robots,
  keywords,
}: PageMetadataOptions = {}): Metadata {
  const pagePath = path ?? "/fa";
  const canonicalUrl = new URL(pagePath, SITE_URL).toString();
  const languages = languageAlternates(pagePath, SITE_URL);
  const pageImages = path ? getPageImages(path) : undefined;
  const primary = pageImages?.images[0];
  const imagePath = image ?? (pageImages ? `/images/social/${pageImages.socialKey}.jpg` : DEFAULT_SOCIAL_IMAGE);
  const socialImageUrl = new URL(imagePath, SITE_URL).toString();
  const socialImage = {
    url: socialImageUrl,
    secureUrl: socialImageUrl,
    type: imagePath.endsWith(".jpg") ? "image/jpeg" : "image/png",
    width: 1200,
    height: 630,
    alt: imageAlt ?? (primary && pageImages ? primary.alt[pageImages.lang] : DEFAULT_SOCIAL_IMAGE_ALT),
  };
  const localeNames: Record<SiteLocale, string> = { en: "en_US", fa: "fa_IR", pl: "pl_PL" };
  const pageLocale = locale ?? localeNames[localeForPath(pagePath)];
  const pageAlternateLocales = alternateLocales ?? (languages ? (Object.keys(localeNames) as SiteLocale[])
    .filter(language => languages[language] && localeNames[language] !== pageLocale)
    .map(language => localeNames[language]) : undefined);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    keywords,
    robots: robots ?? (pageImages ? { "max-image-preview": "large" } : undefined),
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: pageLocale,
      alternateLocale: pageAlternateLocales,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
