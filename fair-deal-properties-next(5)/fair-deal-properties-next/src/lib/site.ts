/** Single source of truth for firm identity. Referenced by metadata, JSON-LD and API responses. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.fairdealng.com';

export const FIRM = {
  name: 'Fair Deal Properties',
  legalName: 'Fair Deal Properties Ltd',
  tagline: 'Property, made transparent.',
  telephone: '+2349049924198',
  telephoneDisplay: '0904 992 4198',
  email: 'info@fairdealng.com',
  street: 'No. 4 Ekeh A. Yesufu Close, Utako',
  city: 'Abuja',
  region: 'Federal Capital Territory',
  country: 'NG',
  markets: ['Abuja', 'Lagos', 'Port Harcourt'],
  diasporaMarkets: ['United Kingdom', 'United States', 'Canada', 'United Arab Emirates'],
  /**
   * Populate with the firm's verified profiles. This is the property Google uses to
   * bind a website to its social presence. Left empty rather than guessed - an
   * incorrect sameAs is worse than an absent one.
   */
  sameAs: [] as string[],
} as const;

export type RouteKey =
  | 'home' | 'platform' | 'marketplace' | 'inspections' | 'financing' | 'services'
  | 'diaspora' | 'howItWorks' | 'developers' | 'insights' | 'about' | 'technology'
  | 'faq' | 'contact' | 'privacyNotice' | 'cookieNotice' | 'dataRights' | 'terms';

export const ROUTES: Record<RouteKey, { path: string; label: string }> = {
  home:          { path: '/',               label: 'Home' },
  platform:      { path: '/platform',       label: 'Platform' },
  marketplace:   { path: '/marketplace',    label: 'Marketplace' },
  inspections:   { path: '/inspections',    label: 'Inspections' },
  financing:     { path: '/financing',      label: 'Financing' },
  services:      { path: '/services',       label: 'Services' },
  diaspora:      { path: '/diaspora',       label: 'Diaspora' },
  howItWorks:    { path: '/how-it-works',   label: 'How It Works' },
  developers:    { path: '/developers',     label: 'Developers' },
  insights:      { path: '/insights',       label: 'Insights' },
  about:         { path: '/about',          label: 'About' },
  technology:    { path: '/technology',     label: 'Technology' },
  faq:           { path: '/faq',            label: 'FAQ' },
  contact:       { path: '/contact',        label: 'Contact' },
  privacyNotice: { path: '/privacy-notice', label: 'Privacy Notice' },
  cookieNotice:  { path: '/cookie-notice',  label: 'Cookie Notice' },
  dataRights:    { path: '/data-rights',    label: 'Your Data Rights' },
  terms:         { path: '/terms',          label: 'Terms of Service' },
};

/** Primary navigation, in presentation order. */
export const PRIMARY_NAV: RouteKey[] = [
  'platform', 'marketplace', 'inspections', 'financing',
  'services', 'diaspora', 'technology', 'about',
];
