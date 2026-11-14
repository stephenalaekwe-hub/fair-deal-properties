import { NextResponse } from 'next/server';
import { getScrapedLogsAsync } from '@/lib/scrapedStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const logs = await getScrapedLogsAsync();
  return NextResponse.json(
    { ok: true, data: logs },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
