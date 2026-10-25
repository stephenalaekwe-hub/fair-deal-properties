import { NextResponse } from 'next/server';
import { getLiveFinancingRoutes } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const routes = await getLiveFinancingRoutes();
  return NextResponse.json({ ok: true, data: routes });
}
