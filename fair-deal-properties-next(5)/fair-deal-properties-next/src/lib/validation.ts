import { z } from 'zod';

/**
 * Request validation for every public write endpoint.
 *
 * Validation is a data protection control, not only an input-quality one. NDPA 2023
 * s.24(1)(c) requires that personal data be adequate, relevant and limited to what is
 * necessary for the purpose of processing. An endpoint that accepts an arbitrary
 * payload cannot demonstrate that limitation. Each schema below is .strict(), so an
 * unexpected field is rejected rather than silently stored.
 */

const name = z.string().trim().min(2, 'Name is required').max(120);
const email = z.string().trim().toLowerCase().email('A valid email address is required').max(160);
const phone = z.string().trim().min(7).max(25)
  .regex(/^[+0-9()\s-]+$/, 'Phone may contain digits, spaces, +, - and ( ) only');
const message = z.string().trim().min(10, 'Please give us a little more detail').max(4000);

/** Explicit, unbundled, affirmative consent. GAID 2025 does not accept a pre-ticked box. */
const consent = z.literal(true, { message: 'Consent is required before we may process this request' });

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional(),
  subject: z.string().trim().max(160).optional(),
  interest: z.enum(['buying', 'selling', 'financing', 'diaspora', 'developer',
                    'inspection', 'assurance', 'other']).default('other'),
  message,
  consent,
}).strict();

export const enquirySchema = z.object({
  name,
  email,
  phone: phone.optional(),
  propertyTitle: z.string().trim().min(2).max(200),
  propertyPrice: z.string().trim().max(60).optional(),
  verificationStatus: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  financingRequired: z.boolean().default(false),
  consent,
}).strict();

export const alertSchema = z.object({
  email,
  cities: z.array(z.enum(['abuja', 'lagos', 'ogun', 'nationwide'])).min(1).max(4),
  propertyTypes: z.array(z.enum(['residential', 'commercial', 'land'])).max(3).default([]),
  maxPriceMillionsNGN: z.number().positive().max(100000).optional(),
  mortgageEligibleOnly: z.boolean().default(false),
  consent,
}).strict();

export const newsletterSchema = z.object({
  email,
  name: name.optional(),
  consent,
}).strict();

export const inspectionRequestSchema = z.object({
  name,
  email,
  phone,
  propertyReference: z.string().trim().min(2).max(200),
  address: z.string().trim().max(400).optional(),
  location: z.string().trim().min(2).max(200),
  scope: z.enum(['standard', 'boundary', 'structural', 'progress', 'handover']),
  preferredDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional(),
  notes: z.string().trim().max(2000).optional(),
  consent,
}).strict();

/**
 * Data subject request.
 *
 * NDPA 2023 s.34 confers the rights. It sets NO numeric deadline: s.34(1) requires the
 * controller to act "without constraint or unreasonable delay" and s.34(1)(d) and
 * s.34(2) use "without undue delay". GAID 2025 sets no general deadline either - the
 * fixed periods in Article 39 run against the Commission, not against the controller.
 *
 * The acknowledgement and response periods this application applies are therefore
 * Fair Deal Properties' own published service commitments, and are described as such.
 * They are recorded on the server rather than trusted from the client because a
 * commitment the firm cannot evidence is a commitment it cannot defend.
 */
export const dsrSchema = z.object({
  name,
  email,
  phone: phone.optional(),
  rightInvoked: z.enum([
    'access', 'rectification', 'erasure', 'restriction', 'portability',
    'objection', 'withdraw-consent', 'automated-decision', 'information', 'complaint',
  ]),
  relationship: z.enum(['client', 'prospective-client', 'website-visitor',
                        'vendor', 'employee', 'other']),
  details: z.string().trim().min(10).max(4000),
  identityDeclaration: z.literal(true, {
    message: 'You must confirm that the request relates to your own personal data',
  }),
}).strict();

/** Site notice and grievance (SNAG) - GAID 2025 Article 40. */
export const snagSchema = z.object({
  name: name.optional(),
  email,
  category: z.enum(['data-protection', 'listing-accuracy', 'conduct',
                    'service-quality', 'fees', 'other']),
  subject: z.string().trim().min(3).max(200),
  details: z.string().trim().min(10).max(4000),
  anonymous: z.boolean().default(false),
}).strict();

export const mortgageCompareSchema = z.object({
  propertyValueNGN: z.number().positive().max(100_000_000_000),
  equityContributionPct: z.number().min(0).max(100),
  termYears: z.number().int().min(1).max(40),
  monthlyIncomeNGN: z.number().positive().max(1_000_000_000).optional(),
  isDiaspora: z.boolean().default(false),
  isNhfContributor: z.boolean().default(false),
}).strict();

export type ContactInput = z.infer<typeof contactSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type AlertInput = z.infer<typeof alertSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type InspectionRequestInput = z.infer<typeof inspectionRequestSchema>;
export type DsrInput = z.infer<typeof dsrSchema>;
export type SnagInput = z.infer<typeof snagSchema>;
export type MortgageCompareInput = z.infer<typeof mortgageCompareSchema>;
