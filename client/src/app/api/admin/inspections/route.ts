import { NextResponse } from 'next/server';
import { getLiveInspections } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId') || undefined;
  const inspections = await getLiveInspections(agentId);
  return NextResponse.json({ ok: true, data: inspections });
}
