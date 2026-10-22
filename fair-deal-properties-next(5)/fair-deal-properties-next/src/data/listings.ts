/** Marketplace listing data, extracted from the verified listing register.
 *
 * Each record states what has been verified, by whom, and on what date. Where a
 * listing has not been verified, the record says so rather than omitting the field.
 * Prices are indicative and subject to the verification status shown.
 */

export type ListingSource =
  | 'fdp' | 'developer' | 'mreif' | 'fhf' | 'fha' | 'fmbn' | 'pmi' | 'offmarket';

export type PropertyType = 'residential' | 'commercial' | 'land';

export type City = 'abuja' | 'lagos' | 'ogun' | 'nationwide';

export interface Listing {
  slug: string;
  title: string;
  subtitle: string;
  source: ListingSource;
  propertyType: PropertyType;
  city: City;
  diasporaFriendly: boolean;
  mortgageEligible: boolean;
  affordable: boolean;
  offPlan: boolean;
  priceMillionsNGN: number | null;
  priceDisplay: string;
  priceLabel: string;
  listedOn: string;
  image: string;
  imageAlt: string;
  badges: string[];
  location: string;
  specification: string;
  description: string;
  tags: string[];
  amenities: string[];
  verificationStatus: string;
}

export const SOURCE_LABELS: Record<ListingSource, string> = {
  fdp: 'Fair Deal Properties - direct',
  developer: 'Vetted developer',
  mreif: 'MREIF enlisted stock',
  fhf: 'Family Homes Funds',
  fha: 'Federal Housing Authority',
  fmbn: 'FMBN / NHF',
  pmi: 'Licensed primary mortgage institution',
  offmarket: 'Off-market mandate',
};

export const CITY_LABELS: Record<City, string> = {
  abuja: 'Abuja', lagos: 'Lagos', ogun: 'Ogun', nationwide: 'Nationwide',
};

