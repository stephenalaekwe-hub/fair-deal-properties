import { dsrSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dsr - data subject request under the Nigeria Data Protection Act 2023.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ON THE RESPONSE PERIOD - read this before changing the figures below.
 *
 * NDPA 2023 s.34 confers the rights. It sets NO numeric deadline. Section 34(1)
 * requires the controller to act "without constraint or unreasonable delay", and
 * s.34(1)(d) and s.34(2) use "without undue delay" for erasure. GAID 2025 sets no
 * general deadline for responding to a data subject either - the fixed periods in
 * Article 39 (seven days to acknowledge, twenty-one days to reply) run between the
 * Commission and a respondent in a complaint, not between a controller and a data
 * subject.
 *
 * The periods applied here are therefore FAIR DEAL PROPERTIES' OWN PUBLISHED SERVICE
 * COMMITMENTS. They are described to the data subject as commitments, not as statutory
 * entitlements, because telling a data subject that the Act gives them a right the Act
 * does not give is a misstatement of law by the controller about its own obligation.
 *
 * They are nonetheless binding on the firm: a published commitment is relied upon, and
 * a controller that publishes one and misses it has a transparency problem under
 * s.24(1)(a) whatever the Act says about timing.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const ACKNOWLEDGEMENT_BUSINESS_DAYS = 5;
const SERVICE_RESPONSE_DAYS = 30;

export async function POST(req: Request) {
  const parsed = await readBody(req, dsrSchema, 'dsr');
  if ('response' in parsed) return parsed.response;

  const rec = await record('dsr', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
    dueInDays: SERVICE_RESPONSE_DAYS,
  });

  auditLog({
    event: 'dsr.received',
    reference: rec.reference,
    lawfulBasis: 'legal-obligation',
    retentionMonths: RETENTION['dsr'].months,
    retentionBasis: RETENTION['dsr'].basis,
    // No instrument sets a deadline, so statutoryDueAt is deliberately absent.
    serviceDueAt: rec.dueAt,
  });

  // Routed to the Data Protection Officer inbox, not the general enquiry inbox.
  await notify(composeInternalAlert(rec));

  try {
    await fetch('http://localhost:5000/api/v1/submissions/dsr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        payload: {
          ...parsed.data,
          reference: rec.reference,
          serviceDueAt: rec.dueAt,
        },
      }),
    });
  } catch (err) {
    console.error('Failed to forward DSR to backend db:', err);
  }

  return ok({
    reference: rec.reference,
    receivedAt: rec.receivedAt,
    responseDueAt: rec.dueAt,
    responseDueBasis: 'service-commitment',
    rightInvoked: parsed.data.rightInvoked,
    message:
      'Your request has been received and logged. The Nigeria Data Protection Act 2023 requires us '
      + 'to act without undue delay; it does not fix a number of days. We commit to acknowledging '
      + `within ${ACKNOWLEDGEMENT_BUSINESS_DAYS} business days and responding substantively within `
      + `${SERVICE_RESPONSE_DAYS} days, and we hold ourselves to that. There is no charge. If you `
      + 'are not satisfied with our response you may complain to the Nigeria Data Protection '
      + 'Commission.',
    escalation: {
      body: 'Nigeria Data Protection Commission',
      note:
        'You may complain to the Commission at any time, including before we respond. Doing so is '
        + 'not conditional on using this form first.',
    },
  }, 201);
}
