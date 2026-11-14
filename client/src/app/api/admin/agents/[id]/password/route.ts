import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDbPool } from '@/lib/db';
import { updateTestAgentPassword } from '@/lib/agentsStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { password, email } = body;

    if (!password || String(password).trim().length < 6) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanPassword = String(password).trim();
    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    // 1. Update fallback / disk roster store
    updateTestAgentPassword(id, cleanPassword);
    if (email) {
      updateTestAgentPassword(String(email), cleanPassword);
    }

    // 2. Update PostgreSQL users table if connected
    const p = getDbPool();
    if (p) {
      try {
        await p.query(
          `UPDATE users
           SET password_hash = $2
           WHERE id::text = $1 OR LOWER(email) = LOWER($3)`,
          [id, passwordHash, email || id]
        );
      } catch (dbErr) {
        console.warn('[fdp:admin:agents:password] DB update warning:', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      data: { id, message: 'Password updated successfully.' },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
