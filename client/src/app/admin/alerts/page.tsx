'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AdminAlertsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';

  const [alerts, setAlerts] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const agentQuery = isAgent && user?.id ? `&agentId=${encodeURIComponent(user.id)}` : '';
    const [subRes, agentsRes] = await Promise.all([
      fetchApi(`/admin/submissions?collection=alert${agentQuery}`),
      isAgent ? Promise.resolve({ ok: true, data: [] }) : fetchApi('/admin/agents'),
    ]);
    if (subRes.ok && subRes.data) {
      setAlerts(subRes.data);
    }
    if (agentsRes.ok && agentsRes.data) {
      setAgents(agentsRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    const agId = sub.assignedAgentId || sub.payload?.assignedAgentId || '';
    setSelectedAgentId(agId);
    setOutcome(sub.outcome || sub.payload?.notes || '');
    const currentStatus = sub.status || (sub.closedAt ? 'closed' : (agId ? 'in_progress' : 'pending'));
    setStatusChoice(currentStatus as any);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSaving(true);

    // 1. Assign agent if changed
    if (!isAgent && selectedAgentId !== (activeModal.assignedAgentId || activeModal.payload?.assignedAgentId || '')) {
      const selectedAgent = agents.find((a) => a.id === selectedAgentId);
      await fetchApi(`/admin/submissions/${activeModal.id}/assign-agent`, {
        method: 'PATCH',
        body: JSON.stringify({
          agentId: selectedAgentId || null,
          agentName: selectedAgent ? selectedAgent.name : null,
        }),
      });
    }

    // 2. Update status and matched property / follow-up notes
    const closeRes = await fetchApi(`/admin/submissions/${activeModal.id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({
        outcome: outcome || '',
        status: statusChoice,
      }),
    });

    if (!closeRes.ok) {
      alert(closeRes.error || 'Failed to update property alert.');
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
            🔔 Client Property Alerts
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Marketplace property alert subscriptions assigned to you for property matching.'
              : 'Prospective buyer criteria submitted via the Marketplace "Set a Property Alert" subscription.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading property alerts...</div>
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
                  <th style={{ padding: '12px 16px' }}>Subscribed On</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                      No property alerts registered yet.
                    </td>
                  </tr>
                ) : (
                  alerts.map((sub) => {
                    const p = sub.payload || {};
                    const subscriberEmail = sub.clientEmail || p.email || sub.clientName || 'No email provided';
                    const propertyType = p.propertyType || 'All Property Types';
                    const budgetRange = p.budgetRange || p.budget || 'Any Budget';
                    const receivedDate = sub.receivedAt || sub.createdAt;
                    const assignedAgentName = sub.assignedAgent?.name || sub.assignedAgentName || p.assignedAgent || null;
                    const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((assignedAgentName || sub.assignedAgentId) ? 'in_progress' : 'pending'));

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <a
                            href={`mailto:${subscriberEmail}`}
                            style={{ fontWeight: 600, color: 'var(--forest)', textDecoration: 'none' }}
                          >
                            ✉️ {subscriberEmail}
                          </a>
                          {(sub.outcome || p.notes) && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              Note: {sub.outcome || p.notes}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--forest)', background: '#ecfdf5', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'inline-block' }}>
                            🏠 {propertyType}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 700, color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'inline-block' }}>
                            💰 {budgetRange}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>
                          {receivedDate
                            ? new Date(receivedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Recently'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {assignedAgentName ? (
                            <span style={{ fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              👤 {assignedAgentName}
                            </span>
                          ) : (
                            <span style={{ color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                              ⚠️ Unassigned
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {itemStatus === 'closed' ? (
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              ✓ Matched & Closed
                            </span>
                          ) : itemStatus === 'in_progress' ? (
                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              🔄 Matching in Progress
                            </span>
                          ) : (
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              🔔 Active Alert
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
                            {isAgent ? 'Match & Update' : 'Manage / Assign'}
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

      {/* ── Modal: Manage Property Alert & Assign Agent ── */}
      {activeModal && (() => {
        const p = activeModal.payload || {};
        const subscriberEmail = activeModal.clientEmail || p.email || activeModal.clientName || 'None provided';
        const propertyType = p.propertyType || 'All Property Types';
        const budgetRange = p.budgetRange || p.budget || 'Any Budget';
        const receivedDate = activeModal.receivedAt || activeModal.createdAt;

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
                borderRadius: '12px',
                maxWidth: '580px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '.08em' }}>
                    Marketplace Property Alert
                  </span>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                    Ref: {activeModal.reference}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              {/* Alert Subscription Criteria Card */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Subscriber Email</span>
                    <a href={`mailto:${subscriberEmail}`} style={{ color: 'var(--forest)', textDecoration: 'none', fontWeight: 700 }}>
                      {subscriberEmail}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Subscribed Date</span>
                    <strong style={{ color: '#1e293b' }}>
                      {receivedDate
                        ? new Date(receivedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Active'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Property Type Preference</span>
                    <strong style={{ color: 'var(--forest)' }}>🏠 {propertyType}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Target Budget Range</span>
                    <strong style={{ color: '#92400e' }}>💰 {budgetRange}</strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave}>
                {!isAgent && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Assign Advisory / Sales Officer
                    </label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    >
                      <option value="">-- No Agent Assigned (Unassigned) --</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          👤 {ag.name} ({ag.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Alert Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e) => setStatusChoice(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
                  >
                    <option value="pending">🔔 Active Alert (Monitoring Portfolio)</option>
                    <option value="in_progress">🔄 Matching in Progress (Curated Listings Dispatched)</option>
                    <option value="closed">✓ Matched & Closed (Client Transitioned / Resolved)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Matched Listings / Advisory Follow-Up Notes
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="e.g. Sent off-market residential brochure in Maitama & Guzape matching ₦100M–₦300M mandate."
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
                    {saving ? 'Saving...' : 'Save Alert Updates'}
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
