'use client';

import { useConsent } from './ConsentProvider';

/** The persistent Privacy Choices control present at the foot of every page. */
export default function ConsentReopen() {
  const { consent, hydrated, open } = useConsent();
  if (!hydrated || !consent) return null;

  return (
    <button id="ckReopen" className="show" onClick={open} aria-label="Privacy choices" type="button">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      Privacy Choices
    </button>
  );
}
