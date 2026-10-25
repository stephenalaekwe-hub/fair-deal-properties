import { NextResponse } from 'next/server';
import { inspectionRequestSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';
import { inspectionPipeline } from '@/data/pipeline';
import { getDbPool, getLiveInspectionByRef, getLiveInspections } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/inspections - query inspection by ref or list all */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (ref) {
    const inspection = await getLiveInspectionByRef(ref);
    if (!inspection) {
      return NextResponse.json({ ok: false, error: 'Inspection reference not found' }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      data: {
        ...inspection,
        stageName: inspectionPipeline[Math.max(0, Math.min(inspection.stage - 1, inspectionPipeline.length - 1))]?.t || 'In Progress',
        stageDescription: inspectionPipeline[Math.max(0, Math.min(inspection.stage - 1, inspectionPipeline.length - 1))]?.d || '',
      },
    });
  }

  const all = await getLiveInspections();
  return NextResponse.json({ ok: true, data: all });
}

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
    const p = getDbPool();
    if (p) {
      await p.query(
        `INSERT INTO inspections (reference, client_name, client_email, client_phone, property_title, property_location, stage, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (reference) DO NOTHING`,
        [
          rec.reference,
          parsed.data.name,
          parsed.data.email,
          parsed.data.phone,
          parsed.data.propertyReference,
          parsed.data.location,
          1,
          `Scope: ${parsed.data.scope}. Address: ${parsed.data.address || 'N/A'}. Notes: ${parsed.data.notes || ''}`,
        ]
      );
    }
  } catch (err) {
    console.error('[fdp:db] Failed to insert inspection into live database:', err);
  }

  return ok({
    reference: rec.reference,
    receivedAt: rec.receivedAt,
    stage: 1,
    stageName: inspectionPipeline[0]!.t,
    trackingUrl: `/inspections?ref=${rec.reference}`,
    message:
      'Your inspection request has been logged and a reference issued. Scope and fee will be '
      + 'confirmed in writing before any officer is assigned. Track progress with the reference above.',
  }, 201);
}
