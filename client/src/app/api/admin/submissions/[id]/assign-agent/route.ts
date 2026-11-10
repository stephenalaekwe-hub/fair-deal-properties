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
      // If agentName not provided, look up from users table
      if (agentId && !agentName) {
        try {
          const userRes = await p.query(`SELECT name FROM users WHERE id::text = $1`, [agentId]);
          if (userRes.rows[0]) {
            agentName = userRes.rows[0].name;
          }
        } catch (e) {
          console.warn('[fdp:assign-agent] Could not lookup user name:', e);
        }
      }

      // Ensure columns exist on submissions table
      try {
        await p.query(`
          ALTER TABLE submissions 
          ADD COLUMN IF NOT EXISTS assigned_agent text,
          ADD COLUMN IF NOT EXISTS assigned_agent_id text,
          ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
        `);
      } catch (e) {
        // Table might already have them or lack permissions, ignore
      }

      // Update both direct columns and payload jsonb for bulletproof persistence
      await p.query(
        `UPDATE submissions
         SET assigned_agent = $2, 
             assigned_agent_id = $3,
             updated_at = now(),
             payload = jsonb_set(
               jsonb_set(COALESCE(payload, '{}'::jsonb), '{assignedAgent}', to_jsonb(COALESCE($2, ''))),
               '{assignedAgentId}', to_jsonb(COALESCE($3, ''))
             )
         WHERE id::text = $1 OR reference = $1`,
        [id, agentName, agentId]
      );
    }

    return NextResponse.json({
      ok: true,
      data: { id, agentName, agentId, message: 'Agent assigned to submission successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:submissions:assign] Error:', err);
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
