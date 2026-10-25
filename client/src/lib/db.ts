// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - POSTGRESQL DATABASE CLIENT
// ══════════════════════════════════════════════════════════════════════════════

import { Pool, type PoolConfig } from 'pg';
import { listings as defaultListings, type Listing, type ListingSource, type PropertyType, type City, type ListingSort } from '@/data/listings';
import { financingRoutes as defaultFinancingRoutes, type FinancingRoute } from '@/data/financing';

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

export async function getLiveInspections(agentId?: string): Promise<any[]> {
  const p = getDbPool();
  if (!p) return [];

  const sql = `
    SELECT i.id, i.reference, i.client_name as "clientName", i.client_email as "clientEmail",
           i.client_phone as "clientPhone", i.property_title as "propertyTitle",
           i.property_location as "propertyLocation", i.stage, i.officer_name as "officerName",
           i.scheduled_date as "scheduledDate", i.notes, i.created_at as "createdAt"
    FROM inspections i
    ORDER BY i.created_at DESC
  `;
  const res = await p.query(sql);
  return res.rows;
}

export async function getLiveInspectionByRef(reference: string): Promise<any | null> {
  const p = getDbPool();
  if (!p) return null;

  const res = await p.query(
    `SELECT id, reference, client_name as "clientName", client_email as "clientEmail",
            client_phone as "clientPhone", property_title as "propertyTitle",
            property_location as "propertyLocation", stage, officer_name as "officerName",
            scheduled_date as "scheduledDate", notes, created_at as "createdAt"
     FROM inspections
     WHERE reference = $1 LIMIT 1`,
    [reference]
  );
  return res.rows[0] || null;
}

export async function updateLiveInspectionStage(id: string, stage: number, notes?: string): Promise<any> {
  const p = getDbPool();
  if (!p) throw new Error('Database not configured');

  const res = await p.query(
    `UPDATE inspections
     SET stage = $2, notes = COALESCE($3, notes), updated_at = now()
     WHERE id = $1 RETURNING *`,
    [id, stage, notes]
  );
  return res.rows[0];
}

// ─── Submissions Queries ─────────────────────────────────────────────────────

export async function getLiveSubmissions(collection?: string): Promise<any[]> {
  const p = getDbPool();
  if (!p) return [];

  const cond = collection ? 'WHERE collection = $1' : '';
  const params = collection ? [collection] : [];

  const res = await p.query(
    `SELECT id, reference, collection, received_at as "receivedAt", due_at as "dueAt",
            payload, ip_hash as "ipHash", user_agent as "userAgent",
            closed_at as "closedAt", closed_by as "closedBy", outcome, created_at as "createdAt"
     FROM submissions
     ${cond}
     ORDER BY received_at DESC`,
    params
  );
  return res.rows;
}

export async function closeLiveSubmission(id: string, outcome: string, closedBy: string): Promise<any> {
  const p = getDbPool();
  if (!p) throw new Error('Database not configured');

  const res = await p.query(
    `UPDATE submissions
     SET closed_at = now(), outcome = $2, closed_by = $3
     WHERE id = $1 RETURNING *`,
    [id, outcome, closedBy]
  );
  return res.rows[0];
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

// ─── Analytics Overview ──────────────────────────────────────────────────────

export async function getLiveAnalyticsOverview(): Promise<any> {
  try {
    const p = getDbPool();
    if (!p) {
      return {
        totalListings: defaultListings.length,
        activeInspections: 2,
        completedInspections: 1,
        pendingSubmissions: 3,
        priceAlertsCount: 0,
      };
    }

    const [listingsCount, activeInsCount, compInsCount, subCount] = await Promise.all([
      p.query(`SELECT count(*) FROM listings`),
      p.query(`SELECT count(*) FROM inspections WHERE stage < 9`),
      p.query(`SELECT count(*) FROM inspections WHERE stage >= 9`),
      p.query(`SELECT count(*) FROM submissions WHERE closed_at IS NULL`),
    ]);

    return {
      totalListings: parseInt(listingsCount.rows[0].count, 10),
      activeInspections: parseInt(activeInsCount.rows[0].count, 10),
      completedInspections: parseInt(compInsCount.rows[0].count, 10),
      pendingSubmissions: parseInt(subCount.rows[0].count, 10),
      priceAlertsCount: 0,
    };
  } catch (err) {
    console.error('[fdp:db] getLiveAnalyticsOverview error:', err);
    return {
      totalListings: defaultListings.length,
      activeInspections: 2,
      completedInspections: 1,
      pendingSubmissions: 3,
      priceAlertsCount: 0,
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
  const p = getDbPool();
  if (!p) return [];

  const res = await p.query(
    `SELECT id, name, email, role, phone, active, created_at as "createdAt"
     FROM users
     ORDER BY created_at ASC`
  );
  return res.rows;
}
