import { NextResponse } from 'next/server';
import { updateLiveListing, deleteLiveListing } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleUpdateListing(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateLiveListing(decodeURIComponent(id), {
      title: body.title,
      subtitle: body.subtitle,
      source: body.source,
      propertyType: body.propertyType,
      city: body.city,
      diasporaFriendly: body.diasporaFriendly,
      mortgageEligible: body.mortgageEligible,
      affordable: body.affordable,
      offPlan: body.offPlan,
      priceMillionsNGN: body.priceMillionsNGN,
      priceDisplay: body.priceDisplay,
      priceLabel: body.priceLabel,
      image: body.image,
      imageAlt: body.imageAlt,
      location: body.location,
      specification: body.specification,
      description: body.description,
      verificationStatus: body.verificationStatus,
      assignedAgentId: body.assignedAgentId,
      assignedAgentName: body.assignedAgentName,
    });

    return NextResponse.json({
      ok: true,
      data: { id, ...(updated || body), message: 'Listing updated successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:listings:update] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateListing(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateListing(req, params);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteLiveListing(decodeURIComponent(id));
    return NextResponse.json({
      ok: true,
      data: { id, message: 'Listing removed successfully.' },
    });
  } catch (err: any) {
    console.error('[fdp:admin:listings:delete] Error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
