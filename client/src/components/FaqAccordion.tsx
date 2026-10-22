'use client';

import { useState } from 'react';
import type { FaqItem } from '@/data/faq';

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" key={item.question}>
            <button
              className={isOpen ? 'faq-q open' : 'faq-q'}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-a-${i}`}
              id={`faq-q-${i}`}
              type="button"
            >
              {item.question}
              <svg className="faq-ico" viewBox="0 0 24 24" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div
              className={isOpen ? 'faq-a open' : 'faq-a'}
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
