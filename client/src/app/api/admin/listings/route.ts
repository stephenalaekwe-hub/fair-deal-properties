import { NextResponse } from 'next/server';
import { createLiveListing, getLiveListings } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await getLiveListings({ pageSize: 200 });
    return NextResponse.json(
      { ok: true, data: result },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to load listings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      source = 'fdp',
      propertyType = 'residential',
      city = 'abuja',
      diasporaFriendly = false,
      mortgageEligible = false,
      affordable = false,
      offPlan = false,
      priceMillionsNGN,
      priceDisplay,
      priceLabel,
      image,
      imageAlt,
      location,
      specification,
      description,
      verificationStatus = 'Verified by Fair Deal Properties Ltd',
      assignedAgentId,
      assignedAgentName,
      badges,
      tags,
      amenities,
    } = body;

    if (!title || (!priceDisplay && (priceMillionsNGN === undefined || priceMillionsNGN === null || String(priceMillionsNGN).trim() === '')) || !location) {
      return NextResponse.json(
        { ok: false, error: 'Title, asking price, and location are required.' },
        { status: 400 }
      );
    }

    const created = await createLiveListing({
      title,
      subtitle,
      source,
      propertyType,
      city,
      diasporaFriendly: Boolean(diasporaFriendly),
      mortgageEligible: Boolean(mortgageEligible),
      affordable: Boolean(affordable),
      offPlan: Boolean(offPlan),
      priceMillionsNGN,
      priceDisplay,
      priceLabel,
      image,
      imageAlt,
      location,
      specification,
      description,
      verificationStatus,
      assignedAgentId: assignedAgentId || null,
      assignedAgentName: assignedAgentName || null,
      badges,
      tags,
      amenities,
    });

    return NextResponse.json({
      ok: true,
      data: created,
      message: 'Property published successfully.',
    }, { status: 201 });
  } catch (err: any) {
    console.error('[fdp:admin:listings:create] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to publish new listing' },
      { status: 500 }
    );
  }
}
