'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useCurrency } from '@/components/CurrencyProvider';

export default function AgentConsultationsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [statusChoice, setStatusChoice] = useState<'pending' | 'in_progress' | 'closed'>('pending');
  const [outcome, setOutcome] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const subRes = await fetchApi('/admin/submissions?collection=contact');
    if (subRes.ok && subRes.data && user) {
      // Filter consultations strictly assigned to this agent
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
      setConsultations(list);
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
      alert(closeRes.error || 'Failed to update consultation status.');
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
            📅 My Assigned Consultations & Client Briefings
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Client advisory briefings, scheduled meetings, and investment consultations assigned to you.
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
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                      No consultation requests currently assigned to your account.
                    </td>
                  </tr>
                ) : (
                  consultations.map((sub) => {
                    const clientName = sub.clientName || sub.payload?.fullName || sub.payload?.name || 'Anonymous Client';
                    const clientEmail = sub.clientEmail || sub.payload?.email || '';
                    const clientPhone = sub.clientPhone || sub.payload?.phone || '';
                    const prefDate = sub.payload?.preferredDate || null;
                    const subject = sub.payload?.subject || 'Property Advisory';
                    const budget = sub.payload?.budget || null;
                    const itemStatus = sub.status || (sub.closedAt ? 'closed' : ((sub.assignedAgentName || sub.assignedAgentId) ? 'in_progress' : 'pending'));

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
                            <span style={{ color: '#64748b', fontSize: '12px' }}>Flexible / Immediate</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 500, color: '#334155' }}>{subject}</div>
                          {budget && (
                            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, marginTop: '2px' }}>
                              Budget: {budget}
                            </div>
                          )}
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

      {/* ── Consultation Response & Status Modal ── */}
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
                  Client Advisory Briefing & Consultation Lead
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
                    <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Preferred Date</span>
                    <strong>
                      {activeModal.payload?.preferredDate
                        ? new Date(activeModal.payload.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Immediate / Flexible'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Subject / Advisory Focus
                </label>
                <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--forest)' }}>
                  {activeModal.payload?.subject || 'General Property Due Diligence & Investment Advisory'}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Client Message / Mandate Scope
                </label>
                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#334155', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                  {activeModal.payload?.message || activeModal.payload?.notes || 'No extra message provided.'}
                </div>
              </div>

              {/* Update Status */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Update Consultation Status
                </label>
                <select
                  value={statusChoice}
                  onChange={(e) => setStatusChoice(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}
                >
                  <option value="pending">⏳ Pending Review / Unresolved</option>
                  <option value="in_progress">🗂️ In Progress / Contact Established</option>
                  <option value="closed">✓ Completed / Briefing Conducted & Resolved</option>
                </select>
              </div>

              {/* Outcome Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Follow-up Notes / Resolution Outcome
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Record summary of client briefing, next action steps, or completion notes..."
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
                  {saving ? 'Saving...' : 'Save Consultation Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
