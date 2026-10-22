import type { Collection } from './store';

/**
 * Retention schedule.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GOVERNING RULE
 *
 * GAID 2025 Article 49(3): where no time limit is set by law, storage for the
 * processing purpose lapses NOT LATER THAN SIX (6) CALENDAR MONTHS after the original
 * purpose is accomplished. Six months is therefore the default, not a floor.
 *
 * GAID 2025 Article 49(4) permits retention beyond that period, with appropriate
 * safeguards, to defend a legal claim or for due diligence, subject to section 24 of
 * the NDP Act. Every entry below that exceeds six months names its Article 49(4)
 * justification. An entry without one is not defensible.
 *
 * NDPA 2023 s.24(1)(d): personal data shall be retained for no longer than is
 * necessary for the lawful basis on which it was collected or further processed.
 * NDPA 2023 s.24(3): the controller shall demonstrate accountability for the
 * principles. This file is part of that demonstration.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * [VERIFY] The six-year figures below assume a six-year limitation period for an
 * action founded on simple contract. Limitation periods in Nigeria are set by state
 * Limitation Laws and the Limitation Act for the FCT, and they are not uniform.
 * Confirm the period applicable to Fair Deal Properties Ltd in the FCT and in each
 * state where it transacts, and adjust before this schedule is relied on.
 * [PRINCIPAL SIGN-OFF REQUIRED]
 */

export type RetentionTrigger =
  | 'purpose-accomplished'   // clock starts when the matter is closed
  | 'consent-withdrawn'      // clock starts when the data subject withdraws
  | 'record-created';        // clock starts at creation

export interface RetentionRule {
  collection: Collection;
  months: number;
  trigger: RetentionTrigger;
  /** What the period is measured from, in words a reviewer can check. */
  measuredFrom: string;
  /** The instrument that sets or permits this period. */
  basis: string;
  /**
   * Required where months > 6. GAID Article 49(4) permits a longer period only to
   * defend a legal claim or for due diligence. State which, and why.
   */
  article49_4Justification?: string;
}

const SIX_MONTH_DEFAULT = 'GAID 2025 Article 49(3) - six calendar months after the purpose is accomplished.';

export const RETENTION: Record<Collection, RetentionRule> = {
  contact: {
    collection: 'contact',
    months: 6,
    trigger: 'purpose-accomplished',
    measuredFrom: 'the date the enquiry is answered and closed, or the date of last contact if no engagement follows',
    basis: SIX_MONTH_DEFAULT,
  },

  enquiry: {
    collection: 'enquiry',
    months: 6,
    trigger: 'purpose-accomplished',
    measuredFrom: 'the date the listing enquiry is answered and closed, or the listing is withdrawn',
    basis: SIX_MONTH_DEFAULT,
  },

  alert: {
    collection: 'alert',
    months: 6,
    trigger: 'consent-withdrawn',
    measuredFrom: 'the date the data subject withdraws the alert, or the date the alert is deactivated for non-engagement',
    basis: SIX_MONTH_DEFAULT
      + ' The purpose subsists while the consent subsists, so the clock starts on withdrawal.',
  },

  newsletter: {
    collection: 'newsletter',
    months: 6,
    trigger: 'consent-withdrawn',
    measuredFrom: 'the date the data subject unsubscribes',
    basis: SIX_MONTH_DEFAULT
      + ' The purpose subsists while the consent subsists, so the clock starts on unsubscribe.',
  },

  inspection: {
    collection: 'inspection',
    months: 72,
    trigger: 'purpose-accomplished',
    measuredFrom: 'the date the inspection record is issued to the client',
    basis: 'GAID 2025 Article 49(4), read with NDPA 2023 s.24(1)(d).',
    article49_4Justification:
      'Defence of a legal claim. The inspection record is the evidence base for a professional '
      + 'engagement on which a client makes a capital commitment. If the firm is sued over what it '
      + 'recorded, destroying the record would leave it unable to defend the claim. Retained for the '
      + 'limitation period applicable to an action founded on simple contract. [VERIFY - see header]',
  },

  dsr: {
    collection: 'dsr',
    months: 72,
    trigger: 'record-created',
    measuredFrom: 'the date the request is received',
    basis: 'GAID 2025 Article 49(4), read with NDPA 2023 s.24(3).',
    article49_4Justification:
      'Defence of a legal claim and demonstration of accountability. A record that a request was '
      + 'received, what was decided and when, is the only evidence the firm has that it honoured the '
      + 'request. Erasing it on a six-month cycle would destroy the proof of compliance with the very '
      + 'right being exercised. Note the narrowness: what is retained is the fact, date, right '
      + 'invoked and outcome - not the substantive personal data disclosed in response, which follows '
      + 'the schedule of the collection it came from.',
  },

  snag: {
    collection: 'snag',
    months: 72,
    trigger: 'record-created',
    measuredFrom: 'the date the notice is received',
    basis: 'GAID 2025 Article 49(4), read with GAID 2025 Article 40(6).',
    article49_4Justification:
      'Defence of a legal claim and regulatory accountability. Article 40(6) requires the controller '
      + 'to communicate its decision on a SNAG to the Commission, and the Commission may take '
      + 'executive notice of an apparently unresolved SNAG and open a direct investigation. The firm '
      + 'must be able to produce the notice and its decision on demand.',
  },
};

/** Due date for erasure, computed from the trigger date supplied by the caller. */
export function erasureDueAt(collection: Collection, triggerDate: Date): Date {
  const rule = RETENTION[collection];
  const d = new Date(triggerDate);
  d.setMonth(d.getMonth() + rule.months);
  return d;
}

/** Entries that exceed the Article 49(3) default and therefore need a justification. */
export function extendedRetention(): RetentionRule[] {
  return Object.values(RETENTION).filter((r) => r.months > 6);
}
