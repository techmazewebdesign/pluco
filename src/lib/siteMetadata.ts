import type { Metadata } from "next";
import { languageAlternates } from "./languageRoutes";

export const SITE_URL = "https://www.plucogroup.com";
export const SITE_NAME = "PLUCO GROUP";
export const SITE_TITLE = "European Residency & Private Client Advisory | PLUCO GROUP";
export const SITE_DESCRIPTION =
  "European residency advisory, Spain digital nomad visa support, banking documentation and company formation for international families and entrepreneurs. English and Farsi support.";
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
  path = "/",
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
  locale = "en_US",
  alternateLocales = ["fa_IR"],
  robots,
  keywords,
}: PageMetadataOptions = {}): Metadata {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const socialImageUrl = new URL(image, SITE_URL).toString();

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(path, SITE_URL),
    },
    keywords,
    robots,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: socialImageUrl,
          secureUrl: socialImageUrl,
          type: "image/png",
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: socialImageUrl,
          alt: imageAlt,
          secureUrl: socialImageUrl,
          type: "image/png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
