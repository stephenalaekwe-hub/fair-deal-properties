/**
 * Processing-activity audit trail.
 *
 * NDPA 2023 s.24(3) imposes a duty of care in data processing and requires the
 * controller or processor to demonstrate accountability for the principles in the Act.
 * A log recording that a submission was received, under which lawful basis, and when
 * any clock started, is part of that demonstration. It records the event, never the
 * content.
 *
 * Note the distinction this file preserves: a STATUTORY due date is one an instrument
 * sets. A SERVICE due date is one the firm published and must therefore honour, but
 * which no instrument imposes. Conflating the two in a record that a regulator may
 * read is the error this field exists to prevent.
 */

export type LawfulBasis =
  | 'consent'
  | 'contract'
  | 'legal-obligation'
  | 'vital-interest'
  | 'public-interest'
  | 'legitimate-interest';

export interface AuditEvent {
  at: string;
  event: string;
  reference: string;
  lawfulBasis: LawfulBasis;
  /** Retention period and the instrument that sets or permits it - see lib/retention.ts. */
  retentionMonths: number;
  retentionBasis: string;
  /**
   * A deadline imposed by an instrument. Populate ONLY where an instrument sets one.
   * Neither NDPA 2023 s.34 nor GAID 2025 sets a numeric deadline for responding to a
   * data subject request, so this field is left undefined for DSR and SNAG events.
   */
  statutoryDueAt?: string;
  /**
   * A deadline the firm published and must honour, but which no instrument imposes.
   * Breaching it is a service failure and a reputational exposure, not of itself a
   * contravention of the Act.
   */
  serviceDueAt?: string;
}

const trail: AuditEvent[] = [];

export function auditLog(e: Omit<AuditEvent, 'at'>): AuditEvent {
  const event: AuditEvent = { at: new Date().toISOString(), ...e };
  trail.push(event);
  // eslint-disable-next-line no-console
  console.info('[fdp:audit]', JSON.stringify(event));
  return event;
}

/** Exposed for an internal reporting endpoint; never served publicly. */
export function readTrail(): readonly AuditEvent[] {
  return trail;
}
