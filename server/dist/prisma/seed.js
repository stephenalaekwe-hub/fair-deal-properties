"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting Fair Deal Properties database seed...');
    // 1. Seed Users (Super Admin & Field Agents)
    const adminPassword = await bcryptjs_1.default.hash('Admin@123456', 10);
    const agentPassword = await bcryptjs_1.default.hash('Agent@123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fairdealng.com' },
        update: {},
        create: {
            name: 'FDP Principal Admin',
            email: 'admin@fairdealng.com',
            passwordHash: adminPassword,
            role: 'SUPER_ADMIN',
            phone: '+2349049924198',
            active: true,
        },
    });
    const agent1 = await prisma.user.upsert({
        where: { email: 'emeka.agent@fairdealng.com' },
        update: {},
        create: {
            name: 'Emeka Okonkwo',
            email: 'emeka.agent@fairdealng.com',
            passwordHash: agentPassword,
            role: 'AGENT',
            phone: '+2348031234567',
            active: true,
        },
    });
    const agent2 = await prisma.user.upsert({
        where: { email: 'aisha.agent@fairdealng.com' },
        update: {},
        create: {
            name: 'Aisha Bello',
            email: 'aisha.agent@fairdealng.com',
            passwordHash: agentPassword,
            role: 'AGENT',
            phone: '+2348098765432',
            active: true,
        },
    });
    console.log(`✅ Seeded users: 1 Admin (${admin.email}), 2 Agents (${agent1.email}, ${agent2.email})`);
    // 2. Seed Financing Routes
    const routes = [
        {
            id: 'mreif',
            name: 'MREIF mortgage',
            institution: 'Ministry of Finance Incorporated Real Estate Investment Fund',
            interestRatePct: 9.75,
            maxTermYears: 20,
            minEquityPct: 10,
            eligibility: 'Verifiable income. Property must be drawn from MREIF-enlisted stock.',
            bestFor: 'Salaried and self-employed buyers purchasing enlisted stock who can evidence income.',
            constraints: 'Stock is limited to enlisted developments. Allocation is not guaranteed by eligibility alone.',
            lastVerified: '2026-10-14',
            verificationNote: 'Confirm current rate and enlisted-stock list with MREIF before quoting.',
            sourceUrl: 'https://mofi.com.ng',
        },
        {
            id: 'nhf',
            name: 'National Housing Fund loan',
            institution: 'Federal Mortgage Bank of Nigeria',
            interestRatePct: 6.0,
            maxTermYears: 30,
            minEquityPct: 10,
            eligibility: 'Minimum 6 months of NHF contributions through an accredited PMI.',
            bestFor: 'Contributors seeking the lowest available rate over the longest tenor.',
            constraints: 'Contribution history is a precondition. Processing runs through a PMI, not the bank directly.',
            lastVerified: '2026-10-14',
            verificationNote: 'Confirm the current loan ceiling and equity requirement with FMBN.',
            sourceUrl: 'https://fmbn.gov.ng',
        },
        {
            id: 'diaspora-nhf',
            name: 'Diaspora NHF window',
            institution: 'Federal Mortgage Bank of Nigeria',
            interestRatePct: 9.0,
            maxTermYears: 10,
            minEquityPct: 15,
            eligibility: 'Nigerians resident abroad, contributing to the diaspora NHF window.',
            bestFor: 'Diaspora buyers who want a structured, institutionally supervised route.',
            constraints: 'Shorter tenor than the domestic NHF route.',
            lastVerified: '2026-10-14',
            verificationNote: 'Confirm window status, contribution mechanics and ceiling with FMBN.',
            sourceUrl: 'https://fmbn.gov.ng',
        },
        {
            id: 'pmi',
            name: 'Primary mortgage institution facility',
            institution: 'Licensed PMIs',
            interestRatePct: 18.5,
            maxTermYears: 20,
            minEquityPct: 20,
            eligibility: 'Income verification and title acceptable to the lender.',
            bestFor: 'Buyers whose property falls outside enlisted stock.',
            constraints: 'Rates are institution-specific and variable.',
            lastVerified: '2026-10-14',
            verificationNote: 'Compare at least three PMIs before committing.',
            sourceUrl: 'https://nmrc.com.ng',
        },
        {
            id: 'commercial',
            name: 'Commercial bank mortgage',
            institution: 'Deposit money banks',
            interestRatePct: 22.0,
            maxTermYears: 15,
            minEquityPct: 25,
            eligibility: 'Strong, documented income. Bank-acceptable title and valuation.',
            bestFor: 'Higher-value transactions that need speed rather than the lowest rate.',
            constraints: 'Most expensive route over the life of the facility.',
            lastVerified: '2026-10-14',
            verificationNote: 'Obtain a written offer letter including all fees before comparison.',
        },
        {
            id: 'developer',
            name: 'Developer payment plan',
            institution: 'Developer-financed',
            interestRatePct: 0.0,
            maxTermYears: 3,
            minEquityPct: 30,
            eligibility: 'Direct agreement with vetted developer. Progress-linked milestones.',
            bestFor: 'Buyers purchasing off-plan or under construction with short-term cash flow.',
            constraints: 'Short repayment window requires high periodic capital.',
            lastVerified: '2026-10-14',
            verificationNote: 'Ensure milestone inspection sign-offs before tranche disbursements.',
        },
    ];
    for (const r of routes) {
        await prisma.financingRoute.upsert({
            where: { id: r.id },
            update: r,
            create: r,
        });
    }
    console.log(`✅ Seeded ${routes.length} Financing Routes`);
    // 3. Seed Demo Inspection
    await prisma.inspection.upsert({
        where: { reference: 'FDP-INS-DEMO01' },
        update: {},
        create: {
            reference: 'FDP-INS-DEMO01',
            clientName: 'Chief Olatunji Adeleke',
            clientEmail: 'o.adeleke@example.com',
            clientPhone: '+2348021112233',
            propertyTitle: 'Luxury 5-Bedroom Duplex - Maitama District',
            propertyLocation: 'Maitama, Abuja (FCT)',
            stage: 5, // On-Site Examination
            assignedAgentId: agent1.id,
            officerName: 'Engr. Stephen Alaekwe (Reg. Surveyor)',
            scheduledDate: new Date('2026-10-20'),
            reportUrl: 'https://www.fairdealng.com/assets/sample-inspection-dossier.pdf',
            notes: 'Cadastral coordinates verified against AGIS records. Drone aerial topography completed.',
        },
    });
    console.log('✅ Seeded Demo Inspection (FDP-INS-DEMO01)');
    // 4. Seed Verified Listings
    const initialListings = [
        {
            slug: 'luxury-duplex-maitama',
            title: 'Luxury 5-Bedroom Fully Detached Duplex',
            subtitle: 'Premium residential property in the heart of Maitama with smart home infrastructure and pool.',
            source: 'fdp',
            propertyType: 'residential',
            city: 'abuja',
            diasporaFriendly: true,
            mortgageEligible: true,
            affordable: false,
            offPlan: false,
            priceMillionsNGN: 450.0,
            priceDisplay: '₦450,000,000',
            priceLabel: 'Verified Asking Price',
            listedOn: '2026-10-01',
            image: '/assets/illustrations/i0.svg',
            imageAlt: 'Luxury Duplex Maitama',
            badges: ['FDP Direct', 'Title Verified', 'C of O'],
            location: 'Maitama District, Abuja, FCT',
            specification: '5 Beds · 6 Baths · 4 Parking · Private Swimming Pool · 850 sqm',
            description: 'Superbly finished detached duplex located on an exclusive cul-de-sac in Maitama. AGIS search completed with clean root of title.',
            tags: ['Luxury', 'Diplomatic Zone', 'Swimming Pool', 'Smart Home'],
            amenities: ['24/7 Security Patrol', 'Dedicated Transformer', 'Borehole with Water Treatment', 'Smart CCTV'],
            verificationStatus: 'Title Verified: Certificate of Occupancy registered under AGIS File No. MISC-10294.',
            assignedAgentId: agent1.id,
        },
        {
            slug: 'serviced-apartments-guzape',
            title: 'Executive 3-Bedroom Serviced Apartments',
            subtitle: 'Scenic hillside residential development with uninterrupted views of the city skyline.',
            source: 'developer',
            propertyType: 'residential',
            city: 'abuja',
            diasporaFriendly: true,
            mortgageEligible: true,
            affordable: false,
            offPlan: true,
            priceMillionsNGN: 120.0,
            priceDisplay: '₦120,000,000',
            priceLabel: 'Off-Plan Introductory Offer',
            listedOn: '2026-10-05',
            image: '/assets/illustrations/i1.svg',
            imageAlt: 'Serviced Apartments Guzape',
            badges: ['Off-Plan', 'Milestone Verified', 'NMRC Eligible'],
            location: 'Guzape Diplomatic Zone, Abuja, FCT',
            specification: '3 Beds · 3.5 Baths · 2 Parking · Elevator Access · 220 sqm',
            description: 'Contemporary apartments designed for high rental yield and diaspora investor comfort. Construction stage 4 of 8.',
            tags: ['Hillside View', 'High Yield', 'Elevator', 'Diaspora Preferred'],
            amenities: ['Elevator', 'Gym & Clubhouse', 'Backup Power', 'Fibre Internet'],
            verificationStatus: 'Development Approvals Cleared: FCDA Building Plan Approval Reference FCDA/URP/2025/441.',
            assignedAgentId: agent2.id,
        },
        {
            slug: 'fha-apo-terrace',
            title: 'FHA Enlisted 4-Bedroom Terrace Duplex',
            subtitle: 'Federally supervised housing scheme with pre-approved FMBN National Housing Fund mortgage financing.',
            source: 'fha',
            propertyType: 'residential',
            city: 'abuja',
            diasporaFriendly: true,
            mortgageEligible: true,
            affordable: true,
            offPlan: false,
            priceMillionsNGN: 48.0,
            priceDisplay: '₦48,000,000',
            priceLabel: 'NHF Pre-Approved Price',
            listedOn: '2026-10-08',
            image: '/assets/illustrations/i2.svg',
            imageAlt: 'FHA Terrace Apo',
            badges: ['FHA Enlisted', 'NHF 6% Eligible', 'Affordable'],
            location: 'Apo Resettlement Scheme, Abuja, FCT',
            specification: '4 Beds · 4 Baths · 2 Parking · Solar-Ready · 350 sqm',
            description: 'Institutional stock eligible for 6% NHF mortgage route over a 30-year tenor. Title guaranteed directly by Federal Housing Authority.',
            tags: ['Affordable', 'Mortgage Ready', 'Family Friendly'],
            amenities: ['Paved Access Road', 'Gated Community', 'Estate Security', 'Prepaid Electricity Meter'],
            verificationStatus: 'Federal Allocation Letter & Sublease Agreement directly from Federal Housing Authority.',
            assignedAgentId: agent1.id,
        },
        {
            slug: 'commercial-plaza-wuse2',
            title: 'Prime 4-Storey Commercial Plaza',
            subtitle: 'High-footfall commercial facility on Aminu Kano Crescent with multi-tenant corporate leases.',
            source: 'fdp',
            propertyType: 'commercial',
            city: 'abuja',
            diasporaFriendly: false,
            mortgageEligible: false,
            affordable: false,
            offPlan: false,
            priceMillionsNGN: 850.0,
            priceDisplay: '₦850,000,000',
            priceLabel: 'Direct Mandate',
            listedOn: '2026-09-25',
            image: '/assets/illustrations/i3.svg',
            imageAlt: 'Commercial Plaza Wuse 2',
            badges: ['Commercial', 'High Rental Yield', 'C of O'],
            location: 'Aminu Kano Crescent, Wuse 2, Abuja',
            specification: '1,400 sqm Letable Area · 25 Parking Bays · 350kVA Generator',
            description: 'Premium investment asset yielding over ₦65M annual net rental income from blue-chip commercial tenants.',
            tags: ['Commercial', 'Wuse 2', 'High Return', 'Prime Location'],
            amenities: ['Heavy Duty Generator', 'Dedicated Substation', 'Private Security', 'Fire Suppression System'],
            verificationStatus: 'Full Commercial C of O verified. Title deed and lease contracts available in data room.',
            assignedAgentId: admin.id,
        },
        {
            slug: 'prime-residential-land-katampe-ext',
            title: '1,200 sqm Residential Plot - Katampe Extension',
            subtitle: 'Build-ready prime plot with panoramic views and complete cadastral beacons.',
            source: 'fdp',
            propertyType: 'land',
            city: 'abuja',
            diasporaFriendly: true,
            mortgageEligible: false,
            affordable: false,
            offPlan: false,
            priceMillionsNGN: 95.0,
            priceDisplay: '₦95,000,000',
            priceLabel: 'Verified Plot Price',
            listedOn: '2026-10-10',
            image: '/assets/illustrations/i4.svg',
            imageAlt: 'Land Katampe Extension',
            badges: ['Clean Title', 'C of O', 'Beaconed'],
            location: 'Diplomatic Zone, Katampe Extension, Abuja',
            specification: '1,200 sqm · High Density Residential · Survey Beacons Intact',
            description: 'Exceptional plot suitable for a bespoke mansion or luxury apartment blocks. No disputes or encumbrances.',
            tags: ['Land', 'Katampe', 'Investment', 'Title Ready'],
            amenities: ['Tarred Access', 'Drainage Infrastructure', 'Electricity Grid Connection', 'Street Lighting'],
            verificationStatus: 'FCDA Allocation with Registered Certificate of Occupancy. Coordinates cross-checked on AGIS GIS portal.',
            assignedAgentId: agent2.id,
        },
    ];
    for (const l of initialListings) {
        await prisma.listing.upsert({
            where: { slug: l.slug },
            update: l,
            create: l,
        });
    }
    console.log(`✅ Seeded ${initialListings.length} Verified Properties`);
    console.log('\n🎉 Fair Deal Properties database seed finished successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
