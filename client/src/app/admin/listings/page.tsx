'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import ImageUpload, { parseImageUrls } from '@/components/ImageUpload';
import { useCurrency } from '@/components/CurrencyProvider';

function inferMillions(displayStr: string): string {
  const s = (displayStr || '').trim();
  if (!s) return '';
  const bMatch = s.match(/([\d,.]+)\s*(b|bn|billion)/i);
  if (bMatch) {
    const v = parseFloat(bMatch[1].replace(/,/g, ''));
    if (!Number.isNaN(v)) return String(Math.round(v * 1000 * 100) / 100);
  }
  const mMatch = s.match(/([\d,.]+)\s*(m|mn|million)/i);
  if (mMatch) {
    const v = parseFloat(mMatch[1].replace(/,/g, ''));
    if (!Number.isNaN(v)) return String(Math.round(v * 100) / 100);
  }
  const digits = s.replace(/[^0-9.]/g, '');
  if (!digits) return '';
  const n = parseFloat(digits);
  if (Number.isNaN(n) || n <= 0) return '';
  if (n >= 100000) return String(Math.round((n / 1000000) * 100) / 100);
  return String(Math.round(n * 100) / 100);
}

function formatFullNairaFromMillions(valStr: string): string {
  const n = parseFloat(valStr);
  if (Number.isNaN(n) || n <= 0) return '';
  const full = Math.round(n * 1000000);
  return `₦${full.toLocaleString('en-NG')}`;
}

