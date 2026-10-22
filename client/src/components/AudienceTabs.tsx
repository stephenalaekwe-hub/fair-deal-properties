'use client';

import { useState, type ReactNode } from 'react';

export interface AudiencePanel {
  id: string;
  label: string;
  content: ReactNode;
}

/** The audience selector on the landing page. */
export default function AudienceTabs({ panels }: { panels: AudiencePanel[] }) {
  const [active, setActive] = useState(panels[0]?.id ?? '');

  return (
    <>
      <div className="audience-tabs" role="tablist" aria-label="Choose your situation">
        {panels.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            aria-controls={`aud-${p.id}`}
            id={`aud-tab-${p.id}`}
            className={active === p.id ? 'aud-tab active' : 'aud-tab'}
            onClick={() => setActive(p.id)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      {panels.map((p) => (
        <div
          key={p.id}
          id={`aud-${p.id}`}
          role="tabpanel"
          aria-labelledby={`aud-tab-${p.id}`}
          className={active === p.id ? 'aud-panel active' : 'aud-panel'}
          hidden={active !== p.id}
        >
          {p.content}
        </div>
      ))}
    </>
  );
}
