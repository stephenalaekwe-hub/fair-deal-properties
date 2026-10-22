'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AgentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/analytics/overview');
    if (res.ok && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: '#64748b' }}>Loading field officer telemetry...</div>;
  }

  const kpis = [
    { label: 'Portfolio Properties', val: stats?.totalListings || 0, icon: '🏢', color: '#0d2b1e' },
    { label: 'My Active Inspections', val: stats?.activeInspections || 0, icon: '🔍', color: '#0284c7' },
    { label: 'My Completed Inspections', val: stats?.completedInspections || 0, icon: '✅', color: '#16a34a' },
    { label: 'My Assigned Leads', val: stats?.pendingSubmissions || 0, icon: '📬', color: '#d97706' },
  ];

  return (
    <div>
      {/* ── Title & Quick Action ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Field Operations — {user?.name}
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Your assigned inspection cases, active client enquiries, and field verification tasks.
          </p>
        </div>

        <div>
          <Link
            href="/agent/inspections"
            style={{
              padding: '10px 18px',
              background: 'var(--forest)',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🔍</span>
            <span>Go to My Inspections</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{kpi.label}</span>
              <span style={{ fontSize: '20px' }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: kpi.color, marginTop: '12px' }}>
              {kpi.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── Dual Table Section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Recent Inspections */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>My Active Inspections</h3>
            <Link href="/agent/inspections" style={{ fontSize: '12px', color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>
              View All ↗
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px 4px' }}>Ref</th>
                  <th style={{ padding: '8px 4px' }}>Client</th>
                  <th style={{ padding: '8px 4px' }}>Current Stage</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentInspections && stats.recentInspections.length > 0 ? (
                  stats.recentInspections.map((ins: any) => (
                    <tr key={ins.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 600, color: 'var(--forest)' }}>{ins.reference}</td>
                      <td style={{ padding: '10px 4px' }}>{ins.clientName}</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span
                          style={{
                            background: ins.stage === 9 ? '#dcfce7' : '#e0f2fe',
                            color: ins.stage === 9 ? '#15803d' : '#0369a1',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        >
                          Stage {ins.stage}/9
                        </span>
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                        <Link
                          href="/agent/inspections"
                          style={{
                            fontSize: '11px',
                            color: 'var(--forest)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '3px 8px',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                          }}
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
                      No active inspections assigned to your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Inquiries */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>My Assigned Client Inquiries</h3>
            <Link href="/agent/submissions" style={{ fontSize: '12px', color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>
              View All ↗
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px 4px' }}>Type</th>
                  <th style={{ padding: '8px 4px' }}>Client</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                  stats.recentSubmissions.map((sub: any) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 4px', textTransform: 'uppercase', fontWeight: 600, fontSize: '11px', color: '#475569' }}>
                        {sub.collection}
                      </td>
                      <td style={{ padding: '10px 4px' }}>{sub.clientName || 'Anonymous'}</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span
                          style={{
                            background: sub.closedAt ? '#f1f5f9' : '#fef3c7',
                            color: sub.closedAt ? '#64748b' : '#b45309',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        >
                          {sub.closedAt ? 'Closed' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                        <Link
                          href="/agent/submissions"
                          style={{
                            fontSize: '11px',
                            color: 'var(--forest)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '3px 8px',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                          }}
                        >
                          Follow Up →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
                      No pending client enquiries currently assigned to you.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
