import { NextResponse } from 'next/server';
import { runErasureSweep } from '@/lib/drivers/postgres';
import { auditLog } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/internal/retention-sweep
 *
 * Executes the erasure schedule. A retention policy nobody runs is a policy, not a
 * control, and NDPA 2023 s.24(1)(d) is not discharged by having written one down.
 *
 * Protected by a shared secret rather than a user session, because it is called by a
 * scheduler, not by a person. Schedule it daily - EventBridge Scheduler to an
 * authenticated endpoint, or a Vercel cron entry.
 *
 * It returns what it erased so the run can be evidenced. The references it returns are
 * record identifiers, not personal data.
 */
export async function POST(req: Request) {
  const secret = process.env.FDP_INTERNAL_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'FDP_INTERNAL_SECRET is not configured. The sweep will not run unauthenticated.' },
      { status: 503 },
    );
  }

  const presented = req.headers.get('x-fdp-internal-secret');
  // Length-independent comparison. A timing-safe compare is preferable where the
  // runtime provides one; the values here are high-entropy and compared whole.
  if (!presented || presented.length !== secret.length || presented !== secret) {
    return NextResponse.json({ ok: false, error: 'Not authorized.' }, { status: 401 });
  }

  if (process.env.FDP_STORE !== 'postgres') {
    return NextResponse.json(
      { ok: false, error: 'The retention sweep requires FDP_STORE=postgres.' },
      { status: 409 },
    );
  }

  const result = await runErasureSweep();

  auditLog({
    event: 'retention.sweep',
    reference: `SWEEP-${new Date().toISOString().slice(0, 10)}`,
    lawfulBasis: 'legal-obligation',
    retentionMonths: 0,
    retentionBasis:
      'NDPA 2023 s.24(1)(d) storage limitation; GAID 2025 Art 49(3) six-month default, '
      + 'Art 49(4) where extended.',
  });

  return NextResponse.json({ ok: true, data: result });
}
