import Link from 'next/link';

export default function DevelopersContent() {
  return (
    <>

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Developer &amp; Partner Advisory</div><h1>Your asset, positioned for the <em>investors it deserves.</em></h1><p className="lead">When Fair Deal Properties is involved in a development's advisory process, it signals to the market that rigour has been applied. We do not represent every developer. We partner with those who meet our standard.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="img-band h-lg"><img src="/assets/illustrations/i7.svg" alt="We do not represent every developer. We partner with those who meet our standard." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Developer &amp; Partner Advisory</div><div className="img-cap-t">We do not represent every developer. We partner with those who meet our standard.</div></div></div>
      <div style={{height:'3.5rem'}}></div>

      <div className="grid-2">
        <div><div className="eyebrow">Our Partnership Model</div><h2>Credibility is our most valuable asset - yours too.</h2><div className="gold-divider"></div><p className="lead">Our developer partnerships cover off-plan structuring, joint venture frameworks, landbank advisory, developer due diligence, and introductions to institutional and diaspora capital actively seeking credible opportunities.</p><p style={{marginTop:'1.25rem',color:'var(--ink-soft)',lineHeight:'1.75'}}>We partner exclusively with developers whose documentation, track record, and development standards meet our criteria. This selectivity is deliberate - and it is precisely what makes our endorsement meaningful to the buyers and investors we serve.</p><Link href="/contact" className="btn btn-primary" style={{marginTop:'2rem'}}>Initiate a Partnership Conversation</Link></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div className="card"><h4 className="mb-2">Off-Plan Advisory</h4><p className="body-sm">Structure your off-plan offering for institutional and diaspora buyers with rigour and credibility.</p></div>
          <div className="card"><h4 className="mb-2">Joint Ventures</h4><p className="body-sm">Land without capital or capital without land - we bridge both parties with structured frameworks.</p></div>
          <div className="card"><h4 className="mb-2">Landbank Advisory</h4><p className="body-sm">Maximise value from your existing land holdings with intelligent positioning and timing strategy.</p></div>
          <div className="card"><h4 className="mb-2">Investor Introductions</h4><p className="body-sm">Qualified domestic and diaspora capital, actively seeking credible, well-structured opportunities.</p></div>
          <div className="card" style={{gridColumn:'span 2'}}><h4 className="mb-2">Developer Due Diligence Support</h4><p className="body-sm">We help you build the documentation and verification infrastructure that serious buyers and institutional investors expect. Our involvement from the design stage sets the standard for the entire project.</p></div>
        </div>
      </div>
    </div>
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Partner with us.<br/><em>Elevate your asset.</em></h2><p>If your development meets our standard, we want to hear from you. Let's begin with a confidential conversation about how we can work together.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Begin a Partnership Conversation</Link></div></div></div>
    </>
  );
}
