'use client';

import Link from 'next/link';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { walkthroughs } from '@/data/walkthroughs';
import { fetchApi } from '@/lib/api';
import ImageUpload, { parseImageUrls } from '@/components/ImageUpload';
import { sanitizePhone, isValidPhone, sanitizeName } from '@/lib/validation';
import { inspectionPipeline } from '@/data/pipeline';

const DEFAULT_STAGE_NOTES: Record<number, string> = {
  1: 'Inspection instruction, scope, and engagement fee verified and logged.',
  2: 'Title documents examined and cadastral registry records cross-checked.',
  3: 'Registered field surveyor allocated and cadastral coordinates verified.',
  4: 'Field inspection mobilised; site access protocol and inspection window confirmed.',
  5: 'On-site physical examination conducted; boundary beacons and site condition verified.',
  6: 'Structural appraisal, valuation assessment, and physical snagging completed.',
  7: 'Legal & compliance clearance verified against FCT / State planning authority records.',
  8: 'Comprehensive inspection dossier, survey evidence, and photographs compiled.',
  9: 'Final assurance dossier issued and client debrief completed.',
};

function cleanNoteText(raw?: string | null): string {
  if (!raw) return '';
  const s = String(raw)
    .replace(/Attached Survey \/ Site Photograph:\s*[^\n\r]+/gi, '')
    .replace(/Officer Outcome:\s*/gi, '')
    .replace(/Scope:\s*[^\n\r]*?Window:\s*[^\n\r.]*\.?\s*/gi, '')
    .replace(/^Scope:\s*[^\n\r]+(\r?\n)?/gim, '')
    .replace(/^Window:\s*[^\n\r]+(\r?\n)?/gim, '')
    .replace(/\bNotes:\s*/gi, '')
    .trim();

  const parts = s
    .split(/\s+—\s+|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const p of parts) {
    if (!unique.some((u) => u.toLowerCase() === p.toLowerCase())) {
      unique.push(p);
    }
  }
  return unique.join(' — ');
}

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

