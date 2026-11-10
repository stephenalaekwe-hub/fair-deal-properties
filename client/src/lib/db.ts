// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - POSTGRESQL DATABASE CLIENT
// ══════════════════════════════════════════════════════════════════════════════

import { Pool, type PoolConfig } from 'pg';
import { listings as defaultListings, type Listing, type ListingSource, type PropertyType, type City, type ListingSort } from '@/data/listings';
import { financingRoutes as defaultFinancingRoutes, type FinancingRoute } from '@/data/financing';
import { getTestAgents } from './agentsStore';
import { getScrapedLogs } from './scrapedStore';

let pool: Pool | null = null;
let schemaInitialized = false;
const inMemoryNotificationReads = new Map<string, string>();

export async function ensureSchemaColumns(p: Pool): Promise<void> {
  if (schemaInitialized) return;
  try {
    await Promise.all([
      p.query(`
        ALTER TABLE listings
        ADD COLUMN IF NOT EXISTS assigned_agent text,
        ADD COLUMN IF NOT EXISTS assigned_agent_id text;
      `).catch(() => {}),
      p.query(`
        ALTER TABLE inspections
        ADD COLUMN IF NOT EXISTS assigned_agent text,
        ADD COLUMN IF NOT EXISTS assigned_agent_id text,
        ADD COLUMN IF NOT EXISTS agent_id text,
        ADD COLUMN IF NOT EXISTS report_url text,
        ADD COLUMN IF NOT EXISTS officer_name text,
        ADD COLUMN IF NOT EXISTS current_step_done boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS status text,
        ADD COLUMN IF NOT EXISTS outcome text,
        ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;
      `).catch(() => {}),
      p.query(`
        ALTER TABLE submissions
        ADD COLUMN IF NOT EXISTS assigned_agent text,
        ADD COLUMN IF NOT EXISTS assigned_agent_id text,
        ADD COLUMN IF NOT EXISTS status text,
        ADD COLUMN IF NOT EXISTS outcome text,
        ADD COLUMN IF NOT EXISTS closed_by text,
        ADD COLUMN IF NOT EXISTS closed_at timestamp with time zone,
        ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;
      `).catch(() => {}),
      p.query(`
        CREATE TABLE IF NOT EXISTS notification_reads (
          user_key text NOT NULL,
          section text NOT NULL,
          last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
          PRIMARY KEY (user_key, section)
        );
      `).catch(() => {}),
    ]);
    schemaInitialized = true;
  } catch {
    // Non-fatal if read-only replica
  }
}

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    const config: PoolConfig = {
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: Number(process.env.FDP_DB_POOL_MAX ?? 5),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
      application_name: 'fdp-nextjs-live',
    };

    pool = new Pool(config);
    pool.on('error', (err) => {
      console.error('[fdp:db] Idle pool client error:', err.message);
    });
  }

  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (!p) throw new Error('Database not configured. DATABASE_URL is missing.');
  const res = await p.query(sql, params);
  return res.rows as T[];
}

// ─── Listings Queries ────────────────────────────────────────────────────────

