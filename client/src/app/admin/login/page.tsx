'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('admin@fdealproperties.com');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok && res.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('fdp_token', res.data.token);
        }
        await refreshUser();
        if (res.data.user?.role === 'AGENT') {
          router.push('/agent');
        } else {
          router.push('/admin');
        }
      } else {
        setError(res.error || 'Failed to authenticate. Please check your credentials.');
      }
    } catch {
      setError('Connection failed. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d2b1e 0%, #163828 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        <div style={{ background: '#0d2b1e', padding: '32px', textAlign: 'center' }}>
          <Image
            src="/assets/logo-reversed.png"
            alt="Fair Deal Properties"
            width={220}
            height={60}
            style={{ objectFit: 'contain', margin: '0 auto' }}
            priority
          />
          <h2 style={{ color: '#ffffff', fontSize: '18px', marginTop: '12px', fontWeight: 600 }}>
            Internal Management Portal
          </h2>
          <p style={{ color: 'var(--gold-light)', fontSize: '12px', marginTop: '4px' }}>
            NDPA 2023 · Authorised Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #f87171',
                color: '#991b1b',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--forest)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>

          <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px', color: '#64748b' }}>
            <div><strong>Default Admin:</strong> admin@fdealproperties.com</div>
            <div><strong>Password:</strong> Admin@123456</div>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
            Are you a Field Agent or Surveyor?{' '}
            <a href="/agent/login" style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>
              Field Agent Portal →
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
