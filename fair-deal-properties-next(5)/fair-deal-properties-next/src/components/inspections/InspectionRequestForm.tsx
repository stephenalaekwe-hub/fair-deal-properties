'use client';

import Link from 'next/link';
import { useState } from 'react';

const SCOPES = [
  { id: 'standard', label: 'Standard site attendance and condition record' },
  { id: 'boundary', label: 'Boundary and beacon verification' },
  { id: 'structural', label: 'Structural condition observation' },
  { id: 'progress', label: 'Construction progress against programme' },
  { id: 'handover', label: 'Pre-handover snagging' },
];

export default function InspectionRequestForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ reference: string; stageName: string } | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          propertyReference: String(fd.get('propertyReference') ?? ''),
          address: fd.get('address') ? String(fd.get('address')) : undefined,
          location: String(fd.get('location') ?? ''),
          scope: String(fd.get('scope') ?? 'standard'),
          preferredDate: fd.get('preferredDate') ? String(fd.get('preferredDate')) : undefined,
          notes: fd.get('notes') ? String(fd.get('notes')) : undefined,
          consent: fd.get('consent') === 'on',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your request could not be submitted. Please try again.');
        setFieldErrors(json.fieldErrors ?? {});
        setState('error');
        return;
      }
      setResult({ reference: json.data.reference, stageName: json.data.stageName });
      setState('done');
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
      setState('error');
    }
  }

  if (state === 'done' && result) {
    return (
      <div className="form-success" style={{ display: 'block' }}>
        <h4>Inspection request logged</h4>
        <p className="body-sm">
          Your reference is <strong>{result.reference}</strong>, currently at stage
          {' '}<strong>{result.stageName}</strong>. Scope and fee will be confirmed in writing before
          any officer is assigned. Track progress using this reference in the tracker on this page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="ins-name">Full name</label>
          <input id="ins-name" name="name" type="text" required minLength={2} autoComplete="name" />
        </div>
        <div className="form-row">
          <label htmlFor="ins-email">Email</label>
          <input id="ins-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="form-row">
          <label htmlFor="ins-phone">Phone</label>
          <input id="ins-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="form-row">
          <label htmlFor="ins-ref">Property or listing reference</label>
          <input id="ins-ref" name="propertyReference" type="text" required />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="ins-location">Location (town, district, state)</label>
        <input id="ins-location" name="location" type="text" required />
      </div>

      <div className="form-row">
        <label htmlFor="ins-address">Street address, where known (optional)</label>
        <input id="ins-address" name="address" type="text" autoComplete="street-address" />
      </div>

      <div className="form-row">
        <label htmlFor="ins-scope">Scope of inspection</label>
        <select id="ins-scope" name="scope" defaultValue="standard" required>
          {SCOPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="ins-date">Preferred date (optional)</label>
        <input id="ins-date" name="preferredDate" type="date" />
      </div>

      <div className="form-row">
        <label htmlFor="ins-notes">Anything the officer should know (optional)</label>
        <textarea id="ins-notes" name="notes" rows={3} />
      </div>

      <label className="form-check">
        <input type="checkbox" name="consent" required />
        <span>
          I consent to Fair Deal Properties Ltd processing the details above in order to scope,
          schedule and carry out this inspection, as described in the{' '}
          <Link href="/privacy-notice">Privacy Notice</Link>. My data will be stored in the Republic
          of Ireland and I consent to that transfer, which is explained in the same notice.
        </span>
      </label>

      <p className="body-sm" style={{ marginTop: '1rem', color: 'var(--ink-muted)' }}>
        An inspection records what was observed on the date of attendance. It is not a valuation and
        it is not a title opinion. Where either is required, we instruct a separately engaged
        licensed professional and say so on the record.
      </p>

      {state === 'error' && (
        <div role="alert" style={{ marginTop: '1rem' }}>
          <p className="form-error">{error}</p>
          {Object.entries(fieldErrors).map(([k, v]) => (
            <p key={k} className="form-error" style={{ fontSize: '.8rem' }}>{k}: {v.join('; ')}</p>
          ))}
        </div>
      )}

      <button className="btn btn-primary btn-lg" disabled={state === 'sending'}
              style={{ marginTop: '1.5rem' }} type="submit">
        {state === 'sending' ? 'Submitting…' : 'Request Inspection'}
      </button>
    </form>
  );
}
