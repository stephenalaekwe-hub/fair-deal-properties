import { NextResponse } from 'next/server';
import { getScrapedLogs } from '@/lib/scrapedStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const logs = getScrapedLogs();
  return NextResponse.json({ ok: true, data: logs });
}
