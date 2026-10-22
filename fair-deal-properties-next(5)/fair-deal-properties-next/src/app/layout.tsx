import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/components.css';

import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ConsentProvider from '@/components/ConsentProvider';
import CookieConsent from '@/components/CookieConsent';
import ConsentReopen from '@/components/ConsentReopen';
import JsonLd from '@/components/JsonLd';
import { organizationNode, websiteNode } from '@/lib/schema';
import { SITE_URL, FIRM } from '@/lib/site';

/**
 * Fonts are downloaded at build time and served from this origin. That removes a
 * render-blocking request to a third-party font host, which helps Largest Contentful
 * Paint, and it removes a transfer of visitor IP addresses to that host, which is a
 * disclosure of personal data the firm would otherwise have to account for.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-next',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body-next',
  display: 'swap',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-next',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${FIRM.legalName} | Verified Property, Transaction Facilitation and PropTech in Nigeria`,
    template: `%s | ${FIRM.legalName}`,
  },
  description:
    'Technology-enabled real estate agency and transaction facilitation firm in Abuja. '
    + 'Independently verified listings, dated inspections, financing advisory and diaspora stewardship.',
  applicationName: FIRM.legalName,
  authors: [{ name: FIRM.legalName, url: SITE_URL }],
  creator: FIRM.legalName,
  publisher: FIRM.legalName,
  formatDetection: { telephone: true, address: true, email: true },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  other: {
    'geo.region': 'NG-FC',
    'geo.placename': 'Abuja, Federal Capital Territory, Nigeria',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D2B1E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {/* Firm-level entities, emitted once on every page. Page-level nodes are
            added by each route so the @graph resolves as one connected entity. */}
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [organizationNode, websiteNode] }} />

        <ConsentProvider>
          <a href="#main" className="skip-link">Skip to main content</a>
          <SiteNav />
          <main id="main" className="page active">{children}</main>
          <SiteFooter />
          <CookieConsent />
          <ConsentReopen />
        </ConsentProvider>
      </body>
    </html>
  );
}
