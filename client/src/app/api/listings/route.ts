import { NextResponse } from 'next/server';
import { getLiveListings } from '@/lib/db';
import type { City, ListingSort, ListingSource, PropertyType } from '@/data/listings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/listings
 *
 * Live query parameters: source, type, city, diaspora, mortgage, affordable, offplan,
 * maxPrice (₦ millions), q, sort (newest|price-asc|price-desc|title), page, pageSize.
 */
const SOURCES = ['fdp', 'developer', 'mreif', 'fhf', 'fha', 'fmbn', 'pmi', 'offmarket'];
const TYPES = ['residential', 'commercial', 'land'];
const CITIES = ['abuja', 'lagos', 'ogun', 'nationwide'];
const SORTS = ['featured', 'newest', 'price-asc', 'price-desc', 'title'];

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const pick = <T extends string>(k: string, allowed: string[]): T | undefined => {
    const v = sp.get(k);
    return v && allowed.includes(v) ? (v as T) : undefined;
  };

  const sort = (pick<ListingSort>('sort', SORTS) ?? 'featured') as ListingSort;
  const page = Math.max(1, Number(sp.get('page') ?? 1) || 1);
  const pageSize = Math.min(60, Math.max(1, Number(sp.get('pageSize') ?? 30) || 30));

  const result = await getLiveListings({
    source: pick<ListingSource>('source', SOURCES),
    propertyType: pick<PropertyType>('type', TYPES),
    city: pick<City>('city', CITIES),
    diasporaFriendly: sp.get('diaspora') === 'true' || undefined,
    mortgageEligible: sp.get('mortgage') === 'true' || undefined,
    affordable: sp.get('affordable') === 'true' || undefined,
    offPlan: sp.get('offplan') === 'true' || undefined,
    maxPriceMillionsNGN: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
    search: sp.get('q') ?? undefined,
    sort,
    page,
    pageSize,
  });

  return NextResponse.json({
    ok: true,
    data: {
      total: result.total,
      page,
      pageSize,
      sort,
      listings: result.listings,
    },
  }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
