'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function AdminToolbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Only show toolbar if user is authenticated and NOT currently in the /admin or /agent section
  if (!user || pathname?.startsWith('/admin') || pathname?.startsWith('/agent')) {
    return null;
  }

  const handleSignOut = async () => {
    await logout();
    router.refresh();
  };

  const isAgent = user.role === 'AGENT';

  // Determine contextual action based on current public page
  let contextualLink = { href: isAgent ? '/agent' : '/admin', label: isAgent ? 'Agent Console' : 'Admin Console' };
  if (pathname.includes('/marketplace')) {
    contextualLink = { href: isAgent ? '/agent/listings' : '/admin/listings', label: isAgent ? 'View Portfolio ↗' : 'Manage Listings ↗' };
  } else if (pathname.includes('/inspections')) {
    contextualLink = { href: isAgent ? '/agent/inspections' : '/admin/inspections', label: isAgent ? 'My Inspections ↗' : 'Manage Pipeline ↗' };
  } else if (pathname.includes('/financing')) {
    contextualLink = isAgent 
      ? { href: '/agent', label: 'My Overview ↗' } 
      : { href: '/admin/rates', label: 'Manage Live Rates ↗' };
  } else if (pathname.includes('/contact')) {
    contextualLink = { href: isAgent ? '/agent/submissions' : '/admin/submissions', label: isAgent ? 'My Assigned Leads ↗' : 'View Leads ↗' };
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #0d2b1e 0%, #163828 100%)',
        color: '#ffffff',
        borderBottom: '2px solid var(--gold)',
        padding: '0 24px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      }}
    >
      {/* Left: Identity & Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px' }}>{isAgent ? '🛡️' : '👑'}</span>
        <span style={{ fontWeight: 600, color: 'var(--gold-light)', letterSpacing: '0.04em' }}>
          {isAgent ? 'FIELD AGENT PREVIEW:' : 'STAFF PREVIEW MODE:'}
        </span>
        <span style={{ color: '#ffffff' }}>{user.name}</span>
        <span
          style={{
            background: 'rgba(201, 168, 76, 0.2)',
            color: 'var(--gold-light)',
            border: '1px solid var(--gold)',
            padding: '1px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 700,
          }}
        >
          {user.role}
        </span>
      </div>

      {/* Right: Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {pathname !== '/' && (
          <Link
            href={contextualLink.href}
            style={{
              color: '#cbd5e1',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '3px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            {contextualLink.label}
          </Link>
        )}

        {/* The Master Toggle Back Button */}
        <Link
          href={isAgent ? '/agent' : '/admin'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--gold)',
            color: '#0d2b1e',
            padding: '5px 12px',
            borderRadius: '4px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '11px',
            letterSpacing: '0.02em',
            transition: 'transform 0.15s ease',
          }}
        >
          <span>⬅</span>
          <span>{isAgent ? 'Return to Agent Console' : 'Return to Admin Console'}</span>
        </Link>

        {/* Quick Sign Out */}
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            color: '#f87171',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
