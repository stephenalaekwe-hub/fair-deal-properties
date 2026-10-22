import { NextResponse } from 'next/server';
import { getListing, SOURCE_LABELS, CITY_LABELS } from '@/data/listings';

export const runtime = 'nodejs';

/** GET /api/listings/[slug] - a single listing with its verification record expanded. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const listing = getListing(slug);

  if (!listing) {
    return NextResponse.json(
      { ok: false, error: 'No listing with that reference is currently published.' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      ...listing,
      sourceLabel: SOURCE_LABELS[listing.source],
      cityLabel: CITY_LABELS[listing.city],
      disclosure:
        'Price is indicative. The verification status shown states what has been verified, by whom '
        + 'and on what date. Title opinion and valuation, where required, are obtained from '
        + 'separately instructed licensed professionals and are not provided by this firm.',
    },
  }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
}
