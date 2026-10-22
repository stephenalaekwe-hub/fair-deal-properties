'use client';

import Link from 'next/link';
import { useState } from 'react';

const CITIES = [
  { id: 'abuja', label: 'Abuja' },
  { id: 'lagos', label: 'Lagos' },
  { id: 'ogun', label: 'Ogun State' },
  { id: 'nationwide', label: 'Nationwide' },
];

const TYPES = [
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'land', label: 'Land' },
];

/** Standing instruction to be notified of matching listings. Consent is unbundled. */
export default function AlertForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');
    const fd = new FormData(e.currentTarget);
    const cities = fd.getAll('cities').map(String);

    if (cities.length === 0) {
      setError('Select at least one market.');
      setState('error');
      return;
    }

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(fd.get('email') ?? ''),
          cities,
          propertyTypes: fd.getAll('types').map(String),
          maxPriceMillionsNGN: fd.get('maxPrice') ? Number(fd.get('maxPrice')) : undefined,
          mortgageEligibleOnly: fd.get('mortgageOnly') === 'on',
          consent: fd.get('consent') === 'on',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your alert could not be registered. Please try again.');
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
    <div style={{ marginTop: '4rem', padding: '3rem', background: 'var(--forest)',
                  borderRadius: 'var(--radius-xl)', color: 'var(--white)' }}>
      <div className="eyebrow" style={{ color: 'rgba(201,168,76,.8)' }}>Listing Alerts</div>
      <h3 style={{ color: 'var(--white)', marginBottom: '.75rem' }}>
        Be told when something matches.
      </h3>
      <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: '620px', marginBottom: '2rem',
                  fontSize: '.92rem', lineHeight: 1.7 }}>
        We will write to you only when a listing meets the criteria you set here. Nothing else is sent
        on the strength of this permission, and you may withdraw it from any alert email or through
        the data rights portal.
      </p>

      {state === 'done' ? (
        <div style={{ background: 'rgba(255,255,255,.08)', padding: '1.5rem',
                      borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--white)', marginBottom: '.5rem', fontWeight: 500 }}>
            Alert registered.
          </p>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.88rem' }}>
            Reference <strong>{reference}</strong>. You may withdraw it at any time from any alert
            email or through the <Link href="/data-rights" style={{ color: 'var(--gold-light)' }}>
            data rights portal</Link>, with no effect on any other service.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate style={{ maxWidth: '720px' }}>
          <div className="form-row">
            <label htmlFor="alert-email" style={{ color: 'rgba(255,255,255,.75)' }}>Email</label>
            <input id="alert-email" name="email" type="email" required autoComplete="email" />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0' }}>
            <legend style={{ color: 'rgba(255,255,255,.75)', fontSize: '.82rem',
                             marginBottom: '.5rem' }}>Markets</legend>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {CITIES.map((c) => (
                <label key={c.id} style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem',
                                           display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                  <input type="checkbox" name="cities" value={c.id} />{c.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0' }}>
            <legend style={{ color: 'rgba(255,255,255,.75)', fontSize: '.82rem',
                             marginBottom: '.5rem' }}>Property type (optional)</legend>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {TYPES.map((t) => (
                <label key={t.id} style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem',
                                           display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                  <input type="checkbox" name="types" value={t.id} />{t.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-row">
            <label htmlFor="alert-max" style={{ color: 'rgba(255,255,255,.75)' }}>
              Maximum budget in ₦ millions (optional)
            </label>
            <input id="alert-max" name="maxPrice" type="number" min={1} step={1} />
          </div>

          <label style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', display: 'flex',
                          gap: '.5rem', alignItems: 'flex-start', marginTop: '.75rem' }}>
            <input type="checkbox" name="mortgageOnly" />
            <span>Only listings where mortgage financing is available</span>
          </label>

          <label style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', display: 'flex',
                          gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <input type="checkbox" name="consent" required />
            <span>
              I consent to receiving listing alerts matching the criteria above, and to my data
              being stored in the Republic of Ireland. This consent covers nothing else. See the{' '}
              <Link href="/privacy-notice" style={{ color: 'var(--gold-light)' }}>Privacy Notice</Link>.
            </span>
          </label>

          {state === 'error' && (
            <p role="alert" style={{ color: 'var(--gold-light)', marginTop: '1rem',
                                     fontSize: '.85rem' }}>{error}</p>
          )}

          <button className="btn btn-gold btn-lg" disabled={state === 'sending'}
                  style={{ marginTop: '1.5rem' }} type="submit">
            {state === 'sending' ? 'Registering…' : 'Register Alert'}
          </button>
        </form>
      )}
    </div>
  );
}
