'use client';

import { useState } from 'react';

const CATEGORIES = [
  { id: 'data-protection', label: 'Data protection or privacy' },
  { id: 'listing-accuracy', label: 'Accuracy of a listing' },
  { id: 'conduct', label: 'Conduct of a member of the firm' },
  { id: 'service-quality', label: 'Quality of service' },
  { id: 'fees', label: 'Fees or billing' },
  { id: 'other', label: 'Something else' },
];

/**
 * Site notice and grievance, GAID 2025 Article 40.
 *
 * Anonymous submission is offered deliberately. A grievance mechanism that requires
 * the complainant to identify themselves to the party complained of is not an
 * accessible one.
 */
export default function SnagForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ reference: string; responseDueAt: string } | null>(null);
  const [error, setError] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/snag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: anonymous || !fd.get('name') ? undefined : String(fd.get('name')),
          email: String(fd.get('email') ?? ''),
          category: String(fd.get('category') ?? 'other'),
          subject: String(fd.get('subject') ?? ''),
          details: String(fd.get('details') ?? ''),
          anonymous,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your notice could not be submitted. Please try again.');
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
      <div className="form-success" style={{ display: 'block' }}>
        <h4>Notice logged</h4>
        <p className="body-sm">
          Your reference is <strong>{result.reference}</strong>. We will acknowledge within 5 business
          days and respond by{' '}
          <strong>{new Date(result.responseDueAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
          })}</strong>. Nothing you have raised here affects any service you receive from the firm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label className="form-check" style={{ marginBottom: '1rem' }}>
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
        <span>
          Submit without giving my name. We still need an email address so that we can respond, but
          your name will not be recorded against the notice.
        </span>
      </label>

      {!anonymous && (
        <div className="form-row">
          <label htmlFor="s-name">Full name</label>
          <input id="s-name" name="name" type="text" minLength={2} autoComplete="name" />
        </div>
      )}

      <div className="form-row">
        <label htmlFor="s-email">Email</label>
        <input id="s-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="form-row">
        <label htmlFor="s-cat">What does this concern?</label>
        <select id="s-cat" name="category" defaultValue="other" required>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="s-subject">Subject</label>
        <input id="s-subject" name="subject" type="text" required minLength={3} />
      </div>

      <div className="form-row">
        <label htmlFor="s-details">Tell us what happened</label>
        <textarea id="s-details" name="details" rows={5} required minLength={10} />
      </div>

      {state === 'error' && (
        <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>
      )}

      <button className="btn btn-primary btn-lg" disabled={state === 'sending'}
              style={{ marginTop: '1.5rem' }} type="submit">
        {state === 'sending' ? 'Submitting…' : 'Submit Notice'}
      </button>
    </form>
  );
}
