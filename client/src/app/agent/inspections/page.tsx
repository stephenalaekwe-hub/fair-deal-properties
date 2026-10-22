'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ImageUpload from '@/components/ImageUpload';

const STAGES = [
  { stage: 1, title: 'Instruction & Scope' },
  { stage: 2, title: 'Title & Registry Search' },
  { stage: 3, title: 'Survey & Cadastral Verification' },
  { stage: 4, title: 'Physical Inspection Mobilised' },
  { stage: 5, title: 'On-Site Examination' },
  { stage: 6, title: 'Valuation & Cost-to-Complete' },
  { stage: 7, title: 'Legal & Risk Review' },
  { stage: 8, title: 'Comprehensive Dossier Produced' },
  { stage: 9, title: 'Dossier Issued & Debrief' },
];

export default function AgentInspectionsPage() {
  const { user } = useAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal form states
  const [stage, setStage] = useState(1);
  const [officerName, setOfficerName] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [notifyClient, setNotifyClient] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const insRes = await fetchApi('/admin/inspections');
    if (insRes.ok && insRes.data) {
      setInspections(insRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openUpdateModal = (ins: any) => {
    setActiveModal(ins);
    setStage(ins.stage);
    setOfficerName(ins.officerName || (user?.name || ''));
    setReportUrl(ins.reportUrl || '');
    setNotes(ins.notes || '');
    setNotifyClient(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSubmitting(true);

    await fetchApi(`/admin/inspections/${activeModal.id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage: Number(stage),
        officerName,
        reportUrl,
        notes,
        notifyClient,
      }),
    });

    setActiveModal(null);
    setSubmitting(false);
    await loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            My Assigned Field Inspections
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Track site examination stages, record surveyor findings, and upload client verification dossiers.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading your assigned inspection cases...</div>
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
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inspections.length > 0 ? (
                  inspections.map((ins) => {
                    const stageInfo = STAGES.find((s) => s.stage === ins.stage);
                    return (
                      <tr key={ins.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {ins.reference}
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
                          <span
                            style={{
                              background: ins.stage === 9 ? '#dcfce7' : '#e0f2fe',
                              color: ins.stage === 9 ? '#15803d' : '#0369a1',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '11px',
                              display: 'inline-block',
                            }}
                          >
                            Stage {ins.stage}: {stageInfo?.title}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openUpdateModal(ins)}
                            style={{
                              padding: '6px 14px',
                              background: 'var(--forest)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Update Stage / Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                      No inspection cases currently assigned to you.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal: Manage Stage & Field Notes ── */}
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
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                Field Update: {activeModal.reference}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate}>
              <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Assigned Field Officer: </span>
                <strong style={{ color: 'var(--forest)' }}>{user?.name} (You)</strong>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Pipeline Stage (1 - 9)
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(Number(e.target.value))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  {STAGES.map((s) => (
                    <option key={s.stage} value={s.stage}>
                      Stage {s.stage}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Inspecting Officer Name / Credentials
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Engr. Emeka Okonkwo (NIS / SURCON Registered)"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <ImageUpload
                label="Site Inspection Photo / Evidence Dossier"
                value={reportUrl}
                onChange={(url) => setReportUrl(url)}
                placeholder="Click or drag to upload inspection evidence photo..."
                helperText="Pictures only (JPG, PNG, WebP) · Max 15MB. Videos are strictly not accepted."
              />

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Field Verification & Cadastral Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Cadastral coordinates verified with Lands Bureau, boundary beacons intact, structural inspection notes..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="notifyClientAgent"
                  checked={notifyClient}
                  onChange={(e) => setNotifyClient(e.target.checked)}
                />
                <label htmlFor="notifyClientAgent" style={{ fontSize: '13px', color: '#334155' }}>
                  Send automated email status alert to client ({activeModal.clientEmail})
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
