import { NextResponse } from 'next/server';
import { getDbPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
      image,
      imageAlt,
      location,
      specification,
      description,
      verificationStatus = 'Verified by Fair Deal Properties Ltd',
    } = body;

    if (!title || !priceDisplay || !location) {
      return NextResponse.json(
        { ok: false, error: 'Title, asking price, and location are required.' },
        { status: 400 }
      );
    }

    // Slug generation
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    const defaultImage = image || '/assets/illustrations/i0.svg';
    const defaultAlt = imageAlt || title;
    const badges = JSON.stringify(['FDP Verified', propertyType === 'residential' ? 'C of O' : "Gov't Consent"]);
    const tags = JSON.stringify([diasporaFriendly ? 'Diaspora Friendly' : 'Available Now']);
    const amenities = JSON.stringify(['Title Search Passed', 'Physical Inspection']);

    const p = getDbPool();
    if (!p) throw new Error('Database connection not available');

    const res = await p.query(
      `INSERT INTO listings (
        slug, title, subtitle, source, property_type, city,
        diaspora_friendly, mortgage_eligible, affordable, off_plan,
        price_millions_ngn, price_display, price_label, listed_on,
        image, image_alt, badges, location, specification, description,
        tags, amenities, verification_status
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, 'Verified Price', to_char(now(), 'YYYY-MM-DD'),
        $13, $14, $15::jsonb, $16, $17, $18,
        $19::jsonb, $20::jsonb, $21
      ) RETURNING *`,
      [
        slug,
        title,
        subtitle || 'Verified property mandate listed on the Fair Deal Properties platform.',
        source,
        propertyType,
        city,
        Boolean(diasporaFriendly),
        Boolean(mortgageEligible),
        Boolean(affordable),
        Boolean(offPlan),
        priceMillionsNGN ? parseFloat(priceMillionsNGN) : null,
        priceDisplay,
        defaultImage,
        defaultAlt,
        badges,
        location,
        specification || 'Physical verification completed',
        description || 'Verified property opportunity ready for client engagement.',
        tags,
        amenities,
        verificationStatus,
      ]
    );

    return NextResponse.json({
      ok: true,
      data: res.rows[0],
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
