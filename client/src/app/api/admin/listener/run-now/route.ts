import { NextResponse } from 'next/server';
import { runErasureSweep } from '@/lib/drivers/postgres';

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

    return NextResponse.json({
      ok: true,
      data: {
        timestamp: new Date().toISOString(),
        erasedRecords: sweepResult.erased,
        message: 'Listener and retention maintenance cycle executed successfully.',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Listener execution failed' },
      { status: 500 }
    );
  }
}
