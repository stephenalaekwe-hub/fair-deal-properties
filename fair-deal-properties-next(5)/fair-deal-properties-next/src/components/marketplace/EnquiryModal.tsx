'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Listing } from '@/data/listings';

interface Props {
  listing: Listing | null;
  onClose: () => void;
}

export default function EnquiryModal({ listing, onClose }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  if (!listing) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!listing) return;
    setState('sending');
    setError('');
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: fd.get('phone') ? String(fd.get('phone')) : undefined,
          propertyTitle: listing.title,
          propertyPrice: listing.priceDisplay,
          verificationStatus: listing.verificationStatus,
          message: fd.get('message') ? String(fd.get('message')) : undefined,
          financingRequired: fd.get('financing') === 'on',
          consent: fd.get('consent') === 'on',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your enquiry could not be submitted. Please try again.');
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

  return (
    <div
      id="opp-modal"
      className="opp-modal open"
      role="dialog"
      aria-modal="true"
      aria-label={`Enquire about ${listing.title}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="opp-modal-panel">
        <button className="opp-modal-close" onClick={onClose} aria-label="Close" type="button">✕</button>

        <div className="eyebrow">Property Enquiry</div>
        <h3 style={{ marginBottom: '.5rem' }}>{listing.title}</h3>
        <p className="body-sm" style={{ marginBottom: '1.5rem' }}>
          {listing.priceDisplay} · {listing.verificationStatus}
        </p>

        {state === 'done' ? (
          <div className="form-success" style={{ display: 'block' }}>
            <h4>Enquiry logged</h4>
            <p className="body-sm">
              Your reference is <strong>{reference}</strong>. We will confirm current availability and
              the verification record before responding substantively. Please quote the reference in
              any follow-up.
            </p>
            <button className="btn btn-outline" onClick={onClose} style={{ marginTop: '1rem' }} type="button">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="form-row">
              <label htmlFor="enq-name">Full name</label>
              <input id="enq-name" name="name" type="text" required minLength={2} autoComplete="name" />
            </div>
            <div className="form-row">
              <label htmlFor="enq-email">Email</label>
              <input id="enq-email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="form-row">
              <label htmlFor="enq-phone">Phone (optional)</label>
              <input id="enq-phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="form-row">
              <label htmlFor="enq-message">Anything we should know? (optional)</label>
              <textarea id="enq-message" name="message" rows={3} />
            </div>

            <label className="form-check">
              <input type="checkbox" name="financing" />
              <span>I would like financing options assessed alongside this enquiry</span>
            </label>

            <label className="form-check">
              <input type="checkbox" name="consent" required />
              <span>
                I consent to Fair Deal Properties Ltd processing the details above in order to
                respond to this enquiry, as described in the{' '}
                <Link href="/privacy-notice">Privacy Notice</Link>. My data will be stored in the
                Republic of Ireland and I consent to that transfer. I may withdraw this at any time.
              </span>
            </label>

            {state === 'error' && (
              <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>
            )}

            <button className="btn btn-primary btn-lg" disabled={state === 'sending'}
                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                    type="submit">
              {state === 'sending' ? 'Submitting…' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
