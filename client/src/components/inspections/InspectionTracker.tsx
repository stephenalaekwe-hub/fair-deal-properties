'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Stage {
  index: number;
  title: string;
  detail: string;
  state: 'complete' | 'active' | 'pending';
}

interface TrackResult {
  reference: string;
  demonstration?: boolean;
  stage: number;
  stageName: string;
  officer?: string;
  scheduledFor?: string;
  pipeline: Stage[];
  note?: string;
}

/**
 * Inspection tracker.
 *
 * The endpoint returns stage and timing only. Anyone holding a reference can call it,
 * so it never returns the requester's contact details - treating the reference as a
 * bearer credential for personal data would be a disclosure control failure.
 */
export default function InspectionTracker() {
  const params = useSearchParams();
  const [ref, setRef] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle');
  const [result, setResult] = useState<TrackResult | null>(null);
  const [message, setMessage] = useState('');

  const lookup = useCallback(async (reference: string) => {
    const value = reference.trim().toUpperCase();
    if (!value) return;
    setState('loading');
    setMessage('');
    try {
      const res = await fetch(`/api/inspections/${encodeURIComponent(value)}`);
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setMessage(json.error ?? 'No inspection is recorded against that reference.');
        setState('notfound');
        setResult(null);
        return;
      }
      setResult(json.data);
      setState('found');
    } catch {
      setMessage('We could not reach the server. Please try again.');
      setState('error');
    }
  }, []);

  // A tracking link issued in an acknowledgement opens straight onto the record.
  useEffect(() => {
    const q = params.get('ref');
    if (q) {
      setRef(q.toUpperCase());
      void lookup(q);
    }
  }, [params, lookup]);

  return (
    <div className="fdptrk-shell">
      <div className="fdptrk-input-row">
        <label htmlFor="trkIn" className="sr-only">Inspection reference</label>
        <input
          id="trkIn"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void lookup(ref); }}
          placeholder="FDP-INS-XXXXXX"
          className="fdptrk-input"
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn btn-primary" onClick={() => void lookup(ref)}
                disabled={state === 'loading'} type="button">
          {state === 'loading' ? 'Checking…' : 'Track'}
        </button>
        <button className="btn btn-outline" type="button"
                onClick={() => { setRef('FDP-INS-DEMO01'); void lookup('FDP-INS-DEMO01'); }}>
          See a worked example
        </button>
      </div>

      {(state === 'notfound' || state === 'error') && (
        <p className="fdptrk-msg" role="status">{message}</p>
      )}

      {state === 'found' && result && (
        <div className="fdptrk-result">
          <div className="fdptrk-head">
            <div>
              <div className="fdptrk-ref">{result.reference}</div>
              <div className="fdptrk-stage">{result.stageName}</div>
            </div>
            {result.officer && (
              <div className="fdptrk-officer">
                <div className="fdptrk-officer-l">Attending officer</div>
                <div className="fdptrk-officer-n">{result.officer}</div>
                {result.scheduledFor && (
                  <div className="fdptrk-officer-d">Scheduled {result.scheduledFor}</div>
                )}
              </div>
            )}
          </div>

          {result.demonstration && result.note && (
            <p className="fdptrk-note" role="note">{result.note}</p>
          )}

          <ol className="fdptrk-pipe">
            {result.pipeline.map((s) => (
              <li key={s.index} className={`fdptrk-step ${s.state}`}>
                <span className="fdptrk-step-n">{String(s.index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="fdptrk-step-t">{s.title}</div>
                  <div className="fdptrk-step-d">{s.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
