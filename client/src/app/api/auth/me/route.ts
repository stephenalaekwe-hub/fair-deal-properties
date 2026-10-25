import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/fdp_token=([^;]+)/);
      token = match ? match[1] : null;
    }

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Session expired' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Failed to authenticate' }, { status: 500 });
  }
}
