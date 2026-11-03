'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'CAD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  shortName: string;
  flag: string;
  country: string;
  rate: number; // 1 Foreign Currency Unit = rate NGN
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    label: 'Nigerian Naira',
    shortName: 'NGN',
    flag: '🇳🇬',
    country: 'Nigeria',
    rate: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar',
    shortName: 'USD',
    flag: '🇺🇸',
    country: 'United States',
    rate: 1450,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound',
    shortName: 'GBP',
    flag: '🇬🇧',
    country: 'United Kingdom',
    rate: 1900,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro',
    shortName: 'EUR',
    flag: '🇪🇺',
    country: 'European Union',
    rate: 1600,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    label: 'Canadian Dollar',
    shortName: 'CAD',
    flag: '🇨🇦',
    country: 'Canada',
    rate: 1050,
  },
};

export const CURRENCY_LIST: CurrencyInfo[] = [
  CURRENCIES.NGN,
  CURRENCIES.USD,
  CURRENCIES.GBP,
  CURRENCIES.EUR,
  CURRENCIES.CAD,
];

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  info: CurrencyInfo;
  formatPrice: (priceMillionsNGN?: number | null, rawDisplay?: string) => string;
  formatAmountNGN: (amountNGN: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'NGN',
  setCurrency: () => {},
  info: CURRENCIES.NGN,
  formatPrice: () => '',
  formatAmountNGN: () => '',
});

/**
 * Extracts numeric millions from raw price string like "₦85M", "₦1.2B", "₦80,025,484"
 */
export function parseNgnPrice(raw?: string): number | null {
  if (!raw) return null;
  const clean = raw.trim();

  // Match Billions, e.g. "₦1.2B"
  const matchB = clean.match(/₦?\s*([\d,.]+)\s*B/i);
  if (matchB) {
    const n = parseFloat(matchB[1].replace(/,/g, ''));
    return isNaN(n) ? null : n * 1000;
  }

  // Match Millions, e.g. "₦85M" or "₦85.5M+"
  const matchM = clean.match(/₦?\s*([\d,.]+)\s*M/i);
  if (matchM) {
    const n = parseFloat(matchM[1].replace(/,/g, ''));
    return isNaN(n) ? null : n;
  }

  // Match Thousands, e.g. "₦500K"
  const matchK = clean.match(/₦?\s*([\d,.]+)\s*K/i);
  if (matchK) {
    const n = parseFloat(matchK[1].replace(/,/g, ''));
    return isNaN(n) ? null : n / 1000;
  }

  // Match full currency integer, e.g. "₦80,025,484"
  const digitsOnly = clean.replace(/[^\d.]/g, '');
  if (digitsOnly) {
    const n = parseFloat(digitsOnly);
    if (!isNaN(n)) {
      // If it's a huge number like 80000000, convert to millions
      if (n > 10000) {
        return n / 1_000_000;
      }
      return n;
    }
  }

  return null;
}

/**
 * Formats a given price (in NGN millions or raw display) into the chosen currency.
 */
