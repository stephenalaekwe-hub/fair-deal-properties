'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AdminCompliancePage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [outcome, setOutcome] = useState('');
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const subRes = await fetchApi('/admin/submissions?collection=dsr');
    if (subRes.ok && subRes.data) {
      setRequests(subRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (req: any) => {
    setActiveModal(req);
    setOutcome(req.outcome || '');
    setStatusChoice(req.status || (req.closedAt ? 'closed' : 'in_progress'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSaving(true);

    const closeRes = await fetchApi(`/admin/submissions/${activeModal.id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({
        outcome: outcome || '',
        status: statusChoice,
        closedBy: user?.name || 'Compliance Officer',
      }),
    });

    if (!closeRes.ok) {
      alert(closeRes.error || 'Failed to update compliance request.');
    }

    setActiveModal(null);
    setSaving(false);
    await loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Data Rights & Statutory NDPA Register
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Statutory Data Subject Requests (DSR) under the Nigeria Data Protection Act 2023 (NDPA s.24) and GAID 2025.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading compliance register...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Request Type</th>
                  <th style={{ padding: '12px 16px' }}>Applicant</th>
                  <th style={{ padding: '12px 16px' }}>Statutory Due Date</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((sub) => {
                    const clientName = sub.clientName || sub.payload?.fullName || sub.payload?.name || 'Data Subject';
                    const clientEmail = sub.clientEmail || sub.payload?.email || 'No email';
                    const rightInvoked = sub.payload?.right || 'Access Request (NDPA s.34)';
                    const isClosed = Boolean(sub.closedAt || sub.status === 'closed');
                    const dueAt = sub.dueAt ? new Date(sub.dueAt) : null;
                    const isOverdue = dueAt && !isClosed && dueAt.getTime() < Date.now();

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>
                            {rightInvoked}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{clientName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{clientEmail}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {dueAt ? (
                            <span style={{ fontWeight: 600, color: isOverdue ? '#dc2626' : '#15803d', fontSize: '12px' }}>
                              {isOverdue ? '⚠️ OVERDUE: ' : '⏱️ Due: '}
                              {dueAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Standard 30-day clock</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              background: isClosed ? '#dcfce7' : isOverdue ? '#fee2e2' : '#fef3c7',
                              color: isClosed ? '#15803d' : isOverdue ? '#b91c1c' : '#b45309',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: 700,
                              fontSize: '11px',
                              display: 'inline-block',
                            }}
                          >
                            {isClosed ? '✓ Request Addressed & Closed' : isOverdue ? 'Action Overdue' : 'Pending Compliance Review'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openModal(sub)}
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
                            Review & Decide
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      No statutory Data Subject Requests on record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {activeModal && (() => {
        const modalClientName = activeModal.clientName || activeModal.payload?.fullName || activeModal.payload?.name || 'Data Subject';
        const modalClientEmail = activeModal.clientEmail || activeModal.payload?.email || 'No email';

        return (
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
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                  NDPA Statutory Decision: {activeModal.reference}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px', fontSize: '13px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Data Subject: </span>
                    <strong>{modalClientName} ({modalClientEmail})</strong>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Right Invoked: </span>
                    <strong style={{ color: '#991b1b' }}>{activeModal.payload?.right || 'Access / Rectification'}</strong>
                  </div>
                  {activeModal.payload?.details && (
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginTop: '10px', fontStyle: 'italic' }}>
                      "{activeModal.payload.details}"
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Compliance Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e: any) => setStatusChoice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="pending">Pending Identity Verification</option>
                    <option value="in_progress">In Progress — Records Assembly</option>
                    <option value="closed">✓ Decided & Closed (Formal Response Issued)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Statutory Decision Rationale & Compliance Notes
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={4}
                    placeholder="Document records verified, disclosure certificate issued, or reasons under NDPA s.36 if disclosure was withheld..."
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--forest)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {saving ? 'Saving...' : 'Record Compliance Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
