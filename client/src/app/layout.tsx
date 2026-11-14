import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import '@/styles/components.css';

import AppShell from '@/components/AppShell';
import ConsentProvider from '@/components/ConsentProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { CurrencyProvider } from '@/components/CurrencyProvider';
import JsonLd from '@/components/JsonLd';
import { organizationNode, websiteNode } from '@/lib/schema';
import { SITE_URL, FIRM } from '@/lib/site';

/**
 * Fonts are downloaded at build time and served from this origin. That removes a
 * render-blocking request to a third-party font host, which helps Largest Contentful
 * Paint, and it removes a transfer of visitor IP addresses to that host, which is a
 * disclosure of personal data the firm would otherwise have to account for.
 */
const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body-next',
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
    <html lang="en-NG" className={body.variable}>
      <body>
        {/* Firm-level entities, emitted once on every page. Page-level nodes are
            added by each route so the @graph resolves as one connected entity. */}
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [organizationNode, websiteNode] }} />

        <ConsentProvider>
          <AuthProvider>
            <CurrencyProvider>
              <AppShell>{children}</AppShell>
            </CurrencyProvider>
          </AuthProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
