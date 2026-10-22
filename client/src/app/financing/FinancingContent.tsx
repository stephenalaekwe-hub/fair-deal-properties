'use client';
import FinancingCalculator from '@/components/FinancingCalculator';
import Link from 'next/link';
import LegacyWidgets from '@/components/LegacyWidgets';

export default function FinancingContent() {
  return (
    <>
      <LegacyWidgets init={null} />

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Financing Advisory</div><h1>We don't lend. We ensure <em>you borrow right.</em></h1><p className="lead">Financing is often the single largest barrier to a sound property transaction. We advise, introduce, and structure - with full transparency on terms and obligations, always.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="img-band h-lg"><img src="/assets/illustrations/i8.svg" alt="NHF, MREIF, PMI and commercial - compared on total cost, not headline rate." loading="lazy" style={{objectPosition:'center top'}}/><div className="img-cap"><div className="img-cap-l">Financing Routes</div><div className="img-cap-t">NHF, MREIF, PMI and commercial - compared on total cost, not headline rate.</div></div></div>
      <div style={{height:'3.5rem'}}></div>

      <div className="grid-2" style={{marginBottom:'5rem'}}>
        <div><div className="eyebrow">Our Financing Advisory Service</div><h2>Structure before you commit.</h2><div className="gold-divider"></div><p className="lead">We assess your financing requirements early in the advisory process - before you are in negotiation and under pressure. Our role is to ensure you never commit to financing terms you don't fully understand.</p><p style={{marginTop:'1.25rem',color:'var(--ink-soft)',lineHeight:'1.75'}}>We maintain relationships with credible bridge-financing providers across Nigeria's formal and informal capital markets. We introduce only where the terms are transparent, the provider is credible, and the structure serves your long-term interest - not theirs.</p><Link href="/contact" className="btn btn-primary" style={{marginTop:'2rem'}}>Discuss Your Financing Needs</Link></div>
        <FinancingCalculator />
      </div>
      <div className="financing-grid">
        <div className="card card-gold-accent"><h4 className="mb-2">Bridge Financing Facilitation</h4><p className="body-sm">Short-term financing to bridge the gap between commitment and full capital deployment. We introduce and structure - never lending ourselves.</p></div>
        <div className="card card-gold-accent"><h4 className="mb-2">Mortgage Advisory</h4><p className="body-sm">Guidance on accessing Nigeria's formal mortgage market - NHF, commercial bank mortgages, and employer-linked schemes where applicable.</p></div>
        <div className="card card-gold-accent"><h4 className="mb-2">Structured Payment Plans</h4><p className="body-sm">For off-plan developments, we negotiate structured milestone payment plans that protect your capital and align with construction progress.</p></div>
      </div>
    </div>
  </section>
    </>
  );
}
