'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    } else if (!loading && user?.role === 'AGENT' && !isLoginPage) {
      router.push('/agent');
    }
  }, [user, loading, isLoginPage, router]);

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

  const isAgent = user?.role === 'AGENT';

  const navItems = isAgent
    ? [
        { label: 'My Overview', path: '/admin', icon: '📊' },
        { label: 'Property Portfolio', path: '/admin/listings', icon: '🏢' },
        { label: 'Field Inspections', path: '/admin/inspections', icon: '🔍' },
        { label: 'Client Leads & Enquiries', path: '/admin/submissions', icon: '📬' },
      ]
    : [
        { label: 'Overview', path: '/admin', icon: '📊' },
        { label: 'Property Portfolio', path: '/admin/listings', icon: '🏢' },
        { label: 'Inspection Hub', path: '/admin/inspections', icon: '🔍' },
        { label: 'Client Inquiries & DSR', path: '/admin/submissions', icon: '📬' },
        { label: 'Field Agents', path: '/admin/agents', icon: '👥' },
        { label: 'Rates & Scraper', path: '/admin/rates', icon: '⚡' },
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
            return (
              <Link
                key={item.path}
                href={item.path}
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
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
