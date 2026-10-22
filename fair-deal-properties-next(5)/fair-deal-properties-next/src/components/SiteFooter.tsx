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
