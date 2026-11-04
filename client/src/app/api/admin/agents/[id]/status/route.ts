import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';
import { updateTestAgentStatus } from '@/lib/agentsStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleStatusUpdate(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const active = Boolean(body.active);

    const p = getDbPool();
    if (p) {
      try {
        const result = await p.query(
          `UPDATE users 
           SET active = $2, updated_at = now() 
           WHERE id::text = $1 OR email = $1
           RETURNING id, name, email, role, active`,
          [id, active]
        );

        if (result.rowCount && result.rowCount > 0) {
          // Also sync test agent store if it happens to be a test agent
          updateTestAgentStatus(id, active);
          return NextResponse.json({
            ok: true,
            data: { 
              id, 
              active, 
              user: result.rows[0], 
              message: `Agent account ${active ? 'activated' : 'deactivated'} successfully.` 
            },
          });
        }
      } catch (dbErr: any) {
        console.warn('[fdp:admin:agents:status] DB update warning, checking test agent store:', dbErr?.message || dbErr);
      }
    }

    // Fallback to in-memory test agents roster
    const testUpdated = updateTestAgentStatus(id, active);
    if (testUpdated) {
      return NextResponse.json({
        ok: true,
        data: {
          id,
          active,
          user: testUpdated,
          message: `Agent account ${active ? 'activated' : 'deactivated'} successfully.`,
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: 'Agent account not found in system.' },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('[fdp:admin:agents:status] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update agent status' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleStatusUpdate(req, params);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleStatusUpdate(req, params);
}
