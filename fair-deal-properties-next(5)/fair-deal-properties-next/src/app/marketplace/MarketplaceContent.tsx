'use client';
import Link from 'next/link';
import LegacyWidgets from '@/components/LegacyWidgets';

export default function MarketplaceContent() {
  return (
    <>
      <LegacyWidgets init={'marketplace'} />


{/* ── PAGE HERO ── */}
<section style={{background:'var(--forest)',padding:'7rem 0 0',position:'relative',overflow:'hidden'}}>
  <div style={{position:'absolute',inset:'0',backgroundImage:'url(\'data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fillRule=\'evenodd\'%3E%3Cg fill=\'%23c9a84c\' fillOpacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',pointerEvents:'none'}}></div>
  <div className="container" style={{position:'relative',zIndex:'1'}}>
    <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>The FDP Marketplace</div>
    <h1 style={{color:'var(--white)',fontSize:'clamp(2.8rem,6vw,5rem)',fontWeight:'300',maxWidth:'820px',marginBottom:'1.25rem',lineHeight:'1.08'}}>We list nothing we have<br/>not <em style={{color:'var(--gold-light)',fontStyle:'italic'}}>independently verified.</em></h1>
    <p style={{color:'rgba(255,255,255,.6)',fontSize:'1.05rem',maxWidth:'620px',lineHeight:'1.75',marginBottom:'3rem',fontWeight:'300'}}>Opportunities from Fair Deal Properties and from vetted developers, alongside stock already enlisted by MREIF, Family Homes Funds, the Federal Housing Authority, FMBN and licensed PMIs. Each listing states what has been verified, by whom, and on what date. Where something has not been verified, we say so.</p>

    {/* ── SMART SEARCH BAR ── */}
    <div style={{background:'var(--white)',borderRadius:'var(--radius-md)',padding:'1rem',display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center',maxWidth:'900px',boxShadow:'0 8px 48px rgba(0,0,0,.3)',marginBottom:'0'}}>
      <div style={{flex:'2',minWidth:'200px',display:'flex',alignItems:'center',gap:'10px',padding:'0 .5rem',borderRight:'1px solid var(--border-light)'}}>
        <svg style={{width:'16px',height:'16px',stroke:'var(--ink-muted)',fill:'none',strokeWidth:'2',flexShrink:'0'}} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="opp-search" placeholder="Search by location, type, price…" onInput={(event)=>{window.oppFilter()}} style={{border:'none',outline:'none',fontFamily:'var(--font-body)',fontSize:'14px',color:'var(--ink)',width:'100%',background:'transparent'}}/>
      </div>
      <select id="opp-city" onChange={(event)=>{window.oppFilter()}} style={{flex:'1',minWidth:'140px',border:'none',outline:'none',fontFamily:'var(--font-body)',fontSize:'13px',color:'var(--ink-soft)',background:'transparent',padding:'0 .5rem',borderRight:'1px solid var(--border-light)',appearance:'none',cursor:'pointer'}}>
        <option value="">All Cities</option>
        <option value="abuja">Abuja</option>
        <option value="lagos">Lagos</option>
        <option value="portharcourt">Port Harcourt</option>
        <option value="ogun">Ogun State</option>
        <option value="nationwide">Nationwide</option>
      </select>
      <select id="opp-budget" onChange={(event)=>{window.oppFilter()}} style={{flex:'1',minWidth:'160px',border:'none',outline:'none',fontFamily:'var(--font-body)',fontSize:'13px',color:'var(--ink-soft)',background:'transparent',padding:'0 .5rem',borderRight:'1px solid var(--border-light)',appearance:'none',cursor:'pointer'}}>
        <option value="">Any Budget</option>
        <option value="0-30">Under ₦30M</option>
        <option value="30-100">₦30M - ₦100M</option>
        <option value="100-300">₦100M - ₦300M</option>
        <option value="300-1000">₦300M - ₦1B</option>
        <option value="1000+">Above ₦1B</option>
      </select>
      <button onClick={(event)=>{window.oppFilter()}} style={{background:'var(--forest)',color:'var(--white)',border:'none',padding:'12px 28px',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-body)',fontSize:'13px',fontWeight:'600',cursor:'pointer',whiteSpace:'nowrap',letterSpacing:'.04em',transition:'background .2s'}} onMouseOver={(event)=>{event.currentTarget.style.background='var(--forest-light)'}} onMouseOut={(event)=>{event.currentTarget.style.background='var(--forest)'}}>Search →</button>
    </div>
  </div>

  {/* Source tabs anchored to bottom of hero */}
  <div style={{background:'rgba(0,0,0,.2)',marginTop:'3rem',borderTop:'1px solid rgba(255,255,255,.08)'}}>
    <div className="container">
      <div style={{display:'flex',gap:'0',overflowX:'auto',scrollbarWidth:'none'}} id="source-tabs">
        <button className="src-tab active" onClick={(event)=>{window.switchSource('all',event.currentTarget)}}>All Sources</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('fdp',event.currentTarget)}}>FDP Direct</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('mreif',event.currentTarget)}}>MREIF</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('fhf',event.currentTarget)}}>Family Homes Fund</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('fha',event.currentTarget)}}>FHA</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('fmbn',event.currentTarget)}}>FMBN</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('pmi',event.currentTarget)}}>PMIs</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('developer',event.currentTarget)}}>Developers</button>
        <button className="src-tab" onClick={(event)=>{window.switchSource('offmarket',event.currentTarget)}}>Off-Market ✦</button>
      </div>
    </div>
  </div>
</section>

