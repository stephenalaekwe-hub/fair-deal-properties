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
    const officerName = body.officerName || body.agentName || null;
    const agentId = body.agentId || null;

    const p = getDbPool();
    if (p) {
      await p.query(
        `UPDATE inspections
         SET officer_name = $2, agent_id = $3, updated_at = now()
         WHERE id = $1`,
        [id, officerName, agentId]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, officerName, agentId, message: 'Agent assigned to inspection successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:inspections:assign] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to assign agent' },
      { status: 500 }
    );
  }
}
