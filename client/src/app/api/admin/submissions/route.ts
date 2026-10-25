import { NextResponse } from 'next/server';
import { getLiveSubmissions } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection') || undefined;
  const submissions = await getLiveSubmissions(collection);
  return NextResponse.json({ ok: true, data: submissions });
}
