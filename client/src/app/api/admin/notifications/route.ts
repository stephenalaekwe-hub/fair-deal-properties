import { NextResponse } from 'next/server';
import { getLiveNotificationCounts } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = token ? verifyToken(token) : null;

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId') || (user?.role === 'AGENT' ? user.id : undefined);
    const isAgent = user?.role === 'AGENT' || Boolean(searchParams.get('isAgent') === 'true');

    const counts = await getLiveNotificationCounts(agentId, isAgent);
    return NextResponse.json({ ok: true, data: counts });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
