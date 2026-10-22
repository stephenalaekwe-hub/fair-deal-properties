'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

/**
 * Financing Scenario Estimator.
 *
 * Automatically synchronizes with live benchmark rates from the backend rates
 * listener, with seamless fallback to indicative 22% p.a.
 * Sliders and numeric figure inputs are smoothly synchronized bi-directionally.
 */
const DEFAULT_ANNUAL_RATE = 22;

export default function FinancingCalculator() {
  const [propVal, setPropVal] = useState(150);   // ₦ millions
  const [downPct, setDownPct] = useState(30);    // per cent
  const [termYr, setTermYr] = useState(5);       // years
  const [annualRate, setAnnualRate] = useState(DEFAULT_ANNUAL_RATE);
  const [isLiveRate, setIsLiveRate] = useState(false);

  useEffect(() => {
    fetchApi<any[]>('/rates/financing')
      .then((res) => {
        if (res && res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const comm = res.data.find(
            (r) => r.id === 'commercial' || r.name?.toLowerCase().includes('commercial')
          );
          if (comm && comm.interestRatePct) {
            setAnnualRate(Number(comm.interestRatePct));
            setIsLiveRate(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const safePropVal = Math.max(0, propVal || 0);
  const safeDownPct = Math.max(0, Math.min(100, downPct || 0));
  const safeTermYr = Math.max(1, termYr || 1);

  const monthlyRate = (annualRate / 100) / 12;
  const loan = safePropVal * (1 - safeDownPct / 100);
  const n = safeTermYr * 12;
  const monthly =
    monthlyRate > 0 && n > 0 && loan > 0
      ? (loan * 1_000_000 * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1)
      : 0;
  const totalInterest = Math.max(0, monthly * n - loan * 1_000_000);

  return (
    <div className="calculator">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.4rem', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className="h4" style={{ margin: 0 }}>Financing Scenario Estimator</h3>
        {isLiveRate && (
          <span style={{ fontSize: '10.5px', background: 'rgba(201,168,76,.15)', color: 'var(--forest)', border: '1px solid rgba(201,168,76,.3)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
            ● Live {annualRate}% p.a.
          </span>
        )}
      </div>
      <p style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginBottom: '1.4rem' }}>
        Slide controls or type figures directly to estimate repayment schedules.
      </p>

      {/* Property Value */}
      <div className="range-group" style={{ marginBottom: '1.4rem' }}>
        <div className="range-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)' }}>Property Value</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', fontSize: '1.15rem', fontWeight: 600 }}>₦</span>
            <input
              type="number"
              value={propVal === 0 ? '' : propVal}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                if (!isNaN(val)) setPropVal(val);
              }}
              onBlur={() => {
                if (propVal < 10) setPropVal(10);
                if (propVal > 5000) setPropVal(5000);
              }}
              min={10}
              max={5000}
              step={1}
              style={{
                width: '78px',
                padding: '2px 7px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--forest)',
                background: 'rgba(13,43,30,.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'right',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
              onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
              aria-label="Editable property value in millions"
            />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', fontSize: '1.15rem', fontWeight: 600 }}>M</span>
          </div>
        </div>
        <input 
          type="range" 
          id="prop-val" 
          min="10" 
          max="2000" 
          step="1"
          value={Math.min(2000, Math.max(10, propVal))} 
          onChange={(e) => setPropVal(Number(e.target.value))}
          aria-label="Property value in naira millions" 
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--forest)', height: '5px' }}
        />
      </div>

      {/* Down Payment */}
      <div className="range-group" style={{ marginBottom: '1.4rem' }}>
        <div className="range-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)' }}>Down Payment</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={downPct === 0 ? '' : downPct}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                if (!isNaN(val)) setDownPct(val);
              }}
              onBlur={() => {
                if (downPct < 5) setDownPct(5);
                if (downPct > 80) setDownPct(80);
              }}
              min={5}
              max={80}
              step={1}
              style={{
                width: '60px',
                padding: '2px 7px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--forest)',
                background: 'rgba(13,43,30,.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'right',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
              onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
              aria-label="Editable down payment percentage"
            />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', fontSize: '1.15rem', fontWeight: 600 }}>%</span>
          </div>
        </div>
        <input 
          type="range" 
          id="down-pct" 
          min="5" 
          max="80" 
          step="1"
          value={Math.min(80, Math.max(5, downPct))} 
          onChange={(e) => setDownPct(Number(e.target.value))}
          aria-label="Down payment percentage" 
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--forest)', height: '5px' }}
        />
      </div>

      {/* Loan Term */}
      <div className="range-group" style={{ marginBottom: '1.4rem' }}>
        <div className="range-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)' }}>Loan Term</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={termYr === 0 ? '' : termYr}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                if (!isNaN(val)) setTermYr(val);
              }}
              onBlur={() => {
                if (termYr < 1) setTermYr(1);
                if (termYr > 25) setTermYr(25);
              }}
              min={1}
              max={25}
              step={1}
              style={{
                width: '56px',
                padding: '2px 7px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--forest)',
                background: 'rgba(13,43,30,.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'right',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
              onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
              aria-label="Editable loan term in years"
            />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', fontSize: '1.05rem', fontWeight: 500 }}>
              {termYr === 1 ? 'year' : 'years'}
            </span>
          </div>
        </div>
        <input 
          type="range" 
          id="term-yr" 
          min="1" 
          max="25" 
          step="1"
          value={Math.min(25, Math.max(1, termYr))} 
          onChange={(e) => setTermYr(Number(e.target.value))}
          aria-label="Loan term in years" 
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--forest)', height: '5px' }}
        />
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', margin: '1.5rem 0' }} />

      <div className="calc-row">
        <span className="calc-label">Loan Amount (Indicative)</span>
        <span className="calc-val" id="loan-amt">₦{loan.toFixed(1)}M</span>
      </div>
      <div className="calc-row">
        <span className="calc-label">Est. Monthly Repayment</span>
        <span className="calc-val highlight" id="monthly-rep">
          ₦{(monthly / 1_000_000).toFixed(2)}M/mo
        </span>
      </div>
      <div className="calc-row">
        <span className="calc-label">Total Interest (Indicative)</span>
        <span className="calc-val" id="total-int">₦{(totalInterest / 1_000_000).toFixed(1)}M</span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
        This is an indicative estimate only. Actual rates (typically 18-28% p.a. for bridge
        financing in Nigeria) depend on lender, profile, and market conditions. Our advisory will
        clarify exact terms.
      </p>
    </div>
  );
}
