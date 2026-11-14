import { NextResponse } from 'next/server';
import { runErasureSweep } from '@/lib/drivers/postgres';
import { runLivePortalScan } from '@/lib/scrapedStore';

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

    const updatedLogs = await runLivePortalScan();
    const pendingCount = updatedLogs.filter((l) => l.status === 'PENDING_REVIEW').length;

    return NextResponse.json({
      ok: true,
      data: {
        timestamp: new Date().toISOString(),
        erasedRecords: sweepResult.erased,
        scrapedLogsCount: updatedLogs.length,
        pendingReviewCount: pendingCount,
        logs: updatedLogs,
        message: `Live portal & property listener scan completed across FMBN, MREIF, FHF, FHA, and NMRC (${updatedLogs.length} institutional feeds checked, ${pendingCount} awaiting review/sync).`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Listener execution failed' },
      { status: 500 }
    );
  }
}
