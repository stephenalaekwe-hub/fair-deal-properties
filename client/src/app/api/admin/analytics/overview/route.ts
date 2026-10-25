import { NextResponse } from 'next/server';
import { getLiveAnalyticsOverview } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getLiveAnalyticsOverview();
  return NextResponse.json({ ok: true, data: stats });
}
