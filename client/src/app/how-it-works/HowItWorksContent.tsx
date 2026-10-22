import Link from 'next/link';

export default function HowItWorksContent() {
  return (
    <>

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>How It Works</div><h1>A structured process. <em>No ambiguity at any stage.</em></h1><p className="lead">From first conversation to post-transfer stewardship - six disciplined steps that govern every engagement, every time. No shortcuts. No surprises.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        <div className="img-band h-md"><img src="/assets/illustrations/i1.svg" alt="Six steps. No ambiguity at any stage." loading="lazy"/><div className="img-cap"><div className="img-cap-l">The Engagement Process</div><div className="img-cap-t">Six steps. No ambiguity at any stage.</div></div></div>
        <div style={{height:'3rem'}}></div>
        <div className="how-timeline">
          <div className="how-step"><div className="how-step-num">01</div><div className="how-step-content"><div className="how-step-title">Confidential Consultation</div><p className="how-step-body">A structured advisory session - in person, by video, or by phone - to understand your goals, timeline, risk profile, budget, and specific constraints. We listen before we recommend. This session is obligation-free and completely confidential.</p></div></div>
          <div className="how-step"><div className="how-step-num">02</div><div className="how-step-content"><div className="how-step-title">Opportunity Screening &amp; Mandate Definition</div><p className="how-step-body">We identify and screen opportunities against your defined mandate - from our verified platform and off-market sources. You receive only what passes our standard. This is curated shortlisting, not mass listing distribution.</p></div></div>
          <div className="how-step"><div className="how-step-num">03</div><div className="how-step-content"><div className="how-step-title">Independent Due Diligence</div><p className="how-step-body">Before any commitment is made, we conduct an independent title search, document review, site verification, and developer assessment where applicable. You receive a written verification report from our legal team. No naira moves before this report is delivered and reviewed.</p></div></div>
          <div className="how-step"><div className="how-step-num">04</div><div className="how-step-content"><div className="how-step-title">Offer Structuring &amp; Negotiation</div><p className="how-step-body">We represent your interest at the negotiating table - structuring the offer, negotiating terms, managing counterparty expectations, and ensuring your contractual protections are embedded in every agreement. You never negotiate alone.</p></div></div>
          <div className="how-step"><div className="how-step-num">05</div><div className="how-step-content"><div className="how-step-title">Legal Coordination &amp; Title Transfer</div><p className="how-step-body">Full legal coordination - Deed of Assignment drafting, Governor's Consent, title registration where applicable, payment milestone management, and final handover. Every document is verified before it is executed. Every payment is tracked and confirmed.</p></div></div>
          <div className="how-step" style={{paddingBottom:'0'}}><div className="how-step-num">06</div><div className="how-step-content"><div className="how-step-title">Post-Transfer Stewardship</div><p className="how-step-body">The engagement does not end at title transfer. We provide continued advisory, asset monitoring, rental facilitation referrals, and quarterly intelligence reports for as long as you hold the asset. Your investment is our long-term responsibility.</p></div></div>
        </div>
      </div>
    </div>
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Ready to begin <em>Step One?</em></h2><p>Book your confidential consultation today. No obligation - just the clarity you need to make your next capital decision with confidence.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Schedule a Consultation</Link><Link href="/marketplace" className="btn btn-ghost-white btn-lg">View Opportunities</Link></div></div></div>
    </>
  );
}
