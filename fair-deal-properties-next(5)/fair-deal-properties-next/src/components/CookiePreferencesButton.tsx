'use client';

import { useConsent } from './ConsentProvider';

/** Footer control. Withdrawal must be as easy as consent - GAID 2025. */
export default function CookiePreferencesButton() {
  const { open } = useConsent();
  return (
    <a
      href="#cookie-preferences"
      onClick={(e) => { e.preventDefault(); open(); }}
      role="button"
    >
      Cookie Preferences
    </a>
  );
}
