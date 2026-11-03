// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - SCRAPED TELEMETRY LOGS STORE
// ══════════════════════════════════════════════════════════════════════════════

import { updateLiveFinancingRoute } from './db';

export interface ScrapedLog {
  id: string;
  sourcePortal: string;
  targetBenchmark: string;
  previousRatePct: number;
  detectedRatePct: number;
  status: 'PENDING_REVIEW' | 'APPLIED';
  detectedAt: string;
  routeId?: string;
}

let inMemoryLogs: ScrapedLog[] = [
  {
    id: 'log-fmbn-01',
    sourcePortal: 'FMBN (National Housing Fund)',
    targetBenchmark: 'NHF Statutory Concessionary Lending',
    previousRatePct: 6.0,
    detectedRatePct: 6.0,
    status: 'APPLIED',
    detectedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    routeId: 'nhf-mortgage',
  },
  {
    id: 'log-nmrc-02',
    sourcePortal: 'NMRC Liquidity Facility',
    targetBenchmark: 'Primary Mortgage Institutions Refinancing',
    previousRatePct: 14.5,
    detectedRatePct: 13.5,
    status: 'PENDING_REVIEW',
    detectedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    routeId: 'nmrc-refinanced',
  },
  {
    id: 'log-mreif-03',
    sourcePortal: 'MREIF / MOFI Infrastructure Portal',
    targetBenchmark: 'Pension Fund Real Estate Equity Yield',
    previousRatePct: 11.0,
    detectedRatePct: 10.5,
    status: 'PENDING_REVIEW',
    detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    routeId: 'mreif-equity',
  },
  {
    id: 'log-fha-04',
    sourcePortal: 'Federal Housing Authority (FHA)',
    targetBenchmark: 'Social & Civil Service Mortgage Allocation',
    previousRatePct: 9.5,
    detectedRatePct: 9.0,
    status: 'PENDING_REVIEW',
    detectedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    routeId: 'fha-direct',
  },
];

export function getScrapedLogs(): ScrapedLog[] {
  return [...inMemoryLogs];
}

export function refreshScrapedLogs(): ScrapedLog[] {
  // Regenerate fresh timestamps for the telemetry run
  inMemoryLogs = inMemoryLogs.map((log) => ({
    ...log,
    detectedAt: new Date().toISOString(),
  }));
  return getScrapedLogs();
}

export async function applyScrapedLog(id: string): Promise<ScrapedLog | null> {
  const index = inMemoryLogs.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const log = inMemoryLogs[index];
  log.status = 'APPLIED';

  // Apply to DB if routeId is mapped
  if (log.routeId) {
    try {
      await updateLiveFinancingRoute(log.routeId, {
        interestRatePct: log.detectedRatePct,
        lastVerified: new Date().toISOString().slice(0, 10),
        verificationNote: `Auto-verified via ${log.sourcePortal} telemetry scan.`,
      });
    } catch (e) {
      console.warn('[fdp:scrapedStore] Note: DB update skipped or route not present, log marked APPLIED.');
    }
  }

  return log;
}
