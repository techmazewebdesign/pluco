import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsightArticle from '@/components/insights/InsightArticle';
import { getInsight, PLUCO_INSIGHT_LIST } from '@/lib/plucoInsights';
import { SITE_URL } from '@/lib/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PLUCO_INSIGHT_LIST.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  const url = `${SITE_URL}/insights/${slug}`;
  const persianUrl = `${SITE_URL}/fa/insights/${slug}`;

  return {
    title: article.seoTitle.en,
    description: article.seoDescription.en,
    keywords: article.keywords.en,
    alternates: { canonical: url, languages: { en: url, fa: persianUrl, 'x-default': url } },
    openGraph: {
      title: article.seoTitle.en,
      description: article.seoDescription.en,
      url,
      type: 'article',
      publishedTime: article.publishedOn,
      modifiedTime: article.reviewedOn,
      images: [{ url: `${SITE_URL}${article.image}`, alt: article.imageAlt.en }],
    },
    twitter: { card: 'summary_large_image', title: article.seoTitle.en, description: article.seoDescription.en, images: [`${SITE_URL}${article.image}`] },
  };
}

export default async function EnglishInsightPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();
  const url = `${SITE_URL}/insights/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${url}#article`, headline: article.title.en,
        description: article.description.en, image: `${SITE_URL}${article.image}`,
        datePublished: article.publishedOn, dateModified: article.reviewedOn,
        inLanguage: 'en', author: { '@type': 'Organization', name: 'PLUCO GROUP' },
        publisher: { '@id': `${SITE_URL}/#organization` }, mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights` },
          { '@type': 'ListItem', position: 3, name: article.title.en, item: url },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><InsightArticle article={article} locale="en" /></>;
}