export default function AdminListingsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const isAgent = user?.role === 'AGENT';

  const [listings, setListings] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  // Inline Quick Price Edit State
  const [quickPriceKey, setQuickPriceKey] = useState<string | null>(null);
  const [quickPriceDisplay, setQuickPriceDisplay] = useState('');
  const [quickPriceMillions, setQuickPriceMillions] = useState('');
  const [quickPriceSaving, setQuickPriceSaving] = useState(false);

  // Edit Modal State
  const [editingListing, setEditingListing] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCity, setEditCity] = useState('abuja');
  const [editPropertyType, setEditPropertyType] = useState('residential');
  const [editSource, setEditSource] = useState('fdp');
  const [editSpecification, setEditSpecification] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newPriceMillions, setNewPriceMillions] = useState('');
  const [newPriceDisplay, setNewPriceDisplay] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [newImage, setNewImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
  const [createAffordable, setCreateAffordable] = useState(false);
  const [createOffPlan, setCreateOffPlan] = useState(false);
  const [createAgentId, setCreateAgentId] = useState('');
  const [createImage, setCreateImage] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusBanner({ type, text });
    setTimeout(() => {
      setStatusBanner((prev) => (prev?.text === text ? null : prev));
    }, 5000);
  };

  const loadData = async () => {
    setLoading(true);
    if (isAgent) {
      const [listingsRes, alertsRes] = await Promise.all([
        fetchApi('/listings?pageSize=200'),
        fetchApi('/admin/submissions?collection=alert'),
      ]);
      if (listingsRes.ok && listingsRes.data) setListings(listingsRes.data.listings || []);
      if (alertsRes.ok && alertsRes.data) setAlerts(alertsRes.data || []);
    } else {
      const [listingsRes, agentsRes, alertsRes] = await Promise.all([
        fetchApi('/listings?pageSize=200'),
        fetchApi('/admin/agents'),
        fetchApi('/admin/submissions?collection=alert'),
      ]);
      if (listingsRes.ok && listingsRes.data) setListings(listingsRes.data.listings || []);
      if (agentsRes.ok && agentsRes.data) setAgents(agentsRes.data || []);
      if (alertsRes.ok && alertsRes.data) setAlerts(alertsRes.data || []);
    }
    setLoading(false);
  };

  const countMatchingAlertsForListing = (listing: any): number => {
    const activeAlerts = alerts.filter((a) => !a.closedAt && a.status !== 'closed');
    return activeAlerts.filter((a) => {
      const prefType = String(a.payload?.propertyType || a.payload?.type || '').toLowerCase();
      const budgetRaw = String(a.payload?.budget || a.payload?.budgetRange || '').toLowerCase();
      const lType = String(listing.propertyType || '').toLowerCase();
      const lTitle = String(listing.title || '').toLowerCase();
      const lSpec = String(listing.specification || '').toLowerCase();
      const lPriceM = Number(listing.priceMillionsNGN || 0);

      let typeMatch = true;
      if (prefType && !prefType.includes('any')) {
        if (prefType.includes('land') && lType !== 'land') typeMatch = false;
        else if (prefType.includes('commercial') && lType !== 'commercial') typeMatch = false;
        else if ((prefType.includes('residential') || prefType.includes('duplex') || prefType.includes('terrace') || prefType.includes('apartment') || prefType.includes('villa')) && lType !== 'residential') {
          typeMatch = false;
        }
        if (typeMatch && prefType.includes('terrace') && !lTitle.includes('terrace') && !lSpec.includes('terrace')) typeMatch = false;
      }

      let budgetMatch = true;
      if (budgetRaw && lPriceM > 0) {
        if (budgetRaw.includes('under') && budgetRaw.includes('50')) budgetMatch = lPriceM <= 55;
        else if (budgetRaw.includes('50') && budgetRaw.includes('100')) budgetMatch = lPriceM >= 40 && lPriceM <= 115;
        else if (budgetRaw.includes('100') && budgetRaw.includes('250')) budgetMatch = lPriceM >= 90 && lPriceM <= 275;
        else if (budgetRaw.includes('250') || budgetRaw.includes('above')) budgetMatch = lPriceM >= 200;
      }

      return typeMatch && budgetMatch;
    }).length;
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const getListingKey = (listing: any): string => String(listing?.id || listing?.slug || '');

  const openQuickPriceEdit = (listing: any) => {
    const key = getListingKey(listing);
    setQuickPriceKey(key);
    setQuickPriceDisplay(listing.priceDisplay || '');
    setQuickPriceMillions(
      listing.priceMillionsNGN !== null && listing.priceMillionsNGN !== undefined
        ? String(listing.priceMillionsNGN)
        : ''
    );
  };

  const handleSaveQuickPrice = async (listing: any) => {
    if (isAgent) return;
    const key = getListingKey(listing);
    if (!key) return;
    setQuickPriceSaving(true);

    const millionsNum = quickPriceMillions
      ? parseFloat(quickPriceMillions)
      : parseFloat(inferMillions(quickPriceDisplay));
    const displayStr =
      quickPriceDisplay.trim() ||
      (millionsNum && !Number.isNaN(millionsNum) ? formatFullNairaFromMillions(String(millionsNum)) : '');

    const res = await fetchApi(`/admin/listings/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({
        priceMillionsNGN: !Number.isNaN(millionsNum) ? millionsNum : null,
        priceDisplay: displayStr,
      }),
    });

    setQuickPriceSaving(false);
    if (res.ok) {
      setQuickPriceKey(null);
      showToast('success', `Updated price for "${listing.title}" to ${displayStr}.`);
      await loadData();
    } else {
      showToast('error', res.error || 'Failed to update price.');
    }
  };

  const openEditModal = (listing: any) => {
    setEditingListing(listing);
    setEditTitle(listing.title || '');
    setEditSubtitle(listing.subtitle || '');
    setEditLocation(listing.location || '');
    setEditCity(listing.city || 'abuja');
    setEditPropertyType(listing.propertyType || 'residential');
    setEditSource(listing.source || 'fdp');
    setEditSpecification(listing.specification || '');
    setEditDescription(listing.description || '');
    setNewPriceMillions(
      listing.priceMillionsNGN !== null && listing.priceMillionsNGN !== undefined
        ? String(listing.priceMillionsNGN)
        : ''
    );
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

    const key = getListingKey(editingListing);
    const selectedAgentObj = agents.find((a) => String(a.id) === String(selectedAgentId));

    const res = await fetchApi(`/admin/listings/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: editTitle,
        subtitle: editSubtitle,
        location: editLocation,
        city: editCity,
        propertyType: editPropertyType,
        source: editSource,
        specification: editSpecification,
        description: editDescription,
        priceMillionsNGN: newPriceMillions ? parseFloat(newPriceMillions) : null,
        priceDisplay: newPriceDisplay,
        image: newImage || undefined,
        assignedAgentId: selectedAgentId || null,
        assignedAgentName: selectedAgentObj ? selectedAgentObj.name : null,
      }),
    });

    setSaving(false);
    if (res.ok) {
      const updatedTitle = editTitle || editingListing.title;
      setEditingListing(null);
      showToast('success', `Saved changes for "${updatedTitle}".`);
      await loadData();
    } else {
      showToast('error', res.error || 'Failed to save property details.');
    }
  };

  const handleDeleteListing = async () => {
    if (!editingListing || isAgent) return;
    if (!window.confirm(`Are you sure you want to remove "${editingListing.title}" from the active property catalog?`)) {
      return;
    }
    setDeleting(true);
    const key = getListingKey(editingListing);
    const res = await fetchApi(`/admin/listings/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
    setDeleting(false);
    if (res.ok) {
      const removedTitle = editingListing.title;
      setEditingListing(null);
      showToast('success', `Removed "${removedTitle}" from the catalog.`);
      await loadData();
    } else {
      showToast('error', res.error || 'Failed to remove property.');
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    const finalPriceDisplay =
      createPriceDisplay.trim() ||
      (createPriceMillions ? formatFullNairaFromMillions(createPriceMillions) : '');

    if (!createTitle.trim() || !createLocation.trim() || !finalPriceDisplay) {
      setCreateError('Please complete all required fields (Property Title, Specific Location, and Price).');
      return;
    }
    setCreating(true);

    const selectedAgentObj = agents.find((a) => String(a.id) === String(createAgentId));

    const res = await fetchApi('/admin/listings', {
      method: 'POST',
      body: JSON.stringify({
        title: createTitle.trim(),
        subtitle: createSubtitle.trim(),
        source: createSource,
        propertyType: createPropertyType,
        city: createCity,
        location: createLocation.trim(),
        priceMillionsNGN: createPriceMillions ? parseFloat(createPriceMillions) : null,
        priceDisplay: finalPriceDisplay,
        specification: createSpecification.trim(),
        description: createDescription.trim(),
        diasporaFriendly: createDiaspora,
        mortgageEligible: createMortgage,
        affordable: createAffordable,
        offPlan: createOffPlan,
        assignedAgentId: createAgentId || null,
        assignedAgentName: selectedAgentObj ? selectedAgentObj.name : null,
        image: createImage || undefined,
      }),
    });

    if (res.ok) {
      const publishedTitle = createTitle.trim();
      setShowCreateModal(false);
      setCreateTitle('');
      setCreateSubtitle('');
      setCreateLocation('');
      setCreatePriceMillions('');
      setCreatePriceDisplay('');
      setCreateSpecification('');
      setCreateDescription('');
      setCreateAgentId('');
      setCreateImage('');
      showToast('success', `Published new property "${publishedTitle}" live to the Marketplace.`);
      await loadData();
    } else {
      setCreateError(res.error || 'Failed to publish new listing.');
    }
    setCreating(false);
  };

  const filteredListings = listings.filter((l) => {
    if (filterCategory !== 'all' && l.propertyType !== filterCategory) return false;
    if (filterSource !== 'all' && l.source !== filterSource) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay = `${l.title || ''} ${l.location || ''} ${l.specification || ''} ${l.priceDisplay || ''} ${l.city || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>
            Verified Property Register ({filteredListings.length})
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            {isAgent
              ? 'Direct developer mandates, verified property catalog, title statuses, and asking prices.'
              : 'Change the price of any single property, upload or replace property photographs, edit details, or input a new property.'}
          </p>
        </div>

        {!isAgent && (
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '11px 20px',
              background: 'var(--forest)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(13,43,29,0.18)',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
            <span>Input / Publish New Property</span>
          </button>
        )}
      </div>

      {statusBanner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            background: statusBanner.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: statusBanner.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${statusBanner.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{statusBanner.type === 'success' ? '✓ ' : '⚠️ '}{statusBanner.text}</span>
          <button
            onClick={() => setStatusBanner(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '18px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search specific property by name, location, phase, or price (e.g. Maitama, Hutu Phase III)..."
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '9px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            background: '#f8fafc',
            fontWeight: 600,
            color: '#334155',
          }}
        >
          <option value="all">All Categories</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          style={{
            padding: '9px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            background: '#f8fafc',
            fontWeight: 600,
            color: '#334155',
          }}
        >
          <option value="all">All Sources</option>
          <option value="fdp">FDP Direct</option>
          <option value="developer">Developer / Hutu Exclusive</option>
          <option value="mreif">MREIF</option>
          <option value="fhf">Family Homes Fund (FHF)</option>
          <option value="fha">Federal Housing Authority (FHA)</option>
          <option value="fmbn">FMBN / NHF</option>
          <option value="pmi">Primary Mortgage (PMI)</option>
          <option value="offmarket">Off-Market</option>
        </select>
        {(searchQuery || filterCategory !== 'all' || filterSource !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setFilterSource('all');
            }}
            style={{
              padding: '9px 12px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            Reset
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            const headers = ['ID', 'Title', 'Location', 'City', 'Category', 'Source', 'Price Display', 'Price Millions NGN', 'Specification', 'Assigned Agent'];
            const rows = filteredListings.map((l) =>
              [
                l.id || l.slug || '',
                l.title || '',
                l.location || '',
                l.city || '',
                l.propertyType || '',
                l.source || '',
                l.priceDisplay || '',
                l.priceMillionsNGN ?? '',
                l.specification || '',
                l.assignedAgentName || 'FDP Advisory Desk',
              ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
            );
            const csv = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fdp-property-register-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            padding: '9px 14px',
            background: '#f8fafc',
            color: 'var(--forest)',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ⬇ Export CSV
        </button>
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
                {filteredListings.map((l) => {
                  const rowKey = getListingKey(l);
                  const isEditingQuickPrice = quickPriceKey === rowKey;
                  const parsedPhotos = Array.isArray(l.images) && l.images.length > 0 ? l.images : parseImageUrls(l.image);
                  const primaryPhoto = parsedPhotos[0] || l.image || '';
                  const isCustomPhoto = primaryPhoto && !primaryPhoto.startsWith('/assets/illustrations/');
                  const matchingAlertsCount = countMatchingAlertsForListing(l);

                  return (
                    <tr key={rowKey} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {primaryPhoto ? (
                            <div
                              onClick={() => !isAgent && openEditModal(l)}
                              title={!isAgent ? 'Click to upload or change property photograph' : l.title}
                              style={{
                                width: '54px',
                                height: '54px',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                background: '#f1f5f9',
                                flexShrink: 0,
                                position: 'relative',
                                cursor: !isAgent ? 'pointer' : 'default',
                                border: isCustomPhoto ? '2px solid #10b981' : '1px solid #e2e8f0',
                              }}
                            >
                              <img
                                src={primaryPhoto}
                                alt={l.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              {parsedPhotos.length > 1 && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    background: 'rgba(13,43,29,0.88)',
                                    color: '#fff',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                  }}
                                >
                                  +{parsedPhotos.length - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div style={{ width: '54px', height: '54px', borderRadius: '6px', background: '#ecfdf5', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                              🏠
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>{l.title}</span>
                              {l.isCustom && (
                                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  NEW
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{l.location}</div>
                            {l.specification && (
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{l.specification}</div>
                            )}
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
                        {matchingAlertsCount > 0 && (
                          <Link
                            href="/admin/alerts"
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: '#065f46',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '4px',
                              padding: '1px 6px',
                              textDecoration: 'none',
                            }}
                          >
                            🔔 {matchingAlertsCount} {matchingAlertsCount === 1 ? 'Alert Match' : 'Alert Matches'}
                          </Link>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                        {isEditingQuickPrice ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '210px', background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={quickPriceDisplay}
                                onChange={(e) => {
                                  setQuickPriceDisplay(e.target.value);
                                  const inf = inferMillions(e.target.value);
                                  if (inf) setQuickPriceMillions(inf);
                                }}
                                placeholder="e.g. ₦85,000,000"
                                style={{ width: '130px', padding: '5px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}
                              />
                              <input
                                type="number"
                                step="0.01"
                                value={quickPriceMillions}
                                onChange={(e) => {
                                  setQuickPriceMillions(e.target.value);
                                  if (e.target.value) {
                                    setQuickPriceDisplay(formatFullNairaFromMillions(e.target.value));
                                  }
                                }}
                                placeholder="₦M"
                                title="Price in ₦ Millions"
                                style={{ width: '70px', padding: '5px 6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                disabled={quickPriceSaving}
                                onClick={() => handleSaveQuickPrice(l)}
                                style={{ padding: '4px 10px', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                {quickPriceSaving ? 'Saving...' : 'Save Price'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuickPriceKey(null)}
                                style={{ padding: '4px 8px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>{formatPrice(l.priceMillionsNGN, l.priceDisplay)}</span>
                            {!isAgent && (
                              <button
                                type="button"
                                onClick={() => openQuickPriceEdit(l)}
                                title="Quickly change the price of this specific property"
                                style={{
                                  padding: '2px 7px',
                                  background: '#f8fafc',
                                  color: 'var(--forest)',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                ✎ Price
                              </button>
                            )}
                          </div>
                        )}
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
                  );
                })}
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
              maxWidth: '660px',
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
                  Input &amp; Publish New Property
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Property will immediately appear live on the public Marketplace and Property Register.
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
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Property Title *
                </label>
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="e.g. Luxury 5-Bedroom Detached Villa - Maitama"
                  required
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subtitle / Banner Tagline
                </label>
                <input
                  type="text"
                  value={createSubtitle}
                  onChange={(e) => setCreateSubtitle(e.target.value)}
                  placeholder="e.g. Residential · Abuja · Maitama District"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Specific Location / District *
                  </label>
                  <input
                    type="text"
                    value={createLocation}
                    onChange={(e) => setCreateLocation(e.target.value)}
                    placeholder="e.g. Maitama District, Abuja FCT"
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
                    <option value="fhf">Family Homes Fund (FHF)</option>
                    <option value="fha">Federal Housing Authority (FHA)</option>
                    <option value="fmbn">FMBN / NHF Eligible</option>
                    <option value="pmi">Primary Mortgage Institution (PMI)</option>
                    <option value="offmarket">Off-Market Advisory</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Numeric Price (₦ Millions)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={createPriceMillions}
                    onChange={(e) => {
                      setCreatePriceMillions(e.target.value);
                      if (e.target.value) {
                        setCreatePriceDisplay(formatFullNairaFromMillions(e.target.value));
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
                    onChange={(e) => {
                      setCreatePriceDisplay(e.target.value);
                      const inf = inferMillions(e.target.value);
                      if (inf) setCreatePriceMillions(inf);
                    }}
                    placeholder="e.g. ₦450,000,000"
                    required
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px', fontSize: '13px' }}>
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
                    checked={createAffordable}
                    onChange={(e) => setCreateAffordable(e.target.checked)}
                  />
                  <span>Affordable Housing</span>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
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
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Assign Portfolio Agent (Optional)
                  </label>
                  <select
                    value={createAgentId}
                    onChange={(e) => setCreateAgentId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="">-- Unassigned --</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Property Description
                </label>
                <textarea
                  rows={3}
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Describe the property, title verification status, infrastructure, and investment highlights..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              {/* ── Image Upload Component ── */}
              <div style={{ marginBottom: '22px' }}>
                <ImageUpload
                  label="Property Photograph(s)"
                  helperText="Upload verified high-resolution photograph(s) (PNG, JPG, WebP) from your computer or phone. Images are compressed and stored automatically."
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
                  {isAgent ? 'Property Briefing' : 'Edit Property Price, Photo & Details'}
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
                    <span style={{ color: '#64748b' }}>Location &amp; State: </span>
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
                    {editingListing.description || editingListing.subtitle || 'Direct developer mandate verified with FCDA/State approvals intact. Available for private physical inspection tours with pre-qualified buyers.'}
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
                {/* ── Price Override Section ── */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--forest)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                    💰 Property Price Override
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Display Price String *
                      </label>
                      <input
                        type="text"
                        value={newPriceDisplay}
                        onChange={(e) => {
                          setNewPriceDisplay(e.target.value);
                          const inf = inferMillions(e.target.value);
                          if (inf) setNewPriceMillions(inf);
                        }}
                        placeholder="e.g. ₦480,000,000"
                        required
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Numerical Price (in ₦ Millions)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newPriceMillions}
                        onChange={(e) => {
                          setNewPriceMillions(e.target.value);
                          if (e.target.value) {
                            setNewPriceDisplay(formatFullNairaFromMillions(e.target.value));
                          }
                        }}
                        placeholder="e.g. 480"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Photo Upload Section ── */}
                <div style={{ marginBottom: '16px' }}>
                  <ImageUpload
                    label="Property Photograph(s)"
                    helperText="Upload verified photograph(s) (PNG, JPG, WebP) to replace or add imagery for this property on the public website."
                    value={newImage}
                    onChange={setNewImage}
                  />
                </div>

                {/* ── Property Details Section ── */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Property Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Location / District
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Specification
                    </label>
                    <input
                      type="text"
                      value={editSpecification}
                      onChange={(e) => setEditSpecification(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      Category
                    </label>
                    <select
                      value={editPropertyType}
                      onChange={(e) => setEditPropertyType(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      City
                    </label>
                    <select
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    >
                      <option value="abuja">Abuja FCT</option>
                      <option value="lagos">Lagos State</option>
                      <option value="ogun">Ogun State</option>
                      <option value="nationwide">Nationwide</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      Source
                    </label>
                    <select
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                    >
                      <option value="fdp">FDP Direct</option>
                      <option value="developer">Developer</option>
                      <option value="mreif">MREIF</option>
                      <option value="fhf">FHF</option>
                      <option value="fha">FHA</option>
                      <option value="fmbn">FMBN</option>
                      <option value="pmi">PMI</option>
                      <option value="offmarket">Off-Market</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Property Description
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteListing}
                    style={{
                      padding: '9px 14px',
                      background: '#fef2f2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {deleting ? 'Removing...' : '🗑 Remove Property'}
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
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
                      {saving ? 'Saving...' : 'Save Property Changes'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
