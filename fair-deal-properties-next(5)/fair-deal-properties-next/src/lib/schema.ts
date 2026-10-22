import { SITE_URL, FIRM, ROUTES, type RouteKey } from './site';
import { SEO } from './seo';

/**
 * schema.org structured data.
 *
 * Emitted as a single connected @graph rather than as separate disconnected scripts,
 * so that Google resolves one entity with cross-referenced @id values instead of
 * several fragments it has to guess are related.
 */

type Node = Record<string, unknown>;

export const organizationNode: Node = {
  '@type': ['Organization', 'RealEstateAgent'],
  '@id': `${SITE_URL}/#organization`,
  name: FIRM.name,
  legalName: FIRM.legalName,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/logo-primary.png` },
  image: `${SITE_URL}/assets/logo-primary.png`,
  description:
    'An integrated real estate, PropTech and transaction facilitation company delivering independently verified property opportunities, dated inspections, financing advisory and diaspora stewardship in Nigeria.',
  telephone: FIRM.telephone,
  email: FIRM.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: FIRM.street,
    addressLocality: FIRM.city,
    addressRegion: FIRM.region,
    addressCountry: FIRM.country,
  },
  areaServed: [
    ...FIRM.markets.map((m) => ({ '@type': 'City', name: m })),
    { '@type': 'Country', name: 'Nigeria' },
  ],
  knowsAbout: [
    'Property title verification',
    'Real estate transaction facilitation',
    'Mortgage and MREIF financing advisory',
    'Diaspora property investment',
    'Nigeria Data Protection Act 2023 compliance',
  ],
  slogan: FIRM.tagline,
  ...(FIRM.sameAs.length ? { sameAs: FIRM.sameAs } : {}),
};

export const websiteNode: Node = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: FIRM.legalName,
  inLanguage: 'en-NG',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export function webPageNode(key: RouteKey): Node {
  const path = ROUTES[key].path;
  const url = SITE_URL + (path === '/' ? '' : path);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: SEO[key].title,
    description: SEO[key].description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: 'en-NG',
  };
}

export function breadcrumbNode(key: RouteKey): Node {
  const path = ROUTES[key].path;
  const url = SITE_URL + (path === '/' ? '' : path);
  const items: Node[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];
  if (key !== 'home') {
    items.push({ '@type': 'ListItem', position: 2, name: ROUTES[key].label, item: url });
  }
  return { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: items };
}

export const contactPointNode: Node = {
  '@type': 'ContactPoint',
  '@id': `${SITE_URL}/#contact`,
  telephone: FIRM.telephone,
  email: FIRM.email,
  contactType: 'customer service',
  areaServed: 'NG',
  availableLanguage: ['en'],
};

export function faqPageNode(items: { question: string; answer: string }[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faq`,
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

export function serviceNode(name: string, description: string): Node {
  return {
    '@type': 'Service',
    name,
    description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'Nigeria',
  };
}

/**
 * Marketplace listings are published as an ItemList rather than as individual
 * RealEstateListing / Offer nodes. That is a deliberate restraint: an Offer node
 * asserts a firm price on a specific asset, and these prices are indicative pending
 * the verification record stated on each card.
 */
export function listingItemListNode(
  listings: { title: string; slug: string; description: string; image: string }[],
): Node {
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/marketplace#listings`,
    name: 'Verified property opportunities',
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.title,
      description: l.description,
      image: SITE_URL + l.image,
    })),
  };
}

/** Compose the @graph for a route. */
export function graphFor(key: RouteKey, extra: Node[] = []) {
  const g: Node[] = [organizationNode, websiteNode, webPageNode(key), breadcrumbNode(key)];
  if (key === 'home') g.push(contactPointNode);
  return { '@context': 'https://schema.org', '@graph': [...g, ...extra] };
}
