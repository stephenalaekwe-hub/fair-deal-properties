'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AgentSubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const subRes = await fetchApi('/admin/submissions');
    if (subRes.ok && subRes.data) {
      setSubmissions(subRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    setOutcome(sub.outcome || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSaving(true);

    if (outcome && !activeModal.closedAt) {
      await fetchApi(`/admin/submissions/${activeModal.id}/close`, {
        method: 'PATCH',
        body: JSON.stringify({ outcome }),
      });
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
            My Assigned Client Leads & Enquiries
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Follow up with prospective clients, answer mandate inquiries, and log resolution debriefs.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading assigned inquiries...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px' }}>Client Info</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                        {sub.reference}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {sub.collection}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>
                          {sub.clientName || sub.payload?.fullName || sub.payload?.name || sub.payload?.clientName || 'Anonymous Client'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {sub.clientEmail || sub.payload?.email || sub.payload?.clientEmail || 'No email'}
                          {(sub.clientPhone || sub.payload?.phone || sub.payload?.clientPhone) ? ` · ${sub.clientPhone || sub.payload?.phone || sub.payload?.clientPhone}` : ''}
                        </div>
                        {sub.payload?.propertyTitle && (
                          <div style={{ fontSize: '11px', color: 'var(--forest)', fontWeight: 600, marginTop: '2px' }}>
                            🏠 {sub.payload.propertyTitle} {sub.payload.propertyPrice ? `(${sub.payload.propertyPrice})` : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: sub.closedAt ? '#f1f5f9' : '#fef3c7',
                            color: sub.closedAt ? '#64748b' : '#b45309',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {sub.closedAt ? 'Resolved / Closed' : 'Pending Follow-Up'}
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
                          Follow Up / Resolve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                      No client leads currently assigned to you.
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
        const modalClientName = activeModal.clientName || activeModal.payload?.fullName || activeModal.payload?.name || activeModal.payload?.clientName || 'Anonymous Client';
        const modalClientEmail = activeModal.clientEmail || activeModal.payload?.email || activeModal.payload?.clientEmail || 'No email';
        const modalClientPhone = activeModal.clientPhone || activeModal.payload?.phone || activeModal.payload?.clientPhone || activeModal.payload?.telephone || 'No phone provided';

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
                maxWidth: '580px',
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
                    Client Follow-Up: {activeModal.reference}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Received {activeModal.receivedAt ? new Date(activeModal.receivedAt).toLocaleDateString() : 'N/A'}
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
                {/* ── Client Information Card ── */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#64748b' }}>Inquiry Type</span>
                      <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '14px', textTransform: 'uppercase' }}>{activeModal.collection}</div>
                    </div>
                    <span style={{ background: activeModal.closedAt ? '#f1f5f9' : '#fef3c7', color: activeModal.closedAt ? '#64748b' : '#b45309', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                      {activeModal.closedAt ? 'Resolved / Closed' : 'Pending Follow-Up'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Client Full Name</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{modalClientName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Email Address</div>
                      <div style={{ fontSize: '13px', color: '#0f172a' }}>
                        {modalClientEmail !== 'No email' ? (
                          <a href={`mailto:${modalClientEmail}`} style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'underline' }}>{modalClientEmail}</a>
                        ) : 'No email'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Phone / WhatsApp</div>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                        {modalClientPhone !== 'No phone provided' ? (
                          <a href={`tel:${modalClientPhone.replace(/\s+/g, '')}`} style={{ color: 'var(--forest)', textDecoration: 'none' }}>
                            📞 {modalClientPhone}
                          </a>
                        ) : 'No phone provided'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Reference Code</div>
                      <div style={{ fontSize: '13px', color: 'var(--forest)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{activeModal.reference}</div>
                    </div>
                  </div>

                  {activeModal.payload?.propertyTitle && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '10px', color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inquired Property</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46', marginTop: '2px' }}>
                        🏠 {activeModal.payload.propertyTitle} {activeModal.payload.propertyPrice ? `(${activeModal.payload.propertyPrice})` : ''}
                      </div>
                      {activeModal.payload.propertySource && (
                        <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Source: {activeModal.payload.propertySource}</div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {activeModal.payload?.buyerType && (
                      <div><span style={{ color: '#64748b', fontWeight: 600 }}>Buyer Profile: </span><strong>{activeModal.payload.buyerType}</strong></div>
                    )}
                    {activeModal.payload?.financing && (
                      <div><span style={{ color: '#64748b', fontWeight: 600 }}>Financing Preference: </span><strong>{activeModal.payload.financing}</strong></div>
                    )}
                    {activeModal.payload?.message && (
                      <div style={{ marginTop: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>Client Message</div>
                        <div style={{ fontStyle: 'italic', color: '#1e293b', fontSize: '13px', lineHeight: 1.5 }}>"{activeModal.payload.message}"</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Lead Handler: </span>
                  <strong style={{ color: 'var(--forest)' }}>{user?.name} (You)</strong>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    {activeModal.closedAt ? 'Resolution Outcome' : 'Resolution & Follow-Up Notes'}
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="e.g. Conducted discovery call with client. Scheduled physical inspection for Saturday at 11am."
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
                      fontSize: '13px',
                    }}
                  >
                    {saving ? 'Saving...' : activeModal.closedAt ? 'Update Outcome' : 'Log Outcome & Resolve'}
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
