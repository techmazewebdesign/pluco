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
  const url = `${SITE_URL}/fa/insights/${slug}`;
  const englishUrl = `${SITE_URL}/insights/${slug}`;

  return {
    title: article.seoTitle.fa,
    description: article.seoDescription.fa,
    keywords: article.keywords.fa,
    alternates: { canonical: url, languages: { en: englishUrl, fa: url, 'x-default': englishUrl } },
    openGraph: {
      title: article.seoTitle.fa,
      description: article.seoDescription.fa,
      url,
      locale: 'fa_IR', type: 'article',
      publishedTime: article.publishedOn, modifiedTime: article.reviewedOn,
      images: [{ url: `${SITE_URL}${article.image}`, alt: article.imageAlt.fa }],
    },
    twitter: { card: 'summary_large_image', title: article.seoTitle.fa, description: article.seoDescription.fa, images: [`${SITE_URL}${article.image}`] },
  };
}

export default async function PersianInsightPage({ params }: Props) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();
  const url = `${SITE_URL}/fa/insights/${slug}`;
  const englishUrl = `${SITE_URL}/insights/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': `${url}#article`, headline: article.title.fa,
        description: article.description.fa, image: `${SITE_URL}${article.image}`,
        datePublished: article.publishedOn, dateModified: article.reviewedOn,
        inLanguage: 'fa', author: { '@id': `${SITE_URL}/our-people/reza-ostad#person` },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` }, mainEntityOfPage: url,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        citation: article.sources.map((source) => source.url),
        translationOfWork: { '@id': `${englishUrl}#article` },
      },
      {
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'PLUCO GROUP', item: `${SITE_URL}/fa` },
          { '@type': 'ListItem', position: 2, name: 'بینش‌ها', item: `${SITE_URL}/fa/insights` },
          { '@type': 'ListItem', position: 3, name: article.title.fa, item: url },
        ],
      },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /><InsightArticle article={article} locale="fa" /></>;
}
