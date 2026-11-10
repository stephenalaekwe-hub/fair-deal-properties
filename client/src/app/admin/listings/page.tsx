'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ImageUpload from '@/components/ImageUpload';
import { useCurrency } from '@/components/CurrencyProvider';

export default function AdminListingsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const isAgent = user?.role === 'AGENT';

  const [listings, setListings] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingListing, setEditingListing] = useState<any>(null);
  const [newPriceMillions, setNewPriceMillions] = useState('');
  const [newPriceDisplay, setNewPriceDisplay] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [newImage, setNewImage] = useState('');
  const [saving, setSaving] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createSubtitle, setCreateSubtitle] = useState('');
  const [createSource, setCreateSource] = useState('fdp');
  const [createPropertyType, setCreatePropertyType] = useState('residential');
  const [createCity, setCreateCity] = useState('abuja');
  const [createLocation, setCreateLocation] = useState('');
  const [createPriceMillions, setCreatePriceMillions] = useState('');
  const [createPriceDisplay, setCreatePriceDisplay] = useState('');
  const [createSpecification, setCreateSpecification] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createDiaspora, setCreateDiaspora] = useState(true);
  const [createMortgage, setCreateMortgage] = useState(false);
  const [createOffPlan, setCreateOffPlan] = useState(false);
  const [createImage, setCreateImage] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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
    setNewImage(
      Array.isArray(listing.images) && listing.images.length > 1
        ? JSON.stringify(listing.images)
        : listing.image || ''
    );
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    if (!createTitle || !createLocation || !createPriceDisplay) {
      setCreateError('Please complete all required fields (Title, Location, Price).');
      return;
    }
    setCreating(true);

    const res = await fetchApi('/admin/listings', {
      method: 'POST',
      body: JSON.stringify({
        title: createTitle,
        subtitle: createSubtitle,
        source: createSource,
        propertyType: createPropertyType,
        city: createCity,
        location: createLocation,
        priceMillionsNGN: createPriceMillions ? parseFloat(createPriceMillions) : null,
        priceDisplay: createPriceDisplay,
        specification: createSpecification,
        description: createDescription,
        diasporaFriendly: createDiaspora,
        mortgageEligible: createMortgage,
        offPlan: createOffPlan,
        image: createImage || undefined,
      }),
    });

    if (res.ok) {
      setShowCreateModal(false);
      // Reset form
      setCreateTitle('');
      setCreateSubtitle('');
      setCreateLocation('');
      setCreatePriceMillions('');
      setCreatePriceDisplay('');
      setCreateSpecification('');
      setCreateDescription('');
      setCreateImage('');
      await loadData();
    } else {
      setCreateError(res.error || 'Failed to publish new listing.');
    }
    setCreating(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Verified Property Register
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Direct developer mandates, verified property catalog, title statuses, and asking prices.'
              : 'Direct mandates, institutional stock (FHA, FMBN, MREIF), manual price overrides, photo management, and agent assignments.'}
          </p>
        </div>

        {!isAgent && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 18px',
              background: 'var(--forest)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>+</span>
            <span>Publish New Property</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '20px', color: '#64748b' }}>Loading property register...</div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Property Title &amp; Photo</th>
                  <th style={{ padding: '12px 16px' }}>Source / Scheme</th>
                  <th style={{ padding: '12px 16px' }}>City / Type</th>
                  <th style={{ padding: '12px 16px' }}>Verified Asking Price</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Agent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id || l.slug} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {l.image ? (
                          <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0, position: 'relative' }}>
                            <img
                              src={l.image}
                              alt={l.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#ecfdf5', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                            🏠
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--forest)' }}>{l.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{l.location}</div>
                        </div>
                      </div>
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
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(l.priceMillionsNGN, l.priceDisplay)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {l.assignedAgent ? (
                        <span style={{ fontWeight: 600, color: 'var(--forest)', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          👤 {l.assignedAgent.name}
                        </span>
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
                        {isAgent ? 'View Briefing' : 'Edit / Photo'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Publish New Property Modal ── */}
      {showCreateModal && (
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
              maxWidth: '640px',
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
                  Publish New Property Mandate
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Property will appear on the verified marketplace catalog for client viewing.
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {createError && (
              <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #f87171', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateListing}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="e.g. Luxury 5-Bedroom Detached Villa"
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subtitle / Highlights
                </label>
                <input
                  type="text"
                  value={createSubtitle}
                  onChange={(e) => setCreateSubtitle(e.target.value)}
                  placeholder="e.g. Elevated plot with private pool and verified C of O"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Property Category *
                  </label>
                  <select
                    value={createPropertyType}
                    onChange={(e) => setCreatePropertyType(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    City / Territory *
                  </label>
                  <select
                    value={createCity}
                    onChange={(e) => setCreateCity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="abuja">Abuja FCT</option>
                    <option value="lagos">Lagos State</option>
                    <option value="ogun">Ogun State</option>
                    <option value="nationwide">Nationwide</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Specific Location / District *
                  </label>
                  <input
                    type="text"
                    value={createLocation}
                    onChange={(e) => setCreateLocation(e.target.value)}
                    placeholder="e.g. Maitama, Abuja FCT"
                    required
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Mandate Origin / Source
                  </label>
                  <select
                    value={createSource}
                    onChange={(e) => setCreateSource(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="fdp">FDP Direct Exclusive</option>
                    <option value="developer">Vetted Developer Partner</option>
                    <option value="mreif">MREIF Institutional Stock</option>
                    <option value="fha">Federal Housing Authority (FHA)</option>
                    <option value="fmbn">FMBN / NHF Eligible</option>
                    <option value="offmarket">Off-Market Advisory</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Numeric Price (₦ Millions)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={createPriceMillions}
                    onChange={(e) => {
                      setCreatePriceMillions(e.target.value);
                      if (e.target.value && !createPriceDisplay) {
                        setCreatePriceDisplay(`₦${Number(e.target.value) >= 1000 ? `${(Number(e.target.value)/1000).toFixed(2)}B` : `${Number(e.target.value).toLocaleString()}M`}`);
                      }
                    }}
                    placeholder="e.g. 450"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Display Price String *
                  </label>
                  <input
                    type="text"
                    value={createPriceDisplay}
                    onChange={(e) => setCreatePriceDisplay(e.target.value)}
                    placeholder="e.g. ₦450M or ₦1.2B"
                    required
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createDiaspora}
                    onChange={(e) => setCreateDiaspora(e.target.checked)}
                  />
                  <span>Diaspora-Friendly</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createMortgage}
                    onChange={(e) => setCreateMortgage(e.target.checked)}
                  />
                  <span>Mortgage-Eligible</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createOffPlan}
                    onChange={(e) => setCreateOffPlan(e.target.checked)}
                  />
                  <span>Off-Plan Development</span>
                </label>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Specification Summary
                </label>
                <input
                  type="text"
                  value={createSpecification}
                  onChange={(e) => setCreateSpecification(e.target.value)}
                  placeholder="e.g. 5-bed Fully Detached Duplex · 640m²"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              {/* ── Image Upload Component ── */}
              <div style={{ marginBottom: '24px' }}>
                <ImageUpload
                  label="Listing Photograph (Pictures Only)"
                  helperText="Upload verified high-resolution photograph (PNG, JPG, WebP) for client display. Videos are strictly prohibited."
                  value={createImage}
                  onChange={setCreateImage}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '10px 22px',
                    background: 'var(--forest)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: creating ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {creating ? 'Publishing...' : 'Publish Property Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Listing Modal ── */}
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
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>
                  {isAgent ? 'Property Briefing' : 'Edit Property Details & Photo'}
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{editingListing.title}</div>
              </div>
              <button
                onClick={() => setEditingListing(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {isAgent ? (
              <div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Verified Asking Price: </span>
                    <strong style={{ fontSize: '16px', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                      {formatPrice(editingListing.priceMillionsNGN, editingListing.priceDisplay)}
                    </strong>
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
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="">-- No Agent Assigned --</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
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
                          setNewPriceDisplay(`₦${Number(e.target.value) >= 1000 ? `${(Number(e.target.value)/1000).toFixed(2)}B` : `${Number(e.target.value).toLocaleString()}M`}`);
                        }
                      }}
                      placeholder="e.g. 120"
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Display Price String
                    </label>
                    <input
                      type="text"
                      value={newPriceDisplay}
                      onChange={(e) => setNewPriceDisplay(e.target.value)}
                      placeholder="e.g. ₦120M"
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>
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
