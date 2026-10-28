import { alertSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/alerts - standing instruction to be notified of matching listings. */
export async function POST(req: Request) {
  const parsed = await readBody(req, alertSchema, 'alerts');
  if ('response' in parsed) return parsed.response;

  const rec = await record('alert', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  // Direct marketing consent under GAID 2025 is never bundled with any other
  // permission and must be as easy to withdraw as it was to give.
  auditLog({
    event: 'alert.subscribed',
    reference: rec.reference,
    lawfulBasis: 'consent',
    retentionMonths: RETENTION['alert'].months,
    retentionBasis: RETENTION['alert'].basis,
  });

  await notify(composeInternalAlert(rec));



  return ok({
    reference: rec.reference,
    message:
      'Your alert has been registered. You may withdraw it at any time from any alert email or '
      + 'through the data rights portal, with no effect on any other service.',
    withdrawalRoute: '/data-rights',
  }, 201);
}
