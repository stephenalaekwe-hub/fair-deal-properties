import { NextResponse } from 'next/server';
import { updateLiveInspectionStage } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleStageUpdate(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stage, notes, officerName, reportUrl, markStepDone, assignedAgentId, assignedAgentName } = body;

    if (!stage || stage < 1 || stage > 9) {
      return NextResponse.json({ ok: false, error: 'Stage must be between 1 and 9' }, { status: 400 });
    }

    const updated = await updateLiveInspectionStage(
      id,
      Number(stage),
      notes,
      officerName,
      reportUrl,
      markStepDone,
      assignedAgentId,
      assignedAgentName
    );
    return NextResponse.json({ ok: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleStageUpdate(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleStageUpdate(req, params);
}
