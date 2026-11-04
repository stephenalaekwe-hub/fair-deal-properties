import { NextResponse } from 'next/server';
import { getLiveUsers, getDbPool } from '@/lib/db';
import { addTestAgent } from '@/lib/agentsStore';
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

    const assignedRole = role || 'AGENT';
    const p = getDbPool();

    if (p) {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        const res = await p.query(
          `INSERT INTO users (name, email, password_hash, role, phone, active)
           VALUES ($1, $2, $3, $4, $5, true)
           RETURNING id, name, email, role, phone, active, created_at as "createdAt"`,
          [name, email, passwordHash, assignedRole, phone || null]
        );

        addTestAgent({ id: res.rows[0].id, name, email, role: assignedRole, phone, active: true, password });
        return NextResponse.json({ ok: true, data: res.rows[0] }, { status: 201 });
      } catch (dbErr: any) {
        if (dbErr.code === '23505') {
          return NextResponse.json({ ok: false, error: 'An account with this email already exists' }, { status: 400 });
        }
        console.warn('[fdp:admin:agents:create] DB warning, saving to test agent store:', dbErr?.message || dbErr);
      }
    }

    const added = addTestAgent({ name, email, role: assignedRole, phone, active: true, password });
    return NextResponse.json({ ok: true, data: added }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create agent' }, { status: 500 });
  }
}
