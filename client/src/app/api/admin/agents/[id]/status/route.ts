import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

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
    if (!p) {
      throw new Error('Database connection not available');
    }

    // Agents and staff are stored in the 'users' table
    const result = await p.query(
      `UPDATE users 
       SET active = $2, updated_at = now() 
       WHERE id::text = $1 OR email = $1
       RETURNING id, name, email, role, active`,
      [id, active]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: 'Agent account not found in system.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { 
        id, 
        active, 
        user: result.rows[0], 
        message: `Agent account ${active ? 'activated' : 'deactivated'} successfully.` 
      },
    });
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
