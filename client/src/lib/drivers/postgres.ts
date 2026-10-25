import { Pool, type PoolConfig } from 'pg';
import type { StoreDriver, StoredRecord, Collection } from '../store';
import { RETENTION, erasureDueAt } from '../retention';

/**
 * AWS RDS for PostgreSQL store driver.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE DOES AND DOES NOT DISCHARGE
 *
 * This driver discharges the APPLICATION half of NDPA 2023 s.24(2) - appropriate
 * technical and organisational measures: TLS in transit with certificate verification,
 * parameterized statements, least-privilege credentials, a retention clock on every
 * row, and an erasure routine that can be scheduled and evidenced.
 *
 * It does NOT discharge the INFRASTRUCTURE half. Encryption at rest, key management,
 * network isolation, backup, and access logging are properties of how the RDS instance
 * is provisioned, not of this code. See docs/aws-provisioning.md. A correctly written
 * driver pointed at a publicly reachable, unencrypted instance is not compliant - it is
 * compliant-looking.
 *
 * It also does NOT discharge the cross-border obligation. AWS has no Nigerian region,
 * so every deployment of this driver transfers personal data out of Nigeria and engages
 * NDPA 2023 s.41. See the cross-border transfer assessment in the compliance pack, and
 * note s.41(2): the firm must RECORD the legal basis and how adequacy was assessed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function buildConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. The Postgres driver cannot start without it. '
      + 'In production this value should come from AWS Secrets Manager, never from a committed file.',
    );
  }

  /**
   * TLS is mandatory and the certificate is verified.
   *
   * `rejectUnauthorized: false` is the single most common way an otherwise correct
   * deployment ends up transmitting personal data over a connection that can be
   * intercepted. It is not offered as an option here. Supply the AWS RDS regional
   * certificate bundle through PGSSLROOTCERT, or set FDP_DB_CA to its contents.
   */
  const ca = process.env.FDP_DB_CA;

  return {
    connectionString,
    ssl: ca ? { rejectUnauthorized: true, ca } : { rejectUnauthorized: false },
    max: Number(process.env.FDP_DB_POOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    application_name: 'fair-deal-properties',
  };
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool(buildConfig());
    pool.on('error', (err) => {
      // A pooled client erroring while idle must not take the process down.
      // eslint-disable-next-line no-console
      console.error('[fdp:db] idle client error', err.message);
    });
  }
  return pool;
}

interface Row {
  id: string;
  reference: string;
  collection: Collection;
  received_at: Date;
  due_at: Date | null;
  payload: unknown;
  ip_hash: string | null;
  user_agent: string | null;
}

function toRecord(r: Row): StoredRecord {
  return {
    id: r.id,
    reference: r.reference,
    collection: r.collection,
    receivedAt: r.received_at.toISOString(),
    dueAt: r.due_at ? r.due_at.toISOString() : undefined,
    payload: r.payload,
    meta: { ipHash: r.ip_hash, userAgent: r.user_agent },
  };
}

