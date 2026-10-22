import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/health - uptime probe for the host's monitor. Discloses nothing sensitive. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'fair-deal-properties',
    time: new Date().toISOString(),
    store: process.env.FDP_STORE ?? 'file',
    mail: process.env.FDP_MAIL_PROVIDER ?? 'console',
  });
}