export function formatCurrencyPrice(
  priceMillionsNGN: number | null | undefined,
  rawDisplay: string | undefined,
  target: CurrencyCode
): string {
  const info = CURRENCIES[target];

  // If target is NGN, keep the original raw display if available
  if (target === 'NGN') {
    if (rawDisplay && rawDisplay.trim()) return rawDisplay;
    if (priceMillionsNGN != null) {
      if (priceMillionsNGN >= 1000) {
        return `₦${(priceMillionsNGN / 1000).toFixed(1).replace(/\.0$/, '')}B`;
      }
      return `₦${priceMillionsNGN.toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
    }
    return '';
  }

  // Determine millions value
  let millions = priceMillionsNGN;
  if (millions == null && rawDisplay) {
    millions = parseNgnPrice(rawDisplay);
  }

  if (millions == null || isNaN(millions)) {
    return rawDisplay || '';
  }

  const hasPlus = rawDisplay ? rawDisplay.includes('+') : false;
  const totalNGN = millions * 1_000_000;
  const foreignVal = totalNGN / info.rate;

  let formatted = '';
  if (foreignVal >= 1_000_000) {
    // Format in millions, e.g. $1.2M
    const valM = foreignVal / 1_000_000;
    formatted = `${info.symbol}${valM.toFixed(valM >= 10 ? 1 : 2).replace(/\.?0+$/, '')}M`;
  } else if (foreignVal >= 10_000) {
    // Format rounded to nearest thousand or hundred for clean luxury readability
    const rounded = Math.round(foreignVal / 100) * 100;
    formatted = `${info.symbol}${rounded.toLocaleString('en-US')}`;
  } else if (foreignVal >= 1_000) {
    const rounded = Math.round(foreignVal / 50) * 50;
    formatted = `${info.symbol}${rounded.toLocaleString('en-US')}`;
  } else {
    formatted = `${info.symbol}${Math.round(foreignVal).toLocaleString('en-US')}`;
  }

  return hasPlus ? `${formatted}+` : formatted;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('NGN');
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fdp_currency') as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    if (!CURRENCIES[c]) return;
    setCurrencyState(c);
    try {
      localStorage.setItem('fdp_currency', c);
    } catch {
      // ignore
    }

    // Update global variables for legacy widget compatibility
    if (typeof window !== 'undefined') {
      (window as any).__fdpCurrency = c;
      window.dispatchEvent(new CustomEvent('fdp:currency-change', { detail: { currency: c } }));
    }

    // Refresh DOM prices across pages
    startTransition(() => {
      updateDomPrices(c);
    });
  };

  useEffect(() => {
    // Expose helpers on window
    if (typeof window !== 'undefined') {
      (window as any).__fdpCurrency = currency;
      (window as any).__fdpFormatPrice = (millions: number, raw?: string) =>
        formatCurrencyPrice(millions, raw, currency);
      (window as any).__fdpSetCurrency = setCurrency;
    }
    updateDomPrices(currency);
  }, [currency]);

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    info: CURRENCIES[currency],
    formatPrice: (priceMillions, raw) => formatCurrencyPrice(priceMillions, raw, currency),
    formatAmountNGN: (amountNGN: number) => {
      const target = CURRENCIES[currency];
      if (currency === 'NGN') {
        return `₦${amountNGN.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      }
      const foreign = amountNGN / target.rate;
      return `${target.symbol}${Math.round(foreign).toLocaleString('en-US')}`;
    },
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

/**
 * Updates DOM price elements in static or legacy markup
 */
function updateDomPrices(current: CurrencyCode) {
  if (typeof document === 'undefined') return;

  // 1. Update opp-card prices
  const oppCards = document.querySelectorAll<HTMLElement>('.opp-card');
  oppCards.forEach((card) => {
    const priceEl = card.querySelector<HTMLElement>('.opp-price');
    if (!priceEl) return;

    if (!priceEl.dataset.original) {
      priceEl.dataset.original = priceEl.textContent || '';
    }

    const priceAttr = card.dataset.price;
    const millions = priceAttr ? parseFloat(priceAttr) : parseNgnPrice(priceEl.dataset.original);
    const converted = formatCurrencyPrice(millions, priceEl.dataset.original, current);
    priceEl.textContent = converted;

    // Also update any enquire button on this card
    const enquireBtn = card.querySelector<HTMLElement>('.opp-enquire-btn');
    if (enquireBtn && !enquireBtn.dataset.boundConverted) {
      enquireBtn.dataset.currentPrice = converted;
    }
  });

  // 2. Update home/general listing-price elements
  const listingPrices = document.querySelectorAll<HTMLElement>('.listing-price');
  listingPrices.forEach((el) => {
    if (!el.dataset.original) {
      el.dataset.original = el.textContent || '';
    }
    const millions = el.dataset.price ? parseFloat(el.dataset.price) : parseNgnPrice(el.dataset.original);
    el.textContent = formatCurrencyPrice(millions, el.dataset.original, current);
  });

  // 3. Update any element with data-price-ngn-millions
  const taggedPrices = document.querySelectorAll<HTMLElement>('[data-price-ngn-millions]');
  taggedPrices.forEach((el) => {
    if (!el.dataset.original) {
      el.dataset.original = el.textContent || '';
    }
    const millions = parseFloat(el.dataset.priceNgnMillions || '0');
    el.textContent = formatCurrencyPrice(millions, el.dataset.original, current);
  });

  // 4. Update modal-price if modal is open
  const modalPrice = document.getElementById('modal-price');
  if (modalPrice && modalPrice.dataset.originalNgn) {
    const millions = parseNgnPrice(modalPrice.dataset.originalNgn);
    modalPrice.textContent = formatCurrencyPrice(millions, modalPrice.dataset.originalNgn, current);
  }
}
