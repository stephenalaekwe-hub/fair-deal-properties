import SnagForm from '@/components/forms/SnagForm';
import Link from 'next/link';

export default function TermsContent() {
  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Legal &amp; Compliance</div>
      <h1>Terms of <em>Service</em></h1>
      <p className="lead">The binding terms that govern your use of this website and engagement with Fair Deal Properties. Please read carefully. These terms exist to protect both parties - and to establish a foundation of mutual clarity and professional trust.</p>
    </div>
  </section>
  <section className="section" style={{background:'var(--white)'}}>
    <div className="container" style={{maxWidth:'860px'}}>

      {/* Meta bar */}
      <div style={{background:'var(--cream)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'1.5rem 2rem',display:'flex',gap:'2rem',flexWrap:'wrap',marginBottom:'4rem'}}>
        <div><div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.25rem'}}>Version</div><div style={{fontSize:'.9rem',color:'var(--ink-soft)',fontWeight:'500'}}>2.0</div></div>
        <div><div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.25rem'}}>Effective Date</div><div style={{fontSize:'.9rem',color:'var(--ink-soft)',fontWeight:'500'}}>03 October 2026</div></div>
        <div><div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.25rem'}}>Last Reviewed</div><div style={{fontSize:'.9rem',color:'var(--ink-soft)',fontWeight:'500'}}>03 October 2026</div></div>
        <div><div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.25rem'}}>Governing Law</div><div style={{fontSize:'.9rem',color:'var(--ink-soft)',fontWeight:'500'}}>NDPA 2023 · GAID 2025</div></div>
      </div>

      {/* Acceptance */}
      <div style={{background:'rgba(201,168,76,.08)',border:'1px solid rgba(201,168,76,.25)',borderRadius:'var(--radius-lg)',padding:'2rem',marginBottom:'3.5rem'}}>
        <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',color:'var(--ink)',marginBottom:'.75rem'}}>Important Notice - Please Read Before Proceeding</h3>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',fontSize:'.93rem'}}>By accessing or using this website, or by engaging the services of Fair Deal Properties in any capacity, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must cease use of this website immediately. Your continued use of this website constitutes your ongoing acceptance of these Terms.</p>
      </div>

      {/* 1. Definitions */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 01</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Definitions</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>In these Terms of Service, the following definitions apply:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"The Firm," "we," "us," "our"</strong> refers to Fair Deal Properties, a real estate agency and financial advisory business registered and operating in the Federal Republic of Nigeria.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"Website"</strong> refers to the Fair Deal Properties website accessible at www.fairdealng.com and all associated subdomains and digital touchpoints.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"User," "you," "your"</strong> refers to any person who accesses or uses this website or engages the services of Fair Deal Properties.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"Services"</strong> refers to all services offered by Fair Deal Properties including real estate agency, real estate investment advisory, bridge-financing facilitation, diaspora advisory, and developer partnership solutions.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"Content"</strong> refers to all text, data, graphics, reports, market intelligence, property information, and other materials published on this Website.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>"Engagement Agreement"</strong> refers to any written client engagement letter, mandate agreement, or formal advisory agreement entered into between the Firm and a client.</span></li>
        </ul>
      </div>

      {/* 2. Nature of Services */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 02</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Nature of Our Services &amp; Regulatory Status</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>Fair Deal Properties operates as an independent real estate agency and financial advisory firm. Our advisory and agency services are provided on an independent basis. In the course of our services, we may:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'1.5rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Act as agent for buyers or sellers of real property in Nigeria.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Provide investment advisory services including market analysis, opportunity evaluation, and capital allocation guidance.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Facilitate introductions to bridge-financing providers on a non-discretionary advisory basis only. We do not hold, manage, or deploy client funds.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Provide diaspora-specific advisory and transaction management services.</span></li>
        </ul>
        <div style={{background:'rgba(201,168,76,.08)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-md)',padding:'1.25rem 1.5rem'}}>
          <p className="body-sm"><strong style={{color:'var(--forest)'}}>Important Limitation:</strong> Nothing on this website, or communicated by any advisor of Fair Deal Properties in an initial consultation, constitutes legal, tax, or licensed financial advice. Formal advisory services are only provided under a signed Engagement Agreement. For legal advice on property transactions, you should consult a qualified Nigerian legal practitioner independently.</p>
        </div>
      </div>

      {/* 3. Website Use */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 03</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Permitted Use of This Website</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>You may use this Website for lawful purposes only. You agree that you will not:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Use this Website for any fraudulent, deceptive, or unlawful purpose, including but not limited to money laundering or financial crime.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Attempt to gain unauthorised access to any part of this Website or any system or network connected to it.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Transmit any unsolicited or unauthorised advertising, promotional material, or spam.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Copy, reproduce, distribute, or commercially exploit any content from this Website without the Firm's prior written consent.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Use automated tools (scrapers, bots, crawlers) to extract data or content from this Website without our written permission.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Impersonate Fair Deal Properties or any of its advisors in any communication.</span></li>
        </ul>
      </div>

      {/* 4. Property Listings & Information */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 04</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Property Listings &amp; Market Information</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>All property listings, pricing information, and market intelligence published on this Website are provided for indicative purposes only and are subject to change without notice. While we apply our verification standard to every opportunity presented, we cannot warrant that information will be free from error or remain current at the precise time of your review. Specifically:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Prices shown are indicative asking prices and do not constitute offers or binding valuations.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Property availability is subject to change and may be withdrawn at any time without prior notice.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Market reports and investment analyses reflect conditions at the time of publication and should not be relied upon as current without verification.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>No content on this Website constitutes a legal guarantee of title, ownership, or encumbrance-free status. Full due diligence is always required and will be conducted by our team prior to any formal transaction.</span></li>
        </ul>
      </div>

      {/* 5. Intellectual Property */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 05</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Intellectual Property Rights</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>All content on this Website - including but not limited to text, graphics, the Fair Deal Properties logo, market reports, property listings, photographs, video content, and underlying code - is the exclusive intellectual property of Fair Deal Properties or is used under licence, and is protected by Nigerian copyright law and applicable international intellectual property conventions.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85'}}>You are granted a limited, non-exclusive, non-transferable licence to access and view this Website for your personal, non-commercial use only. No content may be reproduced, redistributed, published, or used commercially without our express prior written consent. Unauthorised use of our intellectual property may constitute an infringement actionable under the Copyright Act (as amended) and other applicable Nigerian law.</p>
      </div>

      {/* 6. Client Engagement */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 06</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Client Engagements &amp; Fees</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>Formal advisory or agency engagements commence only upon execution of a written Engagement Agreement between the client and Fair Deal Properties. The Engagement Agreement will specify the scope of services, applicable fees, payment terms, and the rights and obligations of both parties.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>Our fees are transparent and agreed in writing in advance. We do not charge undisclosed fees or accept undisclosed commissions from any third party in connection with a client transaction. Where we receive compensation from both a buyer and a seller or developer, this dual-agency arrangement will be disclosed and agreed in writing by both parties before the engagement proceeds.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85'}}>No advisory or agency relationship is created by submitting an enquiry form, attending an initial consultation, or receiving market intelligence from Fair Deal Properties. These activities are pre-engagement only.</p>
      </div>

      {/* 7. AML & Compliance */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 07</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Anti-Money Laundering &amp; Compliance Obligations</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>Fair Deal Properties is subject to and fully committed to compliance with applicable Nigerian anti-money laundering and counter-terrorism financing legislation, including the Money Laundering (Prevention and Prohibition) Act 2022 (MLPPA 2022) and the Terrorism (Prevention and Prohibition) Act 2022.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>In accordance with these obligations, all clients are required to complete Know-Your-Customer (KYC) verification before any formal engagement commences. We are required by law to:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'1rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Verify the identity of all clients and beneficial owners prior to providing services.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Conduct enhanced due diligence on politically exposed persons (PEPs) and high-risk clients.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Report suspicious transactions to the Nigeria Financial Intelligence Unit (NFIU) without prior notification to the client (as required by law).</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Retain KYC documentation for a minimum of 5 years following the conclusion of the business relationship.</span></li>
        </ul>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85'}}>Failure or refusal to complete KYC verification will result in our inability to provide services. We are registered with the Special Control Unit Against Money Laundering (SCUML) as required for real estate businesses in Nigeria.</p>
      </div>

      {/* 8. Limitation of Liability */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 08</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Limitation of Liability</h2>
        <div className="gold-divider"></div>
        <div style={{background:'rgba(201,168,76,.08)',border:'1px solid rgba(201,168,76,.2)',borderRadius:'var(--radius-md)',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <p className="body-sm"><strong style={{color:'var(--forest)'}}>Important:</strong> This section limits our liability to the extent permitted by Nigerian law. It does not affect any liability that cannot be excluded by law, including liability for fraud or death/personal injury caused by negligence.</p>
        </div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>To the maximum extent permitted by applicable Nigerian law, Fair Deal Properties shall not be liable for:</p>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Any loss arising from your reliance on information published on this Website without entering into a formal advisory engagement.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Any indirect, consequential, or economic loss arising from property investment decisions, including market fluctuations, changes in regulation, or shifts in property values.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Loss or damage resulting from temporary unavailability of the Website or technical failures beyond our reasonable control.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span>Any acts or omissions of third parties including developers, sellers, solicitors, financing providers, or government bodies involved in a property transaction.</span></li>
        </ul>
      </div>

      {/* 9. Governing Law */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 09</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>Governing Law &amp; Dispute Resolution</h2>
        <div className="gold-divider"></div>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>These Terms of Service and any dispute arising from or in connection with them or this Website shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85',marginBottom:'1rem'}}>In the event of any dispute arising from these Terms or from our services, we encourage the parties to first seek resolution through good-faith direct negotiation. If negotiation does not resolve the matter within 30 days, the dispute shall be referred to arbitration in accordance with the Arbitration and Mediation Act 2023 (Nigeria), with the seat of arbitration in Abuja, FCT.</p>
        <p style={{color:'var(--ink-soft)',lineHeight:'1.85'}}>Nothing in this clause prevents either party from seeking urgent injunctive or interim relief from a competent court of the Federal Republic of Nigeria.</p>
      </div>

      {/* 10. General */}
      <div style={{marginBottom:'3.5rem'}}>
        <div className="eyebrow">Section 10</div>
        <h2 style={{fontSize:'1.75rem',marginBottom:'1rem'}}>General Provisions</h2>
        <div className="gold-divider"></div>
        <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.75rem'}}>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>Entire Agreement:</strong> These Terms, together with our Privacy Notice and Cookie Policy, constitute the entire agreement between you and Fair Deal Properties in relation to your use of this Website, and supersede all prior representations, communications, and agreements.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>Severability:</strong> If any provision of these Terms is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>Amendments:</strong> We reserve the right to update these Terms at any time. Material changes will be published on this page with an updated effective date. Continued use of the Website constitutes acceptance of the revised Terms.</span></li>
          <li style={{display:'flex',alignItems:'flex-start',gap:'12px',color:'var(--ink-soft)',lineHeight:'1.75'}}><span style={{color:'var(--gold)',fontWeight:'700',flexShrink:'0',marginTop:'2px'}}>-</span><span><strong style={{color:'var(--ink)'}}>Force Majeure:</strong> We shall not be liable for any failure or delay in performance arising from circumstances beyond our reasonable control, including acts of God, government action, power failure, or telecommunications outages.</span></li>
        </ul>
      </div>

      {/* Contact */}
      <div style={{background:'var(--forest)',borderRadius:'var(--radius-xl)',padding:'3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'relative',zIndex:'1'}}>
          <div className="eyebrow" style={{color:'rgba(201,168,76,.7)'}}>Section 11</div>
          <h2 style={{fontSize:'1.75rem',marginBottom:'1rem',color:'var(--white)'}}>Contact for Legal Matters</h2>
          <div style={{width:'40px',height:'1px',background:'var(--gold)',marginBottom:'1.5rem'}}></div>
          <p style={{color:'rgba(255,255,255,.7)',lineHeight:'1.85',marginBottom:'2rem'}}>For all legal enquiries, notices, or formal correspondence relating to these Terms of Service, please contact us in writing at the details below. Electronic communications are accepted for general enquiries; formal legal notices must be sent by recorded post or courier.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
            <div>
              <div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,168,76,.6)',marginBottom:'.5rem'}}>Registered Business Address</div>
              <div style={{color:'rgba(255,255,255,.85)',fontSize:'.9rem',lineHeight:'1.7'}}>Fair Deal Properties<br/>No. 4 Ekeh A. Yesufu Close<br/>Utako, Abuja, FCT<br/>Federal Republic of Nigeria</div>
            </div>
            <div>
              <div style={{fontSize:'10px',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,168,76,.6)',marginBottom:'.5rem'}}>General &amp; Legal Enquiries</div>
              <div style={{color:'rgba(255,255,255,.85)',fontSize:'.9rem',lineHeight:'1.7'}}>Email: info@fairdealng.com<br/>Tel: 09049924198<br/>WhatsApp available on request</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
  {/* SNAG */}
      <div className="eyebrow">Section 03</div>
      <h2 style={{fontSize:'1.8rem',marginBottom:'1rem'}}>Standard Notice to Address Grievance</h2>
      <div className="gold-divider"></div>
      <p className="body-sm" style={{marginBottom:'1rem'}}>The NDPA General Application and Implementation Directive 2025 provides for a Standard Notice to Address Grievance, by which a data subject who believes their data rights have been infringed may require a data controller to address it. Use the form below to issue a SNAG to Fair Deal Properties Ltd.</p>
      <div style={{background:'rgba(201,168,76,.07)',border:'1px solid rgba(201,168,76,.25)',borderRadius:'var(--radius-md)',padding:'1.1rem 1.5rem',marginBottom:'1.5rem'}}>
        <p style={{fontSize:'.82rem',color:'var(--ink-soft)',lineHeight:'1.7'}}><strong>You do not have to use this first.</strong> Issuing a SNAG is not a precondition to complaining directly to the Nigeria Data Protection Commission or to commencing an action. We offer it because we would rather fix a problem than have you escalate one, but the choice is entirely yours.</p>
      </div>
      <div className="card" style={{marginBottom:'3.5rem'}}>
        <SnagForm />
      </div>

      {/* DPO + NDPC */}
      <div className="eyebrow">Section 04</div>
      <h2 style={{fontSize:'1.8rem',marginBottom:'1rem'}}>Who to contact</h2>
      <div className="gold-divider"></div>
      <div className="grid-2" style={{gap:'1.5rem',marginBottom:'3.5rem'}}>
        <div className="dp-card">
          <h4 style={{marginBottom:'.75rem'}}>Data Protection Officer</h4>
          <p className="body-sm" style={{marginBottom:'1rem'}}>Appointed under section 32 of the Nigeria Data Protection Act 2023. Responsible for our data protection programme, for responding to data subject requests, and for liaison with the Commission.</p>
          <div style={{fontSize:'.86rem',color:'var(--ink-soft)',lineHeight:'1.8'}}>
            <div><strong style={{color:'var(--ink)'}}>Fair Deal Properties Ltd</strong></div>
            <div>Attn: The Data Protection Officer</div>
            <div>No. 4 Ekeh A. Yesufu Close, Utako, Abuja, FCT</div>
            <div>info@fairdealng.com</div>
            <div>09049924198</div>
          </div>
        </div>
        <div className="dp-card">
          <h4 style={{marginBottom:'.75rem'}}>Nigeria Data Protection Commission</h4>
          <p className="body-sm" style={{marginBottom:'1rem'}}>The supervisory authority. You may complain to the Commission at any time, whether or not you have raised the matter with us first.</p>
          <div style={{fontSize:'.86rem',color:'var(--ink-soft)',lineHeight:'1.8'}}>
            <div><strong style={{color:'var(--ink)'}}>NDPC</strong></div>
            <div>ndpc.gov.ng</div>
            <div style={{fontSize:'11px',color:'var(--ink-muted)',marginTop:'.5rem',fontStyle:'italic'}}>Current contact particulars for the Commission should be taken from its own website, which is authoritative.</div>
          </div>
        </div>
      </div>

      {/* COMMITMENTS */}
      <div className="eyebrow">Section 05</div>
      <h2 style={{fontSize:'1.8rem',marginBottom:'1rem'}}>Our operating commitments</h2>
      <div className="gold-divider"></div>
      <div style={{border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',overflow:'hidden',marginBottom:'2rem'}}>
        <div style={{background:'var(--forest)',padding:'.9rem 1.5rem',display:'grid',gridTemplateColumns:'1.1fr 2.4fr'}}>
          <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>Obligation</div>
          <div style={{fontSize:'10px',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:'600'}}>What we do</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Breach notification</div><div className="body-sm">Any personal data breach is notified to the NDPC within 72 hours of our becoming aware of it. Where the breach is likely to result in high risk to you, we notify you directly without undue delay, in plain language.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Records of processing</div><div className="body-sm">We maintain a Record of Processing Activities covering every processing purpose, its lawful basis, the categories of data and data subjects, recipients, transfers, retention and security measures. It is reviewed quarterly.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Impact assessment</div><div className="body-sm">A Data Protection Impact Assessment is carried out before any processing likely to result in high risk, and is documented and retained.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Compliance audit</div><div className="body-sm">Where we meet the threshold for a data controller of major importance, we conduct the annual data protection compliance audit and file the Compliance Audit Return through a licensed Data Protection Compliance Organisation.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--white)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Direct marketing</div><div className="body-sm">We do not send marketing of any kind without your prior consent. Consent to marketing is never bundled with acceptance of our terms or with any other permission, and withdrawing it is a single step.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',borderBottom:'1px solid var(--border-light)',background:'var(--cream)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Processors</div><div className="body-sm">No third party processes personal data on our behalf without a written data processing agreement meeting the requirements of the Act. We assess every processor before engagement.</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 2.4fr',padding:'1.05rem 1.5rem',background:'var(--white)'}}><div style={{fontSize:'.85rem',fontWeight:'600',color:'var(--forest)'}}>Cross-border transfers</div><div className="body-sm">Our diaspora service necessarily involves transfers outside Nigeria. Every transfer is made on a lawful basis recognised by the Act, with documented safeguards, and is recorded in our Record of Processing Activities.</div></div>
      </div>

      <div style={{padding:'1.1rem 1.5rem',background:'var(--cream-mid)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',gap:'11px',alignItems:'flex-start'}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{fontSize:'.79rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>Version control.</strong> This page, our Privacy Notice and our Cookie Policy are version-controlled and dated. Where we make a material change we publish it here and, for clients, notify it directly. The version in force is the one displayed. Superseded versions are retained and available on request so you can see what applied when.</p>
      </div>

    
  
  
<div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Questions about these <em>Terms?</em></h2><p>We respond personally to every legal enquiry. No automated deflection. Our commitment to transparency extends to every communication.</p><div className="cta-actions"><Link href="/contact" className="btn btn-gold btn-lg">Send a Legal Enquiry</Link></div></div></div>
    </>
  );
}
