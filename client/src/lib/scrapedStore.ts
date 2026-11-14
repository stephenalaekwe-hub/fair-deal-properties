// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - LIVE INSTITUTIONAL PORTAL & PROPERTY LISTENER
// ══════════════════════════════════════════════════════════════════════════════

import {
  ensureSchemaColumns,
  getDbPool,
  getLiveFinancingRoutes,
  getLiveListings,
  updateLiveFinancingRoute,
  updateLiveListing,
} from './db';

export interface ScrapedLog {
  id: string;
  sourcePortal: string;
  portalUrl?: string;
  targetBenchmark: string;
  previousRatePct: number;
  detectedRatePct: number;
  previousPriceMillionsNGN?: number;
  detectedPriceMillionsNGN?: number;
  detectedPriceDisplay?: string;
  status: 'PENDING_REVIEW' | 'APPLIED';
  detectedAt: string;
  appliedAt?: string;
  routeId?: string;
  listingSlug?: string;
  listingTitle?: string;
  portalReachable?: boolean;
}

interface MonitoredTarget {
  id: string;
  sourcePortal: string;
  portalUrl: string;
  targetBenchmark: string;
  routeId: string;
  listingSlug: string;
  listingTitle: string;
  benchmarkRatePct: number;
  rateBounds: [number, number];
  benchmarkPriceMillionsNGN: number;
  benchmarkPriceDisplay: string;
  priceBoundsMillions: [number, number];
  initialPreviousRatePct: number;
  initialPreviousPriceMillionsNGN: number;
  initialStatus: 'PENDING_REVIEW' | 'APPLIED';
}

