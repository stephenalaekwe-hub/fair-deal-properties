'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useCurrency } from '@/components/CurrencyProvider';

export default function AdminConsultationsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const isAgent = user?.role === 'AGENT';

  const [consultations, setConsultations] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [subRes, agentsRes] = await Promise.all([
      fetchApi('/admin/submissions?collection=contact'),
      isAgent ? Promise.resolve({ ok: true, data: [] }) : fetchApi('/admin/agents'),
    ]);
    if (subRes.ok && subRes.data) {
      // If agent, filter to their assignments
      const list = isAgent
        ? subRes.data.filter((s: any) => s.assignedAgentId === user?.id || s.payload?.assignedAgentId === user?.id)
        : subRes.data;
      setConsultations(list);
    }
    if (agentsRes.ok && agentsRes.data) setAgents(agentsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    const agId = sub.assignedAgentId || sub.payload?.assignedAgentId || '';
    setSelectedAgentId(agId);
    setOutcome(sub.outcome || '');
    if (sub.closedAt) {
      setStatusChoice('closed');
    } else if (agId) {
      setStatusChoice('in_progress');
    } else {
      setStatusChoice('pending');
    }
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

    // 2. Update status and follow-up outcome notes
    await fetchApi(`/admin/submissions/${activeModal.id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({
        outcome: outcome || '',
        status: statusChoice,
      }),
    });

    setActiveModal(null);
    setSaving(false);
    await loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            📅 Book a Consultation Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Client advisory briefings and consultation meetings assigned to you.'
              : 'Direct advisory consultation requests, diaspora investor meetings, and portfolio briefings.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading consultation requests...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Client</th>
                  <th style={{ padding: '12px 16px' }}>Preferred Date</th>
                  <th style={{ padding: '12px 16px' }}>Profile & Interest</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Advisor</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                      No consultation requests logged yet.
                    </td>
                  </tr>
                ) : (
                  consultations.map((sub) => {
                    const clientName = sub.clientName || sub.payload?.fullName || sub.payload?.name || 'Prospective Client';
                    const clientEmail = sub.clientEmail || sub.payload?.email || '';
                    const clientPhone = sub.clientPhone || sub.payload?.phone || '';
                    const assignedAgentName = sub.assignedAgent?.name || sub.assignedAgentName || sub.payload?.assignedAgent || null;
                    const prefDate = sub.payload?.preferredDate || null;
                    const profile = sub.payload?.profile || sub.payload?.interest || sub.payload?.subject || 'Consultation Brief';

                    // Clean status calculation
                    const isClosed = Boolean(sub.closedAt);
                    const isAssigned = Boolean(assignedAgentName || sub.assignedAgentId);

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                          {sub.reference}
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
                            <span style={{ color: '#64748b', fontSize: '12px' }}>Prompt / Flexible</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 500, color: '#334155' }}>{profile}</div>
                          {sub.payload?.budget && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Budget: {sub.payload.budget}
                            </div>
                          )}
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
                          {isClosed ? (
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                              ✓ Resolved & Closed
                            </span>
                          ) : isAssigned ? (
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
                            {isAgent ? 'Respond & Log' : 'Review / Assign'}
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

      {/* ── Modal: Review Consultation & Assign Advisor ── */}
      {activeModal && (() => {
        const p = activeModal.payload || {};
        const clientName = activeModal.clientName || p.fullName || p.name || 'Prospective Client';
        const clientEmail = activeModal.clientEmail || p.email || 'None provided';
        const clientPhone = activeModal.clientPhone || p.phone || 'None provided';
        const prefDate = p.preferredDate || null;
        const msg = p.message || p.notes || activeModal.outcome || '';

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
                maxWidth: '620px',
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
                    Consultation Brief
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

              {/* Client summary card */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Client Name</span>
                    <strong style={{ color: '#1e293b' }}>{clientName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Email Address</span>
                    <a href={`mailto:${clientEmail}`} style={{ color: 'var(--forest)', textDecoration: 'none', fontWeight: 600 }}>{clientEmail}</a>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Phone / WhatsApp</span>
                    <a href={`tel:${clientPhone}`} style={{ color: 'var(--forest)', textDecoration: 'none', fontWeight: 600 }}>{clientPhone}</a>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Preferred Date</span>
                    <strong style={{ color: prefDate ? 'var(--forest)' : '#64748b' }}>
                      {prefDate ? new Date(prefDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible / Next Available'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Client Brief / Notes */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Client Consultation Brief & Profile
                </label>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#334155', maxHeight: '160px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {msg || 'No additional message details provided.'}
                </div>
              </div>

              <form onSubmit={handleSave}>
                {!isAgent && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Assign Advisory Officer / Agent
                    </label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    >
                      <option value="">-- No Advisor Assigned (Unassigned) --</option>
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
                    Update Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e) => setStatusChoice(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
                  >
                    <option value="pending">⏳ Pending Review / Unresolved</option>
                    <option value="in_progress">🔄 In Progress / Contact Established</option>
                    <option value="closed">✓ Completed / Consultation Debriefed & Resolved</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Consultation Outcome / Follow-Up Notes
                  </label>
                  <textarea
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    rows={3}
                    placeholder="e.g. Conducted advisory call with client. Verified mandate for Maitama land. Sent NDA & fee schedule."
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
                    {saving ? 'Saving...' : 'Save Consultation Updates'}
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