export const listings: Listing[] = 
[
  {
    "slug": "luxury-duplex-maitama",
    "title": "Luxury Duplex - Maitama",
    "subtitle": "Residential · Abuja",
    "source": "fdp",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": false,
    "priceMillionsNGN": 450.0,
    "priceDisplay": "₦450M",
    "priceLabel": "Asking Price",
    "listedOn": "2026-05-10",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "Luxury Duplex - Maitama - indicative illustration",
    "badges": [
      "⭐ Featured",
      "FDP Verified",
      "C of O"
    ],
    "location": "Maitama, Abuja FCT",
    "specification": "5-bed Fully Detached · 640m²",
    "description": "Premium residential in Abuja's most sought-after diplomatic zone. Title verified - ownership chain dating 18 years. Site inspected April 2026.",
    "tags": [
      "Diaspora Friendly",
      "Available Now"
    ],
    "amenities": [
      "🏊 Pool",
      "🔒 Estate Security",
      "⚡ Backup Power"
    ],
    "verificationStatus": "FDP Verified"
  },
  {
    "slug": "grade-a-office-space-victoria-island",
    "title": "Grade-A Office Space - Victoria Island",
    "subtitle": "Commercial · Lagos",
    "source": "fdp",
    "propertyType": "commercial",
    "city": "lagos",
    "diasporaFriendly": false,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 1200.0,
    "priceDisplay": "₦1.2B",
    "priceLabel": "Asking Price",
    "listedOn": "2026-05-08",
    "image": "/assets/illustrations/i3.svg",
    "imageAlt": "Grade-A Office Space - Victoria Island - indicative illustration",
    "badges": [
      "FDP Verified",
      "Gov't Consent"
    ],
    "location": "Victoria Island, Lagos",
    "specification": "Open-plan commercial · 1,200m²",
    "description": "Prime Grade-A commercial floor space in Lagos's premier business district. Institutional tenant pipeline secured. Delivery Q3 2026.",
    "tags": [
      "Off-Plan",
      "High Yield"
    ],
    "amenities": [
      "🏢 Smart Building",
      "🅿️ Parking",
      "🔌 24hr Power"
    ],
    "verificationStatus": "FDP Verified"
  },
  {
    "slug": "development-land-guzape-hill",
    "title": "Development Land - Guzape Hill",
    "subtitle": "Land · Abuja",
    "source": "fdp",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": false,
    "priceMillionsNGN": 280.0,
    "priceDisplay": "₦280M",
    "priceLabel": "Asking Price",
    "listedOn": "2026-05-05",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Development Land - Guzape Hill - indicative illustration",
    "badges": [
      "FDP Verified",
      "R of O"
    ],
    "location": "Guzape, Abuja FCT",
    "specification": "2,000m² · Elevated panoramic plot",
    "description": "Rare development plot in Abuja's most prestigious hilltop location. Approved for luxury residential development. Panoramic FCT views.",
    "tags": [
      "Diaspora Friendly",
      "Institutional Grade"
    ],
    "amenities": [],
    "verificationStatus": "FDP Verified"
  },
  {
    "slug": "mreif-affordable-estate-kuje",
    "title": "MREIF Affordable Estate - Kuje",
    "subtitle": "Residential · Abuja",
    "source": "mreif",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": true,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 85.0,
    "priceDisplay": "₦85M",
    "priceLabel": "From",
    "listedOn": "2026-05-01",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "MREIF Affordable Estate - Kuje - indicative illustration",
    "badges": [
      "MREIF",
      "C of O"
    ],
    "location": "Kuje, Abuja FCT",
    "specification": "3-bed terrace · 120m²",
    "description": "Mortgage Real Estate Investment Fund development. Federal government-backed project with subsidised mortgage access from ₦20M equity. Naira-denominated structured repayment available.",
    "tags": [
      "Mortgage Available",
      "Off-Plan",
      "Diaspora Eligible"
    ],
    "amenities": [
      "🏫 School Nearby",
      "🏥 Health Centre",
      "🛣️ Road Access"
    ],
    "verificationStatus": "MREIF via FDP"
  },
  {
    "slug": "family-homes-affordable-housing-sagamu",
    "title": "Family Homes Affordable Housing - Sagamu",
    "subtitle": "Residential · Ogun State",
    "source": "fhf",
    "propertyType": "residential",
    "city": "ogun",
    "diasporaFriendly": false,
    "mortgageEligible": true,
    "affordable": true,
    "offPlan": true,
    "priceMillionsNGN": 15.0,
    "priceDisplay": "₦15M",
    "priceLabel": "From",
    "listedOn": "2026-04-28",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "Family Homes Affordable Housing - Sagamu - indicative illustration",
    "badges": [
      "Family Homes Fund",
      "Gov't"
    ],
    "location": "Sagamu, Ogun State",
    "specification": "2-bed & 3-bed units · 78m² - 110m²",
    "description": "Federal Government's flagship affordable housing programme. Rent-to-own and NHF mortgage options. Monthly repayments from ₦35,000. Targeting low-to-middle income earners. FDP assists with eligibility and application.",
    "tags": [
      "Mortgage / Rent-to-Own",
      "Affordable",
      "Off-Plan"
    ],
    "amenities": [
      "🏘️ Completed Phase 1",
      "🌿 Green Space",
      "💧 Water Supply"
    ],
    "verificationStatus": "Family Homes Fund via FDP"
  },
  {
    "slug": "fha-estate-units-nationwide-access",
    "title": "FHA Estate Units - Nationwide Access",
    "subtitle": "Residential · Nationwide",
    "source": "fha",
    "propertyType": "residential",
    "city": "nationwide",
    "diasporaFriendly": false,
    "mortgageEligible": true,
    "affordable": true,
    "offPlan": false,
    "priceMillionsNGN": 25.0,
    "priceDisplay": "₦25M",
    "priceLabel": "From",
    "listedOn": "2026-04-20",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "FHA Estate Units - Nationwide Access - indicative illustration",
    "badges": [
      "FHA",
      "Gov't Title"
    ],
    "location": "Multiple FHA Estates Nationwide",
    "specification": "1-, 2- & 3-bedroom units available",
    "description": "Federal Housing Authority estate properties across Nigeria. Government-backed titles. FDP assists with allocation applications, document procurement, and mortgage structuring via FMBN or commercial lenders.",
    "tags": [
      "NHF Mortgage",
      "Affordable"
    ],
    "amenities": [
      "🏛️ Gov't Title",
      "🔑 Direct Allocation"
    ],
    "verificationStatus": "FHA via FDP"
  },
  {
    "slug": "fmbn-national-housing-fund-mortgage-access",
    "title": "FMBN National Housing Fund - Mortgage Access",
    "subtitle": "Mortgage Financing · Nationwide",
    "source": "fmbn",
    "propertyType": "residential",
    "city": "nationwide",
    "diasporaFriendly": false,
    "mortgageEligible": true,
    "affordable": true,
    "offPlan": false,
    "priceMillionsNGN": 5.0,
    "priceDisplay": "₦5M",
    "priceLabel": "Loans From",
    "listedOn": "2026-04-15",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "FMBN National Housing Fund - Mortgage Access - indicative illustration",
    "badges": [
      "FMBN",
      "NHF Title"
    ],
    "location": "All States of Nigeria",
    "specification": "NHF loans from ₦5M to ₦15M at 6% p.a.",
    "description": "Federal Mortgage Bank of Nigeria's National Housing Fund. Nigeria's most affordable mortgage product at 6% per annum. FDP advises on eligibility, NHF contributions, application process, and property selection. 25-year maximum tenor available.",
    "tags": [
      "6% Mortgage Rate",
      "25-Year Tenor"
    ],
    "amenities": [
      "💰 Subsidised Rate",
      "📋 FDP Applies For You"
    ],
    "verificationStatus": "FMBN via FDP"
  },
  {
    "slug": "pmi-scheme-lugbe-housing-estate",
    "title": "PMI Scheme - Lugbe Housing Estate",
    "subtitle": "Residential · Abuja",
    "source": "pmi",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": false,
    "mortgageEligible": true,
    "affordable": false,
    "offPlan": false,
    "priceMillionsNGN": 45.0,
    "priceDisplay": "₦45M",
    "priceLabel": "From",
    "listedOn": "2026-04-10",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "PMI Scheme - Lugbe Housing Estate - indicative illustration",
    "badges": [
      "PMI Scheme",
      "Verified"
    ],
    "location": "Lugbe, Abuja FCT",
    "specification": "3-bed semi-detached · 160m²",
    "description": "Licensed Primary Mortgage Institution scheme with structured mortgage product. Competitive commercial rates from 18-22% p.a. FDP advises on lender selection, rate comparison, and mortgage structuring for optimal terms.",
    "tags": [
      "Commercial Mortgage",
      "Title Verified"
    ],
    "amenities": [
      "🏘️ Serviced Estate",
      "🔒 Gated",
      "💡 Solar Backup"
    ],
    "verificationStatus": "PMI via FDP"
  },
  {
    "slug": "lekki-waterfront-residences-phase-2",
    "title": "Lekki Waterfront Residences - Phase 2",
    "subtitle": "Residential · Lagos",
    "source": "developer",
    "propertyType": "residential",
    "city": "lagos",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 120.0,
    "priceDisplay": "₦120M",
    "priceLabel": "From",
    "listedOn": "2026-04-05",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "Lekki Waterfront Residences - Phase 2 - indicative illustration",
    "badges": [
      "FDP Partner Dev.",
      "C of O"
    ],
    "location": "Lekki Phase 2, Lagos",
    "specification": "2-4 bed luxury apartments · 145m²-280m²",
    "description": "FDP-vetted developer project. Developer has been subject to our full partnership due diligence - financial capacity, title verification, construction quality assessment, and milestone accountability framework.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🌊 Waterfront",
      "🏊 Rooftop Pool",
      "🅿️ Underground Parking"
    ],
    "verificationStatus": "FDP Partner Developer"
  },
  {
    "slug": "embassy-district-mansion-confidential",
    "title": "Embassy District Mansion - Confidential",
    "subtitle": "Ultra-Premium Residential · Abuja",
    "source": "offmarket",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": false,
    "priceMillionsNGN": 750.0,
    "priceDisplay": "₦750M+",
    "priceLabel": "Guide Price",
    "listedOn": "2026-05-12",
    "image": "/assets/illustrations/i2.svg",
    "imageAlt": "Embassy District Mansion - Confidential - indicative illustration",
    "badges": [
      "Exclusive",
      "Off-Market ✦",
      "C of O"
    ],
    "location": "Diplomatic Zone, Abuja FCT",
    "specification": "6-bed mansion + 2 DSQs · 1,400m²",
    "description": "Ultra-premium off-market property in Abuja's most exclusive residential location. Full property details shared only with verified, qualified buyers. NDAs required. Serious enquiries only.",
    "tags": [
      "Diaspora Friendly"
    ],
    "amenities": [
      "🏰 Mansion",
      "🌳 1-acre grounds",
      "🏊 Private pool"
    ],
    "verificationStatus": "Off-Market Exclusive"
  },
  {
    "slug": "hutu-exclusive-2-bedroom-apartment",
    "title": "Hutu Exclusive - 2-Bedroom Apartment",
    "subtitle": "Residential · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 80.0,
    "priceDisplay": "₦80,025,484",
    "priceLabel": "Price (12-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Hutu Exclusive - 2-Bedroom Apartment - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "2-bedroom apartment",
    "description": "Premium 2-bedroom apartment within the Hutu Exclusive Golf Resort Estate by Mshel Homes. FCDA-approved. Located on Airport Road before Centenary City, Abuja. Flexible 12-18 month payment plan. Current pricing is time-limited - a 25% price review takes effect from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🔒 Gated",
      "⚡ Backup Power",
      "🌿 Landscaped"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-3-bedroom-apartment",
    "title": "Hutu Exclusive - 3-Bedroom Apartment",
    "subtitle": "Residential · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 102.0,
    "priceDisplay": "₦102,199,875",
    "priceLabel": "Price (12-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Hutu Exclusive - 3-Bedroom Apartment - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "3-bedroom apartment",
    "description": "Spacious 3-bedroom apartment in Mshel Hutu Exclusive Golf Resort Estate. FCDA-approved. Flexible 12-18 month payment plan. Prices increase by 25% effective 7th June 2026 - this is a time-sensitive opportunity at current pricing.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🔒 Gated",
      "⚡ Backup Power",
      "🌿 Landscaped"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-500sqm-5-bed-fully-detached-duplex",
    "title": "Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 54.0,
    "priceDisplay": "₦54,432,000",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "500SQM · 5-Bed Fully Detached Duplex",
    "description": "500SQM estate land within Hutu Exclusive Golf Resort Estate, approved for a 5-bedroom fully detached duplex. FCDA-approved. Outstanding build-to-own capital position in one of Abuja's fastest-appreciating corridors. 4-8 month payment plan. 25% price review effective 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏗️ Build-to-Own",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-150sqm-3-bed-terrace-duplex",
    "title": "Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": true,
    "offPlan": true,
    "priceMillionsNGN": 16.0,
    "priceDisplay": "₦16,329,600",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "150SQM · 3-Bed Terrace Duplex",
    "description": "Entry-level estate land in Hutu Exclusive Golf Resort Estate for a 3-bedroom terrace duplex. FCDA-approved. The most accessible price point to own a premium Abuja Golf Estate address. 4-8 month payment plan. Subject to 25% price review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏘️ Terrace",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-250sqm-4-bed-semi-detached-duplex",
    "title": "Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 27.0,
    "priceDisplay": "₦27,216,000",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "250SQM · 4-Bed Semi-Detached Duplex",
    "description": "250SQM estate land in Hutu Exclusive for a 4-bedroom semi-detached duplex. FCDA-approved. Intelligently priced mid-range position in one of Abuja's most prestigious emerging addresses. 4-8 month payment plan. 25% price review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏗️ Semi-Detached",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-350sqm-4-bed-fully-detached-duplex",
    "title": "Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 38.0,
    "priceDisplay": "₦38,102,400",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "350SQM · 4-Bed Fully Detached Duplex",
    "description": "350SQM estate land in Hutu Exclusive Golf Resort Estate for a 4-bedroom fully detached duplex. FCDA-approved. Strong mid-premium land position. 4-8 month payment plan. Act before the 25% price review effective 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏗️ Fully Detached",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-450sqm-1-bed-block-of-apartments",
    "title": "Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 44.0,
    "priceDisplay": "₦43,740,000",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "450SQM · 1-Bed Block of Apartments",
    "description": "450SQM estate land in Hutu Exclusive for a 1-bedroom block of apartments. FCDA-approved. Ideal for rental income investors building a portfolio within a premium Golf Estate address. 4-8 month payment plan. 25% price review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏢 Rental Income Plot",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-land-1000sqm-3-bed-block-of-apartments",
    "title": "Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments",
    "subtitle": "Land · Abuja · Airport Road",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 109.0,
    "priceDisplay": "₦108,864,000",
    "priceLabel": "Price (4-to mo. plan)",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments - indicative illustration",
    "badges": [
      "Mshel Homes · FDP Partner",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "1000SQM · 3-Bed Block of Apartments",
    "description": "1,000SQM premium estate land in Hutu Exclusive for a 3-bedroom block of apartments development. FCDA-approved. Institutional-grade land holding in one of Abuja's most prestigious emerging golf resort addresses. 4-8 month payment plan. Subject to 25% price review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort Estate",
      "🏢 Institutional Land",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes via FDP"
  },
  {
    "slug": "hutu-exclusive-phase-iii-1-bed-apartment",
    "title": "Hutu Exclusive Phase III - 1-Bed Apartment",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 50.0,
    "priceDisplay": "₦49,988,480",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Hutu Exclusive Phase III - 1-Bed Apartment - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "1-Bedroom Apartment",
    "description": "Premium 1-bedroom apartment in Mshel Hutu Exclusive Phase III Golf Resort Estate. Airport Road, Abuja. Flexible 12-18 month payment plan. Subject to 25% price review effective 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "⚡ Backup Power",
      "🔒 Gated",
      "🌿 Landscaped"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "hutu-exclusive-phase-iii-2-bed-apartment",
    "title": "Hutu Exclusive Phase III - 2-Bed Apartment",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 77.0,
    "priceDisplay": "₦76,538,817",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Hutu Exclusive Phase III - 2-Bed Apartment - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "2-Bedroom Apartment",
    "description": "Contemporary 2-bedroom apartment in Mshel Hutu Exclusive Phase III. Airport Road, Abuja. Flexible 12-18 month payment plan. 25% price review effective 7th June 2026 - current pricing is time-limited.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "⚡ Backup Power",
      "🔒 Gated",
      "🌿 Landscaped"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "hutu-exclusive-phase-iii-3-bed-apartment",
    "title": "Hutu Exclusive Phase III - 3-Bed Apartment",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 98.0,
    "priceDisplay": "₦97,551,073",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Hutu Exclusive Phase III - 3-Bed Apartment - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "3-Bedroom Apartment",
    "description": "Spacious 3-bedroom apartment in Mshel Hutu Exclusive Phase III Golf Resort Estate. Airport Road, Abuja. 12-18 month payment plan. Act before the 25% price review on 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "⚡ Backup Power",
      "🔒 Gated",
      "🌿 Landscaped"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-1-bed-block-of-apartments-6-units",
    "title": "Phase III - 1-Bed Block of Apartments (6 Units)",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 336.0,
    "priceDisplay": "₦335,922,609",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Phase III - 1-Bed Block of Apartments (6 Units) - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "1-Bedroom Block of Apartments - 6 Units",
    "description": "Whole block of 6 × 1-bedroom apartments in Mshel Hutu Exclusive Phase III. Institutional-grade rental income investment in a premium Golf Resort Estate. 12-18 month plan. 25% price review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "📊 6-Unit Block",
      "💰 Rental Yield",
      "🔒 Gated"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-2-bed-block-of-apartments-6-units",
    "title": "Phase III - 2-Bed Block of Apartments (6 Units)",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 512.0,
    "priceDisplay": "₦512,324,851",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Phase III - 2-Bed Block of Apartments (6 Units) - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "2-Bedroom Block of Apartments - 6 Units",
    "description": "Whole block of 6 × 2-bedroom apartments in Mshel Hutu Exclusive Phase III. Premium rental income portfolio in a Golf Resort Estate, Airport Road, Abuja. 12-18 month plan. 25% price review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "📊 6-Unit Block",
      "💰 High Yield",
      "🔒 Gated"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-3-bed-block-of-apartments-6-units",
    "title": "Phase III - 3-Bed Block of Apartments (6 Units)",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "residential",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 656.0,
    "priceDisplay": "₦655,543,211",
    "priceLabel": "12 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i5.svg",
    "imageAlt": "Phase III - 3-Bed Block of Apartments (6 Units) - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "3-Bedroom Block of Apartments - 6 Units",
    "description": "Flagship whole block of 6 × 3-bedroom apartments in Mshel Hutu Exclusive Phase III. Institutional capital in a premium Golf Resort Estate. The highest-yield block product in the development. 12-18 months. 25% price review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "📊 6-Unit Block",
      "💰 Institutional",
      "🔒 Gated"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-azure-150sqm-3-bed-terrace-duplex",
    "title": "Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": true,
    "offPlan": true,
    "priceMillionsNGN": 7.0,
    "priceDisplay": "₦7,481,250",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "AZURE · 150SQM · Three Bedroom Terrace Duplex - Estate Land",
    "description": "AZURE - 150SQM estate land in Hutu Exclusive Phase III for a 3-bedroom terrace duplex. The most accessible entry point to own a premium Golf Resort Estate address in Abuja. 4-18 month plan. 25% review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏘️ Terrace",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-starry-250sqm-3-bed-semi-det-pent-house",
    "title": "Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": true,
    "offPlan": true,
    "priceMillionsNGN": 12.0,
    "priceDisplay": "₦12,468,750",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "STARRY · 250SQM · 3-Bedroom Semi-Detached Pent House - Estate Land",
    "description": "STARRY - 250SQM estate land in Hutu Exclusive Phase III for a 3-bedroom semi-detached pent house. A rare pent house product in a Golf Estate setting. 4-18 month plan. 25% price review from 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏠 Pent House",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-350sqm-4-bed-fully-detached-duplex",
    "title": "Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 15.0,
    "priceDisplay": "₦14,960,938",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "350SQM · Four Bedroom Fully Detached Duplex - Estate Land",
    "description": "350SQM estate land in Hutu Exclusive Phase III for a 4-bedroom fully detached duplex. FCDA-approved Golf Resort Estate on Abuja's Airport Road corridor. Strong capital appreciation outlook. 4-18 months. 25% review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏗️ Fully Detached",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-500sqm-5-bed-fully-detached-duplex",
    "title": "Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 25.0,
    "priceDisplay": "₦24,937,500",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "500SQM · Five Bedroom Fully Detached Duplex - Estate Land",
    "description": "500SQM estate land in Hutu Exclusive Phase III for a 5-bedroom fully detached duplex. FCDA-approved. Commanding mid-premium land position within one of Abuja's most prestigious Golf Resort developments. 4-18 months. 25% review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏗️ Fully Detached",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-750sqm-2-bed-block-of-apartments",
    "title": "Phase III Estate Land - 750SQM · 2-Bed Block of Apartments",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 37.0,
    "priceDisplay": "₦37,400,000",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - 750SQM · 2-Bed Block of Apartments - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "750SQM · Two Bedroom Block of Apartments - Estate Land",
    "description": "750SQM estate land in Hutu Exclusive Phase III for a 2-bedroom block of apartments development. Strong rental income plot within the Golf Resort Estate. Airport Road, Abuja. 4-18 month plan. 25% price review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏢 Rental Block",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  },
  {
    "slug": "phase-iii-estate-land-1000sqm-7-bed-fully-detached-duplex",
    "title": "Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex",
    "subtitle": "Phase III · Airport Road, Abuja",
    "source": "developer",
    "propertyType": "land",
    "city": "abuja",
    "diasporaFriendly": true,
    "mortgageEligible": false,
    "affordable": false,
    "offPlan": true,
    "priceMillionsNGN": 50.0,
    "priceDisplay": "₦49,867,188",
    "priceLabel": "4 to 18 months plan available",
    "listedOn": "2026-05-15",
    "image": "/assets/illustrations/i4.svg",
    "imageAlt": "Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex - indicative illustration",
    "badges": [
      "Mshel Homes · Phase III",
      "PRICE RISES 7 JUN",
      "FCDA Approved"
    ],
    "location": "Airport Road, Before Centenary City, Abuja",
    "specification": "1000SQM · Seven Bedroom Fully Detached Duplex - Estate Land",
    "description": "1,000SQM flagship estate land in Hutu Exclusive Phase III for a 7-bedroom fully detached duplex. Institutional-grade holding in a premier Golf Resort Estate. The ultimate premium address on Abuja Airport Road. 4-18 months. 25% review 7th June 2026.",
    "tags": [
      "Off-Plan",
      "Diaspora Friendly",
      "Dev. Vetted"
    ],
    "amenities": [
      "🏌️ Golf Resort",
      "🏰 Flagship Plot",
      "🔒 Gated",
      "🌿 Serviced"
    ],
    "verificationStatus": "Mshel Homes Phase III via FDP"
  }
]
;

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export interface ListingFilter {
  source?: ListingSource;
  propertyType?: PropertyType;
  city?: City;
  diasporaFriendly?: boolean;
  mortgageEligible?: boolean;
  affordable?: boolean;
  offPlan?: boolean;
  maxPriceMillionsNGN?: number;
  search?: string;
}

