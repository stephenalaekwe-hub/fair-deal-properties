import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { inspectionPipeline } from '@/data/pipeline';
import { getLiveInspectionByRef } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/inspections/[reference] - track an inspection.
 *
 * Returns stage and timing only. It never returns the requester's contact details,
 * because anyone holding a reference can call this endpoint. Treating the reference
 * as a bearer credential for personal data would be a disclosure control failure.
 */
const DEMO_REFERENCE = 'FDP-INS-DEMO01';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const ref = reference.trim().toUpperCase();

  // Try live database lookup first
  try {
    const liveRec = await getLiveInspectionByRef(ref);
    if (liveRec) {
      const currentStage = Math.max(1, Math.min(9, liveRec.stage || 1));
      return NextResponse.json({
        ok: true,
        data: {
          reference: liveRec.reference,
          propertyTitle: liveRec.propertyTitle,
          propertyLocation: liveRec.propertyLocation,
          stage: currentStage,
          stageName: inspectionPipeline[currentStage - 1]?.t || `Stage ${currentStage}`,
          officer: liveRec.officerName || (currentStage >= 3 ? 'Assigned Field Surveyor' : 'Pending allocation'),
          scheduledFor: liveRec.scheduledDate,
          pipeline: inspectionPipeline.map((s, i) => ({
            index: i,
            title: s.t,
            detail: s.d,
            state: i < currentStage - 1 ? 'complete' : i === currentStage - 1 ? 'active' : 'pending',
          })),
          note: liveRec.notes || undefined,
        },
      });
    }
  } catch (err) {
    console.error('[fdp:inspections:track] DB lookup error:', err);
  }

  if (ref === DEMO_REFERENCE) {
    return NextResponse.json({
      ok: true,
      data: {
        reference: ref,
        demonstration: true,
        stage: 5,
        stageName: inspectionPipeline[4]!.t,
        officer: 'E. Nwachukwu',
        scheduledFor: '2026-10-18',
        pipeline: inspectionPipeline.map((s, i) => ({
          index: i, title: s.t, detail: s.d,
          state: i < 4 ? 'complete' : i === 4 ? 'active' : 'pending',
        })),
        note: 'This is a demonstration record. It describes the process, not a live engagement.',
      },
    });
  }

  // Fallback to store lookup
  const rec = await store.findByReference(ref);
  if (!rec || rec.collection !== 'inspection') {
    return NextResponse.json({
      ok: false,
      error: 'Reference not found. Confirm the code on your acknowledgement email.',
    }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      reference: rec.reference,
      receivedAt: rec.receivedAt,
      stage: 1,
      stageName: inspectionPipeline[0]!.t,
      pipeline: inspectionPipeline.map((s, i) => ({
        index: i, title: s.t, detail: s.d,
        state: i === 0 ? 'active' : 'pending',
      })),
      note: 'Scope and fee will be confirmed in writing before an officer is assigned.',
    },
  });
}
