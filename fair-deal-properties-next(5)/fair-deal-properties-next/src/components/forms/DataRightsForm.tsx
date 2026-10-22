'use client';

import { useState } from 'react';

const RIGHTS = [
  { id: 'information', label: 'Be informed - know what we do with your data' },
  { id: 'access', label: 'Access - get a copy of the personal data we hold about you' },
  { id: 'rectification', label: 'Rectification - correct data that is wrong or incomplete' },
  { id: 'erasure', label: 'Erasure - have your data deleted where we have no lawful reason to keep it' },
  { id: 'restriction', label: 'Restriction - have us stop processing while a matter is resolved' },
  { id: 'portability', label: 'Portability - receive your data in a reusable format' },
  { id: 'objection', label: 'Objection - object to processing based on legitimate interest' },
  { id: 'withdraw-consent', label: 'Withdraw consent - where consent is our lawful basis' },
  { id: 'automated-decision', label: 'Automated decisions - not be subject to one without human review' },
  { id: 'complaint', label: 'Complain - to us, and to the Nigeria Data Protection Commission' },
];

const RELATIONSHIPS = [
  { id: 'client', label: 'Client of the firm' },
  { id: 'prospective-client', label: 'Prospective client' },
  { id: 'website-visitor', label: 'Website visitor' },
  { id: 'vendor', label: 'Vendor or supplier' },
  { id: 'employee', label: 'Employee or applicant' },
  { id: 'other', label: 'Other' },
];

/**
 * Data subject request portal.
 *
 * NDPA 2023 s.34 sets no numeric deadline - it requires the controller to act without
 * constraint or unreasonable delay. The periods shown here are the firm's own published
 * commitments and are described to the data subject as commitments, not entitlements.
 * The due date is computed on the server so the firm can evidence what it promised and
 * when the clock started.
 */
export default function DataRightsForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ reference: string; responseDueAt: string } | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/dsr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: fd.get('phone') ? String(fd.get('phone')) : undefined,
          rightInvoked: String(fd.get('rightInvoked') ?? 'access'),
          relationship: String(fd.get('relationship') ?? 'other'),
          details: String(fd.get('details') ?? ''),
          identityDeclaration: fd.get('identityDeclaration') === 'on',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your request could not be submitted. Please try again.');
        setFieldErrors(json.fieldErrors ?? {});
        setState('error');
        return;
      }
      setResult({ reference: json.data.reference, responseDueAt: json.data.responseDueAt });
      setState('done');
    } catch {
      setError('We could not reach the server. Please try again, or email info@fairdealng.com.');
      setState('error');
    }
  }

  if (state === 'done' && result) {
    return (
      <div className="form-success" style={{ display: 'block' }} id="dsrDone">
        <h4>Request received and logged</h4>
        <p className="body-sm">
          Your reference is <strong>{result.reference}</strong>. We commit to acknowledging within
          5 business days and responding substantively by{' '}
          <strong>{new Date(result.responseDueAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
          })}</strong>. There is no charge.
        </p>
        <p className="body-sm" style={{ marginTop: '.75rem' }}>
          If you are not satisfied with our response, you may complain to the Nigeria Data Protection
          Commission. You may do so at any time, including before we have responded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate id="dsrForm">
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="d-name">Full name</label>
          <input id="d-name" name="name" type="text" required minLength={2} autoComplete="name" />
        </div>
        <div className="form-row">
          <label htmlFor="d-email">Email</label>
          <input id="d-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="d-phone">Phone (optional)</label>
        <input id="d-phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div className="form-row">
        <label htmlFor="d-right">Which right are you exercising?</label>
        <select id="d-right" name="rightInvoked" defaultValue="access" required>
          {RIGHTS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="d-rel">Your relationship with the firm</label>
        <select id="d-rel" name="relationship" defaultValue="website-visitor" required>
          {RELATIONSHIPS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="d-details">
          Tell us what you need. The more specific you are, the faster we can act.
        </label>
        <textarea id="d-details" name="details" rows={5} required minLength={10} />
      </div>

      <label className="form-check">
        <input type="checkbox" name="identityDeclaration" required />
        <span>
          I confirm that this request relates to my own personal data, or that I am authorised to
          make it on behalf of the person it concerns. We may ask for proof of identity before
          acting, and will say so promptly if we need to.
        </span>
      </label>

      <p className="body-sm" style={{ marginTop: '1rem', color: 'var(--ink-muted)' }}>
        The Act requires us to act without undue delay and sets no number of days. We commit to
        acknowledging within 5 business days and responding within 30 days, and we hold ourselves to
        that. There is no charge. Making a request has no effect on any service you receive from the
        firm, and you may complain to the Nigeria Data Protection Commission at any time without
        using this form first.
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
        {state === 'sending' ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  );
}
