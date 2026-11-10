'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import CurrencyToggle from '@/components/CurrencyToggle';
import { fetchApi } from '@/lib/api';

interface AgentLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: 'overview', label: 'My Overview', path: '/agent', icon: '📊' },
  { key: 'consultations', label: 'Book a Consultation', path: '/agent/consultations', icon: '📅' },
  { key: 'enquiries', label: 'Property Enquiries', path: '/agent/enquiries', icon: '💬' },
  { key: 'inspections', label: 'Field Inspections', path: '/agent/inspections', icon: '🔍' },
  { key: 'listings', label: 'Property Portfolio', path: '/agent/listings', icon: '🏢' },
];

export default function AgentLayout({ children }: AgentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState<{
    consultations?: number;
    enquiries?: number;
    inspections?: number;
    listings?: number;
  }>({});

  const isLoginPage = pathname === '/agent/login';
  const userKey = user?.id || user?.email || 'agent';

  const activeSectionKey = (() => {
    if (pathname.startsWith('/agent/consultations')) return 'consultations';
    if (pathname.startsWith('/agent/enquiries')) return 'enquiries';
    if (pathname.startsWith('/agent/inspections')) return 'inspections';
    if (pathname.startsWith('/agent/listings')) return 'listings';
    return '';
  })();

  const markSectionSeen = (sectionKey: string) => {
    if (!sectionKey || sectionKey === 'overview') return;
    setNotificationCounts((prev) => (prev[sectionKey as keyof typeof prev] ? { ...prev, [sectionKey]: 0 } : prev));
    fetchApi('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify({ section: sectionKey, userKey, isAgent: true }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/agent/login');
    }
  }, [user, loading, isLoginPage, router]);

  useEffect(() => {
    if (!user || !activeSectionKey) return;
    markSectionSeen(activeSectionKey);
  }, [user, activeSectionKey]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      try {
        const qs = new URLSearchParams({
          agentId: user.id || '',
          userKey,
          isAgent: 'true',
          ...(activeSectionKey ? { activeSection: activeSectionKey } : {}),
        });
        const res = await fetchApi<any>(`/admin/notifications?${qs.toString()}`);
        if (res && res.ok && res.data) {
          setNotificationCounts({
            ...res.data,
            ...(activeSectionKey ? { [activeSectionKey]: 0 } : {}),
          });
        }
      } catch (err) {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 20000);
    return () => clearInterval(interval);
  }, [user, userKey, activeSectionKey]);

  const handleLogout = async () => {
    await logout();
    router.push('/agent/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--forest)', fontWeight: 600 }}>Loading Fair Deal Field Agent Portal...</p>
      </div>
    );
  }

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
            FIELD AGENT CONSOLE
          </div>
        </div>

        <nav className="dash-sidebar-nav" style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {NAV_ITEMS.map((item) => {
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
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name || 'Field Officer'}</div>
          <div className="dash-role-line" style={{ fontSize: '11px', color: 'var(--gold-light)' }}>Role: {user?.role || 'AGENT'}</div>
          {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? (
            <Link
              href="/admin"
              style={{
                display: 'block',
                marginTop: '8px',
                fontSize: '11px',
                color: '#93c5fd',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Switch to Admin Console ↗
            </Link>
          ) : null}
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
            Fair Deal Properties Ltd — Field Officer Portal ({user?.name})
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
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '9999px',
              }}
            >
              Agent Session Active
            </span>
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
          {NAV_ITEMS.map((item) => (
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
