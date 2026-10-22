import Link from 'next/link';

export default function DiasporaContent() {
  return (
    <>

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Diaspora Advisory</div><h1>Invest at home. From anywhere. Without <em>the usual risks.</em></h1><p className="lead">A purpose-built advisory service for Nigerians investing from abroad. Named advisor. Verified listings. Remote transaction management. Active post-purchase stewardship.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="img-band h-lg"><img src="/assets/illustrations/i6.svg" alt="Wherever you are. We are on the ground in Nigeria." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Diaspora Advisory</div><div className="img-cap-t">Wherever you are. We are on the ground in Nigeria.</div></div></div>
      <div style={{height:'3.5rem'}}></div>

      <div className="grid-2">
        <div>
          <div className="eyebrow">The Challenge We Solve</div>
          <h2>We understand exactly what stops you.</h2>
          <div className="gold-divider"></div>
          <p className="lead">Fear of fraud. Uncertainty about title. No one genuinely trustworthy on the ground. The nightmare of being 5,000 miles away when things go wrong.</p>
          <p style={{marginTop:'1.25rem',color:'var(--ink-soft)',lineHeight:'1.75'}}>Our Diaspora Advisory Package was built by advisors who have experienced these same anxieties - and then designed a service that addresses every one of them directly. You will have a named advisor, verified listings with complete documentation, full remote transaction management, and active post-purchase stewardship that continues for as long as you hold the asset.</p>
          <Link href="/contact" className="btn btn-primary" style={{marginTop:'2rem'}}>Begin Your Advisory Engagement</Link>
        </div>
        <div className="diaspora-feature">
          <div className="eyebrow" style={{color:'rgba(201,168,76,.7)'}}>The Diaspora Advisory Package</div>
          <h3 style={{color:'var(--white)',marginBottom:'.75rem',fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'300'}}>Everything managed. Nothing left to chance.</h3>
          <ul className="diaspora-feature-list">
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Dedicated named advisor (single point of contact)</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Verified listings with complete document packs</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Remote transaction management - no Nigeria trip required</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Independent legal representation (your interests, always)</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Document custody and secure holding</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Post-transfer asset monitoring with quarterly reports</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Repatriation and currency guidance (advisory basis)</li>
            <li className="diaspora-feat-item"><svg style={{width:'16px',height:'16px',flexShrink:'0',stroke:'var(--gold)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Rental facilitation and property management referrals</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  <section className="section" style={{background:'var(--cream)'}}>
    <div className="container">
      <div className="text-center mb-6"><div className="eyebrow" style={{justifyContent:'center'}}>Serving the Global Nigerian Community</div><h2>Wherever you are. <em style={{fontStyle:'italic',color:'var(--forest)'}}>We are in Nigeria.</em></h2></div>
      <div className="grid-4">
        <div className="card text-center"><div style={{fontFamily:'var(--font-display)',fontSize:'2rem',marginBottom:'.5rem'}}>🇬🇧</div><h4>United Kingdom</h4><p className="body-sm">London, Manchester, Birmingham - we serve Nigerian professionals and families investing from the UK.</p></div>
        <div className="card text-center"><div style={{fontFamily:'var(--font-display)',fontSize:'2rem',marginBottom:'.5rem'}}>🇺🇸</div><h4>United States</h4><p className="body-sm">New York, Houston, Atlanta, DMV - our US diaspora clients access the full advisory package.</p></div>
        <div className="card text-center"><div style={{fontFamily:'var(--font-display)',fontSize:'2rem',marginBottom:'.5rem'}}>🇨🇦</div><h4>Canada</h4><p className="body-sm">Toronto, Calgary, Vancouver - building home-country assets from Canadian soil.</p></div>
        <div className="card text-center"><div style={{fontFamily:'var(--font-display)',fontSize:'2rem',marginBottom:'.5rem'}}>🌍</div><h4>Rest of World</h4><p className="body-sm">Europe, Middle East, Asia - wherever you are based, we are your ground-presence in Nigeria.</p></div>
      </div>
    </div>
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Your homecoming investment<br/>begins with <em>one call.</em></h2><p>Schedule a confidential diaspora advisory consultation - we'll walk you through exactly how we protect your capital from the first enquiry to years after transfer.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Begin Your Diaspora Advisory</Link></div></div></div>
    </>
  );
}
