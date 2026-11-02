import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleUpdateListing(
  req: Request,
  params: Promise<{ id: string }>
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
             price_millions_ngn = COALESCE($4, price_millions_ngn),
             image = COALESCE($5, image),
             verification_status = COALESCE($6, verification_status),
             updated_at = now()
         WHERE id::text = $1 OR slug = $1`,
        [
          id,
          body.title || null,
          body.priceDisplay || null,
          body.priceMillionsNGN !== undefined && body.priceMillionsNGN !== null ? body.priceMillionsNGN : null,
          body.image || null,
          body.verificationStatus || null,
        ]
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateListing(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateListing(req, params);
}
