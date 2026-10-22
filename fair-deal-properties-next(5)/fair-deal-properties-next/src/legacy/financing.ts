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
  const pv=parseInt(document.getElementById('prop-val').value);
  const dp=parseInt(document.getElementById('down-pct').value)/100;
  const yr=parseInt(document.getElementById('term-yr').value);
  const loan=pv*(1-dp);
  const rate=0.22/12;
  const n=yr*12;
  const monthly=loan*1000000*rate*(Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1);
  const totalInt=(monthly*n)-(loan*1000000);
  document.getElementById('prop-val-label').textContent='₦'+pv+'M';
  document.getElementById('down-label').textContent=Math.round(dp*100)+'%';
  document.getElementById('term-label').textContent=yr+(yr===1?' year':' years');
  document.getElementById('loan-amt').textContent='₦'+loan.toFixed(0)+'M';
  document.getElementById('monthly-rep').textContent='₦'+(monthly/1000000).toFixed(1)+'M/mo';
  document.getElementById('total-int').textContent='₦'+(totalInt/1000000).toFixed(0)+'M';
}

export function attach(): void {
  const w = window as any;
  w.updateCalc = updateCalc;
}
