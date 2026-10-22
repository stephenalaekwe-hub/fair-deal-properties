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

  try {
    await fetch('http://localhost:5000/api/v1/submissions/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: parsed.data.email,
        payload: {
          ...parsed.data,
          reference: rec.reference,
        },
      }),
    });
  } catch (err) {
    console.error('Failed to forward newsletter to backend db:', err);
  }

  return ok({
    reference: rec.reference,
    message: 'Subscription recorded. Every issue carries a one-click unsubscribe.',
  }, 201);
}
