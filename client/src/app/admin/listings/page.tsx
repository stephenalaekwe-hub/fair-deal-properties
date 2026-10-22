'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ImageUpload from '@/components/ImageUpload';

export default function AdminListingsPage() {
  const { user } = useAuth();
  const isAgent = user?.role === 'AGENT';

  const [listings, setListings] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [newPriceMillions, setNewPriceMillions] = useState('');
  const [newPriceDisplay, setNewPriceDisplay] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [newImage, setNewImage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    if (isAgent) {
      const listingsRes = await fetchApi('/listings?pageSize=60');
      if (listingsRes.ok && listingsRes.data) setListings(listingsRes.data.listings || []);
    } else {
      const [listingsRes, agentsRes] = await Promise.all([
        fetchApi('/listings?pageSize=60'),
        fetchApi('/admin/agents'),
      ]);
      if (listingsRes.ok && listingsRes.data) setListings(listingsRes.data.listings || []);
      if (agentsRes.ok && agentsRes.data) setAgents(agentsRes.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openEditModal = (listing: any) => {
    setEditingListing(listing);
    setNewPriceMillions(listing.priceMillionsNGN ? String(listing.priceMillionsNGN) : '');
    setNewPriceDisplay(listing.priceDisplay || '');
    setSelectedAgentId(listing.assignedAgentId || '');
    setNewImage(listing.image || '');
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing || isAgent) return;
    setSaving(true);

    // 1. Update price override and image
    await fetchApi(`/admin/listings/${editingListing.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        priceMillionsNGN: newPriceMillions ? parseFloat(newPriceMillions) : null,
        priceDisplay: newPriceDisplay,
        image: newImage || undefined,
      }),
    });

    // 2. Update agent assignment
    if (selectedAgentId !== (editingListing.assignedAgentId || '')) {
      await fetchApi(`/admin/listings/${editingListing.id}/assign-agent`, {
        method: 'PATCH',
        body: JSON.stringify({ agentId: selectedAgentId || null }),
      });
    }

    setEditingListing(null);
    setSaving(false);
    await loadData();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Verified Property Register
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Direct developer mandates, verified property catalog, title statuses, and asking prices.'
              : 'Direct mandates, institutional stock (FHA, FMBN, MREIF), manual price overrides, and agent assignments.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading property register...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Property Title</th>
                  <th style={{ padding: '12px 16px' }}>Source / Scheme</th>
                  <th style={{ padding: '12px 16px' }}>City / Type</th>
                  <th style={{ padding: '12px 16px' }}>Verified Asking Price</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
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
                    <td style={{ padding: '14px 16px' }}>
                      {l.assignedAgent ? (
                        <span style={{ fontWeight: 600, color: '#334155' }}>👤 {l.assignedAgent.name}</span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(l)}
                        style={{
                          padding: '6px 12px',
                          background: isAgent ? 'var(--forest)' : '#f1f5f9',
                          color: isAgent ? '#ffffff' : '#0f172a',
                          border: isAgent ? 'none' : '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isAgent ? 'View Briefing' : 'Override / Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Listing Modal (Briefing for Agents / Edit for Admins) ── */}
      {editingListing && (
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
                {isAgent ? `Mandate Dossier: ${editingListing.title}` : `Edit: ${editingListing.title}`}
              </h2>
              <button
                onClick={() => setEditingListing(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {isAgent ? (
              <div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Verified Asking Price: </span>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{editingListing.priceDisplay}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Location & State: </span>
                    <strong>{editingListing.location}, {editingListing.city?.toUpperCase()}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Mandate Origin: </span>
                    <strong style={{ textTransform: 'uppercase' }}>{editingListing.source}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Property Category: </span>
                    <strong style={{ textTransform: 'capitalize' }}>{editingListing.propertyType}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                    <span>Diaspora-Friendly: <strong>{editingListing.diasporaFriendly ? '✅ Yes' : '❌ No'}</strong></span>
                    <span>Mortgage-Eligible: <strong>{editingListing.mortgageEligible ? '✅ Yes (FMBN/PMI)' : '❌ No'}</strong></span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>MANDATE BRIEFING SUMMARY</div>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                    {editingListing.subtitle || 'Direct developer mandate verified with FCDA/State approvals intact. Available for private physical inspection tours with pre-qualified buyers.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    style={{ padding: '10px 20px', background: 'var(--forest)', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close Briefing
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveListing}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Assign Portfolio Agent
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Numerical Price (in ₦ Millions)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPriceMillions}
                    onChange={(e) => {
                      setNewPriceMillions(e.target.value);
                      if (e.target.value) {
                        setNewPriceDisplay(`₦${Number(e.target.value) * 1_000_000 >= 1_000_000_000 ? `${(Number(e.target.value)/1000).toFixed(2)}B` : `${Number(e.target.value).toLocaleString()}M`}`);
                      }
                    }}
                    placeholder="e.g. 120"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Display Price String
                  </label>
                  <input
                    type="text"
                    value={newPriceDisplay}
                    onChange={(e) => setNewPriceDisplay(e.target.value)}
                    placeholder="e.g. ₦120,000,000"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <ImageUpload
                    label="Listing Primary Photograph (Pictures Only)"
                    helperText="Upload verified high-resolution photograph (PNG, JPG, WebP). Videos are strictly prohibited."
                    value={newImage}
                    onChange={setNewImage}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
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
                    {saving ? 'Updating...' : 'Save Listing Details'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
