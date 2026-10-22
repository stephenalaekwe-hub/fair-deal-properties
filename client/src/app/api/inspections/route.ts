import { inspectionRequestSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';
import { inspectionPipeline } from '@/data/pipeline';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/inspections - request a physical site inspection. */
export async function POST(req: Request) {
  const parsed = await readBody(req, inspectionRequestSchema, 'inspections');
  if ('response' in parsed) return parsed.response;

  const rec = await record('inspection', parsed.data, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  auditLog({
    event: 'inspection.requested',
    reference: rec.reference,
    lawfulBasis: 'contract',
    retentionMonths: RETENTION['inspection'].months,
    retentionBasis: RETENTION['inspection'].basis,
  });

  await notify(composeInternalAlert(rec));

  try {
    await fetch('http://localhost:5000/api/v1/inspections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: parsed.data.name,
        clientEmail: parsed.data.email,
        clientPhone: parsed.data.phone,
        propertyTitle: parsed.data.propertyReference,
        propertyLocation: parsed.data.location,
        preferredDate: parsed.data.preferredDate,
        notes: `Scope: ${parsed.data.scope}. Address: ${parsed.data.address || 'N/A'}. Notes: ${parsed.data.notes || ''}`,
      }),
    });
  } catch (err) {
    console.error('Failed to forward inspection to backend db:', err);
  }

  return ok({
    reference: rec.reference,
    receivedAt: rec.receivedAt,
    stage: 0,
    stageName: inspectionPipeline[0]!.t,
    trackingUrl: `/inspections?ref=${rec.reference}`,
    message:
      'Your inspection request has been logged and a reference issued. Scope and fee will be '
      + 'confirmed in writing before any officer is assigned. Track progress with the reference above.',
  }, 201);
}
