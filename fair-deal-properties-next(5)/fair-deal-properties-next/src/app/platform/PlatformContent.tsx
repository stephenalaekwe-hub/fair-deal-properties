import Link from 'next/link';

export default function PlatformContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>The Fair Deal Platform</div>
      <h1>Eleven capabilities.<br/><em>One integrated platform.</em></h1>
      <p className="lead">Technology is not our product. It is our strategic enabler - the instrument through which we reduce transaction risk, compress timelines and give every client visibility they cannot get anywhere else in this market.</p>
    </div>
  </section>

  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div style={{background:'var(--cream)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'1.5rem 2rem',marginBottom:'3.5rem',display:'flex',gap:'2.5rem',flexWrap:'wrap',alignItems:'center'}}>
        <div style={{fontSize:'11px',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--ink-muted)'}}>Module Status Key</div>
        <div style={{display:'flex',gap:'1.25rem',flexWrap:'wrap'}}>
          <span className="status st-live">Live</span>
          <span className="status st-beta">In Beta</span>
          <span className="status st-soon">Roadmap</span>
        </div>
        <p style={{fontSize:'12px',color:'var(--ink-muted)',marginLeft:'auto',maxWidth:'340px',lineHeight:'1.6'}}>We publish honest module status. We would rather tell you what is not yet built than have you discover it mid-transaction.</p>
      </div>

      {/* FEE SCHEDULE */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">How We Are Paid</div>
        <h2 style={{fontSize:'1.9rem',marginBottom:'.75rem'}}>Published fees. No undisclosed commissions.</h2>
        <div className="gold-divider"></div>
        <p className="lead" style={{marginBottom:'2rem'}}>Opacity about fees is one of this market's biggest problems. Ours are published, agreed in writing before any engagement begins, and separated by the one distinction that matters: fees that depend on a transaction closing, and fees that do not.</p>

        <h4 style={{marginBottom:'.75rem',fontSize:'1rem',color:'var(--forest)'}}>A. Transaction and agency fees</h4>
        <p className="body-sm" style={{marginBottom:'1rem'}}>Contingent on a completed transaction.</p>
        <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:'2.5rem'}}>
          <div style={{background:'var(--forest)',padding:'.9rem 1.5rem',display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr'}}>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Revenue Stream</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Basis</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Fee</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'rgba(201,168,76,.05)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'700',color:'var(--forest)'}}>Agency &amp; Transaction Facilitation Commission</div>
            <div className="body-sm">Payable on every successful purchase or sale completed through our marketing and transaction facilitation, charged on the completed consideration. The applicable rate is fixed by mandate tier in the Commission Agreement before marketing begins. Where we act for both sides, this is disclosed in writing to both parties beforehand.
              <div style={{marginTop:'.7rem',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',overflow:'hidden'}}>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',background:'rgba(13,43,30,.06)',padding:'.45rem .7rem'}}><div style={{fontSize:'9.5px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--forest)',fontWeight:'700'}}>Mandate Tier</div><div style={{fontSize:'9.5px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--forest)',fontWeight:'700',textAlign:'right'}}>Rate</div></div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',padding:'.45rem .7rem',borderTop:'1px solid var(--border-light)'}}><div style={{fontSize:'11.5px',color:'var(--ink-soft)'}}>Standard sale or purchase transaction</div><div style={{fontSize:'11.5px',color:'var(--forest)',fontWeight:'700',textAlign:'right'}}>5%</div></div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',padding:'.45rem .7rem',borderTop:'1px solid var(--border-light)'}}><div style={{fontSize:'11.5px',color:'var(--ink-soft)'}}>Enhanced or complex transaction facilitation</div><div style={{fontSize:'11.5px',color:'var(--forest)',fontWeight:'700',textAlign:'right'}}>6% - 7.5%</div></div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',padding:'.45rem .7rem',borderTop:'1px solid var(--border-light)'}}><div style={{fontSize:'11.5px',color:'var(--ink-soft)'}}>Premium, exclusive or exceptional mandate</div><div style={{fontSize:'11.5px',color:'var(--forest)',fontWeight:'700',textAlign:'right'}}>Up to 7.5%</div></div>
                <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',padding:'.45rem .7rem',borderTop:'1px solid var(--border-light)',background:'var(--cream)'}}><div style={{fontSize:'11.5px',color:'var(--ink-soft)'}}>Very high value or institutional transaction</div><div style={{fontSize:'11.5px',color:'var(--forest)',fontWeight:'700',textAlign:'right'}}>Bespoke</div></div>
              </div>
              <div style={{fontSize:'10.5px',color:'var(--ink-muted)',marginTop:'.5rem',fontStyle:'italic'}}>Institutional and very high value mandates are negotiated on their own terms and may be agreed below the standard rate.</div>
            </div>
            <div style={{fontSize:'.92rem',fontWeight:'700',color:'var(--forest)'}}>5% - 7.5%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of consideration</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Lettings &amp; Leasing Commission</div>
            <div className="body-sm">On executed tenancy or lease, charged on the first-year rent. Renewal commission charged separately where we manage the renewal.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>5% - 10%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of annual rent</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Real Estate Investment Transaction Facilitation</div>
            <div className="body-sm">Where FDP facilitates an investment transaction that is not a straightforward agency sale - portfolio acquisitions, structured disposals, institutional transfers.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>1% - 3%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of transaction value</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Joint Venture Introduction</div>
            <div className="body-sm">Introduction of a counterparty to a joint venture, where FDP&rsquo;s role ends at introduction. Subject to a stated minimum.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>1% - 2%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of economic value</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Joint Venture Structuring &amp; Facilitation</div>
            <div className="body-sm">Commercial structuring of the venture, negotiation support and facilitation through to execution. Legal drafting is instructed to a legal practitioner and billed through.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>2% - 5%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of economic value</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Co-Brokerage Share</div>
            <div className="body-sm">Where FDP collaborates with another agency on a transaction. Share of FDP&rsquo;s earned commission, agreed in writing before the collaboration begins.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>20% - 50%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of FDP commission</div></div>
          </div>
        </div>

        <h4 style={{marginBottom:'.75rem',fontSize:'1rem',color:'var(--forest)'}}>B. Assurance and advisory fees</h4>
        <p className="body-sm" style={{marginBottom:'1rem'}}><strong style={{color:'var(--forest)'}}>Not contingent on a transaction closing.</strong> Payable on delivery, including where our conclusion is that you should not proceed. That independence is the product.</p>
        <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:'2.5rem'}}>
          <div style={{background:'var(--forest)',padding:'.9rem 1.5rem',display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr'}}>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Revenue Stream</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Basis</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Fee</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Institutional Pre-Verification Check</div>
            <div className="body-sm">Confirmation of whether a property sits on a named institutional list, with the residual risks that confirmation does not cover.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦40,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Physical Site Inspection</div>
            <div className="body-sm">Standalone inspection with full checklist and geotagged evidence capture. Credited against an assurance report commissioned within 60 days.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦85,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Title Position Check</div>
            <div className="body-sm">Registry search, encumbrance check and written position, prepared with an instructed legal practitioner.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦120,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Transaction Assurance Report</div>
            <div className="body-sm">Independent assurance over the full Transaction Fact Set: title position, inspection evidence, developer delivery record, price position, payment integrity, tax treatment and funding route.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦500,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Diaspora Complete Engagement</div>
            <div className="body-sm">Assurance report plus document custody, escrow coordination and transaction management through to title transfer.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦900,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Transaction Advisory Retainer</div>
            <div className="body-sm">Standing advisory on a portfolio or a programme of transactions. Retainer plus an agreed success element, which is never applied to assurance work.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>On engagement</div>
          </div>
        </div>

        <h4 style={{marginBottom:'.75rem',fontSize:'1rem',color:'var(--forest)'}}>C. Financing, management and recurring fees</h4>
        <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:'1.5rem'}}>
          <div style={{background:'var(--forest)',padding:'.9rem 1.5rem',display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr'}}>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Revenue Stream</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Basis</div>
            <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Fee</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Mortgage Facilitation (retail)</div>
            <div className="body-sm">File preparation, lender comparison across MREIF, NHF, PMI and commercial routes, submission and follow-through to offer. Charged as a flat fee, deliberately not as a percentage of the loan, so that our recommendation is never influenced by the size of the facility. We do not lend and we never hold client funds.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦250,000 - ₦900,000</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Corporate &amp; Development Finance Facilitation</div>
            <div className="body-sm">Capital raising for developers and corporate borrowers, where the client is institutional and a success-based structure is appropriate and understood.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>0.5% - 2.5%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of funding closed</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Diaspora Assurance Retainer</div>
            <div className="body-sm">Quarterly inspection with dated video, condition and market report, and document custody confirmation.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>₦200,000<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>per quarter</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Property &amp; Facility Management</div>
            <div className="body-sm">Rent collection, service charge administration, maintenance coordination, vendor management and owner reporting.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>5% - 10%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of gross collections</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Rent &amp; Arrears Recovery</div>
            <div className="body-sm">Commercial recovery of outstanding rent and service charge. Charged on amounts actually recovered. Where recovery requires legal process, a legal practitioner is instructed and billed separately.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>10% - 15%<div style={{fontSize:'10px',fontWeight:'400',color:'var(--ink-muted)',marginTop:'3px'}}>of amount recovered</div></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 2.7fr 1fr',padding:'1.1rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}>
            <div style={{fontSize:'.86rem',fontWeight:'600',color:'var(--forest)'}}>Developer &amp; Institutional Advisory</div>
            <div className="body-sm">Institutional readiness assessment, enlistment preparation, and buyer onboarding partnership for enlisted developments.</div>
            <div style={{fontSize:'.92rem',fontWeight:'600',color:'var(--ink)'}}>On engagement</div>
          </div>
        </div>

        <div style={{padding:'1.1rem 1.5rem',background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',gap:'11px',alignItems:'flex-start'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <p style={{fontSize:'.79rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>Fee disclosure and basis.</strong> These are Fair Deal Properties' commercial rates. They are not a representation that any percentage is prescribed by law. The applicable rate within each band is fixed in writing at engagement by reference to asset class, mandate type, transaction complexity and value. Only one primary fee basis applies to any single transaction; where more than one service is rendered, the fee structure is set out in a single schedule so that nothing is charged twice. Fair Deal Properties Ltd receives no undisclosed commission from any developer, vendor, lender or third party. Where a fee is receivable from more than one party to the same transaction, that arrangement is disclosed to all parties in writing before the engagement proceeds and is recorded in our conflict of interest register. Assurance and verification fees in section B are payable whether or not a transaction proceeds and are never contingent on completion.</p>
        </div>
      </div>

      <div className="img-band h-md"><img src="/assets/illustrations/i0.svg" alt="Technology as strategic enabler, not as product." loading="lazy"/><div className="img-cap"><div className="img-cap-l">The Fair Deal Platform</div><div className="img-cap-t">Technology as strategic enabler, not as product.</div></div></div>
      <div style={{height:'2.5rem'}}></div>
      {/* MODULE 1 */}
      <div className="mod-group">
        <div className="mod-group-n">Module One</div>
        <h2 style={{color:'var(--white)',fontSize:'2rem',fontWeight:'300',marginBottom:'.6rem'}}>Discovery &amp; Matching</h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.92rem',maxWidth:'640px',lineHeight:'1.7'}}>Finding the right property in Nigeria is broken by fake listings, stale data and agents optimising for their commission rather than your fit. These modules fix the discovery layer.</p>
      </div>
      <div className="grid-3" style={{marginBottom:'4rem'}}>
        <div className="mod-card"><div className="mod-num">01</div><span className="status st-live">Live</span><h3 className="h4" style={{maxWidth:'80%'}}>Digital Property Listings &amp; Virtual Inspections</h3><p className="body-sm">Every listing carries physically-inspected evidence: dated site photography, 360-degree virtual walkthroughs and a document completeness score. If we have not stood on the land, it is not on our platform.</p></div>
        <div className="mod-card"><div className="mod-num">02</div><span className="status st-beta">In Beta</span><h3 className="h4" style={{maxWidth:'80%'}}>AI-Powered Search &amp; Buyer-Property Matching</h3><p className="body-sm">Our matching engine scores opportunities against your stated mandate - budget, location, title preference, financing route, timeline and investment objective - rather than serving whatever we are paid most to move.</p></div>
        <div className="mod-card"><div className="mod-num">03</div><span className="status st-live">Live</span><h3 className="h4" style={{maxWidth:'80%'}}>Digital Marketplace</h3><p className="body-sm">A single marketplace connecting buyers, sellers, property owners, landlords, tenants, developers, investors and mortgage institutions - with verified counterparties on both sides of every listing.</p></div>
      </div>

      {/* MODULE 2 */}
      <div className="mod-group" style={{background:'linear-gradient(135deg,#0d2b1e 0%,#1e4d38 100%)'}}>
        <div className="mod-group-n">Module Two</div>
        <h2 style={{color:'var(--white)',fontSize:'2rem',fontWeight:'300',marginBottom:'.6rem'}}>Trust &amp; Transaction</h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.92rem',maxWidth:'640px',lineHeight:'1.7'}}>This is the module that defines us. Nigeria does not have a property discovery problem - it has a verification problem. Everything here exists to close that gap.</p>
      </div>
      <div className="grid-3" style={{marginBottom:'4rem'}}>
        <div className="mod-card"><div className="mod-num">04</div><span className="status st-live">Live</span><h3 className="h4" style={{maxWidth:'80%'}}>Property Verification &amp; Digital Due Diligence</h3><p className="body-sm">Independent title search, registry confirmation, physical inspection, encumbrance check and developer capacity assessment - delivered as a formal written report with photographic and video evidence. Commissioned separately from any purchase.</p></div>
        <div className="mod-card"><div className="mod-num">05</div><span className="status st-beta">In Beta</span><h3 className="h4" style={{maxWidth:'80%'}}>Online Booking, Offers &amp; Transaction Tracking</h3><p className="body-sm">Reserve a unit, submit an offer and follow every milestone from enquiry to title transfer on a single dashboard. You always know exactly what stage your transaction is at, and what is blocking it.</p></div>
        <div className="mod-card"><div className="mod-num">06</div><span className="status st-beta">In Beta</span><h3 className="h4" style={{maxWidth:'80%'}}>Electronic Documentation &amp; Secure Record Management</h3><p className="body-sm">Encrypted document vault with full audit trail, versioning and role-based access. Your title documents, receipts, agreements and correspondence in one permanent, retrievable place - critical for diaspora clients.</p></div>
      </div>

      {/* MODULE 3 */}
      <div className="mod-group" style={{background:'linear-gradient(135deg,#0d2240 0%,#1a3a5c 100%)'}}>
        <div className="mod-group-n">Module Three</div>
        <h2 style={{color:'var(--white)',fontSize:'2rem',fontWeight:'300',marginBottom:'.6rem'}}>Capital &amp; Financing</h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.92rem',maxWidth:'640px',lineHeight:'1.7'}}>Financing is the single largest barrier between Nigerians and property ownership. We facilitate access, structure the approach and advise independently on terms. We do not lend, and we do not hold client funds.</p>
      </div>
      <div className="grid-3" style={{marginBottom:'4rem'}}>
        <div className="mod-card"><div className="mod-num">07</div><span className="status st-live">Live</span><h3 className="h4" style={{maxWidth:'80%'}}>Mortgage Brokerage &amp; Facilitation</h3><p className="body-sm">Structured facilitation with Primary Mortgage Institutions, Development Finance Institutions, mortgage banks, specialist housing finance institutions, commercial banks and NHF through FMBN. We prepare your file, compare terms across lenders and advise on fit - independently.</p></div>
        <div className="mod-card"><div className="mod-num">08</div><span className="status st-beta">In Beta</span><h3 className="h4" style={{maxWidth:'80%'}}>Market Intelligence &amp; Investment Analytics</h3><p className="body-sm">Corridor-level price movement, delivery performance by developer, rental yield benchmarks and absorption data drawn from our own verification record - not recycled portal listings. This is decision intelligence, not valuation: we do not offer valuation services. Where a formal valuation is required, we engage a registered Estate Surveyor and Valuer on your behalf.</p></div>
        <div className="mod-card"><div className="mod-num">09</div><span className="status st-live">Live</span><h3 className="h4" style={{maxWidth:'80%'}}>CRM &amp; Automated Client Follow-Up</h3><p className="body-sm">Every enquiry is logged, assigned to a named advisor and tracked to resolution. Automated milestone updates mean no client is ever left wondering what happened to their transaction.</p></div>
      </div>

      {/* MODULE 4 */}
      <div className="mod-group" style={{background:'linear-gradient(135deg,#2d3a1a 0%,#3d5020 100%)'}}>
        <div className="mod-group-n">Module Four</div>
        <h2 style={{color:'var(--white)',fontSize:'2rem',fontWeight:'300',marginBottom:'.6rem'}}>Management &amp; Operations</h2>
        <p style={{color:'rgba(255,255,255,.6)',fontSize:'.92rem',maxWidth:'640px',lineHeight:'1.7'}}>Ownership does not end at title transfer. These modules serve estates, facility managers and landlords who need operational control after the deal closes.</p>
      </div>
      <div className="grid-3" style={{marginBottom:'3rem'}}>
        <div className="mod-card"><div className="mod-num">10</div><span className="status st-soon">Roadmap Q1 2027</span><h3 className="h4" style={{maxWidth:'80%'}}>Facility &amp; Property Management Platform</h3><p className="body-sm">Service charge administration and collection, maintenance ticketing, vendor management, resident communication and financial reporting for estates and multi-unit landlords.</p></div>
        <div className="mod-card"><div className="mod-num">11</div><span className="status st-soon">Roadmap Q2 2027</span><h3 className="h4" style={{maxWidth:'80%'}}>Smart-Building &amp; Estate Management Solutions</h3><p className="body-sm">Access control integration, visitor management, utility and metering oversight, and estate-wide operational dashboards for developers and estate management committees.</p></div>
        <div className="mod-card" style={{background:'var(--forest)',border:'none',justifyContent:'center'}}>
          <span className="status st-beta" style={{background:'rgba(201,168,76,.2)',color:'var(--gold-light)'}}>Partner Access</span>
          <h3 className="h4" style={{color:'var(--white)'}}>Build with us</h3>
          <p className="body-sm" style={{color:'rgba(255,255,255,.6)'}}>Estates, developers and facility managers who join our roadmap modules early help shape them - and receive founding-partner terms.</p>
          <Link href="/contact" className="btn btn-gold" style={{marginTop:'.5rem',width:'fit-content'}}>Request Early Access</Link>
        </div>
      </div>

      <div style={{padding:'1.25rem 1.75rem',background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',gap:'12px',alignItems:'flex-start'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.82rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>Platform disclosure:</strong> Module status is published honestly and updated as capabilities ship. Fair Deal Properties Ltd facilitates mortgage arrangements and does not lend, hold or manage client funds. Fair Deal Properties Ltd does not offer valuation services. Formal property valuation in Nigeria is reserved to registered Estate Surveyors and Valuers under ESVARBON. Where a client requires a formal valuation, we engage a registered firm on their behalf. Our market analytics are decision intelligence and do not constitute a valuation.</p>
      </div>
    </div>
  </section>

  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>See the platform<br/><em>on your own transaction.</em></h2><p>Book a platform walkthrough with a named advisor. We will show you exactly what is live, what is coming, and how it applies to what you are trying to do.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Book a Platform Walkthrough</Link><Link href="/technology" className="btn btn-ghost-white btn-lg">Technology &amp; Security</Link></div></div></div>
    </>
  );
}
