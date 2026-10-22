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
export type ListingSource = 'fdp' | 'developer' | 'mreif' | 'fhf' | 'fha' | 'fmbn' | 'pmi' | 'offmarket';
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
export declare const INSPECTION_PIPELINE_STAGES: InspectionStepInfo[];
export interface InspectionRecord {
    id: string;
    reference: string;
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
export type SubmissionCollection = 'contact' | 'enquiry' | 'alert' | 'newsletter' | 'inspection' | 'dsr' | 'snag';
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
    targetReference: string;
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
//# sourceMappingURL=index.d.ts.map