/** Format timestamp without seconds using 12-hour AM/PM format (e.g. 8:44 AM). */
function formatSyncTime(dateVal?: string | Date | null): string {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

/** Extract the actual user or officer-typed note, stripping boilerplate scope prefixes or generic status placeholders. */
function extractActualNote(notes?: string | null, outcome?: string | null): string {
  const parsedNotes = cleanNoteText(notes);
  const cleanOutcome = cleanNoteText(outcome);

  const isGenericNotes = !parsedNotes || /^(checked|done|completed|resolved|closed|ok|yes)$/i.test(parsedNotes);
  const isGenericOutcome = !cleanOutcome || /^(checked|done|completed|resolved|closed|ok|yes)$/i.test(cleanOutcome);

  if (!isGenericNotes) return parsedNotes;
  if (!isGenericOutcome) return cleanOutcome;
  return '';
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
  const [insSubmitting, setInsSubmitting] = useState(false);
  const [insRef, setInsRef] = useState('');
  const [insError, setInsError] = useState('');
  const [sitePhotoUrl, setSitePhotoUrl] = useState('');

  const initialFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addr: '',
    loc: 'Abuja FCT - within city',
    scope: 'Standard site inspection - evidence capture and checklist',
    window: 'Next available',
    preferredDate: '',
    notes: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore draft from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fdp_inspection_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.formValues) {
          setFormValues((prev) => ({ ...prev, ...parsed.formValues }));
        }
        if (parsed.sitePhotoUrl) {
          setSitePhotoUrl(parsed.sitePhotoUrl);
        }
        if (parsed.tab) {
          setTab(parsed.tab);
        }
        const hasContent = (parsed.formValues && Object.values(parsed.formValues).some((v: any) => typeof v === 'string' && v.trim() !== '')) || Boolean(parsed.sitePhotoUrl);
        if (hasContent) {
          setDraftRestored(true);
        }
      }
    } catch {
      // ignore JSON error
    }

    // Auto-track if ?ref=... is in the URL query string
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlRef = params.get('ref');
        if (urlRef) {
          setTab('track');
          setTrackRefInput(urlRef);
          void handleTrackLookup(urlRef);
        }
      }
    } catch {}
  }, []);

  // Auto-save form draft whenever values change
  useEffect(() => {
    try {
      const hasContent = Object.values(formValues).some((v) => v.trim() !== '') || Boolean(sitePhotoUrl);
      if (hasContent) {
        sessionStorage.setItem(
          'fdp_inspection_draft',
          JSON.stringify({
            formValues,
            sitePhotoUrl,
            tab: tab === 'physical' ? 'physical' : tab,
          })
        );
      }
    } catch {
      // ignore storage error
    }
  }, [formValues, sitePhotoUrl, tab]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'phone') {
      val = sanitizePhone(value);
    } else if (name === 'firstName' || name === 'lastName') {
      val = sanitizeName(value);
    }
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  const clearInspectionDraft = () => {
    try {
      sessionStorage.removeItem('fdp_inspection_draft');
    } catch {}
    setFormValues(initialFormValues);
    setSitePhotoUrl('');
    setDraftRestored(false);
  };

  const handleInspectionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInsSubmitting(true);
    setInsError('');

    const first = formValues.firstName.trim();
    const last = formValues.lastName.trim();

    if (!first || first.length < 2) {
      setInsError('Please enter a valid first name (at least 2 letters).');
      setInsSubmitting(false);
      return;
    }
    if (!last || last.length < 2) {
      setInsError('Please enter a valid last name (at least 2 letters).');
      setInsSubmitting(false);
      return;
    }
    if (!isValidPhone(formValues.phone.trim())) {
      setInsError('Phone / WhatsApp must contain numbers only (7 to 16 digits, e.g. 08012345678 or +2348012345678).');
      setInsSubmitting(false);
      return;
    }

    const clientName = `${first} ${last}`.trim() || 'Prospective Client';
    const clientEmail = formValues.email.trim();
    const clientPhone = formValues.phone.trim();
    const propertyTitle = formValues.addr.trim();
    const propertyLocation = formValues.loc.trim();
    const scope = formValues.scope.trim();
    const preferredDate = formValues.preferredDate || formValues.window.trim();
    const notes = formValues.notes.trim();

    try {
      const res = await fetchApi('/inspections/request', {
        method: 'POST',
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          propertyTitle,
          propertyLocation,
          preferredDate,
          sitePhotoUrl,
          reportUrl: sitePhotoUrl,
          notes: [
            `Scope: ${scope}. Window: ${preferredDate}.`,
            notes ? `Notes: ${notes}` : null,
          ].filter(Boolean).join('\n'),
        }),
      });

      if (res && res.ok && res.data) {
        const ref = res.data.reference;
        setInsRef(ref);
        const refEl = document.getElementById('insRefOut');
        if (refEl) refEl.textContent = ref;
        const formEl = document.getElementById('insForm');
        if (formEl) formEl.style.display = 'none';
        const doneEl = document.getElementById('insDone');
        if (doneEl) doneEl.style.display = 'block';

        // Clear stored draft upon successful submission
        clearInspectionDraft();
      } else {
        setInsError(res?.error || 'Failed to submit inspection request.');
      }
    } catch (err) {
      console.error('Inspection submit error:', err);
      setInsError('Network error. Please try again.');
    } finally {
      setInsSubmitting(false);
    }
  };

  const [copiedInsRef, setCopiedInsRef] = useState(false);

  const handleCopyInsRef = async () => {
    const refToCopy = insRef || document.getElementById('insRefOut')?.textContent || '';
    if (!refToCopy || refToCopy === '-') return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(refToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = refToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedInsRef(true);
      setTimeout(() => setCopiedInsRef(false), 2500);
    } catch (err) {
      console.warn('Could not copy inspection reference:', err);
    }
  };

  const [trackRefInput, setTrackRefInput] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [lightboxState, setLightboxState] = useState<{
    photos: string[];
    index: number;
    title?: string;
  } | null>(null);
  const [trackData, setTrackData] = useState<{
    reference: string;
    propertyTitle: string;
    propertyLocation: string;
    stage: number;
    stageTitle: string;
    stageDescription: string;
    officerName: string | null;
    scheduledDate: string | null;
    updatedAt: string;
    isCompleted?: boolean;
    currentStepDone?: boolean;
    officerMessage?: string | null;
    reportUrl?: string;
    photos?: string[];
    stageHistory?: Record<string, { stage: number; note: string; photos: string[]; officerName?: string; updatedAt?: string }>;
    pipeline?: Array<{
      index: number;
      stage?: number;
      title: string;
      detail: string;
      state: string;
      note?: string | null;
      photos?: string[];
      officerName?: string;
    }>;
  } | null>(null);

  const handleTrackLookup = async (lookupRef?: string) => {
    const refToTrack = (lookupRef || trackRefInput).trim().toUpperCase();
    if (!refToTrack) {
      setTrackError('Please enter an inspection tracking reference.');
      setTrackData(null);
      return;
    }
    setTrackLoading(true);
    setTrackError('');
    try {
      const res = await fetchApi<any>(`/inspections/${encodeURIComponent(refToTrack)}`);

      if (res && res.ok && res.data) {
        const actualNote = extractActualNote(res.data.note, res.data.officerMessage || res.data.outcome);
        const photos = Array.isArray(res.data.photos) && res.data.photos.length > 0
          ? res.data.photos
          : parseImageUrls(res.data.reportUrl);
        setTrackData({
          reference: res.data.reference,
          propertyTitle: res.data.propertyTitle || 'Subject Property',
          propertyLocation: res.data.propertyLocation || 'Abuja FCT',
          stage: res.data.stage || 1,
          stageTitle: res.data.stageTitle || res.data.stageName || `Stage ${res.data.stage || 1}`,
          stageDescription: res.data.stageDescription || '',
          officerName: res.data.officerName || res.data.officer || null,
          scheduledDate: res.data.scheduledDate || res.data.scheduledFor || null,
          updatedAt: res.data.updatedAt || new Date().toISOString(),
          isCompleted: Boolean(res.data.isCompleted),
          currentStepDone: Boolean(res.data.currentStepDone),
          officerMessage: actualNote || null,
          reportUrl: res.data.reportUrl || '',
          photos,
          stageHistory: res.data.stageHistory || {},
          pipeline: Array.isArray(res.data.pipeline) ? res.data.pipeline : undefined,
        });
      } else if (refToTrack === 'FDP-INS-DEMO01') {
        setTrackData({
          reference: 'FDP-INS-DEMO01',
          propertyTitle: 'Plot 42, Hutu Exclusive Phase III, Airport Road',
          propertyLocation: 'Abuja FCT - within city',
          stage: 6,
          stageTitle: 'Valuation & Cost-to-Complete',
          stageDescription: 'On-site coordinates being reconciled with AGIS cadastral map.',
          officerName: 'Emeka Nwachukwu (NIS Registered)',
          scheduledDate: '2026-10-18',
          updatedAt: new Date().toISOString(),
          officerMessage: 'Foundation and perimeter beacons verified against AGIS coordinates.',
          photos: [],
          stageHistory: {},
        });
      } else if (refToTrack === 'FDP-INS-890214') {
        setTrackData({
          reference: 'FDP-INS-890214',
          propertyTitle: 'Plot 42, Hutu Exclusive Phase III, Airport Road',
          propertyLocation: 'Abuja FCT - Airport Road Corridor',
          stage: 4,
          stageTitle: 'Physical Inspection Mobilised',
          stageDescription: 'Field surveyor on transit to site for physical inspection and boundary walk.',
          officerName: 'Emeka Nwosu (Senior Surveyor)',
          scheduledDate: '2026-11-12',
          updatedAt: new Date().toISOString(),
          officerMessage: 'Field surveyor mobilised with access clearance.',
          photos: [],
          stageHistory: {},
        });
      } else {
        setTrackError(res?.error || 'No inspection found against that reference. Check the reference or contact the firm.');
        setTrackData(null);
      }
    } catch (err) {
      console.error('Track lookup error:', err);
      setTrackError('Could not reach the server to track inspection.');
      setTrackData(null);
    } finally {
      setTrackLoading(false);
    }
  };
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
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Photographs from a minimum of four aspects (high-resolution geotagged still photography only; video files are not accepted)</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Infrastructure, access, occupancy and encroachment recorded</li>
              <li className="aud-feature"><svg style={{width:'15px',height:'15px',flexShrink:'0',stroke:'var(--success)',fill:'none',strokeWidth:'2',marginTop:'2px'}} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Every discrepancy against documentation described and photographed</li>
            </ul>

            <div style={{background:'var(--forest)',borderRadius:'var(--radius-md)',padding:'1.5rem'}}>
              <div style={{fontSize:'10px',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(201,168,76,.7)',marginBottom:'.5rem'}}>Standard turnaround</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.35rem',color:'#fff'}}>Prompt</div><div style={{fontSize:'10.5px',color:'rgba(255,255,255,.5)'}}>Acknowledgement and scheduling</div></div>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:'1.35rem',color:'var(--gold-light)'}}>72 hrs</div><div style={{fontSize:'10.5px',color:'rgba(255,255,255,.5)'}}>FCT inspection completed</div></div>
              </div>
            </div>
          </div>

          <div className="card" style={{padding:'2rem'}}>
            <h4 style={{marginBottom:'1.25rem'}}>Request an Inspection</h4>
            <form id="insForm" onSubmit={handleInspectionSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {draftRestored && (
                <div style={{
                  background: 'rgba(201,168,76,.12)',
                  border: '1px solid var(--gold)',
                  borderRadius: '6px',
                  padding: '9px 13px',
                  fontSize: '12px',
                  color: 'var(--forest)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>✓ <strong>Draft Restored:</strong> Your previously entered details have been preserved.</span>
                  <button
                    type="button"
                    onClick={clearInspectionDraft}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b91c1c',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      fontWeight: 600,
                    }}
                  >
                    Clear draft
                  </button>
                </div>
              )}
              {insError && (
                <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#991b1b',borderRadius:'6px',padding:'10px 14px',fontSize:'12px'}}>
                  ⚠️ {insError}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    required={true}
                    placeholder="Adebayo"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    required={true}
                    placeholder="Okonkwo"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  required={true}
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp * (numbers only)</label>
                <input
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  pattern="^\+?[0-9]{7,16}$"
                  maxLength={16}
                  className="form-input"
                  required={true}
                  placeholder="08012345678 or +2348012345678"
                  value={formValues.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Property address or plot reference *</label>
                <input
                  type="text"
                  name="addr"
                  className="form-input"
                  id="insAddr"
                  required={true}
                  placeholder="e.g. Plot 42, Hutu Exclusive, Airport Road, Abuja"
                  value={formValues.addr}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <select className="form-select" name="loc" id="insLoc" value={formValues.loc} onChange={handleInputChange}>
                  <option>Abuja FCT - within city</option>
                  <option>Abuja FCT - Area Council</option>
                  <option>Nasarawa / Suburban corridor</option>
                  <option>Lagos</option>
                  <option>Port Harcourt</option>
                  <option>Other - we will confirm coverage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Inspection scope</label>
                <select className="form-select" name="scope" id="insScope" value={formValues.scope} onChange={handleInputChange}>
                  <option>Standard site inspection - evidence capture and checklist</option>
                  <option>Boundary and beacon verification against survey plan</option>
                  <option>Construction progress inspection - off-plan milestone</option>
                  <option>Condition inspection - retainer client asset</option>
                  <option>Pre-purchase full inspection - feeds an assurance report</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Inspection Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  min={new Date().toISOString().split('T')[0]}
                  required={true}
                  className="form-input"
                  value={formValues.preferredDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred window / Timing</label>
                <select className="form-select" name="window" id="insWindow" value={formValues.window} onChange={handleInputChange}>
                  <option>Morning (9am - 12pm)</option>
                  <option>Afternoon (1pm - 4pm)</option>
                  <option>Next available</option>
                  <option>Within 72 hours</option>
                  <option>This week</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  style={{minHeight:'80px'}}
                  placeholder="Anything the officer should look for, access arrangements, contact on site"
                  value={formValues.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <ImageUpload
                  label="Site / Survey Plan Photograph (Optional - Pictures Only)"
                  helperText="Upload a clear photograph of the site, beacons, or layout plan (PNG, JPG, WEBP). Videos are strictly prohibited."
                  value={sitePhotoUrl}
                  onChange={setSitePhotoUrl}
                />
              </div>
              <div style={{background:'var(--cream)',borderRadius:'var(--radius-sm)',padding:'.9rem',fontSize:'10.5px',color:'var(--ink-muted)',lineHeight:'1.7'}}>
                By submitting you confirm you have read our{' '}
                <Link
                  href="/privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color:'var(--forest)',textDecoration:'underline',fontWeight:600}}
                >
                  Privacy Notice ↗
                </Link>{' '}
                (opens safely in a new tab without interrupting your form). Inspection findings are issued to the requesting client only. Fees are confirmed in writing before an officer is dispatched. Coverage outside the FCT is subject to confirmation.
              </div>
              <button type="submit" disabled={insSubmitting} className="form-submit" style={{width:'100%',justifyContent:'center',opacity:insSubmitting?0.7:1}}>
                {insSubmitting ? 'Logging Inspection Request…' : 'Request Inspection →'}
              </button>
            </form>
            <div id="insDone" style={{display:'none',textAlign:'center',padding:'2rem 0'}}>
              <div style={{fontSize:'2.6rem',marginBottom:'.75rem',color:'var(--forest)'}}>✓</div>
              <h4 style={{marginBottom:'.5rem'}}>Inspection Request Logged</h4>

              {/* Explicit instruction telling the user to copy their reference code */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                color: '#065f46',
                fontSize: '12.5px',
                fontWeight: 600,
                maxWidth: '430px',
                margin: '0 auto 1.25rem auto',
                lineHeight: 1.5,
              }}>
                📌 <strong>Please copy your tracking reference below:</strong> Save this code to track officer dispatch and verification milestones.
              </div>

              <div style={{
                background:'var(--cream)',
                border:'1px solid var(--border-light)',
                borderRadius:'var(--radius-sm)',
                padding:'.85rem 1.25rem',
                display:'inline-flex',
                alignItems:'center',
                justifyContent:'center',
                gap:'.75rem',
                marginBottom:'1.25rem',
                flexWrap:'wrap',
              }}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'1.25rem',color:'var(--forest)',fontWeight:700,letterSpacing:'.09em'}} id="insRefOut">-</div>
                <button
                  type="button"
                  onClick={handleCopyInsRef}
                  style={{
                    background: copiedInsRef ? 'var(--forest)' : '#ffffff',
                    color: copiedInsRef ? '#ffffff' : 'var(--forest)',
                    border: '1px solid var(--forest)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Copy tracking reference"
                >
                  {copiedInsRef ? '✓ Copied!' : '📋 Copy Code'}
                </button>
              </div>

              <p className="body-sm" style={{marginBottom:'1.25rem'}}>Prompt acknowledgement & officer dispatch. Track progress at any time using this reference.</p>
              <button
                onClick={() => {
                  setTab('track');
                  setTrackRefInput(insRef);
                  void handleTrackLookup(insRef);
                }}
                className="btn btn-primary"
              >
                Track This Inspection →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── TRACK ─────────── */}
      <div className={tab === 'track' ? 'ins-panel active' : 'ins-panel'} id="ins-track">
        <div style={{maxWidth:'560px',marginBottom:'2rem'}}>
          <div className="eyebrow">Live Tracking</div>
          <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.6rem',marginBottom:'.5rem'}}>Track an inspection</h3>
          <p className="body-sm" style={{marginBottom:'1.25rem'}}>Enter your tracking reference. Status updates in real time as the officer progresses through our 9-stage verification protocol.</p>
          <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap'}}>
            <input
              type="text"
              id="trkIn"
              value={trackRefInput}
              onChange={(e) => setTrackRefInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void handleTrackLookup(); }}
              placeholder="FDP-INS-XXXXXX"
              style={{flex:'1',minWidth:'220px',fontFamily:'var(--font-mono)',fontSize:'13px',padding:'12px 15px',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',outline:'none',textTransform:'uppercase'}}
            />
            <button
              className="btn btn-primary"
              type="button"
              disabled={trackLoading}
              onClick={() => void handleTrackLookup()}
            >
              {trackLoading ? 'Tracking…' : 'Track'}
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setTrackRefInput('FDP-INS-DEMO01');
                void handleTrackLookup('FDP-INS-DEMO01');
              }}
            >
              Use demo reference
            </button>
          </div>
          {trackError && (
            <div id="trkErr" style={{display:'block',marginTop:'.75rem',fontSize:'12px',color:'var(--red)'}}>
              ⚠️ {trackError}
            </div>
          )}
        </div>

        {trackData && (
          <div id="trkOut" style={{display:'block'}}>
            <div className="grid-2" style={{gap:'2rem',alignItems:'start'}}>
              <div className="trk-shell">
                <div className="trk-head">
                  <div>
                    <div style={{fontSize:'9.5px',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,168,76,.65)',marginBottom:'4px'}}>Tracking Reference</div>
                    <div className="trk-ref" id="trkRef">{trackData.reference}</div>
                  </div>
                  <span
                    className="trk-status"
                    id="trkStat"
                    style={trackData.stage >= 9 ? {
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #86efac',
                      fontWeight: 700,
                    } : trackData.currentStepDone ? {
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0',
                      fontWeight: 600,
                    } : undefined}
                  >
                    {trackData.stage >= 9
                      ? '✓ Fully Completed & Dossier Issued'
                      : (trackData.currentStepDone
                          ? `Stage ${trackData.stage} Complete (Awaiting Stage ${trackData.stage + 1})`
                          : `Stage ${trackData.stage}: ${trackData.stageTitle}`)}
                  </span>
                </div>
                <div className="trk-body">
                  <div style={{marginBottom:'1.5rem',paddingBottom:'1.25rem',borderBottom:'1px solid var(--border-light)'}}>
                    <div style={{fontSize:'10px',letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-muted)',marginBottom:'5px'}}>Property Target</div>
                    <div style={{fontSize:'13.5px',color:'var(--ink)',fontWeight:'600'}} id="trkAddr">{trackData.propertyTitle}</div>
                    <div style={{fontSize:'11.5px',color:'var(--ink-muted)',marginTop:'3px'}} id="trkScope">
                      {trackData.propertyLocation} {trackData.scheduledDate ? `· Scheduled: ${new Date(trackData.scheduledDate).toLocaleDateString('en-GB')}` : ''}
                    </div>
                  </div>
                  <div className="pipe">
                    <div
                      className="pipe-f"
                      id="pipeF"
                      style={{
                        height: trackData.stage >= 9
                          ? '100%'
                          : `${Math.max(0, Math.min(100, (((trackData.stage - 1) + (trackData.currentStepDone ? 1 : 0.4)) / 8) * 100))}%`,
                        transition: 'height 0.6s ease',
                      }}
                    />
                    <div id="pipeSteps">
                      {inspectionPipeline.map((p, i) => {
                        const stageNum = i + 1;
                        const isPastStep = i < trackData.stage - 1;
                        const isCurrentStep = i === trackData.stage - 1;
                        const isDone = isPastStep || (isCurrentStep && Boolean(trackData.currentStepDone || trackData.stage >= 9));
                        const isNow = isCurrentStep && !isDone;
                        const cls = isDone ? 'pstep done' : isNow ? 'pstep now' : 'pstep';

                        const histEntry = trackData.stageHistory?.[String(stageNum)];
                        const pipeEntry = trackData.pipeline?.[i];
                        const candidateNote = cleanNoteText(
                          histEntry?.note ||
                            pipeEntry?.note ||
                            (isCurrentStep ? trackData.officerMessage : '')
                        );

                        // Ensure past stages never repeat the current stage's or a later stage's note
                        let isDuplicatedLater = false;
                        if (isPastStep && candidateNote) {
                          const normCand = candidateNote.toLowerCase();
                          const curMsg = cleanNoteText(trackData.officerMessage).toLowerCase();
                          if (curMsg && normCand === curMsg && trackData.stage > stageNum) {
                            isDuplicatedLater = true;
                          } else {
                            for (let later = stageNum + 1; later <= trackData.stage; later++) {
                              const laterNote = cleanNoteText(
                                trackData.stageHistory?.[String(later)]?.note ||
                                  trackData.pipeline?.[later - 1]?.note
                              ).toLowerCase();
                              if (laterNote && laterNote === normCand) {
                                isDuplicatedLater = true;
                                break;
                              }
                            }
                          }
                        }

                        const stageNote =
                          !isDuplicatedLater && candidateNote
                            ? candidateNote
                            : isDone || isNow
                              ? DEFAULT_STAGE_NOTES[stageNum]
                              : '';

                        const stagePhotos: string[] =
                          Array.isArray(histEntry?.photos) && histEntry.photos.length > 0
                            ? histEntry.photos
                            : Array.isArray(pipeEntry?.photos) && pipeEntry.photos.length > 0
                              ? pipeEntry.photos
                              : isCurrentStep && Array.isArray(trackData.photos) && trackData.photos.length > 0
                                ? trackData.photos
                                : [];

                        return (
                          <div key={p.t} className={cls}>
                            <div className="pdot">{isDone ? '✓' : isNow ? '●' : stageNum}</div>
                            <div className="pttl">{p.t}</div>
                            <div className="pdesc">{p.d}</div>
                            {isDone && (
                              <div className="pstamp" style={{fontSize:'10.5px',color:'var(--forest)',fontWeight:600,marginTop:'3px'}}>
                                ✓ Completed
                              </div>
                            )}
                            {isNow && (
                              <div className="pstamp" style={{fontSize:'10.5px',color:'var(--gold-dark)',fontWeight:600,marginTop:'3px'}}>
                                ● In Progress
                              </div>
                            )}
                            {(isDone || isNow) && stageNote && (
                              <div
                                style={{
                                  marginTop: '6px',
                                  padding: '6px 10px',
                                  background: isDone ? '#f0fdf4' : '#fffbeb',
                                  border: isDone ? '1px solid #bbf7d0' : '1px solid #fde68a',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  color: '#1e293b',
                                  lineHeight: '1.45',
                                }}
                              >
                                <span style={{ fontWeight: 700, color: isDone ? 'var(--forest)' : '#b45309' }}>
                                  Stage {stageNum} Note:{' '}
                                </span>
                                <span>{stageNote}</span>
                              </div>
                            )}
                            {(isDone || isNow) && (
                              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                {stagePhotos.length > 0 ? (
                                  <>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      {stagePhotos.slice(0, 3).map((photoUrl, pIdx) => (
                                        <button
                                          key={`${stageNum}-ph-${pIdx}`}
                                          type="button"
                                          onClick={() =>
                                            setLightboxState({
                                              photos: stagePhotos,
                                              index: pIdx,
                                              title: `Stage ${stageNum}: ${p.t}`,
                                            })
                                          }
                                          style={{
                                            padding: 0,
                                            border: '1px solid #86efac',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                            width: '40px',
                                            height: '40px',
                                            cursor: 'pointer',
                                            background: '#fff',
                                          }}
                                          title="Click to view full-size photograph"
                                        >
                                          <img
                                            src={photoUrl}
                                            alt={`Stage ${stageNum} photo ${pIdx + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setLightboxState({
                                          photos: stagePhotos,
                                          index: 0,
                                          title: `Stage ${stageNum}: ${p.t}`,
                                        })
                                      }
                                      style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        background: 'var(--forest)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                      }}
                                    >
                                      <span>🖼️</span>
                                      <span>
                                        View {stagePhotos.length === 1 ? 'Photograph' : `${stagePhotos.length} Photographs`}
                                      </span>
                                    </button>
                                  </>
                                ) : isCurrentStep ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setLightboxState({
                                        photos: trackData.photos || [],
                                        index: 0,
                                        title: `Stage ${stageNum}: ${p.t} — Site Photographs`,
                                      })
                                    }
                                    style={{
                                      padding: '3px 9px',
                                      fontSize: '10.5px',
                                      fontWeight: 600,
                                      background: '#f8fafc',
                                      color: '#475569',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    <span>📷</span>
                                    <span>View Stage Pictures</span>
                                  </button>
                                ) : null}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem'}}>
                  <h4 style={{fontSize:'.95rem',marginBottom:'.9rem'}}>Assigned Officer</h4>
                  <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                    <div
                      style={{
                        width:'44px',
                        height:'44px',
                        borderRadius:'50%',
                        background:'var(--forest)',
                        color:'var(--gold-light)',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        fontFamily:'var(--font-display)',
                        fontSize:'1rem',
                        fontWeight:'600',
                        flexShrink:'0',
                      }}
                      id="offInit"
                    >
                      {trackData.officerName
                        ? trackData.officerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                        : trackData.stage >= 3 ? 'FS' : '-'}
                    </div>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:'600',color:'var(--ink)'}} id="offName">
                        {trackData.officerName || (trackData.stage >= 3 ? 'Assigned Field Surveyor' : 'Pending allocation')}
                      </div>
                      <div style={{fontSize:'11px',color:'var(--ink-muted)'}} id="offRole">
                        {trackData.officerName ? 'Field Verification & Survey Officer' : trackData.stage >= 3 ? 'Site Surveyor' : 'Assigned at Stage 3'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem'}}>
                  <h4 style={{fontSize:'.95rem',marginBottom:'.9rem'}}>Recent Audit Updates</h4>
                  <div id="notifFeed" style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                    <div style={{fontSize:'12px',padding:'.5rem .75rem',background:'var(--cream)',borderRadius:'var(--radius-sm)',lineHeight:'1.5'}}>
                      <div style={{fontWeight:'600',color:'var(--forest)'}}>
                        {trackData.stage >= 9
                          ? '✓ Final Dossier Issued & Debrief Delivered'
                          : (trackData.currentStepDone
                              ? `✓ Stage ${trackData.stage}: ${trackData.stageTitle} Completed by Field Officer`
                              : `Stage ${trackData.stage} in Progress`)}
                      </div>
                      <div style={{fontSize:'11px',color:'var(--ink-muted)',marginTop:'2px'}}>
                        {trackData.stageTitle}
                        {trackData.currentStepDone && trackData.stage < 9 ? ' · Awaiting Admin to Advance to Next Stage' : ''}
                      </div>
                    </div>

                    {trackData.officerMessage && (
                      <div style={{fontSize:'12px',padding:'.75rem',background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'var(--radius-sm)',lineHeight:'1.5'}}>
                        <div style={{fontSize:'10.5px',fontWeight:700,color:'var(--forest)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'4px'}}>
                          Field Officer Debrief & Findings
                        </div>
                        <div style={{color:'#1e293b',fontSize:'12px',fontWeight:500}}>
                          "{trackData.officerMessage}"
                        </div>
                      </div>
                    )}

                    {trackData.updatedAt && (
                      <div style={{fontSize:'10.5px',color:'var(--ink-muted)',textAlign:'right'}}>
                        Last synchronized: {formatSyncTime(trackData.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Site Inspection Photographs & Evidence Provision */}
                {(() => {
                  const collectedPhotos: string[] = [];
                  if (Array.isArray(trackData.photos)) {
                    for (const u of trackData.photos) {
                      if (u && !collectedPhotos.includes(u)) collectedPhotos.push(u);
                    }
                  }
                  if (trackData.stageHistory) {
                    for (const entry of Object.values(trackData.stageHistory)) {
                      if (entry && Array.isArray(entry.photos)) {
                        for (const u of entry.photos) {
                          if (u && !collectedPhotos.includes(u)) collectedPhotos.push(u);
                        }
                      }
                    }
                  }

                  return (
                    <div className="card" id="photoDossierCard" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.9rem', gap: '8px' }}>
                        <h4 style={{ fontSize: '.95rem', margin: 0 }}>Site Inspection Photographs</h4>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: collectedPhotos.length > 0 ? '#dcfce7' : '#f1f5f9',
                            color: collectedPhotos.length > 0 ? '#15803d' : '#64748b',
                          }}
                        >
                          {collectedPhotos.length} {collectedPhotos.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>

                      {collectedPhotos.length > 0 ? (
                        <div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
                              gap: '10px',
                              marginBottom: '12px',
                            }}
                          >
                            {collectedPhotos.map((url, idx) => (
                              <button
                                key={`dossier-ph-${idx}`}
                                type="button"
                                onClick={() =>
                                  setLightboxState({
                                    photos: collectedPhotos,
                                    index: idx,
                                    title: `${trackData.reference} — Site Evidence Photograph #${idx + 1}`,
                                  })
                                }
                                style={{
                                  padding: 0,
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  aspectRatio: '1 / 1',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  background: '#f8fafc',
                                }}
                                title={`Click to view Photograph #${idx + 1}`}
                              >
                                <img
                                  src={url}
                                  alt={`Site evidence ${idx + 1}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxState({
                                photos: collectedPhotos,
                                index: 0,
                                title: `${trackData.reference} — Site Inspection Photographs`,
                              })
                            }
                            style={{
                              width: '100%',
                              padding: '9px 14px',
                              background: 'var(--forest)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>🖼️</span>
                            <span>
                              View {collectedPhotos.length === 1 ? 'Site Photograph' : `All ${collectedPhotos.length} Site Photographs`}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '14px',
                            background: '#f8fafc',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '6px' }}>📷</div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                            No photographs attached to this inspection yet
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.45', marginBottom: '10px' }}>
                            When the field officer uploads site photographs, boundary beacon evidence, or survey plans at any stage, they will be available here for full-screen viewing.
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxState({
                                photos: [],
                                index: 0,
                                title: `${trackData.reference} — Site Inspection Photo Viewer`,
                              })
                            }
                            style={{
                              padding: '7px 14px',
                              background: '#ffffff',
                              color: 'var(--forest)',
                              border: '1px solid var(--forest)',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>🖼️</span>
                            <span>Open Photo Evidence Viewer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal for Viewing Inspection Photographs */}
      {lightboxState && (
        <div
          onClick={() => setLightboxState(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--forest)',
                color: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                  {lightboxState.title || 'Site Inspection Photograph Viewer'}
                </div>
                {lightboxState.photos.length > 0 && (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                    Photograph {lightboxState.index + 1} of {lightboxState.photos.length}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxState(null)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                minHeight: '320px',
              }}
            >
              {lightboxState.photos.length > 0 ? (
                <>
                  <img
                    src={lightboxState.photos[lightboxState.index]}
                    alt={`Inspection evidence ${lightboxState.index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '62vh',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      background: '#ffffff',
                    }}
                  />
                  {lightboxState.photos.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
                                }
                              : null
                          )
                        }
                        style={{
                          padding: '6px 14px',
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ← Previous
                      </button>
                      <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600 }}>
                        {lightboxState.index + 1} / {lightboxState.photos.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  index: (prev.index + 1) % prev.photos.length,
                                }
                              : null
                          )
                        }
                        style={{
                          padding: '6px 14px',
                          background: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#e2e8f0', padding: '30px 20px', maxWidth: '440px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>📷</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                    No Site Photographs Uploaded Yet
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.55' }}>
                    The inspecting field officer has not attached photographs for this stage yet. Once site photos or survey plans are uploaded from the Field Agent or Admin portal, you can view and inspect them right here.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  </section>

  <div className="cta-band"><div className="cta-band-glow"></div><div className="container cta-band-content"><h2>Inspection is where<br/><em>certainty begins.</em></h2><p>Every assurance engagement we issue rests on evidence a named officer captured on site. Book an inspection, or speak to an advisor about the full assurance report.</p><div className="cta-actions"><a href="#" className="btn btn-gold btn-lg">Request an Inspection</a><Link href="/contact" className="btn btn-ghost-white btn-lg">Speak to an Advisor</Link></div></div></div>
    </>
  );
}
