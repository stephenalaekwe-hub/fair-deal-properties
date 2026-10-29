import { snagSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Firm service commitment. No instrument fixes a period for a SNAG decision. */
const SERVICE_RESPONSE_DAYS = 30;

/**
 * POST /api/snag - Standard Notice to Address Grievance.
 *
 * GAID 2025 Article 40(2)-(3): a data subject may serve a SNAG on a controller or
 * processor. Serving one is NOT a precondition to complaining to the Commission, and
 * this endpoint says so to the person using it.
 *
 * Article 40(6): the controller must communicate its DECISION on the SNAG to the
 * Commission through the platform the Commission designates. That is an outbound
 * obligation this endpoint cannot discharge on its own - see the handoff note below.
 *
 * Article 40 sets no fixed number of days. The period applied here is the firm's own
 * published commitment. Note the live exposure: the Commission may take executive
 * notice of an apparently unresolved SNAG and open a direct investigation, so the
 * practical cost of silence is higher than the absence of a deadline suggests.
 */
export async function POST(req: Request) {
  const parsed = await readBody(req, snagSchema, 'snag');
  if ('response' in parsed) return parsed.response;

  const rec = await record('snag', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
    dueInDays: SERVICE_RESPONSE_DAYS,
  });

  try {
    auditLog({
      event: 'snag.received',
      reference: rec.reference,
      lawfulBasis: parsed.data.category === 'data-protection' ? 'legal-obligation' : 'legitimate-interest',
      retentionMonths: RETENTION['snag'].months,
      retentionBasis: RETENTION['snag'].basis,
      serviceDueAt: rec.dueAt,
    });
  } catch (err: any) {
    console.warn('[fdp:snag] Audit warning:', err?.message || err);
  }

  try {
    await notify(composeInternalAlert(rec));
  } catch (err: any) {
    console.warn('[fdp:snag] Notify warning:', err?.message || err);
  }



  return ok({
    reference: rec.reference,
    receivedAt: rec.receivedAt,
    responseDueAt: rec.dueAt,
    responseDueBasis: 'service-commitment',
    message:
      'Your notice has been logged and routed. We commit to acknowledging within 5 business days '
      + `and deciding within ${SERVICE_RESPONSE_DAYS} days. Nothing you raise here affects any `
      + 'service you receive from the firm, and you are not required to use this form before '
      + 'complaining to the Nigeria Data Protection Commission.',
    escalation: {
      body: 'Nigeria Data Protection Commission',
      note:
        'Serving this notice is not a precondition to complaining to the Commission. You may do '
        + 'both, or go straight to the Commission.',
    },
  }, 201);
}
