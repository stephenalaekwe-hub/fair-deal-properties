import { newsletterSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/newsletter - market intelligence subscription. */
export async function POST(req: Request) {
  const parsed = await readBody(req, newsletterSchema, 'newsletter');
  if ('response' in parsed) return parsed.response;

  const rec = await record('newsletter', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  auditLog({
    event: 'newsletter.subscribed',
    reference: rec.reference,
    lawfulBasis: 'consent',
    retentionMonths: RETENTION['newsletter'].months,
    retentionBasis: RETENTION['newsletter'].basis,
  });

  await notify(composeInternalAlert(rec));



  return ok({
    reference: rec.reference,
    message: 'Subscription recorded. Every issue carries a one-click unsubscribe.',
  }, 201);
}
