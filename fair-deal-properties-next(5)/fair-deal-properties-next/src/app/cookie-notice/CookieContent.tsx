import ConsentControls from '@/components/ConsentControls';
import Link from 'next/link';

export default function CookieContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Legal &amp; Compliance</div>
      <h1>Cookie <em>Notice</em></h1>
      <p className="lead">What cookies this site uses, what each one does, how long it lasts, and how you control them. No optional cookie is set on your device before you consent.</p>
    </div>
  </section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container" style={{maxWidth:'880px'}}>
      <div className="lg-nav">
        <Link href="/privacy-notice" className="">Privacy Notice</Link>
        <Link href="/cookie-notice" className="on">Cookie Notice</Link>
        <Link href="/data-rights" className="">Your Data Rights</Link>
        <Link href="/terms" className="">Terms of Service</Link>
      </div><div className="lg-meta">
        <div className="lg-meta-i"><span className="lg-meta-l">Version</span><span className="lg-meta-v">2.0</span></div>
        <div className="lg-meta-i"><span className="lg-meta-l">Effective</span><span className="lg-meta-v">03 October 2026</span></div>
        <div className="lg-meta-i"><span className="lg-meta-l">Last reviewed</span><span className="lg-meta-v">03 October 2026</span></div>
        <div className="lg-meta-i"><span className="lg-meta-l">Framework</span><span className="lg-meta-v">NDPA 2023 · GAID 2025</span></div>
      </div>

      <div style={{background:'var(--forest)',borderRadius:'var(--radius-lg)',padding:'1.9rem',marginBottom:'2.6rem',display:'flex',gap:'1.5rem',alignItems:'center',flexWrap:'wrap'}}>
        <div style={{flex:'1',minWidth:'260px'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:'1.3rem',color:'#fff',marginBottom:'.4rem'}}>Manage your choices</div>
          <p style={{fontSize:'.85rem',color:'rgba(255,255,255,.65)',lineHeight:'1.68',margin:'0'}}>Change or withdraw your consent at any time. Your current choices and the timestamp at which they were recorded are available below.</p>
        </div>
        <div style={{display:'flex',gap:'.55rem',flexWrap:'wrap'}}>
          <ConsentControls />
        </div>
      </div>

      <div className="art"><div className="art-n">Article 1</div><h3>What cookies are</h3>
      <p>Cookies are small text files placed on your device by a website. They are widely used to make sites work, to remember your preferences, and in some cases to collect information about how a site is used.</p>
      <p>This notice also covers technologies that work in a similar way, including web beacons, pixel tags, local storage and session storage. Where we refer to cookies we include all of these.</p></div>

      <div className="art"><div className="art-n">Article 2</div><h3>Our consent position</h3>
      <p>Under the Nigeria Data Protection Act 2023 and the General Application and Implementation Directive 2025, consent must be freely given, specific, informed and unambiguous, and must be as easy to withdraw as it is to give. We apply that as follows:</p><ul><li><strong>No optional cookie is set before you consent.</strong> Our consent banner does not pre-tick any category, and closing or ignoring it is not treated as consent.</li><li><strong>Consent is granular.</strong> You may accept one category and refuse another. Accepting all is never required in order to refuse all.</li><li><strong>Rejecting is as easy as accepting.</strong> Both are a single click, presented with equal prominence.</li><li><strong>Consent is not a condition of use.</strong> Every part of this site works whether you accept optional cookies or not.</li><li><strong>Your consent is recorded.</strong> We store what you chose, when, by what method and against which version of this notice, so that we can evidence it. You may view that record at any time using the control above.</li><li><strong>Withdrawal is always available.</strong> The privacy control at the lower left of every page reopens the preference centre.</li></ul></div>

      <div className="art"><div className="art-n">Article 3</div><h3>Cookies this site uses</h3>
      <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',overflow:'hidden',margin:'1.2rem 0'}}>
        <div style={{background:'var(--forest)',padding:'.85rem 1.3rem',display:'grid',gridTemplateColumns:'1.1fr 1.9fr .8fr .9fr'}}>
          <div style={{fontSize:'9.5px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'700'}}>Category</div>
          <div style={{fontSize:'9.5px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'700'}}>Purpose</div>
          <div style={{fontSize:'9.5px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'700'}}>Duration</div>
          <div style={{fontSize:'9.5px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'700'}}>Basis</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1.9fr .8fr .9fr',padding:'1rem 1.3rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div><div style={{fontSize:'.84rem',fontWeight:'700',color:'var(--forest)'}}>Strictly necessary</div><div style={{fontSize:'10px',color:'var(--success)',fontWeight:'700',marginTop:'3px'}}>ALWAYS ACTIVE</div></div><div style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.62'}}>Page navigation, form submission, session continuity, security, and storing your cookie choice itself. The site cannot function without these.</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Session</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Legitimate interest</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1.9fr .8fr .9fr',padding:'1rem 1.3rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}><div><div style={{fontSize:'.84rem',fontWeight:'700',color:'var(--forest)'}}>Functional</div><div style={{fontSize:'10px',color:'var(--ink-muted)',fontWeight:'700',marginTop:'3px'}}>OPTIONAL</div></div><div style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.62'}}>Remembers settings and the page you were viewing, so the site behaves consistently on your return.</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Up to 6 months</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Consent</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1.9fr .8fr .9fr',padding:'1rem 1.3rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div><div style={{fontSize:'.84rem',fontWeight:'700',color:'var(--forest)'}}>Analytics</div><div style={{fontSize:'10px',color:'var(--ink-muted)',fontWeight:'700',marginTop:'3px'}}>OPTIONAL</div></div><div style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.62'}}>Anonymised measurement of pages visited, time spent and referral source, so we can improve the site. No personally identifying information is collected through this category.</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Up to 6 months</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Consent</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1.9fr .8fr .9fr',padding:'1rem 1.3rem',background:'var(--cream)'}}><div><div style={{fontSize:'.84rem',fontWeight:'700',color:'var(--forest)'}}>Marketing</div><div style={{fontSize:'10px',color:'var(--red)',fontWeight:'700',marginTop:'3px'}}>NOT IN USE</div></div><div style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.62'}}>We operate no marketing or advertising cookie and use no third-party advertising or remarketing network. The control is published so that if this ever changes, your prior choice already governs it.</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>n/a</div><div style={{fontSize:'.82rem',color:'var(--ink)'}}>Explicit consent</div></div>
      </div></div>

      <div className="art"><div className="art-n">Article 4</div><h3>Third-party cookies</h3>
      <p>We operate no third-party advertising or tracking network on this site.</p>
      <p>This site loads typefaces from a third-party font service. That request may expose your internet protocol address to the provider. If you refuse optional cookies, fonts still load, because the request is part of rendering the page rather than a cookie. If you wish to prevent it entirely, your browser or an extension can block third-party font loading; the site remains fully readable in system typefaces.</p>
      <p>Where we engage any third-party processor in future, we will conduct due diligence on its data protection standards, bind it by a written data processing agreement, and update this notice before deployment.</p>
      <p>Links from this site to third-party websites are outside our control. Those sites operate their own cookie practices and we accept no responsibility for them.</p></div>

      <div className="art"><div className="art-n">Article 5</div><h3>Your controls</h3>
      <ul><li><strong>Preference centre</strong> - the primary control. Set each category independently. Reachable from the banner, from the privacy control at the lower left of every page, and from the buttons at the top of this notice.</li><li><strong>Withdraw entirely</strong> - clears the consent record from your device and restores the banner, so you may choose afresh.</li><li><strong>View your record</strong> - shows what you chose, when, by what method and against which notice version.</li><li><strong>Browser settings</strong> - most browsers allow you to refuse or delete cookies. Disabling all cookies, including strictly necessary ones, will impair this and most other websites.</li><li><strong>Contact us</strong> - our Data Protection Officer at dpo@fairdealng.com will action any request about cookie data.</li></ul></div>

      <div className="art"><div className="art-n">Article 6</div><h3>Changes to this notice</h3>
      <p>We review this notice at least annually and whenever we change the cookies we use. Where a change introduces a new category or a new purpose, we will seek fresh consent rather than rely on consent given against an earlier version. The version number above identifies the notice against which your consent was recorded.</p></div>
    </div>
  </section>
    </>
  );
}
