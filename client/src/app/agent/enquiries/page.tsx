'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useCurrency } from '@/components/CurrencyProvider';

export default function AgentEnquiriesPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'scheduled' | 'closed'>('in_progress');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const subRes = await fetchApi('/admin/submissions?collection=enquiry');
    if (subRes.ok && subRes.data && user) {
      // Filter strictly to property enquiries assigned to this agent
      const list = subRes.data.filter((s: any) => {
        const agId = s.assignedAgentId || s.payload?.assignedAgentId;
        const agName = s.assignedAgent?.name || s.assignedAgentName || s.payload?.assignedAgent;
        const agEmail = s.assignedAgent?.email;
        return (
          agId === user.id ||
          (agEmail && agEmail.toLowerCase() === user.email?.toLowerCase()) ||
          (agName && agName.toLowerCase() === user.name?.toLowerCase())
        );
      });
      setEnquiries(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    setOutcome(sub.outcome || '');
    const currentStatus = sub.status || (sub.closedAt ? 'closed' : 'in_progress');
    setStatusChoice(currentStatus as any);
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
        closedBy: user?.name || 'Field Officer',
      }),
    });

    if (!closeRes.ok) {
      alert(closeRes.error || 'Failed to save enquiry follow-up.');
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
            My Assigned Property Enquiries
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Prospective buyer enquiries and private viewing briefs assigned directly to you by administration.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading assigned property enquiries...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Client</th>
                  <th style={{ padding: '12px 16px' }}>Inquired Property</th>
                  <th style={{ padding: '12px 16px' }}>Buyer Profile</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length > 0 ? (
                  enquiries.map((sub) => {
                    const clientName = sub.clientName || sub.payload?.fullName || sub.payload?.name || 'Anonymous Client';
                    const clientEmail = sub.clientEmail || sub.payload?.email || 'No email';
                    const clientPhone = sub.clientPhone || sub.payload?.phone || '';
                    const propTitle = sub.payload?.propertyTitle || 'General Listing Enquiry';
                    const propPrice = sub.payload?.propertyPrice ? formatPrice(null, sub.payload.propertyPrice) : null;
                    const buyerType = sub.payload?.buyerType || 'Standard Buyer';
                    const isClosed = sub.status === 'closed' || sub.closedAt;
                    const isScheduled = sub.status === 'scheduled';

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{clientName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{clientPhone || clientEmail}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--forest)' }}>🏠 {propTitle}</div>
                          {propPrice && <div style={{ fontSize: '11px', color: '#64748b' }}>{propPrice}</div>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>
                            {buyerType}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              background: isClosed ? '#dcfce7' : isScheduled ? '#fef3c7' : '#dbeafe',
                              color: isClosed ? '#15803d' : isScheduled ? '#b45309' : '#1e40af',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: 700,
                              fontSize: '11px',
                              display: 'inline-block',
                            }}
                          >
                            {isClosed
                              ? '✓ Enquiry Resolved'
                              : isScheduled
                              ? '📅 Viewing Scheduled'
                              : 'In Progress — Follow-Up Required'}
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
                            Follow-Up / Debrief
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      No property enquiries currently assigned to you.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Follow-Up / Resolve Modal ── */}
      {activeModal && (() => {
        const modalClientName = activeModal.clientName || activeModal.payload?.fullName || activeModal.payload?.name || 'Anonymous Client';
        const modalClientEmail = activeModal.clientEmail || activeModal.payload?.email || 'No email';
        const modalClientPhone = activeModal.clientPhone || activeModal.payload?.phone || 'No phone';

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
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                    Client Debrief: {activeModal.reference}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Assigned Property Lead Follow-Up
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Client: </span>
                      <strong>{modalClientName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Phone: </span>
                      <strong>{modalClientPhone}</strong>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#64748b' }}>Email: </span>
                      <strong>{modalClientEmail}</strong>
                    </div>
                  </div>

                  {activeModal.payload?.propertyTitle && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>Target Property: </span>
                      <strong style={{ color: 'var(--forest)' }}>🏠 {activeModal.payload.propertyTitle}</strong>
                    </div>
                  )}

                  {activeModal.payload?.message && (
                    <div style={{ marginTop: '10px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', fontSize: '12.5px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>Client Message:</div>
                      <div style={{ fontStyle: 'italic', color: '#1e293b' }}>"{activeModal.payload.message}"</div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Follow-Up Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e: any) => setStatusChoice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="in_progress">In Progress — Contact Established</option>
                    <option value="scheduled">📅 Viewing / Inspection Scheduled</option>
                    <option value="closed">✓ Enquiry Addressed & Resolved</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Agent Debrief & Follow-Up Notes
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="Document call outcome, client timeline, requested title papers, or next scheduled viewing..."
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
                    {saving ? 'Saving...' : 'Save Follow-Up Debrief'}
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
