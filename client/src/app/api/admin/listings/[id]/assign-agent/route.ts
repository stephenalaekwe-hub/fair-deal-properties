import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const agentName = body.agentName || null;
    const agentId = body.agentId || null;

    const p = getDbPool();
    if (p) {
      await p.query(
        `UPDATE listings
         SET assigned_agent = $2, assigned_agent_id = $3, updated_at = now()
         WHERE id = $1`,
        [id, agentName, agentId]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, agentName, agentId, message: 'Agent assigned to listing successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:listings:assign] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to assign agent' },
      { status: 500 }
    );
  }
}
