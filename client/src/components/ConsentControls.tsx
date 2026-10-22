'use client';

import { useConsent } from './ConsentProvider';
import { useState } from 'react';

/**
 * Consent management controls on the Cookie Notice page.
 *
 * The consent record is displayed because NDPA 2023 s.26 governs consent and s.24(3)
 * requires the controller to demonstrate accountability for the principles in the Act.
 * A visitor who can see what they consented to, and when, can hold the firm to it.
 */
export default function ConsentControls() {
  const { consent, open, withdraw, hydrated } = useConsent();
  const [showRecord, setShowRecord] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-gold" onClick={open} type="button">
          Preference centre
        </button>
        <button className="btn btn-ghost-white" onClick={() => setShowRecord((v) => !v)}
                type="button" aria-expanded={showRecord}>
          {showRecord ? 'Hide my consent record' : 'View my consent record'}
        </button>
        <button className="btn btn-ghost-white" onClick={withdraw} type="button">
          Withdraw consent
        </button>
      </div>

      {showRecord && (
        <div style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem',
                      background: 'rgba(255,255,255,.06)', borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255,255,255,.12)' }}>
          {!hydrated ? (
            <p className="body-sm">Reading your choices…</p>
          ) : !consent ? (
            <p className="body-sm">
              No consent record is held on this device. Nothing optional has been set. The notice will
              ask you on your next visit.
            </p>
          ) : (
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr',
                         gap: '.4rem 1.25rem', fontSize: '.85rem' }}>
              <dt>Strictly necessary</dt><dd>Active (cannot be disabled)</dd>
              <dt>Functional and preference</dt><dd>{consent.functional ? 'Allowed' : 'Declined'}</dd>
              <dt>Analytics and performance</dt><dd>{consent.analytics ? 'Allowed' : 'Declined'}</dd>
              <dt>Marketing</dt><dd>{consent.marketing ? 'Allowed' : 'Declined'}</dd>
              <dt>Decision recorded</dt>
              <dd>{new Date(consent.decidedAt).toLocaleString('en-GB', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}</dd>
              <dt>Notice version</dt><dd>{consent.version}</dd>
            </dl>
          )}
          <p className="body-sm" style={{ marginTop: '1rem', opacity: .75 }}>
            This record is held on your device only. It is not transmitted to the firm and is not
            used to identify you.
          </p>
        </div>
      )}
    </>
  );
}