{/* ── MAIN MARKETPLACE BODY ── */}
<section style={{background:'var(--cream)',padding:'3rem 0 6rem'}}>
  <div className="container">

    <div className="img-band h-sm"><img src="/assets/illustrations/i0.svg" alt="What we list, we have inspected. What we have not, we say so." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Verified Opportunities</div><div className="img-cap-t">What we list, we have inspected. What we have not, we say so.</div></div></div>
    <div style={{height:'2rem'}}></div>
    {/* Filter + Sort Bar */}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:'11px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--ink-muted)',marginRight:'.25rem'}}>Filter:</span>
        <button className="pill-filter active" onClick={(event)=>{window.oppTypeFilter('all',event.currentTarget)}}>All Types</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('residential',event.currentTarget)}}>Residential</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('commercial',event.currentTarget)}}>Commercial</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('land',event.currentTarget)}}>Land</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('affordable',event.currentTarget)}}>Affordable Housing</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('offplan',event.currentTarget)}}>Off-Plan</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('diaspora',event.currentTarget)}}>Diaspora Friendly</button>
        <button className="pill-filter" onClick={(event)=>{window.oppTypeFilter('mortgage',event.currentTarget)}}>Mortgage Available</button>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <span id="opp-count" style={{fontSize:'12px',color:'var(--ink-muted)',whiteSpace:'nowrap'}}>Showing all listings</span>
        <select id="opp-sort" onChange={(event)=>{window.oppSort()}} style={{fontFamily:'var(--font-body)',fontSize:'12px',color:'var(--ink-soft)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'6px 12px',background:'var(--white)',cursor:'pointer',outline:'none'}}>
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
        <div style={{display:'flex',gap:'4px'}}>
          <button id="view-grid" onClick={(event)=>{window.setView('grid',event.currentTarget)}} style={{width:'32px',height:'32px',background:'var(--forest)',border:'none',borderRadius:'var(--radius-sm)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}} title="Grid view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button id="view-list" onClick={(event)=>{window.setView('list',event.currentTarget)}} style={{width:'32px',height:'32px',background:'var(--white)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}} title="List view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>

    {/* ══════════ LISTING CARDS GRID ══════════ */}
    <div id="opp-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>

      {/* ─ FDP DIRECT LISTINGS ─ */}

      <div className="opp-card" data-source="fdp" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="false" data-price="450" data-date="2026-05-10"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="Luxury Duplex - Maitama - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge" style={{background:'var(--gold)',color:'var(--forest)',borderColor:'var(--gold)'}}>⭐ Featured</span> <span className="img-badge">FDP Verified</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">C of O</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Luxury Duplex - Maitama</div><div className="opp-media-sub">Residential · Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Maitama, Abuja FCT</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>5-bed Fully Detached · 640m²</div>
          <p className="opp-desc">Premium residential in Abuja's most sought-after diplomatic zone. Title verified - ownership chain dating 18 years. Site inspected April 2026.</p>
          <div className="opp-tags"><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag tag-gold">Available Now</span></div>
          <div className="opp-amenities"><span className="opp-am">🏊 Pool</span><span className="opp-am">🔒 Estate Security</span><span className="opp-am">⚡ Backup Power</span></div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Asking Price</div><div className="opp-price">₦450M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Luxury Duplex - Maitama')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Luxury Duplex - Maitama','₦450M','FDP Verified')}}>Enquire</button>
          </div>
        </div>
      </div>

      <div className="opp-card" data-source="fdp" data-type="commercial" data-city="lagos" data-diaspora="false" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="1200" data-date="2026-05-08"><div className="opp-media"><img src="/assets/illustrations/i3.svg" alt="Grade-A Office Space - Victoria Island - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">FDP Verified</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">Gov't Consent</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Grade-A Office Space - Victoria Island</div><div className="opp-media-sub">Commercial · Lagos</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Victoria Island, Lagos</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>Open-plan commercial · 1,200m²</div>
          <p className="opp-desc">Prime Grade-A commercial floor space in Lagos's premier business district. Institutional tenant pipeline secured. Delivery Q3 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">High Yield</span></div>
          <div className="opp-amenities"><span className="opp-am">🏢 Smart Building</span><span className="opp-am">🅿️ Parking</span><span className="opp-am">🔌 24hr Power</span></div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Asking Price</div><div className="opp-price">₦1.2B</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Grade-A Office Space - VI')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Grade-A Office Space - VI','₦1.2B','FDP Verified')}}>Enquire</button>
          </div>
        </div>
      </div>

      <div className="opp-card" data-source="fdp" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="false" data-price="280" data-date="2026-05-05"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Development Land - Guzape Hill - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">FDP Verified</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">R of O</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Development Land - Guzape Hill</div><div className="opp-media-sub">Land · Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Guzape, Abuja FCT</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>2,000m² · Elevated panoramic plot</div>
          <p className="opp-desc">Rare development plot in Abuja's most prestigious hilltop location. Approved for luxury residential development. Panoramic FCT views.</p>
          <div className="opp-tags"><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Institutional Grade</span></div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Asking Price</div><div className="opp-price">₦280M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Development Land - Guzape Hill')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Development Land - Guzape Hill','₦280M','FDP Verified')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ MREIF LISTINGS ─ */}
      <div className="opp-card" data-source="mreif" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="true" data-affordable="false" data-offplan="true" data-price="85" data-date="2026-05-01"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="MREIF Affordable Estate - Kuje - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">MREIF</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">C of O</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">MREIF Affordable Estate - Kuje</div><div className="opp-media-sub">Residential · Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Kuje, Abuja FCT</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>3-bed terrace · 120m²</div>
          <p className="opp-desc">Mortgage Real Estate Investment Fund development. Federal government-backed project with subsidised mortgage access from ₦20M equity. Naira-denominated structured repayment available.</p>
          <div className="opp-tags"><span className="opp-tag tag-green">Mortgage Available</span><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Eligible</span></div>
          <div className="opp-amenities"><span className="opp-am">🏫 School Nearby</span><span className="opp-am">🏥 Health Centre</span><span className="opp-am">🛣️ Road Access</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Facilitated via FDP · MREIF Partnership. Advisory fee applies.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">From</div><div className="opp-price">₦85M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'MREIF Affordable Estate - Kuje')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('MREIF Affordable Estate - Kuje','₦85M','MREIF via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ FAMILY HOMES FUND ─ */}
      <div className="opp-card" data-source="fhf" data-type="residential" data-city="ogun" data-diaspora="false" data-mortgage="true" data-affordable="true" data-offplan="true" data-price="15" data-date="2026-04-28"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="Family Homes Affordable Housing - Sagamu - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Family Homes Fund</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">Gov't</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Family Homes Affordable Housing - Sagamu</div><div className="opp-media-sub">Residential · Ogun State</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Sagamu, Ogun State</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>2-bed & 3-bed units · 78m² - 110m²</div>
          <p className="opp-desc">Federal Government's flagship affordable housing programme. Rent-to-own and NHF mortgage options. Monthly repayments from ₦35,000. Targeting low-to-middle income earners. FDP assists with eligibility and application.</p>
          <div className="opp-tags"><span className="opp-tag tag-green">Mortgage / Rent-to-Own</span><span className="opp-tag tag-green">Affordable</span><span className="opp-tag tag-gold">Off-Plan</span></div>
          <div className="opp-amenities"><span className="opp-am">🏘️ Completed Phase 1</span><span className="opp-am">🌿 Green Space</span><span className="opp-am">💧 Water Supply</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>FDP provides application advisory & eligibility assessment. NHF registration required.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">From</div><div className="opp-price">₦15M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Family Homes - Sagamu')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Family Homes Affordable Housing - Sagamu','₦15M','Family Homes Fund via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ FHA ─ */}
      <div className="opp-card" data-source="fha" data-type="residential" data-city="nationwide" data-diaspora="false" data-mortgage="true" data-affordable="true" data-offplan="false" data-price="25" data-date="2026-04-20"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="FHA Estate Units - Nationwide Access - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">FHA</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">Gov't Title</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">FHA Estate Units - Nationwide Access</div><div className="opp-media-sub">Residential · Nationwide</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Multiple FHA Estates Nationwide</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>1-, 2- & 3-bedroom units available</div>
          <p className="opp-desc">Federal Housing Authority estate properties across Nigeria. Government-backed titles. FDP assists with allocation applications, document procurement, and mortgage structuring via FMBN or commercial lenders.</p>
          <div className="opp-tags"><span className="opp-tag tag-green">NHF Mortgage</span><span className="opp-tag tag-green">Affordable</span></div>
          <div className="opp-amenities"><span className="opp-am">🏛️ Gov't Title</span><span className="opp-am">🔑 Direct Allocation</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>FDP manages your FHA application, inspection, and documentation end-to-end.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">From</div><div className="opp-price">₦25M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'FHA Estate Units')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('FHA Estate Units','₦25M+','FHA via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ FMBN ─ */}
      <div className="opp-card" data-source="fmbn" data-type="residential" data-city="nationwide" data-diaspora="false" data-mortgage="true" data-affordable="true" data-offplan="false" data-price="5" data-date="2026-04-15"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="FMBN National Housing Fund - Mortgage Access - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">FMBN</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">NHF Title</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">FMBN National Housing Fund - Mortgage Access</div><div className="opp-media-sub">Mortgage Financing · Nationwide</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>All States of Nigeria</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>NHF loans from ₦5M to ₦15M at 6% p.a.</div>
          <p className="opp-desc">Federal Mortgage Bank of Nigeria's National Housing Fund. Nigeria's most affordable mortgage product at 6% per annum. FDP advises on eligibility, NHF contributions, application process, and property selection. 25-year maximum tenor available.</p>
          <div className="opp-tags"><span className="opp-tag tag-green">6% Mortgage Rate</span><span className="opp-tag tag-green">25-Year Tenor</span></div>
          <div className="opp-amenities"><span className="opp-am">💰 Subsidised Rate</span><span className="opp-am">📋 FDP Applies For You</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>FDP is your authorised advisory facilitator. We manage your NHF registration, credit assessment preparation, and loan application.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Loans From</div><div className="opp-price">₦5M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'FMBN NHF Mortgage')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('FMBN NHF Mortgage Access','₦5M-₦15M @ 6%','FMBN via FDP')}}>Check Eligibility</button>
          </div>
        </div>
      </div>

      {/* ─ PMI ─ */}
      <div className="opp-card" data-source="pmi" data-type="residential" data-city="abuja" data-diaspora="false" data-mortgage="true" data-affordable="false" data-offplan="false" data-price="45" data-date="2026-04-10"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="PMI Scheme - Lugbe Housing Estate - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">PMI Scheme</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">Verified</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">PMI Scheme - Lugbe Housing Estate</div><div className="opp-media-sub">Residential · Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Lugbe, Abuja FCT</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>3-bed semi-detached · 160m²</div>
          <p className="opp-desc">Licensed Primary Mortgage Institution scheme with structured mortgage product. Competitive commercial rates from 18-22% p.a. FDP advises on lender selection, rate comparison, and mortgage structuring for optimal terms.</p>
          <div className="opp-tags"><span className="opp-tag tag-green">Commercial Mortgage</span><span className="opp-tag">Title Verified</span></div>
          <div className="opp-amenities"><span className="opp-am">🏘️ Serviced Estate</span><span className="opp-am">🔒 Gated</span><span className="opp-am">💡 Solar Backup</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>FDP compares PMI rates on your behalf and negotiates optimal terms. Independent advice - not commission-biased.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">From</div><div className="opp-price">₦45M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'PMI Scheme - Lugbe')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('PMI Scheme - Lugbe Housing Estate','₦45M','PMI via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ DEVELOPER ─ */}
      <div className="opp-card" data-source="developer" data-type="residential" data-city="lagos" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="120" data-date="2026-04-05"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="Lekki Waterfront Residences - Phase 2 - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">FDP Partner Dev.</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">C of O</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Lekki Waterfront Residences - Phase 2</div><div className="opp-media-sub">Residential · Lagos</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Lekki Phase 2, Lagos</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>2-4 bed luxury apartments · 145m²-280m²</div>
          <p className="opp-desc">FDP-vetted developer project. Developer has been subject to our full partnership due diligence - financial capacity, title verification, construction quality assessment, and milestone accountability framework.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span></div>
          <div className="opp-amenities"><span className="opp-am">🌊 Waterfront</span><span className="opp-am">🏊 Rooftop Pool</span><span className="opp-am">🅿️ Underground Parking</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Developer has passed FDP's full partnership vetting. FDP monitors construction milestones on your behalf.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">From</div><div className="opp-price">₦120M</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Lekki Waterfront Residences')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Lekki Waterfront Residences - Phase 2','₦120M','FDP Partner Developer')}}>Enquire</button>
          </div>
        </div>
      </div>

      {/* ─ OFF-MARKET ─ */}
      <div className="opp-card" data-source="offmarket" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="false" data-price="750" data-date="2026-05-12"><div className="opp-media"><img src="/assets/illustrations/i2.svg" alt="Embassy District Mansion - Confidential - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge" style={{background:'var(--gold)',color:'var(--forest)',borderColor:'var(--gold)'}}>Exclusive</span> <span className="img-badge">Off-Market ✦</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge">C of O</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Embassy District Mansion - Confidential</div><div className="opp-media-sub">Ultra-Premium Residential · Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Diplomatic Zone, Abuja FCT</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>6-bed mansion + 2 DSQs · 1,400m²</div>
          <p className="opp-desc">Ultra-premium off-market property in Abuja's most exclusive residential location. Full property details shared only with verified, qualified buyers. NDAs required. Serious enquiries only.</p>
          <div className="opp-tags"><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag" style={{background:'rgba(0,0,0,.06)',color:'var(--ink)'}}>NDA Required</span></div>
          <div className="opp-amenities"><span className="opp-am">🏰 Mansion</span><span className="opp-am">🌳 1-acre grounds</span><span className="opp-am">🏊 Private pool</span></div>
          <div className="opp-partner-note" style={{background:'rgba(201,168,76,.06)',borderColor:'rgba(201,168,76,.2)'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><span style={{color:'#8a6818'}}>Qualified buyers only. Identity verification and proof of funds required prior to full disclosure.</span></div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Guide Price</div><div className="opp-price">₦750M+</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Embassy District Mansion')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" style={{background:'var(--gold)',color:'var(--forest)'}} onClick={(event)=>{window.openEnquiry('Embassy District Mansion - Confidential','₦750M+','Off-Market Exclusive')}}>Request Access</button>
          </div>
        </div>
      </div>

    </div>{/* end opp-grid */}


      {/* ══════════════════════════════════════════════════ */}
      {/* MSHEL HOMES · HUTU EXCLUSIVE - PARTNER LISTINGS   */}
      {/* ══════════════════════════════════════════════════ */}

      {/* Section Header Banner */}
      <div className="mshel-section-header" style={{marginTop:'3rem'}}>
        <div style={{position:'relative',zIndex:'1',display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'1.5rem'}}>
          <div>
            <div style={{fontSize:'10px',letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(201,168,76,.7)',marginBottom:'.5rem'}}>FDP Partner Developer · Mshel Homes Ltd</div>
            <h2 style={{fontFamily:'\'Palatino Linotype\',Palatino,Georgia,serif',fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:'300',color:'white',lineHeight:'1.1',marginBottom:'.75rem'}}>Hutu Exclusive Golf Resort Estate<br/><em style={{fontStyle:'italic',color:'#e8cc7a'}}>Airport Road, Before Centenary City, Abuja</em></h2>
            <p style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem',lineHeight:'1.75',maxWidth:'600px'}}>FCDA-approved estate offering apartments and estate lands across multiple unit types and price points. Flexible payment plans from 4-18 months. <strong style={{color:'#e8cc7a'}}>⚡ All prices subject to 25% review effective 7th June 2026.</strong> FDP provides independent advisory on all units - not developer sales.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem',flexShrink:'0'}}>
            <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-md)',padding:'1rem 1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'10px',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(201,168,76,.6)',marginBottom:'.25rem'}}>Price Review Deadline</div>
              <div style={{fontFamily:'\'Palatino Linotype\',Georgia,serif',fontSize:'1.6rem',color:'white',fontWeight:'400'}}>7th June 2026</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginTop:'.2rem'}}>25% increase effective</div>
            </div>
            <div style={{background:'rgba(201,168,76,.12)',border:'1px solid rgba(201,168,76,.25)',borderRadius:'var(--radius-md)',padding:'.75rem 1rem',textAlign:'center'}}>
              <div style={{fontSize:'11px',color:'#e8cc7a',fontWeight:'600',letterSpacing:'.06em'}}>FCDA Approved · Gated Golf Estate</div>
            </div>
            <a href="#" onClick={(event)=>{window.openEnquiry('Hutu Exclusive - General Enquiry','Multiple Units Available','Mshel Homes via FDP')}} className="btn btn-gold" style={{textAlign:'center',fontSize:'12px'}}>Enquire About All Units →</a>
          </div>
        </div>
      </div>

      {/* Mshel listings grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}} id="mshel-grid">

      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="80" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Hutu Exclusive - 2-Bedroom Apartment - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive - 2-Bedroom Apartment</div><div className="opp-media-sub">Residential · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>2-bedroom apartment</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months</div>
          <p className="opp-desc">Premium 2-bedroom apartment within the Hutu Exclusive Golf Resort Estate by Mshel Homes. FCDA-approved. Located on Airport Road before Centenary City, Abuja. Flexible 12-18 month payment plan. Current pricing is time-limited - a 25% price review takes effect from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🔒 Gated</span><span className="opp-am">⚡ Backup Power</span><span className="opp-am">🌿 Landscaped</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (12-to mo. plan)</div><div className="opp-price">₦80,025,484</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive - 2-Bedroom Apartment')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive - 2-Bedroom Apartment','₦80,025,484','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="102" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Hutu Exclusive - 3-Bedroom Apartment - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive - 3-Bedroom Apartment</div><div className="opp-media-sub">Residential · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>3-bedroom apartment</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months</div>
          <p className="opp-desc">Spacious 3-bedroom apartment in Mshel Hutu Exclusive Golf Resort Estate. FCDA-approved. Flexible 12-18 month payment plan. Prices increase by 25% effective 7th June 2026 - this is a time-sensitive opportunity at current pricing.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🔒 Gated</span><span className="opp-am">⚡ Backup Power</span><span className="opp-am">🌿 Landscaped</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (12-to mo. plan)</div><div className="opp-price">₦102,199,875</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive - 3-Bedroom Apartment')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive - 3-Bedroom Apartment','₦102,199,875','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="54" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>500SQM · 5-Bed Fully Detached Duplex</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">500SQM estate land within Hutu Exclusive Golf Resort Estate, approved for a 5-bedroom fully detached duplex. FCDA-approved. Outstanding build-to-own capital position in one of Abuja's fastest-appreciating corridors. 4-8 month payment plan. 25% price review effective 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏗️ Build-to-Own</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦54,432,000</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 500SQM · 5-Bed Fully Detached Duplex','₦54,432,000','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="true" data-offplan="true" data-price="16" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>150SQM · 3-Bed Terrace Duplex</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">Entry-level estate land in Hutu Exclusive Golf Resort Estate for a 3-bedroom terrace duplex. FCDA-approved. The most accessible price point to own a premium Abuja Golf Estate address. 4-8 month payment plan. Subject to 25% price review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏘️ Terrace</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦16,329,600</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 150SQM · 3-Bed Terrace Duplex','₦16,329,600','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="27" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>250SQM · 4-Bed Semi-Detached Duplex</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">250SQM estate land in Hutu Exclusive for a 4-bedroom semi-detached duplex. FCDA-approved. Intelligently priced mid-range position in one of Abuja's most prestigious emerging addresses. 4-8 month payment plan. 25% price review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏗️ Semi-Detached</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦27,216,000</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 250SQM · 4-Bed Semi-Detached Duplex','₦27,216,000','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="38" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>350SQM · 4-Bed Fully Detached Duplex</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">350SQM estate land in Hutu Exclusive Golf Resort Estate for a 4-bedroom fully detached duplex. FCDA-approved. Strong mid-premium land position. 4-8 month payment plan. Act before the 25% price review effective 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏗️ Fully Detached</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦38,102,400</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 350SQM · 4-Bed Fully Detached Duplex','₦38,102,400','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="44" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>450SQM · 1-Bed Block of Apartments</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">450SQM estate land in Hutu Exclusive for a 1-bedroom block of apartments. FCDA-approved. Ideal for rental income investors building a portfolio within a premium Golf Estate address. 4-8 month payment plan. 25% price review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏢 Rental Income Plot</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦43,740,000</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 450SQM · 1-Bed Block of Apartments','₦43,740,000','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="109" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · FDP Partner</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments</div><div className="opp-media-sub">Land · Abuja · Airport Road</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>1000SQM · 3-Bed Block of Apartments</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 8 months</div>
          <p className="opp-desc">1,000SQM premium estate land in Hutu Exclusive for a 3-bedroom block of apartments development. FCDA-approved. Institutional-grade land holding in one of Abuja's most prestigious emerging golf resort addresses. 4-8 month payment plan. Subject to 25% price review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020',border:'none'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort Estate</span><span className="opp-am">🏢 Institutional Land</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd has passed FDP partner vetting. FDP provides independent advisory - not developer sales. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">Price (4-to mo. plan)</div><div className="opp-price">₦108,864,000</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Land - 1000SQM · 3-Bed Block of Apartments','₦108,864,000','Mshel Homes via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      </div>{/* end mshel-grid */}


      {/* ══════════════════════════════════════════════════════════ */}
      {/* MSHEL HOMES · HUTU EXCLUSIVE PHASE III - PARTNER LISTINGS  */}
      {/* ══════════════════════════════════════════════════════════ */}

      <div className="mshel-section-header" style={{marginTop:'3rem',background:'linear-gradient(135deg,#0a1820 0%,#0f2535 60%,#0a1820 100%)'}}>
        <div style={{position:'relative',zIndex:'1',display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'1.5rem'}}>
          <div>
            <div style={{fontSize:'10px',letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(201,168,76,.7)',marginBottom:'.5rem'}}>FDP Partner Developer · Mshel Homes Ltd · NEW PHASE</div>
            <h2 style={{fontFamily:'\'Palatino Linotype\',Palatino,Georgia,serif',fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:'300',color:'white',lineHeight:'1.1',marginBottom:'.75rem'}}>Hutu Exclusive <em style={{fontStyle:'italic',color:'#e8cc7a'}}>Phase III</em><br/><span style={{fontSize:'1.1rem',color:'rgba(255,255,255,.6)',fontWeight:'300'}}>Airport Road, Before Centenary City, Abuja</span></h2>
            <p style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem',lineHeight:'1.75',maxWidth:'620px'}}>Phase III launches the full product range - individual apartments, whole blocks of 6 units for institutional investors, and estate lands from 150SQM to 1,000SQM. Flexible 4-18 month payment plans across all categories. <strong style={{color:'#e8cc7a'}}>⚡ All Phase III prices subject to 25% review effective 7th June 2026.</strong></p>
            <div style={{marginTop:'1.25rem',display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-sm)',padding:'.6rem 1rem',fontSize:'12px',color:'rgba(255,255,255,.7)'}}>🏌️ Golf Resort Estate</div>
              <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-sm)',padding:'.6rem 1rem',fontSize:'12px',color:'rgba(255,255,255,.7)'}}>✅ FCDA Approved</div>
              <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-sm)',padding:'.6rem 1rem',fontSize:'12px',color:'rgba(255,255,255,.7)'}}>🏠 12 Unit Types</div>
              <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-sm)',padding:'.6rem 1rem',fontSize:'12px',color:'rgba(255,255,255,.7)'}}>💰 From ₦7.48M</div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem',flexShrink:'0'}}>
            <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-md)',padding:'1rem 1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'10px',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(201,168,76,.6)',marginBottom:'.25rem'}}>Price Review Deadline</div>
              <div style={{fontFamily:'\'Palatino Linotype\',Georgia,serif',fontSize:'1.6rem',color:'white',fontWeight:'400'}}>7th June 2026</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,.4)',marginTop:'.2rem'}}>25% increase after this date</div>
            </div>
            <a href="#" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Phase III - General Enquiry','Multiple Units Available','Mshel Homes Phase III via FDP')}} className="btn btn-gold" style={{textAlign:'center',fontSize:'12px'}}>Enquire About All Phase III Units →</a>
          </div>
        </div>
      </div>

      {/* Phase III listings sub-tabs */}
      <div style={{display:'flex',gap:'.5rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <button className="pill-filter active" onClick={(event)=>{window.filterP3('all',event.currentTarget)}}>All Phase III</button>
        <button className="pill-filter" onClick={(event)=>{window.filterP3('apartment',event.currentTarget)}}>Apartments</button>
        <button className="pill-filter" onClick={(event)=>{window.filterP3('block',event.currentTarget)}}>Whole Blocks</button>
        <button className="pill-filter" onClick={(event)=>{window.filterP3('land',event.currentTarget)}}>Estate Lands</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}} id="p3-grid">

      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="50" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Hutu Exclusive Phase III - 1-Bed Apartment - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Phase III - 1-Bed Apartment</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>1-Bedroom Apartment</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Premium 1-bedroom apartment in Mshel Hutu Exclusive Phase III Golf Resort Estate. Airport Road, Abuja. Flexible 12-18 month payment plan. Subject to 25% price review effective 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">⚡ Backup Power</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Landscaped</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦49,988,480</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Phase III - 1-Bed Apartment')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Phase III - 1-Bed Apartment','₦49,988,480','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="77" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Hutu Exclusive Phase III - 2-Bed Apartment - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Phase III - 2-Bed Apartment</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>2-Bedroom Apartment</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Contemporary 2-bedroom apartment in Mshel Hutu Exclusive Phase III. Airport Road, Abuja. Flexible 12-18 month payment plan. 25% price review effective 7th June 2026 - current pricing is time-limited.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">⚡ Backup Power</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Landscaped</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦76,538,817</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Phase III - 2-Bed Apartment')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Phase III - 2-Bed Apartment','₦76,538,817','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="98" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Hutu Exclusive Phase III - 3-Bed Apartment - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Hutu Exclusive Phase III - 3-Bed Apartment</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>3-Bedroom Apartment</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Spacious 3-bedroom apartment in Mshel Hutu Exclusive Phase III Golf Resort Estate. Airport Road, Abuja. 12-18 month payment plan. Act before the 25% price review on 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">⚡ Backup Power</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Landscaped</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦97,551,073</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Hutu Exclusive Phase III - 3-Bed Apartment')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Hutu Exclusive Phase III - 3-Bed Apartment','₦97,551,073','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="336" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Phase III - 1-Bed Block of Apartments (6 Units) - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III - 1-Bed Block of Apartments (6 Units)</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>1-Bedroom Block of Apartments - 6 Units</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Whole block of 6 × 1-bedroom apartments in Mshel Hutu Exclusive Phase III. Institutional-grade rental income investment in a premium Golf Resort Estate. 12-18 month plan. 25% price review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">📊 6-Unit Block</span><span className="opp-am">💰 Rental Yield</span><span className="opp-am">🔒 Gated</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦335,922,609</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III - 1-Bed Block of Apartments (6 Units)')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III - 1-Bed Block of Apartments (6 Units)','₦335,922,609','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="512" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Phase III - 2-Bed Block of Apartments (6 Units) - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III - 2-Bed Block of Apartments (6 Units)</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>2-Bedroom Block of Apartments - 6 Units</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Whole block of 6 × 2-bedroom apartments in Mshel Hutu Exclusive Phase III. Premium rental income portfolio in a Golf Resort Estate, Airport Road, Abuja. 12-18 month plan. 25% price review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">📊 6-Unit Block</span><span className="opp-am">💰 High Yield</span><span className="opp-am">🔒 Gated</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦512,324,851</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III - 2-Bed Block of Apartments (6 Units)')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III - 2-Bed Block of Apartments (6 Units)','₦512,324,851','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="residential" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="656" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i5.svg" alt="Phase III - 3-Bed Block of Apartments (6 Units) - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III - 3-Bed Block of Apartments (6 Units)</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>3-Bedroom Block of Apartments - 6 Units</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>12 to 18 months payment plan available</div>
          <p className="opp-desc">Flagship whole block of 6 × 3-bedroom apartments in Mshel Hutu Exclusive Phase III. Institutional capital in a premium Golf Resort Estate. The highest-yield block product in the development. 12-18 months. 25% price review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">📊 6-Unit Block</span><span className="opp-am">💰 Institutional</span><span className="opp-am">🔒 Gated</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">12 to 18 months plan available</div><div className="opp-price">₦655,543,211</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III - 3-Bed Block of Apartments (6 Units)')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III - 3-Bed Block of Apartments (6 Units)','₦655,543,211','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="true" data-offplan="true" data-price="7" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>AZURE · 150SQM · Three Bedroom Terrace Duplex - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">AZURE - 150SQM estate land in Hutu Exclusive Phase III for a 3-bedroom terrace duplex. The most accessible entry point to own a premium Golf Resort Estate address in Abuja. 4-18 month plan. 25% review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className='opp-tag tag-green'>Affordable Entry</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏘️ Terrace</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦7,481,250</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - Azure 150SQM · 3-Bed Terrace Duplex','₦7,481,250','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="true" data-offplan="true" data-price="12" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>STARRY · 250SQM · 3-Bedroom Semi-Detached Pent House - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">STARRY - 250SQM estate land in Hutu Exclusive Phase III for a 3-bedroom semi-detached pent house. A rare pent house product in a Golf Estate setting. 4-18 month plan. 25% price review from 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className='opp-tag tag-green'>Affordable Entry</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏠 Pent House</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦12,468,750</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - Starry 250SQM · 3-Bed Semi-Det. Pent House','₦12,468,750','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="15" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>350SQM · Four Bedroom Fully Detached Duplex - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">350SQM estate land in Hutu Exclusive Phase III for a 4-bedroom fully detached duplex. FCDA-approved Golf Resort Estate on Abuja's Airport Road corridor. Strong capital appreciation outlook. 4-18 months. 25% review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏗️ Fully Detached</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦14,960,938</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - 350SQM · 4-Bed Fully Detached Duplex','₦14,960,938','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="25" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>500SQM · Five Bedroom Fully Detached Duplex - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">500SQM estate land in Hutu Exclusive Phase III for a 5-bedroom fully detached duplex. FCDA-approved. Commanding mid-premium land position within one of Abuja's most prestigious Golf Resort developments. 4-18 months. 25% review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏗️ Fully Detached</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦24,937,500</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - 500SQM · 5-Bed Fully Detached Duplex','₦24,937,500','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="37" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - 750SQM · 2-Bed Block of Apartments - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - 750SQM · 2-Bed Block of Apartments</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>750SQM · Two Bedroom Block of Apartments - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">750SQM estate land in Hutu Exclusive Phase III for a 2-bedroom block of apartments development. Strong rental income plot within the Golf Resort Estate. Airport Road, Abuja. 4-18 month plan. 25% price review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏢 Rental Block</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦37,400,000</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - 750SQM · 2-Bed Block of Apartments')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - 750SQM · 2-Bed Block of Apartments','₦37,400,000','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      <div className="opp-card" data-source="developer" data-type="land" data-city="abuja" data-diaspora="true" data-mortgage="false" data-affordable="false" data-offplan="true" data-price="50" data-date="2026-05-15"><div className="opp-media"><img src="/assets/illustrations/i4.svg" alt="Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex - indicative illustration" loading="lazy"/><div className="opp-media-top"><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}><span className="img-badge">Mshel Homes · Phase III</span></div><div style={{display:'flex',gap:'.35rem',flexWrap:'wrap',justifyContent:'flex-end'}}><span className="img-badge" style={{background:'rgba(201,168,76,.92)',color:'#0a1208',borderColor:'var(--gold)'}}>PRICE RISES 7 JUN</span><span className="img-badge">FCDA Approved</span></div></div><div className="opp-media-bot"><div className="opp-media-ttl">Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex</div><div className="opp-media-sub">Phase III · Airport Road, Abuja</div></div></div><div className="opp-card-body">
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Airport Road, Before Centenary City, Abuja</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>1000SQM · Seven Bedroom Fully Detached Duplex - Estate Land</div>
          <div className="opp-meta-row"><svg className="opp-icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>4 to 18 months payment plan available</div>
          <p className="opp-desc">1,000SQM flagship estate land in Hutu Exclusive Phase III for a 7-bedroom fully detached duplex. Institutional-grade holding in a premier Golf Resort Estate. The ultimate premium address on Abuja Airport Road. 4-18 months. 25% review 7th June 2026.</p>
          <div className="opp-tags"><span className="opp-tag tag-gold">Off-Plan</span><span className="opp-tag">Diaspora Friendly</span><span className="opp-tag">Dev. Vetted</span><span className="opp-tag" style={{background:'rgba(200,30,30,.08)',color:'#8b2020'}}>⚡ Price Review 7 Jun</span></div>
          <div className="opp-amenities"><span className="opp-am">🏌️ Golf Resort</span><span className="opp-am">🏰 Flagship Plot</span><span className="opp-am">🔒 Gated</span><span className="opp-am">🌿 Serviced</span></div>
          <div className="opp-partner-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>Mshel Homes Ltd - FDP vetted partner. FDP provides independent advisory. Advisory fee applies to facilitated engagements.</div>
        </div>
        <div className="opp-card-footer">
          <div><div className="opp-price-label">4 to 18 months plan available</div><div className="opp-price">₦49,867,188</div></div>
          <div style={{display:'flex',gap:'.5rem'}}>
            <button className="opp-save-btn" onClick={(event)=>{window.saveProperty(event.currentTarget,'Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex')}} title="Save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button className="opp-enquire-btn" onClick={(event)=>{window.openEnquiry('Phase III Estate Land - 1000SQM · 7-Bed Fully Detached Duplex','₦49,867,188','Mshel Homes Phase III via FDP')}}>Enquire</button>
          </div>
        </div>
      </div>
      </div>

      {/* Phase III footer note */}
      <div style={{marginTop:'2rem',padding:'1.25rem 1.75rem',background:'rgba(10,24,32,.04)',border:'1px solid rgba(10,24,32,.1)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'flex-start',gap:'12px'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.82rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>Phase III Disclosure:</strong> All Hutu Exclusive Phase III listings are presented by Fair Deal Properties as an authorised advisory partner of Mshel Homes Ltd. Prices are as of May 2026 and subject to a confirmed 25% developer price review effective 7th June 2026. Block-of-apartment prices represent whole-block acquisition (6 units). Estate land prices are for bare land - construction costs are separate. FDP provides independent advisory and is not the developer's sales agent. FDP earns a facilitation advisory fee on successful engagements. All listings are subject to FCDA approval conditions. Independent legal due diligence is recommended prior to any commitment.</p>
      </div>

      {/* Mshel Footer note */}
      <div style={{marginTop:'2rem',padding:'1.25rem 1.75rem',background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'flex-start',gap:'12px'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.82rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>Important Disclosure:</strong> These listings are presented by Fair Deal Properties as an authorised advisory partner of Mshel Homes Ltd. All prices quoted are as of May 2026 and are subject to a 25% developer price review effective 7th June 2026. FDP earns a facilitation advisory fee on successful engagements. FDP's role is independent advisory - we do not act as the developer's sales agent. All units are subject to FCDA approval conditions. Interested parties are advised to conduct independent legal due diligence on documentation before committing capital. FDP will assist with this process as part of our standard engagement.</p>
      </div>

        
      <div style={{marginTop:'2.5rem',padding:'1.1rem 1.5rem',background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',gap:'11px',alignItems:'flex-start'}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.79rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>About the imagery on this page.</strong> The illustrations shown are original, indicative representations of property type and are not photographs of the specific properties listed. They are used where verified site photography is not yet published. Dated, geotagged photography captured by our field officers during inspection is held on file for every verified listing and is released to clients on engagement, together with the inspection record. We do not publish photographs we have not taken ourselves, and we do not use stock imagery of properties we have not inspected.</p>
      </div>

    {/* No Results */}
    <div id="opp-no-results" style={{display:'none',textAlign:'center',padding:'5rem 2rem'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔍</div>
      <h3 style={{marginBottom:'.75rem'}}>No listings match your current filters</h3>
      <p className="body-sm" style={{marginBottom:'1.5rem'}}>Try adjusting your filters or search terms - or enquire about our off-market portfolio.</p>
      <button onClick={(event)=>{window.resetOppFilters()}} className="btn btn-outline">Clear All Filters</button>
    </div>

    {/* ── PARTNER SOURCES STRIP ── */}
    <div style={{marginTop:'4rem',padding:'3rem',background:'var(--white)',borderRadius:'var(--radius-xl)',border:'1px solid var(--border-light)'}}>
      <div className="eyebrow" style={{justifyContent:'center',marginBottom:'1rem'}}>Our Verified Partners &amp; Collaborators</div>
      <p style={{textAlign:'center',color:'var(--ink-soft)',fontSize:'.88rem',maxWidth:'640px',margin:'0 auto 2.5rem',lineHeight:'1.7'}}>Every organisation on our platform has been assessed against Fair Deal Properties' partnership standard. We maintain working relationships - not blank endorsements.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'1.5rem',alignItems:'center'}}>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('mreif',document.querySelector('[onclick*=mreif]'))}}>
          <div className="partner-logo-box" style={{background:'linear-gradient(135deg,#1e3a5f,#2a4f80)'}}>MREIF</div>
          <div className="partner-label">Mortgage REIF</div>
        </div>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('fhf',document.querySelector('[onclick*=fhf]'))}}>
          <div className="partner-logo-box" style={{background:'linear-gradient(135deg,#2a5c2a,#3a7a3a)'}}>FHF</div>
          <div className="partner-label">Family Homes Fund</div>
        </div>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('fha',document.querySelector('[onclick*=fha]'))}}>
          <div className="partner-logo-box" style={{background:'linear-gradient(135deg,#4a2060,#6a3080)'}}>FHA</div>
          <div className="partner-label">Fed. Housing Auth.</div>
        </div>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('fmbn',document.querySelector('[onclick*=fmbn]'))}}>
          <div className="partner-logo-box" style={{background:'linear-gradient(135deg,#5c3300,#7a4500)'}}>FMBN</div>
          <div className="partner-label">Fed. Mortgage Bank</div>
        </div>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('pmi',document.querySelector('[onclick*=pmi]'))}}>
          <div className="partner-logo-box" style={{background:'linear-gradient(135deg,#1e3d4a,#2a5560)'}}>PMIs</div>
          <div className="partner-label">Mortgage Institutions</div>
        </div>
        <div className="partner-badge" onClick={(event)=>{window.switchSource('developer',document.querySelector('[onclick*=developer]'))}}>
          <div className="partner-logo-box" style={{background:'var(--forest)'}}>DEV</div>
          <div className="partner-label">Vetted Developers</div>
        </div>
      </div>
      <p style={{textAlign:'center',fontSize:'11px',color:'var(--ink-muted)',marginTop:'2rem',letterSpacing:'.08em'}}>All partnerships are disclosed. Advisory fees apply to facilitated engagements. FDP does not receive undisclosed commissions from any partner. Our advice is always independent.</p>
    </div>

    {/* ── PROPERTY ALERT SIGNUP ── */}
    <div style={{marginTop:'2.5rem',background:'var(--forest)',borderRadius:'var(--radius-xl)',padding:'3rem',display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:'3rem',alignItems:'center'}}>
      <div>
        <div className="eyebrow" style={{color:'rgba(201,168,76,.7)'}}>Never Miss An Opportunity</div>
        <h3 style={{color:'var(--white)',fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:'300',marginBottom:'.75rem'}}>Set a <em style={{fontStyle:'italic',color:'var(--gold-light)'}}>Property Alert</em></h3>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.9rem',lineHeight:'1.75'}}>Tell us your criteria. We'll notify you the moment a verified opportunity matches - before it goes public.</p>
      </div>
      <div>
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}} id="alert-form">
          <input type="email" id="alert-email" placeholder="Your email address" style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'1px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.08)',color:'var(--white)',outline:'none',width:'100%'}} onFocus={(event)=>{event.currentTarget.style.borderColor='rgba(201,168,76,.5)'}} onBlur={(event)=>{event.currentTarget.style.borderColor='rgba(255,255,255,.15)'}} onInput={(event)=>{event.currentTarget.style.color='white'}}/>
          <select id="alert-type" style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'1px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.7)',outline:'none',width:'100%',appearance:'none',cursor:'pointer'}}>
            <option value="">Property type preference</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Land</option>
            <option>Affordable Housing</option>
            <option>All Types</option>
          </select>
          <select id="alert-budget" style={{fontFamily:'var(--font-body)',fontSize:'13px',padding:'12px 16px',borderRadius:'var(--radius-sm)',border:'1px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.7)',outline:'none',width:'100%',appearance:'none',cursor:'pointer'}}>
            <option value="">Budget range</option>
            <option>Under ₦30M</option>
            <option>₦30M - ₦100M</option>
            <option>₦100M - ₦300M</option>
            <option>Above ₦300M</option>
          </select>
          <button onClick={(event)=>{window.submitAlert()}} style={{background:'var(--gold)',color:'var(--forest)',fontFamily:'var(--font-body)',fontSize:'13px',fontWeight:'700',padding:'13px',borderRadius:'var(--radius-sm)',border:'none',cursor:'pointer',letterSpacing:'.06em',transition:'background .2s'}} onMouseOver={(event)=>{event.currentTarget.style.background='#e8d080'}} onMouseOut={(event)=>{event.currentTarget.style.background='var(--gold)'}}>ACTIVATE MY PROPERTY ALERT →</button>
        </div>
        <div id="alert-success" style={{display:'none',background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.3)',borderRadius:'var(--radius-md)',padding:'1.25rem',color:'var(--gold-light)',fontSize:'.9rem',textAlign:'center',lineHeight:'1.7'}}>✓ Alert activated. You'll be among the first to know about matching opportunities.</div>
      </div>
    </div>

    {/* ── OFF-MARKET ACCESS CTA ── */}
    <div style={{marginTop:'2.5rem',background:'var(--cream-mid)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap'}}>
      <div>
        <div className="eyebrow">Off-Market Portfolio</div>
        <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',marginBottom:'.5rem'}}>Not all our best deals are visible here.</h3>
        <p className="body-sm" style={{maxWidth:'520px'}}>Our highest-value opportunities are shared exclusively with verified, registered advisory clients. Book a consultation and we'll match you to off-market listings that fit your mandate - before they reach anyone else.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'.75rem',flexShrink:'0'}}>
        <Link href="/contact" className="btn btn-primary">Request Private Access →</Link>
        <Link href="/how-it-works" className="btn btn-outline" style={{textAlign:'center'}}>How It Works</Link>
      </div>
    </div>

  </div>{/* end container */}
</section>{/* end marketplace body */}

{/* ── ENQUIRY MODAL ── */}
<div id="opp-modal" style={{display:'none',position:'fixed',inset:'0',zIndex:'1000',background:'rgba(0,0,0,.6)',backdropFilter:'blur(6px)',WebkitBackdropFilter:'blur(6px)',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
  <div style={{background:'var(--white)',borderRadius:'var(--radius-xl)',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,.35)',position:'relative'}}>
    <div style={{background:'var(--forest)',padding:'2rem 2rem 1.5rem',borderRadius:'var(--radius-xl) var(--radius-xl) 0 0'}}>
      <button onClick={(event)=>{window.closeEnquiry()}} style={{position:'absolute',top:'1.25rem',right:'1.25rem',background:'rgba(255,255,255,.12)',border:'none',color:'white',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
      <div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,168,76,.7)',marginBottom:'.5rem'}}>Property Enquiry</div>
      <div id="modal-title" style={{fontFamily:'var(--font-display)',fontSize:'1.35rem',color:'white',fontWeight:'400',lineHeight:'1.25',marginBottom:'.25rem'}}>Property Name</div>
      <div style={{display:'flex',gap:'1rem',alignItems:'center',flexWrap:'wrap'}}>
        <span id="modal-price" style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--gold-light)'}}>₦ -</span>
        <span id="modal-source" style={{fontSize:'11px',background:'rgba(201,168,76,.2)',color:'var(--gold-light)',padding:'3px 10px',borderRadius:'50px',letterSpacing:'.08em'}}></span>
      </div>
    </div>
    <form onSubmit={(event)=>{window.submitEnquiry(event)}} style={{padding:'2rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <div><label className="form-label">First Name *</label><input type="text" required={true} placeholder="Adebayo" className="form-input" style={{width:'100%'}}/></div>
        <div><label className="form-label">Last Name *</label><input type="text" required={true} placeholder="Okonkwo" className="form-input" style={{width:'100%'}}/></div>
      </div>
      <div><label className="form-label">Email Address *</label><input type="email" required={true} placeholder="you@example.com" className="form-input" style={{width:'100%'}}/></div>
      <div><label className="form-label">Phone / WhatsApp *</label><input type="tel" required={true} placeholder="+234 or international" className="form-input" style={{width:'100%'}}/></div>
      <div><label className="form-label">I am a...</label>
        <select className="form-select" style={{width:'100%'}}>
          <option>Local buyer (Nigeria-based)</option>
          <option>Diaspora buyer (UK / Europe)</option>
          <option>Diaspora buyer (USA / Canada)</option>
          <option>Investor / Corporate buyer</option>
          <option>Developer / Joint Venture partner</option>
        </select>
      </div>
      <div><label className="form-label">Financing Requirement</label>
        <select className="form-select" style={{width:'100%'}}>
          <option>Full cash purchase</option>
          <option>NHF Mortgage (FMBN)</option>
          <option>PMI Commercial Mortgage</option>
          <option>Bridge Financing</option>
          <option>Not yet decided - need advisory</option>
        </select>
      </div>
      <div><label className="form-label">Message / Specific Requirements</label>
        <textarea className="form-textarea" placeholder="Tell us your timeline, specific needs, or any questions about this property…" style={{minHeight:'90px',width:'100%'}}></textarea>
      </div>
      <div style={{background:'var(--cream)',borderRadius:'var(--radius-sm)',padding:'1rem',fontSize:'11px',color:'var(--ink-muted)',lineHeight:'1.7'}}>By submitting this enquiry you confirm you have read our <Link href="/privacy-notice" style={{color:'var(--forest)'}}>Privacy Notice</Link> and consent to Fair Deal Properties contacting you in relation to this property. Your data will not be shared with third parties without your consent.</div>
      <button type="submit" className="form-submit" style={{width:'100%',justifyContent:'center',fontSize:'14px',padding:'16px'}}>Send Enquiry - We'll Respond Within 4 Hours →</button>
    </form>
    <div id="modal-success" style={{display:'none',padding:'3rem 2rem',textAlign:'center'}}>
      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✓</div>
      <h3 style={{fontFamily:'var(--font-display)',marginBottom:'.75rem'}}>Enquiry Received</h3>
      <p className="body-sm" style={{marginBottom:'1.5rem',maxWidth:'360px',marginLeft:'auto',marginRight:'auto'}}>A named Fair Deal Properties advisor will contact you within 4 business hours. Thank you for your interest.</p>
      <button onClick={(event)=>{window.closeEnquiry()}} className="btn btn-primary">Close</button>
    </div>
  </div>
</div>

{/* ── SAVED PROPERTIES TRAY ── */}
<div id="saved-tray" style={{display:'none',position:'fixed',bottom:'1.5rem',right:'1.5rem',zIndex:'500',background:'var(--forest)',color:'white',borderRadius:'var(--radius-lg)',padding:'1rem 1.5rem',boxShadow:'var(--shadow-lg)',alignItems:'center',gap:'.75rem',fontSize:'13px',cursor:'pointer',maxWidth:'280px'}} onClick={(event)=>{window.showSavedProperties()}}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold-light)" stroke="var(--gold-light)" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  <span><span id="saved-count">0</span> saved propert<span id="saved-plural">y</span></span>
  <span style={{color:'var(--gold-light)',fontWeight:'600',fontSize:'11px',letterSpacing:'.08em'}}>VIEW →</span>
</div>
    </>
  );
}