export async function getLiveListings(filters: {
  source?: ListingSource;
  propertyType?: PropertyType;
  city?: City;
  diasporaFriendly?: boolean;
  mortgageEligible?: boolean;
  affordable?: boolean;
  offPlan?: boolean;
  maxPriceMillionsNGN?: number;
  search?: string;
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ total: number; listings: Listing[] }> {
  try {
    const p = getDbPool();
    if (!p) {
      return fallbackListings(filters);
    }

    await ensureSchemaColumns(p);

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (filters.source) {
      conditions.push(`source = $${idx++}`);
      values.push(filters.source);
    }
    if (filters.propertyType) {
      conditions.push(`property_type = $${idx++}`);
      values.push(filters.propertyType);
    }
    if (filters.city) {
      conditions.push(`city = $${idx++}`);
      values.push(filters.city);
    }
    if (filters.diasporaFriendly !== undefined) {
      conditions.push(`diaspora_friendly = $${idx++}`);
      values.push(filters.diasporaFriendly);
    }
    if (filters.mortgageEligible !== undefined) {
      conditions.push(`mortgage_eligible = $${idx++}`);
      values.push(filters.mortgageEligible);
    }
    if (filters.affordable !== undefined) {
      conditions.push(`affordable = $${idx++}`);
      values.push(filters.affordable);
    }
    if (filters.offPlan !== undefined) {
      conditions.push(`off_plan = $${idx++}`);
      values.push(filters.offPlan);
    }
    if (filters.maxPriceMillionsNGN) {
      conditions.push(`price_millions_ngn <= $${idx++}`);
      values.push(filters.maxPriceMillionsNGN);
    }
    if (filters.search) {
      conditions.push(`(title ILIKE $${idx} OR location ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${filters.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'created_at DESC';
    if (filters.sort === 'price-asc') orderBy = 'price_millions_ngn ASC NULLS LAST';
    if (filters.sort === 'price-desc') orderBy = 'price_millions_ngn DESC NULLS LAST';
    if (filters.sort === 'title') orderBy = 'title ASC';

    const countRes = await p.query(`SELECT count(*) FROM listings ${whereClause}`, values);
    const total = parseInt(countRes.rows[0].count, 10);

    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize || 30));
    const offset = (page - 1) * pageSize;

    const queryStr = `
      SELECT id, slug, title, subtitle, source, property_type as "propertyType",
             city, diaspora_friendly as "diasporaFriendly", mortgage_eligible as "mortgageEligible",
             affordable, off_plan as "offPlan", price_millions_ngn as "priceMillionsNGN",
             price_display as "priceDisplay", price_label as "priceLabel", listed_on as "listedOn",
             image, image_alt as "imageAlt", badges, location, specification, description,
             tags, amenities, verification_status as "verificationStatus",
             assigned_agent as "assignedAgentName", assigned_agent_id as "assignedAgentId"
      FROM listings
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    values.push(pageSize, offset);
    const rowsRes = await p.query(queryStr, values);

    return {
      total,
      listings: rowsRes.rows.map(mapListingRow),
    };
  } catch (err) {
    console.error('[fdp:db] getLiveListings error, falling back to local dataset:', err);
    return fallbackListings(filters);
  }
}

export async function getLiveListingBySlug(slug: string): Promise<Listing | null> {
  try {
    const p = getDbPool();
    if (!p) {
      return defaultListings.find((l) => l.slug === slug) || null;
    }

    const res = await p.query(
      `SELECT id, slug, title, subtitle, source, property_type as "propertyType",
              city, diaspora_friendly as "diasporaFriendly", mortgage_eligible as "mortgageEligible",
              affordable, off_plan as "offPlan", price_millions_ngn as "priceMillionsNGN",
              price_display as "priceDisplay", price_label as "priceLabel", listed_on as "listedOn",
              image, image_alt as "imageAlt", badges, location, specification, description,
              tags, amenities, verification_status as "verificationStatus"
       FROM listings
       WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (res.rows.length === 0) {
      return defaultListings.find((l) => l.slug === slug) || null;
    }
    return mapListingRow(res.rows[0]);
  } catch (err) {
    console.error('[fdp:db] getLiveListingBySlug error:', err);
    return defaultListings.find((l) => l.slug === slug) || null;
  }
}

function mapListingRow(row: any): Listing {
  const assignedAgentId = row.assignedAgentId || null;
  const assignedAgentName = row.assignedAgentName || null;
  let images: string[] = [];
  if (typeof row.image === 'string') {
    const trimmed = row.image.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          images = parsed.filter((u) => typeof u === 'string' && u.trim().length > 0);
        }
      } catch {
        images = [trimmed];
      }
    } else if (trimmed) {
      images = [trimmed];
    }
  }
  const primaryImage = images[0] || '/assets/illustrations/i0.svg';

  return {
    ...row,
    image: primaryImage,
    images,
    priceMillionsNGN: row.priceMillionsNGN ? parseFloat(row.priceMillionsNGN) : null,
    badges: typeof row.badges === 'string' ? JSON.parse(row.badges) : (row.badges || []),
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : (row.amenities || []),
    assignedAgentId,
    assignedAgent: (assignedAgentId || assignedAgentName) ? {
      id: assignedAgentId,
      name: assignedAgentName || 'Assigned Officer',
    } : null,
  };
}

function fallbackListings(filters: any): { total: number; listings: Listing[] } {
  let res = [...defaultListings];
  if (filters.source) res = res.filter((l) => l.source === filters.source);
  if (filters.propertyType) res = res.filter((l) => l.propertyType === filters.propertyType);
  if (filters.city) res = res.filter((l) => l.city === filters.city);
  if (filters.diasporaFriendly) res = res.filter((l) => l.diasporaFriendly);
  if (filters.mortgageEligible) res = res.filter((l) => l.mortgageEligible);
  if (filters.affordable) res = res.filter((l) => l.affordable);
  if (filters.offPlan) res = res.filter((l) => l.offPlan);
  if (filters.maxPriceMillionsNGN) res = res.filter((l) => (l.priceMillionsNGN ?? 0) <= filters.maxPriceMillionsNGN);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    res = res.filter((l) => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q));
  }
  return { total: res.length, listings: res };
}

// ─── Inspections Queries ─────────────────────────────────────────────────────

const defaultInspections = [
  {
    id: 'ins-demo-1',
    reference: 'FDP-INS-890214',
    clientName: 'Dr. Chidi Okonkwo',
    clientEmail: 'chidi.okonkwo@gmail.com',
    clientPhone: '+2348035551234',
    propertyTitle: 'Plot 42, Hutu Exclusive Phase III, Airport Road',
    propertyLocation: 'Abuja FCT - Airport Road Corridor',
    stage: 4,
    officerName: 'Emeka Nwosu (Senior Surveyor)',
    assignedAgentId: 'agent-fallback-01',
    assignedAgent: { id: 'agent-fallback-01', name: 'Emeka Nwosu (Senior Surveyor)', email: 'emeka.agent@fdealproperties.com' },
    scheduledDate: '2026-11-12',
    notes: 'Boundary coordinates verification and beacon cross-check with AGIS cadastral map.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ins-demo-2',
    reference: 'FDP-INS-DEMO01',
    clientName: 'Amina Bello',
    clientEmail: 'amina.bello@yahoo.com',
    clientPhone: '+2348091122334',
    propertyTitle: '4-Bedroom Contemporary Villa, Guzape Hills',
    propertyLocation: 'Guzape District, Abuja FCT',
    stage: 8,
    officerName: 'Aisha Bello (Field Surveyor)',
    assignedAgentId: 'agent-fallback-02',
    assignedAgent: { id: 'agent-fallback-02', name: 'Aisha Bello (Field Surveyor)', email: 'aisha.agent@fdealproperties.com' },
    scheduledDate: '2026-11-10',
    notes: 'Structural engineering examination completed. Final dossier review underway.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export interface ResolvedAgentProfile {
  ids: Set<string>;
  emails: Set<string>;
  baseNames: Set<string>;
  firstNames: Set<string>;
}

export async function resolveAgentProfile(p: Pool | null, agentId?: string): Promise<ResolvedAgentProfile | null> {
  if (!agentId || !agentId.trim()) return null;
  const raw = agentId.trim();
  const norm = raw.toLowerCase();

  const ids = new Set<string>([norm]);
  const emails = new Set<string>();
  const baseNames = new Set<string>();
  const firstNames = new Set<string>();

  const addName = (n?: string | null) => {
    if (!n) return;
    const clean = n.split('(')[0].trim().toLowerCase();
    if (!clean) return;
    baseNames.add(clean);
    const first = clean.split(/\s+/)[0];
    if (first && first.length >= 3) {
      firstNames.add(first);
    }
  };

  const testAgents = getTestAgents();
  for (const ta of testAgents) {
    const tid = ta.id.toLowerCase();
    const temail = ta.email.toLowerCase();
    const tbase = ta.name.split('(')[0].trim().toLowerCase();
    if (tid === norm || temail === norm || tbase === norm) {
      ids.add(tid);
      emails.add(temail);
      addName(ta.name);
    }
  }

  if (p) {
    try {
      const uRes = await p.query(
        `SELECT id, name, email FROM users WHERE id::text = $1 OR LOWER(email) = $2 OR LOWER(name) = $2 LIMIT 5`,
        [raw, norm]
      );
      for (const row of uRes.rows) {
        if (row.id) ids.add(String(row.id).toLowerCase());
        if (row.email) emails.add(String(row.email).toLowerCase());
        addName(row.name);
      }

      // Cross-match with testAgents by discovered email or firstName
      for (const ta of testAgents) {
        const temail = ta.email.toLowerCase();
        const tbase = ta.name.split('(')[0].trim().toLowerCase();
        const tfirst = tbase.split(/\s+/)[0];
        if (emails.has(temail) || baseNames.has(tbase) || (tfirst && firstNames.has(tfirst))) {
          ids.add(ta.id.toLowerCase());
          emails.add(temail);
          addName(ta.name);
        }
      }

      // Also cross-match DB users if agentId was a testAgent ID like 'agent-fallback-01'
      if (emails.size > 0) {
        const emailArr = Array.from(emails);
        const dbByEmail = await p.query(
          `SELECT id, name, email FROM users WHERE LOWER(email) = ANY($1::text[])`,
          [emailArr]
        );
        for (const row of dbByEmail.rows) {
          if (row.id) ids.add(String(row.id).toLowerCase());
          addName(row.name);
        }
      }
    } catch {
      // Ignore lookup warning
    }
  }

  return { ids, emails, baseNames, firstNames };
}

export function matchesAgentRecord(
  item: {
    assignedAgentId?: string | null;
    assignedAgentName?: string | null;
    officerName?: string | null;
    assignedAgent?: { id?: string | null; name?: string | null; email?: string | null } | null;
  },
  profile: ResolvedAgentProfile | null,
  includeUnassigned: boolean = true
): boolean {
  if (!profile) return true;

  const recId = (item.assignedAgentId || item.assignedAgent?.id || '').trim().toLowerCase();
  const recEmail = (item.assignedAgent?.email || '').trim().toLowerCase();
  const recName = (item.assignedAgentName || item.officerName || item.assignedAgent?.name || '').trim().toLowerCase();
  const recBase = recName.split('(')[0].trim();
  const recFirst = recBase.split(/\s+/)[0];

  // If record has no assigned agent yet, include it if includeUnassigned is true
  if (!recId && !recName && !recEmail) {
    return includeUnassigned;
  }

  if (recId && profile.ids.has(recId)) return true;
  if (recEmail && profile.emails.has(recEmail)) return true;
  if (recBase && profile.baseNames.has(recBase)) return true;
  if (recFirst && recFirst.length >= 3 && profile.firstNames.has(recFirst)) return true;
  for (const bn of profile.baseNames) {
    if (bn && recName.includes(bn)) return true;
  }

  return false;
}

export async function getLiveInspections(agentId?: string): Promise<any[]> {
  const p = getDbPool();
  const profile = agentId ? await resolveAgentProfile(p, agentId) : null;

  if (!p) {
    if (profile) return defaultInspections.filter((i) => matchesAgentRecord(i, profile, true));
    return defaultInspections;
  }

  await ensureSchemaColumns(p);

  const sql = `
    SELECT i.id, i.reference, 
           COALESCE(i.client_name, '') as "clientName", 
           COALESCE(i.client_email, '') as "clientEmail",
           COALESCE(i.client_phone, '') as "clientPhone", 
           COALESCE(i.property_title, '') as "propertyTitle",
           COALESCE(i.property_location, '') as "propertyLocation", 
           i.stage, 
           COALESCE(i.officer_name, u.name, '') as "officerName",
           COALESCE(i.assigned_agent_id, i.agent_id, '') as "assignedAgentId",
           i.scheduled_date as "scheduledDate", 
           COALESCE(i.report_url, '') as "reportUrl",
           COALESCE(i.notes, '') as notes, 
           COALESCE(i.status, 'in_progress') as status,
           COALESCE(i.outcome, '') as outcome,
           COALESCE(i.current_step_done, false) as "currentStepDone",
           i.created_at as "createdAt",
           COALESCE(i.updated_at, i.created_at) as "updatedAt",
           CASE 
             WHEN u.name IS NOT NULL THEN json_build_object('id', u.id, 'name', u.name, 'email', u.email)
             WHEN i.assigned_agent IS NOT NULL AND i.assigned_agent != '' THEN json_build_object('id', COALESCE(i.assigned_agent_id, i.agent_id, ''), 'name', i.assigned_agent)
             WHEN i.officer_name IS NOT NULL AND i.officer_name != '' THEN json_build_object('name', i.officer_name)
             ELSE NULL
           END as "assignedAgent"
    FROM inspections i
    LEFT JOIN users u ON u.id::text = COALESCE(i.assigned_agent_id, i.agent_id)
    ORDER BY i.created_at DESC
  `;
  const res = await p.query(sql);
  const mapped = res.rows.map((row) => {
    const assignedAgentId = row.assignedAgentId || row.assignedAgent?.id || null;
    const assignedAgentName = row.assignedAgent?.name || row.officerName || null;
    let cleanNotes = row.notes || '';
    let reportUrl = row.reportUrl || '';
    const photoMatch = cleanNotes.match(/Attached Survey \/ Site Photograph:\s*([^\n\r]+)/i);
    if (photoMatch) {
      if (!reportUrl) reportUrl = photoMatch[1].trim();
      cleanNotes = cleanNotes.replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/i, '').trim();
    }
    const officerMessage = extractActualNote(cleanNotes, row.outcome);
    return {
      ...row,
      notes: cleanNotes,
      reportUrl,
      officerMessage,
      currentStepDone: Boolean(row.currentStepDone),
      assignedAgentId,
      assignedAgent: assignedAgentName ? {
        id: assignedAgentId,
        name: assignedAgentName,
        email: row.assignedAgent?.email || null,
      } : null,
    };
  });

  const baseList = mapped.length > 0 ? mapped : defaultInspections;
  if (profile) {
    return baseList.filter((ins) => matchesAgentRecord(ins, profile, true));
  }
  return baseList;
}

export function extractActualNote(notes?: string | null, outcome?: string | null): string | null {
  const cleanOutcome = (outcome || '').trim();
  const rawNotes = (notes || '').trim();

  // Check if notes contains an officer outcome append: "Officer Outcome: ..."
  const officerOutcomeMatch = rawNotes.match(/Officer Outcome:\s*([^\n\r]+)/i);
  const officerOutcome = officerOutcomeMatch ? officerOutcomeMatch[1].trim() : '';

  // Extract user-typed notes by removing boilerplate prefixes
  let parsedNotes = rawNotes
    .replace(/^Scope:\s*[^\n\r]+(\r?\n)?/im, '')
    .replace(/^Window:\s*[^\n\r]+(\r?\n)?/im, '')
    .replace(/^Notes:\s*/im, '')
    .replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/im, '')
    .replace(/Officer Outcome:\s*[^\n\r]+/im, '')
    .trim();

  const isGenericOutcome = !cleanOutcome || /^(checked|done|completed|resolved|closed|ok|yes)$/i.test(cleanOutcome);

  // If there's an actual specific officer outcome typed (and not just a generic "Checked")
  if (!isGenericOutcome) {
    if (parsedNotes && parsedNotes !== cleanOutcome && !parsedNotes.includes(cleanOutcome)) {
      return `${cleanOutcome} — ${parsedNotes}`;
    }
    return cleanOutcome;
  }

  // If there is an officer outcome appended to notes that is not generic
  if (officerOutcome && !/^(checked|done|completed|resolved|closed|ok|yes)$/i.test(officerOutcome)) {
    return officerOutcome;
  }

  // Return the actual note typed by the user
  if (parsedNotes) {
    return parsedNotes;
  }

  // Fallback to whatever note or outcome exists
  return cleanOutcome || officerOutcome || rawNotes || null;
}

export async function getLiveInspectionByRef(reference: string): Promise<any | null> {
  const normRef = (reference || '').trim().toLowerCase();
  const fallbackMatch = defaultInspections.find((i) => i.reference.toLowerCase() === normRef);

  const p = getDbPool();
  if (!p) return fallbackMatch || null;

  try {
    await p.query(`
      ALTER TABLE inspections 
      ADD COLUMN IF NOT EXISTS assigned_agent text,
      ADD COLUMN IF NOT EXISTS assigned_agent_id text,
      ADD COLUMN IF NOT EXISTS agent_id text,
      ADD COLUMN IF NOT EXISTS report_url text,
      ADD COLUMN IF NOT EXISTS officer_name text,
      ADD COLUMN IF NOT EXISTS status text,
      ADD COLUMN IF NOT EXISTS outcome text,
      ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;
    `);
  } catch (e) {}

  let res = await p.query(
    `SELECT i.id, i.reference, 
            COALESCE(i.client_name, '') as "clientName", 
            COALESCE(i.client_email, '') as "clientEmail",
            COALESCE(i.client_phone, '') as "clientPhone", 
            COALESCE(i.property_title, '') as "propertyTitle",
            COALESCE(i.property_location, '') as "propertyLocation", 
            i.stage, 
            COALESCE(i.officer_name, u.name, s.closed_by, '') as "officerName",
            COALESCE(i.assigned_agent_id, i.agent_id, s.assigned_agent_id, '') as "assignedAgentId",
            i.scheduled_date as "scheduledDate", 
            COALESCE(i.report_url, '') as "reportUrl",
            COALESCE(i.notes, '') as notes, 
            COALESCE(i.status, s.status, 'in_progress') as status,
            COALESCE(i.outcome, s.outcome, '') as outcome,
            COALESCE(i.current_step_done, false) as "currentStepDone",
            i.created_at as "createdAt",
            COALESCE(i.updated_at, s.closed_at, i.created_at) as "updatedAt",
            CASE 
              WHEN u.name IS NOT NULL THEN json_build_object('id', u.id, 'name', u.name, 'email', u.email)
              WHEN i.assigned_agent IS NOT NULL AND i.assigned_agent != '' THEN json_build_object('id', COALESCE(i.assigned_agent_id, i.agent_id, ''), 'name', i.assigned_agent)
              WHEN i.officer_name IS NOT NULL AND i.officer_name != '' THEN json_build_object('name', i.officer_name)
              WHEN s.closed_by IS NOT NULL AND s.closed_by != '' THEN json_build_object('name', s.closed_by)
              ELSE NULL
            END as "assignedAgent"
     FROM inspections i
     LEFT JOIN users u ON u.id::text = COALESCE(i.assigned_agent_id, i.agent_id)
     LEFT JOIN submissions s ON LOWER(s.reference) = LOWER(i.reference)
     WHERE LOWER(i.reference) = LOWER($1) LIMIT 1`,
    [reference]
  );

  if (!res.rows[0]) {
    // If not yet in inspections table, check submissions table
    try {
      const subRes = await p.query(
        `SELECT s.id, s.reference,
                COALESCE(s.payload->>'clientName', s.payload->>'name', '') as "clientName",
                COALESCE(s.payload->>'clientEmail', s.payload->>'email', '') as "clientEmail",
                COALESCE(s.payload->>'clientPhone', s.payload->>'phone', '') as "clientPhone",
                COALESCE(s.payload->>'propertyReference', s.payload->>'propertyTitle', 'Property Inspection') as "propertyTitle",
                COALESCE(s.payload->>'propertyLocation', s.payload->>'location', 'Abuja FCT') as "propertyLocation",
                COALESCE((s.payload->>'stage')::int, 1) as stage,
                COALESCE(s.closed_by, s.assigned_agent, '') as "officerName",
                COALESCE(s.assigned_agent_id, '') as "assignedAgentId",
                COALESCE(s.payload->>'reportUrl', s.payload->>'sitePhotoUrl', '') as "reportUrl",
                COALESCE(s.payload->>'notes', '') as notes,
                COALESCE(s.status, 'in_progress') as status,
                COALESCE(s.outcome, '') as outcome,
                s.received_at as "createdAt",
                COALESCE(s.closed_at, s.received_at) as "updatedAt"
         FROM submissions s
         WHERE LOWER(s.reference) = LOWER($1) LIMIT 1`,
        [reference]
      );
      if (subRes.rows[0]) {
        res = subRes;
      }
    } catch (subErr) {}
  }

  if (!res.rows[0]) return fallbackMatch || null;
  const row = res.rows[0];
  const assignedAgentId = row.assignedAgentId || row.assignedAgent?.id || null;
  const assignedAgentName = row.assignedAgent?.name || row.officerName || null;
  let cleanNotes = row.notes || '';
  let reportUrl = row.reportUrl || '';
  const photoMatch = cleanNotes.match(/Attached Survey \/ Site Photograph:\s*([^\n\r]+)/i);
  if (photoMatch) {
    if (!reportUrl) reportUrl = photoMatch[1].trim();
    cleanNotes = cleanNotes.replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/i, '').trim();
  }

  const effectiveStage = Math.max(1, Math.min(9, Number(row.stage) || 1));
  const isCompleted = effectiveStage >= 9;
  const currentStepDone = row.currentStepDone !== undefined
    ? Boolean(row.currentStepDone)
    : Boolean(row.outcome || (row.status === 'closed' || row.status === 'resolved'));
  const officerMessage = extractActualNote(cleanNotes, row.outcome);

  return {
    ...row,
    stage: effectiveStage,
    isCompleted,
    currentStepDone,
    officerMessage,
    notes: cleanNotes,
    reportUrl,
    assignedAgentId,
    assignedAgent: assignedAgentName ? {
      id: assignedAgentId,
      name: assignedAgentName,
      email: row.assignedAgent?.email || null,
    } : null,
  };
}

export async function updateLiveInspectionStage(
  id: string,
  stage: number,
  notes?: string,
  officerName?: string,
  reportUrl?: string,
  markStepDone?: boolean,
  assignedAgentId?: string | null,
  assignedAgentName?: string | null
): Promise<any> {
  const p = getDbPool();
  if (!p) {
    return {
      id,
      stage,
      notes: notes || '',
      officerName: officerName || '',
      reportUrl: reportUrl || '',
      currentStepDone: Boolean(markStepDone),
      assignedAgentId: assignedAgentId || null,
      message: 'Inspection stage and notes updated successfully.',
    };
  }

  try {
    await p.query(`
      ALTER TABLE inspections 
      ADD COLUMN IF NOT EXISTS assigned_agent text,
      ADD COLUMN IF NOT EXISTS assigned_agent_id text,
      ADD COLUMN IF NOT EXISTS agent_id text,
      ADD COLUMN IF NOT EXISTS report_url text,
      ADD COLUMN IF NOT EXISTS officer_name text,
      ADD COLUMN IF NOT EXISTS current_step_done boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS status text,
      ADD COLUMN IF NOT EXISTS outcome text,
      ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;
    `);
  } catch (e) {}

  let currentStage = stage;
  try {
    const curRes = await p.query(`SELECT stage, current_step_done FROM inspections WHERE id::text = $1 OR reference = $1 LIMIT 1`, [id]);
    if (curRes.rows[0]) {
      currentStage = Number(curRes.rows[0].stage) || 1;
    }
  } catch (cErr) {}

  const stageChanged = Number(stage) !== currentStage;
  const effectiveStepDone = markStepDone !== undefined 
    ? Boolean(markStepDone) 
    : (stageChanged ? false : undefined);

  const shouldUpdateAgentId = assignedAgentId !== undefined;
  const shouldUpdateAgentName = assignedAgentName !== undefined;

  const res = await p.query(
    `UPDATE inspections
     SET stage = $2,
         status = CASE 
           WHEN $2 >= 9 AND ($6::boolean = true OR current_step_done = true) THEN 'closed'
           ELSE 'in_progress'
         END,
         current_step_done = CASE 
           WHEN $6::boolean IS NOT NULL THEN $6::boolean
           WHEN stage != $2 THEN false
           ELSE current_step_done
         END,
         outcome = CASE 
           WHEN $6::boolean = true THEN COALESCE($3, notes)
           WHEN $6::boolean = false THEN NULL
           WHEN stage != $2 THEN NULL 
           ELSE outcome 
         END,
         notes = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE notes END,
         officer_name = CASE WHEN $4::text IS NOT NULL AND $4 != '' THEN $4 ELSE officer_name END,
         report_url = CASE WHEN $5::text IS NOT NULL THEN $5 ELSE report_url END,
         assigned_agent_id = CASE WHEN $7::boolean = true THEN $8::text ELSE assigned_agent_id END,
         agent_id = CASE WHEN $7::boolean = true THEN $8::text ELSE agent_id END,
         assigned_agent = CASE WHEN $9::boolean = true THEN $10::text WHEN $4::text IS NOT NULL AND $4 != '' THEN $4 ELSE assigned_agent END,
         updated_at = now()
     WHERE id::text = $1 OR reference = $1 RETURNING *`,
    [
      id,
      stage,
      notes !== undefined ? notes : null,
      officerName ?? null,
      reportUrl ?? null,
      effectiveStepDone !== undefined ? effectiveStepDone : null,
      shouldUpdateAgentId,
      assignedAgentId ?? null,
      shouldUpdateAgentName,
      assignedAgentName ?? officerName ?? null,
    ]
  );

  // Sync submissions table if matching reference exists
  try {
    if (res.rows[0]?.reference) {
      await p.query(
        `UPDATE submissions 
         SET status = CASE WHEN $2 >= 9 THEN 'closed' ELSE 'in_progress' END,
             outcome = CASE WHEN $3::boolean = true THEN outcome ELSE NULL END,
             assigned_agent_id = COALESCE($4::text, assigned_agent_id),
             assigned_agent = COALESCE($5::text, assigned_agent),
             updated_at = now()
         WHERE reference = $1`,
        [
          res.rows[0].reference,
          stage,
          Boolean(effectiveStepDone),
          assignedAgentId || null,
          assignedAgentName || officerName || null,
        ]
      );
    }
  } catch (subResetErr) {}

  return res.rows[0] || { id, stage, notes, officerName, reportUrl, currentStepDone: effectiveStepDone };
}

export async function markSectionNotificationsSeen(
  userKey: string,
  section: string
): Promise<void> {
  if (!userKey || !section) return;
  const normUser = userKey.trim().toLowerCase();
  const normSection = section.trim().toLowerCase();
  inMemoryNotificationReads.set(`${normUser}:${normSection}`, new Date(Date.now() + 2000).toISOString());

  const p = getDbPool();
  if (!p) return;

  try {
    await ensureSchemaColumns(p);
    await p.query(
      `INSERT INTO notification_reads (user_key, section, last_seen_at)
       VALUES (
         $1,
         $2,
         GREATEST(
           now(),
           COALESCE((SELECT MAX(COALESCE(updated_at, received_at, created_at)) FROM submissions), now()),
           COALESCE((SELECT MAX(COALESCE(updated_at, created_at)) FROM inspections), now()),
           COALESCE((SELECT MAX(COALESCE(updated_at, created_at)) FROM listings), now()),
           COALESCE((SELECT MAX(created_at) FROM users), now())
         )
       )
       ON CONFLICT (user_key, section)
       DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at`,
      [normUser, normSection]
    );
  } catch (err) {
    console.warn('[fdp:db] markSectionNotificationsSeen warning:', err);
  }
}

export async function getLiveNotificationCounts(
  agentId?: string,
  isAgent?: boolean,
  userKey?: string,
  activeSection?: string
): Promise<{
  consultations: number;
  enquiries: number;
  inspections: number;
  compliance: number;
  listings: number;
  agents: number;
  rates: number;
}> {
  const effectiveUserKey = (userKey || agentId || (isAgent ? 'agent-default' : 'admin-default')).trim().toLowerCase();
  const currentActive = activeSection ? activeSection.trim().toLowerCase() : '';

  if (currentActive) {
    await markSectionNotificationsSeen(effectiveUserKey, currentActive);
  }

  const getMemSeen = (sec: string) => inMemoryNotificationReads.get(`${effectiveUserKey}:${sec}`) || null;

  const p = getDbPool();
  if (!p) {
    return {
      consultations: getMemSeen('consultations') ? 0 : 1,
      enquiries: getMemSeen('enquiries') ? 0 : 1,
      inspections: getMemSeen('inspections') ? 0 : 1,
      compliance: 0,
      listings: 0,
      agents: 0,
      rates: getMemSeen('rates') ? 0 : getScrapedLogs().filter((l) => l.status === 'PENDING_REVIEW').length,
    };
  }

  try {
    await ensureSchemaColumns(p);

    const seenRes = await p
      .query(`SELECT section, last_seen_at FROM notification_reads WHERE user_key = $1`, [effectiveUserKey])
      .catch(() => ({ rows: [] as any[] }));

    const seenMap: Record<string, string> = {};
    for (const r of seenRes.rows) {
      if (r.section && r.last_seen_at) {
        seenMap[String(r.section).toLowerCase()] = new Date(r.last_seen_at).toISOString();
      }
    }
    for (const [k, v] of inMemoryNotificationReads.entries()) {
      if (k.startsWith(`${effectiveUserKey}:`)) {
        const sec = k.slice(effectiveUserKey.length + 1);
        if (!seenMap[sec] || new Date(v) > new Date(seenMap[sec])) {
          seenMap[sec] = v;
        }
      }
    }

    // Initialize baseline for static catalog sections (listings, agents) on first check so existing seed catalog doesn't show a badge until something new is added
    for (const baseSec of ['listings', 'agents']) {
      if (!seenMap[baseSec]) {
        await markSectionNotificationsSeen(effectiveUserKey, baseSec);
        seenMap[baseSec] = new Date().toISOString();
      }
    }

    const buildQuery = (
      sectionKey: string,
      baseSql: string,
      tsExpr: string,
      extraParams: any[] = []
    ): Promise<{ rows: { count: string }[] }> => {
      if (currentActive === sectionKey) {
        return Promise.resolve({ rows: [{ count: '0' }] });
      }
      const seenAt = seenMap[sectionKey];
      if (seenAt) {
        const paramIdx = extraParams.length + 1;
        return p
          .query(`${baseSql} AND ${tsExpr} > $${paramIdx}::timestamptz`, [...extraParams, seenAt])
          .catch(() => ({ rows: [{ count: '0' }] }));
      }
      return p.query(baseSql, extraParams).catch(() => ({ rows: [{ count: '0' }] }));
    };

    // If agent portal, compute counts using resolveAgentProfile-aware helpers so UUID, fallback IDs, officer names, and open queue items all match consistently
    if (isAgent) {
      const [agentConsults, agentEnquiries, agentInspections] = await Promise.all([
        getLiveSubmissions('contact', agentId).catch(() => []),
        getLiveSubmissions('enquiry', agentId).catch(() => []),
        getLiveInspections(agentId).catch(() => []),
      ]);

      const countUnseen = (sec: string, items: any[], getTs: (item: any) => string | null | undefined) => {
        if (currentActive === sec) return 0;
        const seenAt = seenMap[sec];
        if (!seenAt) return items.length;
        const seenTime = new Date(seenAt).getTime();
        return items.filter((it) => {
          const ts = getTs(it);
          return ts ? new Date(ts).getTime() > seenTime : false;
        }).length;
      };

      const openConsults = agentConsults.filter((s: any) => !s.closedAt && s.status !== 'closed');
      const openEnquiries = agentEnquiries.filter((s: any) => !s.closedAt && s.status !== 'closed');
      const openInspections = agentInspections.filter((i: any) => (Number(i.stage) || 1) < 9 && !i.currentStepDone);

      const lRes = await buildQuery(
        'listings',
        agentId ? `SELECT count(*) FROM listings WHERE assigned_agent_id = $1` : `SELECT count(*) FROM listings WHERE true`,
        'COALESCE(updated_at, created_at)',
        agentId ? [agentId] : []
      );

      return {
        consultations: countUnseen('consultations', openConsults, (s) => s.updatedAt || s.receivedAt || s.createdAt),
        enquiries: countUnseen('enquiries', openEnquiries, (s) => s.updatedAt || s.receivedAt || s.createdAt),
        inspections: countUnseen('inspections', openInspections, (i) => i.updatedAt || i.createdAt),
        compliance: 0,
        listings: parseInt(lRes.rows[0]?.count || '0', 10),
        agents: 0,
        rates: 0,
      };
    }

    // Admin portal queries
    const consultBase = `SELECT count(*) FROM submissions WHERE collection = 'contact' AND closed_at IS NULL`;
    const enquiryBase = `SELECT count(*) FROM submissions WHERE collection = 'enquiry' AND closed_at IS NULL`;
    const insBase = `SELECT count(*) FROM inspections WHERE stage < 9`;
    const dsrBase = `SELECT count(*) FROM submissions WHERE collection IN ('dsr', 'snag') AND closed_at IS NULL`;
    const listingsBase = `SELECT count(*) FROM listings WHERE true`;
    const agentsBase = `SELECT count(*) FROM users WHERE true`;

    const [cRes, eRes, iRes, dRes, lRes, aRes] = await Promise.all([
      buildQuery('consultations', consultBase, 'COALESCE(updated_at, received_at, created_at)'),
      buildQuery('enquiries', enquiryBase, 'COALESCE(updated_at, received_at, created_at)'),
      buildQuery('inspections', insBase, 'COALESCE(updated_at, created_at)'),
      buildQuery('compliance', dsrBase, 'COALESCE(updated_at, received_at, created_at)'),
      buildQuery('listings', listingsBase, 'COALESCE(updated_at, created_at)'),
      buildQuery('agents', agentsBase, 'created_at'),
    ]);

    // 7. Rates & Scraper (Admin only)
    let ratesCount = 0;
    if (!isAgent && currentActive !== 'rates') {
      const pendingLogs = getScrapedLogs().filter((l) => l.status === 'PENDING_REVIEW');
      const seenRatesAt = seenMap['rates'];
      if (seenRatesAt) {
        ratesCount = pendingLogs.filter((l) => new Date(l.detectedAt) > new Date(seenRatesAt)).length;
      } else {
        ratesCount = pendingLogs.length;
      }
    }

    return {
      consultations: parseInt(cRes.rows[0]?.count || '0', 10),
      enquiries: parseInt(eRes.rows[0]?.count || '0', 10),
      inspections: parseInt(iRes.rows[0]?.count || '0', 10),
      compliance: parseInt(dRes.rows[0]?.count || '0', 10),
      listings: parseInt(lRes.rows[0]?.count || '0', 10),
      agents: parseInt(aRes.rows[0]?.count || '0', 10),
      rates: ratesCount,
    };
  } catch (err) {
    console.warn('[fdp:db] getLiveNotificationCounts error:', err);
    return { consultations: 0, enquiries: 0, inspections: 0, compliance: 0, listings: 0, agents: 0, rates: 0 };
  }
}

// ─── Submissions Queries ─────────────────────────────────────────────────────

export async function getLiveSubmissions(collection?: string, agentId?: string): Promise<any[]> {
  const defaultSubmissions = [
    {
      id: 'sub-demo-01',
      reference: 'FDP-CON-90214',
      collection: 'contact',
      receivedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      payload: {
        fullName: 'Ngozi Eze',
        email: 'ngozi.eze@gmail.com',
        phone: '+2348039876543',
        subject: 'Property Consultation & Due Diligence Advisory',
        preferredDate: '2026-11-15',
        budget: '₦150M - ₦300M',
        message: 'Looking to purchase a 4-bedroom detached duplex in Guzape or Katampe Extension. Need full legal verification.',
      },
      clientName: 'Ngozi Eze',
      clientEmail: 'ngozi.eze@gmail.com',
      clientPhone: '+2348039876543',
      assignedAgentName: 'Emeka Nwosu (Senior Surveyor)',
      assignedAgentId: 'agent-fallback-01',
      assignedAgent: { id: 'agent-fallback-01', name: 'Emeka Nwosu (Senior Surveyor)' },
      status: 'in_progress',
      closedAt: null,
      outcome: null,
    },
    {
      id: 'sub-demo-02',
      reference: 'FDP-ENQ-10492',
      collection: 'enquiry',
      receivedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      dueAt: new Date(Date.now() + 86400000 * 3).toISOString(),
      payload: {
        name: 'Tunde Bakare',
        email: 'tunde.b@diasporainvest.co.uk',
        phone: '+447911123456',
        propertyTitle: 'The Bel-Air Guzape Penthouse',
        propertyPrice: '₦450,000,000',
        buyerType: 'diaspora',
        financing: 'mortgage',
        preferredDate: '2026-11-20',
        message: 'Diaspora investor based in London. Want to arrange an inspection for my local representative next week.',
      },
      clientName: 'Tunde Bakare',
      clientEmail: 'tunde.b@diasporainvest.co.uk',
      clientPhone: '+447911123456',
      assignedAgentName: 'Aisha Bello (Field Surveyor)',
      assignedAgentId: 'agent-fallback-02',
      assignedAgent: { id: 'agent-fallback-02', name: 'Aisha Bello (Field Surveyor)' },
      status: 'in_progress',
      closedAt: null,
      outcome: null,
    },
    {
      id: 'sub-demo-03',
      reference: 'FDP-CON-88419',
      collection: 'contact',
      receivedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      dueAt: new Date(Date.now() + 86400000).toISOString(),
      payload: {
        fullName: 'Alhaji Musa Danladi',
        email: 'musa.danladi@kallc.ng',
        phone: '+2348021122334',
        subject: 'Commercial Land Acquisition',
        preferredDate: '2026-11-18',
        budget: '₦500M+',
        message: 'Interested in commercial plot in Central Business District Abuja with statutory C of O.',
      },
      clientName: 'Alhaji Musa Danladi',
      clientEmail: 'musa.danladi@kallc.ng',
      clientPhone: '+2348021122334',
      assignedAgentName: null,
      assignedAgentId: null,
      assignedAgent: null,
      status: 'pending',
      closedAt: null,
      outcome: null,
    },
  ];

  const p = getDbPool();
  const profile = agentId ? await resolveAgentProfile(p, agentId) : null;

  if (!p) {
    let list = defaultSubmissions;
    if (collection) list = list.filter((s) => s.collection === collection);
    if (profile) list = list.filter((s) => matchesAgentRecord(s, profile, true));
    return list;
  }

  await ensureSchemaColumns(p);

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (collection) {
    conditions.push(`s.collection = $${paramIdx++}`);
    params.push(collection);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const res = await p.query(
    `SELECT s.id, s.reference, s.collection, s.received_at as "receivedAt", s.due_at as "dueAt",
            s.payload, s.ip_hash as "ipHash", s.user_agent as "userAgent",
            s.closed_at as "closedAt", s.closed_by as "closedBy", s.outcome, s.created_at as "createdAt",
            COALESCE(s.updated_at, s.closed_at, s.received_at, s.created_at) as "updatedAt",
            COALESCE(s.status, s.payload->>'status', CASE WHEN s.closed_at IS NOT NULL THEN 'closed' WHEN s.assigned_agent_id IS NOT NULL OR s.assigned_agent IS NOT NULL THEN 'in_progress' ELSE 'pending' END) as status,
            s.assigned_agent as "assignedAgentName", s.assigned_agent_id as "assignedAgentId"
     FROM submissions s
     ${whereClause}
     ORDER BY s.received_at DESC`,
    params
  );

  const mapped = res.rows.map((row) => {
    const pl = row.payload || {};
    const assignedAgentId = row.assignedAgentId || pl.assignedAgentId || null;
    const assignedAgentName = row.assignedAgentName || pl.assignedAgent || null;
    const finalStatus = row.status || pl.status || (row.closedAt ? 'closed' : ((assignedAgentId || assignedAgentName) ? 'in_progress' : 'pending'));
    return {
      ...row,
      status: finalStatus,
      assignedAgentId,
      assignedAgentName,
      assignedAgent: (assignedAgentId || assignedAgentName) ? {
        id: assignedAgentId,
        name: assignedAgentName || 'Assigned Officer',
      } : null,
      clientName: pl.fullName || pl.name || pl.clientName || null,
      clientEmail: pl.email || pl.clientEmail || null,
      clientPhone: pl.phone || pl.clientPhone || pl.telephone || null,
    };
  });

  let baseList = mapped;
  if (baseList.length === 0) {
    baseList = collection ? defaultSubmissions.filter((s) => s.collection === collection) : defaultSubmissions;
  }

  if (profile) {
    return baseList.filter((s) => matchesAgentRecord(s, profile, true));
  }
  return baseList;
}

export async function closeLiveSubmission(
  id: string,
  outcome: string,
  closedBy: string,
  status: string = 'closed'
): Promise<any> {
  const p = getDbPool();
  if (!p) {
    return {
      id,
      outcome,
      closedBy,
      status,
      closedAt: status === 'closed' ? new Date().toISOString() : null,
      message: 'Outcome notes saved successfully.',
    };
  }

  try {
    await p.query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS outcome text,
      ADD COLUMN IF NOT EXISTS closed_by text,
      ADD COLUMN IF NOT EXISTS closed_at timestamp with time zone,
      ADD COLUMN IF NOT EXISTS status text;
    `);
  } catch (e) {}

  const isClosed = status === 'closed';

  const res = await p.query(
    `UPDATE submissions
     SET outcome = $2,
         status = $4,
         updated_at = now(),
         closed_by = CASE WHEN $4 = 'closed' THEN $3 ELSE closed_by END,
         closed_at = CASE WHEN $4 = 'closed' THEN COALESCE(closed_at, now()) ELSE NULL END,
         payload = jsonb_set(
           jsonb_set(COALESCE(payload, '{}'::jsonb), '{notes}', to_jsonb(COALESCE($2, ''))),
           '{status}', to_jsonb($4::text)
         )
     WHERE id::text = $1 OR reference = $1 
     RETURNING *`,
    [id, outcome, closedBy, status]
  );

  // If this submission is an inspection (e.g. FDP-INS-...), also sync into inspections table
  try {
    await p.query(`
      ALTER TABLE inspections 
      ADD COLUMN IF NOT EXISTS status text,
      ADD COLUMN IF NOT EXISTS outcome text,
      ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;
    `);
    await p.query(
      `UPDATE inspections
       SET status = $2,
           outcome = $3,
           notes = CASE 
             WHEN $3 != '' AND notes IS NOT NULL AND notes NOT LIKE '%' || $3 || '%' THEN notes || E'\nOfficer Outcome: ' || $3
             WHEN $3 != '' AND notes IS NULL THEN $3
             ELSE notes
           END,
           updated_at = now()
       WHERE id::text = $1 OR reference = $1`,
      [id, status, outcome || '']
    );
  } catch (insSyncErr) {
    console.warn('[fdp:db] Could not sync inspection outcome:', insSyncErr);
  }

  return res.rows[0] || { id, outcome, closedBy, status };
}

// ─── Financing Queries ───────────────────────────────────────────────────────

export async function getLiveFinancingRoutes(): Promise<FinancingRoute[]> {
  try {
    const p = getDbPool();
    if (!p) return defaultFinancingRoutes;

    const res = await p.query(
      `SELECT id, name, institution, interest_rate_pct as "interestRatePct",
              max_term_years as "maxTermYears", min_equity_pct as "minEquityPct",
              eligibility, best_for as "bestFor", constraints, last_verified as "lastVerified",
              verification_note as "verificationNote"
       FROM financing_routes
       ORDER BY interest_rate_pct ASC NULLS LAST`
    );

    if (res.rows.length === 0) return defaultFinancingRoutes;
    return res.rows.map((r) => ({
      ...r,
      interestRatePct: r.interestRatePct ? parseFloat(r.interestRatePct) : null,
      minEquityPct: r.minEquityPct ? parseFloat(r.minEquityPct) : null,
    }));
  } catch (err) {
    console.error('[fdp:db] getLiveFinancingRoutes error:', err);
    return defaultFinancingRoutes;
  }
}

export async function updateLiveFinancingRoute(id: string, updates: {
  name?: string;
  institution?: string;
  interestRatePct?: number | null;
  maxTermYears?: number | null;
  minEquityPct?: number | null;
  verificationNote?: string;
  lastVerified?: string;
}): Promise<any> {
  const p = getDbPool();
  if (!p) throw new Error('Database connection not available');

  const res = await p.query(
    `UPDATE financing_routes
     SET name = COALESCE($2, name),
         institution = COALESCE($3, institution),
         interest_rate_pct = COALESCE($4, interest_rate_pct),
         max_term_years = COALESCE($5, max_term_years),
         min_equity_pct = COALESCE($6, min_equity_pct),
         verification_note = COALESCE($7, verification_note),
         last_verified = COALESCE($8, last_verified),
         updated_at = now()
     WHERE id = $1
     RETURNING id, name, institution, interest_rate_pct as "interestRatePct",
               max_term_years as "maxTermYears", min_equity_pct as "minEquityPct",
               last_verified as "lastVerified", verification_note as "verificationNote"`,
    [
      id,
      updates.name || null,
      updates.institution || null,
      updates.interestRatePct !== undefined ? updates.interestRatePct : null,
      updates.maxTermYears !== undefined ? updates.maxTermYears : null,
      updates.minEquityPct !== undefined ? updates.minEquityPct : null,
      updates.verificationNote || null,
      updates.lastVerified || new Date().toISOString().slice(0, 10),
    ]
  );
  return res.rows[0];
}

// ─── Analytics Overview ──────────────────────────────────────────────────────

export async function getLiveAnalyticsOverview(agentId?: string): Promise<any> {
  const fallbackRecentInspections = [
    {
      id: 'ins-demo-1',
      reference: 'FDP-INS-890214',
      clientName: 'Dr. Chidi Okonkwo',
      stage: 4,
      assignedAgent: { name: 'Stephen Alaekwe (Field Surveyor)' },
    },
    {
      id: 'ins-demo-2',
      reference: 'FDP-INS-DEMO01',
      clientName: 'Amina Bello',
      stage: 8,
      assignedAgent: { name: 'Emeka Nwosu' },
    },
  ];

  const fallbackRecentSubmissions = [
    {
      id: 'sub-demo-1',
      reference: 'FDP-ENQ-10492',
      collection: 'enquiry',
      clientName: 'Tunde Bakare',
      closedAt: null,
      assignedAgent: { name: 'Emeka Nwosu' },
    },
    {
      id: 'sub-demo-2',
      reference: 'FDP-CON-90214',
      collection: 'contact',
      clientName: 'Ngozi Eze',
      closedAt: null,
      assignedAgent: null,
    },
  ];

  const pendingRateAlerts = getScrapedLogs().filter((l) => l.status === 'PENDING_REVIEW').length;

  try {
    const p = getDbPool();
    if (!p) {
      return {
        totalListings: defaultListings.length,
        activeInspections: 2,
        completedInspections: 1,
        pendingSubmissions: 3,
        priceAlertsCount: pendingRateAlerts,
        recentInspections: fallbackRecentInspections,
        recentSubmissions: fallbackRecentSubmissions,
      };
    }

    await ensureSchemaColumns(p);

    // If agentId is provided (Field Officer dashboard), use the profile-aware helpers so all metrics & tables match the agent sections
    if (agentId) {
      const [listingsCount, agentIns, agentSubs] = await Promise.all([
        p.query(`SELECT count(*) FROM listings`).catch(() => ({ rows: [{ count: '0' }] })),
        getLiveInspections(agentId).catch(() => []),
        getLiveSubmissions(undefined, agentId).catch(() => []),
      ]);

      const dbListingsTotal = parseInt(listingsCount.rows[0]?.count || '0', 10);
      const activeInspections = agentIns.filter((i: any) => (Number(i.stage) || 1) < 9).length;
      const completedInspections = agentIns.filter((i: any) => (Number(i.stage) || 1) >= 9).length;
      const actionableSubs = agentSubs.filter((s: any) => s.collection === 'enquiry' || s.collection === 'contact');
      const pendingSubmissions = actionableSubs.filter((s: any) => !s.closedAt && s.status !== 'closed').length;

      return {
        totalListings: dbListingsTotal > 0 ? dbListingsTotal : defaultListings.length,
        activeInspections,
        completedInspections,
        pendingSubmissions,
        priceAlertsCount: pendingRateAlerts,
        recentInspections: agentIns.slice(0, 5).map((r: any) => ({
          id: r.id,
          reference: r.reference,
          clientName: r.clientName || 'Anonymous Client',
          stage: r.stage || 1,
          assignedAgent: r.assignedAgent || (r.officerName ? { name: r.officerName } : null),
        })),
        recentSubmissions: actionableSubs.slice(0, 5).map((r: any) => ({
          id: r.id,
          reference: r.reference,
          collection: r.collection,
          clientName: r.clientName || 'Anonymous Client',
          closedAt: r.closedAt,
          status: r.status || (r.closedAt ? 'closed' : 'pending'),
          assignedAgent: r.assignedAgent || null,
        })),
      };
    }

    const [listingsCount, activeInsCount, compInsCount, subCount, recentIns, recentSubs] = await Promise.all([
      p.query(`SELECT count(*) FROM listings`).catch(() => ({ rows: [{ count: '0' }] })),
      p.query(`SELECT count(*) FROM inspections WHERE stage < 9`).catch(() => ({ rows: [{ count: '0' }] })),
      p.query(`SELECT count(*) FROM inspections WHERE stage >= 9`).catch(() => ({ rows: [{ count: '0' }] })),
      p.query(`SELECT count(*) FROM submissions WHERE closed_at IS NULL`).catch(() => ({ rows: [{ count: '0' }] })),
      p.query(
        `
        SELECT i.id, i.reference, 
               COALESCE(i.client_name, 'Anonymous Client') as "clientName", 
               i.stage, 
               COALESCE(NULLIF(i.officer_name, ''), NULLIF(i.assigned_agent, ''), u.name, '') as "assignedAgentName"
        FROM inspections i
        LEFT JOIN users u ON u.id::text = COALESCE(i.assigned_agent_id, i.agent_id)
        ORDER BY i.created_at DESC
        LIMIT 5
        `
      ).catch(() => ({ rows: [] })),
      p.query(
        `
        SELECT s.id, s.reference, s.collection,
               COALESCE(s.payload->>'fullName', s.payload->>'name', s.payload->>'clientName', 'Anonymous Client') as "clientName",
               s.closed_at as "closedAt",
               COALESCE(s.status, s.payload->>'status', CASE WHEN s.closed_at IS NOT NULL THEN 'closed' WHEN s.assigned_agent_id IS NOT NULL OR s.assigned_agent IS NOT NULL THEN 'in_progress' ELSE 'pending' END) as status,
               COALESCE(s.assigned_agent, s.payload->>'assignedAgent', '') as "assignedAgentName"
        FROM submissions s
        ORDER BY s.received_at DESC
        LIMIT 5
        `
      ).catch(() => ({ rows: [] })),
    ]);

    return {
      totalListings: parseInt(listingsCount.rows[0]?.count || '0', 10),
      activeInspections: parseInt(activeInsCount.rows[0]?.count || '0', 10),
      completedInspections: parseInt(compInsCount.rows[0]?.count || '0', 10),
      pendingSubmissions: parseInt(subCount.rows[0]?.count || '0', 10),
      priceAlertsCount: pendingRateAlerts,
      recentInspections: recentIns.rows.map((r: any) => ({
        id: r.id,
        reference: r.reference,
        clientName: r.clientName,
        stage: r.stage || 1,
        assignedAgent: r.assignedAgentName ? { name: r.assignedAgentName } : null,
      })),
      recentSubmissions: recentSubs.rows.map((r: any) => ({
        id: r.id,
        reference: r.reference,
        collection: r.collection,
        clientName: r.clientName,
        closedAt: r.closedAt,
        status: r.status || (r.closedAt ? 'closed' : 'pending'),
        assignedAgent: r.assignedAgentName ? { name: r.assignedAgentName } : null,
      })),
    };
  } catch (err) {
    console.error('[fdp:db] getLiveAnalyticsOverview error:', err);
    return {
      totalListings: defaultListings.length,
      activeInspections: 0,
      completedInspections: 0,
      pendingSubmissions: 0,
      priceAlertsCount: pendingRateAlerts,
      recentInspections: [],
      recentSubmissions: [],
    };
  }
}

// ─── User Authentication Queries ─────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<any | null> {
  const p = getDbPool();
  if (!p) return null;

  const res = await p.query(
    `SELECT id, name, email, password_hash as "passwordHash", role, phone, active
     FROM users
     WHERE LOWER(email) = LOWER($1) AND active = true LIMIT 1`,
    [email]
  );
  return res.rows[0] || null;
}

export async function getLiveUsers(): Promise<any[]> {
  const testAgents = getTestAgents();
  const p = getDbPool();
  if (!p) return testAgents;

  try {
    await ensureSchemaColumns(p);

    const [usersRes, insRes, listRes] = await Promise.all([
      p.query(
        `SELECT u.id, u.name, u.email, u.role, u.phone, u.active, u.created_at as "createdAt"
         FROM users u
         ORDER BY u.created_at ASC`
      ),
      p.query(
        `SELECT COALESCE(assigned_agent_id, agent_id, '') as "agentId",
                COALESCE(officer_name, assigned_agent, '') as "agentName"
         FROM inspections`
      ).catch(() => ({ rows: [] })),
      p.query(
        `SELECT COALESCE(assigned_agent_id, '') as "agentId",
                COALESCE(assigned_agent, '') as "agentName"
         FROM listings`
      ).catch(() => ({ rows: [] })),
    ]);

    const countForUser = (u: { id: string; name: string }) => {
      const uid = String(u.id || '').toLowerCase();
      const uname = String(u.name || '').toLowerCase();
      const baseName = uname.split('(')[0].trim();

      const assignedInspections = insRes.rows.filter((r: any) => {
        const rid = String(r.agentId || '').toLowerCase();
        const rname = String(r.agentName || '').toLowerCase();
        return (uid && rid === uid) || (baseName && rname && (rname === uname || rname.includes(baseName)));
      }).length;

      const assignedListings = listRes.rows.filter((r: any) => {
        const rid = String(r.agentId || '').toLowerCase();
        const rname = String(r.agentName || '').toLowerCase();
        return (uid && rid === uid) || (baseName && rname && (rname === uname || rname.includes(baseName)));
      }).length;

      return { assignedInspections, assignedListings };
    };

    const dbUsers = usersRes.rows.map((row) => ({
      ...row,
      _count: countForUser(row),
    }));

    const dbEmails = new Set(dbUsers.map((u: any) => u.email.toLowerCase()));
    const additionalTestAgents = testAgents
      .filter((a) => !dbEmails.has(a.email.toLowerCase()))
      .map((a) => ({
        ...a,
        _count: countForUser(a),
      }));

    return [...dbUsers, ...additionalTestAgents];
  } catch (err) {
    console.error('[fdp:db] getLiveUsers error:', err);
    return testAgents;
  }
}