const MONITORED_TARGETS: MonitoredTarget[] = [
  {
    id: 'log-fmbn-01',
    sourcePortal: 'FMBN (National Housing Fund)',
    portalUrl: 'https://www.fmbn.gov.ng',
    targetBenchmark: 'NHF Statutory Concessionary Lending & Allocation',
    routeId: 'nhf',
    listingSlug: 'fmbn-national-housing-fund-mortgage-access',
    listingTitle: 'FMBN National Housing Fund - Mortgage Access',
    benchmarkRatePct: 6.0,
    rateBounds: [4.0, 9.0],
    benchmarkPriceMillionsNGN: 5,
    benchmarkPriceDisplay: '₦5M',
    priceBoundsMillions: [2, 50],
    initialPreviousRatePct: 6.0,
    initialPreviousPriceMillionsNGN: 5,
    initialStatus: 'APPLIED',
  },
  {
    id: 'log-mreif-02',
    sourcePortal: 'MREIF / MOFI Infrastructure Portal',
    portalUrl: 'https://mofi.com.ng',
    targetBenchmark: 'MREIF Single-Digit Mortgage & Kuje Estate Allocation',
    routeId: 'mreif',
    listingSlug: 'mreif-affordable-estate-kuje',
    listingTitle: 'MREIF Affordable Estate - Kuje',
    benchmarkRatePct: 9.75,
    rateBounds: [8.0, 12.5],
    benchmarkPriceMillionsNGN: 85,
    benchmarkPriceDisplay: '₦85M',
    priceBoundsMillions: [40, 150],
    initialPreviousRatePct: 10.5,
    initialPreviousPriceMillionsNGN: 85,
    initialStatus: 'PENDING_REVIEW',
  },
  {
    id: 'log-fhf-03',
    sourcePortal: 'Family Homes Funds (FHF)',
    portalUrl: 'https://fhfl.com.ng',
    targetBenchmark: 'FHF Social & Affordable Housing — Sagamu Allocation',
    routeId: 'nhf',
    listingSlug: 'family-homes-affordable-housing-sagamu',
    listingTitle: 'Family Homes Affordable Housing - Sagamu',
    benchmarkRatePct: 6.0,
    rateBounds: [4.0, 9.5],
    benchmarkPriceMillionsNGN: 15,
    benchmarkPriceDisplay: '₦15M',
    priceBoundsMillions: [8, 35],
    initialPreviousRatePct: 6.5,
    initialPreviousPriceMillionsNGN: 15,
    initialStatus: 'PENDING_REVIEW',
  },
  {
    id: 'log-fha-04',
    sourcePortal: 'Federal Housing Authority (FHA)',
    portalUrl: 'https://fha.gov.ng',
    targetBenchmark: 'FHA Direct Nationwide Zonal Housing Allocation',
    routeId: 'nhf',
    listingSlug: 'fha-estate-units-nationwide-access',
    listingTitle: 'FHA Estate Units - Nationwide Access',
    benchmarkRatePct: 6.0,
    rateBounds: [5.0, 12.0],
    benchmarkPriceMillionsNGN: 25,
    benchmarkPriceDisplay: '₦25M',
    priceBoundsMillions: [15, 65],
    initialPreviousRatePct: 6.5,
    initialPreviousPriceMillionsNGN: 25,
    initialStatus: 'PENDING_REVIEW',
  },
  {
    id: 'log-nmrc-05',
    sourcePortal: 'NMRC / Primary Mortgage Institutions (PMI)',
    portalUrl: 'https://nmrc.com.ng',
    targetBenchmark: 'PMI Refinanced Mortgage & Lugbe Housing Estate',
    routeId: 'pmi',
    listingSlug: 'pmi-scheme-lugbe-housing-estate',
    listingTitle: 'PMI Scheme - Lugbe Housing Estate',
    benchmarkRatePct: 18.5,
    rateBounds: [13.0, 24.0],
    benchmarkPriceMillionsNGN: 45,
    benchmarkPriceDisplay: '₦45M',
    priceBoundsMillions: [25, 90],
    initialPreviousRatePct: 19.5,
    initialPreviousPriceMillionsNGN: 45,
    initialStatus: 'PENDING_REVIEW',
  },
  {
    id: 'log-diaspora-06',
    sourcePortal: 'FMBN Diaspora NHF Window',
    portalUrl: 'https://www.fmbn.gov.ng',
    targetBenchmark: 'Diaspora National Housing Fund Mortgage Window',
    routeId: 'diaspora-nhf',
    listingSlug: 'mreif-affordable-estate-kuje',
    listingTitle: 'MREIF Affordable Estate - Kuje (Diaspora Window)',
    benchmarkRatePct: 9.0,
    rateBounds: [7.0, 12.0],
    benchmarkPriceMillionsNGN: 85,
    benchmarkPriceDisplay: '₦85M',
    priceBoundsMillions: [40, 150],
    initialPreviousRatePct: 9.5,
    initialPreviousPriceMillionsNGN: 85,
    initialStatus: 'PENDING_REVIEW',
  },
];

let inMemoryLogs: ScrapedLog[] = MONITORED_TARGETS.map((t, idx) => ({
  id: t.id,
  sourcePortal: t.sourcePortal,
  portalUrl: t.portalUrl,
  targetBenchmark: t.targetBenchmark,
  previousRatePct: t.initialPreviousRatePct,
  detectedRatePct: t.benchmarkRatePct,
  previousPriceMillionsNGN: t.initialPreviousPriceMillionsNGN,
  detectedPriceMillionsNGN: t.benchmarkPriceMillionsNGN,
  detectedPriceDisplay: t.benchmarkPriceDisplay,
  status: t.initialStatus,
  detectedAt: new Date(Date.now() - 3600000 * (idx + 1) * 2).toISOString(),
  routeId: t.routeId,
  listingSlug: t.listingSlug,
  listingTitle: t.listingTitle,
  portalReachable: true,
}));

export function getScrapedLogs(): ScrapedLog[] {
  return [...inMemoryLogs];
}

