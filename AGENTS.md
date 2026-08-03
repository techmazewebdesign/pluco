<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Permanent SEO stewardship

Every agent changing public pages must preserve and improve the site's search architecture.

- Treat `seo.config.mjs` as the keyword and route ownership map. Update it when a public service, guide, locale, or search intent changes.
- Use one clear primary intent per indexable page. Write for the user; do not keyword-stuff and do not create near-duplicate doorway pages.
- Keep the canonical host on `https://www.plucogroup.com`. Every indexable page needs a self-canonical, a unique descriptive title, a useful meta description, one visible `h1`, and relevant internal links.
- Maintain reciprocal English/Persian `hreflang` links, including `x-default` on paired pages. A translated URL must return `200` and be present in the sitemap before its alternate is advertised.
- Keep private portal, account, API, and dashboard routes out of the sitemap and disallowed in `robots.txt`. Never add a route to the sitemap unless it is public, indexable, and returns `200`.
- Structured data must match visible content and verified business facts. Never invent reviews, ratings, credentials, offices, outcomes, or `sameAs` profiles.
- Immigration, banking, sanctions, tax, citizenship, and investment content is high-stakes. Use current primary sources, show the review date, retain the applicable disclaimers, and avoid guaranteed-outcome language.
- Build topic clusters through useful hub-to-service-to-guide-to-enquiry links. Metadata keywords are secondary; titles, headings, helpful content, evidence, and internal links carry the strategy.
- Before handoff, run `npm run seo:audit -- <base-url>`, `npm run lint`, and `npm run build`. Report local/configured SEO separately from verified live SEO and from actual rankings or traffic.
- Do not deploy, submit sitemaps, or change Search Console/Analytics/business profiles without explicit authorization.

The working strategy and handoff checklist live in `docs/seo-strategy.md`.
