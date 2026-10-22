'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AdminSubmissionsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    if (isAgent) {
      const subRes = await fetchApi('/admin/submissions');
      if (subRes.ok && subRes.data) setSubmissions(subRes.data);
    } else {
      const [subRes, agentsRes] = await Promise.all([
        fetchApi('/admin/submissions'),
        fetchApi('/admin/agents'),
      ]);
      if (subRes.ok && subRes.data) setSubmissions(subRes.data);
      if (agentsRes.ok && agentsRes.data) setAgents(agentsRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openModal = (sub: any) => {
    setActiveModal(sub);
    setSelectedAgentId(sub.assignedAgentId || '');
    setOutcome(sub.outcome || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;
    setSaving(true);

    // 1. Assign agent if changed (Admin/SuperAdmin only)
    if (!isAgent && selectedAgentId !== (activeModal.assignedAgentId || '')) {
      await fetchApi(`/admin/submissions/${activeModal.id}/assign-agent`, {
        method: 'PATCH',
        body: JSON.stringify({ agentId: selectedAgentId || null }),
      });
    }

    // 2. Close submission if outcome provided
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
            {isAgent ? 'My Assigned Leads & Client Inquiries' : 'Client Leads & NDPA Compliance Register'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Enquiries, private viewing briefs, and consultation requests routed to you for client engagement.'
              : 'Inquiries, contact consultations, property alerts, and statutory Data Subject Requests (DSR 30-day clock).'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading submissions...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Reference</th>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px' }}>Client Info</th>
                  <th style={{ padding: '12px 16px' }}>Statutory Due Date</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      No client inquiries or submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--forest)' }}>
                        {sub.reference}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: sub.collection === 'dsr' ? '#fee2e2' : '#f1f5f9',
                            color: sub.collection === 'dsr' ? '#991b1b' : '#334155',
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
                        <div style={{ fontWeight: 600 }}>{sub.clientName || 'Anonymous User'}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {sub.clientEmail || 'No email'}{sub.clientPhone ? ` · ${sub.clientPhone}` : ''}
                        </div>
                        {sub.payload?.propertyTitle && (
                          <div style={{ fontSize: '11px', color: 'var(--forest)', fontWeight: 600, marginTop: '2px' }}>
                            🏠 {sub.payload.propertyTitle} {sub.payload.propertyPrice ? `(${sub.payload.propertyPrice})` : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: sub.dueAt ? '#b45309' : '#64748b' }}>
                        {sub.dueAt ? new Date(sub.dueAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {sub.assignedAgent ? (
                          <span style={{ fontWeight: 600, color: '#334155' }}>👤 {sub.assignedAgent.name}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Unassigned</span>
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
                        {sub.closedAt ? 'Closed' : 'Pending'}
                      </span>
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
                        {isAgent ? 'Respond / Resolve' : 'Review / Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Manage Submission Modal ── */}
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
                Review: {activeModal.reference}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                <div><strong>Submission Type:</strong> <span style={{ textTransform: 'uppercase', color: 'var(--forest)' }}>{activeModal.collection}</span></div>
                <div style={{ marginTop: '4px' }}><strong>Client:</strong> {activeModal.clientName || 'N/A'} ({activeModal.clientEmail || 'No email'})</div>
                {activeModal.clientPhone && <div><strong>Phone / WhatsApp:</strong> {activeModal.clientPhone}</div>}
                {activeModal.payload?.propertyTitle && (
                  <div style={{ marginTop: '6px', padding: '6px 10px', background: '#ecfdf5', borderRadius: '4px', color: '#065f46', fontSize: '12px' }}>
                    <strong>Inquired Property:</strong> {activeModal.payload.propertyTitle} {activeModal.payload.propertyPrice ? `(${activeModal.payload.propertyPrice})` : ''}
                  </div>
                )}
                {activeModal.payload?.buyerType && <div style={{ marginTop: '4px' }}><strong>Buyer Profile:</strong> {activeModal.payload.buyerType}</div>}
                {activeModal.payload?.financing && <div><strong>Financing Preference:</strong> {activeModal.payload.financing}</div>}
                {activeModal.payload?.message && <div style={{ marginTop: '4px' }}><strong>Message:</strong> <em>"{activeModal.payload.message}"</em></div>}
                <div style={{ marginTop: '8px', maxHeight: '90px', overflowY: 'auto', background: '#ffffff', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>
                  {JSON.stringify(activeModal.payload, null, 2)}
                </div>
              </div>

              {isAgent ? (
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Assigned Lead Handler: </span>
                  <strong style={{ color: 'var(--forest)' }}>{user?.name} (You)</strong>
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Assign Agent to Follow Up
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  {activeModal.closedAt ? 'Resolution Outcome' : 'Resolution / Follow-Up Outcome Notes'}
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={3}
                  placeholder="e.g. Consultation completed, client scheduled private viewing for Saturday."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
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
                  {saving ? 'Saving...' : (isAgent ? 'Log Outcome & Resolve' : 'Save Updates')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
