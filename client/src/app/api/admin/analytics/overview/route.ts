import { NextResponse } from 'next/server';
import { getLiveAnalyticsOverview } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId') || undefined;
  const stats = await getLiveAnalyticsOverview(agentId);
  return NextResponse.json({ ok: true, data: stats });
}
