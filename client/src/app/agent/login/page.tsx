'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function AgentLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('emeka.agent@fdealproperties.com');
  const [password, setPassword] = useState('Agent@123456');
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
        router.push('/agent');
      } else {
        setError(res.error || 'Failed to authenticate. Please check your credentials.');
      }
    } catch {
      setError('Connection refused. Please ensure the Express backend is running on port 5000.');
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'rgba(201,168,76,0.15)', border: '1px solid var(--gold)', padding: '3px 10px', borderRadius: '4px' }}>
            <span style={{ fontSize: '13px' }}>🛡️</span>
            <span style={{ color: 'var(--gold-light)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
              FIELD AGENT CONSOLE
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '8px' }}>
            Authorized Field Officers, Surveyors & Valuers
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
            <label
              htmlFor="agentEmail"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              Field Agent Email
            </label>
            <input
              id="agentEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. emeka.agent@fdealproperties.com"
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
            <label
              htmlFor="agentPassword"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}
            >
              Account Password
            </label>
            <input
              id="agentPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
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
            {loading ? 'Authenticating Officer...' : 'Sign In as Field Agent'}
          </button>

          <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px', color: '#64748b' }}>
            <div><strong>Demo Field Officer 1:</strong> emeka.agent@fdealproperties.com</div>
            <div><strong>Demo Field Officer 2:</strong> aisha.agent@fdealproperties.com</div>
            <div><strong>Password:</strong> Agent@123456</div>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
            Are you a Super Admin or Platform Manager?{' '}
            <Link href="/admin/login" style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>
              Admin Console Login →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
