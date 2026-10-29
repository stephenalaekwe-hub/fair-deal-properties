'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Contact form.
 *
 * Field set, labels, placeholders and classes are carried over unchanged from the
 * published design so the page renders exactly as before. Three things were added, and
 * only three: a consent checkbox, a cross-border transfer disclosure within it, and a
 * reference number on success. The first two are required - the original form collected
 * personal data with no consent mechanism at all, which GAID 2025 does not permit.
 */

const PROFILES = [
  'Local investor (Abuja / Lagos / PH)',
  'Diaspora Nigerian (UK)',
  'Diaspora Nigerian (USA / Canada)',
  'Diaspora Nigerian (Europe / Other)',
  'SME Owner / Entrepreneur',
  'Developer / Landowner',
  'Institutional Investor',
];

const INTERESTS = [
  'Buying a verified residential property',
  'Buying commercial / investment property',
  'Acquiring development land',
  'Real estate investment advisory',
  'Financing / bridge loan advisory',
  'Developer / landowner partnership',
  'General enquiry',
];

const BUDGETS = ['Under ₦50M', '₦50M - ₦150M', '₦150M - ₦500M', '₦500M - ₦1B', 'Above ₦1B'];

/** Maps the visitor's stated interest onto the stored interest category. */
function interestKey(label: string): string {
  if (label.startsWith('Buying a verified residential') || label.startsWith('Buying commercial')
      || label.startsWith('Acquiring development')) return 'buying';
  if (label.startsWith('Financing')) return 'financing';
  if (label.startsWith('Developer')) return 'developer';
  if (label.startsWith('Real estate investment advisory')) return 'assurance';
  return 'other';
}

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: '',
    interest: '',
    budget: '',
    message: '',
    consent: false,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fdp_contact_draft');
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
        sessionStorage.setItem('fdp_contact_draft', JSON.stringify(formValues));
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
      sessionStorage.removeItem('fdp_contact_draft');
    } catch {}
    setFormValues(initialValues);
    setDraftRestored(false);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});

    const first = formValues.firstName.trim();
    const last = formValues.lastName.trim();
    const interest = formValues.interest;
    const profile = formValues.profile;
    const budget = formValues.budget;
    const note = formValues.message.trim();

    // Profile and budget are part of the enquiry, so they travel in the message body
    // rather than as separate stored fields. Nothing is collected that the purpose
    // does not need - NDPA 2023 s.24(1)(c).
    const message = [
      note,
      profile ? `\n\nProfile: ${profile}` : '',
      interest ? `\nPrimary interest: ${interest}` : '',
      budget ? `\nIndicative budget: ${budget}` : '',
    ].join('').trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${first} ${last}`.trim(),
          email: formValues.email.trim(),
          phone: formValues.phone.trim() || undefined,
          subject: interest || undefined,
          interest: interestKey(interest),
          message,
          consent: Boolean(formValues.consent),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your enquiry could not be sent. Please try again.');
        setFieldErrors(json.fieldErrors ?? {});
        setState('error');
        return;
      }
      setReference(json.data.reference);
      clearDraft();
      setState('done');
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
      setState('error');
    }
  }

  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = async () => {
    if (!reference) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(reference);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = reference;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    } catch (err) {
      console.warn('Could not copy:', err);
    }
  };

  if (state === 'done') {
    return (
      <div className="success-msg" id="success-msg" style={{ display: 'block', padding: '1.75rem', borderRadius: 'var(--radius-md)' }}>
        <h4 style={{ color: 'var(--forest)', marginBottom: '.5rem', fontSize: '1.25rem' }}>✓ Consultation Request Received</h4>
        
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
          📌 <strong>Please copy your tracking reference below:</strong> Quote this unique reference in any follow-up with your assigned advisor.
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
            Tracking Reference: <strong>{reference}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopyRef}
            style={{
              background: copiedRef ? 'var(--forest)' : '#ffffff',
              color: copiedRef ? '#ffffff' : 'var(--forest)',
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
            {copiedRef ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>

        <p className="body-sm" style={{ color: 'var(--ink)' }}>
          A named advisor will contact you promptly. We look forward to our conversation.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
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
          <span>✓ <strong>Draft Restored:</strong> Your previously entered enquiry has been preserved.</span>
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
        <div className="form-group">
          <label className="form-label" htmlFor="c-first">First Name</label>
          <input
            id="c-first"
            name="firstName"
            type="text"
            className="form-input"
            placeholder="Adebayo"
            autoComplete="given-name"
            required
            value={formValues.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="c-last">Last Name</label>
          <input
            id="c-last"
            name="lastName"
            type="text"
            className="form-input"
            placeholder="Okonkwo"
            autoComplete="family-name"
            required
            value={formValues.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-email">Email Address</label>
        <input
          id="c-email"
          name="email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={formValues.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-phone">Phone / WhatsApp</label>
        <input
          id="c-phone"
          name="phone"
          type="tel"
          className="form-input"
          placeholder="+234 or international number"
          autoComplete="tel"
          value={formValues.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-profile">I am a...</label>
        <select
          id="c-profile"
          name="profile"
          className="form-select"
          required
          value={formValues.profile}
          onChange={handleChange}
        >
          <option value="">Select your profile</option>
          {PROFILES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-interest">Primary Interest</label>
        <select
          id="c-interest"
          name="interest"
          className="form-select"
          required
          value={formValues.interest}
          onChange={handleChange}
        >
          <option value="">Select your primary interest</option>
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-budget">Approximate Budget (Optional)</label>
        <select
          id="c-budget"
          name="budget"
          className="form-select"
          value={formValues.budget}
          onChange={handleChange}
        >
          <option value="">Prefer not to say</option>
          {BUDGETS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-message">Message / Specific Question</label>
        <textarea
          id="c-message"
          name="message"
          className="form-textarea"
          required
          minLength={10}
          placeholder="Tell us a little about your goals, timeline, or specific situation. The more context you share, the more productive our first conversation will be."
          value={formValues.message}
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
          I consent to Fair Deal Properties Ltd processing the details above in order to respond to
          this enquiry, as described in the{' '}
          <Link
            href="/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            Privacy Notice ↗
          </Link>
          . I understand my data will be stored in the Republic of Ireland and I consent to that transfer, which is explained in the same notice. I may withdraw this at any time through the{' '}
          <Link
            href="/data-rights"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            data rights portal ↗
          </Link>
          .
        </span>
      </label>

      {state === 'error' && (
        <div role="alert" style={{ marginTop: '1rem' }}>
          <p className="form-error">{error}</p>
          {Object.entries(fieldErrors).map(([k, v]) => (
            <p key={k} className="form-error" style={{ fontSize: '.8rem' }}>{k}: {v.join('; ')}</p>
          ))}
        </div>
      )}

      <button type="submit" className="form-submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : "Send Enquiry - We'll Be in Touch"}
        <span className="arrow-ico" style={{ marginLeft: '4px' }}>
          <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </button>
    </form>
  );
}
