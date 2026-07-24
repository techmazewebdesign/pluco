import type { Metadata } from "next";
import { ENGLISH_TO_PERSIAN_PATH } from "@/lib/plucoPersianServices";

export const SITE_URL = "https://www.plucogroup.com";
export const SITE_NAME = "PLUCO GROUP";
export const SITE_TITLE = "PLUCO GROUP – European Immigration Law & Private Client Advisory";
export const SITE_DESCRIPTION =
  "Discreet legal and strategic advisory for internationally mobile individuals and families.";
export const DEFAULT_SOCIAL_IMAGE = "/images/pluco-social-preview.png";
export const DEFAULT_SOCIAL_IMAGE_ALT =
  "PLUCO GROUP – European Immigration Law & Private Client Advisory";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  locale?: string;
  alternateLocales?: string[];
  robots?: Metadata["robots"];
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
}: PageMetadataOptions = {}): Metadata {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const socialImageUrl = new URL(image, SITE_URL).toString();
  const persianPath = path === "/" ? "/fa" : ENGLISH_TO_PERSIAN_PATH[path];
  const languages = persianPath
    ? {
        en: canonicalUrl,
        fa: new URL(persianPath, SITE_URL).toString(),
        "x-default": canonicalUrl,
      }
    : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
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
