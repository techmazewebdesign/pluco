import { seoConfig } from '../seo.config.mjs';

const requestedBase = process.argv[2] || process.env.SEO_BASE_URL || seoConfig.canonicalOrigin;
const base = new URL(requestedBase);
const errors = [];
const warnings = [];

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function matchContent(html, pattern) {
  return decodeHtml(html.match(pattern)?.[1]?.trim() || '');
}

async function get(pathOrUrl) {
  const url = new URL(pathOrUrl, base);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'PLUCO-SEO-Audit/1.0' },
    });
    return { url: url.toString(), response, body: await response.text() };
  } catch (error) {
    errors.push(`${url}: request failed (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

const [robotsResult, sitemapResult] = await Promise.all([get('/robots.txt'), get('/sitemap.xml')]);

if (!robotsResult?.response.ok) errors.push('/robots.txt is not reachable with a 200 response');
if (!sitemapResult?.response.ok) errors.push('/sitemap.xml is not reachable with a 200 response');

const expectedSitemapUrl = new URL('/sitemap.xml', base).toString();
const productionSitemapUrl = `${seoConfig.canonicalOrigin}/sitemap.xml`;
if (robotsResult && !robotsResult.body.includes(expectedSitemapUrl) && !robotsResult.body.includes(productionSitemapUrl)) {
  errors.push(`robots.txt does not declare a recognized sitemap URL`);
}

const sitemapBody = sitemapResult?.body || '';
const sitemapUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1]));
const duplicateUrls = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
if (duplicateUrls.length) errors.push(`duplicate sitemap URLs: ${[...new Set(duplicateUrls)].join(', ')}`);

for (const path of seoConfig.requiredPublicPaths) {
  const normalizedSitemapPaths = sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, '') || '/');
  if (!normalizedSitemapPaths.includes(path.replace(/\/$/, '') || '/')) {
    errors.push(`required public path is missing from sitemap: ${path}`);
  }
}

for (const url of sitemapUrls) {
  const parsed = new URL(url);
  if (base.hostname === seoConfig.canonicalOrigin.replace(/^https?:\/\//, '') && parsed.origin !== seoConfig.canonicalOrigin) {
    errors.push(`off-domain URL in production sitemap: ${url}`);
  }
  if (seoConfig.privatePathPrefixes.some((prefix) => parsed.pathname.startsWith(prefix))) {
    errors.push(`private route exposed in sitemap: ${parsed.pathname}`);
  }
}

const pagesToCheck = [...new Set([
  ...sitemapUrls.map((url) => {
    const parsed = new URL(url);
    return new URL(`${parsed.pathname}${parsed.search}`, base).toString();
  }),
  ...seoConfig.requiredPublicPaths.map((path) => new URL(path, base).toString()),
])];
const pageResults = [];

for (let index = 0; index < pagesToCheck.length; index += 6) {
  const batch = pagesToCheck.slice(index, index + 6);
  pageResults.push(...await Promise.all(batch.map((url) => get(url))));
}

const titleOwners = new Map();
const descriptionOwners = new Map();

for (const result of pageResults.filter(Boolean)) {
  const { response, body, url } = result;
  const pathname = new URL(url).pathname;
  if (!response.ok) {
    errors.push(`${pathname} returned ${response.status}`);
    continue;
  }

  const title = matchContent(body, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = matchContent(body, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
    || matchContent(body, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = matchContent(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
    || matchContent(body, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  const h1Count = (body.match(/<h1\b/gi) || []).length;

  if (!title) errors.push(`${pathname} has no title`);
  if (!description) errors.push(`${pathname} has no meta description`);
  if (!canonical) errors.push(`${pathname} has no canonical link`);
  if (h1Count !== 1) errors.push(`${pathname} has ${h1Count} h1 elements; expected exactly 1`);

  if (title && (title.length < 20 || title.length > 70)) warnings.push(`${pathname} title length is ${title.length}`);
  if (description && (description.length < 70 || description.length > 170)) warnings.push(`${pathname} description length is ${description.length}`);

  if (canonical) {
    const canonicalUrl = new URL(canonical, base);
    if (canonicalUrl.pathname.replace(/\/$/, '') !== pathname.replace(/\/$/, '')) {
      errors.push(`${pathname} canonical points to ${canonicalUrl.pathname}`);
    }
  }

  if (title) titleOwners.set(title, [...(titleOwners.get(title) || []), pathname]);
  if (description) descriptionOwners.set(description, [...(descriptionOwners.get(description) || []), pathname]);
}

for (const [title, paths] of titleOwners) {
  if (paths.length > 1) errors.push(`duplicate title on ${paths.join(', ')}: ${title}`);
}
for (const paths of descriptionOwners.values()) {
  if (paths.length > 1) warnings.push(`duplicate description on ${paths.join(', ')}`);
}

console.log(`SEO audit: ${base.origin}`);
console.log(`Checked ${pageResults.filter(Boolean).length} pages and ${sitemapUrls.length} sitemap URLs.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed with ${warnings.length} warning(s).`);
}
