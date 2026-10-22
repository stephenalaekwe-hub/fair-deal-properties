import AudienceTabs from '@/components/AudienceTabs';
import Link from 'next/link';

const AUDIENCE_PANELS = [
  {
    id: 'professionals',
    label: 'Affluent Professionals',
    content: (
      <>
<div>
          <h3>Property as a considered capital decision, not a lifestyle purchase.</h3>
          <div className="gold-divider"></div>
          <p style={{color:'var(--ink-soft)',lineHeight:'1.75'}}>You have built income. Protecting it through verified, well-structured property assets requires the same discipline you applied to earning it. We provide the analysis and structure to get that right - with full financial advisory integration.</p>
          <ul className="aud-features">
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Verified, curated investment opportunities across Abuja, Lagos &amp; PH</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Independent financial advisory on deal structure and returns</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Named advisor accountable throughout your engagement</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Post-transfer portfolio monitoring and quarterly intelligence</li>
          </ul>
          <Link href="/services" className="btn btn-primary" style={{marginTop:'2rem'}}>Our Advisory Services</Link>
        </div>
        <div className="testimonial">
          <p className="testimonial-text">"Fair Deal Properties gave us the analysis we needed to make a ₦450M commitment with genuine confidence. The level of due diligence they applied exceeded anything we'd experienced in this market."</p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">OA</div>
            <div>
              <div className="testimonial-name">Olumide Adeyemi</div>
              <div className="testimonial-role">Senior Partner · Lagos · Verified Client</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'diaspora',
    label: 'Diaspora Nigerians',
    content: (
      <>
<div>
          <h3>Invest at home. From anywhere. Without the usual risks.</h3>
          <div className="gold-divider"></div>
          <p style={{color:'var(--ink-soft)',lineHeight:'1.75'}}>You know Nigeria holds opportunity. You also know the risks. Our Diaspora Advisory Package is built to address every one of them - with a dedicated named advisor, verified listings, remote transaction management, and active on-the-ground stewardship.</p>
          <ul className="aud-features">
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>No Nigeria trip required - complete remote transaction management</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Document custody and independent legal representation</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Post-transfer asset monitoring with quarterly reports</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Repatriation and currency guidance on advisory basis</li>
          </ul>
          <Link href="/diaspora" className="btn btn-primary" style={{marginTop:'2rem'}}>Explore Diaspora Advisory</Link>
        </div>
        <div className="testimonial">
          <p className="testimonial-text">"As a Nigerian in the UK, I'd been burned twice before. Fair Deal Properties was the first firm that treated my money like their own. The transaction was flawless - I never once had to fly home."</p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">FN</div>
            <div>
              <div className="testimonial-name">Funmi Nwosu</div>
              <div className="testimonial-role">Manchester, UK · Diaspora Client</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'sme',
    label: 'SME Owners & Entrepreneurs',
    content: (
      <>
<div>
          <h3>Property as business diversification, not speculation.</h3>
          <div className="gold-divider"></div>
          <p style={{color:'var(--ink-soft)',lineHeight:'1.75'}}>Real estate can anchor your business's balance sheet and hedge against inflation. We help SME owners allocate intelligently - with bridge-financing guidance where needed - building property into a genuine business asset, not a gamble.</p>
          <ul className="aud-features">
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Investment thesis aligned to your business risk profile</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Bridge-financing facilitation with transparent term advisory</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Commercial and mixed-use opportunity access</li>
          </ul>
          <Link href="/contact" className="btn btn-primary" style={{marginTop:'2rem'}}>Book a Consultation</Link>
        </div>
        <div className="testimonial">
          <p className="testimonial-text">"We used property returns to fund our second location. The advisory we received from Fair Deal was exactly what we needed - structured, honest, and completely aligned to our business goals."</p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">CK</div>
            <div>
              <div className="testimonial-name">Chukwudi Kalu</div>
              <div className="testimonial-role">CEO · Abuja · Business Client</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'developers',
    label: 'Developers & Landowners',
    content: (
      <>
<div>
          <h3>Bring your asset to the investors it deserves.</h3>
          <div className="gold-divider"></div>
          <p style={{color:'var(--ink-soft)',lineHeight:'1.75'}}>Our involvement signals credibility to the market. We structure your off-plan offering, facilitate joint ventures, and introduce your development to qualified buyers and institutional capital. We partner only with developers who meet our standard.</p>
          <ul className="aud-features">
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Off-plan structuring for institutional and diaspora buyers</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Joint venture framework development and facilitation</li>
            <li className="aud-feature"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Landbank advisory and institutional investor introductions</li>
          </ul>
          <Link href="/developers" className="btn btn-primary" style={{marginTop:'2rem'}}>Developer &amp; Partner Advisory</Link>
        </div>
        <div className="testimonial">
          <p className="testimonial-text">"Their credibility marker on our Maitama development shifted the entire buyer profile - from casual enquirers to serious capital. We sold 60% of units in the first 90 days."</p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">BA</div>
            <div>
              <div className="testimonial-name">Babatunde Afolabi</div>
              <div className="testimonial-role">MD · Apex Developments · Abuja</div>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function HomeContent() {
  return (
    <>


  {/* Hero */}
  <section className="hero">
    <div className="hero-bg-pattern"></div>
    <div className="hero-glow"></div>
    <div className="hero-glow-2"></div>
    <div className="hero-content">
      <div className="hero-overline">
        <div className="hero-overline-line"></div>
        <span className="hero-overline-text">Real Estate · PropTech · Transaction Facilitation · Nigeria</span>
      </div>
      <h1 className="fade-in">Property, made<br/><em>transparent.</em></h1>
      <p className="hero-sub fade-in fade-in-2">A technology-enabled real estate agency and transaction facilitation firm combining professional advisory, verified property opportunities, digital platforms and market intelligence - to make property transactions more transparent, efficient, secure and accessible.</p>
      <div className="hero-actions fade-in fade-in-3">
        <Link href="/platform" className="btn-hero-primary">
          Explore the Platform
          <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </Link>
        <Link href="/marketplace" className="btn-hero-secondary">
          Browse Verified Marketplace
          <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </Link>
      </div>
    </div>
    <div className="hero-trust-bar">
      <div className="hero-trust-inner">
        <div className="hero-stat"><span className="hero-stat-val">₦12B+</span><span className="hero-stat-label">In Transactions Facilitated</span></div>
        <div className="hero-stat"><span className="hero-stat-val">100%</span><span className="hero-stat-label">Title-Verified Listings</span></div>
        <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Key Nigerian Markets</span></div>
        <div className="hero-stat"><span className="hero-stat-val">15+</span><span className="hero-stat-label">Years Advisory Experience</span></div>
      </div>
    </div>
  </section>

  {/* Position Banner */}
  <div className="pos-banner">
    <div className="pos-banner-inner">
      <div className="pos-item">
        <div className="pos-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <span>Verified site visits on every listing</span>
      </div>
      <div className="pos-divider"></div>
      <div className="pos-item">
        <div className="pos-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <span>Independent title search on all transactions</span>
      </div>
      <div className="pos-divider"></div>
      <div className="pos-item">
        <div className="pos-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div>
        <span>Advisory-first, commission-disciplined model</span>
      </div>
      <div className="pos-divider"></div>
      <div className="pos-item">
        <div className="pos-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg></div>
        <span>Dedicated diaspora advisory service</span>
      </div>
      <div className="pos-divider"></div>
      <div className="pos-item">
        <div className="pos-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        <span>Named advisor for every client engagement</span>
      </div>
    </div>
  </div>

  {/* What We Are */}
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="grid-2">
        <div>
          <div className="eyebrow">What Sets Us Apart</div>
          <h2>Not a brokerage.<br/>Not a portal.<br/>An <em style={{fontStyle:'italic',color:'var(--forest)'}}>advisory firm</em>.</h2>
          <div className="gold-divider"></div>
          <p className="lead">Most Nigerian real estate firms compete to list the most properties. We compete to verify the fewest - because rigour, not volume, is what protects your capital.</p>
          <p style={{marginTop:'1.25rem',color:'var(--ink-soft)',fontSize:'.95rem',lineHeight:'1.75'}}>Fair Deal Properties is Nigeria's first firm to authentically combine real estate agency, investment advisory, and financial facilitation in a single structured engagement model. One firm. Full lifecycle support. No gaps between the deal and the advice.</p>
          <Link href="/about" className="btn btn-outline" style={{marginTop:'2rem'}}>Our Operating Principles <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="card card-gold-accent" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'.5rem'}}>Verified Opportunities Only</h4>
            <p className="body-sm">Every listing passes our full verification standard - site visit, document inspection, ownership cross-check - before it reaches any client.</p>
          </div>
          <div className="card card-gold-accent" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'.5rem'}}>Advisory-Backed Capital Decisions</h4>
            <p className="body-sm">You make investment decisions with structured guidance, not sales pressure. We earn your trust before we earn your commission.</p>
          </div>
          <div className="card card-gold-accent" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'.5rem'}}>Post-Transfer Stewardship</h4>
            <p className="body-sm">Our engagement doesn't end at title transfer. Continued stewardship, monitoring, and advisory support are built into every client relationship.</p>
          </div>
          <div className="card card-gold-accent" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'.5rem'}}>Diaspora-Grade Safeguards</h4>
            <p className="body-sm">Remote transaction management, document custody, on-the-ground presence - purpose-built for investors who cannot be physically present.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Stats */}
  <section className="section-sm" style={{background:'var(--cream-mid)'}}>
    <div className="container">
      <div className="stats-grid">
        <div className="stat-item"><div className="stat-val">₦12B+</div><div className="stat-label">Transactions Facilitated</div></div>
        <div className="stat-item"><div className="stat-val">100%</div><div className="stat-label">Title-Verified Listings</div></div>
        <div className="stat-item"><div className="stat-val">3</div><div className="stat-label">Active Market Cities</div></div>
        <div className="stat-item"><div className="stat-val">15+</div><div className="stat-label">Years of Experience</div></div>
      </div>
    </div>
  </section>

  <section style={{background:'var(--cream-mid)',padding:'0 0 4rem'}}><div className="container"><div className="img-band h-lg"><img src="/assets/illustrations/i0.svg" alt="Three markets. One verification standard." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Abuja · Lagos · Port Harcourt</div><div className="img-cap-t">Three markets. One verification standard.</div></div></div></div></section>
{/* Core Services */}
  <section className="section" style={{background:'var(--cream)'}}>
    <div className="container">
      <div className="text-center mb-6">
        <div className="eyebrow" style={{justifyContent:'center'}}>Our Services</div>
        <h2>Five pillars of <em style={{fontStyle:'italic',color:'var(--forest)'}}>disciplined</em> client service</h2>
        <div className="gold-divider" style={{margin:'1.5rem auto'}}></div>
        <p className="lead" style={{margin:'0 auto',textAlign:'center'}}>Each service is purpose-engineered around what clients genuinely need in Nigeria's property market - not what is easiest to offer.</p>
      </div>
      <div className="grid-3 mt-6">
        <div className="card service-card">
          <div className="service-num">01</div>
          <div className="card-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <h3 className="h4 mb-2">Real Estate Agency &amp; Transaction Facilitation</h3>
          <p className="body-sm">Full lifecycle management - from opportunity identification and site verification to negotiation, legal coordination, and title transfer. Nothing leaves our desk unverified.</p>
          <Link href="/services" className="btn-text mt-3">Learn More <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        </div>
        <div className="card service-card">
          <div className="service-num">02</div>
          <div className="card-icon"><svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
          <h3 className="h4 mb-2">Real Estate Investment Advisory</h3>
          <p className="body-sm">Capital allocation counsel, not commission-driven brokerage. Market intelligence and structured portfolio guidance to build a considered position in the Nigerian market.</p>
          <Link href="/services" className="btn-text mt-3">Learn More <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        </div>
        <div className="card service-card">
          <div className="service-num">03</div>
          <div className="card-icon"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
          <h3 className="h4 mb-2">Bridge-Financing Facilitation &amp; Financial Advisory</h3>
          <p className="body-sm">We connect capital-ready buyers with credible financing channels - advising on structure, terms, and fit. We do not lend. We ensure you borrow right.</p>
          <Link href="/financing" className="btn-text mt-3">Learn More <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        </div>
        <div className="card service-card">
          <div className="service-num">04</div>
          <div className="card-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg></div>
          <h3 className="h4 mb-2">Diaspora Investment Support</h3>
          <p className="body-sm">A dedicated advisory channel for Nigerians investing from abroad - remote transaction management, document custody, on-the-ground stewardship, and post-purchase monitoring.</p>
          <Link href="/diaspora" className="btn-text mt-3">Explore Advisory <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        </div>
        <div className="card service-card" style={{gridColumn:'span 2'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center'}}>
            <div>
              <div className="service-num">05</div>
              <div className="card-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <h3 className="h4 mb-2">Developer &amp; Landowner Partnership Solutions</h3>
              <p className="body-sm">For developers, landowners, and institutional asset holders who need a credible advisory partner to structure, position, and transact their assets with the rigour serious investors expect.</p>
              <Link href="/developers" className="btn-text mt-3">Developer Advisory <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
            </div>
            <div style={{background:'var(--cream)',borderRadius:'var(--radius-md)',padding:'2rem'}}>
              <p style={{fontFamily:'var(--font-display)',fontSize:'1.1rem',color:'var(--ink-soft)',lineHeight:'1.6',fontStyle:'italic'}}>"Our involvement signals credibility to the market. We do not represent every developer - we partner with those who meet our standard."</p>
              <div style={{marginTop:'1rem',fontSize:'12px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold)'}}>Fair Deal Properties</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <Link href="/services" className="btn btn-outline">View Full Service Descriptions</Link>
      </div>
    </div>
  </section>

  {/* Pain Points */}
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="img-band h-md"><img src="/assets/illustrations/i1.svg" alt="Every finding traced to a source reference." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Evidence, Not Assertion</div><div className="img-cap-t">Every finding traced to a source reference.</div></div></div>
      <div style={{height:'3rem'}}></div>

      <div className="mb-6">
        <div className="eyebrow">The Problems We Solve</div>
        <h2>Real anxieties.<br/><em style={{fontStyle:'italic',color:'var(--forest)'}}>Direct answers.</em></h2>
        <div className="gold-divider"></div>
        <p className="lead">We built our advisory model around the concerns clients bring to us - not around what makes transactions easier for us.</p>
      </div>
      <div className="pain-grid">
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>Fake listings and unverified sellers</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>Every opportunity has been physically verified - site visit, document inspection, and ownership cross-check - before it is presented to any client.</span></div>
        </div>
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>Title ambiguity and document risk</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>An independent title search is conducted on every transaction. You receive a written verification report from our legal team before a single naira moves.</span></div>
        </div>
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>Financing uncertainty and poor structuring</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>We assess your financing requirements early and facilitate introductions to appropriate providers - with full transparency on terms and obligations.</span></div>
        </div>
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>No trusted presence on the ground</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>Diaspora clients are assigned a named advisor who manages the entire transaction remotely and reports regularly post-transfer.</span></div>
        </div>
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>No post-transaction support whatsoever</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>Our engagement does not end at closing. We provide continued advisory, rental facilitation referrals, and asset monitoring post-transfer.</span></div>
        </div>
        <div className="pain-cell">
          <div className="pain-problem"><span className="pain-q">"</span>Agents disappear after fees are collected</div>
          <div className="pain-solution"><svg className="check-ico" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>You will always have a named advisor at Fair Deal Properties - accountable, reachable, and invested in the outcome. Not a call centre.</span></div>
        </div>
      </div>
    </div>
  </section>

  {/* Who We Serve */}
  <section className="section" style={{background:'var(--cream)'}}>
    <div className="container">
      <div className="mb-5">
        <div className="eyebrow">Who We Serve</div>
        <h2>Your situation.<br/><em style={{fontStyle:'italic',color:'var(--forest)'}}>Our structure.</em></h2>
        <div className="gold-divider"></div>
      </div>
      <AudienceTabs panels={AUDIENCE_PANELS} />
    </div>
  </section>

  {/* Featured Opportunities */}
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'2rem',marginBottom:'3.5rem',flexWrap:'wrap'}}>
        <div>
          <div className="eyebrow">Verified Opportunities</div>
          <h2>Independently verified.<br/><em style={{fontStyle:'italic',color:'var(--forest)'}}>Carefully curated.</em></h2>
        </div>
        <Link href="/marketplace" className="btn-text">View All Verified Opportunities <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
      </div>
      <div className="grid-3">
        <div className="listing-card">
          <div className="listing-header">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span className="listing-type-pill">Residential · Abuja</span>
              <span style={{fontSize:'10px',background:'rgba(201,168,76,.2)',color:'var(--gold-light)',padding:'3px 10px',borderRadius:'50px',letterSpacing:'.1em'}}>C of O</span>
            </div>
            <div className="listing-title">Luxury Duplex - Maitama District</div>
          </div>
          <div className="listing-body">
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Maitama, Abuja FCT</div>
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> 5-bedroom fully detached duplex · 640m²</div>
            <p className="body-sm">Premium residential property in Abuja's most sought-after diplomatic zone. Completely titled with verified ownership chain dating 18 years. Ideal for owner-occupancy or premium rental income.</p>
            <div className="badge">Diaspora Friendly</div>
          </div>
          <div className="listing-footer">
            <div><div className="listing-meta" style={{marginBottom:'4px'}}>Price</div><div className="listing-price">₦450M</div></div>
            <Link href="/contact" className="btn-text">Enquire <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
        <div className="listing-card">
          <div className="listing-header" style={{background:'linear-gradient(135deg,#1a3d50 0%,#1e5068 100%)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span className="listing-type-pill">Commercial · Lagos</span>
              <span style={{fontSize:'10px',background:'rgba(201,168,76,.2)',color:'var(--gold-light)',padding:'3px 10px',borderRadius:'50px',letterSpacing:'.1em'}}>Gov't Consent</span>
            </div>
            <div className="listing-title">Grade-A Commercial Space - VI</div>
          </div>
          <div className="listing-body">
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Victoria Island, Lagos</div>
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Open-plan commercial · 1,200m²</div>
            <p className="body-sm">Prime commercial floor space in Lagos's premier business district. Long-term institutional tenants available. Delivery Q3 2026. Full documentation package available for review.</p>
            <div className="badge badge-gold">Off-Plan</div>
          </div>
          <div className="listing-footer">
            <div><div className="listing-meta" style={{marginBottom:'4px'}}>Price</div><div className="listing-price">₦1.2B</div></div>
            <Link href="/contact" className="btn-text">Enquire <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
        <div className="listing-card">
          <div className="listing-header" style={{background:'linear-gradient(135deg,#2d3a1a 0%,#3d5020 100%)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <span className="listing-type-pill">Land · Abuja</span>
              <span style={{fontSize:'10px',background:'rgba(201,168,76,.2)',color:'var(--gold-light)',padding:'3px 10px',borderRadius:'50px',letterSpacing:'.1em'}}>Survey + R of O</span>
            </div>
            <div className="listing-title">Development Land - Guzape Hill</div>
          </div>
          <div className="listing-body">
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Guzape, Abuja FCT</div>
            <div className="listing-meta"><svg style={{width:'12px',height:'12px',stroke:'currentColor',fill:'none',strokeWidth:'2'}} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> 2,000m² · Elevated panoramic plot</div>
            <p className="body-sm">Rare development plot in Abuja's most prestigious hilltop location. Survey plan and Right of Occupancy fully documented. Approved for residential development. Ideal for luxury estate project.</p>
            <div className="badge">Institutional Grade</div>
          </div>
          <div className="listing-footer">
            <div><div className="listing-meta" style={{marginBottom:'4px'}}>Price</div><div className="listing-price">₦280M</div></div>
            <Link href="/contact" className="btn-text">Enquire <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Insights */}
  <section className="section" style={{background:'var(--cream)'}}>
    <div className="container">
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'2rem',marginBottom:'3.5rem',flexWrap:'wrap'}}>
        <div>
          <div className="eyebrow">Market Intelligence</div>
          <h2>Knowledge is a prerequisite<br/>to <em style={{fontStyle:'italic',color:'var(--forest)'}}>good decisions.</em></h2>
        </div>
        <Link href="/insights" className="btn-text">All Insights &amp; Reports <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
      </div>
      <div className="grid-3">
        <div className="insight-card">
          <div className="insight-thumb"><div className="insight-thumb-pattern"></div><span className="insight-cat">Due Diligence</span></div>
          <div className="insight-body">
            <div className="insight-date">April 28, 2026 · 8 min read</div>
            <div className="insight-h">Title Verification in Nigeria: What Every Buyer Must Know Before Committing Capital</div>
            <p className="body-sm">A comprehensive guide to understanding C of O, R of O, Governor's Consent, and the verification process that protects your investment.</p>
            <Link href="/insights" className="btn-text" style={{marginTop:'1rem'}}>Read Article <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-thumb" style={{background:'linear-gradient(135deg,#1a3d50 0%,#1e5068 100%)'}}><div className="insight-thumb-pattern"></div><span className="insight-cat">Financing</span></div>
          <div className="insight-body">
            <div className="insight-date">April 14, 2026 · 6 min read</div>
            <div className="insight-h">Bridge Financing for Property Transactions: A Practical Primer for Nigerian Buyers</div>
            <p className="body-sm">How to access structured financing in Nigeria's property market - rates, terms, risks, and what the best-structured deals look like.</p>
            <Link href="/insights" className="btn-text" style={{marginTop:'1rem'}}>Read Article <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-thumb" style={{background:'linear-gradient(135deg,#2d3a1a 0%,#3d5020 100%)'}}><div className="insight-thumb-pattern"></div><span className="insight-cat">Market Intelligence</span></div>
          <div className="insight-body">
            <div className="insight-date">April 2, 2026 · 10 min read</div>
            <div className="insight-h">Abuja Residential Market Outlook - Q2 2026: Where Capital is Moving</div>
            <p className="body-sm">Our quarterly analysis of price trends, demand drivers, and emerging opportunity zones across Abuja's residential market segments.</p>
            <Link href="/insights" className="btn-text" style={{marginTop:'1rem'}}>Read Report <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Final CTA */}
  <div className="cta-band">
    <div className="cta-band-glow"></div>
    <div className="container cta-band-content">
      <div className="eyebrow" style={{justifyContent:'center',color:'rgba(201,168,76,.7)'}}>Ready to Begin?</div>
      <h2>Your capital deserves<br/><em>certainty</em>, not chance.</h2>
      <p>Whether you are buying your first verified asset, deploying diaspora capital, or bringing a development to market - the conversation starts with one confidential consultation.</p>
      <div className="cta-actions">
        <Link href="/contact" className="btn btn-gold btn-lg">Schedule a Confidential Consultation <span className="arrow-ico"><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></Link>
        <Link href="/how-it-works" className="btn btn-ghost-white btn-lg">How It Works</Link>
      </div>
      <p style={{marginTop:'2rem',marginBottom:'0',fontSize:'11px',letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(255,255,255,.2)'}}>Abuja · Lagos · Port Harcourt · UK · USA · Canada · Europe</p>
    </div>
  </div>
    </>
  );
}
