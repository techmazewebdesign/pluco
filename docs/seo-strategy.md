# PLUCO GROUP SEO operating strategy

This document is the durable handoff for every agent working on PLUCO GROUP search visibility. It organizes the existing English/Persian architecture; it does not promise rankings.

## Search position

PLUCO should compete on specific, evidence-led cross-border problems rather than broad terms such as “immigration” or “lawyer.” The defensible position is European immigration, private-client mobility, banking/compliance, company formation, property coordination, and cross-border legal strategy for internationally mobile families, founders, and Iranian nationals in Europe.

The machine-readable topic and route map is in `seo.config.mjs`. Each indexable page owns one primary intent. Supporting guides should answer a distinct question and link to the relevant service and confidential-enquiry route.

## Architecture

1. Home establishes the overall entity and service scope.
2. Service pages target commercial investigation intent.
3. English and Persian guide hubs organize informational intent.
4. Source-led guides and tools answer a specific problem, cite current primary sources, and link to the matching service.
5. Editorial standards, team, publications, address, and company identifiers support trust and entity clarity.
6. Enquiry pages convert qualified interest; account and dashboard pages remain non-indexable.

English/Persian equivalents must use self-canonicals plus reciprocal `en`, `fa`, and `x-default` alternates. A page without a real equivalent should not advertise a false translation.

## Content rules

- Use the searcher's language and problem in the title, `h1`, introduction, and relevant internal-link anchors, naturally.
- Do not publish thin location swaps, repetitive AI copy, unsupported “best” claims, guaranteed outcomes, or invented credentials.
- For high-stakes subjects, cite primary authorities and show a genuine review date. Recheck sources before changing a review date.
- Every new guide should add information not already covered, link to at least one service and one related guide where useful, and include a clear next step.
- Preserve legal, eligibility, sanctions, tax, banking, investment, and government-decision disclaimers.
- Meta keyword tags are not the strategy. Keep topic language coherent across titles, headings, body copy, schema, image alternatives, and internal links.

## Technical contract

- Canonical origin: `https://www.plucogroup.com`
- Public discovery: `/robots.txt` and `/sitemap.xml`
- Required locale hubs: `/guides`, `/fa`, and `/fa/guides`
- Structured data: factual Organization/WebSite data globally; page-specific Article, CollectionPage, FAQ, or Breadcrumb data only where the visible page supports it.
- Sitemap membership requires a public `200` page, indexable metadata, a self-canonical, and intentional internal discovery.
- Authentication, API, dashboard, and operational routes must never enter the sitemap.

## Agent handoff checklist

1. Check the live root, target page, `robots.txt`, and `sitemap.xml` with a crawler user agent.
2. Review Search Console and analytics only when authenticated access is available; record the date range and property.
3. Update `seo.config.mjs` when page ownership or intent changes.
4. Verify title, description, one `h1`, canonical, locale alternates, schema, source dates, and internal links.
5. Run `npm run seo:audit -- <preview-or-live-base-url>`, `npm run lint`, and `npm run build`.
6. After an explicitly authorized deployment, repeat the audit against production and verify the exact Search Console state. Configuration, sitemap submission, impressions, clicks, leads, and rankings are separate outcomes.
