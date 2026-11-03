/* eslint-disable */
// @ts-nocheck
/**
 * Original page behaviour, carried over unchanged from the published single-document
 * build so that this page renders and behaves exactly as it does there.
 *
 * Do not rewrite these in idiomatic React. They are here precisely because rewriting
 * them is what caused this page to drift from the published design. The only
 * modifications permitted are the submit handlers, which post to the API routes.
 */

function updateCalc(){
  const pvEl = document.getElementById('prop-val') as HTMLInputElement | null;
  const dpEl = document.getElementById('down-pct') as HTMLInputElement | null;
  const yrEl = document.getElementById('term-yr') as HTMLInputElement | null;
  if (!pvEl || !dpEl || !yrEl) return;
  const pv=parseInt(pvEl.value);
  const dp=parseInt(dpEl.value)/100;
  const yr=parseInt(yrEl.value);
  const loan=pv*(1-dp);
  const rate=0.22/12;
  const n=yr*12;
  const monthly=loan*1000000*rate*(Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1);
  const totalInt=(monthly*n)-(loan*1000000);
  
  const w = window as any;
  const fmt = w.__fdpFormatPrice;
  const pvl = document.getElementById('prop-val-label');
  const dpl = document.getElementById('down-label');
  const trl = document.getElementById('term-label');
  const lna = document.getElementById('loan-amt');
  const mnr = document.getElementById('monthly-rep');
  const tti = document.getElementById('total-int');

  if (pvl) pvl.textContent = typeof fmt === 'function' ? fmt(pv) : '₦'+pv+'M';
  if (dpl) dpl.textContent = Math.round(dp*100)+'%';
  if (trl) trl.textContent = yr+(yr===1?' year':' years');
  if (lna) lna.textContent = typeof fmt === 'function' ? fmt(loan) : '₦'+loan.toFixed(0)+'M';
  if (mnr) mnr.textContent = (typeof fmt === 'function' ? fmt(monthly/1000000) : '₦'+(monthly/1000000).toFixed(1)+'M') + '/mo';
  if (tti) tti.textContent = typeof fmt === 'function' ? fmt(totalInt/1000000) : '₦'+(totalInt/1000000).toFixed(0)+'M';
}

export function attach(): void {
  const w = window as any;
  w.updateCalc = updateCalc;
  if (typeof window !== 'undefined') {
    window.addEventListener('fdp:currency-change', () => {
      if (document.getElementById('prop-val')) updateCalc();
    });
  }
}
