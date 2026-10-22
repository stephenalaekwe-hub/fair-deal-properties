'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ROUTES, PRIMARY_NAV, FIRM } from '@/lib/site';

export default function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand" aria-label={`${FIRM.legalName} - Home`}>
            <Image
              className="nav-logo-svg"
              src="/assets/logo-primary.png"
              alt={`${FIRM.legalName} - Real Estate, PropTech, Transaction Facilitation`}
              width={1100}
              height={306}
              priority
            />
          </Link>

          <div className="nav-links">
            {PRIMARY_NAV.map((key) => {
              const r = ROUTES[key];
              return (
                <Link
                  key={key}
                  href={r.path}
                  className={isActive(r.path) ? 'active' : undefined}
                  aria-current={isActive(r.path) ? 'page' : undefined}
                >
                  {r.label}
                </Link>
              );
            })}
          </div>

          <Link href="/contact" className="nav-cta">Book Consultation</Link>

          <button
            className="hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobileMenu"
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} close={() => setMobileOpen(false)} />
    </>
  );
}

const MOBILE_PRIMARY: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/platform', label: 'Platform' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/inspections', label: 'Inspections' },
  { href: '/technology', label: 'Technology' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/diaspora', label: 'Diaspora Advisory' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/insights', label: 'Insights' },
  { href: '/faq', label: 'FAQ' },
];

const MOBILE_SECONDARY: { href: string; label: string }[] = [
  { href: '/developers', label: 'For Developers & Partners' },
  { href: '/financing', label: 'Financing Advisory' },
  { href: '/contact', label: 'Contact Us' },
];

function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  return (
    <div className={open ? 'mobile-menu open' : 'mobile-menu'} id="mobileMenu">
      <button className="mobile-menu-close" onClick={close} aria-label="Close menu" type="button">
        ✕
      </button>

      <Link
        href="/"
        onClick={close}
        style={{ display: 'block', marginTop: '1rem', textDecoration: 'none' }}
      >
        <Image
          src="/assets/logo-primary.png"
          alt={FIRM.legalName}
          width={1100}
          height={306}
          style={{ width: '100%', maxWidth: '300px', height: 'auto', display: 'block' }}
        />
      </Link>

      <nav className="mobile-menu-links">
        {MOBILE_PRIMARY.map((l) => (
          <Link key={l.href} href={l.href} className="mobile-menu-link" onClick={close}>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mobile-menu-sub">
        {MOBILE_SECONDARY.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>{l.label}</Link>
        ))}
      </div>

      <div className="mobile-menu-bottom">
        <Link
          href="/contact"
          onClick={close}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Book a Confidential Consultation
        </Link>
        <div className="mobile-location" style={{ marginTop: '1.5rem' }}>
          Abuja · Lagos · Port Harcourt · Serving the Diaspora
        </div>
      </div>
    </div>
  );
}
