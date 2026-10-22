import Link from 'next/link';

export default function TechnologyContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Technology, Security &amp; Compliance</div>
      <h1>Built for a market where<br/><em>trust must be proven.</em></h1>
      <p className="lead">How the Fair Deal platform is engineered, how your data is protected, and the regulatory framework we operate within.</p>
    </div>
  </section>

  <section className="section" style={{background:'var(--white)'}}>
    <div className="container" style={{maxWidth:'960px'}}>

      <div className="img-band h-md"><img src="/assets/illustrations/i8.svg" alt="Buy what is solved. Build only the moat." loading="lazy"/><div className="img-cap"><div className="img-cap-l">Architecture &amp; Controls</div><div className="img-cap-t">Buy what is solved. Build only the moat.</div></div></div>
      <div style={{height:'3rem'}}></div>
      <div className="eyebrow">Architecture</div>
      <h2 className="mb-3" style={{fontSize:'1.9rem'}}>The technology stack</h2>
      <div className="gold-divider"></div>
      <p className="lead mb-5">We buy proven infrastructure and build only what differentiates us. Our engineering effort goes into verification workflow and matching logic - not into rebuilding solved problems.</p>

      <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'0 2rem',marginBottom:'4rem'}}>
        <div className="stack-row"><div className="stack-label">Client Layer</div><div><span className="chip">Next.js / React</span><span className="chip">Progressive Web App</span><span className="chip">WhatsApp Business API</span><span className="chip">Mobile-first responsive</span><p className="body-sm mt-2">Nigeria is mobile-first and WhatsApp-native. Our primary client interface is built for a phone on an intermittent connection, not a desktop on fibre.</p></div></div>
        <div className="stack-row"><div className="stack-label">Application</div><div><span className="chip">Node.js API</span><span className="chip">PostgreSQL</span><span className="chip">Redis cache</span><span className="chip">Role-based access control</span><p className="body-sm mt-2">A single source of truth for listings, verifications, transactions and client records - with strict role separation between advisory, verification and finance functions.</p></div></div>
        <div className="stack-row"><div className="stack-label">Intelligence</div><div><span className="chip">Vector embeddings</span><span className="chip">LLM-assisted drafting</span><span className="chip">Human-in-the-loop review</span><p className="body-sm mt-2">AI drafts, structures and matches. A named human verifies every factual assertion. No verification finding, title status or property condition is ever machine-generated.</p></div></div>
        <div className="stack-row"><div className="stack-label">Document Vault</div><div><span className="chip">Encrypted object storage</span><span className="chip">AES-256 at rest</span><span className="chip">TLS 1.3 in transit</span><span className="chip">Immutable audit log</span><p className="body-sm mt-2">Every document access is logged with actor, timestamp and purpose. Diaspora clients can verify who touched their records and when.</p></div></div>
        <div className="stack-row"><div className="stack-label">Payments</div><div><span className="chip">Licensed PSP rails</span><span className="chip">Third-party escrow</span><span className="chip">No custody of client funds</span><p className="body-sm mt-2">Transaction funds move directly between counterparties or through licensed escrow. Fair Deal Properties never holds client purchase funds - a structural safeguard, not a policy preference.</p></div></div>
        <div className="stack-row"><div className="stack-label">Integrations</div><div><span className="chip">Lender submission portals</span><span className="chip">E-signature</span><span className="chip">Virtual tour capture</span><span className="chip">Analytics</span></div></div>
      </div>

      <div className="eyebrow">Data Protection</div>
      <h2 className="mb-3" style={{fontSize:'1.9rem'}}>How your information is protected</h2>
      <div className="gold-divider"></div>
      <div className="grid-2 mb-5" style={{gap:'1.25rem',alignItems:'stretch'}}>
        <div className="card card-gold-accent"><h4 className="mb-2">NDPA 2023 Compliance</h4><p className="body-sm">We process personal data as a Data Controller under the Nigeria Data Protection Act 2023, with a lawful basis identified for every processing activity. Our full Privacy Notice sets out your data subject rights and how to exercise them.</p></div>
        <div className="card card-gold-accent"><h4 className="mb-2">Access Segregation</h4><p className="body-sm">Verification staff, advisory staff and finance staff hold separate permissions. No single role can originate, verify and approve the same transaction - the same control principle applied in financial services.</p></div>
        <div className="card card-gold-accent"><h4 className="mb-2">Audit Trail Integrity</h4><p className="body-sm">Verification findings, document access and transaction milestones are written to an append-only log. Records can be added to and read, but not silently altered or deleted.</p></div>
        <div className="card card-gold-accent"><h4 className="mb-2">Retention Discipline</h4><p className="body-sm">Transaction records retained 7 years, KYC records 5 years post-relationship, in line with Nigerian tax and AML obligations. Enquiry data not converted to engagement is purged after 2 years.</p></div>
      </div>

      <div className="eyebrow">Regulatory Framework</div>
      <h2 className="mb-3" style={{fontSize:'1.9rem'}}>The rules we operate under</h2>
      <div className="gold-divider"></div>
      <p className="lead mb-4">We would rather state our regulatory boundaries plainly than let a client assume we do something we are not authorised to do.</p>
      <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:'2rem'}}>
        <div style={{background:'var(--forest)',padding:'1rem 1.5rem',display:'grid',gridTemplateColumns:'1fr 1.4fr'}}><div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Framework</div><div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>What It Means For You</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',padding:'1.2rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div style={{fontSize:'.88rem',fontWeight:'600',color:'var(--forest)'}}>MLPPA 2022 &amp; SCUML</div><div className="body-sm">Real estate businesses are designated non-financial institutions. All clients complete KYC verification before engagement. We are required to report suspicious transactions without prior notice to the client.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',padding:'1.2rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}><div style={{fontSize:'.88rem',fontWeight:'600',color:'var(--forest)'}}>NDPA 2023 / NDPC</div><div className="body-sm">Registered data controller obligations, data subject rights honoured within 30 days, and mandatory breach notification.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',padding:'1.2rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div style={{fontSize:'.88rem',fontWeight:'600',color:'var(--forest)'}}>ESVARBON</div><div className="body-sm">We do not offer valuation services. Formal property valuation is reserved to registered Estate Surveyors and Valuers. Where a valuation is required we engage a registered firm on your behalf. Our market analytics are decision intelligence, clearly distinguished from valuation.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',padding:'1.2rem 1.5rem',background:'var(--cream)'}}><div style={{fontSize:'.88rem',fontWeight:'600',color:'var(--forest)'}}>Mortgage Facilitation</div><div className="body-sm">We facilitate and advise on mortgage arrangements with licensed institutions. We are not a lender, we do not originate credit in our own name, and we do not take deposits or hold client funds.</div></div>
      </div>

      <div style={{padding:'1.25rem 1.75rem',background:'rgba(201,168,76,.07)',border:'1px solid rgba(201,168,76,.22)',borderRadius:'var(--radius-md)',display:'flex',gap:'12px',alignItems:'flex-start'}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a6818" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.82rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>On AI and honesty:</strong> We use artificial intelligence to draft documents, structure data, match opportunities and automate follow-up. We do not use it to generate verification findings, title conclusions, property condition assessments or client testimonials. In a market where anyone can now generate a convincing listing, the scarce asset is a person who actually visited the site and put their name to what they found. That is what we sell.</p>
      </div>

    </div>
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Questions about our<br/><em>architecture or controls?</em></h2><p>Institutional partners, lenders and estate committees are welcome to request a detailed technical and compliance briefing.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Request Technical Briefing</Link></div></div></div>
    </>
  );
}
