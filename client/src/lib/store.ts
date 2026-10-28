import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';

/**
 * Submission store.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PRODUCTION WARNING
 *
 * The default "file" driver writes JSONL to the local filesystem. It exists so the
 * application runs end-to-end out of the box and so the endpoints can be tested. It
 * is NOT a lawful production store for personal data:
 *
 *   - no encryption at rest (NDPA 2023 s.24(2) requires appropriate technical and
 *     organisational measures; Part VII s.39 governs security, integrity and confidentiality)
 *   - no access control or audit of reads
 *   - does not survive a serverless redeploy, so a data subject request could be lost
 *     while the firm's published response commitment continues to run against it
 *
 * Before go-live, implement the StoreDriver interface against a managed database with
 * encryption at rest, role-based access and backup. The interface is deliberately
 * narrow so that swap is a single file.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Collection =
  | 'contact' | 'enquiry' | 'alert' | 'newsletter'
  | 'inspection' | 'dsr' | 'snag';

export interface StoredRecord<T = unknown> {
  id: string;
  reference: string;
  collection: Collection;
  receivedAt: string;
  dueAt?: string;
  payload: T;
  meta: { ipHash: string | null; userAgent: string | null };
}

export interface StoreDriver {
  put<T>(record: StoredRecord<T>): Promise<void>;
  findByReference(reference: string): Promise<StoredRecord | null>;
}

/**
 * Statically scoped to a single subfolder of the working directory. A dynamic path
 * here would cause the bundler to trace the entire project into the server output,
 * which on a serverless host means the public folder ships inside the function.
 */
const DIR = path.join(process.cwd(), '.fdp-data');

const fileDriver: StoreDriver = {
  async put(record) {
    await fs.mkdir(DIR, { recursive: true });
    const file = path.join(DIR, `${record.collection}.jsonl`);
    await fs.appendFile(/* turbopackIgnore: true */ file, JSON.stringify(record) + '\n', 'utf8');
  },
  async findByReference(reference) {
    let files: string[];
    try {
      files = await fs.readdir(/* turbopackIgnore: true */ DIR);
    } catch {
      return null;
    }
    for (const f of files.filter((x) => x.endsWith('.jsonl'))) {
      const target = path.join(DIR, f);
      const raw = await fs.readFile(/* turbopackIgnore: true */ target, 'utf8');
      for (const line of raw.split('\n')) {
        if (!line.trim()) continue;
        const rec = JSON.parse(line) as StoredRecord;
        if (rec.reference === reference) return rec;
      }
    }
    return null;
  },
};

/** No-op driver for environments where writing is not permitted. */
const nullDriver: StoreDriver = {
  async put() { /* intentionally does nothing */ },
  async findByReference() { return null; },
};

/**
 * Driver selection.
 *
 *   FDP_STORE=postgres  production. AWS RDS for PostgreSQL. See drivers/postgres.ts
 *                       and docs/aws-provisioning.md.
 *   FDP_STORE=file      development only. Writes JSONL to disk. Not a lawful
 *                       production store for personal data - see the warning above.
 *   FDP_STORE=none      discards writes. For preview deployments that must not
 *                       receive personal data at all.
 *
 * The Postgres driver is loaded lazily so that a development or preview deployment
 * does not need the `pg` dependency resolved at module load.
 */
let cachedDriver: StoreDriver | null = null;

function selectDriver(): StoreDriver {
  const connStr = process.env.DATABASE_URL;
  const mode = process.env.FDP_STORE ?? (connStr ? 'postgres' : 'file');

  if (mode === 'none') return nullDriver;

  if (mode === 'postgres' || connStr) {
    if (!cachedDriver) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { postgresDriver } = require('./drivers/postgres') as
        typeof import('./drivers/postgres');
      cachedDriver = postgresDriver;
    }
    return cachedDriver;
  }

  return fileDriver;
}

export const store: StoreDriver = {
  async put<T>(rec: StoredRecord<T>): Promise<void> {
    return selectDriver().put(rec);
  },
  async findByReference(reference: string): Promise<StoredRecord | null> {
    return selectDriver().findByReference(reference);
  },
};

const PREFIX: Record<Collection, string> = {
  contact: 'ENQ', enquiry: 'PRP', alert: 'ALT', newsletter: 'SUB',
  inspection: 'INS', dsr: 'DSR', snag: 'SNG',
};

/** Human-quotable reference, e.g. FDP-DSR-26A7K3Q. */
export function makeReference(collection: Collection): string {
  const yy = new Date().getFullYear().toString().slice(2);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FDP-${PREFIX[collection]}-${yy}${rand}`;
}

/**
 * The caller's address is a personal data point under the NDPA 2023. It is retained
 * only as a salted one-way hash, which supports abuse investigation without holding
 * the address itself.
 */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.FDP_IP_SALT ?? 'fdp-static-salt-replace-in-production';
  return createHash('sha256').update(salt + ip).digest('hex').slice(0, 32);
}

export async function record<T>(
  collection: Collection,
  payload: T,
  opts: { ip?: string | null; userAgent?: string | null; dueInDays?: number } = {},
): Promise<StoredRecord<T>> {
  const now = new Date();
  const rec: StoredRecord<T> = {
    id: randomUUID(),
    reference: makeReference(collection),
    collection,
    receivedAt: now.toISOString(),
    dueAt: opts.dueInDays
      ? new Date(now.getTime() + opts.dueInDays * 86_400_000).toISOString()
      : undefined,
    payload,
    meta: { ipHash: hashIp(opts.ip ?? null), userAgent: opts.userAgent ?? null },
  };
  await store.put(rec);
  return rec;
}
