import { NextResponse } from 'next/server';
import { applyScrapedLog } from '@/lib/scrapedStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applied = await applyScrapedLog(id);
    if (!applied) {
      return NextResponse.json(
        { ok: false, error: 'Telemetry log ID not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: applied,
      message: 'Detected rate successfully applied and published to financing comparator.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to apply rate' },
      { status: 500 }
    );
  }
}
