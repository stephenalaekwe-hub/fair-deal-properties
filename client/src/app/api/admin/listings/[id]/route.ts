import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const p = getDbPool();
    if (p) {
      await p.query(
        `UPDATE listings
         SET title = COALESCE($2, title),
             price_display = COALESCE($3, price_display),
             verification_status = COALESCE($4, verification_status),
             updated_at = now()
         WHERE id = $1`,
        [id, body.title, body.priceDisplay, body.verificationStatus]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, ...body, message: 'Listing updated successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:listings:update] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update listing' },
      { status: 500 }
    );
  }
}
