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

  // Rate Editing State
  const [editingRoute, setEditingRoute] = useState<any | null>(null);
  const [rateName, setRateName] = useState('');
  const [rateInstitution, setRateInstitution] = useState('');
  const [rateInterestPct, setRateInterestPct] = useState('');
  const [rateMaxTermYears, setRateMaxTermYears] = useState('');
  const [rateMinEquityPct, setRateMinEquityPct] = useState('');
  const [rateVerificationNote, setRateVerificationNote] = useState('');
  const [rateLastVerified, setRateLastVerified] = useState('');
  const [savingRate, setSavingRate] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
    setScanStatus('Running live portal & property listener across FMBN, MREIF, FHF, FHA, and NMRC...');
    const res = await fetchApi('/admin/listener/run-now', { method: 'POST' });
    if (res.ok) {
      setScanStatus(
        (res.data as any)?.message ||
          'Live portal scan completed! Check detected rates and institutional property allocations below.'
      );
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
      setScanStatus('✓ Institutional financing rate and linked Marketplace property price synchronized to live!');
      await loadData();
    }
    setApplyingId(null);
  };

  const openEditModal = (route: any) => {
    setEditingRoute(route);
    setRateName(route.name || '');
    setRateInstitution(route.institution || '');
    setRateInterestPct(route.interestRatePct !== null && route.interestRatePct !== undefined ? String(route.interestRatePct) : '');
    setRateMaxTermYears(route.maxTermYears ? String(route.maxTermYears) : '');
    setRateMinEquityPct(route.minEquityPct !== null && route.minEquityPct !== undefined ? String(route.minEquityPct) : '');
    setRateVerificationNote(route.verificationNote || '');
    setRateLastVerified(route.lastVerified || new Date().toISOString().slice(0, 10));
    setSaveMessage('');
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;
    setSavingRate(true);
    setSaveMessage('');

    const res = await fetchApi(`/rates/financing/${editingRoute.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: rateName,
        institution: rateInstitution,
        interestRatePct: rateInterestPct !== '' ? parseFloat(rateInterestPct) : null,
        maxTermYears: rateMaxTermYears !== '' ? parseInt(rateMaxTermYears, 10) : null,
        minEquityPct: rateMinEquityPct !== '' ? parseFloat(rateMinEquityPct) : null,
        verificationNote: rateVerificationNote,
        lastVerified: rateLastVerified,
      }),
    });

    if (res.ok) {
      setSaveMessage('Rate updated and published live to comparator successfully!');
      setTimeout(() => {
        setEditingRoute(null);
        setSaveMessage('');
      }, 1000);
      await loadData();
    } else {
      alert(res.error || 'Failed to update financing route rate.');
    }
    setSavingRate(false);
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
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--forest)' }}>Active Financing Routes (Published on Comparator)</span>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Click "Edit Rate" on any scheme to modify interest rates, tenors, or equity terms before or after publication.
                </div>
              </div>
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
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>{r.name}</td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.institution}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: r.interestRatePct !== null ? 'var(--forest)' : '#64748b' }}>
                        {r.interestRatePct !== null && r.interestRatePct !== undefined ? `${r.interestRatePct}% p.a.` : 'Subject to PMI / Bank'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.maxTermYears ? `${r.maxTermYears} Years` : 'N/A'}</td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>{r.minEquityPct !== null && r.minEquityPct !== undefined ? `${r.minEquityPct}%` : 'Variable'}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>{r.lastVerified}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => openEditModal(r)}
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
                          Edit Rate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Scraped Telemetry Logs ── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  External Portal Telemetry &amp; Institutional Property Listener
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Monitors FMBN, MREIF, FHF, FHA, and NMRC portals and synchronizes both financing comparator rates and linked Marketplace properties.
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px' }}>External Source</th>
                    <th style={{ padding: '12px 16px' }}>Benchmark &amp; Linked Property</th>
                    <th style={{ padding: '12px 16px' }}>Previous</th>
                    <th style={{ padding: '12px 16px' }}>Detected Live</th>
                    <th style={{ padding: '12px 16px' }}>Last Checked</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log) => {
                      const isPending = log.status === 'PENDING_REVIEW' || log.status === 'DETECTED';
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{log.sourcePortal}</div>
                            {log.portalUrl && (
                              <a
                                href={log.portalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '11px', color: '#0d9488', textDecoration: 'none' }}
                              >
                                {log.portalUrl} ↗
                              </a>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#475569' }}>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{log.targetBenchmark}</div>
                            {log.listingTitle && (
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                                🏠 Linked Property: <strong style={{ color: 'var(--forest)' }}>{log.listingTitle}</strong>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#64748b' }}>
                            <div>{log.previousRatePct}% p.a.</div>
                            {log.previousPriceMillionsNGN !== undefined && (
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                Base: ₦{log.previousPriceMillionsNGN}M
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: isPending ? '#b45309' : 'var(--forest)' }}>
                            <div>{log.detectedRatePct}% p.a.</div>
                            {log.detectedPriceDisplay && (
                              <div style={{ fontSize: '11px', color: '#0f766e', fontWeight: 600 }}>
                                Base: {log.detectedPriceDisplay}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>
                            {log.detectedAt
                              ? new Date(log.detectedAt).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Just now'}
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
                            {isPending ? (
                              <button
                                onClick={() => handleApplyLog(log.id)}
                                disabled={applyingId === log.id}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--gold)',
                                  color: 'var(--forest)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: applyingId === log.id ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {applyingId === log.id ? 'Applying...' : 'Apply to Live'}
                              </button>
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>✓ Applied</span>
                                <button
                                  onClick={() => handleApplyLog(log.id)}
                                  disabled={applyingId === log.id}
                                  style={{
                                    padding: '4px 8px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: applyingId === log.id ? 'not-allowed' : 'pointer',
                                  }}
                                  title="Re-synchronize this benchmark rate and property price to live"
                                >
                                  {applyingId === log.id ? '...' : 'Re-Sync'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8' }}>
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

      {/* ── Edit Rate Modal ── */}
      {editingRoute && (
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
                  Edit Financing Route &amp; Live Rate
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Changes will be reflected immediately in the public financing comparator.
                </div>
              </div>
              <button
                onClick={() => setEditingRoute(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {saveMessage && (
              <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                {saveMessage}
              </div>
            )}

            <form onSubmit={handleSaveRate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Scheme / Window Name
                </label>
                <input
                  type="text"
                  value={rateName}
                  onChange={(e) => setRateName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Supervising Institution
                </label>
                <input
                  type="text"
                  value={rateInstitution}
                  onChange={(e) => setRateInstitution(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="100"
                    value={rateInterestPct}
                    onChange={(e) => setRateInterestPct(e.target.value)}
                    placeholder="e.g. 6.0"
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Max Tenor (Years)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="50"
                    value={rateMaxTermYears}
                    onChange={(e) => setRateMaxTermYears(e.target.value)}
                    placeholder="e.g. 30"
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Min Equity (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={rateMinEquityPct}
                    onChange={(e) => setRateMinEquityPct(e.target.value)}
                    placeholder="e.g. 20"
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Verification / Circular Reference Note
                </label>
                <input
                  type="text"
                  value={rateVerificationNote}
                  onChange={(e) => setRateVerificationNote(e.target.value)}
                  placeholder="e.g. Verified via FMBN Circular Ref: FMBN/MD/2026/04"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Last Verified Date
                </label>
                <input
                  type="date"
                  value={rateLastVerified}
                  onChange={(e) => setRateLastVerified(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRate}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--forest)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: savingRate ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {savingRate ? 'Publishing Updates...' : 'Publish Rate Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
