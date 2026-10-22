'use client';

import { useState } from 'react';

/**
 * Financing Scenario Estimator.
 *
 * Markup, class names and copy are carried over unchanged from the published design, so
 * the page renders exactly as before. The only change is that the three values are
 * driven by React state rather than by direct DOM writes - the arithmetic is identical.
 *
 * The richer route-by-route comparison on total cost of credit lives at
 * POST /api/mortgage/compare, and the component that renders it is retained at
 * src/components/MortgageComparator.tsx for use on a future page. It is deliberately
 * not on this one, because this estimator is the published design.
 */
const MONTHLY_RATE = 0.22 / 12;   // 22% p.a., the midpoint of the band quoted below

export default function FinancingCalculator() {
  const [propVal, setPropVal] = useState(150);   // ₦ millions
  const [downPct, setDownPct] = useState(30);    // per cent
  const [termYr, setTermYr] = useState(5);       // years

  const loan = propVal * (1 - downPct / 100);
  const n = termYr * 12;
  const monthly =
    (loan * 1_000_000 * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, n)) /
    (Math.pow(1 + MONTHLY_RATE, n) - 1);
  const totalInterest = monthly * n - loan * 1_000_000;

  return (
    <div className="calculator">
      <h3 className="h4 mb-4">Financing Scenario Estimator</h3>

      <div className="range-group">
        <div className="range-label">
          <span>Property Value</span>
          <span id="prop-val-label">₦{propVal}M</span>
        </div>
        <input type="range" id="prop-val" min="50" max="2000" step="50"
               value={propVal} onChange={(e) => setPropVal(Number(e.target.value))}
               aria-label="Property value in naira millions" />
      </div>

      <div className="range-group">
        <div className="range-label">
          <span>Down Payment</span>
          <span id="down-label">{downPct}%</span>
        </div>
        <input type="range" id="down-pct" min="20" max="60" step="5"
               value={downPct} onChange={(e) => setDownPct(Number(e.target.value))}
               aria-label="Down payment percentage" />
      </div>

      <div className="range-group">
        <div className="range-label">
          <span>Loan Term</span>
          <span id="term-label">{termYr} {termYr === 1 ? 'year' : 'years'}</span>
        </div>
        <input type="range" id="term-yr" min="1" max="10" step="1"
               value={termYr} onChange={(e) => setTermYr(Number(e.target.value))}
               aria-label="Loan term in years" />
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', margin: '1.5rem 0' }} />

      <div className="calc-row">
        <span className="calc-label">Loan Amount (Indicative)</span>
        <span className="calc-val" id="loan-amt">₦{loan.toFixed(0)}M</span>
      </div>
      <div className="calc-row">
        <span className="calc-label">Est. Monthly Repayment</span>
        <span className="calc-val highlight" id="monthly-rep">
          ₦{(monthly / 1_000_000).toFixed(1)}M/mo
        </span>
      </div>
      <div className="calc-row">
        <span className="calc-label">Total Interest (Indicative)</span>
        <span className="calc-val" id="total-int">₦{(totalInterest / 1_000_000).toFixed(0)}M</span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
        This is an indicative estimate only. Actual rates (typically 18-28% p.a. for bridge
        financing in Nigeria) depend on lender, profile, and market conditions. Our advisory will
        clarify exact terms.
      </p>
    </div>
  );
}
