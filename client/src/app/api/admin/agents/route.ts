import { NextResponse } from 'next/server';
import { getLiveUsers, getDbPool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const users = await getLiveUsers();
  return NextResponse.json({ ok: true, data: users });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    const p = getDbPool();
    if (!p) throw new Error('Database not configured');

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role || 'AGENT';

    const res = await p.query(
      `INSERT INTO users (name, email, password_hash, role, phone, active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, name, email, role, phone, active, created_at as "createdAt"`,
      [name, email, passwordHash, assignedRole, phone || null]
    );

    return NextResponse.json({ ok: true, data: res.rows[0] }, { status: 201 });
  } catch (err: any) {
    if (err.code === '23505') {
      return NextResponse.json({ ok: false, error: 'An account with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