/** 'featured' preserves the curated register order, which is the published default. */
export type ListingSort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'title';

export function filterListings(f: ListingFilter = {}, sort: ListingSort = 'featured'): Listing[] {
  const q = f.search?.trim().toLowerCase();
  const out = listings.filter((l) => {
    if (f.source && l.source !== f.source) return false;
    if (f.propertyType && l.propertyType !== f.propertyType) return false;
    if (f.city && l.city !== f.city) return false;
    if (f.diasporaFriendly && !l.diasporaFriendly) return false;
    if (f.mortgageEligible && !l.mortgageEligible) return false;
    if (f.affordable && !l.affordable) return false;
    if (f.offPlan && !l.offPlan) return false;
    if (f.maxPriceMillionsNGN != null &&
        (l.priceMillionsNGN == null || l.priceMillionsNGN > f.maxPriceMillionsNGN)) return false;
    if (q) {
      const hay = [l.title, l.subtitle, l.location, l.specification, l.description,
                   ...l.tags, ...l.amenities].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => (a.priceMillionsNGN ?? Infinity) - (b.priceMillionsNGN ?? Infinity));
    case 'price-desc':
      return out.sort((a, b) => (b.priceMillionsNGN ?? -Infinity) - (a.priceMillionsNGN ?? -Infinity));
    case 'title':
      return out.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
      return out.sort((a, b) => b.listedOn.localeCompare(a.listedOn));
    default:
      return out;   // 'featured' - curated register order, unsorted
  }
}
