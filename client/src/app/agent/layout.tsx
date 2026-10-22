'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface AgentLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: 'My Overview', path: '/agent', icon: '📊' },
  { label: 'Property Portfolio', path: '/agent/listings', icon: '🏢' },
  { label: 'Field Inspections', path: '/agent/inspections', icon: '🔍' },
  { label: 'Client Leads & Enquiries', path: '/agent/submissions', icon: '📬' },
];

export default function AgentLayout({ children }: AgentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isLoginPage = pathname === '/agent/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/agent/login');
    }
  }, [user, loading, isLoginPage, router]);

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: 'var(--ink)' }}>
      {/* ── Sidebar ── */}
      <aside
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
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
          <div style={{ fontSize: '11px', color: 'var(--gold-light)', letterSpacing: '0.08em', marginTop: '6px', fontWeight: 600 }}>
            FIELD AGENT CONSOLE
          </div>
        </div>

        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {NAV_ITEMS.map((item) => {
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
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name || 'Field Officer'}</div>
          <div style={{ fontSize: '11px', color: 'var(--gold-light)' }}>Role: {user?.role || 'AGENT'}</div>
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
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
          <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '16px' }}>
            Fair Deal Properties Ltd — Field Officer Portal ({user?.name})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/"
              target="_blank"
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
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
