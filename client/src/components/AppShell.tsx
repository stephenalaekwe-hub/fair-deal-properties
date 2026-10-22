'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';
import ConsentReopen from '@/components/ConsentReopen';
import AdminToolbar from '@/components/AdminToolbar';
import PageTutorial from '@/components/PageTutorial';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reset scroll lock on navigation so pages never freeze when navigating away from modals
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      const modal = document.getElementById('opp-modal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
  }, [pathname]);

  const isBackoffice = pathname?.startsWith('/admin') || pathname?.startsWith('/agent');

  if (isBackoffice) {
    return <>{children}</>;
  }

  return (
    <>
      <AdminToolbar />
      <a href="#main" className="skip-link">Skip to main content</a>
      <SiteNav />
      <main id="main" className="page active">{children}</main>
      <SiteFooter />
      <CookieConsent />
      <ConsentReopen />
      <PageTutorial />
    </>
  );
}