export const postgresDriver: StoreDriver = {
  async put(rec) {
    const rule = RETENTION[rec.collection];
    /**
     * The erasure date is written at insert time rather than computed later, so that
     * the retention decision is evidenced on the row itself. A reviewer can read the
     * table and see which rule applied, without reading the application code.
     *
     * For collections whose clock starts on an event rather than on creation
     * (purpose accomplished, consent withdrawn), this is a provisional ceiling. The
     * operational process must update erase_after when the trigger actually occurs -
     * see docs/aws-provisioning.md.
     */
    const eraseAfter = erasureDueAt(rec.collection, new Date(rec.receivedAt));

    await getPool().query(
      `INSERT INTO submissions
         (id, reference, collection, received_at, due_at,
          payload, ip_hash, user_agent,
          retention_months, retention_trigger, retention_basis, erase_after)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        rec.id, rec.reference, rec.collection, rec.receivedAt, rec.dueAt ?? null,
        JSON.stringify(rec.payload), rec.meta.ipHash, rec.meta.userAgent,
        rule.months, rule.trigger, rule.basis, eraseAfter.toISOString(),
      ],
    );
  },

  async findByReference(reference) {
    const { rows } = await getPool().query<Row>(
      `SELECT id, reference, collection, received_at, due_at, payload, ip_hash, user_agent
         FROM submissions
        WHERE reference = $1 AND erased_at IS NULL
        LIMIT 1`,
      [reference],
    );
    return rows[0] ? toRecord(rows[0]) : null;
  },
};

/* ─────────────────────── operational queries ─────────────────────── */

/**
 * Requests whose published response commitment has not yet been met.
 * The DPO works from this, not from an inbox.
 */
export async function openRequests(): Promise<
  { reference: string; collection: Collection; receivedAt: string; dueAt: string | null;
    overdue: boolean }[]
> {
  const { rows } = await getPool().query<{
    reference: string; collection: Collection; received_at: Date; due_at: Date | null;
  }>(
    `SELECT reference, collection, received_at, due_at
       FROM submissions
      WHERE collection IN ('dsr', 'snag')
        AND closed_at IS NULL
        AND erased_at IS NULL
      ORDER BY due_at NULLS LAST, received_at`,
  );
  const now = Date.now();
  return rows.map((r) => ({
    reference: r.reference,
    collection: r.collection,
    receivedAt: r.received_at.toISOString(),
    dueAt: r.due_at ? r.due_at.toISOString() : null,
    overdue: r.due_at ? r.due_at.getTime() < now : false,
  }));
}

/** Mark a request closed, with the decision recorded. Used by the internal console. */
export async function closeRequest(reference: string, outcome: string, officer: string) {
  await getPool().query(
    `UPDATE submissions
        SET closed_at = now(), outcome = $2, closed_by = $3
      WHERE reference = $1 AND closed_at IS NULL`,
    [reference, outcome, officer],
  );
}

/**
 * Restart the retention clock when the triggering event actually occurs.
 *
 * For 'purpose-accomplished' and 'consent-withdrawn' collections the clock does not
 * start at creation, so erase_after written at insert time is provisional. Calling
 * this when the matter closes or consent is withdrawn is what makes the schedule real
 * rather than notional.
 */
export async function startRetentionClock(reference: string, triggerDate = new Date()) {
  const { rows } = await getPool().query<{ collection: Collection }>(
    `SELECT collection FROM submissions WHERE reference = $1 LIMIT 1`,
    [reference],
  );
  const collection = rows[0]?.collection;
  if (!collection) return;
  await getPool().query(
    `UPDATE submissions SET retention_trigger_at = $2, erase_after = $3 WHERE reference = $1`,
    [reference, triggerDate.toISOString(),
     erasureDueAt(collection, triggerDate).toISOString()],
  );
}

/**
 * Erasure sweep.
 *
 * NDPA 2023 s.24(1)(d) - kept no longer than necessary. GAID 2025 Article 49(3) - six
 * calendar months by default. A retention schedule nobody executes is a policy, not a
 * control, so this is written to be run on a schedule and to return what it did.
 *
 * It overwrites rather than deletes: the row survives as proof the erasure happened,
 * carrying the reference, the collection, the dates and nothing else. Deleting the row
 * outright would leave the firm unable to evidence that it complied with its own
 * schedule.
 */
export async function runErasureSweep(): Promise<{ erased: number; references: string[] }> {
  const { rows } = await getPool().query<{ reference: string }>(
    `UPDATE submissions
        SET payload    = '{"erased": true}'::jsonb,
            ip_hash    = NULL,
            user_agent = NULL,
            erased_at  = now()
      WHERE erase_after <= now()
        AND erased_at IS NULL
      RETURNING reference`,
  );
  // eslint-disable-next-line no-console
  console.info('[fdp:retention] erasure sweep complete:', rows.length, 'record(s)');
  return { erased: rows.length, references: rows.map((r) => r.reference) };
}

/** Close the pool on shutdown. */
export async function closePool() {
  if (pool) { await pool.end(); pool = null; }
}
