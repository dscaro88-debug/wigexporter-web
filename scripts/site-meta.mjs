// Single source of truth for entity (E-E-A-T) and freshness (AEO) metadata.
//
// Why this file exists: answer engines weigh *who* wrote a page and *when* it was
// last reviewed. Those two facts were previously hard-coded, inconsistent or absent.
// Keep every schema node that carries them here so the site cannot disagree with itself.
//
// RULE: SITE.reviewed is a real human review date. Update it by hand when the
// buyer-knowledge layer is genuinely re-read. Never derive it from build time --
// a build timestamp would claim "modified today" on every deploy.

export const SITE = {
  base: 'https://wigexporter.com',
  // Company history. Two separate facts, never merge them:
  //   founded   = the operating company behind DS HAIR was established in 2012.
  //   hairSince = the business has worked in hair products since 2007.
  // Never date the business any earlier than these. The same numbers also appear
  // as visible copy in index.html and about.html, and in llms.txt — keep all three in step.
  founded: '2012',
  hairSince: '2007',
  // Registered name of the same organisation; DS HAIR is the trading name and may
  // be published. Registration number and registered/production addresses stay off
  // the public site by agreement.
  legalName: 'HuBei DeShang Industry & Trade Co., Ltd.',
  legalNameZh: '湖北德尚',
  // First publication of the buyer-knowledge (guides + articles) layer.
  published: '2026-07-18',
  // Last human review of that layer.
  reviewed: '2026-09-22',
  // Human-readable form of SITE.reviewed, shown on the page.
  reviewedLabel: '22 September 2026'
};

// Completed years in the hair-products trade. Derived so it cannot silently go stale.
export const YEARS_IN_HAIR = new Date().getFullYear() - Number(SITE.hairSince);

export const ORG_ID = 'https://wigexporter.com/#organization';
export const WEBSITE_ID = 'https://wigexporter.com/#website';
export const AUTHOR_ID = 'https://wigexporter.com/about.html#caro';

// The publishing entity named in every byline and schema node.
export const PUBLISHER = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'DS HAIR',
  alternateName: 'WigExporter',
  url: 'https://wigexporter.com/'
};

// The named author. Answer engines need a person to attribute a claim to; an
// unattributed "Organization" byline is a weaker trust signal than a named founder.
export const AUTHOR = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: 'Caro',
  jobTitle: 'Founder',
  url: AUTHOR_ID,
  worksFor: { '@type': 'Organization', '@id': ORG_ID, name: 'DS HAIR' },
  knowsAbout: [
    'Wholesale hair extensions',
    'Wig and hair topper manufacturing',
    'Private-label hair product development',
    'Hair colour matching and shade systems'
  ]
};

// Byline shown on generated buyer guides and articles.
export const BYLINE = 'Caro, Founder, DS HAIR';

// Reusable article-level dates so every content page reports the same freshness.
export const FRESHNESS = {
  datePublished: SITE.published,
  dateModified: SITE.reviewed
};
