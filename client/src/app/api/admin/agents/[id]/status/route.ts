import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const active = Boolean(body.active);

    const p = getDbPool();
    if (p) {
      await p.query(
        `UPDATE agents SET active = $2, updated_at = now() WHERE id = $1`,
        [id, active]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, active, message: 'Agent status updated successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:agents:status] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update agent status' },
      { status: 500 }
    );
  }
}
