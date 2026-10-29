import { NextResponse } from 'next/server';
import { record, type Collection } from '@/lib/store';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';
import { composeInternalAlert, notify } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_COLLECTIONS: Collection[] = [
  'contact', 'enquiry', 'alert', 'newsletter', 'inspection', 'dsr', 'snag'
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    if (!VALID_COLLECTIONS.includes(collection as Collection)) {
      return NextResponse.json({ ok: false, error: `Invalid collection: ${collection}` }, { status: 400 });
    }

    const col = collection as Collection;
    const body = await req.json();

    const rec = await record(col, body.payload || body, {
      userAgent: req.headers.get('user-agent'),
    });

    try {
      auditLog({
        event: `${col}.received`,
        reference: rec.reference,
        lawfulBasis: 'consent',
        retentionMonths: RETENTION[col]?.months ?? 6,
        retentionBasis: RETENTION[col]?.basis ?? 'GAID 2025 Art 49(3)',
      });
    } catch (auditErr: any) {
      console.warn('[fdp:submissions] Audit log non-fatal warning:', auditErr?.message || auditErr);
    }

    try {
      await notify(composeInternalAlert(rec));
    } catch (notifyErr: any) {
      console.warn('[fdp:submissions] Notification non-fatal warning:', notifyErr?.message || notifyErr);
    }

    return NextResponse.json({
      ok: true,
      data: {
        reference: rec.reference,
        receivedAt: rec.receivedAt,
        message: 'Your submission has been securely recorded to the live register.',
      },
    }, { status: 201 });
  } catch (err: any) {
    console.error('[fdp:submissions] Error recording submission:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Submission failed' }, { status: 500 });
  }
}
