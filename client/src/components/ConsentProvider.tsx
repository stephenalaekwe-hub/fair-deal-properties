'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

/**
 * Cookie consent, NDPA 2023 and GAID 2025.
 *
 * Design constraints that are regulatory, not aesthetic:
 *
 *  - Nothing optional is set before an affirmative choice. The state starts with every
 *    optional category false and stays there until the visitor acts.
 *  - Declining is presented with the same prominence as accepting. GAID 2025 does not
 *    accept a design where refusal is harder than agreement.
 *  - The notice obstructs the centre of the viewport on first visit, as required by
 *    GAID 2025 Article 7(l). A dismissible corner banner does not satisfy it.
 *  - Consent is withdrawable at any time, through the always-present control at the
 *    foot of every page, and withdrawal is as easy as granting.
 *  - The decision, the categories selected and the date are recorded as evidence of
 *    consent under s.26 of the Act, read with the accountability duty in s.24(3).
 */

export interface ConsentRecord {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
  version: string;
}

const STORAGE_KEY = 'fdp_consent_v3';
const CONSENT_VERSION = '3.0';

interface ConsentApi {
  consent: ConsentRecord | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  decide: (choice: Partial<Omit<ConsentRecord, 'necessary' | 'decidedAt' | 'version'>>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  withdraw: () => void;
  hydrated: boolean;
}

const Ctx = createContext<ConsentApi | null>(null);

export function useConsent(): ConsentApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConsent must be used inside ConsentProvider');
  return ctx;
}

function read(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function write(record: ConsentRecord | null) {
  try {
    if (record === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage may be unavailable - the site must still work */
  }
}

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const existing = read();
    setConsent(existing);
    setHydrated(true);
    if (!existing) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const commit = useCallback((partial: Partial<ConsentRecord>) => {
    const record: ConsentRecord = {
      necessary: true,
      functional: partial.functional ?? false,
      analytics: partial.analytics ?? false,
      marketing: partial.marketing ?? false,
      decidedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    setConsent(record);
    write(record);
    setIsOpen(false);
  }, []);

  const api: ConsentApi = {
    consent,
    isOpen,
    hydrated,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    decide: commit,
    acceptAll: () => commit({ functional: true, analytics: true, marketing: true }),
    rejectAll: () => commit({ functional: false, analytics: false, marketing: false }),
    withdraw: () => {
      setConsent(null);
      write(null);
      setIsOpen(true);
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
