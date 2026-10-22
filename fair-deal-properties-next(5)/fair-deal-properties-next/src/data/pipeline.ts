/** The nine-stage physical inspection pipeline.
 *
 * Published in full because a client who can see the stage their inspection has
 * reached does not have to telephone to ask, and because a firm that publishes its
 * process can be held to it.
 */

export interface PipelineStage {
  t: string;
  d: string;
}

export const inspectionPipeline: PipelineStage[] = [
 {t:'Request received',        d:'Request logged and reference issued. Acknowledgement sent.'},
 {t:'Acknowledged and scoped', d:'Scope and fee confirmed in writing. Client acceptance recorded.'},
 {t:'Officer assigned',        d:'Named field officer allocated. Access arrangements confirmed.'},
 {t:'Inspection scheduled',    d:'Date and window agreed. Client notified.'},
 {t:'Officer en route',        d:'Officer dispatched. Live status enabled.'},
 {t:'On site - capture',       d:'Site attended. Checklist completed. Geotagged evidence captured.'},
 {t:'Evidence lodged',         d:'Photographs, video and coordinates lodged to the document vault.'},
 {t:'Review and sign-off',     d:'Findings reviewed. Two signatories applied.'},
 {t:'Report issued',           d:'Inspection record issued to client. Delivery Index updated.'}
];
