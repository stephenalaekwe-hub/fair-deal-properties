/**
 * The nine-stage physical inspection pipeline.
 * Unified source of truth across Admin, Field Agent Portal, and Client Tracking.
 */

export interface PipelineStage {
  stage: number;
  t: string;
  title: string;
  d: string;
}

export const inspectionPipeline: PipelineStage[] = [
  {
    stage: 1,
    t: 'Instruction & Scope',
    title: 'Instruction & Scope',
    d: 'Inspection scope, terms, and fee confirmed in writing. Engagement logged.',
  },
  {
    stage: 2,
    t: 'Title & Registry Search',
    title: 'Title & Registry Search',
    d: 'Title documents examined; boundary files and cadastral records cross-checked.',
  },
  {
    stage: 3,
    t: 'Survey & Cadastral Verification',
    title: 'Survey & Cadastral Verification',
    d: 'Named field surveyor allocated; cadastral coordinates verified.',
  },
  {
    stage: 4,
    t: 'Physical Inspection Mobilised',
    title: 'Physical Inspection Mobilised',
    d: 'Field inspection mobilized; access protocol, site window, and route confirmed.',
  },
  {
    stage: 5,
    t: 'On-Site Examination',
    title: 'On-Site Examination',
    d: 'Physical site attended; boundary beacon verification and photographic evidence captured.',
  },
  {
    stage: 6,
    t: 'Valuation & Cost-to-Complete',
    title: 'Valuation & Cost-to-Complete',
    d: 'Structural appraisal, valuation assessment, and physical snagging completed.',
  },
  {
    stage: 7,
    t: 'Legal & Risk Review',
    title: 'Legal & Risk Review',
    d: 'Legal encumbrance review, zoning validation, and verification audit finalized.',
  },
  {
    stage: 8,
    t: 'Comprehensive Dossier Produced',
    title: 'Comprehensive Dossier Produced',
    d: 'Comprehensive verification dossier assembled with professional signatories.',
  },
  {
    stage: 9,
    t: 'Dossier Issued & Debrief',
    title: 'Dossier Issued & Debrief',
    d: 'Final certified dossier released to client and executive debrief delivered.',
  },
];

export const STAGES = inspectionPipeline.map((s) => ({
  stage: s.stage,
  title: s.title,
  d: s.d,
  detail: s.d,
}));
