'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'fdp_alert_form_draft';

/** Standing instruction to be notified of matching listings. Consent is unbundled. */
export default function AlertForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [isRestored, setIsRestored] = useState(false);
  const [formValues, setFormValues] = useState<{
    email: string;
    cities: string[];
    types: string[];
    maxPrice: string;
    mortgageOnly: boolean;
    consent: boolean;
  }>({
    email: '',
    cities: [],
    types: [],
    maxPrice: '',
    mortgageOnly: false,
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
          if (parsed.email || (parsed.cities && parsed.cities.length > 0) || parsed.maxPrice) {
            setIsRestored(true);
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => {
      let updated = { ...prev };
      if (name === 'cities') {
        const nextCities = checked
          ? [...prev.cities, value]
          : prev.cities.filter((c) => c !== value);
        updated.cities = nextCities;
      } else if (name === 'types') {
        const nextTypes = checked
          ? [...prev.types, value]
          : prev.types.filter((t) => t !== value);
        updated.types = nextTypes;
      } else if (type === 'checkbox') {
        updated = { ...updated, [name]: checked };
      } else {
        updated = { ...updated, [name]: value };
      }

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
      email: '',
      cities: [],
      types: [],
      maxPrice: '',
      mortgageOnly: false,
      consent: false,
    });
    setIsRestored(false);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');

    if (formValues.cities.length === 0) {
      setError('Select at least one market.');
      setState('error');
      return;
    }

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formValues.email,
          cities: formValues.cities,
          propertyTypes: formValues.types,
          maxPriceMillionsNGN: formValues.maxPrice ? Number(formValues.maxPrice) : undefined,
          mortgageEligibleOnly: formValues.mortgageOnly,
          consent: formValues.consent,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Your alert could not be registered. Please try again.');
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
          {isRestored && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '.6rem .9rem',
              marginBottom: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(201,168,76,0.18)',
              border: '1px solid rgba(201,168,76,0.4)',
              fontSize: '.82rem',
              color: 'var(--gold-light)'
            }}>
              <span>Your previous alert preferences were automatically restored.</span>
              <button
                type="button"
                onClick={clearDraft}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
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

          <div className="form-row">
            <label htmlFor="alert-email" style={{ color: 'rgba(255,255,255,.75)' }}>Email</label>
            <input 
              id="alert-email" 
              name="email" 
              type="email" 
              required 
              autoComplete="email" 
              value={formValues.email}
              onChange={handleInputChange}
            />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0' }}>
            <legend style={{ color: 'rgba(255,255,255,.75)', fontSize: '.82rem',
                             marginBottom: '.5rem' }}>Markets</legend>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {CITIES.map((c) => (
                <label key={c.id} style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem',
                                           display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    name="cities" 
                    value={c.id} 
                    checked={formValues.cities.includes(c.id)}
                    onChange={handleInputChange}
                  />{c.label}
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
                  <input 
                    type="checkbox" 
                    name="types" 
                    value={t.id} 
                    checked={formValues.types.includes(t.id)}
                    onChange={handleInputChange}
                  />{t.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-row">
            <label htmlFor="alert-max" style={{ color: 'rgba(255,255,255,.75)' }}>
              Maximum budget in ₦ millions (optional)
            </label>
            <input 
              id="alert-max" 
              name="maxPrice" 
              type="number" 
              min={1} 
              step={1} 
              value={formValues.maxPrice}
              onChange={handleInputChange}
            />
          </div>

          <label style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', display: 'flex',
                          gap: '.5rem', alignItems: 'flex-start', marginTop: '.75rem' }}>
            <input 
              type="checkbox" 
              name="mortgageOnly" 
              checked={formValues.mortgageOnly}
              onChange={handleInputChange}
            />
            <span>Only listings where mortgage financing is available</span>
          </label>

          <label style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', display: 'flex',
                          gap: '.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              name="consent" 
              required 
              checked={formValues.consent}
              onChange={handleInputChange}
            />
            <span>
              I consent to receiving listing alerts matching the criteria above, and to my data
              being stored in the Republic of Ireland. This consent covers nothing else. See the{' '}
              <Link 
                href="/privacy-notice" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}
              >
                Privacy Notice ↗
              </Link>.
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
