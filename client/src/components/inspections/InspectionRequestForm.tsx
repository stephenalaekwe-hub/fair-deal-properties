'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    propertyReference: '',
    location: '',
    address: '',
    scope: 'standard',
    preferredDate: '',
    notes: '',
    consent: false,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fdp_inspection_request_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setFormValues((prev) => ({ ...prev, ...parsed }));
          const hasContent = Object.entries(parsed).some(
            ([k, v]) => k !== 'consent' && typeof v === 'string' && v.trim() !== ''
          );
          if (hasContent) setDraftRestored(true);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const hasContent = Object.entries(formValues).some(
        ([k, v]) => k !== 'consent' && typeof v === 'string' && v.trim() !== ''
      );
      if (hasContent) {
        sessionStorage.setItem('fdp_inspection_request_draft', JSON.stringify(formValues));
      }
    } catch {}
  }, [formValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  const clearDraft = () => {
    try {
      sessionStorage.removeItem('fdp_inspection_request_draft');
    } catch {}
    setFormValues(initialValues);
    setDraftRestored(false);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          phone: formValues.phone.trim(),
          propertyReference: formValues.propertyReference.trim(),
          address: formValues.address.trim() || undefined,
          location: formValues.location.trim(),
          scope: formValues.scope,
          preferredDate: formValues.preferredDate || undefined,
          notes: formValues.notes.trim() || undefined,
          consent: Boolean(formValues.consent),
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
      clearDraft();
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
          marginBottom: '1rem',
        }}>
          <span>✓ <strong>Draft Restored:</strong> Your previously entered details have been preserved.</span>
          <button
            type="button"
            onClick={clearDraft}
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

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="ins-name">Full name</label>
          <input
            id="ins-name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="ins-email">Email</label>
          <input
            id="ins-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="ins-phone">Phone</label>
          <input
            id="ins-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={formValues.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="ins-ref">Property or listing reference</label>
          <input
            id="ins-ref"
            name="propertyReference"
            type="text"
            required
            value={formValues.propertyReference}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="ins-location">Location (town, district, state)</label>
        <input
          id="ins-location"
          name="location"
          type="text"
          required
          value={formValues.location}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="ins-address">Street address, where known (optional)</label>
        <input
          id="ins-address"
          name="address"
          type="text"
          autoComplete="street-address"
          value={formValues.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="ins-scope">Scope of inspection</label>
        <select
          id="ins-scope"
          name="scope"
          required
          value={formValues.scope}
          onChange={handleChange}
        >
          {SCOPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="ins-date">Preferred date (optional)</label>
        <input
          id="ins-date"
          name="preferredDate"
          type="date"
          value={formValues.preferredDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="ins-notes">Anything the officer should know (optional)</label>
        <textarea
          id="ins-notes"
          name="notes"
          rows={3}
          value={formValues.notes}
          onChange={handleChange}
        />
      </div>

      <label className="form-check">
        <input
          type="checkbox"
          name="consent"
          required
          checked={Boolean(formValues.consent)}
          onChange={handleChange}
        />
        <span>
          I consent to Fair Deal Properties Ltd processing the details above in order to scope,
          schedule and carry out this inspection, as described in the{' '}
          <Link
            href="/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            Privacy Notice ↗
          </Link>
          . My data will be stored in the Republic of Ireland and I consent to that transfer, which is explained in the same notice.
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
