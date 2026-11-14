import { NextResponse } from 'next/server';
import { updateLiveListing } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleAssign(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const agentName = body.agentName || null;
    const agentId = body.agentId || null;

    await updateLiveListing(decodeURIComponent(id), {
      assignedAgentId: agentId,
      assignedAgentName: agentName,
    });

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
