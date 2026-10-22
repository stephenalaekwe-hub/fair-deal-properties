// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - SHARED TYPES & MODELS
// ══════════════════════════════════════════════════════════════════════════════

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  active: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type ListingSource =
  | 'fdp'
  | 'developer'
  | 'mreif'
  | 'fhf'
  | 'fha'
  | 'fmbn'
  | 'pmi'
  | 'offmarket';

export type PropertyType = 'residential' | 'commercial' | 'land';
export type City = 'abuja' | 'lagos' | 'ogun' | 'nationwide';

export interface Listing {
  id?: string;
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
  assignedAgentId?: string | null;
  assignedAgent?: User | null;
  scrapedSourceUrl?: string | null;
  isLiveScraped?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type InspectionStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface InspectionStepInfo {
  stage: InspectionStage;
  title: string;
  description: string;
}

export const INSPECTION_PIPELINE_STAGES: InspectionStepInfo[] = [
  { stage: 1, title: 'Instruction & Scope', description: 'Mandate signed, scope agreed and site instructions confirmed.' },
  { stage: 2, title: 'Title & Registry Search', description: 'Deed search, AGIS / Lands Bureau verification and encumbrance check.' },
  { stage: 3, title: 'Survey & Cadastral Verification', description: 'Coordinates cross-referenced against master cadastral plans.' },
  { stage: 4, title: 'Physical Inspection Mobilised', description: 'Field inspection scheduled and verified field officer dispatched.' },
  { stage: 5, title: 'On-Site Examination', description: 'Physical structural survey, boundary tagging, multi-aspect photo capture.' },
  { stage: 6, title: 'Valuation & Cost-to-Complete', description: 'Market valuation, bill of quantities and snag analysis compiled.' },
  { stage: 7, title: 'Legal & Risk Review', description: 'Planning compliance, community lien checks and litigation status cleared.' },
  { stage: 8, title: 'Comprehensive Dossier Produced', description: 'Full verified report sealed with time-stamped visual audit trail.' },
  { stage: 9, title: 'Dossier Issued & Debrief', description: 'Completed inspection pack delivered securely to principal.' },
];

export interface InspectionRecord {
  id: string;
  reference: string; // e.g. FDP-INS-2026-001
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyTitle: string;
  propertyLocation: string;
  stage: InspectionStage;
  assignedAgentId?: string | null;
  assignedAgent?: User | null;
  officerName?: string;
  scheduledDate?: string;
  reportUrl?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type SubmissionCollection =
  | 'contact'
  | 'enquiry'
  | 'alert'
  | 'newsletter'
  | 'inspection'
  | 'dsr'
  | 'snag';

export interface Submission {
  id: string;
  reference: string;
  collection: SubmissionCollection;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  payload: Record<string, unknown>;
  dueAt?: Date | string;
  closedAt?: Date | string;
  closedBy?: string;
  outcome?: string;
  assignedAgentId?: string | null;
  assignedAgent?: User | null;
  createdAt: Date | string;
}

export interface FinancingRoute {
  id: string;
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
  sourceUrl?: string;
  isAutoSynced?: boolean;
}

export interface ScrapedPriceLog {
  id: string;
  sourceName: string;
  sourceUrl: string;
  targetType: 'LISTING' | 'MORTGAGE_RATE';
  targetReference: string; // slug or financing route id
  oldValue?: string | number | null;
  newValue: string | number;
  status: 'DETECTED' | 'APPLIED' | 'REJECTED';
  notes?: string;
  createdAt: Date | string;
  appliedAt?: Date | string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'LEAD' | 'INSPECTION' | 'PRICE_ALERT' | 'SYSTEM';
  read: boolean;
  link?: string;
  createdAt: Date | string;
}
