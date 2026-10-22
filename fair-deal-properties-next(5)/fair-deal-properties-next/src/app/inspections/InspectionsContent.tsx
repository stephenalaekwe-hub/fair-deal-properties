'use client';

import Link from 'next/link';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { walkthroughs } from '@/data/walkthroughs';

type Tab = 'virtual' | 'physical' | 'track';
interface LogLine { at: string; text: string; kind: 'sys' | 'ok' | 'ev' }

function clock() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
    + ':' + String(d.getSeconds()).padStart(2, '0');
}

/** HH:MM, for the session-open stamp in the rail. */
function clockShort() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/**
 * Inspection Hub.
 *
 * The markup below is the published design, unchanged. Only the parts the original
 * script wrote at runtime - the version chips, the station rail, the stage, the session
 * meta and the log - are rendered from React state, and they emit the same elements and
 * class names the script emitted.
 *
 * A superseded walkthrough version stays selectable and is labelled as superseded. That
 * is the point of the component: a record that can be quietly replaced is not evidence.
 */
export default function InspectionsContent() {
  const [tab, setTab] = useState<Tab>('virtual');
  const [propIndex, setPropIndex] = useState(0);
  const [verIndex, setVerIndex] = useState(0);
  const [stIndex, setStIndex] = useState(0);
  const [seen, setSeen] = useState<Record<number, boolean>>({ 0: true });

  const property_ = walkthroughs[propIndex]!;
  const version = property_.versions[verIndex]!;
  const stations = version.stations;
  const station = stations[stIndex];

  const sessionRef = useMemo(() => {
    const d = new Date();
    return 'VW-' + d.getFullYear().toString().slice(2)
      + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
      + '-' + (propIndex * 7 + verIndex * 13 + 41).toString(36).toUpperCase().padStart(5, 'A');
  }, [propIndex, verIndex]);

  /**
   * The session clock is read on the client only. Reading it during the server render
   * would put one time in the HTML and a different one in the first client render, which
   * React reports as a hydration mismatch and which would, on a page whose whole purpose
   * is an evidence trail, show the visitor two different session times.
   */
  const [sessionOpen, setSessionOpen] = useState('-');
  const [log, setLog] = useState<LogLine[]>([]);

  useEffect(() => {
    setSessionOpen(clockShort());
    setLog([{ at: clock(), text: 'Session opened.', kind: 'sys' }]);
  }, []);

  const seenCount = Object.keys(seen).length;
  const progressPct = Math.round((seenCount / stations.length) * 100);
  const stamp = station
    ? version.v + ' · CAPTURED ' + version.date.toUpperCase()
      + ' · OFFICER ' + version.officer.toUpperCase()
      + ' · STATION ' + (stIndex + 1) + '/' + stations.length
    : 'AWAITING SELECTION';

  const addLog = useCallback((text: string, kind: LogLine['kind'] = 'ev') => {
    setLog((l) => [{ at: clock(), text, kind }, ...l].slice(0, 60));
  }, []);

  function showStation(i: number) {
    if (i < 0 || i >= stations.length) return;
    const wasNew = !seen[i];
    setStIndex(i);
    setSeen((s) => ({ ...s, [i]: true }));
    const s = stations[i]!;
    addLog('Viewed station ' + (i + 1) + ' - ' + s.t + ' (' + s.e.length + ' evidence items)',
           wasNew ? 'ok' : 'ev');
    if (wasNew && seenCount + 1 === stations.length) {
      addLog('All stations viewed. Session eligible for certificate.', 'ok');
    }
  }

  function selectProperty(i: number) {
    setPropIndex(i); setVerIndex(0); setStIndex(0); setSeen({ 0: true });
    addLog('Property loaded: ' + walkthroughs[i]!.name, 'sys');
  }

  function selectVersion(i: number) {
    setVerIndex(i); setStIndex(0); setSeen({ 0: true });
    const v = property_.versions[i]!;
    addLog('Version switched to ' + v.v + ' (captured ' + v.date + ', officer ' + v.officer + ')', 'sys');
    if (v.status === 'superseded') {
      addLog('NOTE: this version is superseded. It is retained for audit and is not the current record.', 'sys');
    }
  }

  function issueCertificate() {
    addLog('Session certificate issued.', 'ok');
    const now = new Date();
    const when = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
      + ' at ' + clock();
    window.alert(
      'FAIR DEAL PROPERTIES LTD\n'
      + 'VIRTUAL INSPECTION SESSION CERTIFICATE\n'
      + '----------------------------------------\n\n'
      + 'Session reference : ' + sessionRef + '\n'
      + 'Issued            : ' + when + '\n\n'
      + 'Property          : ' + property_.name + '\n'
      + 'Location          : ' + property_.loc + '\n\n'
      + 'Inspection version: ' + version.v + '\n'
      + 'Captured          : ' + version.date + '\n'
      + 'Attending officer : ' + version.officer + '\n'
      + 'Status            : ' + version.status + '\n\n'
      + 'Stations viewed   : ' + seenCount + ' of ' + stations.length + '\n\n'
      + 'This certificate records a virtual walkthrough session only. It is not an\n'
      + 'inspection report, not a valuation and not a title opinion.',
    );
  }

  return (
    <>

  <section className="page-hero">
    <div className="container page-hero-content">
      <div className="eyebrow" style={{color:'rgba(201,168,76,.8)'}}>Inspection Hub</div>
      <h1>See it before you<br/><em>commit to it.</em></h1>
      <p className="lead">Dated, versioned virtual walkthroughs you can take from anywhere, and physical inspections you can request and track to the minute. Every session logged. Every evidence item referenced.</p>
    </div>
  </section>

  <section className="section" style={{background:'var(--cream)'}}>
    <div className="container">

      <div className="ins-tabs">
        <button className={tab === 'virtual' ? 'ins-tab active' : 'ins-tab'} onClick={() => setTab('virtual')} type="button">Virtual Walkthrough</button>
        <button className={tab === 'physical' ? 'ins-tab active' : 'ins-tab'} onClick={() => setTab('physical')} type="button">Request Physical Inspection</button>
        <button className={tab === 'track' ? 'ins-tab active' : 'ins-tab'} onClick={() => setTab('track')} type="button">Track an Inspection</button>
      </div>

      {/* ─────────── VIRTUAL ─────────── */}
      <div className={tab === 'virtual' ? 'ins-panel active' : 'ins-panel'} id="ins-virtual">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:'1.5rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
          <div>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',marginBottom:'.3rem'}}>{property_.name}</h3>
            <p className="body-sm">{property_.loc}</p>
          </div>
          <select id="vwProp" value={propIndex} onChange={(e) => selectProperty(Number(e.target.value))} style={{fontFamily:'var(--font-body)',fontSize:'12.5px',padding:'9px 15px',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',background:'var(--white)',cursor:'pointer',outline:'none'}}>
            <option value="0">Hutu Exclusive Phase III - 500SQM Plot</option>
            <option value="1">Maitama Luxury Duplex - 5 Bed</option>
            <option value="2">Guzape Hill Development Land - 2,000SQM</option>
          </select>
        </div>

        <div className="ver-strip">
          <span style={{fontSize:'10px',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-muted)',marginRight:'.25rem'}}>Inspection version</span>
          <span id="verChips">{property_.versions.map((v, i) => (
            <button
              key={v.v}
              className={'ver-chip ' + (i === verIndex ? 'active ' : '') + (v.status === 'superseded' ? 'superseded' : '')}
              onClick={() => selectVersion(i)}
              type="button"
            >{v.v} · {v.date}{v.status === 'current' ? '' : ' · superseded'}</button>
          ))}</span>
          <span style={{marginLeft:'auto',fontSize:'11px',color:'var(--ink-muted)'}}>Superseded versions remain viewable. Nothing is deleted.</span>
        </div>

        <div className="vw-shell">
          {/* rail */}
          <div className="vw-rail">
            <div className="vw-rail-h">Walkthrough Stations</div>
            <div id="stationList">{stations.map((s, i) => (
            <div
              key={s.t + i}
              className={'station ' + (i === stIndex ? 'active ' : '') + (seen[i] ? 'seen' : '')}
              onClick={() => showStation(i)}
            >
              <div className="station-n">{seen[i] ? '✓' : i + 1}</div>
              <div><div className="station-t">{s.t}</div><div className="station-s">{s.s}</div></div>
            </div>
          ))}</div>
            <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid var(--border)'}}>
              <div className="vw-rail-h">Session</div>
              <div style={{fontSize:'10.5px',color:'var(--ink-muted)',lineHeight:'1.8',fontFamily:'var(--font-mono)'}}>
                <div>REF <span id="sessRef" style={{color:'var(--forest)'}}>{sessionRef}</span></div>
                <div>OPEN <span id="sessStart" style={{color:'var(--forest)'}}>{sessionOpen}</span></div>
                <div>VIEWED <span id="sessSeen" style={{color:'var(--forest)'}}>{seenCount}</span> / <span id="sessTot">{stations.length}</span></div>
              </div>
            </div>
          </div>

          {/* stage */}
          <div className="vw-stage">
            <div className="vw-prog"><div className="vw-prog-f" id="vwProg" style={{ width: progressPct + '%' }} /></div>
            <div className="vw-frame">
              <div className="vw-card">
                <div className="vw-icon" id="vwIcon">{station ? station.i : '📍'}</div>
                <div className="vw-title" id="vwTitle">{station ? station.t : 'Select a station'}</div>
                <div className="vw-desc" id="vwDesc">{station ? station.d : 'Choose a walkthrough station from the panel on the left to begin your inspection.'}</div>
                <div className="vw-evid" id="vwEvid">{station && station.e.map((x) => (<span className="evid" key={x}>{x}</span>))}</div>
              </div>
            </div>
            <div className="vw-bar">
              <div className="vw-meta" id="vwStamp">{stamp}</div>
              <div style={{display:'flex',gap:'.5rem'}}>
                <button className="vw-btn" id="vwPrev" onClick={() => showStation(stIndex - 1)} disabled={stIndex === 0} type="button">‹ Prev</button>
                <button className="vw-btn" id="vwNext" onClick={() => showStation(stIndex + 1)} disabled={stIndex === stations.length - 1} type="button">Next ›</button>
                <button className="vw-btn gold" onClick={issueCertificate} type="button">Issue Session Certificate</button>
              </div>
            </div>
          </div>

          {/* log */}
          <div className="vw-log">
            <div className="vw-rail-h">Real-Time Session Log</div>
            <div id="logFeed">{log.map((l, i) => (
            <div className="log-item" key={i}>
              <span className={'log-dot ' + (l.kind === 'sys' ? 'sys' : l.kind === 'ok' ? 'ok' : '')} />
              <div><span>{l.text}</span><span className="log-time">{l.at}</span></div>
            </div>
          ))}</div>
          </div>
        </div>

        <div style={{marginTop:'1.5rem',padding:'1.1rem 1.5rem',background:'var(--white)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',display:'flex',gap:'11px',alignItems:'flex-start'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2" style={{flexShrink:'0',marginTop:'2px'}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <p style={{fontSize:'.79rem',color:'var(--ink-muted)',lineHeight:'1.7'}}><strong style={{color:'var(--ink-soft)'}}>What a virtual walkthrough is and is not.</strong> A virtual walkthrough presents dated evidence captured by a named Fair Deal Properties officer who physically attended the site on the stated date. It records what was observed on that date. It does not replace a physical inspection, a title investigation or an assurance report, and it is not a representation about title, ownership or condition at any other date. Every session is logged and the log is available to the client on request.</p>
        </div>
      </div>

      {/* ─────────── PHYSICAL REQUEST ─────────── */}
      <div className={tab === 'physical' ? 'ins-panel active' : 'ins-panel'} id="ins-physical">
        <div className="grid-2" style={{gap:'3rem',alignItems:'start'}}>
          <div>
            <div className="eyebrow">Physical Inspection</div>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',marginBottom:'.75rem'}}>A named officer attends. You track every step.</h3>
            <div className="gold-divider"></div>
            <p className="body-sm" style={{marginBottom:'1.5rem'}}>Request a physical inspection on any property, whether or not it is on our platform. A named field officer attends, completes the standard Site Inspection Checklist in full, and captures dated, geotagged evidence. You receive notifications at each stage and a tracking reference you can check at any time.</p>

            <h4 style={{fontSize:'.95rem',marginBottom:'.6rem'}}>What the officer does on site</h4>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1.5rem'}}>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Geotagged arrival photograph with time on site recorded</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Coordinates recorded and matched against the survey plan</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Beacon numbers sighted, photographed, boundary walked</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Photographs from a minimum of four aspects, plus video</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Infrastructure, access, occupancy and encroachment recorded</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Every discrepancy against documentation described and photographed</li>
            </ul>

            <div style={{background:'var(--forest)',borderRadius:'var(--radius-md)',padding:'1.5rem'}}>
              <div style={{fontSize:'10px',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(201,168,76,.7)',marginBottom:'.5rem'}}>Standard turnaround</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:'#fff'}}>4 hrs</div><div style={{fontSize:'10.5px',color:'rgba(255,255,255,.5)'}}>Acknowledgement and scheduling</div></div>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',color:'var(--gold-light)'}}>72 hrs</div><div style={{fontSize:'10.5px',color:'rgba(255,255,255,.5)'}}>FCT inspection completed</div></div>
              </div>
            </div>
          </div>

          <div className="card" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'1.25rem'}}>Request an Inspection</h4>
            <form id="insForm" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">First Name *</label><input type="text" className="form-input" required={true} placeholder="Adebayo"/></div>
                <div className="form-group"><label className="form-label">Last Name *</label><input type="text" className="form-input" required={true} placeholder="Okonkwo"/></div>
              </div>
              <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" required={true} placeholder="you@example.com"/></div>
              <div className="form-group"><label className="form-label">Phone / WhatsApp *</label><input type="tel" className="form-input" required={true} placeholder="+234 or international"/></div>
              <div className="form-group"><label className="form-label">Property address or plot reference *</label><input type="text" className="form-input" id="insAddr" required={true} placeholder="e.g. Plot 42, Hutu Exclusive, Airport Road, Abuja"/></div>
              <div className="form-group"><label className="form-label">Location</label>
                <select className="form-select" id="insLoc">
                  <option>Abuja FCT - within city</option>
                  <option>Abuja FCT - Area Council</option>
                  <option>Nasarawa / Suburban corridor</option>
                  <option>Lagos</option>
                  <option>Port Harcourt</option>
                  <option>Other - we will confirm coverage</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Inspection scope</label>
                <select className="form-select" id="insScope">
                  <option>Standard site inspection - evidence capture and checklist</option>
                  <option>Boundary and beacon verification against survey plan</option>
                  <option>Construction progress inspection - off-plan milestone</option>
                  <option>Condition inspection - retainer client asset</option>
                  <option>Pre-purchase full inspection - feeds an assurance report</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Preferred window</label>
                <select className="form-select" id="insWindow">
                  <option>Next available</option>
                  <option>Within 72 hours</option>
                  <option>This week</option>
                  <option>Specific date - state in notes</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" style={{minHeight:'80px'}} placeholder="Anything the officer should look for, access arrangements, contact on site"></textarea></div>
              <div style={{background:'var(--cream)',borderRadius:'var(--radius-sm)',padding:'.9rem',fontSize:'10.5px',color:'var(--ink-muted)',lineHeight:'1.7'}}>By submitting you confirm you have read our <Link href="/privacy-notice" style={{color:'var(--forest)'}}>Privacy Notice</Link>. Inspection findings are issued to the requesting client only. Fees are confirmed in writing before an officer is dispatched. Coverage outside the FCT is subject to confirmation.</div>
              <button type="submit" className="form-submit" style={{width:'100%',justifyContent:'center'}}>Request Inspection →</button>
            </form>
            <div id="insDone" style={{display:'none',textAlign:'center',padding:'2rem 0'}}>
              <div style={{fontSize:'2.6rem',marginBottom:'.75rem'}}>✓</div>
              <h4 style={{marginBottom:'.5rem'}}>Request logged</h4>
              <p className="body-sm" style={{marginBottom:'1rem'}}>Your tracking reference is</p>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'1.3rem',color:'var(--forest)',background:'var(--cream)',padding:'.85rem',borderRadius:'var(--radius-sm)',letterSpacing:'.09em',marginBottom:'1.25rem'}} id="insRefOut">-</div>
              <p className="body-sm" style={{marginBottom:'1.25rem'}}>Acknowledgement within 4 business hours. Track progress at any time using this reference.</p>
              <button className="btn btn-primary">Track This Inspection →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── TRACK ─────────── */}
      <div className={tab === 'track' ? 'ins-panel active' : 'ins-panel'} id="ins-track">
        <div style={{maxWidth:'560px',marginBottom:'2rem'}}>
          <div className="eyebrow">Live Tracking</div>
          <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',marginBottom:'.5rem'}}>Track an inspection</h3>
          <p className="body-sm" style={{marginBottom:'1.25rem'}}>Enter your tracking reference. Status updates in real time as the officer progresses.</p>
          <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
            <input type="text" id="trkIn" placeholder="FDP-INS-XXXXXX" style={{flex:'1',minWidth:'220px',fontFamily:'var(--font-mono)',fontSize:'13px',padding:'12px 15px',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',outline:'none',textTransform:'uppercase'}}/>
            <button className="btn btn-primary">Track</button>
            <button className="btn btn-outline">Use demo reference</button>
          </div>
          <div id="trkErr" style={{display:'none',marginTop:'.75rem',fontSize:'12px',color:'var(--red)'}}>No inspection found against that reference. Check the reference, or contact us on 09049924198.</div>
        </div>

        <div id="trkOut" style={{display:'none'}}>
          <div className="grid-2" style={{gap:'2rem',alignItems:'start'}}>
            <div className="trk-shell">
              <div className="trk-head">
                <div>
                  <div style={{fontSize:'9.5px',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,168,76,.65)',marginBottom:'4px'}}>Tracking Reference</div>
                  <div className="trk-ref" id="trkRef">-</div>
                </div>
                <span className="trk-status" id="trkStat">-</span>
              </div>
              <div className="trk-body">
                <div style={{marginBottom:'1.5rem',paddingBottom:'1.25rem',borderBottom:'1px solid var(--border-light)'}}>
                  <div style={{fontSize:'10px',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-muted)',marginBottom:'5px'}}>Property</div>
                  <div style={{fontSize:'13.5px',color:'var(--ink)',fontWeight:'600'}} id="trkAddr">-</div>
                  <div style={{fontSize:'11.5px',color:'var(--ink-muted)',marginTop:'3px'}} id="trkScope">-</div>
                </div>
                <div className="pipe"><div className="pipe-f" id="pipeF" style={{height:'0'}}></div><div id="pipeSteps"></div></div>
              </div>
            </div>

            <div>
              <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem'}}>
                <h4 style={{fontSize:'.95rem',marginBottom:'.9rem'}}>Assigned Officer</h4>
                <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                  <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'var(--forest)',color:'var(--gold-light)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'1rem',flexShrink:'0'}} id="offInit">-</div>
                  <div>
                    <div style={{fontSize:'13px',fontWeight:'600',color:'var(--ink)'}} id="offName">-</div>
                    <div style={{fontSize:'11px',color:'var(--ink-muted)'}} id="offRole">-</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{padding:'1.5rem'}}>
                <h4 style={{fontSize:'.95rem',marginBottom:'.9rem'}}>Notifications</h4>
                <div id="notifFeed"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Inspection is where<br/><em>certainty begins.</em></h2><p>Every assurance engagement we issue rests on evidence a named officer captured on site. Book an inspection, or speak to an advisor about the full assurance report.</p><div className="cta-actions"><a href="#" className="btn btn-gold btn-lg">Request an Inspection</a><Link href="/contact" className="btn btn-ghost-white btn-lg">Speak to an Advisor</Link></div></div></div>
    </>
  );
}
