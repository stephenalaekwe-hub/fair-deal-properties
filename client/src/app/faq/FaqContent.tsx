import FaqAccordion from '@/components/FaqAccordion';
import { faqItems } from '@/data/faq';
import Link from 'next/link';

export default function FaqContent() {
  return (
    <>

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Frequently Asked Questions</div><h1>Real questions. <em>Honest answers.</em></h1><p className="lead">We believe an informed client is our best client. Here are the questions we hear most often - answered with the directness and clarity every client deserves.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container" style={{maxWidth:'820px'}}>
      <FaqAccordion items={faqItems} />
    </div>
  </section>
  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Have a question we<br/>haven't <em>answered here?</em></h2><p>Book a consultation or send us your question directly. Every enquiry is responded to personally by a named advisor - not an automated system.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Ask a Direct Question</Link></div></div></div>
    </>
  );
}
