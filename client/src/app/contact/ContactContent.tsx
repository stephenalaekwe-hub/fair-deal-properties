import ContactForm from '@/components/forms/ContactForm';

export default function ContactContent() {
  return (
    <>

  <section className="page-hero"><div className="container page-hero-content"><div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Contact &amp; Consultations</div><h1>Let's begin with <em>a conversation.</em></h1><p className="lead">Every engagement starts with a confidential consultation. No obligation. No pressure. Just the clarity you need to make your next capital decision with confidence.</p></div></section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container">
      <div className="contact-grid">
        <div>
          <div className="contact-info-block"><div className="contact-info-label">Our Address</div><div className="contact-info-val">No. 4 Ekeh A. Yesufu Close,<br/>Utako, Abuja, FCT, Nigeria</div></div>
          <div className="contact-info-block"><div className="contact-info-label">Phone</div><div className="contact-info-val">09049924198</div></div>
          <div className="contact-info-block"><div className="contact-info-label">Email</div><div className="contact-info-val">info@fdealproperties.com</div></div>
          <div className="contact-info-block"><div className="contact-info-label">Markets Served</div><div className="contact-info-val" style={{fontSize:'1rem'}}>Abuja · Lagos · Port Harcourt<br/><span style={{fontSize:'.9rem',color:'var(--ink-muted)'}}>Diaspora: UK, USA, Canada, Europe &amp; beyond</span></div></div>
          <div style={{marginTop:'2rem',padding:'2rem',background:'var(--cream)',borderRadius:'var(--radius-lg)',borderLeft:'3px solid var(--gold)'}}>
            <h4 className="mb-2">Consultation Commitment</h4>
            <p className="body-sm">Every consultation is conducted by a named senior advisor - not a junior agent or a call centre. Your enquiry will be acknowledged promptly and your consultation scheduled at your earliest convenience.</p>
          </div>
        </div>
        <div>
          <h3 className="h4 mb-5" style={{fontFamily:'var(--font-display)',fontSize:'1.4rem'}}>Book a Confidential Consultation</h3>
          <ContactForm />
          <div className="success-msg" id="success-msg">✓ Thank you - your enquiry has been received. A named advisor will contact you promptly. We look forward to our conversation.</div>
        </div>
      </div>
    </div>
  </section>
    </>
  );
}
