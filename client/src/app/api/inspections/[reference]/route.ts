import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { inspectionPipeline } from '@/data/pipeline';

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

  if (ref === DEMO_REFERENCE) {
    return NextResponse.json({
      ok: true,
      data: {
        reference: ref,
        demonstration: true,
        stage: 5,
        stageName: inspectionPipeline[5]!.t,
        officer: 'E. Nwachukwu',
        scheduledFor: '2026-10-18',
        pipeline: inspectionPipeline.map((s, i) => ({
          index: i, title: s.t, detail: s.d,
          state: i < 5 ? 'complete' : i === 5 ? 'active' : 'pending',
        })),
        note: 'This is a demonstration record. It describes the process, not a live engagement.',
      },
    });
  }

  try {
    const backendRes = await fetch(`http://localhost:5000/api/v1/inspections/track/${encodeURIComponent(ref)}`);
    if (backendRes.ok) {
      const backendJson = await backendRes.json();
      if (backendJson.ok && backendJson.data) {
        const d = backendJson.data;
        const currentStage = Math.max(1, Math.min(9, d.stage || 1));
        return NextResponse.json({
          ok: true,
          data: {
            reference: d.reference,
            propertyTitle: d.propertyTitle,
            propertyLocation: d.propertyLocation,
            stage: currentStage,
            stageName: d.stageTitle || (inspectionPipeline[currentStage - 1] ? inspectionPipeline[currentStage - 1]!.t : `Stage ${currentStage}`),
            officer: d.officerName || (currentStage >= 3 ? 'Assigned Field Surveyor' : 'Pending allocation'),
            scheduledFor: d.scheduledDate,
            pipeline: inspectionPipeline.map((s, i) => ({
              index: i,
              title: s.t,
              detail: s.d,
              state: i < currentStage - 1 ? 'complete' : i === currentStage - 1 ? 'active' : 'pending',
            })),
            note: d.notes,
          },
        });
      }
    }
  } catch (err) {
    console.error('Backend inspection track query failed:', err);
  }

  const rec = await store.findByReference(ref);
  if (!rec || rec.collection !== 'inspection') {
    return NextResponse.json({
      ok: false,
      error:
        'No inspection is recorded against that reference. Check the reference in your '
        + 'acknowledgement, or contact the firm.',
    }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      reference: rec.reference,
      receivedAt: rec.receivedAt,
      stage: 0,
      stageName: inspectionPipeline[0]!.t,
      pipeline: inspectionPipeline.map((s, i) => ({
        index: i, title: s.t, detail: s.d,
        state: i === 0 ? 'active' : 'pending',
      })),
    },
  });
}
