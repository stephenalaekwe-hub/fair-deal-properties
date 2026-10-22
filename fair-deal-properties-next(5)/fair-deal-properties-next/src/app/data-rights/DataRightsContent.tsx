import DataRightsForm from '@/components/forms/DataRightsForm';
import Link from 'next/link';

export default function DataRightsContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Legal &amp; Compliance</div>
      <h1>Your Data <em>Rights</em></h1>
      <p className="lead">Exercise any right you hold over your personal data under the Nigeria Data Protection Act 2023. The Act requires us to act without undue delay; we commit to acknowledging within 5 business days and responding within 30 days. There is no charge.</p>
    </div>
  </section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container" style={{maxWidth:'880px'}}>
      <div className="lg-nav">
        <Link href="/privacy-notice">Privacy Notice</Link>
        <Link href="/cookie-notice">Cookie Notice</Link>
        <Link href="/data-rights" className="on">Your Data Rights</Link>
        <Link href="/terms">Terms of Service</Link>
      </div>

      <div className="grid-2" style={{gap:'3rem',alignItems:'start'}}>
        <div>
          <div className="eyebrow">What you can ask for</div>
          <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',marginBottom:'1rem'}}>Ten rights, and what each one does</h3>
          <div className="gold-divider"></div>
          <div className="art" style={{marginBottom:'0'}}>
            <ul>
              <li><strong>Be informed</strong> - know what we do with your data. Our Privacy Notice discharges this.</li>
              <li><strong>Access</strong> - receive a copy of your data and information about how we use it.</li>
              <li><strong>Rectification</strong> - have inaccurate or incomplete data corrected without undue delay.</li>
              <li><strong>Erasure</strong> - have data deleted where it is no longer necessary or where consent is withdrawn and no other basis applies.</li>
              <li><strong>Restriction</strong> - limit our processing while a dispute about accuracy or lawfulness is resolved.</li>
              <li><strong>Portability</strong> - receive data you gave us in a machine-readable format and have it transmitted onward where feasible.</li>
              <li><strong>Object</strong> - object to processing based on legitimate interest, and to direct marketing at any time without exception.</li>
              <li><strong>Withdraw consent</strong> - at any time, as easily as it was given.</li>
              <li><strong>Automated decisions</strong> - not be subject to a decision based solely on automated processing with legal or similarly significant effect. We make no such decisions.</li>
              <li><strong>Complain</strong> - to us, and to the Nigeria Data Protection Commission.</li>
            </ul>
          </div>

          <div style={{background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',padding:'1.4rem 1.7rem',marginTop:'1.5rem'}}>
            <h4 style={{fontSize:'.95rem',marginBottom:'.6rem'}}>Where erasure is limited</h4>
            <p style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.7',margin:'0'}}>Some records we are required by law to keep. Customer due diligence records must be retained for 5 years after the end of a business relationship under the Money Laundering (Prevention and Prohibition) Act 2022, and transaction records for 7 years for tax and professional liability purposes. Where we cannot erase, we will tell you precisely which obligation prevents it and when the data will be deleted.</p>
          </div>

          <div style={{background:'var(--forest)',borderRadius:'var(--radius-md)',padding:'1.5rem 1.8rem',marginTop:'1.2rem'}}>
            <h4 style={{color:'#fff',fontSize:'1rem',marginBottom:'.6rem'}}>If you are not satisfied with our response</h4>
            <p style={{fontSize:'.82rem',color:'rgba(255,255,255,.68)',lineHeight:'1.7',marginBottom:'.6rem'}}>Article 40(2) and (3) of the General Application and Implementation Directive 2025 allow you to serve a <strong style={{color:'var(--gold-light)'}}>Standard Notice to Address Grievance</strong> on us, in the form at Schedule 9 to that Directive. You may use that route with us and we will treat it as a formal grievance. Serving it is not a precondition to complaining to the Nigeria Data Protection Commission - you may do either, or both.</p>
            <p style={{fontSize:'.82rem',color:'rgba(255,255,255,.68)',lineHeight:'1.7',margin:'0'}}>If the matter remains unresolved you may escalate to the Nigeria Data Protection Commission or institute civil proceedings. We will not require you to exhaust our internal process before approaching the Commission.</p>
          </div>
        </div>

        <div className="card" style={{padding:'2.1rem'}}>
          <h4 style={{marginBottom:'.4rem'}}>Submit a request</h4>
          <p className="body-sm" style={{marginBottom:'1.4rem'}}>Completing this form raises a formal data subject request. You will receive a reference number.</p>
          <DataRightsForm />
        </div>
      </div>

      <div className="dpo-card" style={{marginTop:'3rem'}}>
        <h4>Data Protection Officer</h4>
        <p>You may contact the Data Protection Officer about any matter in this notice, directly and without going through any other part of the firm.</p>
        <p><strong>Email:</strong> dpo@fairdealng.com &nbsp;|&nbsp; <strong>Telephone:</strong> 09049924198</p>
        <p><strong>Post:</strong> The Data Protection Officer, Fair Deal Properties Ltd, No. 4 Ekeh A. Yesufu Close, Utako, Abuja, FCT, Nigeria</p>
      </div>
    </div>
  </section>
    </>
  );
}
