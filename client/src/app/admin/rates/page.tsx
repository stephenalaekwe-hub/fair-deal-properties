'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function AdminRatesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [routesRes, logsRes] = await Promise.all([
      fetchApi('/rates/financing'),
      fetchApi('/admin/scraped-logs'),
    ]);

    if (routesRes.ok && routesRes.data) setRoutes(routesRes.data);
    if (logsRes.ok && logsRes.data) setLogs(logsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    setScanStatus('Running background scraper across FMBN, MREIF, NMRC and FHA...');
    const res = await fetchApi('/admin/listener/run-now', { method: 'POST' });
    if (res.ok) {
      setScanStatus('Scan completed successfully! Check detected logs below.');
      await loadData();
    } else {
      setScanStatus('Scan encountered a problem or server was busy.');
    }
    setScanning(false);
  };

  const handleApplyLog = async (id: string) => {
    setApplyingId(id);
    const res = await fetchApi(`/admin/scraped-logs/${id}/apply`, { method: 'POST' });
    if (res.ok) {
      await loadData();
    }
    setApplyingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Financing Routes & Live Market Listener
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Automated rate monitors for FMBN, MREIF, NMRC and FHA, plus manual rate adjustments.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={scanning}
          style={{
            padding: '10px 18px',
            background: 'var(--forest)',
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
          <span>{scanning ? 'Scanning Live Portals...' : 'Trigger Live Portal Scan'}</span>
        </button>
      </div>

      {scanStatus && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '24px' }}>
          {scanStatus}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading rates and listener data...</div>
      ) : (
        <>
          {/* ── Active Financing Schemes ── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: 'var(--forest)' }}>
              Active Financing Routes (Published on Comparator)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px' }}>Scheme Name</th>
                    <th style={{ padding: '12px 16px' }}>Supervising Institution</th>
                    <th style={{ padding: '12px 16px' }}>Interest Rate</th>
                    <th style={{ padding: '12px 16px' }}>Max Tenor</th>
                    <th style={{ padding: '12px 16px' }}>Min Equity</th>
                    <th style={{ padding: '12px 16px' }}>Last Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>{r.name}</td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.institution}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: r.interestRatePct ? 'var(--forest)' : '#64748b' }}>
                        {r.interestRatePct !== null ? `${r.interestRatePct}% p.a.` : 'Subject to PMI / Bank'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.maxTermYears ? `${r.maxTermYears} Years` : 'N/A'}</td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.minEquityPct ? `${r.minEquityPct}%` : 'Variable'}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>{r.lastVerified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Scraped Telemetry Logs ── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a' }}>
              External Portal Telemetry & Detected Movements
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px' }}>External Source</th>
                    <th style={{ padding: '12px 16px' }}>Target Benchmark</th>
                    <th style={{ padding: '12px 16px' }}>Previous</th>
                    <th style={{ padding: '12px 16px' }}>Detected Live</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{log.sourceName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{log.sourceUrl}</div>
                        </td>
                        <td style={{ padding: '14px 16px', textTransform: 'uppercase', fontWeight: 600 }}>
                          {log.targetReference}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>{log.oldValue || 'N/A'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#dc2626' }}>
                          {log.newValue}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              background: log.status === 'APPLIED' ? '#dcfce7' : '#fef3c7',
                              color: log.status === 'APPLIED' ? '#15803d' : '#b45309',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          {log.status === 'DETECTED' ? (
                            <button
                              onClick={() => handleApplyLog(log.id)}
                              disabled={applyingId === log.id}
                              style={{
                                padding: '6px 12px',
                                background: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: applyingId === log.id ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {applyingId === log.id ? 'Applying...' : 'Apply to Live'}
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>✓ Applied</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8' }}>
                        No price discrepancies detected. All published rates match benchmark. Click &quot;Trigger Live Portal Scan&quot; to test.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
