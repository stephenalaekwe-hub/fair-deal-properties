import { NextResponse } from 'next/server';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';
import { inspectionPipeline } from '@/data/pipeline';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body.clientName || body.name || 'Prospective Client').trim();
    const email = (body.clientEmail || body.email || '').trim().toLowerCase();
    const phone = (body.clientPhone || body.phone || '').trim();
    const propertyTitle = (body.propertyTitle || body.propertyReference || 'Property Inspection Request').trim();
    const propertyLocation = (body.propertyLocation || body.location || 'Abuja FCT').trim();
    const notes = body.notes || '';
    const preferredDate = body.preferredDate || '';

    if (!email && !phone) {
      return NextResponse.json(
        { ok: false, error: 'Email or phone number is required to book an inspection.' },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone,
      propertyReference: propertyTitle,
      propertyLocation,
      location: propertyLocation,
      preferredDate,
      notes,
      source: 'web_inspection_request',
    };

    const rec = await record('inspection', payload, {
      userAgent: req.headers.get('user-agent'),
    });

    try {
      auditLog({
        event: 'inspection.requested',
        reference: rec.reference,
        lawfulBasis: 'contract',
        retentionMonths: RETENTION['inspection']?.months ?? 12,
        retentionBasis: RETENTION['inspection']?.basis ?? 'NDPA 2023 s.24',
      });
    } catch (auditErr: any) {
      console.warn('[fdp:inspections] Audit warning:', auditErr?.message || auditErr);
    }

    try {
      await notify(composeInternalAlert(rec));
    } catch (notifyErr: any) {
      console.warn('[fdp:inspections] Notify warning:', notifyErr?.message || notifyErr);
    }

    try {
      const p = getDbPool();
      if (p) {
        await p.query(
          `INSERT INTO inspections (reference, client_name, client_email, client_phone, property_title, property_location, stage, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (reference) DO NOTHING`,
          [
            rec.reference,
            name,
            email,
            phone,
            propertyTitle,
            propertyLocation,
            1,
            notes,
          ]
        );
      }
    } catch (err: any) {
      console.warn('[fdp:inspections] DB insert warning:', err?.message || err);
    }

    return NextResponse.json({
      ok: true,
      data: {
        reference: rec.reference,
        receivedAt: rec.receivedAt,
        stage: 1,
        stageName: inspectionPipeline[0]?.t || 'Request Received',
        trackingUrl: `/inspections?ref=${rec.reference}`,
        message:
          'Your inspection request has been logged and a reference issued. Scope and fee will be '
          + 'confirmed in writing before any officer is assigned. Track progress with the reference above.',
      },
    }, { status: 201 });
  } catch (err: any) {
    console.error('[fdp:inspections:request] Error processing inspection:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to submit inspection request.' },
      { status: 500 }
    );
  }
}
