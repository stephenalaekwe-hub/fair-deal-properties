// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - POSTGRESQL DATABASE CLIENT
// ══════════════════════════════════════════════════════════════════════════════

import { Pool, type PoolConfig } from 'pg';
import { listings as defaultListings, type Listing, type ListingSource, type PropertyType, type City, type ListingSort } from '@/data/listings';
import { financingRoutes as defaultFinancingRoutes, type FinancingRoute } from '@/data/financing';
import { getTestAgents } from './agentsStore';

let pool: Pool | null = null;

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
             tags, amenities, verification_status as "verificationStatus"
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
  return {
    ...row,
    priceMillionsNGN: row.priceMillionsNGN ? parseFloat(row.priceMillionsNGN) : null,
    badges: typeof row.badges === 'string' ? JSON.parse(row.badges) : (row.badges || []),
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : (row.amenities || []),
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

export async function getLiveInspections(agentId?: string): Promise<any[]> {
  const p = getDbPool();
  if (!p) {
    if (agentId) return defaultInspections.filter((i) => i.assignedAgentId === agentId);
    return defaultInspections;
  }

  try {
    await p.query(`
      ALTER TABLE inspections 
      ADD COLUMN IF NOT EXISTS assigned_agent text,
      ADD COLUMN IF NOT EXISTS assigned_agent_id text,
      ADD COLUMN IF NOT EXISTS agent_id text,
      ADD COLUMN IF NOT EXISTS report_url text,
      ADD COLUMN IF NOT EXISTS officer_name text;
    `);
  } catch (e) {
    // Ignore schema errors
  }

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
           i.created_at as "createdAt",
           CASE 
             WHEN u.name IS NOT NULL THEN json_build_object('id', u.id, 'name', u.name, 'email', u.email)
             WHEN i.assigned_agent IS NOT NULL AND i.assigned_agent != '' THEN json_build_object('id', COALESCE(i.assigned_agent_id, i.agent_id, ''), 'name', i.assigned_agent)
             WHEN i.officer_name IS NOT NULL AND i.officer_name != '' THEN json_build_object('name', i.officer_name)
             ELSE NULL
           END as "assignedAgent"
    FROM inspections i
    LEFT JOIN users u ON u.id::text = COALESCE(i.assigned_agent_id, i.agent_id)
    WHERE ($1::text IS NULL OR $1 = '' OR COALESCE(i.assigned_agent_id, i.agent_id) = $1)
    ORDER BY i.created_at DESC
  `;
  const res = await p.query(sql, [agentId || null]);
  return res.rows.map((row) => {
    const assignedAgentId = row.assignedAgentId || row.assignedAgent?.id || null;
    const assignedAgentName = row.assignedAgent?.name || row.officerName || null;
    let cleanNotes = row.notes || '';
    let reportUrl = row.reportUrl || '';
    const photoMatch = cleanNotes.match(/Attached Survey \/ Site Photograph:\s*([^\n\r]+)/i);
    if (photoMatch) {
      if (!reportUrl) reportUrl = photoMatch[1].trim();
      cleanNotes = cleanNotes.replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/i, '').trim();
    }
    return {
      ...row,
      notes: cleanNotes,
      reportUrl,
      assignedAgentId,
      assignedAgent: assignedAgentName ? {
        id: assignedAgentId,
        name: assignedAgentName,
        email: row.assignedAgent?.email || null,
      } : null,
    };
  });
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
                CASE WHEN s.status = 'closed' OR s.status = 'resolved' THEN 9 ELSE 2 END as stage,
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

  const isCompleted = row.status === 'closed' || row.status === 'resolved' || row.stage >= 9;
  const effectiveStage = isCompleted ? 9 : Math.max(1, Math.min(9, row.stage || 1));
  const officerMessage = row.outcome || cleanNotes || null;

  return {
    ...row,
    stage: effectiveStage,
    isCompleted,
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
  reportUrl?: string
): Promise<any> {
  const p = getDbPool();
  if (!p) {
    return {
      id,
      stage,
      notes: notes || '',
      officerName: officerName || '',
      reportUrl: reportUrl || '',
      message: 'Inspection stage and notes updated successfully.',
    };
  }

  try {
    await p.query(`
      ALTER TABLE inspections 
      ADD COLUMN IF NOT EXISTS report_url text,
      ADD COLUMN IF NOT EXISTS officer_name text;
    `);
  } catch (e) {}

  const res = await p.query(
    `UPDATE inspections
     SET stage = $2,
         notes = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE notes END,
         officer_name = CASE WHEN $4::text IS NOT NULL AND $4 != '' THEN $4 ELSE officer_name END,
         report_url = CASE WHEN $5::text IS NOT NULL AND $5 != '' THEN $5 ELSE report_url END,
         updated_at = now()
     WHERE id::text = $1 OR reference = $1 RETURNING *`,
    [id, stage, notes !== undefined ? notes : null, officerName ?? null, reportUrl ?? null]
  );
  return res.rows[0] || { id, stage, notes, officerName, reportUrl };
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
  if (!p) {
    let list = defaultSubmissions;
    if (collection) list = list.filter((s) => s.collection === collection);
    if (agentId) list = list.filter((s) => s.assignedAgentId === agentId);
    return list;
  }

  try {
    await p.query(`
      ALTER TABLE submissions 
      ADD COLUMN IF NOT EXISTS assigned_agent text,
      ADD COLUMN IF NOT EXISTS assigned_agent_id text,
      ADD COLUMN IF NOT EXISTS status text,
      ADD COLUMN IF NOT EXISTS outcome text,
      ADD COLUMN IF NOT EXISTS closed_by text,
      ADD COLUMN IF NOT EXISTS closed_at timestamp with time zone;
    `);
  } catch (e) {
    // Ignore if column exists or schema is read-only
  }

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (collection) {
    conditions.push(`s.collection = $${paramIdx++}`);
    params.push(collection);
  }
  if (agentId) {
    conditions.push(`(s.assigned_agent_id = $${paramIdx++} OR s.payload->>'assignedAgentId' = $${paramIdx - 1})`);
    params.push(agentId);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const res = await p.query(
    `SELECT s.id, s.reference, s.collection, s.received_at as "receivedAt", s.due_at as "dueAt",
            s.payload, s.ip_hash as "ipHash", s.user_agent as "userAgent",
            s.closed_at as "closedAt", s.closed_by as "closedBy", s.outcome, s.created_at as "createdAt",
            COALESCE(s.status, s.payload->>'status', CASE WHEN s.closed_at IS NOT NULL THEN 'closed' WHEN s.assigned_agent_id IS NOT NULL OR s.assigned_agent IS NOT NULL THEN 'in_progress' ELSE 'pending' END) as status,
            s.assigned_agent as "assignedAgentName", s.assigned_agent_id as "assignedAgentId"
     FROM submissions s
     ${whereClause}
     ORDER BY s.received_at DESC`,
    params
  );

  if (res.rows.length === 0 && (!agentId || agentId.includes('fallback'))) {
    let list = defaultSubmissions;
    if (collection) list = list.filter((s) => s.collection === collection);
    if (agentId) list = list.filter((s) => s.assignedAgentId === agentId);
    if (list.length > 0) return list;
  }

  return res.rows.map((row) => {
    const p = row.payload || {};
    const assignedAgentId = row.assignedAgentId || p.assignedAgentId || null;
    const assignedAgentName = row.assignedAgentName || p.assignedAgent || null;
    const finalStatus = row.status || p.status || (row.closedAt ? 'closed' : ((assignedAgentId || assignedAgentName) ? 'in_progress' : 'pending'));
    return {
      ...row,
      status: finalStatus,
      assignedAgentId,
      assignedAgent: (assignedAgentId || assignedAgentName) ? {
        id: assignedAgentId,
        name: assignedAgentName || 'Assigned Officer',
      } : null,
      clientName: p.fullName || p.name || p.clientName || null,
      clientEmail: p.email || p.clientEmail || null,
      clientPhone: p.phone || p.clientPhone || p.telephone || null,
    };
  });
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
           stage = CASE WHEN $2 = 'closed' OR $2 = 'resolved' THEN 9 ELSE stage END,
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

  try {
    const p = getDbPool();
    if (!p) {
      return {
        totalListings: defaultListings.length,
        activeInspections: 2,
        completedInspections: 1,
        pendingSubmissions: 3,
        priceAlertsCount: 4,
        recentInspections: fallbackRecentInspections,
        recentSubmissions: fallbackRecentSubmissions,
      };
    }

    const insWhere = agentId ? `AND (COALESCE(assigned_agent_id, agent_id) = '${agentId}')` : '';
    const subWhere = agentId ? `AND (assigned_agent_id = '${agentId}')` : '';

    const [listingsCount, activeInsCount, compInsCount, subCount, recentIns, recentSubs] = await Promise.all([
      p.query(`SELECT count(*) FROM listings`),
      p.query(`SELECT count(*) FROM inspections WHERE stage < 9 ${insWhere}`),
      p.query(`SELECT count(*) FROM inspections WHERE stage >= 9 ${insWhere}`),
      p.query(`SELECT count(*) FROM submissions WHERE closed_at IS NULL ${subWhere}`),
      p.query(`
        SELECT i.id, i.reference, 
               COALESCE(i.client_name, 'Anonymous Client') as "clientName", 
               i.stage, 
               COALESCE(i.officer_name, u.name, '') as "assignedAgentName"
        FROM inspections i
        LEFT JOIN users u ON u.id::text = COALESCE(i.assigned_agent_id, i.agent_id)
        ${agentId ? `WHERE COALESCE(i.assigned_agent_id, i.agent_id) = '${agentId}'` : ''}
        ORDER BY i.created_at DESC
        LIMIT 5
      `),
      p.query(`
        SELECT s.id, s.reference, s.collection,
               COALESCE(s.client_name, s.payload->>'fullName', s.payload->>'name', 'Anonymous Client') as "clientName",
               s.closed_at as "closedAt"
        FROM submissions s
        ${agentId ? `WHERE s.assigned_agent_id = '${agentId}'` : ''}
        ORDER BY s.received_at DESC
        LIMIT 5
      `),
    ]);

    return {
      totalListings: parseInt(listingsCount.rows[0].count, 10),
      activeInspections: parseInt(activeInsCount.rows[0].count, 10),
      completedInspections: parseInt(compInsCount.rows[0].count, 10),
      pendingSubmissions: parseInt(subCount.rows[0].count, 10),
      priceAlertsCount: 4,
      recentInspections: recentIns.rows.length > 0 
        ? recentIns.rows.map((r: any) => ({
            id: r.id,
            reference: r.reference,
            clientName: r.clientName,
            stage: r.stage || 1,
            assignedAgent: r.assignedAgentName ? { name: r.assignedAgentName } : null,
          }))
        : fallbackRecentInspections,
      recentSubmissions: recentSubs.rows.length > 0
        ? recentSubs.rows.map((r: any) => ({
            id: r.id,
            reference: r.reference,
            collection: r.collection,
            clientName: r.clientName,
            closedAt: r.closedAt,
          }))
        : fallbackRecentSubmissions,
    };
  } catch (err) {
    console.error('[fdp:db] getLiveAnalyticsOverview error:', err);
    return {
      totalListings: defaultListings.length,
      activeInspections: 2,
      completedInspections: 1,
      pendingSubmissions: 3,
      priceAlertsCount: 4,
      recentInspections: fallbackRecentInspections,
      recentSubmissions: fallbackRecentSubmissions,
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
    const res = await p.query(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.active, u.created_at as "createdAt",
              COALESCE((SELECT count(*) FROM inspections i WHERE COALESCE(i.assigned_agent_id, i.agent_id) = u.id::text), 0) as "inspectionsCount",
              COALESCE((SELECT count(*) FROM listings l WHERE l.assigned_agent_id = u.id::text), 0) as "listingsCount"
       FROM users u
       ORDER BY u.created_at ASC`
    );

    const dbUsers = res.rows.map((row) => ({
      ...row,
      _count: {
        assignedInspections: parseInt(row.inspectionsCount, 10),
        assignedListings: parseInt(row.listingsCount, 10),
      },
    }));

    // If DB has users, merge any unique test agents so all test profiles remain available for demonstration
    const dbEmails = new Set(dbUsers.map((u: any) => u.email.toLowerCase()));
    const additionalTestAgents = testAgents.filter((a) => !dbEmails.has(a.email.toLowerCase()));

    return [...dbUsers, ...additionalTestAgents];
  } catch (err) {
    console.error('[fdp:db] getLiveUsers error:', err);
    return testAgents;
  }
}
