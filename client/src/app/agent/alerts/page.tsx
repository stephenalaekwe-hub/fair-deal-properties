'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AgentAlertsPage() {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('in_progress');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const agentKey = user.id || user.email || user.name || '';
    const subRes = await fetchApi(`/admin/submissions?collection=alert&agentId=${encodeURIComponent(agentKey)}`);
    if (subRes.ok && subRes.data) {
      setAlerts(subRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    setOutcome(sub.outcome || sub.payload?.notes || '');
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
      alert(closeRes.error || 'Failed to save property alert follow-up.');
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
            My Assigned Property Alerts
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Client property alert mandates assigned directly to you by administration for off-market & portfolio matching.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading assigned property alerts...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Subscriber Email</th>
                  <th style={{ padding: '12px 16px' }}>Property Type Preference</th>
                  <th style={{ padding: '12px 16px' }}>Budget Range</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length > 0 ? (
                  alerts.map((sub) => {
                    const p = sub.payload || {};
                    const subscriberEmail = sub.clientEmail || p.email || sub.clientName || 'No email';
                    const propertyType = p.propertyType || 'All Property Types';
                    const budgetRange = p.budgetRange || p.budget || 'Any Budget';
                    const isClosed = sub.status === 'closed' || sub.closedAt;

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <a href={`mailto:${subscriberEmail}`} style={{ fontWeight: 600, color: 'var(--forest)', textDecoration: 'none' }}>
                            ✉️ {subscriberEmail}
                          </a>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--forest)', background: '#ecfdf5', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                            🏠 {propertyType}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 700, color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                            💰 {budgetRange}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              background: isClosed ? '#dcfce7' : '#dbeafe',
                              color: isClosed ? '#15803d' : '#1e40af',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: 700,
                              fontSize: '11px',
                              display: 'inline-block',
                            }}
                          >
                            {isClosed ? '✓ Alert Matched & Closed' : '🔔 Active Mandate — Match Required'}
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
                            Log Property Match
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      No property alerts currently assigned to you.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeModal && (() => {
        const p = activeModal.payload || {};
        const subscriberEmail = activeModal.clientEmail || p.email || activeModal.clientName || 'No email';
        const propertyType = p.propertyType || 'All Property Types';
        const budgetRange = p.budgetRange || p.budget || 'Any Budget';

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
                maxWidth: '540px',
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
                    Property Alert Mandate: {activeModal.reference}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Assigned Buyer Criteria & Listing Match Log
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
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px', fontSize: '13px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#64748b' }}>Subscriber Email: </span>
                      <strong>{subscriberEmail}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Property Type: </span>
                      <strong style={{ color: 'var(--forest)' }}>{propertyType}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Budget Range: </span>
                      <strong style={{ color: '#92400e' }}>{budgetRange}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Match Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e: any) => setStatusChoice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="in_progress">🔄 Matching in Progress — Curated Options Sent</option>
                    <option value="closed">✓ Alert Matched & Resolved</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Matched Property Details & Follow-Up Notes
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="Record which listings were shared with the client and their response..."
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
                    {saving ? 'Saving...' : 'Save Match Log'}
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
