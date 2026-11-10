'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import CurrencyToggle from '@/components/CurrencyToggle';
import { fetchApi } from '@/lib/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';
  const isAgent = user?.role === 'AGENT';
  const userKey = user?.id || user?.email || (isAgent ? 'agent' : 'admin');

  const activeSectionKey = (() => {
    if (pathname.startsWith('/admin/consultations')) return 'consultations';
    if (pathname.startsWith('/admin/enquiries')) return 'enquiries';
    if (pathname.startsWith('/admin/inspections')) return 'inspections';
    if (pathname.startsWith('/admin/listings')) return 'listings';
    if (pathname.startsWith('/admin/agents')) return 'agents';
    if (pathname.startsWith('/admin/rates')) return 'rates';
    if (pathname.startsWith('/admin/compliance')) return 'compliance';
    return '';
  })();

  const [notificationCounts, setNotificationCounts] = useState<{
    consultations?: number;
    enquiries?: number;
    inspections?: number;
    compliance?: number;
    listings?: number;
    agents?: number;
    rates?: number;
  }>({});

  const markSectionSeen = (sectionKey: string) => {
    if (!sectionKey || sectionKey === 'overview') return;
    setNotificationCounts((prev) => (prev[sectionKey as keyof typeof prev] ? { ...prev, [sectionKey]: 0 } : prev));
    fetchApi('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({ section: sectionKey, userKey, isAgent }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    } else if (!loading && user?.role === 'AGENT' && !isLoginPage) {
      if (pathname === '/admin/consultations') {
        router.push('/agent/consultations');
      } else if (pathname === '/admin/inspections') {
        router.push('/agent/inspections');
      } else if (pathname === '/admin/listings') {
        router.push('/agent/listings');
      } else if (pathname === '/admin/submissions') {
        router.push('/agent/submissions');
      } else {
        router.push('/agent');
      }
    }
  }, [user, loading, isLoginPage, router, pathname]);

  useEffect(() => {
    if (!user || !activeSectionKey) return;
    markSectionSeen(activeSectionKey);
  }, [user, activeSectionKey]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const qs = new URLSearchParams({
          isAgent: String(isAgent),
          userKey,
          ...(activeSectionKey ? { activeSection: activeSectionKey } : {}),
        });
        const res = await fetchApi<any>(`/admin/notifications?${qs.toString()}`);
        if (res && res.ok && res.data) {
          setNotificationCounts((prev) => ({
            ...res.data,
            ...(activeSectionKey ? { [activeSectionKey]: 0 } : {}),
          }));
        }
      } catch (err) {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 20000);
    return () => clearInterval(interval);
  }, [user, isAgent, userKey, activeSectionKey]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--forest)', fontWeight: 600 }}>Loading Fair Deal Management Portal...</p>
      </div>
    );
  }

  const navItems = isAgent
    ? [
        { key: 'overview', label: 'My Overview', path: '/admin', icon: '📊' },
        { key: 'consultations', label: 'Book a Consultation', path: '/admin/consultations', icon: '📅' },
        { key: 'enquiries', label: 'Property Enquiries', path: '/admin/enquiries', icon: '💬' },
        { key: 'inspections', label: 'Physical Inspections', path: '/admin/inspections', icon: '🔍' },
        { key: 'listings', label: 'Property Portfolio', path: '/admin/listings', icon: '🏢' },
      ]
    : [
        { key: 'overview', label: 'Overview', path: '/admin', icon: '📊' },
        { key: 'consultations', label: 'Book a Consultation', path: '/admin/consultations', icon: '📅' },
        { key: 'enquiries', label: 'Property Enquiries', path: '/admin/enquiries', icon: '💬' },
        { key: 'inspections', label: 'Physical Inspections', path: '/admin/inspections', icon: '🔍' },
        { key: 'listings', label: 'Property Portfolio', path: '/admin/listings', icon: '🏢' },
        { key: 'agents', label: 'Field Agents', path: '/admin/agents', icon: '👥' },
        { key: 'rates', label: 'Rates & Scraper', path: '/admin/rates', icon: '⚡' },
        { key: 'compliance', label: 'Data Rights & Compliance', path: '/admin/compliance', icon: '🛡️' },
      ];

  return (
    <div className="dash-shell" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: 'var(--ink)' }}>
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div className="dash-overlay open" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--forest)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="dash-sidebar-brand" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <Image
              src="/assets/logo-reversed.png"
              alt="Fair Deal Properties"
              width={180}
              height={50}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
          <div className="dash-sidebar-label" style={{ fontSize: '11px', color: 'var(--gold-light)', letterSpacing: '0.08em', marginTop: '6px', fontWeight: 600 }}>
            {isAgent ? 'FIELD AGENT CONSOLE' : 'ADMIN MANAGEMENT CONSOLE'}
          </div>
        </div>

        <nav className="dash-sidebar-nav" style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const active = pathname === item.path;
            const count = active ? 0 : (notificationCounts[item.key as keyof typeof notificationCounts] || 0);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => {
                  markSectionSeen(item.key);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? 'var(--forest-light)' : 'transparent',
                  borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {count > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '18px',
                        height: '18px',
                        padding: '0 5px',
                        borderRadius: '10px',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 700,
                        boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.4)',
                        marginLeft: '6px',
                      }}
                      title={`${count} new notification${count === 1 ? '' : 's'}`}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer with current user */}
        <div className="dash-sidebar-foot" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name || 'Administrator'}</div>
          <div className="dash-role-line" style={{ fontSize: '11px', color: 'var(--gold-light)' }}>Role: {user?.role || 'ADMIN'}</div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '8px',
              fontSize: '12px',
              background: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="dash-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          className="dash-header"
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
        >
          {/* Hamburger — visible on mobile only */}
          <button
            className="dash-mobile-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <span /><span /><span />
          </button>

          <div className="dash-header-title" style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '16px' }}>
            {isAgent
              ? `Fair Deal Properties Ltd — Field Officer Portal (${user?.name})`
              : 'Fair Deal Properties Ltd — PropTech & Compliance Administration'}
          </div>
          <div className="dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CurrencyToggle variant="dropdown" />
            <Link
              href="/"
              target="_blank"
              className="dash-view-site-btn"
              style={{
                fontSize: '12px',
                color: 'var(--forest)',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid var(--border)',
                padding: '6px 14px',
                borderRadius: '4px',
              }}
            >
              View Public Website ↗
            </Link>
          </div>
        </header>

        {/* Page Inner Container */}
        <div className="dash-content" style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

      {/* ── Bottom navigation bar — mobile only ── */}
      <nav className="dash-bottom-nav" aria-label="Mobile navigation">
        <div className="dash-bottom-nav-inner">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`dash-bottom-nav-link${pathname === item.path ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="bnav-icon">{item.icon}</span>
              <span className="bnav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
