import type { StoredRecord } from './store';

/**
 * Outbound notification adapter.
 *
 * Provider-agnostic by design. The default "console" provider logs rather than sends,
 * so the application runs without credentials. Supply FDP_MAIL_PROVIDER and
 * FDP_MAIL_API_KEY to activate a real provider and implement the branch below.
 *
 * Note on scope: this notifies the firm that a submission arrived. It does not send
 * anything to the data subject beyond an acknowledgement, and it must never be used
 * to transmit a verification finding, an assurance conclusion or anything readable as
 * a valuation. Those leave the firm only over a named human signature.
 */

export interface Notification {
  to: string;
  subject: string;
  body: string;
}

export function composeInternalAlert(rec: StoredRecord): Notification {
  const inbox =
    rec.collection === 'dsr' || rec.collection === 'snag'
      ? process.env.FDP_DPO_INBOX ?? 'info@fairdealng.com'
      : rec.collection === 'inspection'
        ? process.env.FDP_INSPECTION_INBOX ?? 'info@fairdealng.com'
        : process.env.FDP_ENQUIRY_INBOX ?? 'info@fairdealng.com';

  const due = rec.dueAt ? `\nRESPONSE DUE: ${rec.dueAt.slice(0, 10)}` : '';

  return {
    to: inbox,
    subject: `[${rec.reference}] New ${rec.collection} submission`,
    body:
      `Reference: ${rec.reference}\n` +
      `Received:  ${rec.receivedAt}${due}\n` +
      `Channel:   website\n\n` +
      JSON.stringify(rec.payload, null, 2),
  };
}

export async function notify(n: Notification): Promise<{ sent: boolean; provider: string }> {
  const provider = process.env.FDP_MAIL_PROVIDER ?? 'console';

  if (provider === 'console' || !process.env.FDP_MAIL_API_KEY) {
    // eslint-disable-next-line no-console
    console.info('[fdp:notify]', n.to, '|', n.subject);
    return { sent: false, provider: 'console' };
  }

  // Implement the contracted provider here. Example shape:
  //
  //   const res = await fetch('https://api.<provider>.com/send', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.FDP_MAIL_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ from: process.env.FDP_MAIL_FROM, to: n.to,
  //                            subject: n.subject, text: n.body }),
  //   });
  //   return { sent: res.ok, provider };
  //
  // A processor assessment and a data processing agreement must be executed with the
  // provider BEFORE this path is enabled. Engaging a processor without them is an
  // unlawful disclosure of personal data under the NDPA 2023, not a procurement lapse.

  // eslint-disable-next-line no-console
  console.warn('[fdp:notify] provider configured but not implemented:', provider);
  return { sent: false, provider };
}