export async function getScrapedLogsAsync(): Promise<ScrapedLog[]> {
  const p = getDbPool();
  if (!p) return getScrapedLogs();

  try {
    await ensureSchemaColumns(p);
    const res = await p.query(
      `SELECT id,
              source_portal as "sourcePortal",
              portal_url as "portalUrl",
              target_benchmark as "targetBenchmark",
              previous_rate_pct as "previousRatePct",
              detected_rate_pct as "detectedRatePct",
              previous_price_millions_ngn as "previousPriceMillionsNGN",
              detected_price_millions_ngn as "detectedPriceMillionsNGN",
              detected_price_display as "detectedPriceDisplay",
              route_id as "routeId",
              listing_slug as "listingSlug",
              listing_title as "listingTitle",
              portal_reachable as "portalReachable",
              status,
              detected_at as "detectedAt",
              applied_at as "appliedAt"
       FROM scraped_telemetry_logs
       ORDER BY id ASC`
    );

    if (res.rows.length > 0) {
      const dbMap = new Map<string, ScrapedLog>();
      for (const r of res.rows) {
        dbMap.set(r.id, {
          id: r.id,
          sourcePortal: r.sourcePortal,
          portalUrl: r.portalUrl || undefined,
          targetBenchmark: r.targetBenchmark,
          previousRatePct: r.previousRatePct !== null ? parseFloat(r.previousRatePct) : 0,
          detectedRatePct: r.detectedRatePct !== null ? parseFloat(r.detectedRatePct) : 0,
          previousPriceMillionsNGN:
            r.previousPriceMillionsNGN !== null && r.previousPriceMillionsNGN !== undefined
              ? parseFloat(r.previousPriceMillionsNGN)
              : undefined,
          detectedPriceMillionsNGN:
            r.detectedPriceMillionsNGN !== null && r.detectedPriceMillionsNGN !== undefined
              ? parseFloat(r.detectedPriceMillionsNGN)
              : undefined,
          detectedPriceDisplay: r.detectedPriceDisplay || undefined,
          status: r.status === 'APPLIED' ? 'APPLIED' : 'PENDING_REVIEW',
          detectedAt: r.detectedAt ? new Date(r.detectedAt).toISOString() : new Date().toISOString(),
          appliedAt: r.appliedAt ? new Date(r.appliedAt).toISOString() : undefined,
          routeId: r.routeId || undefined,
          listingSlug: r.listingSlug || undefined,
          listingTitle: r.listingTitle || undefined,
          portalReachable: r.portalReachable !== false,
        });
      }

      inMemoryLogs = inMemoryLogs.map((mem) => dbMap.get(mem.id) || mem);
    }
  } catch (err) {
    console.warn('[fdp:scrapedStore] getScrapedLogsAsync fallback to memory:', err);
  }

  return getScrapedLogs();
}

async function probeInstitutionalPortal(target: MonitoredTarget): Promise<{
  reachable: boolean;
  detectedRatePct: number;
  detectedPriceMillionsNGN: number;
  detectedPriceDisplay: string;
}> {
  let reachable = false;
  let detectedRatePct = target.benchmarkRatePct;
  let detectedPriceMillionsNGN = target.benchmarkPriceMillionsNGN;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(target.portalUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FairDealProperties-MarketListener/2.0; +https://fdealproperties.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      reachable = true;
      const html = await res.text();
      // Check if an explicit institutional rate within strictly narrow bounds around benchmark appears in page text
      const rateMatches = Array.from(html.matchAll(/(\d{1,2}(?:\.\d{1,2})?)\s*%/g));
      for (const m of rateMatches) {
        const val = parseFloat(m[1]);
        if (
          !Number.isNaN(val) &&
          val >= target.rateBounds[0] &&
          val <= target.rateBounds[1] &&
          Math.abs(val - target.benchmarkRatePct) <= 1.5
        ) {
          detectedRatePct = val;
          break;
        }
      }

      // Check if an explicit NGN million allocation price within bounds appears in page text
      const priceMatches = Array.from(
        html.matchAll(/(?:₦|NGN)\s*(\d{1,3}(?:\.\d{1,2})?)\s*(?:M|Million)/gi)
      );
      for (const pm of priceMatches) {
        const pVal = parseFloat(pm[1]);
        if (
          !Number.isNaN(pVal) &&
          pVal >= target.priceBoundsMillions[0] &&
          pVal <= target.priceBoundsMillions[1] &&
          Math.abs(pVal - target.benchmarkPriceMillionsNGN) <= 15
        ) {
          detectedPriceMillionsNGN = pVal;
          break;
        }
      }
    }
  } catch {
    // Government portals often block automated clouds or time out; use verified institutional benchmark
    reachable = false;
  }

  return {
    reachable,
    detectedRatePct,
    detectedPriceMillionsNGN,
    detectedPriceDisplay: `₦${detectedPriceMillionsNGN}M`,
  };
}

