'use client';

import { useMemo, useState } from 'react';
import { compareRoutes } from '@/data/financing';

const naira = (n: number) =>
  '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });

const naira2 = (n: number) =>
  n >= 1_000_000 ? '₦' + (n / 1_000_000).toFixed(1) + 'M' : naira(n);

/**
 * Financing comparison.
 *
 * Computed client-side from the published scheme terms in src/data/financing.ts, with
 * the same calculation available at POST /api/mortgage/compare for any integration
 * that needs it server-side.
 *
 * Where a route publishes no rate, the monetary columns show "Quoted on application"
 * rather than a figure. An invented rate in a client comparison is a misrepresentation,
 * not a convenience.
 */
export default function MortgageComparator() {
  const [valueM, setValueM] = useState(80);      // ₦ millions
  const [equityPct, setEquityPct] = useState(20);
  const [termYears, setTermYears] = useState(20);
  const [isDiaspora, setIsDiaspora] = useState(false);
  const [isNhf, setIsNhf] = useState(false);

  const rows = useMemo(
    () => compareRoutes({
      propertyValueNGN: valueM * 1_000_000,
      equityContributionPct: equityPct,
      termYears,
      isDiaspora,
      isNhfContributor: isNhf,
    }),
    [valueM, equityPct, termYears, isDiaspora, isNhf],
  );

  const cheapest = rows
    .filter((r) => r.eligible && r.totalRepayableNGN != null)
    .sort((a, b) => a.totalRepayableNGN! - b.totalRepayableNGN!)[0];

  return (
    <div className="calc-shell">
      <div className="calc-controls">
        <div className="calc-field">
          <label htmlFor="prop-val">
            Property value <strong>₦{valueM}M</strong>
          </label>
          <input id="prop-val" type="range" min={5} max={1000} step={5}
                 value={valueM} onChange={(e) => setValueM(Number(e.target.value))} />
        </div>

        <div className="calc-field">
          <label htmlFor="down-pct">
            Equity contribution <strong>{equityPct}%</strong>
          </label>
          <input id="down-pct" type="range" min={0} max={60} step={1}
                 value={equityPct} onChange={(e) => setEquityPct(Number(e.target.value))} />
        </div>

        <div className="calc-field">
          <label htmlFor="term-yr">
            Term <strong>{termYears} {termYears === 1 ? 'year' : 'years'}</strong>
          </label>
          <input id="term-yr" type="range" min={1} max={30} step={1}
                 value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} />
        </div>

        <div className="calc-checks">
          <label>
            <input type="checkbox" checked={isNhf} onChange={(e) => setIsNhf(e.target.checked)} />
            <span>I contribute to the National Housing Fund</span>
          </label>
          <label>
            <input type="checkbox" checked={isDiaspora}
                   onChange={(e) => setIsDiaspora(e.target.checked)} />
            <span>I am resident outside Nigeria</span>
          </label>
        </div>
      </div>

      <div className="calc-table-wrap">
        <table className="calc-table">
          <caption className="sr-only">
            Financing routes compared on total cost of credit
          </caption>
          <thead>
            <tr>
              <th scope="col">Route</th>
              <th scope="col">Rate</th>
              <th scope="col">Equity required</th>
              <th scope="col">Monthly</th>
              <th scope="col">Total repayable</th>
              <th scope="col">Total cost of credit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.route.id}
                  className={!r.eligible ? 'calc-row-ineligible'
                    : cheapest?.route.id === r.route.id ? 'calc-row-best' : undefined}>
                <th scope="row">
                  <div className="calc-route-n">{r.route.name}</div>
                  <div className="calc-route-i">{r.route.institution}</div>
                  {cheapest?.route.id === r.route.id && (
                    <div className="calc-route-best">
                      Lowest total cost of the routes you currently qualify for
                    </div>
                  )}
                  {!r.eligible && r.ineligibleReason && (
                    <div className="calc-route-x">
                      Not available to you: {r.ineligibleReason} The figures are shown so you can see
                      what this route would cost if you became eligible.
                    </div>
                  )}
                </th>
                <td>{r.route.interestRatePct != null
                  ? `${r.route.interestRatePct}%`
                  : <span className="calc-na">On application</span>}</td>
                <td>{naira2(r.equityRequiredNGN)}</td>
                <td>{r.monthlyRepaymentNGN != null
                  ? naira2(r.monthlyRepaymentNGN)
                  : <span className="calc-na">—</span>}</td>
                <td>{r.totalRepayableNGN != null
                  ? naira2(r.totalRepayableNGN)
                  : <span className="calc-na">—</span>}</td>
                <td>{r.totalInterestNGN != null
                  ? naira2(r.totalInterestNGN)
                  : <span className="calc-na">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="calc-notes">
        <p className="body-sm">
          <strong>Total cost of credit is the correct basis of comparison.</strong> The lowest
          headline rate is frequently not the lowest total cost once tenor, equity requirement and
          fees are taken into account. A thirty-year facility at 6% costs more in total than a
          twenty-year facility at 9.75% on some property values, and less on others - which is why
          this is computed rather than assumed.
        </p>
        <p className="body-sm">
          Figures are indicative and computed from published scheme terms. They are not an offer, a
          pre-approval, or a guarantee of allocation. Schemes revise terms without notice. Obtain a
          written offer letter, including all fees, before relying on any figure shown here.
        </p>
        <p className="body-sm">
          Fair Deal Properties does not lend and does not receive a commission that varies by route.
          We are paid the same whichever of these you choose.
        </p>
      </div>
    </div>
  );
}
