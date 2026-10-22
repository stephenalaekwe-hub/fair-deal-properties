'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function AgentListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingListing, setViewingListing] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const listingsRes = await fetchApi('/listings?pageSize=60');
    if (listingsRes.ok && listingsRes.data) {
      setListings(listingsRes.data.listings || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Property Portfolio & Mandate Register
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Direct developer mandates, verified asking prices, and title credentials for client site tours.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading verified portfolio...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Property Title</th>
                  <th style={{ padding: '12px 16px' }}>Mandate Origin</th>
                  <th style={{ padding: '12px 16px' }}>City / Type</th>
                  <th style={{ padding: '12px 16px' }}>Verified Asking Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--forest)' }}>{l.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{l.location}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {l.source}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>{l.city}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                        {l.propertyType}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                      {l.priceDisplay}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setViewingListing(l)}
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
                        View Briefing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Property Mandate Dossier Modal ── */}
      {viewingListing && (
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
                Mandate Dossier: {viewingListing.title}
              </h2>
              <button
                onClick={() => setViewingListing(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Verified Asking Price: </span>
                  <strong style={{ fontSize: '16px', color: '#0f172a' }}>{viewingListing.priceDisplay}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Location & State: </span>
                  <strong>{viewingListing.location}, {viewingListing.city?.toUpperCase()}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Mandate Origin: </span>
                  <strong style={{ textTransform: 'uppercase' }}>{viewingListing.source}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Property Category: </span>
                  <strong style={{ textTransform: 'capitalize' }}>{viewingListing.propertyType}</strong>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                  <span>Diaspora-Friendly: <strong>{viewingListing.diasporaFriendly ? '✅ Yes' : '❌ No'}</strong></span>
                  <span>Mortgage-Eligible: <strong>{viewingListing.mortgageEligible ? '✅ Yes (FMBN/PMI)' : '❌ No'}</strong></span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>MANDATE BRIEFING SUMMARY</div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                  {viewingListing.subtitle || 'Direct developer mandate verified with FCDA/State approvals intact. Available for private physical inspection tours with pre-qualified buyers.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setViewingListing(null)}
                  style={{ padding: '10px 20px', background: 'var(--forest)', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close Briefing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