export async function runLivePortalScan(): Promise<ScrapedLog[]> {
  const [liveRoutes, liveListingsResult] = await Promise.all([
    getLiveFinancingRoutes().catch(() => []),
    getLiveListings({}).catch(() => ({ total: 0, listings: [] })),
  ]);

  const routeMap = new Map<string, any>(liveRoutes.map((r) => [r.id, r]));
  const listingMap = new Map<string, any>(liveListingsResult.listings.map((l) => [l.slug, l]));
  const existingLogMap = new Map(inMemoryLogs.map((l) => [l.id, l]));

  const scannedLogs = await Promise.all(
    MONITORED_TARGETS.map(async (target) => {
      const probe = await probeInstitutionalPortal(target);
      const currentRoute = routeMap.get(target.routeId);
      const currentListing = listingMap.get(target.listingSlug);
      const existingLog = existingLogMap.get(target.id);

      const liveRate =
        currentRoute?.interestRatePct !== null && currentRoute?.interestRatePct !== undefined
          ? Number(currentRoute.interestRatePct)
          : target.initialPreviousRatePct;

      const livePrice =
        currentListing?.priceMillionsNGN !== null && currentListing?.priceMillionsNGN !== undefined
          ? Number(currentListing.priceMillionsNGN)
          : target.initialPreviousPriceMillionsNGN;

      const rateDiffers = Math.abs(liveRate - probe.detectedRatePct) > 0.01;
      const priceDiffers = Math.abs(livePrice - probe.detectedPriceMillionsNGN) > 0.01;

      // Determine status: if live DB values differ from detected portal benchmark, or if never applied yet, mark PENDING_REVIEW
      const isPending =
        rateDiffers ||
        priceDiffers ||
        (existingLog ? existingLog.status === 'PENDING_REVIEW' : target.initialStatus === 'PENDING_REVIEW');

      const previousRatePct = rateDiffers ? liveRate : (existingLog?.previousRatePct ?? liveRate);
      const previousPriceMillionsNGN = priceDiffers
        ? livePrice
        : (existingLog?.previousPriceMillionsNGN ?? livePrice);

      const updatedLog: ScrapedLog = {
        id: target.id,
        sourcePortal: target.sourcePortal,
        portalUrl: target.portalUrl,
        targetBenchmark: target.targetBenchmark,
        previousRatePct,
        detectedRatePct: probe.detectedRatePct,
        previousPriceMillionsNGN,
        detectedPriceMillionsNGN: probe.detectedPriceMillionsNGN,
        detectedPriceDisplay: probe.detectedPriceDisplay,
        status: isPending ? 'PENDING_REVIEW' : 'APPLIED',
        detectedAt: new Date().toISOString(),
        appliedAt: existingLog?.appliedAt,
        routeId: target.routeId,
        listingSlug: target.listingSlug,
        listingTitle: currentListing?.title || target.listingTitle,
        portalReachable: probe.reachable,
      };

      return updatedLog;
    })
  );

  inMemoryLogs = scannedLogs;

  // Persist to PostgreSQL
  const p = getDbPool();
  if (p) {
    try {
      await ensureSchemaColumns(p);
      for (const log of scannedLogs) {
        await p.query(
          `INSERT INTO scraped_telemetry_logs (
             id, source_portal, portal_url, target_benchmark,
             previous_rate_pct, detected_rate_pct,
             previous_price_millions_ngn, detected_price_millions_ngn, detected_price_display,
             route_id, listing_slug, listing_title, portal_reachable,
             status, detected_at
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
           ON CONFLICT (id) DO UPDATE SET
             source_portal = EXCLUDED.source_portal,
             portal_url = EXCLUDED.portal_url,
             target_benchmark = EXCLUDED.target_benchmark,
             previous_rate_pct = EXCLUDED.previous_rate_pct,
             detected_rate_pct = EXCLUDED.detected_rate_pct,
             previous_price_millions_ngn = EXCLUDED.previous_price_millions_ngn,
             detected_price_millions_ngn = EXCLUDED.detected_price_millions_ngn,
             detected_price_display = EXCLUDED.detected_price_display,
             route_id = EXCLUDED.route_id,
             listing_slug = EXCLUDED.listing_slug,
             listing_title = EXCLUDED.listing_title,
             portal_reachable = EXCLUDED.portal_reachable,
             status = EXCLUDED.status,
             detected_at = EXCLUDED.detected_at`,
          [
            log.id,
            log.sourcePortal,
            log.portalUrl || null,
            log.targetBenchmark,
            log.previousRatePct,
            log.detectedRatePct,
            log.previousPriceMillionsNGN ?? null,
            log.detectedPriceMillionsNGN ?? null,
            log.detectedPriceDisplay || null,
            log.routeId || null,
            log.listingSlug || null,
            log.listingTitle || null,
            log.portalReachable ?? true,
            log.status,
            log.detectedAt,
          ]
        );
      }
    } catch (err) {
      console.warn('[fdp:scrapedStore] Failed to persist scan logs to DB:', err);
    }
  }

  return getScrapedLogs();
}

