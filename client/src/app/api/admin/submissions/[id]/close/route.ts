import { NextResponse } from 'next/server';
import { closeLiveSubmission } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleCloseOrOutcome(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { outcome, closedBy, status = 'closed' } = body;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = token ? verifyToken(token) : null;

    const officer = closedBy || user?.name || 'Administrator';
    const updated = await closeLiveSubmission(id, outcome || '', officer, status);

    return NextResponse.json({
      ok: true,
      data: updated,
      message: 'Resolution follow-up notes and status successfully saved.',
    });
  } catch (err: any) {
    console.error('[fdp:submissions:close] Error saving outcome:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleCloseOrOutcome(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleCloseOrOutcome(req, params);
}
