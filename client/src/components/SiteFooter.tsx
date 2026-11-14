import Link from 'next/link';
import Image from 'next/image';
import { FIRM } from '@/lib/site';
import CookiePreferencesButton from './CookiePreferencesButton';

const PLATFORM_LINKS = [
  { href: '/platform', label: 'The Platform' },
  { href: '/inspections', label: 'Inspection Hub' },
  { href: '/technology', label: 'Technology & Security' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Our Services' },
  { href: '/marketplace', label: 'Opportunities' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/insights', label: 'Insights' },
];

const CLIENTELE_LINKS = [
  { href: '/diaspora', label: 'Diaspora Advisory' },
  { href: '/developers', label: 'Developers & Partners' },
  { href: '/financing', label: 'Financing Advisory' },
  { href: '/data-rights', label: 'Data Protection Centre' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy-notice', label: 'Privacy Notice' },
  { href: '/cookie-notice', label: 'Cookie Notice' },
  { href: '/data-rights', label: 'Your Data Rights' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Image
              src="/assets/logo-reversed.png"
              alt={FIRM.legalName}
              width={1100}
              height={306}
              style={{ width: '100%', maxWidth: '280px', height: 'auto',
                       display: 'block', marginBottom: '1.5rem' }}
            />
            <p className="footer-bio">
              An integrated real estate, PropTech and transaction facilitation company.
              Verified opportunities. Digital platforms. Trusted advisory.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem' }}>
              <a
                href={FIRM.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook ${FIRM.social.facebook.handle}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 11px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,168,76,0.28)',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--gold)' }}>
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                <span>{FIRM.social.facebook.handle}</span>
              </a>
              <a
                href={FIRM.social.x.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`X ${FIRM.social.x.handle}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 11px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,168,76,0.28)',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--gold)' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>{FIRM.social.x.handle}</span>
              </a>
              <a
                href={FIRM.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${FIRM.social.instagram.handle}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 11px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,168,76,0.28)',
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: 'var(--gold)' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>{FIRM.social.instagram.handle}</span>
              </a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Clientele</div>
            <ul className="footer-links">
              {CLIENTELE_LINKS.map((l) => (
                <li key={l.href + l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              No. 4 Ekeh A. Yesufu Close,<br />Utako, Abuja, FCT, Nigeria
            </div>
            <div className="footer-contact-item">
              <a href={`tel:${FIRM.telephone}`}>{FIRM.telephoneDisplay}</a>
            </div>
            <div className="footer-contact-item">
              <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
            </div>
            <Link href="/contact" className="btn btn-gold" style={{ marginTop: '1.25rem' }}>
              Book a Consultation
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} Fair Deal Properties. All rights reserved. Abuja, Nigeria.
          </div>
          <div className="footer-legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href + l.label} href={l.href}>{l.label}</Link>
            ))}
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