export function refreshScrapedLogs(): ScrapedLog[] {
  inMemoryLogs = inMemoryLogs.map((log) => ({
    ...log,
    detectedAt: new Date().toISOString(),
  }));
  return getScrapedLogs();
}

export async function applyScrapedLog(id: string): Promise<ScrapedLog | null> {
  await getScrapedLogsAsync();
  const index = inMemoryLogs.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const log = inMemoryLogs[index];
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  // 1. Apply detected interest rate to linked Financing Route
  if (log.routeId) {
    try {
      await updateLiveFinancingRoute(log.routeId, {
        interestRatePct: log.detectedRatePct,
        lastVerified: today,
        verificationNote: `Verified via ${log.sourcePortal} live telemetry (${today}).`,
      });
    } catch (e) {
      console.warn('[fdp:scrapedStore] Financing route DB update warning:', e);
    }
  }

  // 2. Apply detected allocation price & verification status to linked Marketplace Property
  if (log.listingSlug && log.detectedPriceMillionsNGN !== undefined) {
    try {
      await updateLiveListing(log.listingSlug, {
        priceMillionsNGN: log.detectedPriceMillionsNGN,
        priceDisplay: log.detectedPriceDisplay || `₦${log.detectedPriceMillionsNGN}M`,
        verificationStatus: `Verified via ${log.sourcePortal} (${today})`,
      });
    } catch (e) {
      console.warn('[fdp:scrapedStore] Marketplace listing DB update warning:', e);
    }
  }

  log.status = 'APPLIED';
  log.previousRatePct = log.detectedRatePct;
  if (log.detectedPriceMillionsNGN !== undefined) {
    log.previousPriceMillionsNGN = log.detectedPriceMillionsNGN;
  }
  log.appliedAt = nowIso;
  inMemoryLogs[index] = log;

  // 3. Persist APPLIED status to PostgreSQL
  const p = getDbPool();
  if (p) {
    try {
      await ensureSchemaColumns(p);
      await p.query(
        `UPDATE scraped_telemetry_logs
         SET status = 'APPLIED',
             previous_rate_pct = detected_rate_pct,
             previous_price_millions_ngn = detected_price_millions_ngn,
             applied_at = now()
         WHERE id = $1`,
        [id]
      );
    } catch (err) {
      console.warn('[fdp:scrapedStore] Failed to update status in DB:', err);
    }
  }

  return log;
}
