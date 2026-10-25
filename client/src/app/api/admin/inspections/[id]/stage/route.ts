import { NextResponse } from 'next/server';
import { updateLiveInspectionStage } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stage, notes } = body;

    if (!stage || stage < 1 || stage > 9) {
      return NextResponse.json({ ok: false, error: 'Stage must be between 1 and 9' }, { status: 400 });
    }

    const updated = await updateLiveInspectionStage(id, Number(stage), notes);
    return NextResponse.json({ ok: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
