import { NextResponse } from 'next/server';
import { runErasureSweep } from '@/lib/drivers/postgres';
import { refreshScrapedLogs } from '@/lib/scrapedStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let sweepResult = { erased: 0, references: [] as string[] };
    try {
      sweepResult = await runErasureSweep();
    } catch (sweepErr: any) {
      console.warn('[fdp:listener] Retention sweep warning:', sweepErr?.message || sweepErr);
    }

    const updatedLogs = refreshScrapedLogs();

    return NextResponse.json({
      ok: true,
      data: {
        timestamp: new Date().toISOString(),
        erasedRecords: sweepResult.erased,
        scrapedLogsCount: updatedLogs.length,
        message: 'Listener scan completed: telemetry across FMBN, NMRC, MREIF, and FHA synchronized.',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Listener execution failed' },
      { status: 500 }
    );
  }
}
