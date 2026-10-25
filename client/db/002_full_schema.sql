-- ════════════════════════════════════════════════════════════════════════════
-- FAIR DEAL PROPERTIES LTD - FULL PRODUCTION DATABASE SCHEMA (POSTGRESQL)
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Submissions Table (Inquiries, Contacts, DSR, Snags)
DO $$ BEGIN
  CREATE TYPE submission_collection AS ENUM (
    'contact', 'enquiry', 'alert', 'newsletter', 'inspection', 'dsr', 'snag'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE retention_trigger AS ENUM (
    'purpose-accomplished', 'consent-withdrawn', 'record-created'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS submissions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference             text NOT NULL UNIQUE,
  collection            submission_collection NOT NULL,
  received_at           timestamptz NOT NULL DEFAULT now(),
  due_at                timestamptz,
  payload               jsonb NOT NULL,
  ip_hash               text,
  user_agent            text,
  retention_months      integer NOT NULL DEFAULT 6,
  retention_trigger     retention_trigger NOT NULL DEFAULT 'record-created',
  retention_basis       text NOT NULL DEFAULT 'GAID 2025 Art 49(3)',
  retention_trigger_at  timestamptz,
  erase_after           timestamptz NOT NULL DEFAULT (now() + interval '6 months'),
  closed_at             timestamptz,
  closed_by             text,
  outcome               text,
  erased_at             timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_open_idx ON submissions (due_at) WHERE closed_at IS NULL AND erased_at IS NULL;
CREATE INDEX IF NOT EXISTS submissions_collection_idx ON submissions (collection, received_at DESC);

-- 2. Users Table (Admin & Field Agents)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AGENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          user_role NOT NULL DEFAULT 'AGENT',
  phone         text,
  avatar_url    text,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 3. Listings Table (Live Verified Properties Register)
CREATE TABLE IF NOT EXISTS listings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text NOT NULL UNIQUE,
  title                 text NOT NULL,
  subtitle              text NOT NULL,
  source                text NOT NULL DEFAULT 'fdp',
  property_type         text NOT NULL DEFAULT 'residential',
  city                  text NOT NULL DEFAULT 'abuja',
  diaspora_friendly     boolean NOT NULL DEFAULT false,
  mortgage_eligible     boolean NOT NULL DEFAULT false,
  affordable            boolean NOT NULL DEFAULT false,
  off_plan              boolean NOT NULL DEFAULT false,
  price_millions_ngn    numeric(12, 2),
  price_display         text NOT NULL,
  price_label           text NOT NULL DEFAULT 'Verified Price',
  listed_on             text NOT NULL,
  image                 text NOT NULL,
  image_alt             text NOT NULL,
  badges                jsonb NOT NULL DEFAULT '[]'::jsonb,
  location              text NOT NULL,
  specification         text NOT NULL,
  description           text NOT NULL,
  tags                  jsonb NOT NULL DEFAULT '[]'::jsonb,
  amenities             jsonb NOT NULL DEFAULT '[]'::jsonb,
  verification_status   text NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listings_city_type_idx ON listings (city, property_type);
CREATE INDEX IF NOT EXISTS listings_source_idx ON listings (source);

-- 4. Inspections Table (Live Inspection Pipeline & Client Tracker)
CREATE TABLE IF NOT EXISTS inspections (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference         text NOT NULL UNIQUE,
  client_name       text NOT NULL,
  client_email      text NOT NULL,
  client_phone      text NOT NULL,
  property_title    text NOT NULL,
  property_location text NOT NULL,
  stage             integer NOT NULL DEFAULT 1,
  officer_name      text,
  scheduled_date    timestamptz,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inspections_stage_idx ON inspections (stage);

-- 5. Financing Routes Table
CREATE TABLE IF NOT EXISTS financing_routes (
  id                 text PRIMARY KEY,
  name               text NOT NULL,
  institution        text NOT NULL,
  interest_rate_pct  numeric(5, 2),
  max_term_years     integer,
  min_equity_pct     numeric(5, 2),
  eligibility        text NOT NULL,
  best_for           text NOT NULL,
  constraints        text NOT NULL,
  last_verified      text NOT NULL,
  verification_note  text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- SEED INITIAL DATA
-- ════════════════════════════════════════════════════════════════════════════

-- Seed Admin and Field Officers (BCrypt hashed passwords)
-- Admin: Admin@123456 ($2a$10$wN1QGg8R.l7LwWcT1gW7tebE1V5k1sT4kM5K8Pq8wW7tebE1V5k1s)
-- Agents: Agent@123456
INSERT INTO users (name, email, password_hash, role, phone, active)
VALUES 
  ('FDP Principal Admin', 'admin@fdealproperties.com', crypt('Admin@123456', gen_salt('bf', 10)), 'SUPER_ADMIN', '+2349049924198', true),
  ('Emeka Okonkwo', 'emeka.agent@fdealproperties.com', crypt('Agent@123456', gen_salt('bf', 10)), 'AGENT', '+2348031234567', true),
  ('Aisha Bello', 'aisha.agent@fdealproperties.com', crypt('Agent@123456', gen_salt('bf', 10)), 'AGENT', '+2348098765432', true)
ON CONFLICT (email) DO NOTHING;

-- Seed Financing Routes
INSERT INTO financing_routes (id, name, institution, interest_rate_pct, max_term_years, min_equity_pct, eligibility, best_for, constraints, last_verified, verification_note)
VALUES
  ('mreif', 'MREIF mortgage', 'Ministry of Finance Incorporated Real Estate Investment Fund', 9.75, 20, 10, 'Verifiable income. Property must be drawn from MREIF-enlisted stock.', 'Salaried and self-employed buyers purchasing enlisted stock who can evidence income.', 'Stock is limited to enlisted developments. Allocation is not guaranteed by eligibility alone.', '2026-10-14', 'Confirm current rate and enlisted-stock list with MREIF before quoting.'),
  ('nhf', 'National Housing Fund loan', 'Federal Mortgage Bank of Nigeria', 6.00, 30, NULL, 'Minimum 6 months of NHF contributions through an accredited PMI.', 'Contributors seeking the lowest available rate over the longest tenor.', 'Contribution history is a precondition. Processing runs through a PMI, not the bank directly.', '2026-10-14', 'Confirm loan ceiling and equity requirement with FMBN.'),
  ('diaspora-nhf', 'Diaspora NHF window', 'Federal Mortgage Bank of Nigeria', 9.00, 10, 30, 'Nigerian citizens resident abroad, verified through an accredited overseas remittance partner.', 'Nigerians in the diaspora seeking a government-backed facility for residential purchase.', 'Remittance through approved channels is mandatory; currency risk sits with the borrower.', '2026-10-14', 'Review FMBN diaspora circular for list of accredited mortgage brokers.'),
  ('pmi', 'PMI conventional mortgage', 'Licensed Primary Mortgage Institutions', 17.50, 15, 20, 'Income verification, credit bureau check, clear title on the property.', 'Buyers whose income or choice of property falls outside government-backed scheme criteria.', 'Rates vary significantly between institutions. Variable rate clauses are common.', '2026-10-14', 'Obtain written offer letters from at least two PMIs before comparing total cost.'),
  ('commercial', 'Commercial bank mortgage', 'Tier-1 commercial banks', 24.00, 10, 30, 'Corporate salary accounts, high-net-worth individuals, verified business cashflow.', 'Fast completion where speed is prioritized over borrowing cost.', 'High interest rate environment. Pre-payment penalties and appraisal fees apply.', '2026-10-14', 'Review total cost of credit including management and facility fees.'),
  ('developer', 'Developer milestone instalments', 'Vetted developer partners', 0.00, 3, 20, 'Deposit at ground-breaking, balance distributed across construction stages.', 'Buyers of off-plan units with strong monthly or quarterly cashflow.', 'Risk of construction delay; money is paid before title is conveyed. Escrow protections recommended.', '2026-10-14', 'Only offered on developments with audited progress reports on file.')
ON CONFLICT (id) DO UPDATE SET
  interest_rate_pct = EXCLUDED.interest_rate_pct,
  last_verified = EXCLUDED.last_verified;

-- Seed Sample Inspections with Trackable References
INSERT INTO inspections (reference, client_name, client_email, client_phone, property_title, property_location, stage, officer_name, scheduled_date, notes)
VALUES
  ('FDP-INS-DEMO01', 'Stephen Alaekwe', 'client@fdealproperties.com', '+2348039990001', 'Hutu Exclusive Phase III - 500SQM Plot', 'Airport Road, Abuja', 6, 'Emeka Okonkwo', now() - interval '2 days', 'Beacons sighted, topography confirmed, boundary photos uploaded.'),
  ('FDP-INS-DEMO02', 'Dr. Amina Yusuf', 'amina@fdealproperties.com', '+2348052223344', 'Maitama Luxury Duplex - 5 Bed', 'Maitama District, Abuja', 8, 'Aisha Bello', now() - interval '5 days', 'Mechanical, electrical and structural checks complete. Report under final review.'),
  ('FDP-INS-DEMO03', 'Chukwudi Nze', 'c.nze@fdealproperties.com', '+2348071112233', 'Guzape Hill Development Land - 2,000SQM', 'Guzape District, Abuja', 4, 'Emeka Okonkwo', now() + interval '1 day', 'Field officer scheduled for perimeter attendance on Monday morning.')
ON CONFLICT (reference) DO NOTHING;

-- Seed Verified Property Listings
INSERT INTO listings (slug, title, subtitle, source, property_type, city, diaspora_friendly, mortgage_eligible, affordable, off_plan, price_millions_ngn, price_display, price_label, listed_on, image, image_alt, badges, location, specification, description, tags, amenities, verification_status)
VALUES
  (
    'luxury-duplex-maitama',
    'Luxury Duplex - Maitama',
    'Completed 5-bedroom detached duplex with boys quarters and landscaped grounds, verified on title and structural integrity.',
    'fdp', 'residential', 'abuja', true, true, false, false,
    850.00, '₦850,000,000', 'Verified Price', '2026-09-22',
    '/assets/hero-bg.webp', 'Maitama luxury duplex exterior frontage',
    '["Title Verified", "Physical Inspection Done", "Diaspora Friendly", "Mortgage Eligible"]'::jsonb,
    'Maitama District, Abuja FCT',
    '5 bedrooms all en-suite · 2-room BQ · 1,200 sqm plot · Swimming pool · Dedicated transformer',
    'Exclusively mandated to Fair Deal Properties. Sits on a fully serviced tarred street within the diplomatic zone of Maitama. Title is a verified FCDA Certificate of Occupancy with no encumbrances.',
    '["Detached Duplex", "Maitama", "Diplomatic Zone", "Luxury", "Pool"]'::jsonb,
    '["Swimming pool", "Landscaped garden", "Dedicated 50kVA transformer", "2-room staff quarters", "Borehole with filtration plant", "Automated perimeter gate"]'::jsonb,
    'Verified by FDP Legal and Survey teams on 22 September 2026. Title search confirms zero encumbrance. Structural checklist passed.'
  ),
  (
    'hutu-exclusive-phase-3-plot',
    'Hutu Exclusive Phase III - 500SQM Plot',
    'Direct developer plot within an infrastructure-led master community along the Airport Road corridor.',
    'developer', 'land', 'abuja', true, false, true, false,
    18.50, '₦18,500,000', 'Verified Developer Price', '2026-09-18',
    '/assets/hero-bg.webp', 'Hutu Exclusive Phase III estate layout and perimeter boundary',
    '["Site Attended", "Beacons Verified", "Affordable", "Diaspora Friendly"]'::jsonb,
    'Airport Road, Before Centenary City, Abuja FCT',
    '500 sqm build-ready residential plot · Approved layout · Perimeter fencing in progress',
    'Part of the vetted Hutu Exclusive master development. Located 18 minutes from Nnamdi Azikiwe International Airport and 22 minutes from the Central Business District.',
    '["Residential Land", "Airport Road", "Affordable", "Build Ready", "Master Community"]'::jsonb,
    '["Perimeter wall", "Estate access road", "Electrification poles installed", "Drainage works in progress", "Security gatehouse manned"]'::jsonb,
    'Site attendance completed on 18 September 2026. Four corner beacons located, photographed and coordinates reconciled against the layout plan.'
  ),
  (
    'mreif-wuye-terrace',
    'MREIF Enlisted 4-Bed Terrace - Wuye',
    'Fully enlisted under the Ministry of Finance Incorporated Real Estate Investment Fund single-digit mortgage window.',
    'mreif', 'residential', 'abuja', false, true, true, false,
    125.00, '₦125,000,000', 'Enlisted Scheme Price', '2026-09-10',
    '/assets/hero-bg.webp', 'Wuye 4-bedroom terrace contemporary exterior view',
    '["MREIF Enlisted", "Single-Digit Mortgage", "Title Verified", "Ready for Handover"]'::jsonb,
    'Wuye District, Abuja FCT',
    '4 bedrooms en-suite · 1-room BQ · Contemporary kitchen · Central generator · Paved parking',
    'Selected into the MREIF affordable mortgage window. Eligible buyers can access long-term financing at 9.75% per annum with 10% equity contribution.',
    '["Terrace", "Wuye", "MREIF", "Single Digit Mortgage", "Affordable Housing"]'::jsonb,
    '["Central generator", "Interlocking stone paving", "Pre-installed inverter wiring", "Children play area", "FM service agreement"]'::jsonb,
    'Enlistment verified against MREIF Register Reference MREIF-ABJ-WY-041 on 10 September 2026.'
  ),
  (
    'guzape-hill-view-plot',
    'Guzape Hill Development Land - 2,000SQM',
    'Prime elevated parcel overlooking the FCT skyline with approved medium-density residential development permit.',
    'offmarket', 'land', 'abuja', true, false, false, false,
    320.00, '₦320,000,000', 'Direct Mandate Price', '2026-09-08',
    '/assets/hero-bg.webp', 'Guzape hillside parcel with panoramic view over Abuja city',
    '["Direct Mandate", "Title Verified", "Topography Survey Done", "Off-Market"]'::jsonb,
    'Guzape District, Abuja FCT',
    '2,000 sqm parcel · Approved for 6 luxury terrace units or private mansion · C of O',
    'Elevated topography offering permanent, unblockable panoramic views of the city. Ideal for a private estate or a boutique residential development.',
    '["Land", "Guzape", "Panoramic View", "Development Parcel", "Off-Market"]'::jsonb,
    '["Tarred access road", "Existing electricity connection to spine", "Geotechnical baseline on file"]'::jsonb,
    'C of O sighted and verified at AGIS. Topographic survey logged with FDP Survey team on 8 September 2026.'
  ),
  (
    'victoria-island-commercial-floor',
    'Victoria Island Prime Office Floor - 420SQM',
    'Grade-A corporate floor plate with dedicated parking, marine views and full technical redundancy.',
    'fdp', 'commercial', 'lagos', true, false, false, false,
    650.00, '₦650,000,000', 'Verified Price', '2026-08-30',
    '/assets/hero-bg.webp', 'Grade-A commercial office tower facade Victoria Island Lagos',
    '["Grade A", "Title Verified", "Lease Yield 11.2%", "Corporate Tenancy"]'::jsonb,
    'Ahmadu Bello Way, Victoria Island, Lagos',
    '420 sqm usable office space · 8 dedicated basement parking bays · Raised access flooring',
    'Suitable for financial institutions, multinationals and professional practices seeking freehold corporate ownership on Victoria Island.',
    '["Commercial", "Office Space", "Victoria Island", "High Yield", "Corporate Real Estate"]'::jsonb,
    '["Triple-redundant power", "Fiber optic backbone", "CCTV and access control", "Basement parking", "Sea view"]'::jsonb,
    'Federal Land Registry search completed in Lagos. Maintenance audit and mechanical plant inspected.'
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
