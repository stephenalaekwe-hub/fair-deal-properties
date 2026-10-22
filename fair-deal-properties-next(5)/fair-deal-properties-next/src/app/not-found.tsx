import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="eyebrow-light">Error 404</div>
            <h1>That page does not <em>exist</em>.</h1>
            <p className="lead">
              The address you followed is not part of this site. The links below will take you where
              you were most likely headed.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/" className="btn btn-primary">Home</Link>
            <Link href="/marketplace" className="btn btn-outline">Verified Marketplace</Link>
            <Link href="/inspections" className="btn btn-outline">Inspection Hub</Link>
            <Link href="/financing" className="btn btn-outline">Financing Advisory</Link>
            <Link href="/contact" className="btn btn-gold">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
