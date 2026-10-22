import { NextResponse } from 'next/server';
import { ZodError, type ZodType } from 'zod';
import { rateLimit } from './rateLimit';

/** Shared request handling for the public API surface. */

export interface ApiError {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiOk<T> {
  ok: true;
  data: T;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiOk<T>>({ ok: true, data }, { status });
}

export function fail(error: string, status = 400, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json<ApiError>({ ok: false, error, fieldErrors }, { status });
}

export function clientIp(req: Request): string | null {
  const h = req.headers;
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? h.get('cf-connecting-ip');
}

/**
 * Validate a JSON body against a schema, applying the rate limit first.
 * Returns either the parsed value or a ready-to-return error response.
 */
export async function readBody<T>(
  req: Request,
  schema: ZodType<T>,
  bucket: string,
): Promise<{ data: T; ip: string | null } | { response: NextResponse }> {
  const ip = clientIp(req);
  const verdict = rateLimit(`${bucket}:${ip ?? 'unknown'}`);
  if (!verdict.allowed) {
    const res = fail('Too many submissions. Please try again shortly.', 429);
    res.headers.set('Retry-After', String(verdict.retryAfterSeconds));
    return { response: res };
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { response: fail('Request body must be valid JSON.', 400) };
  }

  try {
    return { data: schema.parse(raw), ip };
  } catch (e) {
    if (e instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of e.issues) {
        const key = issue.path.join('.') || '_';
        (fieldErrors[key] ??= []).push(issue.message);
      }
      return { response: fail('Some fields need attention.', 422, fieldErrors) };
    }
    return { response: fail('Submission could not be processed.', 400) };
  }
}
