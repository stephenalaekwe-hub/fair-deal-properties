'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_LIST, CurrencyCode } from './CurrencyProvider';

interface Props {
  variant?: 'dropdown' | 'pills';
  className?: string;
}

export default function CurrencyToggle({ variant = 'dropdown', className = '' }: Props) {
  const { currency, setCurrency, info } = useCurrency();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (variant === 'pills') {
    return (
      <div
        className={`currency-pills-bar ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'var(--white)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(13,43,30,.04)',
          gap: '2px',
        }}
        role="group"
        aria-label="Select currency"
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            padding: '0 8px 0 6px',
            userSelect: 'none',
          }}
        >
          Currency:
        </span>
        {CURRENCY_LIST.map((c) => {
          const isSelected = c.code === currency;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              aria-pressed={isSelected}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 9px',
                borderRadius: '3px',
                border: 'none',
                background: isSelected ? 'var(--forest)' : 'transparent',
                color: isSelected ? 'var(--white)' : 'var(--ink-mid)',
                fontFamily: 'var(--font-body), system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all .15s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
              title={`${c.label} (${c.code})`}
            >
              <span style={{ fontSize: '13px' }}>{c.flag}</span>
              <span>{c.symbol} {c.code}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div
      ref={containerRef}
      className={`currency-dropdown-wrap ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px',
          fontFamily: 'var(--font-body), system-ui, sans-serif',
          fontSize: '12.5px',
          fontWeight: 600,
          color: 'var(--forest)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all .15s ease',
          lineHeight: 1,
        }}
        title="Change display currency"
      >
        <span style={{ fontSize: '14px' }}>{info.flag}</span>
        <span>{info.symbol} {info.code}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s ease',
            color: 'var(--ink-muted)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(13,43,30,.14)',
            padding: '6px',
            minWidth: '210px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div
            style={{
              padding: '6px 10px 4px',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '4px',
            }}
          >
            Select Currency
          </div>
          {CURRENCY_LIST.map((c) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--cream-mid)' : 'transparent',
                  color: isSelected ? 'var(--forest)' : 'var(--ink)',
                  fontFamily: 'var(--font-body), system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background .15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--cream)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px' }}>{c.flag}</span>
                  <div>
                    <div style={{ lineHeight: 1.1 }}>
                      <strong>{c.symbol} {c.code}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                      {c.label}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{ color: 'var(--forest)', fontWeight: 800 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
