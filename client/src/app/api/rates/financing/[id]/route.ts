import { NextResponse } from 'next/server';
import { updateLiveFinancingRoute } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleUpdateRate(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateLiveFinancingRoute(id, {
      name: body.name,
      institution: body.institution,
      interestRatePct: body.interestRatePct !== undefined && body.interestRatePct !== null && body.interestRatePct !== '' 
        ? parseFloat(body.interestRatePct) 
        : null,
      maxTermYears: body.maxTermYears !== undefined && body.maxTermYears !== null && body.maxTermYears !== ''
        ? parseInt(body.maxTermYears, 10)
        : null,
      minEquityPct: body.minEquityPct !== undefined && body.minEquityPct !== null && body.minEquityPct !== ''
        ? parseFloat(body.minEquityPct)
        : null,
      verificationNote: body.verificationNote,
      lastVerified: body.lastVerified || new Date().toISOString().slice(0, 10),
    });

    return NextResponse.json({
      ok: true,
      data: updated,
      message: 'Financing route rate updated and published successfully.',
    });
  } catch (err: any) {
    console.error('[fdp:api:rates:update] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update financing route rate.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateRate(req, params);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateRate(req, params);
}
