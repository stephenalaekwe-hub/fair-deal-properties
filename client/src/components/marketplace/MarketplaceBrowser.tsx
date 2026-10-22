'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  listings as ALL, filterListings, SOURCE_LABELS,
  type Listing, type ListingSource, type ListingSort,
} from '@/data/listings';
import ListingCard from './ListingCard';
import EnquiryModal from './EnquiryModal';
import AlertForm from './AlertForm';

type Pill = 'all' | 'residential' | 'commercial' | 'land'
  | 'affordable' | 'offplan' | 'diaspora' | 'mortgage';

const SOURCE_TABS: { id: ListingSource | 'all'; label: string }[] = [
  { id: 'all', label: 'All Sources' },
  { id: 'fdp', label: 'FDP Direct' },
  { id: 'mreif', label: 'MREIF' },
  { id: 'fhf', label: 'Family Homes Fund' },
  { id: 'fha', label: 'FHA' },
  { id: 'fmbn', label: 'FMBN' },
  { id: 'pmi', label: 'PMIs' },
  { id: 'developer', label: 'Developers' },
  { id: 'offmarket', label: 'Off-Market ✦' },
];

const PILLS: { id: Pill; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'land', label: 'Land' },
  { id: 'affordable', label: 'Affordable Housing' },
  { id: 'offplan', label: 'Off-Plan' },
  { id: 'diaspora', label: 'Diaspora Friendly' },
  { id: 'mortgage', label: 'Mortgage Available' },
];

const BUDGETS: { id: string; label: string; max?: number; min?: number }[] = [
  { id: '', label: 'Any Budget' },
  { id: '0-30', label: 'Under ₦30M', max: 30 },
  { id: '30-100', label: '₦30M - ₦100M', min: 30, max: 100 },
  { id: '100-300', label: '₦100M - ₦300M', min: 100, max: 300 },
  { id: '300-1000', label: '₦300M - ₦1B', min: 300, max: 1000 },
  { id: '1000+', label: 'Above ₦1B', min: 1000 },
];

const CITIES = [
  { id: '', label: 'All Cities' },
  { id: 'abuja', label: 'Abuja' },
  { id: 'lagos', label: 'Lagos' },
  { id: 'ogun', label: 'Ogun State' },
  { id: 'nationwide', label: 'Nationwide' },
];

