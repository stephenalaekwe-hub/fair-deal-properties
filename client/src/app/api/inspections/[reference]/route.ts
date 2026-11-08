import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { inspectionPipeline } from '@/data/pipeline';
import { getLiveInspectionByRef, extractActualNote } from '@/lib/db';

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
  const ref = (reference || '').trim().toUpperCase();

  if (ref === DEMO_REFERENCE) {
    return NextResponse.json({
      ok: true,
      data: {
        reference: ref,
        demonstration: true,
        propertyTitle: 'Plot 42, Hutu Exclusive Phase III, Airport Road',
        propertyLocation: 'Abuja FCT - within city',
        stage: 6,
        stageTitle: 'Registry Cross-Check & Cadastral Verification',
        stageName: 'Registry Cross-Check & Cadastral Verification',
        stageDescription: 'On-site coordinates being reconciled with AGIS cadastral map.',
        officerName: 'Emeka Nwachukwu (NIS Registered)',
        officer: 'Emeka Nwachukwu (NIS Registered)',
        scheduledDate: '2026-10-18',
        scheduledFor: '2026-10-18',
        pipeline: inspectionPipeline.map((s, i) => ({
          index: i,
          title: s.t,
          detail: s.d,
          state: i < 5 ? 'complete' : i === 5 ? 'active' : 'pending',
        })),
        note: 'This is a demonstration record. It describes the process, not a live engagement.',
        updatedAt: new Date().toISOString(),
      },
    });
  }

  // Try live database lookup first
  try {
    const liveRec = await getLiveInspectionByRef(ref);
      const currentStage = Math.max(1, Math.min(9, Number(liveRec.stage) || 1));
      const isCompleted = currentStage >= 9;
      const currentStepDone = Boolean(liveRec.currentStepDone || liveRec.outcome || liveRec.status === 'closed' || liveRec.status === 'resolved');
      const currentPipe = inspectionPipeline[currentStage - 1];
      const officerVal = liveRec.officerName || liveRec.assignedAgent?.name || (currentStage >= 3 ? 'Assigned Field Surveyor' : 'Pending allocation');
      const officerMessage = extractActualNote(liveRec.notes, liveRec.officerMessage || liveRec.outcome);

      return NextResponse.json({
        ok: true,
        data: {
          reference: liveRec.reference,
          propertyTitle: liveRec.propertyTitle || 'Subject Property',
          propertyLocation: liveRec.propertyLocation || 'Abuja FCT',
          stage: currentStage,
          stageTitle: currentPipe?.t || `Stage ${currentStage}`,
          stageName: currentPipe?.t || `Stage ${currentStage}`,
          stageDescription: currentPipe?.d || 'Inspection in progress.',
          currentStepDone,
          isCompleted,
          status: liveRec.status || (isCompleted ? 'closed' : 'in_progress'),
          officerMessage,
          outcome: liveRec.outcome || null,
          officerName: officerVal,
          officer: officerVal,
          scheduledDate: liveRec.scheduledDate || null,
          scheduledFor: liveRec.scheduledDate || null,
          pipeline: inspectionPipeline.map((s, i) => {
            let state: 'complete' | 'active' | 'pending';
            if (i < currentStage - 1) {
              state = 'complete';
            } else if (i === currentStage - 1) {
              state = (currentStepDone || isCompleted) ? 'complete' : 'active';
            } else {
              state = 'pending';
            }
            return {
              index: i,
              title: s.t,
              detail: s.d,
              state,
            };
          }),
          note: liveRec.notes || undefined,
          updatedAt: liveRec.updatedAt || liveRec.createdAt || new Date().toISOString(),
        },
      });
  } catch (err) {
    console.error('[fdp:inspections:track] DB lookup error:', err);
  }

  // Fallback to store lookup
  const rec = await store.findByReference(ref);
  if (!rec || rec.collection !== 'inspection') {
    return NextResponse.json({
      ok: false,
      error: 'Reference not found. Confirm the code on your acknowledgement receipt (e.g. FDP-INS-XXXXXX).',
    }, { status: 404 });
  }

  const p = (rec.payload as any) || {};
  const actualNote = extractActualNote(p.notes, p.outcome);
  return NextResponse.json({
    ok: true,
    data: {
      reference: rec.reference,
      receivedAt: rec.receivedAt,
      propertyTitle: p.propertyTitle || p.propertyReference || 'Subject Property',
      propertyLocation: p.propertyLocation || p.location || 'Abuja FCT',
      stage: 1,
      stageTitle: inspectionPipeline[0]!.t,
      stageName: inspectionPipeline[0]!.t,
      stageDescription: inspectionPipeline[0]!.d,
      officerName: 'Pending allocation',
      officer: 'Pending allocation',
      scheduledDate: p.preferredDate || null,
      scheduledFor: p.preferredDate || null,
      pipeline: inspectionPipeline.map((s, i) => ({
        index: i,
        title: s.t,
        detail: s.d,
        state: i === 0 ? 'active' : 'pending',
      })),
      officerMessage: actualNote || null,
      note: actualNote || p.notes || 'Instruction logged. Scope and fee will be confirmed in writing before a field officer is dispatched.',
      updatedAt: rec.receivedAt || new Date().toISOString(),
    },
  });
}
