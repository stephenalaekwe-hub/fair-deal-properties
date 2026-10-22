'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Loads the carried-over widget behaviour for the three pages whose published markup is
 * used unchanged: Marketplace, Inspections and Financing.
 *
 * Why this exists rather than React components for those widgets: rewriting them is
 * what made those pages drift from the published design. The markup is the design and
 * the script is what the markup expects, so both are carried over and React provides
 * the routing, the server rendering and the API layer around them.
 *
 * It does NOT carry over routing, the mobile menu or cookie consent. Next.js owns the
 * first two, and the consent notice in this build is the GAID-corrected one.
 *
 * The script is served from /public, so it stays out of the application bundle and the
 * page is fully rendered before it arrives - a crawler sees the content either way.
 */
/* The carried-over globals are declared once, in types/legacy.d.ts. */

export default function LegacyWidgets({ init }: { init?: 'inspect' | 'marketplace' | null }) {
  useEffect(() => {
    function boot() {
      if (init === 'inspect' && typeof window.vwInit === 'function') window.vwInit();
      if (init === 'marketplace' && typeof window.updateCount === 'function') {
        window.updateCount(document.querySelectorAll('.opp-card').length);
      }
    }
    if (window.__fdpWidgetsReady) { boot(); return; }
    document.addEventListener('fdp:widgets-ready', boot, { once: true });
    return () => document.removeEventListener('fdp:widgets-ready', boot);
  }, [init]);

  return <Script src="/legacy/widgets.js" strategy="afterInteractive" />;
}
