import { NextResponse } from 'next/server';
import { getLiveInspections } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const inspections = await getLiveInspections();
  return NextResponse.json({ ok: true, data: inspections });
}
