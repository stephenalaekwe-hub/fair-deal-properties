'use client';

import Link from 'next/link';
import { useState } from 'react';

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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);

    const first = String(fd.get('firstName') ?? '').trim();
    const last = String(fd.get('lastName') ?? '').trim();
    const interest = String(fd.get('interest') ?? '');
    const profile = String(fd.get('profile') ?? '');
    const budget = String(fd.get('budget') ?? '');
    const note = String(fd.get('message') ?? '').trim();

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
          email: String(fd.get('email') ?? ''),
          phone: fd.get('phone') ? String(fd.get('phone')) : undefined,
          subject: interest || undefined,
          interest: interestKey(interest),
          message,
          consent: fd.get('consent') === 'on',
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
      setState('done');
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="success-msg" id="success-msg" style={{ display: 'block' }}>
        ✓ Thank you - your enquiry has been received under reference <strong>{reference}</strong>.
        A named advisor will contact you within 4 business hours. We look forward to our conversation.
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="c-first">First Name</label>
          <input id="c-first" name="firstName" type="text" className="form-input"
                 placeholder="Adebayo" autoComplete="given-name" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="c-last">Last Name</label>
          <input id="c-last" name="lastName" type="text" className="form-input"
                 placeholder="Okonkwo" autoComplete="family-name" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-email">Email Address</label>
        <input id="c-email" name="email" type="email" className="form-input"
               placeholder="you@example.com" autoComplete="email" required />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-phone">Phone / WhatsApp</label>
        <input id="c-phone" name="phone" type="tel" className="form-input"
               placeholder="+234 or international number" autoComplete="tel" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-profile">I am a...</label>
        <select id="c-profile" name="profile" className="form-select" defaultValue="" required>
          <option value="">Select your profile</option>
          {PROFILES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-interest">Primary Interest</label>
        <select id="c-interest" name="interest" className="form-select" defaultValue="" required>
          <option value="">Select your primary interest</option>
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-budget">Approximate Budget (Optional)</label>
        <select id="c-budget" name="budget" className="form-select" defaultValue="">
          <option value="">Prefer not to say</option>
          {BUDGETS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="c-message">Message / Specific Question</label>
        <textarea id="c-message" name="message" className="form-textarea" required minLength={10}
                  placeholder="Tell us a little about your goals, timeline, or specific situation. The more context you share, the more productive our first conversation will be." />
      </div>

      <label className="form-check">
        <input type="checkbox" name="consent" required />
        <span>
          I consent to Fair Deal Properties Ltd processing the details above in order to respond to
          this enquiry, as described in the{' '}
          <Link href="/privacy-notice">Privacy Notice</Link>. I understand my data will be stored in
          the Republic of Ireland and I consent to that transfer, which is explained in the same
          notice. I may withdraw this at any time through the{' '}
          <Link href="/data-rights">data rights portal</Link>.
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
