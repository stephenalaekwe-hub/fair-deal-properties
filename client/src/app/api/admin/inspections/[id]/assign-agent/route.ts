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
    let agentName = body.officerName || body.agentName || null;
    const agentId = body.agentId || null;

    const p = getDbPool();
    if (p) {
      // If agentName not provided, look up from users table
      if (agentId && !agentName) {
        try {
          const userRes = await p.query(`SELECT name FROM users WHERE id::text = $1`, [agentId]);
          if (userRes.rows[0]) {
            agentName = userRes.rows[0].name;
          }
        } catch (e) {
          console.warn('[fdp:assign-agent:inspection] Could not lookup user name:', e);
        }
      }

      // Ensure columns exist on inspections table
      try {
        await p.query(`
          ALTER TABLE inspections 
          ADD COLUMN IF NOT EXISTS assigned_agent text,
          ADD COLUMN IF NOT EXISTS assigned_agent_id text,
          ADD COLUMN IF NOT EXISTS agent_id text,
          ADD COLUMN IF NOT EXISTS officer_name text;
        `);
      } catch (e) {}

      // Update inspections table
      await p.query(
        `UPDATE inspections
         SET assigned_agent = $2,
             assigned_agent_id = $3,
             agent_id = $3,
             officer_name = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE officer_name END,
             updated_at = now()
         WHERE id::text = $1 OR reference = $1`,
        [id, agentName, agentId]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, agentName, agentId, officerName: agentName, message: 'Agent assigned to inspection successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:inspections:assign] Error:', err);
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
