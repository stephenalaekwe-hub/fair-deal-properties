import Link from 'next/link';

export default function AboutContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>About Fair Deal Properties</div>
      <h1>Built on the conviction that your capital deserves <em>more than a listing.</em></h1>
      <p className="lead">Fair Deal Properties Ltd is an integrated real estate, PropTech and transaction facilitation company delivering trusted property solutions through professional expertise, digital innovation, verified market intelligence and funding advisory.</p>
    </div>
  </section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="img-band h-lg"><img src="/assets/illustrations/i0.svg" alt="Institutional discipline, applied to private property advisory." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Fair Deal Properties Ltd</div><div className="img-cap-t">Institutional discipline, applied to private property advisory.</div></div></div>
      <div style={{height:'3.5rem'}}></div>

      <div className="grid-2">
        <div>
          <div className="eyebrow">Our Mission</div>
          <h2>Structure. Verification.<br/><em style={{fontStyle:'italic',color:'var(--forest)'}}>Stewardship.</em></h2>
          <div className="gold-divider"></div>
          <p className="lead">We exist to serve buyers, investors, developers, and diaspora Nigerians who are serious about property as capital - not just as a place to live.</p>
          <p style={{marginTop:'1.25rem',color:'var(--ink-soft)',lineHeight:'1.75'}}>We are a technology-enabled real estate agency and transaction facilitation firm. We combine professional advisory, verified property opportunities, digital platforms and market intelligence to make property transactions more transparent, efficient, secure and accessible. Technology is our strategic enabler - the means by which we differentiate service, improve client experience and reduce transaction risk across how property is marketed, acquired, developed, financed, managed and experienced.</p>
          <p style={{marginTop:'1.25rem',color:'var(--ink-soft)',lineHeight:'1.75'}}>Nigeria's property market has tremendous opportunity but real structural hazards: fake listings, title ambiguity, weak due diligence, and financing uncertainty. Our model is built explicitly to navigate and neutralise each of these on your behalf - with institutional rigour applied to every transaction we touch.</p>
        </div>
        <div className="card" style={{background:'var(--cream)',border:'none'}}>
          <h3 className="h4 mb-4">Our Operating Principles</h3>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>We list nothing we have not independently verified.</span></li>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>Title clarity is non-negotiable - always.</span></li>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>Advisory precedes every transaction.</span></li>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>Diaspora clients receive dedicated stewardship - without exception.</span></li>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>Post-transaction support is part of the engagement, not an add-on.</span></li>
            <li style={{display:'flex',alignItems:'flex-start',gap:'14px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',flexShrink:'0',marginTop:'9px'}}></div><span style={{color:'var(--ink-soft)',lineHeight:'1.6'}}>Integrity before incentive - always.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  <section className="section" style={{background:'var(--cream-mid)'}}>
    <div className="container">
      <div className="eyebrow">Our Values</div>
      <h2 className="mb-5">How we operate - <em style={{fontStyle:'italic',color:'var(--forest)'}}>every time.</em></h2>
      <div className="values-grid">
        <div className="card card-gold-accent"><div className="card-icon"><svg viewBox="0 0 24 24"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z"/><path d="M9 12l2 2 4-4"/></svg></div><h3 className="h4 mb-2">Integrity Before Incentive</h3><p className="body-sm">Our advisory is not commission-driven. We are structured to prioritise what is right for you, not what earns us the fastest fee. Our reputation is built on this commitment.</p></div>
        <div className="card card-gold-accent"><div className="card-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><h3 className="h4 mb-2">Precision Over Speed</h3><p className="body-sm">Every verified opportunity demands rigorous review. We would rather lose a listing than compromise our verification standard for urgency. Good decisions take proper time.</p></div>
        <div className="card card-gold-accent"><div className="card-icon"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><h3 className="h4 mb-2">Transparency as Infrastructure</h3><p className="body-sm">You will know what we know. No hidden fees, no undisclosed relationships, no selective omissions. Transparency is the foundation of every client relationship we build.</p></div>
        <div className="card card-gold-accent"><div className="card-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><h3 className="h4 mb-2">Long-Term Partnership</h3><p className="body-sm">Our relationship does not end at title transfer. We are invested in the performance and protection of your asset for years beyond the transaction. This is who we are.</p></div>
      </div>
    </div>
  </section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="eyebrow">Our Leadership</div>
      <h2 className="mb-5">People who have <em style={{fontStyle:'italic',color:'var(--forest)'}}>done this before.</em></h2>
      <div className="team-grid">
        <div className="team-card">
          <div className="team-photo-slot"><span className="tp-init">SA</span></div>
          <div className="team-name">Sir Stephen Alaekwe</div>
          <div className="team-title">Managing Director &amp; Principal Advisor</div>
          <div className="team-creds">FCA · CISA · CDPSE · ACTI · DTEF Cert.</div>
          <p className="body-sm">Almost two decades across financial advisory and structured corporate and real estate transactions, beginning in Abuja and extending across Lagos and international markets. An experienced commercial banker, professional accountant and privacy and digital trust consultant, now dedicated to bringing institutional discipline to private property advisory in Nigeria.</p>
        </div>
        <div className="team-card">
          <div className="team-photo-slot"><span className="tp-init">UO</span></div>
          <div className="team-name">Uzowuru Onyekachi A.</div>
          <div className="team-title">Head, Transactions &amp; Due Diligence</div>
          <div className="team-creds">Legal Practitioner · Property Law &amp; Land Tenure</div>
          <p className="body-sm">A licensed legal practitioner with a specialism in property law and land tenure systems. Leads our verification process, ensuring no listing reaches a client without complete title clarity and a documented ownership chain.</p>
        </div>
        <div className="team-card">
          <div className="team-photo-slot"><span className="tp-init">UO</span></div>
          <div className="team-name">Uchenna Okoli</div>
          <div className="team-title">Head, Diaspora &amp; International Advisory</div>
          <div className="team-creds">15+ Years Banking · Technology-Driven Facilitation</div>
          <p className="body-sm">Over fifteen years in the banking sector before moving into technology-driven business facilitation and building a trusted diaspora property channel. Understands both the anxieties and the ambitions of investors abroad, and has designed our service accordingly.</p>
        </div>
        <div className="team-card">
          <div className="team-photo-slot"><span className="tp-init">PO</span></div>
          <div className="team-name">Philip Ozigi</div>
          <div className="team-title">Head, Developer Relations</div>
          <div className="team-creds">Developer Ecosystem · JV &amp; Off-Plan Structuring</div>
          <p className="body-sm">Brings deep relationships across Nigeria's developer ecosystem. Structures joint ventures and off-plan partnerships with an emphasis on documentation, milestone accountability and mutual long-term benefit.</p>
        </div>
      </div>
      </div>
    
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Ready to work with an advisory<br/>you can <em>trust?</em></h2><p>Book a confidential consultation with our team. No obligation. Just clarity on your next capital decision.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Book a Consultation</Link></div></div></div>
    </>
  );
}
