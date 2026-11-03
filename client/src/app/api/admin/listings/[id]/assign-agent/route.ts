import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleAssign(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();
    let agentName = body.agentName || null;
    const agentId = body.agentId || null;

    const p = getDbPool();
    if (p) {
      if (agentId && !agentName) {
        try {
          const uRes = await p.query(`SELECT name FROM users WHERE id::text = $1`, [agentId]);
          if (uRes.rows[0]) agentName = uRes.rows[0].name;
        } catch (e) {}
      }

      try {
        await p.query(`
          ALTER TABLE listings 
          ADD COLUMN IF NOT EXISTS assigned_agent text,
          ADD COLUMN IF NOT EXISTS assigned_agent_id text;
        `);
      } catch (e) {}

      await p.query(
        `UPDATE listings
         SET assigned_agent = $2, assigned_agent_id = $3, updated_at = now()
         WHERE id::text = $1 OR slug = $1`,
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleAssign(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleAssign(req, params);
}
