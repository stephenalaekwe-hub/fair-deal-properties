'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useConsent } from './ConsentProvider';

interface Category {
  id: 'necessary' | 'functional' | 'analytics' | 'marketing';
  title: string;
  required?: boolean;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'necessary',
    title: 'Strictly necessary',
    required: true,
    description:
      'Required for the site to function - page navigation, form submission, session continuity '
      + 'and recording your choice on this notice. These are set on the basis of legitimate interest '
      + 'and cannot be disabled. No personally identifying profile is built from them.',
  },
  {
    id: 'functional',
    title: 'Functional and preference',
    description:
      'Remembers choices you make - saved properties, the page you were last on, your inspection '
      + 'session reference. Retention up to 12 months. Declining these means the site will not '
      + 'remember your choices between visits.',
  },
  {
    id: 'analytics',
    title: 'Analytics and performance',
    description:
      'Anonymised information on how the site is used, so we can improve it. Retention up to 24 '
      + 'months. We do not use this to identify you and we do not sell or share it for any third '
      + "party's own purposes.",
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description:
      'We do not currently operate advertising or third-party remarketing cookies. If that changes, '
      + 'nothing will be set unless you switch this on. Direct marketing by any channel requires your '
      + 'prior consent and is never bundled with any other permission.',
  },
];

export default function CookieConsent() {
  const { consent, isOpen, close, decide, acceptAll, rejectAll, hydrated } = useConsent();
  const [draft, setDraft] = useState({ functional: false, analytics: false, marketing: false });

  useEffect(() => {
    if (consent) {
      setDraft({
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }
  }, [consent, isOpen]);

  // Nothing renders until local state is read, so the server-rendered HTML and the
  // first client render agree and no notice flashes for a visitor who already decided.
  if (!hydrated || !isOpen) return null;

  return (
    <div id="ckOverlay" role="dialog" aria-modal="true" aria-labelledby="ckTitle">
      <div className="ck-panel">
        <div className="ck-head">
          <div className="ck-eyebrow">Your Privacy Choices</div>
          <div className="ck-title" id="ckTitle">We ask before we set any cookie</div>
        </div>

        <div className="ck-body">
          <p className="ck-text">
            Fair Deal Properties Ltd uses cookies on this website. Under the Nigeria Data Protection
            Act 2023 and the NDPA General Application and Implementation Directive 2025, cookies that
            are not strictly necessary require your active consent before they are set. Nothing
            optional is placed on your device until you choose below. You may decline everything
            optional and continue using the site normally.
          </p>

          {CATEGORIES.map((cat) => (
            <div className="ck-cat" key={cat.id}>
              <label className="ck-sw">
                <input
                  type="checkbox"
                  checked={cat.required ? true : draft[cat.id as keyof typeof draft]}
                  disabled={cat.required}
                  onChange={(e) =>
                    !cat.required && setDraft({ ...draft, [cat.id]: e.target.checked })}
                  aria-label={cat.title}
                />
                <span className="ck-slider" />
              </label>
              <div>
                <div className="ck-cat-t">
                  {cat.title}
                  {cat.required && <span className="ck-cat-req">Always active</span>}
                </div>
                <div className="ck-cat-d">{cat.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ck-foot">
          <button className="ck-btn ck-reject" onClick={rejectAll} type="button">
            Decline all optional
          </button>
          <button className="ck-btn ck-save" onClick={() => decide(draft)} type="button">
            Save my choices
          </button>
          <button className="ck-btn ck-accept" onClick={acceptAll} type="button">
            Accept all
          </button>
        </div>

        <div className="ck-legal">
          Declining is as easy as accepting and carries no disadvantage. You can change your choices
          at any time using the Privacy Choices control at the bottom left of any page. Your decision,
          the categories you selected and the date are recorded as evidence of consent. See our{' '}
          <Link href="/cookie-notice" onClick={close}>Cookie Notice</Link>,{' '}
          <Link href="/privacy-notice" onClick={close}>Privacy Notice</Link> and{' '}
          <Link href="/data-rights" onClick={close}>Data Protection Centre</Link>.
        </div>
      </div>
    </div>
  );
}
