import { NextResponse } from 'next/server';
import { filterListings, type City, type ListingSort, type ListingSource, type PropertyType }
  from '@/data/listings';

export const runtime = 'nodejs';

/**
 * GET /api/listings
 *
 * Query parameters: source, type, city, diaspora, mortgage, affordable, offplan,
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
  const results = filterListings({
    source: pick<ListingSource>('source', SOURCES),
    propertyType: pick<PropertyType>('type', TYPES),
    city: pick<City>('city', CITIES),
    diasporaFriendly: sp.get('diaspora') === 'true' || undefined,
    mortgageEligible: sp.get('mortgage') === 'true' || undefined,
    affordable: sp.get('affordable') === 'true' || undefined,
    offPlan: sp.get('offplan') === 'true' || undefined,
    maxPriceMillionsNGN: sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
    search: sp.get('q') ?? undefined,
  }, sort);

  const page = Math.max(1, Number(sp.get('page') ?? 1) || 1);
  const pageSize = Math.min(60, Math.max(1, Number(sp.get('pageSize') ?? 30) || 30));
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    ok: true,
    data: {
      total: results.length,
      page,
      pageSize,
      sort,
      listings: results.slice(start, start + pageSize),
    },
    // Listings are a published register, not a personalized response: cacheable.
  }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
}
