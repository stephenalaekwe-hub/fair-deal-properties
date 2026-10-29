'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Listing } from '@/data/listings';

interface Props {
  listing: Listing | null;
  onClose: () => void;
}

const STORAGE_KEY = 'fdp_enquiry_modal_draft';

export default function EnquiryModal({ listing, onClose }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isRestored, setIsRestored] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    financing: false,
    consent: false,
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
          if (parsed.name || parsed.email || parsed.message || parsed.phone) {
            setIsRestored(true);
          }
        }
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      message: '',
      financing: false,
      consent: false,
    });
    setIsRestored(false);
  };

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
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      setReference(json.data.reference);
      setState('done');
      setIsRestored(false);
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

        {isRestored && state !== 'done' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '.55rem .75rem',
            marginBottom: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.35)',
            fontSize: '.78rem',
            color: 'var(--forest-dark)'
          }}>
            <span>Your previously entered details were automatically restored.</span>
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

        {state === 'done' ? (
          <div className="form-success" style={{ display: 'block', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem', color: 'var(--forest)' }}>✓</div>
            <h4 style={{ marginBottom: '.5rem', fontSize: '1.3rem' }}>Enquiry Logged</h4>

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
              textAlign: 'center',
            }}>
              📌 <strong>Please copy your tracking reference below:</strong> Save this unique code for your records and follow-ups.
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
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--forest)', fontWeight: 700 }}>
                Tracking Reference: <strong>{reference}</strong>
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (!reference) return;
                  try {
                    if (navigator?.clipboard?.writeText) {
                      await navigator.clipboard.writeText(reference);
                    } else {
                      const ta = document.createElement('textarea');
                      ta.value = reference;
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

            <p className="body-sm" style={{ color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
              We will confirm current availability and the verification record before responding substantively. Please quote the reference in any follow-up.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ padding: '10px 28px' }} type="button">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="form-row">
              <label htmlFor="enq-name">Full name</label>
              <input 
                id="enq-name" 
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
              <label htmlFor="enq-email">Email</label>
              <input 
                id="enq-email" 
                name="email" 
                type="email" 
                required 
                autoComplete="email" 
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="enq-phone">Phone (optional)</label>
              <input 
                id="enq-phone" 
                name="phone" 
                type="tel" 
                autoComplete="tel" 
                value={formValues.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="enq-message">Anything we should know? (optional)</label>
              <textarea 
                id="enq-message" 
                name="message" 
                rows={3} 
                value={formValues.message}
                onChange={handleChange}
              />
            </div>

            <label className="form-check">
              <input 
                type="checkbox" 
                name="financing" 
                checked={formValues.financing}
                onChange={handleChange}
              />
              <span>I would like financing options assessed alongside this enquiry</span>
            </label>

            <label className="form-check">
              <input 
                type="checkbox" 
                name="consent" 
                checked={formValues.consent}
                onChange={handleChange}
                required 
              />
              <span>
                I consent to Fair Deal Properties Ltd processing the details above in order to
                respond to this enquiry, as described in the{' '}
                <Link 
                  href="/privacy-notice" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ textDecoration: 'underline', color: 'var(--forest)' }}
                >
                  Privacy Notice ↗
                </Link>. My data will be stored in the
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
