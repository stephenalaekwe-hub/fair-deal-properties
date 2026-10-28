import { contactSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/contact - general consultation and enquiry form. */
export async function POST(req: Request) {
  const parsed = await readBody(req, contactSchema, 'contact');
  if ('response' in parsed) return parsed.response;

  const rec = await record('contact', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  auditLog({
    event: 'contact.received',
    reference: rec.reference,
    lawfulBasis: 'consent',
    retentionMonths: RETENTION['contact'].months,
    retentionBasis: RETENTION['contact'].basis,
  });

  await notify(composeInternalAlert(rec));

  // Submissions are securely recorded to PostgreSQL via store.put above

  return ok({
    reference: rec.reference,
    receivedAt: rec.receivedAt,
    message:
      'Your enquiry has been received. A member of the firm will respond within one business day. '
      + 'Please quote the reference above in any follow-up.',
  }, 201);
}
