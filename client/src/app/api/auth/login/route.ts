import { NextResponse } from 'next/server';
import { authenticateUser, signToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken(user);
    const res = NextResponse.json({
      ok: true,
      data: {
        user,
        token,
      },
    });

    res.cookies.set('fdp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    console.error('[fdp:auth:login] Error:', err);
    return NextResponse.json({ ok: false, error: err.message || 'Authentication failed' }, { status: 500 });
  }
}
