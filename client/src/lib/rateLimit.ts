/**
 * Fixed-window rate limit for public write endpoints.
 *
 * In-process and therefore per-instance: it does not coordinate across a serverless
 * fleet. It stops casual form flooding; it is not a substitute for an edge WAF.
 * Deployments on Vercel should additionally enable Vercel Firewall rules, and
 * deployments behind Cloudflare should use Cloudflare Rate Limiting.
 */

const WINDOW_MS = Number(process.env.FDP_RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX = Number(process.env.FDP_RATE_LIMIT_MAX ?? 8);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateVerdict {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string): RateVerdict {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX - 1, retryAfterSeconds: 0 };
  }

  b.count += 1;
  if (b.count > MAX) {
    return { allowed: false, remaining: 0,
             retryAfterSeconds: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { allowed: true, remaining: MAX - b.count, retryAfterSeconds: 0 };
}

/** Periodic sweep so the map does not grow without bound on a long-lived instance. */
if (typeof setInterval === 'function') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }, WINDOW_MS * 5);
  if (typeof timer === 'object' && 'unref' in timer) timer.unref();
}
