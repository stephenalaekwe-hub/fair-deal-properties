'use client';

import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'fdp_dsr_form_draft';

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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isRestored, setIsRestored] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    rightInvoked: 'access',
    relationship: 'website-visitor',
    details: '',
    identityDeclaration: false,
  });

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormValues((prev) => ({
            ...prev,
            ...parsed,
          }));
          if (parsed.name || parsed.email || parsed.details || parsed.phone) {
            setIsRestored(true);
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setFormValues((prev) => {
      const updated = { ...prev, [name]: value };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setFormValues({
      name: '',
      email: '',
      phone: '',
      rightInvoked: 'access',
      relationship: 'website-visitor',
      details: '',
      identityDeclaration: false,
    });
    setIsRestored(false);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/dsr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone ? formValues.phone : undefined,
          rightInvoked: formValues.rightInvoked,
          relationship: formValues.relationship,
          details: formValues.details,
          identityDeclaration: formValues.identityDeclaration,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your request could not be submitted. Please try again.');
        setFieldErrors(json.fieldErrors ?? {});
        setState('error');
        return;
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      setResult({ reference: json.data.reference, responseDueAt: json.data.responseDueAt });
      setState('done');
      setIsRestored(false);
    } catch {
      setError('We could not reach the server. Please try again, or email info@fdealproperties.com.');
      setState('error');
    }
  }

  if (state === 'done' && result) {
    return (
      <div className="form-success" style={{ display: 'block', padding: '1.75rem', borderRadius: 'var(--radius-md)' }} id="dsrDone">
        <h4 style={{ color: 'var(--forest)', fontSize: '1.3rem', marginBottom: '.75rem' }}>✓ Data Subject Request Logged</h4>
        
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          color: '#065f46',
          fontSize: '12.5px',
          fontWeight: 600,
          marginBottom: '1rem',
          lineHeight: 1.5,
        }}>
          📌 <strong>Please copy your tracking reference below:</strong> Quote this reference in any follow-up or correspondence with our Data Protection Officer.
        </div>

        <div style={{
          background: 'var(--cream)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '.75rem 1.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--forest)', fontWeight: 700 }}>
            Tracking Reference: <strong>{result.reference}</strong>
          </span>
          <button
            type="button"
            onClick={async () => {
              if (!result?.reference) return;
              try {
                if (navigator?.clipboard?.writeText) {
                  await navigator.clipboard.writeText(result.reference);
                } else {
                  const ta = document.createElement('textarea');
                  ta.value = result.reference;
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch (err) {
                console.warn(err);
              }
            }}
            style={{
              background: copied ? 'var(--forest)' : '#ffffff',
              color: copied ? '#ffffff' : 'var(--forest)',
              border: '1px solid var(--forest)',
              borderRadius: '4px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>

        <p className="body-sm">
          We commit to acknowledging within 5 business days and responding substantively by{' '}
          <strong>{new Date(result.responseDueAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
          })}</strong>. There is no charge.
        </p>
        <p className="body-sm" style={{ marginTop: '.75rem', color: 'var(--ink-muted)' }}>
          If you are not satisfied with our response, you may complain to the Nigeria Data Protection
          Commission. You may do so at any time, including before we have responded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate id="dsrForm">
      {isRestored && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '.55rem .75rem',
          marginBottom: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.3)',
          fontSize: '.78rem',
          color: 'var(--forest-dark)'
        }}>
          <span>Your previously entered request was automatically restored.</span>
          <button
            type="button"
            onClick={clearDraft}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '.75rem',
              marginLeft: '.5rem'
            }}
          >
            Clear draft
          </button>
        </div>
      )}

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="d-name">Full name</label>
          <input 
            id="d-name" 
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
          <label htmlFor="d-email">Email</label>
          <input 
            id="d-email" 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="d-phone">Phone (optional)</label>
        <input 
          id="d-phone" 
          name="phone" 
          type="tel" 
          autoComplete="tel" 
          value={formValues.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="d-right">Which right are you exercising?</label>
        <select 
          id="d-right" 
          name="rightInvoked" 
          value={formValues.rightInvoked}
          onChange={handleChange}
          required
        >
          {RIGHTS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="d-rel">Your relationship with the firm</label>
        <select 
          id="d-rel" 
          name="relationship" 
          value={formValues.relationship}
          onChange={handleChange}
          required
        >
          {RELATIONSHIPS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="d-details">
          Tell us what you need. The more specific you are, the faster we can act.
        </label>
        <textarea 
          id="d-details" 
          name="details" 
          rows={5} 
          required 
          minLength={10} 
          value={formValues.details}
          onChange={handleChange}
        />
      </div>

      <label className="form-check">
        <input 
          type="checkbox" 
          name="identityDeclaration" 
          checked={formValues.identityDeclaration}
          onChange={handleChange}
          required 
        />
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
