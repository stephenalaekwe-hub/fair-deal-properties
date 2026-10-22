import type { Metadata } from 'next';
import { SITE_URL, FIRM, ROUTES, type RouteKey } from './site';

/**
 * Per-route search metadata.
 *
 * Every route carries its own title, description, canonical link and social card.
 * Version 5 of this website served all eighteen pages from one URL, which meant one
 * title and one description for the whole firm. This register is what replaces that.
 */
export interface PageSeo {
  title: string;
  description: string;
  keywords?: string[];
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  noindex?: boolean;
}

export const SEO: Record<RouteKey, PageSeo> = {
  home: {
    title: 'Verified Property, Transaction Facilitation and PropTech in Nigeria',
    description:
      'Technology-enabled real estate agency and transaction facilitation firm in Abuja. Independently verified listings, dated virtual and physical inspections, mortgage and MREIF financing advisory, and diaspora property stewardship across Nigeria.',
    keywords: ['real estate Nigeria', 'verified property Abuja', 'PropTech Nigeria',
      'transaction facilitation', 'property due diligence Abuja', 'MREIF',
      'diaspora property investment'],
    priority: 1.0, changeFrequency: 'weekly',
  },
  platform: {
    title: 'The Fair Deal Platform - Eleven Property Technology Capabilities',
    description:
      'Eleven integrated PropTech capabilities covering verification, inspection, document vaults, transaction tracking and financing comparison. Every module status is published - live, beta or roadmap - and our fee basis is stated in full.',
    keywords: ['property technology platform Nigeria', 'property transaction tracking',
      'real estate document vault', 'property verification platform'],
    priority: 0.9, changeFrequency: 'monthly',
  },
  marketplace: {
    title: 'Verified Property Marketplace - Abuja, Lagos and Port Harcourt',
    description:
      'Property opportunities from Fair Deal Properties and vetted developers, alongside stock already enlisted by MREIF, Family Homes Funds, the Federal Housing Authority, FMBN and licensed PMIs. Each listing states what was verified, by whom, and on what date.',
    keywords: ['verified property listings Abuja', 'land for sale Abuja',
      'houses for sale Lagos', 'MREIF housing stock', 'Family Homes Funds',
      'FHA houses', 'property marketplace Nigeria'],
    priority: 0.9, changeFrequency: 'daily',
  },
  inspections: {
    title: 'Property Inspection Hub - Dated Virtual Walkthroughs and Tracked Site Visits',
    description:
      'Take a dated, versioned virtual walkthrough of a Nigerian property from anywhere, or request a physical site inspection and track it to the minute. Every session is logged and every evidence item referenced.',
    keywords: ['virtual property tour Nigeria', 'property inspection Abuja',
      'site inspection report', 'property walkthrough Nigeria'],
    priority: 0.9, changeFrequency: 'weekly',
  },
  financing: {
    title: 'Property Financing Advisory - NHF, MREIF, PMI and Commercial Mortgage Comparison',
    description:
      'We do not lend. We make sure you borrow correctly. Independent comparison of NHF, MREIF, primary mortgage institution and commercial financing routes on total cost of credit rather than headline rate, with full disclosure of terms and obligations.',
    keywords: ['MREIF mortgage', 'NHF loan Nigeria', 'FMBN mortgage',
      'primary mortgage institution Nigeria', 'mortgage comparison Nigeria',
      'property financing Abuja'],
    priority: 0.8, changeFrequency: 'monthly',
  },
  services: {
    title: 'Our Services - Real Estate Agency, Transaction Facilitation and Advisory',
    description:
      'Five structured service lines: real estate agency and transaction facilitation, property and title due diligence support, financing advisory, diaspora advisory, and developer and partner advisory. Each is designed around the real risks in Nigeria’s property market.',
    priority: 0.8, changeFrequency: 'monthly',
  },
  diaspora: {
    title: 'Diaspora Property Investment Advisory - Buy Property in Nigeria from Abroad',
    description:
      'A purpose-built advisory service for Nigerians investing from the UK, USA, Canada, UAE and beyond. Named advisor, independently verified listings, remote transaction management and active post-purchase stewardship.',
    keywords: ['buy property in Nigeria from abroad', 'diaspora mortgage Nigeria',
      'diaspora NHF', 'Nigerian diaspora real estate', 'remote property purchase Nigeria'],
    priority: 0.8, changeFrequency: 'monthly',
  },
  howItWorks: {
    title: 'How It Works - Our Six-Step Property Transaction Process',
    description:
      'From first confidential consultation to post-transfer stewardship - six disciplined steps that govern every engagement, every time. No shortcuts, no ambiguity, and no surprises on fees.',
    priority: 0.7, changeFrequency: 'monthly',
  },
  developers: {
    title: 'Developer and Partner Advisory - Asset Positioning and Market Access',
    description:
      'Advisory, positioning and market access for developers whose projects meet our verification standard. We do not represent every developer - involvement by Fair Deal Properties signals that rigour has been applied.',
    priority: 0.7, changeFrequency: 'monthly',
  },
  insights: {
    title: 'Nigerian Property Market Insights and Intelligence',
    description:
      'Rigorous, practical intelligence on Nigeria’s property market, legal landscape and financing ecosystem - title verification, mortgage routes, diaspora risk and market pricing. Written for serious investors.',
    priority: 0.7, changeFrequency: 'weekly',
  },
  about: {
    title: 'About Us - Integrated Real Estate, PropTech and Transaction Facilitation',
    description:
      'An integrated real estate, PropTech and transaction facilitation company in Abuja delivering verified property solutions through professional expertise, digital innovation, market intelligence and funding advisory. Institutional discipline, applied to property.',
    priority: 0.7, changeFrequency: 'monthly',
  },
  technology: {
    title: 'Technology, Security and Regulatory Compliance',
    description:
      'How the Fair Deal platform is engineered, how your personal data is protected, and the regulatory framework we operate within - including the Nigeria Data Protection Act 2023 and the General Application and Implementation Directive 2025.',
    priority: 0.6, changeFrequency: 'monthly',
  },
  faq: {
    title: 'Frequently Asked Questions - Buying, Verifying and Financing Property in Nigeria',
    description:
      'Direct answers to the questions we hear most often - what makes our verification different, how fees work, what we will not do, how diaspora transactions are managed, and how financing introductions are structured.',
    priority: 0.6, changeFrequency: 'monthly',
  },
  contact: {
    title: 'Contact Us - Book a Property Consultation in Abuja',
    description:
      'Every engagement starts with a confidential consultation - no obligation, no pressure. Reach us at No. 4 Ekeh A. Yesufu Close, Utako, Abuja, on 0904 992 4198, or at info@fairdealng.com.',
    priority: 0.7, changeFrequency: 'monthly',
  },
  privacyNotice: {
    title: 'Privacy Notice - Nigeria Data Protection Act 2023',
    description:
      'How Fair Deal Properties Ltd collects, uses, shares, protects and retains your personal data, and the rights you hold over it under the Nigeria Data Protection Act 2023 and GAID 2025. Version 2.0, effective 03 October 2026.',
    priority: 0.4, changeFrequency: 'yearly',
  },
  cookieNotice: {
    title: 'Cookie Notice - Consent, Categories and Retention',
    description:
      'What cookies this site uses, what each one does, how long it lasts and how you control them. No optional cookie is set on your device before you consent, in line with GAID 2025.',
    priority: 0.4, changeFrequency: 'yearly',
  },
  dataRights: {
    title: 'Exercise Your Data Rights - Data Subject Request Portal',
    description:
      'Exercise any right you hold over your personal data under the Nigeria Data Protection Act 2023. We commit to acknowledging within 5 business days and responding within 30 days. There is no charge.',
    priority: 0.4, changeFrequency: 'yearly',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'The binding terms that govern your use of this website and your engagement with Fair Deal Properties Ltd, including scope of service, professional boundaries, fees and limitation of liability. Version 2.0, effective 03 October 2026.',
    priority: 0.3, changeFrequency: 'yearly',
  },
};

/** Build the Next.js Metadata object for a route from the register above. */
export function pageMetadata(key: RouteKey): Metadata {
  const seo = SEO[key];
  const path = ROUTES[key].path;
  const url = SITE_URL + (path === '/' ? '' : path);
  const fullTitle =
    key === 'home' ? `${FIRM.legalName} | ${seo.title}` : `${seo.title} | ${FIRM.legalName}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    robots: seo.noindex
      ? { index: false, follow: true }
      : {
          index: true, follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large',
                       'max-snippet': -1, 'max-video-preview': -1 },
        },
    openGraph: {
      type: key === 'home' ? 'website' : 'article',
      siteName: FIRM.legalName,
      locale: 'en_NG',
      title: fullTitle,
      description: seo.description,
      url,
      images: [{ url: '/assets/logo-primary.png', width: 1100, height: 306,
                 alt: FIRM.legalName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: ['/assets/logo-primary.png'],
    },
  };
}
