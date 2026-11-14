'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

function parseAlertBudgetBounds(budgetStr?: string | null): [number, number] | null {
  if (!budgetStr) return null;
  const s = String(budgetStr).toLowerCase();
  if (/under\s*₦?30m|below\s*₦?30m|<\s*30/i.test(s)) return [0, 35];
  if (/30m.*100m/i.test(s)) return [25, 110];
  if (/100m.*300m/i.test(s)) return [90, 320];
  if (/300m.*1b/i.test(s)) return [280, 1050];
  if (/above\s*₦?1b|1b\+/i.test(s)) return [900, 999999];
  return null;
}

function matchListingToAlert(listing: any, alertSub: any): boolean {
  const p = alertSub?.payload || {};
  const prefType = String(p.propertyType || '').toLowerCase();
  const budgetRange = String(p.budgetRange || p.budget || '');

  // 1. Property type check
  let typeMatches = true;
  if (prefType && !/all|any|preference/i.test(prefType)) {
    if (prefType.includes('residential')) {
      typeMatches = listing.propertyType === 'residential';
    } else if (prefType.includes('commercial')) {
      typeMatches = listing.propertyType === 'commercial';
    } else if (prefType.includes('land')) {
      typeMatches = listing.propertyType === 'land';
    } else if (prefType.includes('affordable') || prefType.includes('mreif') || prefType.includes('fmbn')) {
      typeMatches = Boolean(listing.affordable || listing.mortgageEligible || ['mreif', 'fmbn', 'fhf', 'fha'].includes(listing.source));
    } else if (prefType.includes('off-plan') || prefType.includes('offplan')) {
      typeMatches = Boolean(listing.offPlan);
    }
  }
  if (!typeMatches) return false;

  // 2. Budget range check
  const bounds = parseAlertBudgetBounds(budgetRange);
  if (bounds && listing.priceMillionsNGN !== null && listing.priceMillionsNGN !== undefined) {
    const priceM = Number(listing.priceMillionsNGN);
    if (!Number.isNaN(priceM)) {
      return priceM >= bounds[0] && priceM <= bounds[1];
    }
  }
  return true;
}

export default function AdminAlertsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';

  const [alerts, setAlerts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const agentKey = isAgent ? (user?.id || user?.email || user?.name || '') : '';
    const agentQuery = agentKey ? `&agentId=${encodeURIComponent(agentKey)}` : '';
    const [subRes, listingsRes, agentsRes] = await Promise.all([
      fetchApi(`/admin/submissions?collection=alert${agentQuery}`),
      fetchApi('/listings?pageSize=200'),
      isAgent ? Promise.resolve({ ok: true, data: [] }) : fetchApi('/admin/agents'),
    ]);
    if (subRes.ok && subRes.data) {
      setAlerts(subRes.data);
    }
    if (listingsRes.ok && listingsRes.data) {
      setListings((listingsRes.data as any).listings || []);
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

  const filteredAlerts = alerts.filter((sub) => {
    const p = sub.payload || {};
    const email = (sub.clientEmail || p.email || sub.clientName || '').toLowerCase();
    const ref = (sub.reference || '').toLowerCase();
    const pType = (p.propertyType || '').toLowerCase();
    const budget = (p.budgetRange || p.budget || '').toLowerCase();
    const agName = (sub.assignedAgent?.name || sub.assignedAgentName || p.assignedAgent || '').toLowerCase();
    const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((agName || sub.assignedAgentId) ? 'in_progress' : 'pending'));

    if (statusFilter !== 'all' && itemStatus !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return email.includes(q) || ref.includes(q) || pType.includes(q) || budget.includes(q) || agName.includes(q);
  });

  const handleExportCsv = () => {
    const headers = ['Reference', 'Subscriber Email', 'Property Type', 'Budget Range', 'Matches', 'Assigned Agent', 'Status', 'Date'];
    const rows = filteredAlerts.map((sub) => {
      const p = sub.payload || {};
      const email = sub.clientEmail || p.email || sub.clientName || '';
      const pType = p.propertyType || 'All Property Types';
      const budget = p.budgetRange || p.budget || 'Any Budget';
      const matchesCount = listings.filter((l) => matchListingToAlert(l, sub)).length;
      const agName = sub.assignedAgent?.name || sub.assignedAgentName || p.assignedAgent || 'Unassigned';
      const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((agName !== 'Unassigned' || sub.assignedAgentId) ? 'in_progress' : 'pending'));
      const dt = sub.receivedAt || sub.createdAt || '';
      return [sub.reference, email, pType, budget, `${matchesCount} properties`, agName, itemStatus, dt]
        .map((v) => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fdp-property-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email, ref, type, budget..."
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', minWidth: '220px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#fff' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Active Alert</option>
            <option value="in_progress">Matching in Progress</option>
            <option value="closed">Matched &amp; Closed</option>
          </select>
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              padding: '8px 14px',
              background: '#f8fafc',
              color: 'var(--forest)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⬇ Export CSV
          </button>
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
                  <th style={{ padding: '12px 16px' }}>Portfolio Matches</th>
                  <th style={{ padding: '12px 16px' }}>Subscribed On</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                      No property alerts registered yet.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((sub) => {
                    const p = sub.payload || {};
                    const subscriberEmail = sub.clientEmail || p.email || sub.clientName || 'No email provided';
                    const propertyType = p.propertyType || 'All Property Types';
                    const budgetRange = p.budgetRange || p.budget || 'Any Budget';
                    const receivedDate = sub.receivedAt || sub.createdAt;
                    const assignedAgentName = sub.assignedAgent?.name || sub.assignedAgentName || p.assignedAgent || null;
                    const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((assignedAgentName || sub.assignedAgentId) ? 'in_progress' : 'pending'));
                    const matchedProps = listings.filter((l) => matchListingToAlert(l, sub));

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
                        <td style={{ padding: '14px 16px' }}>
                          {matchedProps.length > 0 ? (
                            <div>
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                                ✓ {matchedProps.length} {matchedProps.length === 1 ? 'Match' : 'Matches'}
                              </span>
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Top: {matchedProps[0].title}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>Awaiting match</span>
                          )}
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

              {/* Auto-Matched Portfolio Properties Section */}
              {(() => {
                const modalMatches = listings.filter((l) => matchListingToAlert(l, activeModal));
                return (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                      🏠 Auto-Matched Portfolio Properties ({modalMatches.length})
                    </div>
                    {modalMatches.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                        {modalMatches.slice(0, 6).map((m) => (
                          <div key={m.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #dcfce7', fontSize: '12px' }}>
                            <div>
                              <strong style={{ color: 'var(--forest)' }}>{m.title}</strong>
                              <span style={{ color: '#64748b', marginLeft: '6px' }}>({m.priceDisplay})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const snippet = `Matched with ${m.title} (${m.priceDisplay}, ${m.location}).`;
                                setOutcome((prev) => (prev ? `${prev} ${snippet}` : snippet));
                              }}
                              style={{ padding: '3px 8px', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              + Add to Note
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        No exact matches in current portfolio yet. When a matching property is published, it will appear here automatically.
                      </div>
                    )}
                  </div>
                );
              })()}

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

