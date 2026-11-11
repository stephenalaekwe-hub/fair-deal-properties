'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ImageUpload, { parseImageUrls } from '@/components/ImageUpload';
import { STAGES } from '@/data/pipeline';

export default function AdminInspectionsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';

  const [inspections, setInspections] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal form states
  const [stage, setStage] = useState(1);
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [notifyClient, setNotifyClient] = useState(true);
  const [filterAgentId, setFilterAgentId] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('agentId') || '';
    }
    return '';
  });

  const loadData = async (filterId = filterAgentId, silent = false) => {
    if (!silent) setLoading(true);
    if (isAgent) {
      const insRes = await fetchApi('/admin/inspections');
      if (insRes.ok && insRes.data) setInspections(insRes.data);
    } else {
      const query = filterId ? `?agentId=${filterId}` : '';
      const [insRes, agentsRes] = await Promise.all([
        fetchApi(`/admin/inspections${query}`),
        fetchApi('/admin/agents'),
      ]);
      if (insRes.ok && insRes.data) setInspections(insRes.data);
      if (agentsRes.ok && agentsRes.data) setAgents(agentsRes.data);
    }
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    loadData(filterAgentId);
    const interval = setInterval(() => loadData(filterAgentId, true), 8000);
    const onFocus = () => loadData(filterAgentId, true);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [user, filterAgentId]);

  const getCleanStageNote = (ins: any, targetStage: number): string => {
    if (!ins) return '';
    const histNote = ins.stageHistory?.[String(targetStage)]?.note;
    let raw =
      histNote !== undefined
        ? histNote
        : Number(targetStage) === Number(ins.stage)
          ? ins.officerMessage || ins.notes || ''
          : '';
    return String(raw)
      .replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/gi, '')
      .replace(/Scope:\s*[^\n\r]*?Window:\s*[^\n\r.]*\.?\s*/gi, '')
      .replace(/^Scope:\s*[^\n\r]+(\r?\n)?/gim, '')
      .replace(/^Window:\s*[^\n\r]+(\r?\n)?/gim, '')
      .replace(/\bNotes:\s*/gi, '')
      .trim();
  };

  const openUpdateModal = (ins: any) => {
    setActiveModal(ins);
    // If the field officer already completed the current stage, default the stage selector to the next stage so "Save & Dispatch Updates" dispatches the next stage immediately
    const nextDefaultStage = !isAgent && ins.currentStepDone && ins.stage < 9 ? Number(ins.stage) + 1 : Number(ins.stage);
    setStage(nextDefaultStage);
    const rawAgId = ins.assignedAgentId || ins.assignedAgent?.id || '';
    const rawAgName = (ins.assignedAgent?.name || ins.officerName || '').split('(')[0].trim().toLowerCase();
    const matchedAgent = agents.find((a) => {
      if (rawAgId && a.id === rawAgId) return true;
      const candName = (a.name || '').split('(')[0].trim().toLowerCase();
      if (rawAgName && candName && (candName === rawAgName || candName.includes(rawAgName) || rawAgName.includes(candName))) {
        return true;
      }
      const rawFirst = rawAgName.split(/\s+/)[0];
      const candFirst = candName.split(/\s+/)[0];
      return Boolean(rawFirst && rawFirst.length >= 3 && rawFirst === candFirst);
    });
    setAssignedAgentId(matchedAgent ? matchedAgent.id : rawAgId);
    setOfficerName(ins.officerName || ins.assignedAgent?.name || (isAgent ? (user?.name || '') : ''));

    let currentReportUrl = ins.reportUrl || '';
    const photoMatch = String(ins.notes || '').match(/Attached Survey \/ Site Photograph:\s*([^\n\r]+)/i);
    if (photoMatch && !currentReportUrl) {
      currentReportUrl = photoMatch[1].trim();
    }

    setReportUrl(currentReportUrl);
    setNotes(getCleanStageNote(ins, nextDefaultStage));
    setNotifyClient(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSubmitting(true);

    const selectedAgent = agents.find((ag) => ag.id === assignedAgentId);
    const finalOfficerName = officerName || selectedAgent?.name || (isAgent ? (user?.name || '') : '');
    const targetStage = Number(stage);

    // 1. Update stage, officer, agent assignment, photos, and notes atomically
    const res = await fetchApi(`/admin/inspections/${activeModal.id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage: targetStage,
        officerName: finalOfficerName,
        assignedAgentId: !isAgent ? (assignedAgentId || null) : undefined,
        assignedAgentName: !isAgent ? (selectedAgent?.name || finalOfficerName || null) : undefined,
        reportUrl,
        notes,
        notifyClient,
        markStepDone: isAgent ? true : (targetStage >= 9 ? true : false),
      }),
    });

    if (!res.ok) {
      alert(res.error || 'Failed to save and dispatch inspection updates.');
      setSubmitting(false);
      return;
    }

    setActiveModal(null);
    setSubmitting(false);
    await loadData(filterAgentId);
  };

  const handleAdvanceToNextStage = async (ins: any) => {
    if (!ins || ins.stage >= 9) return;
    setSubmitting(true);
    const selectedAgent = agents.find((ag) => ag.id === assignedAgentId);
    const finalOfficerName = officerName || selectedAgent?.name || ins.officerName || '';
    await fetchApi(`/admin/inspections/${ins.id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage: Number(ins.stage) + 1,
        officerName: finalOfficerName,
        assignedAgentId: !isAgent ? (assignedAgentId || ins.assignedAgentId || null) : undefined,
        assignedAgentName: !isAgent ? (selectedAgent?.name || finalOfficerName || null) : undefined,
        reportUrl: reportUrl !== undefined ? reportUrl : undefined,
        notes: notes !== undefined ? notes : '',
        notifyClient: true,
        markStepDone: false,
      }),
    });
    setActiveModal(null);
    setSubmitting(false);
    await loadData(filterAgentId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            {isAgent ? 'My Field Inspection Pipeline' : 'Physical & Virtual Inspection Hub'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Track your assigned cases, log site visits, advance verification stages, and submit field dossiers.'
              : '9-Stage verification pipeline tracking, field officer dispatch, and dossier issuance.'}
          </p>
        </div>

        {!isAgent && agents.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Filter by Officer:</span>
            <select
              value={filterAgentId}
              onChange={(e) => setFilterAgentId(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="">All Field Officers (Full Master View)</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  👤 {ag.name} ({ag._count?.assignedInspections || 0} active)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading inspection records...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Client</th>
                  <th style={{ padding: '12px 16px' }}>Property Target</th>
                  <th style={{ padding: '12px 16px' }}>Current Pipeline Stage</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((ins) => {
                  const stageInfo = STAGES.find((s) => s.stage === ins.stage);
                  return (
                    <tr key={ins.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                        <div>{ins.reference}</div>
                        {parseImageUrls(ins.reportUrl).length > 0 && (
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              fontSize: '10.5px',
                              fontWeight: 600,
                              color: '#047857',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '4px',
                              padding: '1px 6px',
                            }}
                          >
                            📸 {parseImageUrls(ins.reportUrl).length}{' '}
                            {parseImageUrls(ins.reportUrl).length === 1 ? 'photo' : 'photos'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{ins.clientName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ins.clientPhone}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{ins.propertyTitle}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ins.propertyLocation}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {ins.stage >= 9 ? (
                          <span
                            style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: 700,
                              fontSize: '11px',
                              display: 'inline-block',
                            }}
                          >
                            ✓ Final Dossier Delivered & Closed
                          </span>
                        ) : ins.currentStepDone ? (
                          <div>
                            <span
                              style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontWeight: 700,
                                fontSize: '11px',
                                display: 'inline-block',
                              }}
                            >
                              ✓ Stage {ins.stage} Completed
                            </span>
                            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, marginTop: '3px' }}>
                              ⚡ Ready to Advance to Stage {ins.stage + 1}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span
                              style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontWeight: 700,
                                fontSize: '11px',
                                display: 'inline-block',
                              }}
                            >
                              Stage {ins.stage}: {stageInfo?.title}
                            </span>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                              In Progress
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {ins.assignedAgent?.name || ins.officerName ? (
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            👤 {ins.assignedAgent?.name || ins.officerName}
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>⚠️ Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => openUpdateModal(ins)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--forest)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isAgent ? 'Update Stage / Dossier' : 'Manage Stage & Agent'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal: Manage Stage & Assign Agent ── */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              maxWidth: '580px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                Update Inspection: {activeModal.reference}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate}>
              {activeModal.currentStepDone && activeModal.stage < 9 && (
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ✓ Field Officer Completed Stage {activeModal.stage}
                  </div>
                  <div style={{ fontSize: '13px', color: '#065f46', marginTop: '4px', lineHeight: 1.5 }}>
                    <strong>Officer Debrief: </strong>
                    <em>"{activeModal.officerMessage || activeModal.notes || 'Stage verification checklist completed.'}"</em>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleAdvanceToNextStage(activeModal)}
                      style={{
                        background: 'var(--forest)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Approve & Advance to Stage {activeModal.stage + 1}: {STAGES.find((s) => s.stage === activeModal.stage + 1)?.title} →
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Pipeline Stage (1 - 9)
                </label>
                <select
                  value={stage}
                  onChange={(e) => {
                    const nextStg = Number(e.target.value);
                    setStage(nextStg);
                    setNotes(getCleanStageNote(activeModal, nextStg));
                  }}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  {STAGES.map((s) => (
                    <option key={s.stage} value={s.stage}>
                      Stage {s.stage}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {isAgent ? (
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Field Officer: </span>
                  <strong style={{ color: 'var(--forest)' }}>{user?.name} (You)</strong>
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Assign Field Agent
                  </label>
                  <select
                    value={assignedAgentId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setAssignedAgentId(newId);
                      const ag = agents.find((a) => a.id === newId);
                      if (ag && !officerName) {
                        setOfficerName(ag.name);
                      }
                    }}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  >
                    <option value="">-- No Agent Assigned --</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Inspecting Officer Name / Credentials
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Engr. S. Alaekwe (NIS / SURCON Registered)"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <ImageUpload
                label="Site Inspection Photo(s) / Evidence Dossier"
                value={reportUrl}
                onChange={(url) => setReportUrl(url)}
                placeholder="Click or drag to upload one or multiple inspection evidence photos..."
                helperText="Pictures only (JPG, PNG, WebP) · Max 15MB per photo. Add one or multiple photos. Videos are strictly not accepted."
              />

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Internal Verification Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Cadastral coordinates checked with Lands Bureau, boundary beacons intact..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="notifyClient"
                  checked={notifyClient}
                  onChange={(e) => setNotifyClient(e.target.checked)}
                />
                <label htmlFor="notifyClient" style={{ fontSize: '13px', color: '#334155' }}>
                  Send automated email status notification to client ({activeModal.clientEmail})
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--forest)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Saving...' : 'Save & Dispatch Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
