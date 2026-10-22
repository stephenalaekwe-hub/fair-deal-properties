'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

import { useAuth } from '@/components/AuthProvider';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

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

  const handleTriggerScraper = async () => {
    setScanning(true);
    setScanMessage('Scanning external institutional portals (FMBN, MREIF, NMRC, FHA)...');
    const res = await fetchApi('/admin/listener/run-now', { method: 'POST' });
    if (res.ok) {
      setScanMessage('Scan complete! Detected updates logged for review.');
      await loadStats();
    } else {
      setScanMessage('Scan failed or server busy.');
    }
    setScanning(false);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#64748b' }}>Loading dashboard telemetry...</div>;
  }

  const kpis = isAgent
    ? [
        { label: 'Portfolio Properties', val: stats?.totalListings || 0, icon: '🏢', color: '#0d2b1e' },
        { label: 'My Active Inspections', val: stats?.activeInspections || 0, icon: '🔍', color: '#0284c7' },
        { label: 'My Completed Inspections', val: stats?.completedInspections || 0, icon: '✅', color: '#16a34a' },
        { label: 'My Assigned Leads', val: stats?.pendingSubmissions || 0, icon: '📬', color: '#d97706' },
      ]
    : [
        { label: 'Verified Properties', val: stats?.totalListings || 0, icon: '🏢', color: '#0d2b1e' },
        { label: 'Active Inspections', val: stats?.activeInspections || 0, icon: '🔍', color: '#0284c7' },
        { label: 'Completed Inspections', val: stats?.completedInspections || 0, icon: '✅', color: '#16a34a' },
        { label: 'Pending Client Inquiries', val: stats?.pendingSubmissions || 0, icon: '📬', color: '#d97706' },
        { label: 'Live Rate/Price Alerts', val: stats?.priceAlertsCount || 0, icon: '⚡', color: '#dc2626' },
      ];

  return (
    <div>
      {/* ── Title & Quick Action ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            {isAgent ? `Field Operations — ${user?.name}` : 'Operations & Compliance Telemetry'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Your assigned inspection cases, active client enquiries, and field verification tasks.'
              : 'Overview of verified listings, field inspections pipeline, and live rate listeners.'}
          </p>
        </div>

        {!isAgent && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleTriggerScraper}
              disabled={scanning}
              style={{
                padding: '10px 18px',
                background: '#0d2b1e',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: scanning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{scanning ? '⏳' : '⚡'}</span>
              <span>{scanning ? 'Scanning Portals...' : 'Scan Market Rates Now'}</span>
            </button>
          </div>
        )}
      </div>

      {scanMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          {scanMessage}
        </div>
      )}

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
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Active Inspections</h3>
            <Link href="/admin/inspections" style={{ fontSize: '12px', color: 'var(--forest)', fontWeight: 600 }}>
              View All ↗
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px 4px' }}>Ref</th>
                  <th style={{ padding: '8px 4px' }}>Client</th>
                  <th style={{ padding: '8px 4px' }}>Stage</th>
                  <th style={{ padding: '8px 4px' }}>Agent</th>
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
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>
                        {ins.assignedAgent?.name || 'Unassigned'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
                      No active inspections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Client Submissions */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Recent Client Inquiries & DSR</h3>
            <Link href="/admin/submissions" style={{ fontSize: '12px', color: 'var(--forest)', fontWeight: 600 }}>
              View All ↗
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '8px 4px' }}>Ref</th>
                  <th style={{ padding: '8px 4px' }}>Type</th>
                  <th style={{ padding: '8px 4px' }}>Client</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                  stats.recentSubmissions.map((sub: any) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 600, color: 'var(--forest)' }}>{sub.reference}</td>
                      <td style={{ padding: '10px 4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>
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
                          {sub.closedAt ? 'Closed' : 'Action Required'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
                      No submissions logged yet.
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
