/** Financing routes compared on total cost of credit rather than headline rate.
 *
 * Every rate, tenor and equity requirement below is taken from the scheme's own
 * published terms. Schemes revise terms without notice and allocation is never
 * guaranteed by rate alone, so each record carries a verification marker. Confirm
 * directly with the institution before any figure is put in front of a client.
 *
 * [VERIFY] Re-confirm all rates, tenors and equity thresholds with each institution
 * before commercial reliance. Last confirmed: see `lastVerified` on each record.
 */

export type FinancingRouteId = 'mreif' | 'nhf' | 'diaspora-nhf' | 'pmi' | 'commercial' | 'developer';

export interface FinancingRoute {
  id: FinancingRouteId;
  name: string;
  institution: string;
  interestRatePct: number | null;
  maxTermYears: number | null;
  minEquityPct: number | null;
  eligibility: string;
  bestFor: string;
  constraints: string;
  lastVerified: string;
  verificationNote?: string;
}

export const financingRoutes: FinancingRoute[] = [
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
    lastVerified: '2026-10-03',
    verificationNote: '[VERIFY] Confirm current rate and enlisted-stock list with MREIF before quoting.',
  },
  {
    id: 'nhf',
    name: 'National Housing Fund loan',
    institution: 'Federal Mortgage Bank of Nigeria',
    interestRatePct: 6,
    maxTermYears: 30,
    minEquityPct: null,
    eligibility: 'Minimum 6 months of NHF contributions through an accredited PMI.',
    bestFor: 'Contributors seeking the lowest available rate over the longest tenor.',
    constraints: 'Contribution history is a precondition. Processing runs through a PMI, not the bank directly.',
    lastVerified: '2026-10-03',
    verificationNote: '[VERIFY] Confirm the current loan ceiling and equity requirement with FMBN.',
  },
  {
    id: 'diaspora-nhf',
    name: 'Diaspora NHF window',
    institution: 'Federal Mortgage Bank of Nigeria',
    interestRatePct: 9,
    maxTermYears: 10,
    minEquityPct: null,
    eligibility: 'Nigerians resident abroad, contributing to the diaspora NHF window.',
    bestFor: 'Diaspora buyers who want a structured, institutionally supervised route.',
    constraints: 'Shorter tenor than the domestic NHF route, so the monthly obligation is materially higher.',
    lastVerified: '2026-10-03',
    verificationNote: '[VERIFY] Confirm window status, contribution mechanics and ceiling with FMBN.',
  },
  {
    id: 'pmi',
    name: 'Primary mortgage institution facility',
    institution: 'Licensed PMIs',
    interestRatePct: null,
    maxTermYears: 20,
    minEquityPct: 20,
    eligibility: 'Varies by institution. Income verification and title acceptable to the lender.',
    bestFor: 'Buyers whose property falls outside enlisted stock.',
    constraints: 'Rates are institution-specific and move. Compare at least three before committing.',
    lastVerified: '2026-10-03',
    verificationNote: '[VERIFY] Rates are institution-specific - obtain written offers, not indications.',
  },
  {
    id: 'commercial',
    name: 'Commercial bank mortgage',
    institution: 'Deposit money banks',
    interestRatePct: null,
    maxTermYears: 15,
    minEquityPct: 25,
    eligibility: 'Strong, documented income. Bank-acceptable title and valuation.',
    bestFor: 'Higher-value transactions that need speed rather than the lowest rate.',
    constraints: 'Materially the most expensive route over the life of the facility.',
    lastVerified: '2026-10-03',
    verificationNote: '[VERIFY] Obtain a written offer letter including all fees before comparison.',
  },
  {
    id: 'developer',
    name: 'Developer payment plan',
    institution: 'Developer-financed',
    interestRatePct: null,
    maxTermYears: 3,
    minEquityPct: 30,
    eligibility: 'Set by the developer. Usually no formal credit assessment.',
    bestFor: 'Buyers who can clear the balance within a short window.',
    constraints:
      'Not a mortgage and usually not regulated as credit. The implied cost is embedded in the price '
      + 'rather than stated as a rate, so it must be computed before comparison. Default terms are '
      + 'commonly severe. Read the forfeiture clause.',
    lastVerified: '2026-10-03',
  },
];

/** Level monthly payment on an amortizing facility. */
export function monthlyRepayment(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export interface RouteComparison {
  route: FinancingRoute;
  eligible: boolean;
  ineligibleReason?: string;
  equityRequiredNGN: number;
  principalNGN: number;
  monthlyRepaymentNGN: number | null;
  totalRepayableNGN: number | null;
  totalInterestNGN: number | null;
}

/**
 * Compare routes on total cost of credit. Where a route publishes no rate, the
 * monetary columns return null rather than a guess - an invented rate in a client
 * comparison is a misrepresentation, not a convenience.
 */
export function compareRoutes(input: {
  propertyValueNGN: number;
  equityContributionPct: number;
  termYears: number;
  isDiaspora?: boolean;
  isNhfContributor?: boolean;
}): RouteComparison[] {
  return financingRoutes.map((route) => {
    const equityPct = Math.max(input.equityContributionPct, route.minEquityPct ?? 0);
    const equityRequiredNGN = (input.propertyValueNGN * equityPct) / 100;
    const principalNGN = input.propertyValueNGN - equityRequiredNGN;
    const years = Math.min(input.termYears, route.maxTermYears ?? input.termYears);

    let eligible = true;
    let ineligibleReason: string | undefined;
    if (route.id === 'nhf' && !input.isNhfContributor) {
      eligible = false;
      ineligibleReason = 'Requires at least six months of NHF contributions through an accredited PMI.';
    }
    if (route.id === 'diaspora-nhf' && !input.isDiaspora) {
      eligible = false;
      ineligibleReason = 'Available only to Nigerians resident abroad.';
    }

    const monthly = route.interestRatePct == null
      ? null
      : monthlyRepayment(principalNGN, route.interestRatePct, years);

    return {
      route,
      eligible,
      ineligibleReason,
      equityRequiredNGN,
      principalNGN,
      monthlyRepaymentNGN: monthly,
      totalRepayableNGN: monthly == null ? null : monthly * years * 12,
      totalInterestNGN: monthly == null ? null : monthly * years * 12 - principalNGN,
    };
  });
}
