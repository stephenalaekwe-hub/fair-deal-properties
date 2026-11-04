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
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const subRes = await fetchApi('/admin/submissions?collection=enquiry');
    if (subRes.ok && subRes.data) {
      const list = subRes.data.filter((s: any) => {
        const agId = s.assignedAgentId || s.payload?.assignedAgentId;
        const agName = s.assignedAgent?.name || s.assignedAgentName || s.payload?.assignedAgent;
        if (!agId && !agName) return true; // Show open unassigned leads as well so agent can respond
        return agId === user?.id || (user?.email && s.assignedAgent?.email === user.email) || agName === user?.name;
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
    const currentStatus = sub.status || (sub.closedAt ? 'closed' : ((sub.assignedAgentId || sub.payload?.assignedAgentId) ? 'in_progress' : 'pending'));
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
      alert(closeRes.error || 'Failed to update enquiry status.');
    }

    setActiveModal(null);
    setSaving(false);
    await loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            💬 My Assigned Property Enquiries & Viewing Requests
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Direct marketplace property enquiries, private viewing bookings, and buyer requests assigned to you.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading property enquiries...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Target Property</th>
                  <th style={{ padding: '12px 16px' }}>Client</th>
                  <th style={{ padding: '12px 16px' }}>Preferred Viewing</th>
                  <th style={{ padding: '12px 16px' }}>Buyer Profile</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                      No property enquiries currently assigned to your account.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((sub) => {
                    const clientName = sub.clientName || sub.payload?.fullName || sub.payload?.name || 'Prospective Buyer';
                    const clientEmail = sub.clientEmail || sub.payload?.email || '';
                    const clientPhone = sub.clientPhone || sub.payload?.phone || '';
                    const prefDate = sub.payload?.preferredDate || null;
                    const propTitle = sub.payload?.propertyTitle || 'Marketplace Property';
                    const propPrice = sub.payload?.propertyPrice ? formatPrice(null, sub.payload.propertyPrice) : null;
                    const buyerType = sub.payload?.buyerType || 'Private Buyer';
                    const financing = sub.payload?.financing || sub.payload?.financingRequired ? 'Financing Requested' : 'Direct Funds';
                    const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((sub.assignedAgentName || sub.assignedAgentId) ? 'in_progress' : 'pending'));

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--forest)' }}>🏠 {propTitle}</div>
                          {propPrice && (
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', marginTop: '2px' }}>
                              {propPrice}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{clientName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {clientEmail}{clientPhone ? ` · ${clientPhone}` : ''}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {prefDate ? (
                            <span style={{ fontWeight: 600, color: 'var(--forest)', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              🗓️ {new Date(prefDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '12px' }}>Next available</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 500, color: '#334155' }}>{buyerType}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{financing}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {itemStatus === 'closed' ? (
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              ✓ Resolved & Closed
                            </span>
                          ) : itemStatus === 'in_progress' ? (
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              🔄 In Progress
                            </span>
                          ) : (
                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              ⏳ Pending Review
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openModal(sub)}
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
                            Respond / Update →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Enquiry Response & Status Modal ── */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                  Ref: {activeModal.reference}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Property Purchase Enquiry & Viewing Booking
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              {/* Target Property Card */}
              {activeModal.payload?.propertyTitle && (
                <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Target Property</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--forest)', marginTop: '2px' }}>
                    🏠 {activeModal.payload.propertyTitle}
                    {activeModal.payload.propertyPrice && (
                      <span style={{ color: 'var(--gold)', marginLeft: '8px' }}>
                        ({formatPrice(null, activeModal.payload.propertyPrice)})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Client Details Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Client Name</span>
                    <strong>{activeModal.clientName || activeModal.payload?.fullName || activeModal.payload?.name || 'Anonymous'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Email Address</span>
                    <strong>{activeModal.clientEmail || activeModal.payload?.email || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Phone / WhatsApp</span>
                    <strong>{activeModal.clientPhone || activeModal.payload?.phone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Preferred Viewing Date</span>
                    <strong>
                      {activeModal.payload?.preferredDate
                        ? new Date(activeModal.payload.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Next available'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Client Message */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Client Message / Specific Requirements
                </label>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#334155', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                  {activeModal.payload?.message || activeModal.payload?.notes || 'No extra message provided.'}
                </div>
              </div>

              {/* Update Status */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Update Status
                </label>
                <select
                  value={statusChoice}
                  onChange={(e) => setStatusChoice(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}
                >
                  <option value="pending">⏳ Pending Review / Unresolved</option>
                  <option value="in_progress">🗂️ In Progress / Contact Established</option>
                  <option value="closed">✓ Completed / Viewing Conducted & Resolved</option>
                </select>
              </div>

              {/* Outcome Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Viewing Debrief / Follow-up Notes
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Record summary of client viewing, negotiation status, or resolution notes..."
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '9px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '9px 20px', background: 'var(--forest)', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Enquiry Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