export default function MarketplaceBrowser() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [source, setSource] = useState<ListingSource | 'all'>('all');
  const [pill, setPill] = useState<Pill>('all');
  const [sort, setSort] = useState<ListingSort>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [saved, setSaved] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [enquiring, setEnquiring] = useState<Listing | null>(null);

  const results = useMemo(() => {
    const band = BUDGETS.find((b) => b.id === budget);
    let out = filterListings({
      search: search || undefined,
      city: (city || undefined) as never,
      source: source === 'all' ? undefined : source,
      propertyType: ['residential', 'commercial', 'land'].includes(pill)
        ? (pill as never) : undefined,
      affordable: pill === 'affordable' || undefined,
      offPlan: pill === 'offplan' || undefined,
      diasporaFriendly: pill === 'diaspora' || undefined,
      mortgageEligible: pill === 'mortgage' || undefined,
    }, sort);

    if (band?.min != null) {
      out = out.filter((l) => l.priceMillionsNGN != null && l.priceMillionsNGN >= band.min!);
    }
    if (band?.max != null) {
      out = out.filter((l) => l.priceMillionsNGN != null && l.priceMillionsNGN <= band.max!);
    }
    if (showSavedOnly) out = out.filter((l) => saved.includes(l.slug));
    return out;
  }, [search, city, budget, source, pill, sort, showSavedOnly, saved]);

  function toggleSave(listing: Listing) {
    setSaved((s) =>
      s.includes(listing.slug) ? s.filter((x) => x !== listing.slug) : [...s, listing.slug]);
  }

  function reset() {
    setSearch(''); setCity(''); setBudget('');
    setSource('all'); setPill('all'); setSort('featured'); setShowSavedOnly(false);
  }

  return (
    <>
      <section style={{ background: 'var(--forest)', padding: '7rem 0 0',
                        position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ color: 'rgba(201,168,76,.8)' }}>The FDP Marketplace</div>
          <h1 style={{ color: 'var(--white)', fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 300,
                       maxWidth: '820px', marginBottom: '1.25rem', lineHeight: 1.08 }}>
            We list nothing we have<br />not{' '}
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>
              independently verified.
            </em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.05rem', maxWidth: '620px',
                      lineHeight: 1.75, marginBottom: '3rem', fontWeight: 300 }}>
            Opportunities from Fair Deal Properties and from vetted developers, alongside stock
            already enlisted by MREIF, Family Homes Funds, the Federal Housing Authority, FMBN and
            licensed PMIs. Each listing states what has been verified, by whom, and on what date.
            Where something has not been verified, we say so.
          </p>

      {/* ── search bar ── */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '1rem',
        display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center',
        maxWidth: '900px', boxShadow: '0 8px 48px rgba(0,0,0,.3)',
      }}>
        <div style={{ flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center',
                      gap: '10px', padding: '0 .5rem', borderRight: '1px solid var(--border-light)' }}>
          <svg style={{ width: '16px', height: '16px', stroke: 'var(--ink-muted)', fill: 'none',
                        strokeWidth: 2, flexShrink: 0 }} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location, type, price…"
            aria-label="Search listings"
            style={{ border: 'none', outline: 'none', fontFamily: 'var(--font-body)',
                     fontSize: '14px', color: 'var(--ink)', width: '100%', background: 'transparent' }}
          />
        </div>

        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City"
                style={selectStyle}>
          {CITIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Budget"
                style={{ ...selectStyle, borderRight: 'none' }}>
          {BUDGETS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
        </select>

        {/* Filtering is live as the visitor types, so this button scrolls to the results
            rather than submitting. It is retained because the search bar reads as
            incomplete without it. */}
        <button
          type="button"
          onClick={() => document.getElementById('opp-results')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: 'var(--forest)', color: 'var(--white)', border: 'none',
                   padding: '12px 28px', borderRadius: 'var(--radius-sm)',
                   fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
                   cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '.04em' }}
        >
          Search →
        </button>
      </div>
        </div>

      {/* ── source tabs ── */}
      <div style={{ background: 'rgba(0,0,0,.2)', marginTop: '3rem',
                    borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}
               id="source-tabs" role="tablist" aria-label="Listing source">
            {SOURCE_TABS.map((t) => (
              <button
                key={t.id}
                className={source === t.id ? 'src-tab active' : 'src-tab'}
                onClick={() => setSource(t.id)}
                role="tab"
                aria-selected={source === t.id}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      </section>

      <section style={{ background: 'var(--cream)', padding: '3rem 0 6rem' }}>
        <div className="container">
          {/* ── illustrated banner ── */}
          <div className="img-band h-sm">
            <Image
              src="/assets/illustrations/i0.svg"
              alt="What we list, we have inspected. What we have not, we say so."
              width={1600}
              height={420}
              sizes="100vw"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="img-cap">
              <div className="img-cap-l">Verified Opportunities</div>
              <div className="img-cap-t">
                What we list, we have inspected. What we have not, we say so.
              </div>
            </div>
          </div>
          <div style={{ height: '2rem' }} />

          {/* ── filter and sort bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase',
                             color: 'var(--ink-muted)', marginRight: '.25rem' }}>Filter:</span>
              {PILLS.map((p) => (
                <button key={p.id}
                        className={pill === p.id ? 'pill-filter active' : 'pill-filter'}
                        onClick={() => setPill(p.id)} type="button">
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}
                    aria-live="polite">
                Showing {results.length} listing{results.length === 1 ? '' : 's'}
              </span>

              <button className={showSavedOnly ? 'pill-filter active' : 'pill-filter'}
                      onClick={() => setShowSavedOnly((v) => !v)} type="button">
                Saved ({saved.length})
              </button>

              <select value={sort} onChange={(e) => setSort(e.target.value as ListingSort)}
                      aria-label="Sort listings"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px',
                               color: 'var(--ink-soft)', border: '1px solid var(--border)',
                               borderRadius: 'var(--radius-sm)', padding: '6px 12px',
                               background: 'var(--white)', cursor: 'pointer', outline: 'none' }}>
                <option value="featured">Sort: Featured</option>
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title">Name: A to Z</option>
              </select>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => setView('grid')} title="Grid view" aria-pressed={view === 'grid'}
                        type="button"
                        style={{ ...viewBtn, background: view === 'grid' ? 'var(--forest)' : 'var(--white)',
                                 border: view === 'grid' ? 'none' : '1px solid var(--border)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke={view === 'grid' ? 'white' : 'var(--ink-soft)'} strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button onClick={() => setView('list')} title="List view" aria-pressed={view === 'list'}
                        type="button"
                        style={{ ...viewBtn, background: view === 'list' ? 'var(--forest)' : 'var(--white)',
                                 border: view === 'list' ? 'none' : '1px solid var(--border)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke={view === 'list' ? 'white' : 'var(--ink-soft)'} strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── results ── */}
          {results.length > 0 ? (
            <div id="opp-results" style={view === 'grid'
              ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }
              : { display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {results.map((l) => (
                <ListingCard
                  key={l.slug}
                  listing={l}
                  view={view}
                  saved={saved.includes(l.slug)}
                  onToggleSave={toggleSave}
                  onEnquire={setEnquiring}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ marginBottom: '.75rem' }}>No listings match your current filters</h3>
              <p className="body-sm" style={{ marginBottom: '1.5rem' }}>
                Try adjusting your filters or search terms - or enquire about our off-market portfolio.
              </p>
              <button onClick={reset} className="btn btn-outline" type="button">Clear All Filters</button>
            </div>
          )}

          <Disclosures />
          <SourceBreakdown />
          <AlertForm />
        </div>
      </section>

      <EnquiryModal listing={enquiring} onClose={() => setEnquiring(null)} />
    </>
  );
}

const selectStyle: React.CSSProperties = {
  flex: 1, minWidth: '140px', border: 'none', outline: 'none',
  fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)',
  background: 'transparent', padding: '0 .5rem',
  borderRight: '1px solid var(--border-light)', appearance: 'none', cursor: 'pointer',
};

const viewBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const noteBox: React.CSSProperties = {
  marginTop: '2rem', padding: '1.25rem 1.75rem', background: 'var(--cream-mid)',
  border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)',
  display: 'flex', alignItems: 'flex-start', gap: '12px',
};

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)"
         strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function Disclosures() {
  return (
    <>
      <div style={{ ...noteBox, background: 'rgba(10,24,32,.04)', border: '1px solid rgba(10,24,32,.1)' }}>
        <InfoIcon />
        <p style={{ fontSize: '.82rem', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>Phase III Disclosure:</strong> All Hutu
          Exclusive Phase III listings are presented by Fair Deal Properties as an authorised advisory
          partner of Mshel Homes Ltd. Prices are as of May 2026 and subject to a confirmed 25%
          developer price review effective 7 June 2026. Block-of-apartment prices represent whole-block
          acquisition (6 units). Estate land prices are for bare land - construction costs are separate.
          FDP provides independent advisory and is not the developer&rsquo;s sales agent. FDP earns a
          facilitation advisory fee on successful engagements. All listings are subject to FCDA approval
          conditions. Independent legal due diligence is recommended prior to any commitment.
        </p>
      </div>

      <div style={noteBox}>
        <InfoIcon />
        <p style={{ fontSize: '.82rem', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>Important Disclosure:</strong> These listings
          are presented by Fair Deal Properties as an authorised advisory partner of Mshel Homes Ltd.
          All prices quoted are as of May 2026 and are subject to a 25% developer price review
          effective 7 June 2026. FDP earns a facilitation advisory fee on successful engagements.
          FDP&rsquo;s role is independent advisory - we do not act as the developer&rsquo;s sales agent.
          All units are subject to FCDA approval conditions. Interested parties are advised to conduct
          independent legal due diligence on documentation before committing capital. FDP will assist
          with this process as part of our standard engagement.
        </p>
      </div>

      <div style={{ ...noteBox, marginTop: '2.5rem', padding: '1.1rem 1.5rem' }}>
        <InfoIcon />
        <p style={{ fontSize: '.79rem', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>About the imagery on this page.</strong> The
          illustrations shown are original, indicative representations of property type and are not
          photographs of the specific properties listed. They are used where verified site photography
          is not yet published. Dated, geotagged photography captured by our field officers during
          inspection is held on file for every verified listing and is released to clients on
          engagement, together with the inspection record. We do not publish photographs we have not
          taken ourselves, and we do not use stock imagery of properties we have not inspected.
        </p>
      </div>
    </>
  );
}

function SourceBreakdown() {
  const counts = ALL.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: 'var(--white)',
                  borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
      <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
        Where these listings come from
      </div>
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '.88rem',
                  maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
        Every organisation on this platform has been assessed against Fair Deal Properties&rsquo;
        partnership standard. The count beside each source is the number of opportunities currently
        published from it.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem' }}>
        {(Object.keys(SOURCE_LABELS) as (keyof typeof SOURCE_LABELS)[]).map((k) => (
          <div key={k} style={{ padding: '1rem 1.25rem', background: 'var(--cream-mid)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
              {counts[k] ?? 0}
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              {SOURCE_LABELS[k]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
